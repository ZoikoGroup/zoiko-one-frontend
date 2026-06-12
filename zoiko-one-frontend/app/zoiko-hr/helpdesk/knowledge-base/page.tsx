"use client";

import { useState } from "react";
import { Plus, Search, X, BookOpen, Eye, ThumbsUp, Calendar, User, ChevronDown, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialKnowledgeArticles, type KnowledgeArticle } from "../mockData";

const CATEGORIES = ["IT", "HR", "Payroll", "Onboarding", "Policy", "Facilities"] as const;
const SORT_OPTIONS = ["Newest", "Most Viewed", "Most Helpful"] as const;

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(initialKnowledgeArticles);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "IT" as KnowledgeArticle["category"],
    tags: "",
    content: "",
    author: "",
  });

  const handleOpenAdd = () => {
    setFormData({ title: "", category: "IT", tags: "", content: "", author: "" });
    setEditingArticle(null);
    setShowModal(true);
  };

  const handleOpenEdit = (article: KnowledgeArticle) => {
    setFormData({
      title: article.title,
      category: article.category,
      tags: article.tags.join(", "),
      content: article.content,
      author: article.author,
    });
    setEditingArticle(article);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const today = new Date().toISOString().split("T")[0];
    if (editingArticle) {
      setArticles(
        articles.map((a) =>
          a.id === editingArticle.id
            ? { ...a, title: formData.title, category: formData.category, tags, content: formData.content, author: formData.author, updatedAt: today }
            : a
        )
      );
    } else {
      const newArticle: KnowledgeArticle = {
        id: `kb-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        tags,
        content: formData.content,
        views: 0,
        helpfulCount: 0,
        createdAt: today,
        updatedAt: today,
        author: formData.author,
      };
      setArticles([newArticle, ...articles]);
    }
    setShowModal(false);
  };

  const sorted = [...articles].sort((a, b) => {
    if (sortBy === "Most Viewed") return b.views - a.views;
    if (sortBy === "Most Helpful") return b.helpfulCount - a.helpfulCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filtered = sorted.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const totalHelpful = articles.reduce((sum, a) => sum + a.helpfulCount, 0);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Knowledge Base"
        description="Self-service library of articles, guides, and FAQs for employees and HR staff."
        action={
          <button type="button" onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Article
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Articles</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{articles.length}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Views</p>
          <h3 className="mt-2 text-3xl font-bold text-indigo-400">{totalViews.toLocaleString()}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Helpful Votes</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-400">{totalHelpful}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search articles by title, content, or tags..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-800 p-12 text-center text-slate-400">
            No articles found matching the selected filters.
          </div>
        ) : filtered.map((article) => {
          const isExpanded = expandedId === article.id;
          return (
            <div key={article.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg transition hover:border-slate-700">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <BookOpen className="h-5 w-5 shrink-0 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getCategoryStyle(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{article.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Updated {article.updatedAt}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views} views</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{article.helpfulCount} helpful</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 mt-1" /> : <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 mt-1" />}
              </button>

              {isExpanded && (
                <div className="border-t border-slate-800 px-6 py-5">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">{article.content}</pre>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Created: {article.createdAt}</span>
                      <span>•</span>
                      <span>Updated: {article.updatedAt}</span>
                    </div>
                    <button type="button" onClick={() => handleOpenEdit(article)}
                      className="rounded-3xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs text-slate-300 transition hover:bg-slate-900">Edit Article</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">{editingArticle ? "Edit Article" : "New Article"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Author *</label>
                  <input type="text" required value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tags (comma separated)</label>
                <input type="text" value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. password, login, security"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Content *</label>
                <textarea required rows={10} value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the article content here..."
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none font-mono" />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  {editingArticle ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}

function getCategoryStyle(category: string) {
  switch (category) {
    case "IT": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "HR": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "Payroll": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Onboarding": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
    case "Policy": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "Facilities": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}
