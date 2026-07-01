import { useNavigate, useParams } from "react-router-dom";
import { Upload, Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormSelect, FormTextarea } from "../components/ui/FormFields";
import { destinationsAPI, mediaAPI, imageUrl } from "../api/api";

export default function AddDestinationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "", country: "", region: "Europe", description: "", featured: "0" });
  const [highlights, setHighlights] = useState([""]);
  const [heroImage, setHeroImage] = useState(""); // URL string
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const fileRef = useRef();

  // Load existing data in edit mode
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    destinationsAPI.get(id)
      .then(res => {
        const d = res.data;
        if (!d) { navigate("/destinations"); return; }
        setForm({
          name: d.name ?? "",
          country: d.country ?? "",
          region: d.region ?? "Europe",
          description: d.description ?? "",
          featured: String(d.featured ?? "0"),
        });
        setHeroImage(d.hero_image ?? "");
        setHighlights(d.highlights?.length ? d.highlights : [""]);
      })
      .catch(() => navigate("/destinations"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (file) => {
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => setHeroImage(e.target.result);
    reader.readAsDataURL(file);
    // Upload to backend
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "destinations");
      const res = await mediaAPI.upload(fd);
      if (res.data?.url) setHeroImage(res.data.url);
    } catch (err) {
      alert("Image upload failed: " + (err.message || "error"));
      setHeroImage("");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert("Destination name is required."); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        country: form.country,
        region: form.region,
        description: form.description,
        featured: Number(form.featured),
        hero_image: heroImage || null,
        highlights: highlights.filter(Boolean),
      };
      if (isEdit) {
        await destinationsAPI.update(id, payload);
      } else {
        await destinationsAPI.create(payload);
      }
      navigate("/destinations");
    } catch (err) {
      alert(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Destination" : "Add Destination"}
        subtitle={isEdit ? "Update destination details" : "Add a new destination to the platform"}
      />
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Destination Name *" placeholder="e.g. Santorini"
            value={form.name} onChange={e => updateForm("name", e.target.value)} />
          <FormInput label="Country *" placeholder="e.g. Greece"
            value={form.country} onChange={e => updateForm("country", e.target.value)} />

          <FormSelect label="Region" value={form.region} onChange={e => updateForm("region", e.target.value)}>
            {["Asia", "Africa", "North America", "South America", "Antarctica", "Europe", "Australia/Oceania"].map(r => <option key={r}>{r}</option>)}
          </FormSelect>

          <FormSelect label="Featured" value={form.featured} onChange={e => updateForm("featured", e.target.value)}>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </FormSelect>

          <div className="sm:col-span-2">
            <FormTextarea label="Description" rows={3} placeholder="Brief description of the destination..."
              value={form.description} onChange={e => updateForm("description", e.target.value)} />
          </div>

          {/* Hero Image */}
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-gray-700 block mb-3">Hero Image</label>
            {heroImage && !heroImage.startsWith("data:") ? (
              <div className="relative rounded-2xl overflow-hidden h-48 mb-3 bg-gray-100">
                <img src={imageUrl(heroImage)} alt="Hero" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setHeroImage("")}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : heroImage.startsWith("data:") ? (
              <div className="relative rounded-2xl overflow-hidden h-48 mb-3 bg-gray-100">
                <img src={heroImage} alt="Uploading…" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : null}

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer bg-gray-50 group"
              onClick={() => fileRef.current?.click()}>
              <Upload className="w-7 h-7 text-gray-300 group-hover:text-teal-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">
                {uploading ? "Uploading…" : heroImage ? "Replace image" : "Upload hero image"}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP · max 5MB · Recommended 1920×1080px</span>
            </label>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={e => handleImageUpload(e.target.files[0])} />

            <div className="mt-2.5">
              <input type="url" value={heroImage?.startsWith("http") ? heroImage : ""} placeholder="Or paste image URL…"
                onChange={e => setHeroImage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>

          {/* Highlights */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Highlights</label>
              <button type="button" onClick={() => setHighlights(h => [...h, ""])}
                className="text-teal-600 text-sm font-medium flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input value={h} onChange={e => setHighlights(arr => arr.map((a, idx) => idx === i ? e.target.value : a))}
                    placeholder={`e.g. Best sunset views`}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                  {highlights.length > 1 && (
                    <button type="button" onClick={() => setHighlights(arr => arr.filter((_, idx) => idx !== i))}
                      className="w-9 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => navigate("/destinations")}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving || uploading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60">
            {saving ? "Saving…" : isEdit ? "Update Destination" : "Save Destination"}
          </button>
        </div>
      </div>
    </div>
  );
}
