from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    price: float
    skin_type: str
    concern: str
    ingredients: str
    description: str
    image_url: str = ""
    product_url: str = ""


class RetrievedProduct(BaseModel):
    product: Product
    similarity: float
    final_score: float = 0.0


class ProductCard(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    price: float
    skin_type: str
    concern: str
    image_url: str = ""
    product_url: str = ""
    match_reason: str = ""
