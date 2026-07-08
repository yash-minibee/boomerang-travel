import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, ChevronDown, ChevronUp, Upload, Check, Utensils, Bus, Tag, Image as ImageIcon, Star } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { FormInput, FormSelect, FormTextarea } from "../components/ui/FormFields";
import { cruisesAPI, mediaAPI, cruiseDestinationsAPI, cabinsGlobalAPI, imageUrl } from "../api/api";

const STEPS = ["Basic Info", "Gallery & Highlights", "Itinerary", "Cabins", "Inclusions & Policies"];
const MEAL_OPTIONS = ["All Inclusive", "Breakfast Included", "Full Board", "Half Board", "Specialty Dining", "Buffet Access"];
const TRANSPORT_OPTIONS = ["Cruise Ship", "Ferry", "Tender Boat", "Shore Excursion Bus", "Flight"];
const CABIN_AMENITY_SUGGESTIONS = ["Balcony", "Ocean View", "King Bed", "Queen Bed", "Twin Bed", "Jacuzzi", "Mini Bar", "Room Service", "Butler Service", "En-suite Bath", "Smart TV", "Safe Deposit", "Sofa Bed", "Desk Space"];
const TAG_SUGGESTIONS = ["Best Seller", "Popular", "Seasonal", "Ultra Luxury", "Adventure", "Honeymoon Special", "Group Tour", "Family Friendly", "Budget Pick", "New", "Limited Seats"];

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
              <X className="w-3.5 h-3.5" />
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

export default function AddCruisePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Step 0 — Basic Info
  const [form, setForm] = useState({ name: "", slug: "", category: "", destination: "", duration: "", price: "", rating: "", reviews: "", status: "active" });
  const [tags, setTags] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [globalCabinsList, setGlobalCabinsList] = useState([]);
  const [showAddCabinModal, setShowAddCabinModal] = useState(false);
  const [activeCabinIndex, setActiveCabinIndex] = useState(null);

  useEffect(() => {
    cruiseDestinationsAPI.list({ limit: 100 })
      .then(res => setDestinationsList(res.data ?? []))
      .catch(e => console.error("Error loading cruise destinations:", e));

    cabinsGlobalAPI.list({ limit: 100 })
      .then(res => setGlobalCabinsList(res.data ?? []))
      .catch(e => console.error("Error loading global cabins:", e));
  }, []);

  // Step 1 — Gallery & Highlights
  const [gallery, setGallery] = useState([]); // array of URL strings
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const galleryFileRef = useRef();
  const [highlights, setHighlights] = useState([""]);

  // Step 2 — Itinerary
  const [itinerary, setItinerary] = useState([{ day: 1, title: "", city: "", description: "", meals: [], transport: [] }]);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Step 3 — Cabins (replacing Hotels step)
  const [cabins, setCabins] = useState([{ name: "", type: "Balcony", capacity: "2 Adults", size: "220 sq ft", rating: "5", imagePreview: "", amenities: [] }]);
  const [cabinUploading, setCabinUploading] = useState({});

  // Step 4 — Inclusions & Policies
  const [inclusions, setInclusions] = useState([""]);
  const [exclusions, setExclusions] = useState([""]);
  const [policies, setPolicies] = useState({ cancellation: "", refund: "", payment: "" });

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateItinerary = (i, field, val) => setItinerary(a => a.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  const updateCabin = (i, field, val) => setCabins(c => c.map((cab, idx) => idx === i ? { ...cab, [field]: val } : cab));
  const addListItem = setter => setter(a => [...a, ""]);
  const updateListItem = (setter, i, v) => setter(a => a.map((x, idx) => idx === i ? v : x));
  const removeListItem = (setter, i) => setter(a => a.filter((_, idx) => idx !== i));

  // Load existing cruise data when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);

    Promise.all([
      cruisesAPI.getById(id).then(r => r.data),
      cruisesAPI.getItinerary(id).then(r => r.data ?? []).catch(() => []),
      cruisesAPI.getCabins(id).then(r => r.data ?? []).catch(() => []),
    ]).then(([cruise, itin, cabs]) => {
      if (!cruise) { navigate("/cruises"); return; }

      setForm({
        name: cruise.title ?? "",
        slug: cruise.slug ?? "",
        category: cruise.category ?? "",
        destination: cruise.cruise_destination_id ?? "",
        duration: cruise.duration ?? "",
        price: cruise.starting_price ?? "",
        rating: cruise.rating ?? "",
        reviews: cruise.review_count ?? "",
        status: cruise.status ?? "active",
      });
      setTags(Array.isArray(cruise.tags) ? cruise.tags : []);
      setGallery(Array.isArray(cruise.gallery) ? cruise.gallery : []);
      setHighlights(cruise.highlights?.length ? cruise.highlights : [""]);
      setInclusions(cruise.inclusions?.length ? cruise.inclusions : [""]);
      setExclusions(cruise.exclusions?.length ? cruise.exclusions : [""]);
      setPolicies({
        cancellation: cruise.policy_cancellation ?? "",
        refund: cruise.policy_refund ?? "",
        payment: cruise.policy_payment ?? "",
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

      if (cabs.length) {
        setCabins(cabs.map(c => ({
          name: c.name ?? "",
          type: c.type ?? "Balcony",
          capacity: c.capacity ?? "2 Adults",
          size: c.size ?? "220 sq ft",
          rating: String(c.star_rating ?? 5),
          imagePreview: c.image_url ?? "",
          amenities: Array.isArray(c.amenities) ? c.amenities : [],
        })));
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async () => {
    if (Object.values(cabinUploading).some(Boolean)) {
      alert("Please wait — cabin image is still uploading.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.name,
        slug: form.slug,
        category: form.category,
        cruise_destination_id: form.destination ? Number(form.destination) : null,
        duration: form.duration,
        starting_price: form.price,
        rating: form.rating ? Number(form.rating) : 0,
        review_count: form.reviews ? Number(form.reviews) : 0,
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

      let cruiseId = id;
      if (isEdit) {
        await cruisesAPI.update(id, payload);
      } else {
        const res = await cruisesAPI.create(payload);
        cruiseId = res.data?.id;
      }

      if (cruiseId) {
        const days = itinerary.filter(d => d.title).map((d, idx) => ({
          day_number: idx + 1, title: d.title, city: d.city,
          description: d.description, meals: d.meals, transport: d.transport,
        }));
        if (days.length) await cruisesAPI.saveItinerary(cruiseId, days);

        const cabs = cabins.filter(c => c.name.trim()).map(c => ({
          name: c.name.trim(),
          type: c.type,
          capacity: c.capacity,
          size: c.size,
          star_rating: Number(c.rating),
          image_url: c.imagePreview && !c.imagePreview.startsWith("data:") ? c.imagePreview : null,
          amenities: c.amenities,
        }));
        await cruisesAPI.saveCabins(cruiseId, cabs);
      }

      navigate("/cruises");
    } catch (err) {
      alert(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDestination = async (destForm) => {
    try {
      const res = await cruiseDestinationsAPI.create({
        name: destForm.name,
        country: destForm.country,
        region: destForm.region,
        description: destForm.description,
        featured: destForm.featured,
        hero_image: destForm.hero_image,
        highlights: destForm.highlights,
      });
      if (res.data) {
        setDestinationsList(prev => [...prev, res.data]);
        updateForm("destination", String(res.data.id));
        setShowAddDestModal(false);
        return res.data;
      }
    } catch (err) {
      alert("Failed to save destination: " + (err.message || "Unknown error"));
      throw err;
    }
  };

  const handleAddCabin = async (cabinForm) => {
    try {
      const res = await cabinsGlobalAPI.create({
        name: cabinForm.name,
        type: cabinForm.type,
        capacity: cabinForm.capacity,
        size: cabinForm.size,
        star_rating: cabinForm.star_rating,
        image_url: cabinForm.image_url,
        amenities: cabinForm.amenities,
      });
      if (res.data) {
        setGlobalCabinsList(prev => [...prev, res.data]);
        if (activeCabinIndex !== null) {
          updateCabin(activeCabinIndex, "name", res.data.name);
          updateCabin(activeCabinIndex, "type", res.data.type);
          updateCabin(activeCabinIndex, "capacity", res.data.capacity);
          updateCabin(activeCabinIndex, "size", res.data.size);
          updateCabin(activeCabinIndex, "rating", String(res.data.star_rating ?? "5"));
          updateCabin(activeCabinIndex, "imagePreview", res.data.image_url ?? "");
          updateCabin(activeCabinIndex, "amenities", res.data.amenities ?? []);
        }
        setShowAddCabinModal(false);
        return res.data;
      }
    } catch (err) {
      alert("Failed to save cabin: " + (err.message || "Unknown error"));
      throw err;
    }
  };

  const handleCabinImageFile = async (i, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => updateCabin(i, "imagePreview", e.target.result);
    reader.readAsDataURL(file);

    setCabinUploading(u => ({ ...u, [i]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "cruises");
      const res = await mediaAPI.upload(fd);
      const url = res.data?.url;
      if (url) updateCabin(i, "imagePreview", url);
    } catch (err) {
      alert("Upload failed: " + err.message);
      updateCabin(i, "imagePreview", "");
    } finally {
      setCabinUploading(u => ({ ...u, [i]: false }));
    }
  };

  // ── Step 0: Basic Info ──────────────────────────────────────────────────
  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormInput label="Cruise Title *" placeholder="e.g. Greek Isles & Adriatic Luxury Cruise" value={form.name}
        onChange={e => updateForm("name", e.target.value)} />
      <FormInput label="Slug (optional)" placeholder="e.g. greek-isles-adriatic-cruise" value={form.slug}
        onChange={e => updateForm("slug", e.target.value)} />
      <FormSelect label="Category" value={form.category} onChange={e => updateForm("category", e.target.value)}>
        <option value="">Select category</option>
        {["Luxury", "Premium", "River Cruise", "Family", "Adventure", "Wellness"].map(c => <option key={c}>{c}</option>)}
      </FormSelect>
      <div className="space-y-1.5 col-span-1">
        <label className="text-sm font-semibold text-gray-700 block">Cruise Destination *</label>
        <div className="flex gap-2 items-center">
          <SearchableDestinationSelect
            destinations={destinationsList}
            value={form.destination}
            onChange={val => updateForm("destination", val)}
          />
          <button
            type="button"
            onClick={() => setShowAddDestModal(true)}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors border border-teal-200"
            title="Create new destination inline"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <FormInput label="Duration" placeholder="e.g. 10 Days / 9 Nights" value={form.duration}
        onChange={e => updateForm("duration", e.target.value)} />
      <FormInput label="Starting Price ($)" type="number" placeholder="e.g. 3499" value={form.price}
        onChange={e => updateForm("price", e.target.value)} />
      <FormInput label="Rating (0.0 - 5.0)" type="number" step="0.1" min="0" max="5" placeholder="e.g. 4.9" value={form.rating}
        onChange={e => updateForm("rating", e.target.value)} />
      <FormInput label="No. of Reviews" type="number" min="0" placeholder="e.g. 110" value={form.reviews}
        onChange={e => updateForm("reviews", e.target.value)} />
      <FormSelect label="Status" value={form.status} onChange={e => updateForm("status", e.target.value)}>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
      </FormSelect>

      <div className="sm:col-span-2">
        <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-teal-600" /> Cruise Tags
        </label>
        <TagInput tags={tags} onChange={setTags} placeholder="e.g. Bestseller, Romantic…" suggestions={TAG_SUGGESTIONS} />
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
        fd.append("type", "cruises");
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
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Cover & Gallery Images
          <span className="ml-2 text-xs font-normal text-gray-400">(first image = cover photo)</span>
        </label>
        <div className="flex gap-2 mb-4">
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Or paste image URL here…"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300" />
          <button type="button" onClick={addGalleryUrl} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
            Add URL
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl w-full sm:w-48 aspect-video cursor-pointer hover:border-teal-300 bg-gray-50 group transition-colors">
            <Upload className="w-6 h-6 text-gray-300 group-hover:text-teal-400 mb-1" />
            <span className="text-xs text-gray-500 font-semibold">{uploading ? "Uploading…" : "Add Images"}</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryFileUpload} disabled={uploading} />
          </label>
          <span className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</span>
        </div>

        {gallery.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Gallery ({gallery.length} image{gallery.length !== 1 ? "s" : ""})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((url, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-150 border border-gray-250">
                  <img src={imageUrl(url)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> Cover
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i !== 0 && (
                      <button type="button" onClick={() => moveFirst(i)}
                        title="Set as cover"
                        className="w-8 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-colors cursor-pointer">
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={() => removeGalleryImage(i)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer">
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
      </div>

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Cruise Highlights</label>
        </div>
        <textarea
          value={highlights.join("\n")}
          onChange={e => setHighlights(e.target.value.split("\n"))}
          placeholder="Enter each highlight on a new line&#10;e.g. Scenic sailing through Geirangerfjord&#10;Gourmet dining by Michelin chefs"
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-y"
        />
        {highlights.filter(h => h.trim()).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {highlights.filter(h => h.trim()).map((h, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200/60">
                ★ {h}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">Each new line will be stored as a separate highlight point (see preview above).</p>
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
          className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Day
        </button>
      </div>

      {itinerary.map((day, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          {/* Header */}
          <button type="button" onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left cursor-pointer">
            <span className="font-semibold text-sm text-gray-800 flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{day.day}</span>
              <span className="truncate max-w-[160px]">{day.title || `Day ${day.day}`}</span>
              {day.city && <span className="hidden sm:inline text-xs text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 shrink-0">{day.city}</span>}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1">
                {day.meals.length > 0 && <span title="Meals" className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"><Utensils className="w-2.5 h-2.5 text-amber-600" /></span>}
                {day.transport.length > 0 && <span title="Transport" className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><Bus className="w-2.5 h-2.5 text-blue-600" /></span>}
              </div>
              {itinerary.length > 1 && (
                <button type="button" onClick={e => { e.stopPropagation(); setItinerary(a => a.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 }))); }}
                  className="p-1 text-red-400 hover:text-red-600 cursor-pointer">
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
                <FormInput label="Day Title *" placeholder="e.g. Arrival in Venice"
                  value={day.title} onChange={e => updateItinerary(i, "title", e.target.value)} />
                <FormInput label="Port / City *" placeholder="e.g. Venice"
                  value={day.city} onChange={e => updateItinerary(i, "city", e.target.value)} />
                <div className="sm:col-span-2">
                  <FormTextarea label="Description" rows={3} placeholder="Describe the day's port calls, shore excursions or ship board activities..."
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
                  <Bus className="w-3.5 h-3.5" /> Transit / Excursion Mode
                </p>
                <TransportSelector selected={day.transport} onChange={v => updateItinerary(i, "transport", v)} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ── Step 3: Cabins (replacing Hotels step) ───────────────────────────────
  const renderCabins = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Cruise Cabins & Suites</h3>
        <button type="button"
          onClick={() => setCabins(c => [...c, { name: "", type: "Balcony", capacity: "2 Adults", size: "220 sq ft", rating: "5", imagePreview: "", amenities: [] }])}
          className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700 cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Cabin
        </button>
      </div>

      {cabins.map((cabin, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl bg-white">
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 rounded-t-2xl">
            <span className="text-sm font-bold text-gray-700">
              Cabin {i + 1}{cabin.name ? ` — ${cabin.name}` : ""}
            </span>
            {cabins.length > 1 && (
              <button type="button" onClick={() => setCabins(c => c.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-500 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-5 space-y-5">
            {/* Auto-populate from database */}
            <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  Auto-populate from Database
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCabinIndex(i);
                    setShowAddCabinModal(true);
                  }}
                  className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer font-sans"
                >
                  + Add New Cabin to DB
                </button>
              </div>
              <SearchableCabinSelect
                cabins={globalCabinsList}
                onSelect={(selectedCabin) => {
                  updateCabin(i, "name", selectedCabin.name);
                  updateCabin(i, "type", selectedCabin.type);
                  updateCabin(i, "capacity", selectedCabin.capacity);
                  updateCabin(i, "size", selectedCabin.size);
                  updateCabin(i, "rating", String(selectedCabin.star_rating ?? "5"));
                  updateCabin(i, "imagePreview", selectedCabin.image_url ?? "");
                  updateCabin(i, "amenities", selectedCabin.amenities ?? []);
                }}
              />
            </div>

            {/* Cabin Image */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Cabin Room Photo</label>
              {cabin.imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden h-40 bg-gray-100 border border-gray-200">
                  <img src={imageUrl(cabin.imagePreview)} alt="Cabin preview" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => updateCabin(i, "imagePreview", "")}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer bg-gray-50 group">
                  <Upload className="w-7 h-7 text-gray-300 group-hover:text-teal-400 mb-2 transition-colors" />
                  <span className="text-sm text-gray-500 font-medium">Upload cabin photo</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => handleCabinImageFile(i, e.target.files[0])} />
                </label>
              )}
              <div className="mt-2.5">
                <input
                  type="url"
                  value={cabin.imagePreview?.startsWith("http") ? cabin.imagePreview : ""}
                  onChange={e => updateCabin(i, "imagePreview", e.target.value)}
                  onBlur={e => { if (e.target.value && !cabin.imagePreview?.startsWith("data:")) updateCabin(i, "imagePreview", e.target.value); }}
                  placeholder="Or paste image URL…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>

            {/* Name, Type dropdown, Capacity, Size, Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <FormInput label="Cabin Name *" placeholder="e.g. Deluxe Oceanview Suite"
                  value={cabin.name} onChange={e => updateCabin(i, "name", e.target.value)} />
              </div>
              <FormSelect label="Cabin Type *" value={cabin.type} onChange={e => updateCabin(i, "type", e.target.value)}>
                {["Interior", "Oceanview", "Balcony", "Suite"].map(t => <option key={t} value={t}>{t}</option>)}
              </FormSelect>
              <FormInput label="Capacity" placeholder="e.g. 2 Adults"
                value={cabin.capacity} onChange={e => updateCabin(i, "capacity", e.target.value)} />
              <FormInput label="Size" placeholder="e.g. 240 sq ft"
                value={cabin.size} onChange={e => updateCabin(i, "size", e.target.value)} />
            </div>

            {/* Hidden Star Rating but sent as 5 for data compatibility */}
            <div className="hidden">
              <FormSelect label="Star Rating" value={cabin.rating} onChange={e => updateCabin(i, "rating", e.target.value)}>
                {[3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </FormSelect>
            </div>

            {/* Amenity tags */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-600" /> Cabin Amenities
              </label>
              <TagInput
                inputId={`cabin-amenities-${i}`}
                tags={cabin.amenities}
                onChange={v => updateCabin(i, "amenities", v)}
                placeholder="e.g. King Bed, Mini Bar, Room Service…"
                suggestions={CABIN_AMENITY_SUGGESTIONS}
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
        </div>
        <textarea
          value={inclusions.join("\n")}
          onChange={e => setInclusions(e.target.value.split("\n"))}
          placeholder="Enter each inclusion on a new line&#10;e.g. All shipboard meals&#10;Access to pools and fitness center&#10;Port fees and taxes"
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-y"
        />
        {inclusions.filter(item => item.trim()).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {inclusions.filter(item => item.trim()).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200/60">
                ✓ {item}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1 mb-4">Each new line will be stored as a separate inclusion point (see preview above).</p>
      </div>

      {/* Exclusions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <X className="w-4 h-4 text-red-400" /> Exclusions
          </label>
        </div>
        <textarea
          value={exclusions.join("\n")}
          onChange={e => setExclusions(e.target.value.split("\n"))}
          placeholder="Enter each exclusion on a new line&#10;e.g. Shore excursion fees&#10;Specialty dining restaurants&#10;Personal shopping"
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-y"
        />
        {exclusions.filter(item => item.trim()).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {exclusions.filter(item => item.trim()).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200/60">
                ✕ {item}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">Each new line will be stored as a separate exclusion point (see preview above).</p>
      </div>

      {/* Policies */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-gray-100">Policies</h3>
        <FormTextarea label="Cancellation Policy" rows={2} placeholder="e.g. Free cancellation up to 45 days before sailing…"
          value={policies.cancellation} onChange={e => setPolicies(p => ({ ...p, cancellation: e.target.value }))} />
        <FormTextarea label="Refund Policy" rows={2} placeholder="e.g. Refunds processed within 14 business days…"
          value={policies.refund} onChange={e => setPolicies(p => ({ ...p, refund: e.target.value }))} />
        <FormTextarea label="Payment Policy" rows={2} placeholder="e.g. 25% deposit at booking. Balance due 90 days before sailing…"
          value={policies.payment} onChange={e => setPolicies(p => ({ ...p, payment: e.target.value }))} />
      </div>
    </div>
  );

  const stepContent = [renderBasicInfo, renderGallery, renderItinerary, renderCabins, renderInclusions];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Cruise" : "Add New Cruise"}
        subtitle={isEdit ? "Update the cruise details below" : "Fill in the details step by step to create a luxury cruise"}
      />

      {/* Step indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button key={i} type="button" onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer
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
            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer">
            Previous
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/cruises")}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer">
                Next Step
              </button>
            ) : (
              <button type="button" onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer">
                {saving ? "Saving..." : isEdit ? "Update Cruise" : "Save Cruise"}
              </button>
            )}
          </div>
        </div>
      </div>
      <AddDestinationModal
        open={showAddDestModal}
        onClose={() => setShowAddDestModal(false)}
        onSave={handleAddDestination}
      />
      <AddCabinModal
        open={showAddCabinModal}
        onClose={() => setShowAddCabinModal(false)}
        onSave={handleAddCabin}
      />
    </div>
  );
}

// Inline destination modal helper
function AddDestinationModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("Europe");
  const [featured, setFeatured] = useState("0");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [highlights, setHighlights] = useState([""]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setHeroImage(e.target.result);
    reader.readAsDataURL(file);
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

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        country: country.trim(),
        region,
        description: description.trim(),
        featured: Number(featured),
        hero_image: heroImage || null,
        highlights: highlights.filter(Boolean),
      });
    } catch (err) {
      // handled in parent callback
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50" />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto z-10 space-y-4">
            <h3 className="font-extrabold text-gray-900 text-lg">Add Cruise Destination</h3>
            <form onSubmit={submit} className="space-y-4">
              <FormInput label="Destination Name *" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Santorini" />
              <FormInput label="Country *" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. Greece" />
              <FormSelect label="Region" value={region} onChange={e => setRegion(e.target.value)}>
                {["Asia", "Africa", "North America", "South America", "Antarctica", "Europe", "Australia/Oceania/Pacific"].map(r => <option key={r}>{r}</option>)}
              </FormSelect>
              <FormSelect label="Featured" value={featured} onChange={e => setFeatured(e.target.value)}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </FormSelect>
              <FormTextarea label="Description" rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of destination..." />

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Hero Image</label>
                {heroImage && (
                  <div className="relative rounded-xl overflow-hidden h-28 mb-2 bg-gray-50">
                    <img src={imageUrl(heroImage)} alt="Hero" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setHeroImage("")} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 border border-gray-250 hover:border-teal-300 rounded-xl p-3 bg-gray-50 cursor-pointer justify-center">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{uploading ? "Uploading..." : "Upload photo"}</span>
                  <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />
                </label>
                <div className="mt-2">
                  <input
                    type="url"
                    value={heroImage?.startsWith("http") ? heroImage : ""}
                    onChange={e => setHeroImage(e.target.value)}
                    placeholder="Or paste image URL…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Highlights</label>
                </div>
                <textarea
                  value={highlights.join("\n")}
                  onChange={e => setHighlights(e.target.value.split("\n"))}
                  placeholder="Enter each highlight on a new line&#10;e.g. Best sunset views&#10;Volcanic beaches"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-300 resize-y"
                />
                {highlights.filter(h => h.trim()).length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {highlights.filter(h => h.trim()).map((h, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200/50">
                        ★ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 shrink-0">
                <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 cursor-pointer">
                  {saving ? "Saving..." : "Add Destination"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchableDestinationSelect({ destinations, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDest = destinations.find(d => String(d.id) === String(value));
  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.country && d.country.toLowerCase().includes(search.toLowerCase())) ||
    (d.region && d.region.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(""); }}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white min-h-[46px] text-left cursor-pointer"
      >
        {selectedDest ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-teal-50 border border-gray-100">
              {selectedDest.hero_image ? (
                <img src={imageUrl(selectedDest.hero_image)} alt={selectedDest.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50 text-xs font-bold font-mono">
                  {selectedDest.name[0]}
                </div>
              )}
            </div>
            <div>
              <span className="font-semibold text-gray-800">{selectedDest.name}</span>
              <span className="text-gray-400 text-xs ml-1.5">({selectedDest.region})</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Select destination</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-2 space-y-2 max-h-80 flex flex-col">
          <div className="relative shrink-0">
            <input
              type="text"
              autoFocus
              placeholder="Search destination..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-gray-50"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 max-h-48">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onChange(String(d.id));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors ${String(d.id) === String(value) ? "bg-teal-50/70 text-teal-800 font-semibold" : "text-gray-700"}`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-teal-50 border border-gray-100">
                    {d.hero_image ? (
                      <img src={imageUrl(d.hero_image)} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50 text-xs font-bold font-mono">
                        {d.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-xs sm:text-sm text-gray-800">{d.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">{d.country} · {d.region}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-gray-400">
                No destinations found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline cabin modal helper
function AddCabinModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Suite");
  const [capacity, setCapacity] = useState("2 guests");
  const [size, setSize] = useState("250 sq ft");
  const [starRating, setStarRating] = useState("5");
  const [amenities, setAmenities] = useState([]);
  const [imageUrlStr, setImageUrlStr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setImageUrlStr(e.target.result);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { alert("Cabin name is required."); return; }
    setSaving(true);
    try {
      await onSave({
        name,
        type,
        capacity,
        size,
        star_rating: Number(starRating),
        image_url: imageUrlStr || null,
        amenities: amenities.filter(Boolean),
      });
      // Reset form
      setName("");
      setType("Suite");
      setCapacity("2 guests");
      setSize("250 sq ft");
      setStarRating("5");
      setAmenities([]);
      setImageUrlStr("");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full z-[101] max-h-[90vh] overflow-y-auto flex flex-col font-sans"
          >
            <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4 shrink-0">Add New Cabin to Database</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Cabin Name *</label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Grand Penthouse Suite"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Cabin Type *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                  >
                    {["Suite", "Balcony", "Oceanview", "Inside"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Capacity</label>
                  <input
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    placeholder="e.g. 2 guests"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Size</label>
                  <input
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    placeholder="e.g. 350 sq ft"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Star Rating *</label>
                  <select
                    value={starRating}
                    onChange={e => setStarRating(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                  >
                    {[3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cabin Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">Cabin Image</label>
                {imageUrlStr && !imageUrlStr.startsWith("data:") ? (
                  <div className="relative rounded-xl overflow-hidden h-32 bg-gray-100">
                    <img src={imageUrl(imageUrlStr)} alt="Cabin preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageUrlStr("")}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : imageUrlStr.startsWith("data:") ? (
                  <div className="relative rounded-xl overflow-hidden h-32 bg-gray-100">
                    <img src={imageUrlStr} alt="Uploading…" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-xl py-2 px-3 hover:border-teal-400 hover:text-teal-600 text-gray-500 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 shrink-0" />
                    {uploading ? "Uploading..." : imageUrlStr ? "Change Image" : "Upload Image"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={e => handleImageUpload(e.target.files[0])} />
                </div>
                <div>
                  <input
                    type="url"
                    value={imageUrlStr?.startsWith("http") ? imageUrlStr : ""}
                    onChange={e => setImageUrlStr(e.target.value)}
                    placeholder="Or paste image URL…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Amenities</label>
                <TagInput
                  tags={amenities}
                  onChange={setAmenities}
                  placeholder="e.g. WiFi, Mini Bar, Room Service…"
                  suggestions={CABIN_AMENITY_SUGGESTIONS}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 shrink-0">
                <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50">
                  {saving ? "Saving..." : "Add Cabin"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Custom Searchable Cabin dropdown with pictures, capacity, size, and amenities preview
function SearchableCabinSelect({ cabins, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCabins = cabins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.type && c.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(""); }}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white min-h-[46px] text-left cursor-pointer"
      >
        <span className="text-gray-500 font-medium font-sans text-xs">-- Search & Select a cabin from DB --</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-2 space-y-2 max-h-80 flex flex-col font-sans">
          <div className="relative shrink-0">
            <input
              type="text"
              autoFocus
              placeholder="Search cabin name or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-gray-50 font-sans"
            />
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 max-h-56">
            {filteredCabins.length > 0 ? (
              filteredCabins.map(c => {
                const imgSrc = imageUrl(c.image_url);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-start gap-3 px-3 py-2.5 text-left text-sm hover:bg-teal-50 rounded-xl transition-colors text-gray-700 font-sans"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-teal-50 border border-gray-100">
                      {imgSrc ? (
                        <img src={imgSrc} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-600 bg-teal-50 text-xs font-bold font-mono">
                          {c.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-gray-800 text-xs sm:text-sm">{c.name}</p>
                        <span className="text-[10px] text-teal-600 font-bold shrink-0">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                        {c.capacity} · {c.size}
                      </p>
                      {c.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="bg-gray-100 text-gray-600 text-[9px] font-medium px-1.5 py-0.5 rounded">
                              {a}
                            </span>
                          ))}
                          {c.amenities.length > 3 && (
                            <span className="text-gray-400 text-[9px] font-medium self-center">
                              +{c.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4 text-xs text-gray-400">
                No cabins found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
