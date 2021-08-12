# Normal way
def videoEntity(item) -> dict:
    return {
        "name": item["name"],
        "path": item["path"],
        "Placename": item["Placename"],
        "setting": item["setting"],
        "country": item["country"],
        "duration": item["duration"],
        "date": item["date"],
        "sendEmail": item["sendEmail"],
        "publish": item["publish"],
        "outputVideoPath": item["outputVideoPath"],
        "contactRate": item["contactRate"],
        "average": item["average"],
        "totalPeople": item["totalPeople"],
        "coverPic": item["coverPic"],
        "figurePath": item["figurePath"],
        "userId": item["userId"],
    }


def videosEntity(entity) -> list:
    return [videoEntity(item) for item in entity]
