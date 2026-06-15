import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Building, Share2, MessageCircle, Mail, Search, Users } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormTextarea } from "../components/ui/FormFields";
import { settingsAPI } from "../api/api";

const TABS = [
  { id: "general", label: "General", icon: Building },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
  { id: "seo", label: "SEO", icon: Search },
];

const TAB_FIELDS = {
  general: ["company_name", "phone", "email", "address", "whatsapp_number"],
  social: ["facebook_url", "instagram_url", "twitter_url", "youtube_url"],
  whatsapp: ["whatsapp_number", "whatsapp_default_message"],
  email: ["smtp_host", "smtp_port", "smtp_user", "from_name", "from_email"],
  seo: ["site_title", "meta_description", "meta_keywords", "google_analytics_id"],
};

const FIELD_LABELS = {
  company_name: "Company Name", phone: "Phone Number", email: "Email Address",
  address: "Office Address", whatsapp_number: "WhatsApp Number",
  facebook_url: "Facebook URL", instagram_url: "Instagram URL",
  twitter_url: "Twitter / X URL", youtube_url: "YouTube URL",
  whatsapp_default_message: "Default Message Template",
  smtp_host: "SMTP Host", smtp_port: "SMTP Port", smtp_user: "SMTP Username",
  from_name: "From Name", from_email: "From Email",
  site_title: "Site Title", meta_description: "Meta Description",
  meta_keywords: "Keywords", google_analytics_id: "Google Analytics ID",
};

const TEXTAREA_FIELDS = ["address", "whatsapp_default_message", "meta_description", "meta_keywords"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsAPI.get()
      .then(res => setSettings(res.data ?? {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure your admin panel and website settings"
        action={
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 ${saved ? "bg-green-500 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"}`}>
            <Save className="w-4 h-4" /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-teal-600 text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-teal-200"}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(TAB_FIELDS[activeTab] ?? []).map(key => (
              <div key={key} className={TEXTAREA_FIELDS.includes(key) ? "sm:col-span-2" : ""}>
                {TEXTAREA_FIELDS.includes(key) ? (
                  <FormTextarea label={FIELD_LABELS[key] ?? key} rows={3} value={settings[key] ?? ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
                ) : (
                  <FormInput label={FIELD_LABELS[key] ?? key} value={settings[key] ?? ""} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
