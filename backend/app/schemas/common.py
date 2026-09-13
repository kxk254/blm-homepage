from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


# レスポンスJSONのキーを、以前のDrizzle(TypeScript)側と同じcamelCaseに揃えるための基底クラス。
# こうしておくとNext.js側のコンポーネントが`product.productName`のような既存の書き方のまま使える。
class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )
