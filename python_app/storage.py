from typing import Dict, Optional
from models import User, UserCreate


class IStorage:
    """Storage interface for user management"""
    
    async def get_user(self, user_id: int) -> Optional[User]:
        raise NotImplementedError
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        raise NotImplementedError
    
    async def create_user(self, user_data: UserCreate) -> User:
        raise NotImplementedError


class MemoryStorage(IStorage):
    """In-memory storage implementation"""
    
    def __init__(self):
        self.users: Dict[int, User] = {}
        self.current_id = 1
    
    async def get_user(self, user_id: int) -> Optional[User]:
        return self.users.get(user_id)
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        for user in self.users.values():
            if user.username == username:
                return user
        return None
    
    async def create_user(self, user_data: UserCreate) -> User:
        user_id = self.current_id
        self.current_id += 1
        
        user = User(
            id=user_id,
            username=user_data.username,
            password=user_data.password
        )
        
        self.users[user_id] = user
        return user


# Global storage instance
storage = MemoryStorage()