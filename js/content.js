/* =============================================
   content.js — loads all site content from data files

   Data files you can edit freely:
     data/news.md          — one paragraph per news item
     data/featured.json    — selected papers on homepage
     data/publications.json — full publications list
   ============================================= */

// -----------------------------------------------
// Helpers
// -----------------------------------------------

// Resolve paths relative to site root regardless of which page we're on
function rootPath(path) {
  const depth = window.location.pathname.split('/').length - 2;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return prefix + path;
}

// Inline markdown: bold, italic, links (subset used in news.md)
function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// Highlight author name in publication author strings (<me>...</me> tag)
function renderAuthors(str) {
  return str.replace(/<me>(.*?)<\/me>/g, '<span class="me">$1</span>');
}

// -----------------------------------------------
// NEWS  (data/news.md)
// -----------------------------------------------
function renderNews(container) {
  fetch(rootPath('data/news.md'))
    .then(r => r.text())
    .then(md => {
      // Split on blank lines to get individual items
      const items = md.trim().split(/\n\n+/);
      container.innerHTML = items.map(item => {
        // Extract the bold date at the start: **Mon YYYY**
        const dateMatch = item.match(/^\*\*([^*]+)\*\*/);
        const date = dateMatch ? dateMatch[1] : '';
        // Strip the date + dash from the text body
        const body = item.replace(/^\*\*[^*]+\*\*\s*[–—-]+\s*/, '');
        return `
          <div class="news-item">
            <span class="news-item__date">${date}</span>
            <p class="news-item__text">${inlineMd(body)}</p>
          </div>`;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<p style="color:var(--text-faint)">Could not load news.</p>';
    });
}

// -----------------------------------------------
// FEATURED PAPERS  (data/featured.json)
// -----------------------------------------------
function renderFeatured(container) {
  fetch(rootPath('data/featured.json'))
    .then(r => r.json())
    .then(papers => {
      container.innerHTML = papers.map(p => {
        const imgHtml = p.image
          ? `<img src="${rootPath(p.image)}" alt="${p.title}" />`
          : `<div class="featured-paper__placeholder">Image coming soon</div>`;

        const awardHtml = p.award
          ? `<span class="pub-card__award">${p.award}</span>`
          : '';

        const linkTarget = p.url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';

        return `
          <div class="featured-paper${p.reverse ? ' featured-paper--reverse' : ''}">
            <div class="featured-paper__img-wrap">${imgHtml}</div>
            <div class="featured-paper__content">
              <div class="featured-paper__meta">
                <span class="pub-card__venue">${p.venue}</span>
                <span class="pub-card__year">${p.year}</span>
                ${awardHtml}
              </div>
              <h3 class="featured-paper__title">${p.title}</h3>
              <p class="featured-paper__desc">${p.desc}</p>
              <a href="${p.url}"${linkTarget} class="btn">Read →</a>
            </div>
          </div>`;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<p style="color:var(--text-faint)">Could not load papers.</p>';
    });
}

// -----------------------------------------------
// PUBLICATIONS  (data/publications.json)
// -----------------------------------------------
function renderPublications(container) {
  fetch(rootPath('data/publications.json'))
    .then(r => r.json())
    .then(groups => {
      container.innerHTML = groups.map((group, i) => {
        const papers = group.papers.map(p => {
          const tagHtml = p.tag
            ? `<span class="chip${p.tag === 'First Author' ? ' chip--accent' : ''}">${p.tag}</span>`
            : '';
          const awardHtml = p.award
            ? `<span class="pub-card__award">${p.award}</span>`
            : '';
          const linkHtml = p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener" class="pub-link">Paper</a>`
            : '';

          return `
            <div class="pub-card">
              <div class="pub-card__meta">
                <span class="pub-card__venue">${p.venue}</span>
                ${p.year ? `<span class="pub-card__year">${p.year}</span>` : ''}
                ${tagHtml}${awardHtml}
              </div>
              <div class="pub-card__title">${p.title}</div>
              <div class="pub-card__authors">${renderAuthors(p.authors)}</div>
              ${linkHtml ? `<div class="pub-card__links">${linkHtml}</div>` : ''}
            </div>`;
        }).join('');

        const muted = i % 2 !== 0 ? ' section--muted' : '';
        return `
          <section class="section${muted}">
            <div class="container">
              <div class="section__header">
                <span class="section__title">${group.year}</span>
              </div>
              <div class="pub-list">${papers}</div>
            </div>
          </section>`;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<p style="color:var(--text-faint)">Could not load publications.</p>';
    });
}

// -----------------------------------------------
// Auto-init on DOMContentLoaded
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const newsEl      = document.getElementById('news-list');
  const featuredEl  = document.getElementById('featured-list');
  const pubsEl      = document.getElementById('pub-sections');

  if (newsEl)     renderNews(newsEl);
  if (featuredEl) renderFeatured(featuredEl);
  if (pubsEl)     renderPublications(pubsEl);
});
