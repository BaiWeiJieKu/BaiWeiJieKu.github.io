(function () {
  var attempts = 0;
  var maxAttempts = 30; /* 30 * 300ms = 9s max wait */

  function expandToc() {
    if (typeof tocbot === 'undefined') {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(expandToc, 300);
      }
      return;
    }

    var sidebarToc = document.getElementById('toc');
    if (sidebarToc && sidebarToc.children.length === 0) {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(expandToc, 300);
      }
      return;
    }

    try {
      tocbot.destroy();
    } catch (e) {}

    if (sidebarToc) {
      tocbot.init({
        tocSelector: '#toc',
        contentSelector: '.content',
        ignoreSelector: '[data-toc-skip]',
        headingSelector: 'h2, h3, h4',
        orderedList: false,
        scrollSmooth: false,
        collapseDepth: 6,
        headingsOffset: 64
      });
    }

    var popupToc = document.getElementById('toc-popup-content');
    if (popupToc) {
      tocbot.init({
        tocSelector: '#toc-popup-content',
        contentSelector: '.content',
        ignoreSelector: '[data-toc-skip]',
        headingSelector: 'h2, h3, h4',
        orderedList: false,
        scrollSmooth: false,
        collapseDepth: 6,
        headingsOffset: 64
      });
    }

    setTimeout(function () {
      document
        .querySelectorAll('#toc-wrapper .is-collapsed, #toc-popup-content .is-collapsed')
        .forEach(function (el) {
          el.classList.remove('is-collapsed');
          el.classList.add('is-visible');
        });
      document
        .querySelectorAll('#toc-wrapper .toc-list, #toc-popup-content .toc-list')
        .forEach(function (el) {
          el.style.maxHeight = 'none';
          el.style.overflow = 'visible';
        });
    }, 100);
  }

  if (document.readyState === 'complete') {
    setTimeout(expandToc, 500);
  } else {
    window.addEventListener('load', function () {
      setTimeout(expandToc, 500);
    });
  }
})();
