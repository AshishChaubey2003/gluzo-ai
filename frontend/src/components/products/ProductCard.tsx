import { motion } from "framer-motion";
import { ShoppingBag, Tag } from "lucide-react";
import { type ProductCard as ProductCardType } from "@/store/chatStore";
import { cn, formatPrice, truncate } from "@/lib/utils";

interface Props {
  product: ProductCardType;
  compact?: boolean;
}

// Random coupon generator for demo
function getCoupon(id: string) {
  const coupons = [
    { code: "GLOW10", discount: "10% OFF", color: "bg-green-500" },
    { code: "SKIN15", discount: "15% OFF", color: "bg-blush-500" },
    { code: "FIRST20", discount: "20% OFF", color: "bg-amber-500" },
    { code: "CARE5", discount: "5% OFF", color: "bg-blue-500" },
  ];
  return coupons[parseInt(id) % coupons.length];
}

export function ProductCard({ product, compact = false }: Props) {
  const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.brand)}&background=F9D6E0&color=A63254&size=200&bold=true`;
  const imgSrc = product.image_url || placeholder;
  const coupon = getCoupon(product.id);

  const handleBuy = () => {
    if (product.product_url) {
      window.open(product.product_url, "_blank");
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleBuy}
        className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-stone-100 hover:border-blush-200 transition-all cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cream-200">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholder;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-400 uppercase tracking-wide truncate">
            {product.brand}
          </p>
          <p className="text-sm font-medium text-stone-800 leading-snug truncate">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-blush-500 font-medium">
              {formatPrice(product.price)}
            </p>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full text-white font-bold ${coupon.color}`}
            >
              {coupon.discount}
            </span>
          </div>
        </div>
        <button className="p-2 rounded-xl bg-stone-800 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blush-600">
          <ShoppingBag size={12} />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="product-card group cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleBuy}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholder;
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur-sm text-stone-600 px-2.5 py-1 rounded-full font-medium">
            {product.category}
          </span>
        </div>
        {/* Discount badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] px-2 py-1 rounded-full text-white font-bold ${coupon.color}`}
          >
            {coupon.discount}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
          {product.brand}
        </p>
        <h3 className="font-medium text-stone-800 leading-snug mb-1">
          {truncate(product.name, 48)}
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.skin_type &&
            product.skin_type
              .split(",")
              .slice(0, 2)
              .map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-cream-200 text-stone-500 px-2 py-0.5 rounded-full"
                >
                  {t.trim()}
                </span>
              ))}
        </div>

        {/* Coupon code */}
        <div className="flex items-center gap-1.5 mb-3 bg-stone-50 rounded-lg px-2.5 py-1.5 border border-dashed border-stone-200">
          <Tag size={10} className="text-stone-400" />
          <span className="text-[10px] text-stone-500">Use code:</span>
          <span className="text-[10px] font-bold text-stone-700 tracking-wide">
            {coupon.code}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-stone-800">
            {formatPrice(product.price)}
          </span>
          <button
            className={cn(
              "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl",
              "bg-stone-800 text-white hover:bg-blush-600 transition-colors",
            )}
          >
            <ShoppingBag size={12} />
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
