import asyncio
import logging
import pickle
from pathlib import Path
from typing import List, Optional

import faiss
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

from app.core.config import settings
from app.models.product import Product, RetrievedProduct

logger = logging.getLogger(__name__)


class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index: Optional[faiss.Index] = None
        self.products: List[Product] = []
        self.id_to_product: dict = {}
        self.dimension = 384

        self.index_path = Path(settings.FAISS_INDEX_PATH)
        self.meta_path = Path(settings.FAISS_INDEX_PATH + "_meta.pkl")

    async def initialize(self):
        if self.index_path.exists() and self.meta_path.exists():
            logger.info("Loading existing FAISS index...")
            self._load_index()
        else:
            logger.info("Building FAISS index from CSV...")
            await self._build_index()

    async def _build_index(self):
        df = pd.read_csv(settings.PRODUCTS_CSV_PATH)
        df = df.fillna("")

        self.products = []
        documents = []

        for _, row in df.iterrows():
            product = Product(
                id=str(row.get("id", row.name)),
                name=str(row["name"]),
                brand=str(row["brand"]),
                category=str(row["category"]),
                price=float(row.get("price", 0)),
                skin_type=str(row["skin_type"]),
                concern=str(row["concern"]),
                ingredients=str(row["ingredients"]),
                description=str(row["description"]),
                image_url=str(row.get("image_url", "")),
                product_url=str(row.get("product_url", "")),
            )
            self.products.append(product)
            doc = f"Product: {product.name} by {product.brand} Category: {product.category} Skin: {product.skin_type} Concern: {product.concern} Ingredients: {product.ingredients}"
            documents.append(doc)

        logger.info(f"Embedding {len(documents)} products...")
        vectors = self.model.encode(documents, show_progress_bar=True)
        vectors = np.array(vectors, dtype="float32")
        faiss.normalize_L2(vectors)

        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(vectors)
        self.id_to_product = {i: p for i, p in enumerate(self.products)}

        self.index_path.parent.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self.index, str(self.index_path))
        with open(self.meta_path, "wb") as f:
            pickle.dump({"products": self.products, "id_map": self.id_to_product}, f)

        logger.info(f"FAISS index built with {self.index.ntotal} vectors")

    def _load_index(self):
        self.index = faiss.read_index(str(self.index_path))
        with open(self.meta_path, "rb") as f:
            data = pickle.load(f)
        self.products = data["products"]
        self.id_to_product = data["id_map"]
        logger.info(f"Loaded FAISS index: {self.index.ntotal} products")

    async def search(self, query: str, top_k: int = 10, filters: Optional[dict] = None) -> List[RetrievedProduct]:
        if not self.index:
            raise RuntimeError("Vector store not initialized")

        q_vec = self.model.encode([query])
        q_vec = np.array(q_vec, dtype="float32")
        faiss.normalize_L2(q_vec)

        scores, indices = self.index.search(q_vec, top_k * 3)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            product = self.id_to_product.get(idx)
            if not product:
                continue
            if filters and not self._passes_filter(product, filters):
                continue
            results.append(RetrievedProduct(product=product, similarity=float(score)))
            if len(results) >= top_k:
                break

        return results

    def _passes_filter(self, product: Product, filters: dict) -> bool:
        if "skin_type" in filters and filters["skin_type"]:
            if filters["skin_type"].lower() not in product.skin_type.lower():
                if "all" not in product.skin_type.lower():
                    return False
        if "max_price" in filters and filters["max_price"]:
            if product.price > filters["max_price"]:
                return False
        if "category" in filters and filters["category"]:
            if filters["category"].lower() not in product.category.lower():
                return False
        return True

    def get_all_products(self) -> List[Product]:
        return self.products
