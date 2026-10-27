(function () {
  var attempts = 0;
  var maxAttempts = 30;
  var MQ_DESKTOP = '(min-width: 1200px)';

  function isDesktopToc() {
    return window.matchMedia(MQ_DESKTOP).matches;
  }

  function expandCollapsedNodes() {
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
  }

  function reinitActiveToc() {
    if (typeof tocbot === 'undefined') return false;

    var desktop = isDesktopToc();
    var selector = desktop ? '#toc' : '#toc-popup-content';
    var mount = document.querySelector(selector);
    if (!mount) return false;

    /* Wait until Chirpy (or a prior init) has something, or headings exist to build from */
    var hasHeadings = document.querySelectorAll('.content h2, .content h3, .content h4').length > 0;
    if (!hasHeadings) return false;

    try {
      tocbot.destroy();
    } catch (e) {}

    tocbot.init({
      tocSelector: selector,
      contentSelector: '.content',
      ignoreSelector: '[data-toc-skip]',
      headingSelector: 'h2, h3, h4',
      orderedList: false,
      scrollSmooth: false,
      collapseDepth: 6,
      headingsOffset: desktop ? 64 : 96
    });

    if (desktop) {
      var wrap = document.getElementById('toc-wrapper');
      if (wrap) wrap.classList.remove('invisible');
    }

    expandCollapsedNodes();
    return mount.children.length > 0 || hasHeadings;
  }

  function hideTocPopup() {
    var popup = document.getElementById('toc-popup');
    if (!popup || !popup.open) return;

    /* Prefer Chirpy close button so lockScroll / closing animation still run */
    var closeBtn = document.getElementById('toc-popup-close');
    if (closeBtn) {
      closeBtn.click();
      return;
    }

    if (typeof popup.close === 'function') {
      popup.close();
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function bindPopupAnchorClose() {
    var content = document.getElementById('toc-popup-content');
    if (!content || content.dataset.anchorCloseBound === '1') return;

    content.addEventListener('click', function (e) {
      var link = e.target.closest('a.toc-link, a[href^="#"]');
      if (!link || !content.contains(link)) return;
      /* Defer so hash navigation / scroll can start first */
      setTimeout(hideTocPopup, 0);
    });
    content.dataset.anchorCloseBound = '1';
  }

  function ensureFab() {
    if (document.getElementById('toc-fab')) return;
    if (!document.getElementById('toc-popup')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'toc-fab';
    btn.title = '文章内容';
    btn.setAttribute('aria-label', '打开文章大纲');
    btn.innerHTML = '<i class="fa-solid fa-list-ul fa-fw" aria-hidden="true"></i>';
    btn.addEventListener('click', function () {
      var trigger =
        document.getElementById('toc-solo-trigger') ||
        document.querySelector('#toc-bar .toc-trigger');
      if (trigger) {
        trigger.click();
        return;
      }
      var popup = document.getElementById('toc-popup');
      if (popup && typeof popup.showModal === 'function') popup.showModal();
    });
    document.body.appendChild(btn);
  }

  function expandToc() {
    if (typeof tocbot === 'undefined') {
      attempts++;
      if (attempts < maxAttempts) setTimeout(expandToc, 300);
      return;
    }

    if (!reinitActiveToc()) {
      attempts++;
      if (attempts < maxAttempts) setTimeout(expandToc, 300);
      return;
    }

    bindPopupAnchorClose();
    ensureFab();
  }

  function onBreakpointChange() {
    attempts = 0;
    setTimeout(expandToc, 50);
  }

  if (document.readyState === 'complete') {
    setTimeout(expandToc, 500);
  } else {
    window.addEventListener('load', function () {
      setTimeout(expandToc, 500);
    });
  }

  var mql = window.matchMedia(MQ_DESKTOP);
  if (mql.addEventListener) {
    mql.addEventListener('change', onBreakpointChange);
  } else if (mql.addListener) {
    mql.addListener(onBreakpointChange);
  }
})();
