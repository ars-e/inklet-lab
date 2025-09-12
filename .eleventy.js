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
      level: [2, 3], // add ids to h2 and h3
      slugify: (s) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "") // remove punctuation
          .replace(/\s+/g, "-"), // spaces -> dashes
      // no permalink UI; IDs are enough for your TOC
    });
  eleventyConfig.setLibrary("md", md);

  // ---------- Date filters ----------
  // 1) Preferred: fmtDate(dateObj, "dd LLL yyyy")
  eleventyConfig.addFilter("fmtDate", (dateInput, fmt = "dd LLL yyyy") => {
    const { DateTime } = require("luxon");
    const d =
      dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    return DateTime.fromJSDate(d).toFormat(fmt);
  });

  // 2) Back-compat for your current usage: {{ page.date | date("DD MMMM, YYYY") }}
  // Supports exactly "DD MMMM, YYYY" → e.g., "12 September, 2025"
  eleventyConfig.addNunjucksFilter("date", function (dateInput, format) {
    const d =
      dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
    if (format === "DD MMMM, YYYY") {
      // 2-digit day, Full month, numeric year with comma
      const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(d);
      const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
      const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(d);
      return `${day} ${month}, ${year}`;
    }
    // Fallback: long US date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  });

    // Create a collection of posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts").reverse();
  });

  // 👇 ADD THIS NEW CUSTOM FILTER 👇
  eleventyConfig.addFilter("relatedPosts", (posts, currentPostUrl) => {
    const related = posts.filter(post => post.url !== currentPostUrl);
    return related.slice(0, 3);
  });

  // ---------- Eleventy dirs/engines ----------
  return {
    dir: { input: "src", output: "public", includes: "_includes" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
