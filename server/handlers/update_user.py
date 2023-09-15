from flask import request
from cloudinary import uploader
import re
from models.User import User

def update_user():
    request_json = request.get_json()
    new_user_data = request_json['newData']
    new_img = request_json.get('newImg', None)
    authorized_user = request.authorized_user

    # check if the new username is already present in the database
    user_with_username = User.objects(username=new_user_data['username']).first()

    # if the username already belongs to the currently logged-in user (that is - they didn't change the username), dont send an error. Otherwise, send an error
    if user_with_username and (str(user_with_username.id) != authorized_user['_id']):
        return 'The new username you picked is already taken', 400

    # This will be the URL of the image the user uploaded. If nothing is uploaded, this will be empty.
    new_img_url = None

    # if user uploaded an image
    if new_img:
        # if the user already has a profile image, delete it
        if new_user_data.get('img', None):
            # extract the public ID from the image URL using a regular expression
            public_id = re.search(r'/([^/]+)\.[a-zA-Z0-9]+$', new_user_data['img']).group(1)

            # delete the image from Cloudinary
            uploader.destroy(public_id)

        # upload the new image to Cloudinary
        response = uploader.upload(new_img)

        # get the secure URL of the uploaded image
        new_img_url = response['secure_url']

    if new_img_url:
        new_user_data['img'] = new_img_url

    # update the specified user
    user = User.objects(id=authorized_user['_id']).first()
    user.update(**new_user_data)
    return '', 200
