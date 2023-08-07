from models.User import User

def get_user(id):
    user = User.objects(id=id).exclude('password').first()
    return user.to_json()