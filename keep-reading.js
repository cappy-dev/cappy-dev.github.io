// keep-reading.js – adds a "Keep reading" suggestion list to article pages.
// Minimal, dependency-free, respects the site's Linear-derived style.
//
// This feature is designed (see .keep-reading / .keep-reading-title in
// style.css) for the Decide/Learn reading surface: a reader who finishes an
// article should see where to go next, in the same visual register as the
// blog index they came from.
//
// The script is intentionally resilient: it works for both article patterns
// on the site (bare <article> with inline content, and the newer
// .article-header + .article-body layout) and across both footer placements
// (footer inside <article>, or as a sibling after </article>). If anything it
// needs is missing it exits silently — no broken UI, no console noise.

(() => {
  'use strict';

  // Only act on article pages. The blog index itself is excluded so the
  // section never duplicates the list it sits beneath.
  const article = document.querySelector('article');
  if (!article) return;

  // Resolve the blog index relative to the current document. Article pages
  // live at /blog/<slug>.html, so the index is "index.html" (sibling). This
  // is computed from location, not hardcoded, so it survives a path prefix.
  const here = location.pathname.replace(/\/+$/, '');
  const dir = here.includes('/') ? here.slice(0, here.lastIndexOf('/')) : '';
  const indexURL = (dir ? dir + '/' : '') + 'index.html';

  // The id of this article: trailing path segment, used to drop "self" from
  // the suggestion list.
  const selfSlug = here.split('/').pop();

  fetch(indexURL, { cache: 'force-cache' })
    .then(r => (r.ok ? r.text() : Promise.reject(new Error('no index'))))
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = Array.from(doc.querySelectorAll('a.post-row'));
      if (!rows.length) return;

      // Parse each index row into a lightweight record. The row IS the <a>,
      // so the href lives on it directly; the title comes from the nested
      // .post-title <h2>, the date from .post-date (with the optional "new"
      // freshness span stripped so suggestions read as dates not badges),
      // and the topic set from the row's data-topics attribute.
      const posts = rows.map(row => {
        const titleEl = row.querySelector('.post-title');
        const dateEl = row.querySelector('.post-date');
        const slug = (row.getAttribute('href') || '').split('/').pop();
        const topics = (row.getAttribute('data-topics') || '')
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        return {
          href: row.getAttribute('href') || '',
          slug,
          title: titleEl ? titleEl.textContent.trim() : '',
          date: dateEl ? dateEl.firstChild.textContent.trim() : '',
          topics
        };
      }).filter(p => p.href && p.title);

      // The current article's topics, looked up on the index (the reliable
      // source — the article page's own tag markup varies across the 80+
      // posts). Falls back to an empty set if this post isn't indexed.
      const me = posts.find(p => p.slug === selfSlug);
      const myTopics = new Set(me ? me.topics : []);

      // Rank the other posts by topic overlap, then by original order as a
      // stable tiebreaker (most recent first, matching the index). Excluded:
      // self, and any post whose slug we couldn't resolve. We surface up to
      // three — enough to give a real "next" choice, few enough to scan.
      const candidates = posts
        .filter(p => p.slug && p.slug !== selfSlug)
        .map((p, i) => ({
          p,
          score: p.topics.reduce((n, t) => n + (myTopics.has(t) ? 1 : 0), 0),
          order: i
        }))
        .sort((a, b) => b.score - a.score || a.order - b.order)
        .slice(0, 3)
        .map(x => x.p);

      // The section only earns its place if it can show at least two real
      // next-reads. One lonely link reads as a footer, not a section.
      if (candidates.length < 2) return;

      // Build the section in the same markup the blog index uses, so the
      // existing .post-row / .post-date / .post-title CSS applies unchanged
      // and the section reads as a continuation of the list the reader came
      // from. No new classes, no new tokens, no decoration.
      const section = document.createElement('section');
      section.className = 'keep-reading';

      const heading = document.createElement('h2');
      heading.className = 'keep-reading-title';
      heading.textContent = 'Keep reading';
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'posts';
      candidates.forEach(p => {
        const row = document.createElement('a');
        row.className = 'post-row';
        row.href = p.href;

        const date = document.createElement('div');
        date.className = 'post-date';
        date.textContent = p.date;
        row.appendChild(date);

        const content = document.createElement('div');
        content.className = 'post-content';
        // Use a <div>, not an <h2>, for the suggested title. Two reasons:
        //   1. These are link titles inside a navigation aside, not article
        //      section headings — a <div> is the semantically honest tag.
        //   2. anchors.js scopes over <article> and slugs every <h2>/<h3>;
        //      an <h2> here would get a '#' permalink <a> appended inside
        //      the row's <a> (invalid nested anchors) and an id. The .post-title
        //      CSS is class-based, so <div class="post-title"> renders
        //      identically to the index's <h2 class="post-title">.
        const title = document.createElement('div');
        title.className = 'post-title';
        title.textContent = p.title;
        content.appendChild(title);
        row.appendChild(content);

        list.appendChild(row);
      });
      section.appendChild(list);

      // Insert immediately before the footer, wherever it sits. This works
      // whether the footer is a child of <article> (newer bare-article posts)
      // or a sibling after </article> (older .article-body posts): querying
      // the whole document finds it either way, and the section lands just
      // above the signoff where "where next" belongs.
      const footer = document.querySelector('footer');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(section, footer);
      } else {
        // No footer at all (shouldn't happen) — append at the end of <article>
        // so the section still renders inside the reading column.
        article.appendChild(section);
      }
    })
    .catch(() => { /* index unavailable; stay silent, show nothing */ });
})();
