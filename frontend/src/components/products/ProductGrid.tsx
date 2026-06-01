import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { productsApi } from "@/lib/api";
import { type ProductCard as ProductCardType } from "@/store/chatStore";

const CATEGORY_MAP: Record<string, string[]> = {
  Cleanser: ["face wash", "cleanser"],
  Moisturizer: ["moisturizer", "lotion", "cream", "gel"],
  Serum: ["serum", "essence"],
  Sunscreen: ["sunscreen", "spf"],
  Toner: ["toner", "mist"],
  "Eye Care": ["eye", "lip"],
};

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 skeleton rounded-full" />
        <div className="h-4 w-3/4 skeleton rounded-full" />
        <div className="h-3 w-1/2 skeleton rounded-full" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products: externalProducts,
  category,
  skinType,
}: {
  products?: ProductCardType[];
  category?: string;
  skinType?: string;
}) {
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (externalProducts?.length) {
      setProducts(externalProducts);
      setLoading(false);
      return;
    }
    productsApi
      .getAll({ limit: 50 } as any)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [externalProducts]);
  const filtered = products.filter((p) => {
    const catOk =
      !category ||
      category === "All" ||
      (CATEGORY_MAP[category]
        ? CATEGORY_MAP[category].some((c) =>
            p.category.toLowerCase().includes(c),
          )
        : p.category.toLowerCase().includes(category.toLowerCase()));

    const skinOk =
      !skinType ||
      skinType === "All" ||
      p.skin_type.toLowerCase().includes(skinType.toLowerCase()) ||
      p.skin_type.toLowerCase() === "all";

    return catOk && skinOk;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
      ) : filtered.length === 0 ? (
        <div className="col-span-4 text-center py-16 text-stone-400">
          <p className="text-lg mb-1">No products found</p>
          <p className="text-sm">Try a different filter</p>
        </div>
      ) : (
        filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))
      )}
    </div>
  );
}
