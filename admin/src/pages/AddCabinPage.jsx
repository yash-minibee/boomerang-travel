import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormSelect } from "../components/ui/FormFields";
import { cabinsGlobalAPI, mediaAPI, imageUrl } from "../api/api";

const AMENITY_SUGGESTIONS = [
  "Floor-to-ceiling balcony windows", "King-size premium bed", "En-suite marble bathroom",
  "24-hour cabin service", "WiFi", "Mini-bar", "Sitting area", "Panoramic ocean window",
  "Private jacuzzi on balcony", "Separate living area", "Dining table", "Personal butler service",
  "Priority boarding", "Private veranda with loungers", "Convertible twin/queen beds",
  "Writing desk", "Flat-screen TV", "Smart TV with virtual window view", "Two twin beds",
  "Compact desk", "Air Conditioning", "Coffee Maker"
];

// Reusable TagInput component
function TagInput({ tags, onChange, placeholder = "Type and press Enter", suggestions = [], inputId }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const uid = inputId ?? ("taginput-" + placeholder.slice(0, 10));

  const addTag = (val) => {
    const v = val.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
    setOpen(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="relative">
      <div
        className="min-h-[44px] flex flex-wrap gap-1.5 items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-300 bg-white cursor-text"
        onClick={() => document.getElementById(uid)?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="hover:text-red-500 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          id={uid}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-44 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addTag(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add · Backspace to remove last</p>
    </div>
  );
}

export default function AddCabinPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: "", type: "Suite", capacity: "2 guests", size: "250 sq ft", star_rating: "5" });
  const [amenities, setAmenities] = useState([]);
  const [imageUrlStr, setImageUrlStr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const fileRef = useRef();

  // Load existing data in edit mode
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    cabinsGlobalAPI.get(id)
      .then((res) => {
        const c = res.data;
        if (!c) {
          navigate("/cabins");
          return;
        }
        setForm({
          name: c.name ?? "",
          type: c.type ?? "Suite",
          capacity: c.capacity ?? "2 guests",
          size: c.size ?? "250 sq ft",
          star_rating: String(c.star_rating ?? "5"),
        });
        setImageUrlStr(c.image_url ?? "");
        setAmenities(c.amenities?.length ? c.amenities : []);
      })
      .catch(() => navigate("/cabins"))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageUrlStr(e.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "cabins");
      const res = await mediaAPI.upload(fd);
      if (res.data?.url) setImageUrlStr(res.data.url);
    } catch (err) {
      alert("Image upload failed: " + (err.message || "error"));
      setImageUrlStr("");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Cabin name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        capacity: form.capacity,
        size: form.size,
        star_rating: Number(form.star_rating),
        image_url: imageUrlStr || null,
        amenities: amenities.filter(Boolean),
      };
      if (isEdit) {
        await cabinsGlobalAPI.update(id, payload);
      } else {
        await cabinsGlobalAPI.create(payload);
      }
      navigate("/cabins");
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
        title={isEdit ? "Edit Cabin" : "Add Cabin"}
        subtitle={isEdit ? `Editing ${form.name}` : "Add a new cabin type to the global database"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label="Cabin Name *"
              placeholder="e.g. Grand Penthouse Suite"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />
            <FormSelect
              label="Cabin Type *"
              value={form.type}
              onChange={(e) => updateForm("type", e.target.value)}
            >
              {["Suite", "Balcony", "Oceanview", "Inside"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FormSelect>
            <FormInput
              label="Capacity"
              placeholder="e.g. 2 guests"
              value={form.capacity}
              onChange={(e) => updateForm("capacity", e.target.value)}
            />
            <FormInput
              label="Size"
              placeholder="e.g. 350 sq ft"
              value={form.size}
              onChange={(e) => updateForm("size", e.target.value)}
            />
            <FormSelect
              label="Star Rating"
              value={form.star_rating}
              onChange={(e) => updateForm("star_rating", e.target.value)}
            >
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ★ Stars
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-teal-600" /> Amenities
            </label>
            <TagInput
              tags={amenities}
              onChange={setAmenities}
              placeholder="e.g. Private balcony, Ocean views, WiFi…"
              suggestions={AMENITY_SUGGESTIONS}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-55 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              {saving ? "Saving..." : isEdit ? "Update Cabin" : "Save Cabin"}
            </button>
            <button
              onClick={() => navigate("/cabins")}
              className="border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Column: Cabin Image */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-sm font-bold text-gray-800">Cabin Image</h3>
          {imageUrlStr ? (
            <div className="relative rounded-2xl overflow-hidden h-52 bg-gray-100">
              <img
                src={imageUrl(imageUrlStr)}
                alt="Cabin preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrlStr("")}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-teal-300 transition-colors cursor-pointer bg-gray-50 group">
              <Upload className="w-8 h-8 text-gray-300 group-hover:text-teal-400 mb-2 transition-colors" />
              <span className="text-sm text-gray-500 font-medium">Upload photo</span>
              <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </label>
          )}

          {/* OR Paste URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400">Or Paste Image URL</label>
            <input
              type="url"
              value={imageUrlStr.startsWith("http") ? imageUrlStr : ""}
              onChange={(e) => setImageUrlStr(e.target.value)}
              placeholder="https://example.com/cabin.jpg"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
