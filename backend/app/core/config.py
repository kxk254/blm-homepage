from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """環境変数を1箇所に集約する。値の取得元は.envファイルまたはOSの環境変数。"""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_expire_minutes: int = 43200  # 30日

    stripe_secret_key: str
    stripe_webhook_secret: str

    smtp_host: str
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    smtp_from: str | None = None

    site_url: str = "http://localhost:3000"

    # 商品画像を保存するNASマウントのコンテナ内パス。
    # ホストのNAS共有をdocker-composeでこのパスにbind mountしておく前提。
    media_root: str = "/mnt/media"


# アプリ起動時に一度だけ読み込めば十分なのでモジュールレベルのシングルトンにする
settings = Settings()
