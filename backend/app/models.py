from typing import Optional
import uuid
from pydantic import BaseModel, Field





class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    fname: str = Field(...)
    lname: str = Field(...)
    email: str = Field(...)
    

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "id": "00010203-0405-0607-0809-0a0b0c0d0e0f",
                "fname": "Asma",
                "lname": "Alghamdi",
                "email": "assmma143@gmail.com",
            }
        }


class UpdateUserModel(BaseModel):
    fname: Optional[str]
    lname: Optional[str]
    email: Optional[str]

    class Config:
        schema_extra = {
            "example": {
               "fname": "Asma",
               "lname": "Alghamdi",
               "email": "assmma143@gmail.com",
            }
        }