from flask import request

def verify_authorization(f):
    def wrapper(*args, **kwargs):
        authorized_user = getattr(request, 'authorized_user', None)

        # if no logged-in user is found, deny access
        if not authorized_user:
            return 'You must be logged in to do this', 401
        return f(*args, **kwargs)
    # Renaming the function name to avoid assertion error
    wrapper.__name__ = f.__name__
    return wrapper
