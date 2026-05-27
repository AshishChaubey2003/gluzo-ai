import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useChatStore, type Message } from "@/store/chatStore";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  "I have oily skin with acne marks 🌿",
  "Need a glow routine for my wedding ✨",
  "Sensitive skin — what's safe for me?",
  "Best serum under ₹1000?",
];

export function ChatMessages({ isFirstOpen }: { isFirstOpen: boolean }) {
  const { messages, sendMessage } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {/* Welcome state */}
      {isFirstOpen && messages.length === 0 && (
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blush-200 to-blush-400 flex items-center justify-center shadow-glow-blush">
            <Sparkles size={22} className="text-white" />
          </div>
          <h3 className="font-serif text-xl text-stone-800 mb-1">Hi, I'm Glow ✨</h3>
          <p className="text-sm text-stone-500 mb-6 max-w-[280px] mx-auto leading-relaxed">
            Your personal AI beauty advisor. Tell me about your skin and I'll find products made for you.
          </p>

          <div className="space-y-2">
            {STARTER_PROMPTS.map((prompt, i) => (
              <motion.button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl text-sm",
                  "bg-white border border-stone-100 hover:border-blush-300",
                  "text-stone-600 hover:text-blush-600",
                  "transition-all duration-200 hover:shadow-sm",
                  "animate-fade-up opacity-0"
                )}
                style={{ animationDelay: `${0.3 + i * 0.1}s`, animationFillMode: "forwards" }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (message.isTyping) {
    return (
      <motion.div
        className="flex items-end gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blush-300 to-blush-500 flex-shrink-0" />
        <div className="bubble-ai flex items-center gap-1 px-4 py-3">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blush-300 to-blush-500 flex-shrink-0 mb-1" />
      )}

      <div className={cn("max-w-[85%] space-y-3", isUser && "items-end flex flex-col")}>
        {/* Text bubble */}
        <div className={isUser ? "bubble-user" : "bubble-ai"}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Product cards */}
        {message.products && message.products.length > 0 && (
          <motion.div
            className="space-y-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message.products.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <ProductCard product={product} compact />
              </motion.div>
            ))}
          </motion.div>
        )}

        <p className="text-[10px] text-stone-300 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}
