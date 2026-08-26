"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Twitter, User } from "lucide-react";
import { useParams } from "next/navigation";
import { getArticles } from "../../../lib/adminStore";

function formatBodyContent(content = "") {
  const lines = content.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const blocks = [];
  let listItems = [];
  let quote = null;

  const flushParagraph = () => {
    if (lines.length > 0) {
      const paragraph = lines.shift();
      if (paragraph) blocks.push({ type: "paragraph", text: paragraph });
    }
  };

  while (lines.length > 0) {
    const line = lines[0];

    if (line.startsWith(">")) {
      quote = line.replace(/^>\s*/, "");
      lines.shift();
      blocks.push({ type: "quote", text: quote });
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      listItems.push(line.replace(/^[-•]\s*/, ""));
      lines.shift();
      continue;
    }

    if (listItems.length) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }

    flushParagraph();
  }

  if (listItems.length) {
    blocks.push({ type: "list", items: listItems });
  }

  return blocks;
}

export default function BlogPost() {
  const params = useParams();
  const articleId = params?.id;
  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.35], [0, -36]);
  const contentY = useTransform(scrollYProgress, [0, 0.35], [0, -16]);

  useEffect(() => {
    const loadArticle = () => {
      const allArticles = getArticles();
      setArticles(allArticles);
      const found = allArticles.find((item) => String(item.id) === String(articleId));
      setArticle(found || null);
    };

    loadArticle();
    window.addEventListener("storage", loadArticle);
    return () => window.removeEventListener("storage", loadArticle);
  }, [articleId]);

  const relatedPosts = useMemo(() => {
    if (!article) return [];
    return articles
      .filter((item) => item.id !== article.id && item.status !== "draft")
      .slice(0, 3);
  }, [article, articles]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[11px] font-black uppercase tracking-[0.25em] text-white/80">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <AnimatePresence mode="wait">
          {article ? (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-8 overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
            >
              <motion.div
                style={{ y: imageY }}
                className="relative h-[42vh] min-h-[320px] overflow-hidden"
              >
                <img src={article.src} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
              </motion.div>

              <motion.div style={{ y: contentY }} className="p-6 md:p-10">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-[0.25em]">
                    Story
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-[9px] font-black uppercase tracking-[0.25em]">
                    {article.category}
                  </span>
                </div>

                <h1 className="max-w-4xl text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-5 text-xs text-neutral-400 pb-6 mb-6 border-b border-white/5">
                  <div className="flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 border border-white/5">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">
                      {article.author?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 border border-white/5">
                    <Calendar size={12} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 border border-white/5">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/5 bg-black/30 p-6 md:p-8">
                  <div className="space-y-5 text-[15px] md:text-base leading-8 text-neutral-200">
                    {formatBodyContent(article.content || article.excerpt).map((block, i) => {
                      if (block.type === "quote") {
                        return (
                          <blockquote key={i} className="border-l-2 border-white/20 pl-4 italic text-neutral-100 bg-white/[0.03] rounded-r-xl py-2">
                            “{block.text}”
                          </blockquote>
                        );
                      }

                      if (block.type === "list") {
                        return (
                          <ul key={i} className="space-y-2 list-disc pl-5 text-neutral-200">
                            {block.items.map((item, idx) => (
                              <li key={idx} className="leading-7">{item}</li>
                            ))}
                          </ul>
                        );
                      }

                      return <p key={i} className="text-justify">{block.text}</p>;
                    })}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-neutral-500 mb-3">Share article</p>
                    <div className="flex items-center gap-3">
                      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Twitter size={15} className="text-white" />
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Linkedin size={15} className="text-white" />
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Facebook size={15} className="text-white" />
                      </a>
                      <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Share2 size={15} className="text-white" />
                      </a>
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.25em]">
                    {article.category}
                  </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500 mb-2">More stories</p>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Related Posts</h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="block rounded-[1.25rem] overflow-hidden border border-white/5 bg-white/[0.03] shadow-[0_10px_35px_rgba(0,0,0,0.28)] hover:border-white/10 transition-all">
                          <div className="h-36 overflow-hidden">
                            <img src={post.src} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <div className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.24em] text-neutral-400">
                              <span>{post.category}</span>
                            </div>
                            <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-snug text-white mb-2">{post.title}</h3>
                            <p className="text-xs leading-6 text-neutral-400 line-clamp-3">{post.excerpt}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.article>
          ) : (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-[55vh] mt-8 rounded-[2rem] border border-white/5 bg-white/[0.03] flex flex-col items-center justify-center p-6 text-center"
            >
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Article Coming Soon</h1>
              <p className="text-neutral-400 mb-8 max-w-md">This article is currently being written and will be published shortly.</p>
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
