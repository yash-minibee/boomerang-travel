import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormTextarea } from "../components/ui/FormFields";
import { contentAPI } from "../api/api";

const PAGE_FIELDS = {
  home: [
    { key: "hero_title_line1", label: "Hero Title (Line 1 - Normal)", type: "input" },
    { key: "hero_title_line2", label: "Hero Title (Line 2 - Gradient)", type: "input" },
    { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
    { key: "hero_badge", label: "Hero Badge Text", type: "input" },
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

  const continentSections = (() => {
    try {
      return fields.home_continent_sections ? JSON.parse(fields.home_continent_sections) : [];
    } catch (e) {
      return [];
    }
  })();

  const setContinentSections = (newSections) => {
    setFields(f => ({
      ...f,
      home_continent_sections: JSON.stringify(newSections)
    }));
  };

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

      {section === "home" && !loading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Continent-Wise Package Rows</h3>
              <p className="text-xs text-gray-500 mt-1">Manage horizontal scrolling rows on the homepage dynamically.</p>
            </div>
            <button
              onClick={() => {
                const newSections = [
                  ...continentSections,
                  {
                    id: "sec-" + Date.now(),
                    continent: "Europe",
                    title: "New Escapes",
                    subtitle: "Discover beautiful destinations.",
                    badge: "Featured Region"
                  }
                ];
                setContinentSections(newSections);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          {continentSections.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-400">No continent sections configured. Default (Europe & Asia) will be displayed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {continentSections.map((sec, idx) => (
                <div key={sec.id || idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-200/60 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Continent Selector */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Continent / Region</label>
                      <select
                        value={sec.continent}
                        onChange={(e) => {
                          const updated = [...continentSections];
                          updated[idx] = { ...updated[idx], continent: e.target.value };
                          setContinentSections(updated);
                        }}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-teal-300"
                      >
                        {["Asia", "Africa", "North America", "South America", "Antarctica", "Europe", "Australia/Oceania"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Badge */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Badge Text</label>
                      <input
                        type="text"
                        value={sec.badge ?? ""}
                        onChange={(e) => {
                          const updated = [...continentSections];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setContinentSections(updated);
                        }}
                        placeholder="e.g. Romance & History"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-teal-300"
                      />
                    </div>

                    {/* Title */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Section Title</label>
                      <input
                        type="text"
                        value={sec.title ?? ""}
                        onChange={(e) => {
                          const updated = [...continentSections];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setContinentSections(updated);
                        }}
                        placeholder="e.g. European Escapes"
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-teal-300"
                      />
                    </div>

                    {/* Actions Column */}
                    <div className="md:col-span-2 flex items-center justify-end gap-1.5 pb-1.5">
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...continentSections];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          setContinentSections(updated);
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === continentSections.length - 1}
                        onClick={() => {
                          const updated = [...continentSections];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          setContinentSections(updated);
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-teal-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = continentSections.filter((_, sIdx) => sIdx !== idx);
                          setContinentSections(updated);
                        }}
                        className="ml-2 w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtitle / Description */}
                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Subtitle / Description</label>
                      <textarea
                        rows={2}
                        value={sec.subtitle ?? ""}
                        onChange={(e) => {
                          const updated = [...continentSections];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setContinentSections(updated);
                        }}
                        placeholder="e.g. Indulge in iconic landmarks..."
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-teal-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Globe className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">Changes saved here update the live website. Review content before saving.</p>
      </div>
    </div>
  );
}
