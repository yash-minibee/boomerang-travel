import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Save, User, Lock, Mail, Camera, Calendar, Activity, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import { FormInput } from "../components/ui/FormFields";
import { authAPI, mediaAPI, imageUrl } from "../api/api";

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    avatar_url: user?.avatar_url || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "media");

    try {
      const res = await mediaAPI.upload(fd);
      const url = res.data.url;
      setFormData((prev) => ({ ...prev, avatar_url: url }));
      
      // Auto-save the avatar directly to the user profile database for quick feedback
      await authAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        avatar_url: url,
      });
      updateUserData({ ...user, avatar_url: url });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Form validations
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: formData.name,
        email: formData.email,
        avatar_url: formData.avatar_url,
      };
      if (formData.password) {
        body.password = formData.password;
      }

      const res = await authAPI.updateProfile(body);
      updateUserData(res.data);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        alert(err.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="Manage your administrator account credentials and view session history"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar & Details Overview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Accent Gradient */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 z-0" />

            {/* Avatar container */}
            <div className="relative mt-8 mb-4 z-10 group cursor-pointer" onClick={handleAvatarClick}>
              {formData.avatar_url ? (
                <img
                  src={imageUrl(formData.avatar_url)}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md transition-all group-hover:opacity-85"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-white shadow-md">
                  {formData.name?.[0] ?? "A"}
                </div>
              )}
              {/* Overlay with camera icon */}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="z-10 space-y-1">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 capitalize">
                {(user?.role ?? "editor").replace('_', ' ')}
              </div>
            </div>

            <div className="w-full border-t border-gray-100 mt-6 pt-6 text-left space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Account Created</p>
                  <p className="font-semibold text-gray-700">{formatDate(user?.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Last Login</p>
                  <p className="font-semibold text-gray-700">{formatDate(user?.last_login)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Forms */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Edit Profile Settings</h3>
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl flex items-center gap-3 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Profile updated successfully!</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Aryan Kapoor"
                required
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="admin@boomerang.com"
                required
              />
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6 space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Security & Password</h4>
                <p className="text-xs text-gray-400 mt-1">Leave password fields blank if you do not want to change it</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                  <FormInput
                    label="New Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-[38px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-teal-600/10 hover:shadow-teal-600/20"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
