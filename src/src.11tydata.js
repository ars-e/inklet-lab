module.exports = {
  // This tells Eleventy how to create the final URL for each page.
  permalink: data => {
    // For any file, take its original path and filename (without the extension)
    // and add ".html" to the end.
    // e.g., "src/the-dispatch.html" becomes "/the-dispatch.html"
    // e.g., "src/articles/why-plots-lie.md" becomes "/articles/why-plots-lie.html"
    return `${data.page.filePathStem}.html`;
  }
};