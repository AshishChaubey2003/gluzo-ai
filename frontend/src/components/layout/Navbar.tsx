import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Menu, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openChat } = useChatStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/routine", label: "Routines" },
  ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center shadow-glow-blush">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-serif text-lg text-stone-800 group-hover:text-blush-600 transition-colors">
            Gluzo
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "text-sm transition-colors",
                location.pathname === to
                  ? "text-stone-800 font-medium"
                  : "text-stone-500 hover:text-stone-800"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openChat}
            className="hidden md:flex items-center gap-2 text-xs bg-stone-800 text-white px-4 py-2.5 rounded-xl hover:bg-blush-600 transition-colors"
          >
            <Sparkles size={12} />
            Ask Glow
          </button>
          <button className="p-2.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all relative">
            <ShoppingBag size={18} />
          </button>
          <button
            className="md:hidden p-2 rounded-xl text-stone-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden glass border-t border-stone-100 px-6 py-4 space-y-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block py-2 text-stone-600 hover:text-blush-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => { openChat(); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-2 text-sm bg-stone-800 text-white px-4 py-3 rounded-xl"
          >
            <Sparkles size={13} />
            Ask Glow AI
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
