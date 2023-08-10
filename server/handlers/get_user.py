from models.User import User

def get_user(id):
    user = User.objects(id=id).exclude('password').first()

    # send error message if user doesn't exist
    if not user:
        return 'This user does not exist', 404

    return user.to_json()