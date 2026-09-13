# 商品番号(YYMM-カテゴリ-連番、例: 2609-E-001)のカテゴリ部分に使うコード。
# 新しいカテゴリが増えたらここに追記するだけでよい(表示順もこの並び順)
PRODUCT_CATEGORIES: list[tuple[str, str]] = [
    ("E", "イヤリング"),
    ("B", "バッグ"),
    ("P", "ポーチ"),
]

PRODUCT_CATEGORY_CODES: set[str] = {code for code, _ in PRODUCT_CATEGORIES}
