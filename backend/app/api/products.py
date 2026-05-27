"""
Gluzo AI — Products API
"""

from fastapi import APIRouter, Request, Query
from typing import List, Optional
from app.models.product import ProductCard

router = APIRouter()


@router.get("/products", response_model=List[ProductCard])
async def get_products(
    request: Request,
    category: Optional[str] = Query(None),
    skin_type: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
    limit: int = Query(20, le=100),
):
    """Browse all products with optional filters."""
    vs = request.app.state.vectorstore
    products = vs.get_all_products()

    filtered = []
    for p in products:
        if category and category.lower() not in p.category.lower():
            continue
        if skin_type and skin_type.lower() not in p.skin_type.lower() and "all" not in p.skin_type.lower():
            continue
        if max_price and p.price > max_price:
            continue
        filtered.append(ProductCard(
            id=p.id, name=p.name, brand=p.brand, category=p.category,
            price=p.price, skin_type=p.skin_type, concern=p.concern,
            image_url=p.image_url,
            product_url=p.product_url,
        ))

    return filtered[:limit]


@router.get("/products/{product_id}")
async def get_product(product_id: str, request: Request):
    """Get single product by ID."""
    vs = request.app.state.vectorstore
    products = vs.get_all_products()
    for p in products:
        if p.id == product_id:
            return p
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Product not found")
