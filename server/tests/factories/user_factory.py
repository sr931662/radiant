from polyfactory.factories.sqlalchemy_factory import SQLAlchemyFactory
from src.models.user import User
from src.core.security import hash_password


class UserFactory(SQLAlchemyFactory):
    __model__ = User

    first_name = "Test"
    last_name = "User"
    email = "testuser@example.com"
    password_hash = hash_password("Password1")
    is_email_verified = True
    is_banned = False
    is_active = True
