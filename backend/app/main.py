from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    account,
    admin_customers,
    admin_orders,
    admin_products,
    admin_themes,
    auth,
    checkout,
    media,
    products,
    themes,
    webhooks,
)

app = FastAPI(title="Blue Millefeuille API")

# 本番はnginxが同一オリジンでまとめるのでCORSは基本不要だが、
# nginxを介さずフロントを直接起動するローカル開発を楽にするため許可しておく
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(account.router)
app.include_router(products.router)
app.include_router(themes.router)
app.include_router(admin_products.router)
app.include_router(admin_themes.router)
app.include_router(admin_orders.router)
app.include_router(admin_customers.router)
app.include_router(media.router)
app.include_router(checkout.router)
app.include_router(webhooks.router)


@app.get("/api/health")
async def health_check():
    return {"ok": True}
