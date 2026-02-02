from fastapi import FastAPI
from app.api.routers import (
    address_router,
    orders_router,
    products,
    auth,
    cart,
    payment,
    upload,
    settings_router,
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BgFitStore API")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://15.206.207.170:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
app.include_router(address_router.router, prefix="/api", tags=["Address"])
app.include_router(orders_router.router, prefix="/api/orders", tags=["Orders"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(settings_router.router, prefix="/api", tags=["Settings"])


@app.get("/")
def read_root():
    return {"message": "Welcome to BgFitStore API"}
