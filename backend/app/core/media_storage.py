import re
from pathlib import Path

from app.core.config import settings

# 商品ごとのフォルダ名・ファイル名で使う安全な文字だけを許可する
UNSAFE_CHARS = re.compile(r"[^a-zA-Z0-9._-]")


def product_media_dir(product_id: str) -> Path:
    # product_idはDBに実在するものだけを使う前提のため、ここでのパストラバーサル
    # の心配は基本的にないが、念のため区切り文字混入だけ弾く
    safe_id = UNSAFE_CHARS.sub("_", product_id)
    directory = Path(settings.media_root) / safe_id
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def next_sequence_number(directory: Path, product_id: str) -> int:
    """このフォルダに既にある`<商品ID>_<連番>.拡張子`形式のファイルから
    次のアップロード順番号を決める(手動で置いた無関係な名前のファイルは無視する)。"""
    pattern = re.compile(rf"^{re.escape(product_id)}_(\d+)\.")
    max_seq = 0
    for path in directory.iterdir():
        if not path.is_file():
            continue
        match = pattern.match(path.name)
        if match:
            max_seq = max(max_seq, int(match.group(1)))
    return max_seq + 1


def safe_extension(filename: str) -> str:
    ext = UNSAFE_CHARS.sub("", Path(filename).suffix)
    return ext or ".jpg"
