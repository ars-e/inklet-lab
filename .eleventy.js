// .eleventy.js
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // ---------- Passthrough (map src/* to top-level output paths) ----------
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // ---------- Markdown: give h2/h3 automatic, predictable IDs ----------
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, {
      level: [2, 3],
      slugify: (s) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
    });
  eleventyConfig.setLibrary("md", md);

  // ---------- Date filters ----------
  eleventyConfig.addFilter("fmtDate", (dateInput, fmt = "dd LLL yyyy") => {
    const { DateTime } = require("luxon");
    const d =
      dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    return DateTime.fromJSDate(d).toFormat(fmt);
  });

  // Back-compat: {{ page.date | date("DD MMMM, YYYY") }}
  eleventyConfig.addNunjucksFilter("date", function (dateInput, format) {
    const d =
      dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
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

  // Keep only "other" posts (exclude current url) and take 3
  eleventyConfig.addFilter("relatedPosts", (posts, currentPostUrl) =>
    posts.filter((p) => p.url !== currentPostUrl).slice(0, 3)
  );

  // ---------- Pretty URLs (directory-style permalinks) ----------
  // Default rule:
  //  - /articles/foo -> /articles/foo/index.html
  //  - any other template -> /<stem>/index.html
  //  - root index can be overridden per-file with front matter (permalink: "/")
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const stem = data.page.filePathStem; // e.g. "/the-dispatch" or "/articles/ai-dream"

      // Don’t touch passthrough assets
      if (
        stem.startsWith("/css/") ||
        stem.startsWith("/js/") ||
        stem.startsWith("/assets/")
      ) {
        return false;
      }

      // Articles directory → directory-style
      if (stem.startsWith("/articles/")) {
        const slug = stem.replace(/^\/articles\//, "");
        // allow explicit overrides in a file's front matter
        if (typeof data.permalink === "string") return data.permalink;
        return `/articles/${slug}/index.html`;
      }

      // Everything else → directory-style (e.g., /the-dispatch/index.html)
      if (typeof data.permalink === "string") return data.permalink;
      if (stem === "/index" || stem === "/front-page") {
        // If you want front-page to be site root, set `permalink: "/"` in that file.
        return `${stem}/index.html`;
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
