"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Image, MessageSquare,
  Plus, Pencil, Trash2, X, Search,
  Star, LogOut, Bell, Menu, Mail, Calendar, Clock, Tag, Save,
  AlertTriangle, CheckCircle, ArrowUpRight, Eye, EyeOff,
  Upload, ImagePlus, Loader2, Users, Layers,
} from "lucide-react";
import {
  getArticles, saveArticles, getGallery, saveGallery,
  getMessages, saveMessages, nextId,
  getPageContent, savePageContent, SEED_PAGE_CONTENT,
} from "../../lib/adminStore";

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "Unwrite@2026";

// ─── Image Uploader Component ─────────────────────────────────────────────────
function ImageUploader({ value, onChange, label = "Image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); return; }
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onChange(data.url);
      } else {
        setError("Upload failed. Try again.");
      }
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
          uploading ? "border-white/20 bg-white/5" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
        }`}
        style={{ minHeight: 140 }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

        {/* Preview */}
        {preview && !uploading && (
          <div className="relative w-full h-36">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold">Click to change</p>
            </div>
          </div>
        )}

        {/* Uploading state */}
        {uploading && (
          <div className="flex flex-col items-center justify-center h-36 gap-2">
            <Loader2 size={24} className="text-white/40 animate-spin" />
            <p className="text-neutral-500 text-xs">Uploading...</p>
          </div>
        )}

        {/* Empty state */}
        {!preview && !uploading && (
          <div className="flex flex-col items-center justify-center h-36 gap-2 pointer-events-none">
            <ImagePlus size={24} className="text-neutral-600" />
            <p className="text-neutral-600 text-xs text-center px-4">
              Click or drag & drop to upload image
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl text-sm font-semibold ${
        type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
        : type === "error" ? "bg-red-500/20 border-red-500/30 text-red-300"
        : "bg-blue-500/20 border-blue-500/30 text-blue-300"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
      {msg}
    </motion.div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85 }} animate={{ scale: 1 }}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg">Confirm Delete</h3>
        </div>
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-colors">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({ article, onSave, onClose }) {
  const [form, setForm] = useState(
    article || {
      title: "", excerpt: "", content: "",
      category: "Design",
      readTime: "5 min read",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      author: "Unwrite Team", featured: false, status: "published", src: "",
    }
  );
  const categories = ["Design", "Branding", "Development", "Photography", "AI", "Creative", "Motion"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{article ? "Edit Article" : "New Article"}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><X size={16} className="text-neutral-400" /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-neutral-600" placeholder="Article title..." />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none" placeholder="Short description..." />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Full Content</label>
            <textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={7} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none" placeholder="Detailed article body..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 appearance-none">
                {categories.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 appearance-none">
                <option value="published" className="bg-neutral-900">Published</option>
                <option value="draft" className="bg-neutral-900">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Author</label>
              <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Read Time</label>
              <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="5 min read" />
            </div>
          </div>

          {/* Image Upload */}
          <ImageUploader
            label="Cover Image"
            value={form.src}
            onChange={(url) => setForm({ ...form, src: url })}
          />

          <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/5">
            <button onClick={() => setForm({ ...form, featured: !form.featured })} className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.featured ? "bg-yellow-500/80" : "bg-white/10"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.featured ? "left-5" : "left-1"}`} />
            </button>
            <span className="text-sm text-neutral-300 font-medium">Mark as Featured Article</span>
            {form.featured && <Star size={14} className="text-yellow-400 ml-auto" />}
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"><Save size={14} />Save Article</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Gallery Modal ────────────────────────────────────────────────────────────
function GalleryModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { title: "", category: "Design", src: "", status: "published" });
  const categories = ["Design", "Branding", "UI Design", "Motion", "Print", "Photography", "Development"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{item ? "Edit Gallery Item" : "New Gallery Item"}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"><X size={16} className="text-neutral-400" /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="Work title..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 appearance-none">
                {categories.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 appearance-none">
                <option value="published" className="bg-neutral-900">Published</option>
                <option value="draft" className="bg-neutral-900">Draft</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <ImageUploader
            label="Gallery Image"
            value={form.src}
            onChange={(url) => setForm({ ...form, src: url })}
          />
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"><Save size={14} />Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex items-start gap-4"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        {sub && <p className="text-xs text-neutral-600 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Blog Panel ───────────────────────────────────────────────────────────────
function BlogPanel({ toast }) {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { setArticles(getArticles()); }, []);

  const save = (form) => {
    let updated;
    if (editing) {
      updated = articles.map(a => a.id === editing.id ? { ...form, id: editing.id } : a);
      toast("Article updated successfully!");
    } else {
      updated = [{ ...form, id: nextId(articles) }, ...articles];
      toast("New article created!");
    }
    setArticles(updated); saveArticles(updated);
    setEditing(null); setCreating(false);
  };

  const remove = (id) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated); saveArticles(updated);
    setConfirm(null); toast("Article deleted.", "error");
  };

  const toggleStatus = (id) => {
    const updated = articles.map(a => a.id === id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a);
    setArticles(updated); saveArticles(updated); toast("Status updated!");
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AnimatePresence>
        {(editing || creating) && <ArticleModal article={editing} onSave={save} onClose={() => { setEditing(null); setCreating(false); }} />}
        {confirm && <ConfirmDialog msg={`Delete "${confirm.title}"? This cannot be undone.`} onConfirm={() => remove(confirm.id)} onCancel={() => setConfirm(null)} />}
      </AnimatePresence>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20" />
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-black hover:bg-neutral-200 transition-colors">
          <Plus size={14} />New Article
        </button>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((article, i) => (
            <motion.div key={article.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                {article.src && <img src={article.src} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white text-sm font-bold truncate">{article.title}</p>
                  {article.featured && <Star size={12} className="text-yellow-400 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1"><Tag size={10} />{article.category}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{article.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />{article.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus(article.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${article.status === "published" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20" : "border-neutral-700 text-neutral-500 bg-white/5 hover:bg-white/10"}`}>
                  {article.status}
                </button>
                <button onClick={() => setEditing(article)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Pencil size={13} className="text-neutral-400" /></button>
                <button onClick={() => setConfirm(article)} className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"><Trash2 size={13} className="text-red-400" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="text-center py-16 text-neutral-600 text-sm">No articles found.</div>}
      </div>
    </div>
  );
}

// ─── Gallery Panel ────────────────────────────────────────────────────────────
function GalleryPanel({ toast }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { setItems(getGallery()); }, []);

  const save = (form) => {
    let updated;
    if (editing) {
      updated = items.map(g => g.id === editing.id ? { ...form, id: editing.id } : g);
      toast("Gallery item updated!");
    } else {
      updated = [{ ...form, id: nextId(items) }, ...items];
      toast("New gallery item added!");
    }
    setItems(updated); saveGallery(updated);
    setEditing(null); setCreating(false);
  };

  const remove = (id) => {
    const updated = items.filter(g => g.id !== id);
    setItems(updated); saveGallery(updated);
    setConfirm(null); toast("Gallery item deleted.", "error");
  };

  const filtered = items.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AnimatePresence>
        {(editing || creating) && <GalleryModal item={editing} onSave={save} onClose={() => { setEditing(null); setCreating(false); }} />}
        {confirm && <ConfirmDialog msg={`Delete "${confirm.title}"? This cannot be undone.`} onConfirm={() => remove(confirm.id)} onCancel={() => setConfirm(null)} />}
      </AnimatePresence>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gallery..." className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20" />
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-black hover:bg-neutral-200 transition-colors">
          <Plus size={14} />Add Item
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}
              className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/8 aspect-square"
            >
              {item.src && <img src={item.src} alt={item.title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-bold truncate mb-1">{item.title}</p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest mb-3">{item.category}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(item)} className="flex-1 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-white/30 transition-colors"><Pencil size={10} />Edit</button>
                  <button onClick={() => setConfirm(item)} className="flex-1 py-1.5 rounded-lg bg-red-500/30 backdrop-blur-sm text-red-300 text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-red-500/40 transition-colors"><Trash2 size={10} />Del</button>
                </div>
              </div>
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${item.status === "published" ? "bg-emerald-400" : "bg-neutral-600"}`} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="col-span-4 text-center py-16 text-neutral-600 text-sm">No items found.</div>}
      </div>
    </div>
  );
}

// ─── Messages Panel ───────────────────────────────────────────────────────────
function MessagesPanel({ toast }) {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { 
    fetch("/api/messages").then(r => r.json()).then(setMessages).catch(() => {});
  }, []);

  const markRead = async (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    await fetch("/api/messages", { method: "PATCH", body: JSON.stringify({ id }) }).catch(() => {});
  };

  const remove = async (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setConfirm(null);
    if (selected?.id === id) setSelected(null);
    toast("Message deleted.", "error");
    await fetch("/api/messages", { method: "DELETE", body: JSON.stringify({ id }) }).catch(() => {});
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <AnimatePresence>
        {confirm && <ConfirmDialog msg={`Delete message from "${confirm.name}"?`} onConfirm={() => remove(confirm.id)} onCancel={() => setConfirm(null)} />}
      </AnimatePresence>
      {unread > 0 && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
          <Bell size={14} /><span className="font-semibold">{unread} unread message{unread > 1 ? "s" : ""}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => { setSelected(msg); markRead(msg.id); }}
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selected?.id === msg.id ? "border-white/20 bg-white/[0.06]" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                {msg.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white text-sm font-bold truncate">{msg.name}</p>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                </div>
                <p className="text-neutral-500 text-xs truncate">{msg.message}</p>
                <p className="text-neutral-700 text-[10px] mt-1">{new Date(msg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); setConfirm(msg); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors flex-shrink-0 opacity-0 hover:opacity-100">
                <Trash2 size={12} className="text-red-400" />
              </button>
            </motion.div>
          ))}
          {messages.length === 0 && <div className="text-center py-16 text-neutral-600 text-sm">No messages yet.</div>}
        </div>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 h-fit"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white font-black text-lg">{selected.name.charAt(0)}</div>
                  <div>
                    <p className="text-white font-bold">{selected.name}</p>
                    <p className="text-neutral-500 text-xs">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setConfirm(selected)} className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-neutral-400 capitalize">{selected.userType}</span>
                <span>{new Date(selected.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed border-t border-white/5 pt-5">{selected.message}</p>
              <a href={`mailto:${selected.email}`} className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-neutral-200 transition-colors">
                <Mail size={14} />Reply via Email
              </a>
            </motion.div>
          ) : (
            <motion.div key="empty" className="hidden lg:flex items-center justify-center h-64 text-neutral-700 text-sm rounded-2xl border border-white/5 border-dashed">
              Select a message to view details
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Pages Panel ──────────────────────────────────────────────────────────────
const PAGE_TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const PAGE_FIELDS = {
  home: [
    { key: "heroHeading", label: "Hero Heading", type: "text" },
    { key: "heroSubheading", label: "Hero Subheading", type: "textarea" },
    { key: "heroCTA", label: "CTA Button Text", type: "text" },
    { key: "heroLabel", label: "Badge Label", type: "text" },
    { key: "statsClients", label: "Stat — Clients", type: "text" },
    { key: "statsProjects", label: "Stat — Projects", type: "text" },
    { key: "statsYears", label: "Stat — Years", type: "text" },
    { key: "statsAwards", label: "Stat — Awards", type: "text" },
  ],
  about: [
    { key: "heroHeading", label: "Hero Heading", type: "text" },
    { key: "heroSubheading", label: "Hero Subheading", type: "textarea" },
    { key: "missionTitle", label: "Mission Title", type: "text" },
    { key: "missionText", label: "Mission Text", type: "textarea" },
    { key: "founderName", label: "Founder Name", type: "text" },
    { key: "founderTitle", label: "Founder Title", type: "text" },
    { key: "founderBio", label: "Founder Bio", type: "textarea" },
    { key: "teamSize", label: "Team Size", type: "text" },
    { key: "founded", label: "Founded Year", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ],
  services: [
    { key: "heroHeading", label: "Hero Heading", type: "text" },
    { key: "heroSubheading", label: "Hero Subheading", type: "textarea" },
    { key: "service1Title", label: "Service 1 — Title", type: "text" },
    { key: "service1Desc", label: "Service 1 — Description", type: "textarea" },
    { key: "service2Title", label: "Service 2 — Title", type: "text" },
    { key: "service2Desc", label: "Service 2 — Description", type: "textarea" },
    { key: "service3Title", label: "Service 3 — Title", type: "text" },
    { key: "service3Desc", label: "Service 3 — Description", type: "textarea" },
    { key: "service4Title", label: "Service 4 — Title", type: "text" },
    { key: "service4Desc", label: "Service 4 — Description", type: "textarea" },
  ],
  contact: [
    { key: "heroHeading", label: "Hero Heading", type: "text" },
    { key: "heroSubheading", label: "Hero Subheading", type: "textarea" },
    { key: "email", label: "Contact Email", type: "text" },
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "location", label: "Office Location", type: "text" },
    { key: "responseTime", label: "Response Time", type: "text" },
  ],
};

function PagesPanel({ toast }) {
  const [activePage, setActivePage] = useState("home");
  const [content, setContent] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setContent(getPageContent());
    setDirty(false);
  }, []);

  const handleChange = (page, key, value) => {
    setContent(prev => ({ ...prev, [page]: { ...prev[page], [key]: value } }));
    setDirty(true);
  };

  const handleSave = () => {
    savePageContent(content);
    setDirty(false);
    toast("Page content saved!");
  };

  const handleReset = (page) => {
    setContent(prev => ({ ...prev, [page]: { ...SEED_PAGE_CONTENT[page] } }));
    setDirty(true);
    toast("Reset to default values. Click Save to confirm.", "info");
  };

  if (!content) return null;

  const fields = PAGE_FIELDS[activePage] || [];
  const pageData = content[activePage] || {};

  return (
    <div>
      {/* Page Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {PAGE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              activePage === tab.id
                ? "bg-white text-black border-white"
                : "bg-white/5 text-neutral-400 border-white/8 hover:border-white/20 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={pageData[field.key] || ""}
                  onChange={e => handleChange(activePage, field.key, e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-neutral-600 resize-none transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={pageData[field.key] || ""}
                  onChange={e => handleChange(activePage, field.key, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
        <button
          onClick={() => handleReset(activePage)}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all ${
            dirty
              ? "bg-white text-black hover:bg-neutral-200"
              : "bg-white/10 text-neutral-600 cursor-not-allowed"
          }`}
        >
          <Save size={14} />
          {dirty ? "Save Changes" : "All Changes Saved"}
        </button>
      </div>

      {/* Info note */}
      <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs leading-relaxed">
        <strong>Note:</strong> Changes saved here are stored in your browser. To make these edits live on the actual pages, the page components need to be wired to read from this store. This panel is ready for that integration.
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardPanel() {
  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => { 
    setArticles(getArticles()); 
    setGallery(getGallery()); 
    fetch("/api/messages").then(r => r.json()).then(setMessages).catch(() => {});
  }, []);
  
  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Articles" value={articles.length} sub={`${articles.filter(a => a.status === "published").length} published`} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={Image} label="Gallery Items" value={gallery.length} sub={`${gallery.filter(g => g.status === "published").length} visible`} color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={MessageSquare} label="Messages" value={messages.length} sub={`${unread} unread`} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={Star} label="Featured" value={articles.filter(a => a.featured).length} sub="Featured articles" color="bg-yellow-500/20 text-yellow-400" />
      </div>
      <div>
        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4">Recent Messages</h3>
        <div className="space-y-2">
          {messages.slice(0, 3).map(msg => (
            <div key={msg.id} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white font-black text-sm flex-shrink-0">{msg.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-bold">{msg.name}</p>
                  {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </div>
                <p className="text-neutral-600 text-xs truncate">{msg.message}</p>
              </div>
              <p className="text-neutral-700 text-[10px] flex-shrink-0">{new Date(msg.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4">Recent Articles</h3>
        <div className="space-y-2">
          {articles.slice(0, 4).map(a => (
            <div key={a.id} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">{a.src && <img src={a.src} alt="" className="w-full h-full object-cover" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{a.title}</p>
                <p className="text-neutral-600 text-xs">{a.category} · {a.author}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${a.status === "published" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-neutral-700 text-neutral-500 bg-white/5"}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const attempt = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("uw_admin_auth", "1");
      onLogin();
    } else {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <span className="text-black font-black text-2xl tracking-tighter">U</span>
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Unwrite Admin</h1>
          <p className="text-neutral-600 text-sm mt-1">Enter password to continue</p>
        </div>

        <motion.form
          animate={shaking ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={attempt}
          className="bg-white/[0.03] border border-white/8 rounded-3xl p-7 space-y-4"
        >
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Admin password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 placeholder:text-neutral-600 pr-12"
              autoFocus
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1.5">
                <AlertTriangle size={12} />{error}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-white text-black font-black text-sm hover:bg-neutral-200 transition-colors">
            Access Dashboard
          </button>
        </motion.form>

        <p className="text-center text-neutral-700 text-xs mt-6">
          Unwrite Studios · Admin Panel
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "pages", label: "Pages", icon: Layers },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastState, setToastState] = useState(null);
  const [messages, setMessages] = useState([]);

  // Check session on mount
  useEffect(() => {
    const ok = sessionStorage.getItem("uw_admin_auth") === "1";
    setAuthed(ok);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (authed) {
      fetch("/api/messages").then(r => r.json()).then(setMessages).catch(() => {});
    }
  }, [authed, active]);

  const logout = () => {
    sessionStorage.removeItem("uw_admin_auth");
    setAuthed(false);
  };

  const unread = messages.filter(m => !m.read).length;
  const toast = (msg, type = "success") => setToastState({ msg, type, key: Date.now() });

  const panels = {
    dashboard: <DashboardPanel />,
    blog: <BlogPanel toast={toast} />,
    gallery: <GalleryPanel toast={toast} />,
    messages: <MessagesPanel toast={toast} />,
    pages: <PagesPanel toast={toast} />,
  };

  const titles = {
    dashboard: "Overview",
    blog: "Blog Management",
    gallery: "Gallery Management",
    messages: "Contact Messages",
    pages: "Page Management",
  };

  if (checking) return <div className="min-h-screen bg-[#080808]" />;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="flex-shrink-0 h-screen sticky top-0 border-r border-white/5 bg-[#0a0a0a] flex flex-col overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-6 border-b border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-xs">U</span>
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-white font-black text-sm tracking-tight">Unwrite</p>
              <p className="text-neutral-600 text-[10px] uppercase tracking-widest">Admin</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => {
            const badge = id === "messages" && unread > 0 ? unread : null;
            return (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${active === id ? "bg-white text-black" : "text-neutral-500 hover:text-white hover:bg-white/5"}`}
              >
                <Icon size={17} className="flex-shrink-0" />
                {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 truncate">{label}</motion.span>}
                {sidebarOpen && badge && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto bg-blue-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{badge}</motion.span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1 flex-shrink-0">
          <a href="/" target="_blank" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold ${!sidebarOpen ? "justify-center" : ""}`}>
            <ArrowUpRight size={17} className="flex-shrink-0" />
            {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Visit Site</motion.span>}
          </a>
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold ${!sidebarOpen ? "justify-center" : ""}`}>
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Logout</motion.span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors">
            <Menu size={16} className="text-neutral-400" />
          </button>
          <h1 className="text-white font-black text-lg tracking-tight">{titles[active]}</h1>
          <div className="ml-auto flex items-center gap-3">
            {unread > 0 && active !== "messages" && (
              <button onClick={() => setActive("messages")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold">
                <Bell size={12} />{unread} new
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-black text-xs">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              {panels[active]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastState && <Toast key={toastState.key} msg={toastState.msg} type={toastState.type} onClose={() => setToastState(null)} />}
      </AnimatePresence>
    </div>
  );
}
