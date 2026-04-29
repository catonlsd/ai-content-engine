"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"blog" | "analyzer" | "linkedin">(
    "blog"
  );

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [blogToAnalyze, setBlogToAnalyze] = useState("");
  const [analysisKeywords, setAnalysisKeywords] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [linkedinTopic, setLinkedinTopic] = useState("");
  const [linkedinTone, setLinkedinTone] = useState("professional");
  const [linkedinResult, setLinkedinResult] = useState<any>(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const generateBlog = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://ai-content-engine-backend-9f1x.onrender.com/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(",").map((k) => k.trim()),
          tone,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      alert("Backend connection failed");
    }

    setLoading(false);
  };

  const analyzeSeo = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("https://ai-content-engine-backend-9f1x.onrender.com/analyze-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog: blogToAnalyze,
          keywords: analysisKeywords.split(",").map((k) => k.trim()),
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch {
      alert("Backend connection failed");
    }

    setAnalyzing(false);
  };

  const generateLinkedInPost = async () => {
    setLinkedinLoading(true);
    setLinkedinResult(null);

    try {
      const res = await fetch("https://ai-content-engine-backend-9f1x.onrender.com/generate-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: linkedinTopic,
          tone: linkedinTone,
        }),
      });

      const data = await res.json();
      setLinkedinResult(data);
    } catch {
      alert("Backend connection failed");
    }

    setLinkedinLoading(false);
  };

  const copyBlog = async () => {
    if (!result) return;

    const formatted = `${result.title}\n\n${result.meta_description}\n\n${result.blog}`;
    await navigator.clipboard.writeText(formatted);
    alert("Formatted blog copied!");
  };

  const copyLinkedInPost = async () => {
    if (!linkedinResult) return;

    const formatted = `${linkedinResult.hook}\n\n${linkedinResult.post}\n\n${linkedinResult.hashtags?.join(
      " "
    )}`;
    await navigator.clipboard.writeText(formatted);
    alert("LinkedIn post copied!");
  };

  const clearAll = () => {
    setTopic("");
    setKeywords("");
    setTone("professional");
    setResult(null);

    setBlogToAnalyze("");
    setAnalysisKeywords("");
    setAnalysisResult(null);

    setLinkedinTopic("");
    setLinkedinTone("professional");
    setLinkedinResult(null);
  };

  const downloadBlog = () => {
    if (!result?.blog) return;

    const content = `${result.title}\n\n${result.meta_description}\n\n${result.blog}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-blog.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!result?.blog) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.createElement("div");

    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #000; background: #fff; padding: 24px;">
        <h1 style="font-size: 24px; margin-bottom: 12px;">${result.title}</h1>
        <p style="font-size: 14px; color: #555; margin-bottom: 24px;">
          ${result.meta_description}
        </p>
        <div style="white-space: pre-line; font-size: 14px; line-height: 1.7;">
          ${result.blog}
        </div>
        <hr style="margin: 24px 0;" />
        <p><strong>SEO Score:</strong> ${result.seo_score}/100</p>
        <p><strong>SEO Explanation:</strong> ${result.seo_explanation}</p>
      </div>
    `;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "seo-blog.pdf",
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  const ScoreBadge = ({ score }: { score: number }) => (
    <span className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-1 text-sm font-semibold text-green-300">
      Score: {score}/100
    </span>
  );

  const TabButton = ({
    id,
    label,
  }: {
    id: "blog" | "analyzer" | "linkedin";
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            AI SEO Content Engine
          </h1>
          <p className="mt-4 text-gray-400">
            Generate SEO blogs, analyze content, and create LinkedIn posts with
            AI.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <TabButton id="blog" label="Blog Generator" />
          <TabButton id="analyzer" label="SEO Analyzer" />
          <TabButton id="linkedin" label="LinkedIn Generator" />
        </div>

        {activeTab === "blog" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">
                Generate SEO Blog
              </h2>

              <input
                className="mb-3 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-blue-500"
                placeholder="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <input
                className="mb-3 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-blue-500"
                placeholder="Keywords: AI tools, students, productivity"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />

              <select
                className="mb-4 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-blue-500"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
              </select>

              <button
                onClick={generateBlog}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Blog"}
              </button>
            </div>

            {result && (
              <section className="space-y-5">
                <h2 className="text-3xl font-bold">Generated Blog</h2>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <h3 className="text-2xl font-semibold">{result.title}</h3>
                  <p className="mt-3 text-gray-400">
                    {result.meta_description}
                  </p>

                  <div className="mt-4">
                    <ScoreBadge score={result.seo_score} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={copyBlog}
                      className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold hover:bg-gray-700"
                    >
                      Copy Blog
                    </button>

                    <button
                      onClick={downloadBlog}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                    >
                      Download TXT
                    </button>

                    <button
                      onClick={downloadPDF}
                      className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold hover:bg-yellow-700"
                    >
                      Download PDF
                    </button>

                    <button
                      onClick={clearAll}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div
                  id="blog-content"
                  className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
                >
                  <h3 className="mb-3 text-xl font-semibold">Blog Content</h3>
                  <p className="whitespace-pre-line leading-8 text-gray-200">
                    {result.blog}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                    <h3 className="mb-2 text-xl font-semibold">
                      SEO Explanation
                    </h3>
                    <p className="text-gray-300">{result.seo_explanation}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                    <h3 className="mb-2 text-xl font-semibold">Suggestions</h3>
                    <ul className="list-disc space-y-2 pl-5 text-gray-300">
                      {result.improvement_suggestions?.map(
                        (s: string, i: number) => (
                          <li key={i}>{s}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </section>
        )}

        {activeTab === "analyzer" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">Analyze SEO</h2>

              <textarea
                className="mb-3 min-h-40 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-green-500"
                placeholder="Paste blog content here"
                value={blogToAnalyze}
                onChange={(e) => setBlogToAnalyze(e.target.value)}
              />

              <input
                className="mb-4 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-green-500"
                placeholder="Target keywords"
                value={analysisKeywords}
                onChange={(e) => setAnalysisKeywords(e.target.value)}
              />

              <button
                onClick={analyzeSeo}
                disabled={analyzing}
                className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700 disabled:opacity-60"
              >
                {analyzing ? "Analyzing..." : "Analyze SEO"}
              </button>
            </div>

            {analysisResult && (
              <section className="space-y-5">
                <h2 className="text-3xl font-bold">SEO Analysis</h2>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <ScoreBadge score={analysisResult.seo_score} />
                  <p className="mt-4 text-gray-300">
                    {analysisResult.seo_explanation}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    Improvement Suggestions
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-300">
                    {analysisResult.improvement_suggestions?.map(
                      (s: string, i: number) => (
                        <li key={i}>{s}</li>
                      )
                    )}
                  </ul>
                </div>
              </section>
            )}
          </section>
        )}

        {activeTab === "linkedin" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">
                Generate LinkedIn Post
              </h2>

              <input
                className="mb-3 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-blue-500"
                placeholder="LinkedIn post topic"
                value={linkedinTopic}
                onChange={(e) => setLinkedinTopic(e.target.value)}
              />

              <select
                className="mb-4 w-full rounded-lg border border-gray-700 bg-black p-3 outline-none focus:border-blue-500"
                value={linkedinTone}
                onChange={(e) => setLinkedinTone(e.target.value)}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
                <option value="storytelling">Storytelling</option>
              </select>

              <button
                onClick={generateLinkedInPost}
                disabled={linkedinLoading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
              >
                {linkedinLoading ? "Generating..." : "Generate LinkedIn Post"}
              </button>
            </div>

            {linkedinResult && (
              <section className="space-y-5">
                <h2 className="text-3xl font-bold">LinkedIn Post Result</h2>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <h3 className="mb-2 text-xl font-semibold">Hook</h3>
                  <p className="text-gray-300">{linkedinResult.hook}</p>

                  <div className="mt-4">
                    <ScoreBadge score={linkedinResult.engagement_score} />
                  </div>

                  <button
                    onClick={copyLinkedInPost}
                    className="mt-5 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold hover:bg-gray-700"
                  >
                    Copy LinkedIn Post
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <h3 className="mb-3 text-xl font-semibold">Post Content</h3>
                  <p className="whitespace-pre-line leading-8 text-gray-200">
                    {linkedinResult.post}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {linkedinResult.hashtags?.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                      >
                        #{tag.replace("#", "")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    Improvement Suggestions
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-300">
                    {linkedinResult.improvement_suggestions?.map(
                      (s: string, i: number) => (
                        <li key={i}>{s}</li>
                      )
                    )}
                  </ul>
                </div>
              </section>
            )}
          </section>
        )}
      </section>
    </main>
  );
}