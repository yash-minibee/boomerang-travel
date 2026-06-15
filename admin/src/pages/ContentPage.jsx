import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormTextarea } from "../components/ui/FormFields";
import { contentAPI } from "../api/api";

const PAGE_FIELDS = {
  home: [
    { key: "hero_title", label: "Hero Title", type: "input" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
    { key: "hero_badge", label: "Hero Badge Text", type: "input" },
    { key: "packages_title", label: "Featured Packages Title", type: "input" },
    { key: "packages_subtitle", label: "Featured Packages Subtitle", type: "textarea" },
    { key: "newsletter_title", label: "Newsletter Title", type: "input" },
  ],
  about: [
    { key: "about_title", label: "Page Title", type: "input" },
    { key: "about_tagline", label: "Tagline", type: "input" },
    { key: "about_story", label: "Our Story", type: "textarea" },
    { key: "years_experience", label: "Years of Experience", type: "input" },
    { key: "destinations_count", label: "Destinations Count", type: "input" },
    { key: "travelers_count", label: "Happy Travellers Count", type: "input" },
  ],
  contact: [
    { key: "contact_title", label: "Page Title", type: "input" },
    { key: "contact_subtitle", label: "Subtitle", type: "textarea" },
    { key: "phone", label: "Phone Number", type: "input" },
    { key: "email", label: "Email Address", type: "input" },
    { key: "address", label: "Office Address", type: "textarea" },
    { key: "office_hours", label: "Office Hours", type: "textarea" },
  ],
};

export default function ContentPage({ section = "home" }) {
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    contentAPI.get(section)
      .then(res => setFields(res.data ?? {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [section]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await contentAPI.update(section, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const titles = { home: "Home Page", about: "About Page", contact: "Contact Page" };

  return (
    <div className="space-y-6">
      <PageHeader title={`${titles[section]} Content`} subtitle="Edit the content displayed on the website"
        action={
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 ${saved ? "bg-green-500 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"}`}>
            <Save className="w-4 h-4" /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {(PAGE_FIELDS[section] ?? []).map((field, i) => (
            <motion.div key={field.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${field.type === "textarea" ? "lg:col-span-2" : ""}`}>
              {field.type === "input" ? (
                <FormInput label={field.label} value={fields[field.key] ?? ""} onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))} />
              ) : (
                <FormTextarea label={field.label} rows={3} value={fields[field.key] ?? ""} onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))} />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Globe className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">Changes saved here update the live website. Review content before saving.</p>
      </div>
    </div>
  );
}
