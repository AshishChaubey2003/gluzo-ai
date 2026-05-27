// ─── HomePage ────────────────────────────────────────────────────────────────
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/ui/HeroSection";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Trending section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs tracking-[0.25em] uppercase text-blush-400 font-medium">
              Curated for you
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-stone-800">
              Trending in Skincare
            </h2>
          </motion.div>
          <ProductGrid />
        </section>

        {/* Value props */}
        <section className="bg-stone-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
            {[
              { icon: "🧬", title: "Ingredient-first", desc: "Every recommendation backed by what's actually in the product." },
              { icon: "🎯", title: "Skin-type aware", desc: "Our AI remembers your skin profile across the conversation." },
              { icon: "💖", title: "Zero guesswork", desc: "No more buying the wrong thing. Glow gets it right." },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-serif text-xl mb-2">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <FloatingChatButton />
      <ChatSidebar />
    </>
  );
}
