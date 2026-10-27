(function () {
  var MQ = '(min-width: 850px)';
  var KEY = 'chirpy-sidebar-collapsed';

  function isDesktop() {
    return window.matchMedia(MQ).matches;
  }

  function setCollapsed(collapsed) {
    document.documentElement.classList.toggle('sidebar-collapsed', !!collapsed);
    try {
      localStorage.setItem(KEY, collapsed ? '1' : '0');
    } catch (e) {}
    syncTrigger(!!collapsed);
  }

  function syncTrigger(collapsed) {
    var trigger = document.getElementById('sidebar-trigger');
    if (!trigger) return;
    if (isDesktop()) {
      trigger.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      trigger.setAttribute('title', collapsed ? '显示侧边栏' : '隐藏侧边栏');
      trigger.setAttribute('aria-label', collapsed ? '显示侧边栏' : '隐藏侧边栏');
    } else {
      var open = document.body.hasAttribute('sidebar-display');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      trigger.setAttribute('title', 'Sidebar');
      trigger.setAttribute('aria-label', 'Side Panel');
    }
  }

  function ensureCollapseBtn(sidebar) {
    if (document.getElementById('sidebar-collapse-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'sidebar-collapse-btn';
    btn.title = '隐藏侧边栏';
    btn.setAttribute('aria-label', '隐藏侧边栏');
    btn.innerHTML = '<i class="fas fa-angles-left fa-fw" aria-hidden="true"></i>';
    btn.addEventListener('click', function () {
      if (isDesktop()) setCollapsed(true);
    });
    sidebar.appendChild(btn);
  }

  function onReady() {
    var trigger = document.getElementById('sidebar-trigger');
    var sidebar = document.getElementById('sidebar');
    if (!trigger) return;

    if (sidebar) ensureCollapseBtn(sidebar);

    try {
      if (isDesktop() && localStorage.getItem(KEY) === '1') {
        setCollapsed(true);
      } else {
        syncTrigger(document.documentElement.classList.contains('sidebar-collapsed'));
      }
    } catch (e) {
      syncTrigger(false);
    }

    /*
     * Desktop: take over before Chirpy mobile sidebar-display handler.
     * Capture phase + stopImmediatePropagation keeps the two modes separate.
     */
    trigger.addEventListener(
      'click',
      function (e) {
        if (!isDesktop()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        setCollapsed(!document.documentElement.classList.contains('sidebar-collapsed'));
      },
      true
    );

    var mql = window.matchMedia(MQ);
    var onChange = function (ev) {
      if (ev.matches) {
        document.body.removeAttribute('sidebar-display');
        try {
          setCollapsed(localStorage.getItem(KEY) === '1');
        } catch (err) {
          setCollapsed(false);
        }
      } else {
        syncTrigger(false);
      }
    };
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else if (mql.addListener) {
      mql.addListener(onChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
