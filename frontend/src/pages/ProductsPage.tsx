import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Serum", "Moisturizer", "Cleanser", "Sunscreen", "Toner", "Eye Care"];
const SKIN_TYPES = ["All", "Oily", "Dry", "Combination", "Sensitive", "Normal"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSkin, setActiveSkin] = useState("All");

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Page header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-4xl text-stone-800 mb-2">
              All Products
            </h1>
            <p className="text-stone-500">
              Curated, clean, and made for your skin.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 mr-2">
              <SlidersHorizontal size={14} className="text-stone-400" />
              <span className="text-xs text-stone-400 uppercase tracking-widest">
                Filter
              </span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat
                    ? "bg-stone-800 text-white"
                    : "bg-white border border-stone-200 text-stone-500 hover:border-stone-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {SKIN_TYPES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSkin(s)}
                className={`text-xs px-4 py-2 rounded-full transition-all ${
                  activeSkin === s
                    ? "bg-blush-500 text-white"
                    : "bg-blush-50 border border-blush-100 text-blush-400 hover:border-blush-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <ProductGrid category={activeCategory} skinType={activeSkin} />
        </div>
      </main>
      <FloatingChatButton />
      <ChatSidebar />
    </>
  );
}
