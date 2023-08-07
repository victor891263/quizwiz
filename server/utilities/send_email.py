from flask_mail import Message

def send_email(message: str, subject: str, recipients: list):
    # import the mail object here to avoid circular dependency
    from index import mail

    # send email
    msg = Message(subject, recipients, sender='autoreply978@gmail.com')
    msg.body = message
    mail.send(msg)
