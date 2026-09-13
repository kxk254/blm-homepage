from app.schemas.common import CamelModel


class MediaImageOut(CamelModel):
    name: str
    url: str
