import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { api } from "../api/api";
import usePageContent from "../hooks/usePageContent";

export default function Newsletter() {
  const defaultContent = {
    newsletter_title: "Travel Inspiration, Delivered"
  };

  const { content } = usePageContent("home", defaultContent);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await api.submitSubscriber(email);
      setSubmitted(true);
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

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
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-white font-bold px-4 py-3">
                <CheckCircle className="w-5 h-5 text-amber-400" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 transition-colors">
                  {submitting ? "Waiting..." : "Subscribe"} {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>

          <p className="text-teal-300 text-xs">No spam, ever. Unsubscribe anytime. 🌍</p>
        </motion.div>
      </div>
    </section>
  );
}
