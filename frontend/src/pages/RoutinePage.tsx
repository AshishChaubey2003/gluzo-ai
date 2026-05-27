import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/products/ProductCard";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { routineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const CONCERNS = ["Acne", "Dark Spots", "Anti-Aging", "Brightening", "Dryness", "Pores", "Redness"];

export default function RoutinePage() {
  const [skinType, setSkinType] = useState("");
  const [concern, setConcern] = useState("");
  const [result, setResult] = useState<{ routine_text: string; products: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!skinType || !concern) return;
    setLoading(true);
    try {
      const data = await routineApi.generate({ skin_type: skinType, concern });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs tracking-[0.25em] uppercase text-blush-400 font-medium">
              Personalised for you
            </span>
            <h1 className="mt-3 font-serif text-4xl text-stone-800 mb-3">
              Build Your Routine
            </h1>
            <p className="text-stone-500 leading-relaxed">
              Our AI designs a complete AM + PM routine based on your skin type and primary concern.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-card mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="mb-6">
              <label className="text-xs uppercase tracking-widest text-stone-400 mb-3 block">
                Skin Type
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkinType(s.toLowerCase())}
                    className={cn(
                      "text-sm px-5 py-2.5 rounded-2xl border transition-all",
                      skinType === s.toLowerCase()
                        ? "bg-stone-800 text-white border-stone-800"
                        : "border-stone-200 text-stone-500 hover:border-stone-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs uppercase tracking-widest text-stone-400 mb-3 block">
                Primary Concern
              </label>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConcern(c.toLowerCase())}
                    className={cn(
                      "text-sm px-5 py-2.5 rounded-2xl border transition-all",
                      concern === c.toLowerCase()
                        ? "bg-blush-500 text-white border-blush-500"
                        : "border-blush-100 text-blush-400 hover:border-blush-400 bg-blush-50"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={!skinType || !concern || loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-medium transition-all",
                skinType && concern && !loading
                  ? "bg-stone-800 text-white hover:bg-blush-600"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              )}
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Building your routine…</>
              ) : (
                <><Sparkles size={15} /> Generate My Routine</>
              )}
            </button>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Routine text */}
                <div className="bg-white rounded-3xl p-8 shadow-card">
                  <h2 className="font-serif text-2xl text-stone-800 mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-blush-400" />
                    Your Personalised Routine
                  </h2>
                  <div className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.routine_text}
                  </div>
                </div>

                {/* Products */}
                {result.products?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl text-stone-800 mb-5">Recommended Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {result.products.map((p: any, i: number) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <ProductCard product={p} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <FloatingChatButton />
      <ChatSidebar />
    </>
  );
}
