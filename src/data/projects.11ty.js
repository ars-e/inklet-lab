exports.data = {
  permalink: "/data/projects.json",
  eleventyExcludeFromCollections: true,
};

exports.render = ({ collections }) => {
  const items = collections.projects || [];

  const out = items.map(p => ({
    title: (p.data && p.data.title) || p.title || "",
    slug: p.fileSlug || (p.data && p.data.slug) || "",
    url: p.url || "",
    date: p.date || null,      // needs a valid ISO date in project front matter
    summary: (p.data && (p.data.dek || p.data.deck || p.data.summary || p.data.description)) || "",
    tags: (p.data && p.data.tags) || [],
  }));

  return JSON.stringify(out);
};
