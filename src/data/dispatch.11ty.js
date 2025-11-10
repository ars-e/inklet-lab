exports.data = {
  permalink: "/data/dispatch.json",
  eleventyExcludeFromCollections: true,
};

exports.render = ({ collections }) => {
  const posts =
    (collections.getFilteredByTag && collections.getFilteredByTag("posts")) ||
    collections.posts ||
    [];

  const out = posts.map(p => ({
    title: p.data.title || p.title || "",
    slug: p.fileSlug || "",
    date: p.date || null, // Date object from Eleventy
    summary: p.data.dek || p.data.deck || p.data.summary || p.data.description || "",
    tags: p.data.tags || [],
  }));

  return JSON.stringify(out);
};
