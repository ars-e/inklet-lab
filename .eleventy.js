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

  // ---------- Markdown Configuration ----------
  const md = markdownIt({
    html: true,       // Allow raw HTML
    linkify: true,    // Auto-detect links
    typographer: true // Smart quotes, dashes, etc.
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

  // ---------- Date filters ----------
  eleventyConfig.addFilter("fmtDate", (dateInput, fmt = "dd LLL yyyy") => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    return DateTime.fromJSDate(d).toFormat(fmt);
  });

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

  // ---------- Collections ----------
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("posts").reverse()
  );

  // Main "projects" collection (Markdown + optional JSON merges)
  eleventyConfig.addCollection("projects", (collectionApi) => {
    const taggedProjects = collectionApi.getFilteredByTag("projects");

    let pdfData = [];
    try {
      pdfData = require("./src/_data/pdf_projects.json");
    } catch (e) {
      // ignore if no file
    }

    const pdfProjects = pdfData.map((pdf) => {
      return {
        url: pdf.url,
        data: pdf,
        date: new Date(pdf.date),
      };
    });

    return [...taggedProjects, ...pdfProjects].sort((a, b) => {
      const da = a.date || new Date(0);
      const db = b.date || new Date(0);
      return db - da; // newest first
    });
  });

  // Featured subset (based on front matter)
  eleventyConfig.addCollection("featuredProjects", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("projects")
      .filter((p) => (p.data.status || "").toLowerCase() === "published" && p.data.featured)
      .sort((a, b) => (b.data.year || 0) - (a.data.year || 0));
  });

  // Related posts filter
  eleventyConfig.addFilter("relatedPosts", (posts, currentPostUrl) =>
    (posts || []).filter((p) => p.url !== currentPostUrl).slice(0, 3)
  );

  // ---------- Pretty URLs (directory-style permalinks) ----------
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const stem = data.page.filePathStem;

      if (
        stem.startsWith("/css/") ||
        stem.startsWith("/js/") ||
        stem.startsWith("/assets/")
      ) {
        return false; // passthrough assets
      }

      if (stem.startsWith("/articles/")) {
        const slug = stem.replace(/^\/articles\//, "");
        if (typeof data.permalink === "string") return data.permalink;
        return `/articles/${slug}/index.html`;
      }

      if (typeof data.permalink === "string") return data.permalink;
      if (stem === "/index" || stem === "/front-page") {
        return `${stem}/index.html`; // or override to "/" in front matter
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
