import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, ChevronDown, ChevronUp, Upload, Check, Utensils, Bus, Tag, Image as ImageIcon, Star } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormSelect, FormTextarea } from "../components/ui/FormFields";
import { packagesAPI, mediaAPI, imageUrl } from "../api/api";

const STEPS = ["Basic Info", "Gallery & Highlights", "Itinerary", "Hotels", "Inclusions & Policies"];
const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Welcome Drink", "High Tea"];
const TRANSPORT_OPTIONS = ["Flight", "Train", "Bus", "Private Car", "Ferry", "Cable Car", "Cruise", "Tuk-Tuk", "Speedboat"];
const AMENITY_SUGGESTIONS = ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Bar", "Concierge", "Butler Service", "Ocean View", "Mountain View", "Canal View", "Beach Access", "Airport Transfer", "Rooftop", "Fine Dining"];
const TAG_SUGGESTIONS = ["Best Seller", "Popular", "Seasonal", "Ultra Luxury", "Adventure", "Honeymoon Special", "Group Tour", "Solo Friendly", "Family Friendly", "Budget Pick", "New", "Limited Seats"];

// ─── Multi-tag input component ────────────────────────────────────────────────
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
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
  };

  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

  return (
    <div className="relative">
      <div
        className="min-h-[44px] flex flex-wrap gap-1.5 items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-teal-300 bg-white cursor-text"
        onClick={() => document.getElementById(uid)?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-red-500 ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          id={uid}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={handleKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] text-sm outline-none bg-transparent placeholder-gray-400"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-44 overflow-y-auto">
          {filtered.map(s => (
            <button key={s} type="button" onMouseDown={() => addTag(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add · Backspace to remove last</p>
    </div>
  );
}

// ─── Meal checkbox pills ──────────────────────────────────────────────────────
function MealSelector({ selected, onChange }) {
  const toggle = m => onChange(selected.includes(m) ? selected.filter(x => x !== m) : [...selected, m]);
  return (
    <div className="flex flex-wrap gap-2">
      {MEAL_OPTIONS.map(m => (
        <button key={m} type="button" onClick={() => toggle(m)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
            ${selected.includes(m) ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"}`}>
          {selected.includes(m) && <Check className="w-3 h-3" />}{m}
        </button>
      ))}
    </div>
  );
}

// ─── Transport chip selector ──────────────────────────────────────────────────
function TransportSelector({ selected, onChange }) {
  const toggle = t => onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);
  return (
    <div className="flex flex-wrap gap-2">
      {TRANSPORT_OPTIONS.map(t => (
        <button key={t} type="button" onClick={() => toggle(t)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
            ${selected.includes(t) ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"}`}>
          {selected.includes(t) && <Check className="w-3 h-3" />}{t}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddPackagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Step 0 — Basic Info
  const [form, setForm] = useState({ name: "", slug: "", category: "", destination: "", duration: "", price: "", status: "active" });
  const [tags, setTags] = useState([]);

  // Step 1 — Gallery & Highlights
  const [gallery, setGallery] = useState([]); // array of URL strings
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const galleryFileRef = useRef();
  const [highlights, setHighlights] = useState([""]);

  // Step 2 — Itinerary
  const [itinerary, setItinerary] = useState([{ day: 1, title: "", city: "", description: "", meals: [], transport: [] }]);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Step 3 — Hotels (with image + city dropdown + amenity tags)
  const [hotels, setHotels] = useState([{ name: "", city: "", rating: "5", imagePreview: "", amenities: [] }]);
  const [hotelUploading, setHotelUploading] = useState({});

  // Step 4 — Inclusions & Policies
  const [inclusions, setInclusions] = useState([""]);
  const [exclusions, setExclusions] = useState([""]);
  const [policies, setPolicies] = useState({ cancellation: "", refund: "", payment: "" });

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateItinerary = (i, field, val) => setItinerary(a => a.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  const updateHotel = (i, field, val) => setHotels(h => h.map((ht, idx) => idx === i ? { ...ht, [field]: val } : ht));
  const addListItem = setter => setter(a => [...a, ""]);
  const updateListItem = (setter, i, v) => setter(a => a.map((x, idx) => idx === i ? v : x));
  const removeListItem = (setter, i) => setter(a => a.filter((_, idx) => idx !== i));

  // ── Load existing package data when editing ───────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);

    Promise.all([
      packagesAPI.getById(id).then(r => r.data),
      packagesAPI.getItinerary(id).then(r => r.data ?? []).catch(() => []),
      packagesAPI.getHotels(id).then(r => r.data ?? []).catch(() => []),
    ]).then(([pkg, itin, htls]) => {
      if (!pkg) { navigate("/packages"); return; }

      setForm({
        name: pkg.title ?? "",
        slug: pkg.slug ?? "",
        category: pkg.category ?? "",
        destination: pkg.destination_region ?? "",
        duration: pkg.duration ?? "",
        price: pkg.starting_price ?? "",
        status: pkg.status ?? "active",
      });
      setTags(Array.isArray(pkg.tags) ? pkg.tags : []);
      setGallery(Array.isArray(pkg.gallery) ? pkg.gallery : []);
      setHighlights(pkg.highlights?.length ? pkg.highlights : [""]);
      setInclusions(pkg.inclusions?.length ? pkg.inclusions : [""]);
      setExclusions(pkg.exclusions?.length ? pkg.exclusions : [""]);
      setPolicies({
        cancellation: pkg.policy_cancellation ?? "",
        refund: pkg.policy_refund ?? "",
        payment: pkg.policy_payment ?? "",
      });

      if (itin.length) {
        setItinerary(itin.map(d => ({
          day: d.day_number,
          title: d.title ?? "",
          city: d.city ?? "",
          description: d.description ?? "",
          meals: Array.isArray(d.meals) ? d.meals : [],
          transport: Array.isArray(d.transport) ? d.transport : [],
        })));
      }

      if (htls.length) {
        setHotels(htls.map(h => ({
          name: h.name ?? "",
          city: h.city ?? "",
          rating: String(h.star_rating ?? 5),
          imagePreview: h.image_url ?? "",
          amenities: Array.isArray(h.amenities) ? h.amenities : [],
        })));
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Block if any hotel image is still uploading
    if (Object.values(hotelUploading).some(Boolean)) {
      alert("Please wait — hotel image is still uploading.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.name,
        slug: form.slug,
        category: form.category,
        destination_region: form.destination,
        duration: form.duration,
        starting_price: form.price,
        status: form.status,
        tags,
        gallery,
        cover_image: gallery[0] ?? null,
        highlights: highlights.filter(Boolean),
        inclusions: inclusions.filter(Boolean),
        exclusions: exclusions.filter(Boolean),
        policy_cancellation: policies.cancellation,
        policy_refund: policies.refund,
        policy_payment: policies.payment,
      };

      let pkgId = id;
      if (isEdit) {
        await packagesAPI.update(id, payload);
      } else {
        const res = await packagesAPI.create(payload);
        pkgId = res.data?.id;
      }

      if (pkgId) {
        const days = itinerary.filter(d => d.title).map((d, idx) => ({
          day_number: idx + 1, title: d.title, city: d.city,
          description: d.description, meals: d.meals, transport: d.transport,
        }));
        if (days.length) await packagesAPI.saveItinerary(pkgId, days);

        // Always save hotels (even empty array clears existing ones on edit)
        const htls = hotels.filter(h => h.name.trim()).map(h => ({
          name: h.name.trim(),
          city: h.city,
          star_rating: Number(h.rating),
          // Strip base64 previews — only pass real URLs (http or relative path)
          image_url: h.imagePreview && !h.imagePreview.startsWith("data:") ? h.imagePreview : null,
          amenities: h.amenities,
        }));
        await packagesAPI.saveHotels(pkgId, htls);
      }

      navigate("/packages");
    } catch (err) {
      alert(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // Cities derived from itinerary for hotel city dropdown
  const itineraryCities = [...new Set(itinerary.map(d => d.city).filter(Boolean))];

  // Hotel image preview from URL or file — uploads to media API, stores returned URL
  const handleHotelImageFile = async (i, file) => {
    if (!file) return;
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = e => updateHotel(i, "imagePreview", e.target.result);
    reader.readAsDataURL(file);
    // Upload to backend and replace preview with real URL
    setHotelUploading(u => ({ ...u, [i]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "hotels");
      const res = await mediaAPI.upload(fd);
      const url = res.data?.url;
      if (url) updateHotel(i, "imagePreview", url);
    } catch (err) {
      alert("Image upload failed: " + (err.message || "Unknown error"));
      updateHotel(i, "imagePreview", "");
    } finally {
      setHotelUploading(u => ({ ...u, [i]: false }));
    }
  };

  // ── Step 0: Basic Info ────────────────────────────────────────────────────
  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormInput label="Package Name *" placeholder="e.g. European Grand Tour" value={form.name}
        onChange={e => { updateForm("name", e.target.value); updateForm("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} />
      <FormInput label="Slug *" placeholder="european-grand-tour" value={form.slug}
        onChange={e => updateForm("slug", e.target.value)} />
      <FormSelect label="Category" value={form.category} onChange={e => updateForm("category", e.target.value)}>
        <option value="">Select category</option>
        {["Cultural", "Luxury", "Adventure", "Wellness", "Honeymoon", "Trekking"].map(c => <option key={c}>{c}</option>)}
      </FormSelect>
      <FormSelect label="Destination Region" value={form.destination} onChange={e => updateForm("destination", e.target.value)}>
        <option value="">Select destination</option>
        {["Europe", "Asia", "Americas", "Africa", "Islands", "Middle East"].map(d => <option key={d}>{d}</option>)}
      </FormSelect>
      <FormInput label="Duration" placeholder="e.g. 14 Days / 13 Nights" value={form.duration}
        onChange={e => updateForm("duration", e.target.value)} />
      <FormInput label="Starting Price ($)" type="number" placeholder="e.g. 2999" value={form.price}
        onChange={e => updateForm("price", e.target.value)} />
      <FormSelect label="Status" value={form.status} onChange={e => updateForm("status", e.target.value)}>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
      </FormSelect>

      {/* ── Tags field ── */}
      <div className="sm:col-span-2">
        <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-teal-600" /> Package Tags
        </label>
        <TagInput tags={tags} onChange={setTags} placeholder="e.g. Best Seller, Popular…" suggestions={TAG_SUGGESTIONS} />
      </div>
    </div>
  );

  // ── Step 1: Gallery & Highlights ─────────────────────────────────────────
  const handleGalleryFileUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("type", "packages");
        const res = await mediaAPI.upload(fd);
        const url = res.data?.url;
        if (url) setGallery(g => [...g, url]);
      }
    } catch (err) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addGalleryUrl = () => {
    const url = urlInput.trim();
    if (url && !gallery.includes(url)) setGallery(g => [...g, url]);
    setUrlInput("");
  };

  const removeGalleryImage = (i) => setGallery(g => g.filter((_, idx) => idx !== i));
  const moveFirst = (i) => setGallery(g => [g[i], ...g.filter((_, idx) => idx !== i)]);

  const renderGallery = () => (
    <div className="space-y-6">
      {/* Upload zone */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Cover & Gallery Images
          <span className="ml-2 text-xs font-normal text-gray-400">(first image = cover photo)</span>
        </label>

        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer bg-gray-50 group"
          onClick={() => galleryFileRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-300 group-hover:text-teal-400 mb-2 transition-colors" />
          <p className="text-gray-500 text-sm font-medium">
            {uploading ? "Uploading…" : "Click or drag to upload images"}
          </p>
          <p className="text-gray-400 text-xs mt-1">PNG, JPG, WebP · max 5MB each · multiple files allowed</p>
        </label>
        <input
          ref={galleryFileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleGalleryFileUpload}
        />
      </div>

      {/* Paste URL */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Or paste an image URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addGalleryUrl())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
          />
          <button type="button" onClick={addGalleryUrl}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
            Add
          </button>
        </div>
      </div>

      {/* Preview grid */}
      {gallery.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Gallery ({gallery.length} image{gallery.length !== 1 ? "s" : ""})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((url, i) => (
              <div key={i} className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-100">
                <img src={imageUrl(url)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                {/* Cover badge */}
                {i === 0 && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Cover
                  </span>
                )}
                {/* Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {i !== 0 && (
                    <button type="button" onClick={() => moveFirst(i)}
                      title="Set as cover"
                      className="w-8 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-colors">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeGalleryImage(i)}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="absolute bottom-1 right-2 text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity">#{i + 1}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Hover an image · ⭐ = set as cover · ✕ = remove</p>
        </div>
      )}

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Trip Highlights</label>
          <button type="button" onClick={() => addListItem(setHighlights)} className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2.5">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={h} onChange={e => updateListItem(setHighlights, i, e.target.value)}
                placeholder="e.g. Gondola ride in Venice"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
              {highlights.length > 1 && (
                <button type="button" onClick={() => removeListItem(setHighlights, i)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Step 2: Itinerary ────────────────────────────────────────────────────
  const renderItinerary = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Day-by-Day Itinerary</h3>
        <button type="button"
          onClick={() => setItinerary(a => [...a, { day: a.length + 1, title: "", city: "", description: "", meals: [], transport: [] }])}
          className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700">
          <Plus className="w-3.5 h-3.5" /> Add Day
        </button>
      </div>

      {itinerary.map((day, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
          {/* Header */}
          <button type="button" onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
            <span className="font-semibold text-sm text-gray-800 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{day.day}</span>
              <span className="truncate max-w-[160px]">{day.title || `Day ${day.day}`}</span>
              {day.city && <span className="hidden sm:inline text-xs text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 shrink-0">{day.city}</span>}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {/* mini status dots */}
              <div className="hidden sm:flex items-center gap-1">
                {day.meals.length > 0 && <span title="Meals" className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"><Utensils className="w-2.5 h-2.5 text-amber-600" /></span>}
                {day.transport.length > 0 && <span title="Transport" className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><Bus className="w-2.5 h-2.5 text-blue-600" /></span>}
              </div>
              {itinerary.length > 1 && (
                <button type="button" onClick={e => { e.stopPropagation(); setItinerary(a => a.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }))); }}
                  className="p-1 text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              {openAccordion === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </button>

          {/* Body */}
          {openAccordion === i && (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Day Title *" placeholder="e.g. Arrival in Rome"
                  value={day.title} onChange={e => updateItinerary(i, "title", e.target.value)} />
                <FormInput label="City *" placeholder="e.g. Rome"
                  value={day.city} onChange={e => updateItinerary(i, "city", e.target.value)} />
                <div className="sm:col-span-2">
                  <FormTextarea label="Description" rows={3} placeholder="Describe the day's activities..."
                    value={day.description} onChange={e => updateItinerary(i, "description", e.target.value)} />
                </div>
              </div>

              {/* Tag 2 — Meals */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 space-y-3">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5" /> Meals Included
                </p>
                <MealSelector selected={day.meals} onChange={v => updateItinerary(i, "meals", v)} />
              </div>

              {/* Tag 3 — Transport */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                  <Bus className="w-3.5 h-3.5" /> Transport Mode
                </p>
                <TransportSelector selected={day.transport} onChange={v => updateItinerary(i, "transport", v)} />
              </div>
            </div>
          )}
        </div>
      ))}

      {itineraryCities.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 rounded-2xl p-4 text-sm">
          <span className="font-semibold text-gray-600">Cities added:</span>
          {itineraryCities.map(c => (
            <span key={c} className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">{c}</span>
          ))}
        </div>
      )}
    </div>
  );

  // ── Step 3: Hotels ───────────────────────────────────────────────────────
  const renderHotels = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Hotels</h3>
        <button type="button"
          onClick={() => setHotels(h => [...h, { name: "", city: "", rating: "5", imagePreview: "", amenities: [] }])}
          className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700">
          <Plus className="w-3.5 h-3.5" /> Add Hotel
        </button>
      </div>

      {itineraryCities.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 flex items-start gap-2">
          <span className="text-base shrink-0">💡</span>
          <span>Add cities in the <strong>Itinerary</strong> step first — the city dropdown here will auto-populate from those entries.</span>
        </div>
      )}

      {hotels.map((hotel, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
            <span className="text-sm font-bold text-gray-700">
              Hotel {i + 1}{hotel.name ? ` — ${hotel.name}` : ""}
            </span>
            {hotels.length > 1 && (
              <button type="button" onClick={() => setHotels(h => h.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-5 space-y-5">
            {/* Hotel Image */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Hotel Image</label>
              {hotel.imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden h-40 bg-gray-100">
                <img src={imageUrl(hotel.imagePreview)} alt="Hotel preview" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => updateHotel(i, "imagePreview", "")}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer bg-gray-50 group">
                  <Upload className="w-7 h-7 text-gray-300 group-hover:text-teal-400 mb-2 transition-colors" />
                  <span className="text-sm text-gray-500 font-medium">Upload hotel photo</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handleHotelImageFile(i, e.target.files[0])} />
                </label>
              )}
              {/* OR paste URL */}
              <div className="mt-2.5">
                <input
                  type="url"
                  value={hotel.imagePreview?.startsWith("http") ? hotel.imagePreview : ""}
                  onChange={e => updateHotel(i, "imagePreview", e.target.value)}
                  onBlur={e => { if (e.target.value && !hotel.imagePreview?.startsWith("data:")) updateHotel(i, "imagePreview", e.target.value); }}
                  placeholder="Or paste image URL…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>

            {/* Name, City dropdown, Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput label="Hotel Name *" placeholder="e.g. Hotel de Russie"
                value={hotel.name} onChange={e => updateHotel(i, "name", e.target.value)} />

              {/* City from itinerary */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">City *</label>
                {itineraryCities.length > 0 ? (
                  <select value={hotel.city} onChange={e => updateHotel(i, "city", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white">
                    <option value="">Select city</option>
                    {itineraryCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input value={hotel.city} onChange={e => updateHotel(i, "city", e.target.value)}
                    placeholder="e.g. Rome (add cities in Itinerary)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                )}
              </div>

              <FormSelect label="Star Rating" value={hotel.rating} onChange={e => updateHotel(i, "rating", e.target.value)}>
                {[3, 4, 5].map(n => <option key={n} value={n}>{n} ★ Stars</option>)}
              </FormSelect>
            </div>

            {/* Amenity tags */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-600" /> Amenities / Tags
              </label>
              <TagInput
                inputId={`hotel-amenities-${i}`}
                tags={hotel.amenities}
                onChange={v => updateHotel(i, "amenities", v)}
                placeholder="e.g. Pool, Spa, Ocean View…"
                suggestions={AMENITY_SUGGESTIONS}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Step 4: Inclusions & Policies ────────────────────────────────────────
  const renderInclusions = () => (
    <div className="space-y-6">
      {/* Inclusions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" /> Inclusions
          </label>
          <button type="button" onClick={() => addListItem(setInclusions)} className="text-teal-600 text-sm font-medium flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {inclusions.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input value={item} onChange={e => updateListItem(setInclusions, i, e.target.value)}
                placeholder={`e.g. Daily breakfast`}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
              {inclusions.length > 1 && (
                <button type="button" onClick={() => removeListItem(setInclusions, i)}
                  className="w-9 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exclusions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <X className="w-4 h-4 text-red-400" /> Exclusions
          </label>
          <button type="button" onClick={() => addListItem(setExclusions)} className="text-teal-600 text-sm font-medium flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {exclusions.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input value={item} onChange={e => updateListItem(setExclusions, i, e.target.value)}
                placeholder={`e.g. International flights`}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
              {exclusions.length > 1 && (
                <button type="button" onClick={() => removeListItem(setExclusions, i)}
                  className="w-9 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Policies */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-gray-100">Policies</h3>
        <FormTextarea label="Cancellation Policy" rows={2} placeholder="e.g. Free cancellation up to 30 days before departure…"
          value={policies.cancellation} onChange={e => setPolicies(p => ({ ...p, cancellation: e.target.value }))} />
        <FormTextarea label="Refund Policy" rows={2} placeholder="e.g. Refunds processed within 7–10 business days…"
          value={policies.refund} onChange={e => setPolicies(p => ({ ...p, refund: e.target.value }))} />
        <FormTextarea label="Payment Policy" rows={2} placeholder="e.g. 30% deposit at booking. Balance 45 days before…"
          value={policies.payment} onChange={e => setPolicies(p => ({ ...p, payment: e.target.value }))} />
      </div>
    </div>
  );

  const stepContent = [renderBasicInfo, renderGallery, renderItinerary, renderHotels, renderInclusions];

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Package" : "Add New Package"}
        subtitle={isEdit ? "Update the package details below" : "Fill in the details step by step to create a travel package"}
      />

      {/* Step indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button key={i} type="button" onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${i === step ? "bg-teal-600 text-white shadow-md" : i < step ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-white text-gray-400 border border-gray-200"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
              ${i === step ? "bg-white text-teal-600" : i < step ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"}`}>
              {i < step ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            {s}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div>
          {stepContent.map((render, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: i === step ? 1 : 0, x: i === step ? 0 : 12 }}
              transition={{ duration: 0.25 }}
              style={{ display: i === step ? "block" : "none" }}
            >
              {render()}
            </motion.div>
          ))}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/packages")}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors">
                Next Step
              </button>
            ) : (
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-60">
                {saving ? "Saving..." : isEdit ? "Update Package" : "Save Package"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
