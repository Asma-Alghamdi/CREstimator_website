# Normal way
def userEntity(item) -> dict:
    return {
        "fname":item["fname"],
        "lname":item["lname"],
        "email":item["email"],
    }

def usersEntity(entity) -> list:
    return [userEntity(item) for item in entity]