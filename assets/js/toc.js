// Builds the left sidebar's "On this page" nav from the h2/h3 headings
// already present in the page content. Add headings in your Markdown
// and they show up here automatically — nothing else to configure.
document.addEventListener('DOMContentLoaded', function () {
  var content = document.getElementById('page-content');
  var tocNav = document.getElementById('toc');
  var sidebar = document.getElementById('toc-sidebar');
  if (!content || !tocNav || !sidebar) return;

  var headings = content.querySelectorAll('h2, h3');

  if (headings.length === 0) {
    sidebar.classList.add('is-empty');
    return;
  }

  var entries = [];

  headings.forEach(function (heading) {
    if (!heading.id) {
      heading.id = heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.className = 'toc-link toc-' + heading.tagName.toLowerCase();
    tocNav.appendChild(link);

    entries.push({ id: heading.id, link: link });
  });

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (observed) {
      observed.forEach(function (entry) {
        var match = entries.filter(function (e) { return e.id === entry.target.id; })[0];
        if (!match || !entry.isIntersecting) return;
        entries.forEach(function (e) { e.link.classList.remove('active'); });
        match.link.classList.add('active');
      });
    },
    { rootMargin: '0px 0px -70% 0px' }
  );

  headings.forEach(function (heading) { observer.observe(heading); });
});
