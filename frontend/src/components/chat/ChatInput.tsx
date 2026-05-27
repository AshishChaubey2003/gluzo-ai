import { useState, useRef, KeyboardEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { Send, Mic } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";

const QUICK_REPLIES = [
  "Oily skin",
  "Anti-aging",
  "Acne marks",
  "Brightening",
  "Under ₹500",
];

export function ChatInput() {
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
    textareaRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-stone-100 bg-white/90 backdrop-blur-md px-4 pt-3 pb-4">
      {/* Quick reply chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        {QUICK_REPLIES.map((chip) => (
          <button
            key={chip}
            onClick={() => { setInput(chip); textareaRef.current?.focus(); }}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-cream-200 text-stone-500 hover:bg-blush-100 hover:text-blush-600 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <div className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 focus-within:border-blush-300 focus-within:ring-2 focus-within:ring-blush-100 transition-all">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tell me about your skin…"
            disabled={isLoading}
            minRows={1}
            maxRows={4}
            className={cn(
              "w-full bg-transparent text-sm text-stone-800 placeholder-stone-400",
              "resize-none outline-none leading-relaxed",
              "disabled:opacity-50"
            )}
          />
        </div>

        <motion.button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
            "transition-all duration-200",
            input.trim() && !isLoading
              ? "bg-stone-800 text-white shadow-sm hover:bg-stone-700"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          )}
        >
          <Send size={15} />
        </motion.button>
      </div>

      <p className="text-center text-[10px] text-stone-300 mt-2">
        Powered by Gluzo AI · Results from our curated collection
      </p>
    </div>
  );
}
