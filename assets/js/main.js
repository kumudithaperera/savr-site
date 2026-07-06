/* Savr site — theme toggle, scroll reveal, and contact form handling. */
(function () {
  'use strict';

  /* ---- Theme toggle (persisted, respects system default) ---- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var stored = null;
  try { stored = localStorage.getItem('savr-theme'); } catch (e) {}
  if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);

  function currentTheme() {
    // Light is the default; dark only when the user has explicitly chosen it.
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function paintToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === 'dark';
    var use = toggle.querySelector('use');
    // Show the icon of the theme you'd switch TO: sun in dark, moon in light.
    if (use) use.setAttribute('href', isDark ? '#i-sun' : '#i-moon');
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('savr-theme', next); } catch (e) {}
      paintToggle();
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---- Contact form ---- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showStatus(kind, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status show ' + kind;
  }

  form.addEventListener('submit', function (ev) {
    var action = form.getAttribute('action') || '';
    var configured = action && action.indexOf('YOUR_FORM_ID') === -1;

    // No backend configured yet → fall back to a pre-filled email draft.
    if (!configured) {
      ev.preventDefault();
      var data = new FormData(form);
      var subject = 'Savr contact — ' + (data.get('topic') || 'General');
      var body =
        'Name: ' + (data.get('name') || '') + '\n' +
        'Email: ' + (data.get('email') || '') + '\n\n' +
        (data.get('message') || '');
      window.location.href =
        'mailto:carbonstroke@gmail.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      showStatus('ok', 'Opening your email app… if nothing happens, write to carbonstroke@gmail.com.');
      return;
    }

    // Configured (e.g. Formspree) → submit via fetch for a smooth inline result.
    ev.preventDefault();
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus('ok', 'Thanks! Your message is on its way — we’ll reply soon.');
        } else {
          showStatus('err', 'Something went wrong. Please email carbonstroke@gmail.com instead.');
        }
      })
      .catch(function () {
        showStatus('err', 'Network error. Please email carbonstroke@gmail.com instead.');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
      });
  });
})();
