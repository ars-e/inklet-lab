// .eleventy.js

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // ---------- Passthrough (map src/* to top-level output paths) ----------
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // (Optional) watch extras in dev
  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("src/js");

  // ---------- Markdown Configuration ----------
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor, {
      level: [2, 3],
      slugify: (s) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
    })
    .use(markdownItAttrs);

  eleventyConfig.setLibrary("md", md);

  // ---------- Filters ----------
  // Human date
  eleventyConfig.addFilter("fmtDate", (dateInput, fmt = "dd LLL yyyy") => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    return DateTime.fromJSDate(d).toFormat(fmt);
  });

  // Back-compat date("DD MMMM, YYYY")
  eleventyConfig.addNunjucksFilter("date", function (dateInput, format) {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    if (format === "DD MMMM, YYYY") {
      const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(d);
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
      const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(d);
      return `${day} ${month}, ${year}`;
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  });

  // JSON stringify for embedding in attributes
  eleventyConfig.addFilter("json", (value) => {
    try {
      return JSON.stringify(value ?? []);
    } catch {
      return "[]";
    }
  });

  // Related posts helper
  eleventyConfig.addFilter("relatedPosts", (posts, currentPostUrl) =>
    (posts || []).filter((p) => p.url !== currentPostUrl).slice(0, 3)
  );

  // ---------- Collections ----------
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").reverse()
  );

  // Helper: safe date for sorting
  const safeDate = (item) => {
    // prefer explicit .date, then year, else epoch
    if (item.date instanceof Date && !isNaN(item.date)) return item.date;
    if (item.data && item.data.year) return new Date(`${item.data.year}-01-01`);
    return new Date(0);
  };

  // Main "projects" collection (Markdown tagged projects + optional JSON PDFs)
  eleventyConfig.addCollection("projects", (collectionApi) => {
    const mdItems = collectionApi
      .getFilteredByTag("projects")
      .filter((p) => (p.data.status || "").toLowerCase() !== "draft");

    let pdfData = [];
    try {
      pdfData = require("./src/_data/pdf_projects.json");
    } catch (_) {
      // no JSON file present → fine
    }

    const pdfItems = (pdfData || []).map((pdf) => ({
      url: pdf.url,          // direct link to /assets/pdfs/...
      data: pdf,             // fields: title, tags, image, client, year, status, isPdf, etc.
      date: new Date(pdf.date || `${pdf.year || 0}-01-01`),
    }));

    return [...mdItems, ...pdfItems].sort((a, b) => safeDate(b) - safeDate(a));
  });

  // Featured subset (works for both Markdown & JSON PDF entries)
  eleventyConfig.addCollection("featuredProjects", (collectionApi) => {
    const mdItems = collectionApi.getFilteredByTag("projects");

    let pdfData = [];
    try {
      pdfData = require("./src/_data/pdf_projects.json");
    } catch (_) {}

    const pdfItems = (pdfData || []).map((pdf) => ({
      url: pdf.url,
      data: pdf,
      date: new Date(pdf.date || `${pdf.year || 0}-01-01`),
    }));

    return [...mdItems, ...pdfItems]
      .filter(
        (p) =>
          (p.data.status || "").toLowerCase() === "published" && !!p.data.featured
      )
      .sort((a, b) => safeDate(b) - safeDate(a));
  });

  // ---------- Pretty URLs (directory-style permalinks) ----------
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const stem = data.page.filePathStem;

      // passthrough assets
      if (
        stem.startsWith("/css/") ||
        stem.startsWith("/js/") ||
        stem.startsWith("/assets/")
      ) {
        return false;
      }

      // /articles/* → directory style
      if (stem.startsWith("/articles/")) {
        const slug = stem.replace(/^\/articles\//, "");
        if (typeof data.permalink === "string") return data.permalink;
        return `/articles/${slug}/index.html`;
      }

      // allow explicit overrides
      if (typeof data.permalink === "string") return data.permalink;

      // special case front page
      if (stem === "/index" || stem === "/front-page") {
        return `${stem}/index.html`; // set permalink: "/" in the file to make it the root
      }

      return `${stem}/index.html`;
    },
  });

  // ---------- Eleventy dirs/engines ----------
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
