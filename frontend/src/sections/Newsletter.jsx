import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import usePageContent from "../hooks/usePageContent";

export default function Newsletter() {
  const defaultContent = {
    newsletter_title: "Travel Inspiration, Delivered"
  };

  const { content } = usePageContent("home", defaultContent);

  return (
    <section className="py-20 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 flex items-center justify-center">
            <Mail className="w-8 h-8 text-amber-300" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{content.newsletter_title}</h2>
          <p className="text-teal-200 text-lg max-w-xl mx-auto">
            Subscribe to receive exclusive deals, early-bird offers, and curated travel inspiration straight to your inbox.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-2 max-w-lg mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition-colors">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-teal-300 text-xs">No spam, ever. Unsubscribe anytime. 🌍</p>
        </motion.div>
      </div>
    </section>
  );
}
