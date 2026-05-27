import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";

const STARTER_TOPICS = [
  {
    emoji: "✨",
    title: "Glow up routine",
    subtitle: "For radiant skin",
    prompt: "I want a glow up routine for my skin",
    bg: "from-amber-50 to-yellow-100",
  },
  {
    emoji: "🌿",
    title: "Acne & oily skin",
    subtitle: "Clear skin solutions",
    prompt: "I have oily skin with acne, what should I use?",
    bg: "from-green-50 to-emerald-100",
  },
  {
    emoji: "💧",
    title: "Deep hydration",
    subtitle: "For dry & dull skin",
    prompt: "My skin is very dry and dull, help me",
    bg: "from-blue-50 to-sky-100",
  },
  {
    emoji: "🛡️",
    title: "Sun protection",
    subtitle: "Best SPF for Indian skin",
    prompt: "Which sunscreen is best for Indian skin?",
    bg: "from-orange-50 to-amber-100",
  },
];

export function ChatSidebar() {
  const { isChatOpen, closeChat, clearSession, messages, sendMessage } =
    useChatStore();
  const isFirstOpen = messages.length === 0;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
          />

          {/* Main Panel */}
          <motion.aside
            className={cn(
              "fixed right-0 top-0 h-screen z-50 flex flex-col",
              "w-full md:w-[420px]",
              "bg-white shadow-2xl",
              "border-l border-stone-100",
            )}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center shadow-lg">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Glow</p>
                  <p className="text-xs text-stone-400">
                    Your Beauty Advisor • Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearSession}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
                    title="New conversation"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Onboarding Screen */}
            {isFirstOpen ? (
              <div className="flex-1 overflow-y-auto">
                {/* Hero */}
                <div className="bg-gradient-to-br from-stone-800 to-stone-900 px-6 py-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                      AI-Powered Beauty
                    </p>
                    <h2 className="text-2xl font-serif font-medium mb-2">
                      Skincare that
                      <br />
                      <span className="text-blush-300 italic">knows you.</span>
                    </h2>
                    <p className="text-sm text-stone-400 leading-relaxed">
                      Tell me about your skin and I'll find products made just
                      for you — no guesswork.
                    </p>
                  </motion.div>
                </div>

                {/* Starter Topics */}
                <div className="px-4 py-5">
                  <p className="text-xs uppercase tracking-widest text-stone-400 mb-3 px-1">
                    What are you looking for?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {STARTER_TOPICS.map((topic, i) => (
                      <motion.button
                        key={topic.title}
                        onClick={() => sendMessage(topic.prompt)}
                        className={cn(
                          "text-left p-4 rounded-2xl border border-stone-100",
                          "hover:border-blush-200 hover:shadow-md transition-all duration-200",
                          `bg-gradient-to-br ${topic.bg}`,
                        )}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        whileHover={{ y: -2 }}
                      >
                        <span className="text-2xl mb-2 block">
                          {topic.emoji}
                        </span>
                        <p className="text-sm font-semibold text-stone-800 leading-tight">
                          {topic.title}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {topic.subtitle}
                        </p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-stone-100" />
                    <span className="text-xs text-stone-400">
                      or ask anything
                    </span>
                    <div className="flex-1 h-px bg-stone-100" />
                  </div>

                  {/* Quick prompts */}
                  <div className="space-y-2">
                    {[
                      "Best serum under ₹500?",
                      "Routine for wedding glow ✨",
                      "Products for sensitive skin",
                    ].map((prompt, i) => (
                      <motion.button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 hover:border-stone-200 transition-all text-left group"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                      >
                        <span className="text-sm text-stone-600">{prompt}</span>
                        <ArrowRight
                          size={14}
                          className="text-stone-300 group-hover:text-blush-400 transition-colors"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ChatMessages isFirstOpen={false} />
            )}

            {/* Input */}
            <ChatInput />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
