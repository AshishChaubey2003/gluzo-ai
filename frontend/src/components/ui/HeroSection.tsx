import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export function HeroSection() {
  const { openChat } = useChatStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-200 to-cream-100 min-h-[88vh] flex items-center">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blush-100 opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gold-100 opacity-50 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-blush-500 mb-6 bg-blush-100 px-4 py-2 rounded-full"
          >
            <Sparkles size={12} />
            AI-Powered Beauty
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl text-stone-900 leading-[1.1] mb-6"
          >
            Skincare that
            <span className="block text-gradient-blush italic">knows you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-stone-500 leading-relaxed mb-10 max-w-md"
          >
            Tell our AI your skin story — concerns, type, budget — and get
            products genuinely made for you. No guesswork.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={openChat}
              className="group flex items-center gap-2 bg-stone-900 text-white px-7 py-4 rounded-2xl text-sm font-medium hover:bg-blush-600 transition-all duration-300 shadow-sm"
            >
              <Sparkles size={15} />
              Meet Glow, your advisor
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => (window.location.href = "/products")}
              className="px-7 py-4 rounded-2xl text-sm font-medium border border-stone-200 text-stone-600 hover:border-blush-300 hover:text-blush-600 transition-all"
            >
              Browse products
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 mt-10"
          >
            <div className="flex -space-x-2">
              {["F9D6E0", "F7E2A8", "EBE4D6", "FDEEF2"].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ background: `#${bg}` }}
                />
              ))}
            </div>
            <p className="text-sm text-stone-400">
              <span className="font-medium text-stone-700">12,000+</span> skin
              profiles built
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 24,
          }}
          className="hidden lg:block"
        >
          <ChatPreviewCard onOpen={openChat} />
        </motion.div>
      </div>
    </section>
  );
}

function ChatPreviewCard({ onOpen }: { onOpen: () => void }) {
  const messages = [
    { role: "user", text: "I have oily skin with acne marks" },
    {
      role: "ai",
      text: "Got you ✨ For oily acne-prone skin, lightweight niacinamide-based products usually work best.\n\nAre you mainly dealing with active acne, acne marks, or excess oil right now?",
    },
  ];

  return (
    <div
      onClick={onOpen}
      className="glass rounded-3xl p-5 shadow-chat cursor-pointer hover:shadow-lg transition-all max-w-sm mx-auto"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-stone-800">Glow</p>
          <p className="text-xs text-stone-400">Online</p>
        </div>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
      </div>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.3 }}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                m.role === "user"
                  ? "bubble-user text-xs max-w-[75%]"
                  : "bubble-ai text-xs max-w-[85%]"
              }
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-blush-400 mt-5 font-medium">
        Tap to start your consultation →
      </p>
    </div>
  );
}
