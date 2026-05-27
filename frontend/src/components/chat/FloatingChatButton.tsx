import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export function FloatingChatButton() {
  const { isChatOpen, openChat, closeChat } = useChatStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Nudge tooltip */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            className="glass rounded-2xl px-4 py-2.5 text-sm text-stone-700 shadow-card max-w-[180px] text-center leading-snug"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ delay: 1.2 }}
          >
            ✨ Find your perfect routine
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={isChatOpen ? closeChat : openChat}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blush-500 to-blush-600 text-white flex items-center justify-center shadow-glow-blush"
      >
        {/* Pulse ring */}
        {!isChatOpen && (
          <span className="absolute inset-0 rounded-full bg-blush-400 animate-ping opacity-20" />
        )}

        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="star" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
