// keep-reading.js – adds a "Keep reading" suggestion list to article pages
// Minimal, dependency‑free, respects Linear’s restrained style.
// Assumes the article body has a <section class=\"post-content\"> element.

(() => {
  // Find the article's main content container.
  const content = document.querySelector('.post-content');
  if (!content) return;

  // Identify candidate posts from the blog index (cached in localStorage for speed).
  // Simple fallback: read a JSON file generated at build time – not present here,
  // so we’ll fetch the blog index page and parse titles/links.
  fetch('../index.html')
    .then(r => r.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const posts = Array.from(doc.querySelectorAll('.post-row')).map(row => {
        const a = row.querySelector('a');
        const title = a ? a.textContent.trim() : '';
        const href = a ? a.getAttribute('href') : '';
        const dateEl = row.querySelector('.post-date');
        const date = dateEl ? dateEl.textContent.trim() : '';
        return {title, href, date};
      });
      // Current article slug – strip leading slash.
      const cur = location.pathname.split('/').pop();
      const related = posts.filter(p => p.href && !p.href.endsWith(cur)).slice(0,4);
      if (!related.length) return;

      const wrapper = document.createElement('section');
      wrapper.className = 'keep-reading';
      const heading = document.createElement('h2');
      heading.className = 'keep-reading-title';
      heading.textContent = 'Keep reading';
      wrapper.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'posts';
      related.forEach(p => {
        const row = document.createElement('a');
        row.className = 'post-row';
        row.href = p.href;
        const date = document.createElement('div');
        date.className = 'post-date';
        date.textContent = p.date;
        const title = document.createElement('div');
        title.className = 'post-title';
        title.textContent = p.title;
        row.appendChild(date);
        row.appendChild(title);
        list.appendChild(row);
      });
      wrapper.appendChild(list);
      content.appendChild(wrapper);
    })
    .catch(() => {});
})();
