/* Lightbox: click any image on the page to view it full size.
   - Arrow keys / on-screen arrows / swipe move between images
   - Esc, the close button, or a click outside the image closes it
   Options (on an <img>):
   - data-full="path/to/large.jpg"  show a higher-resolution version in the lightbox
   - data-no-lightbox               leave this image alone (logos, icons) */
(function () {
  'use strict';

  var items = [];
  var current = -1;
  var overlay, imgEl, capEl, countEl, btnClose, btnPrev, btnNext;
  var lastFocus = null;
  var hideTimer = null;
  var touchX = null;

  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
  };

  function captionFor(img) {
    var box = img.closest('figure, .aside-shot');
    var c = box && box.querySelector('figcaption, .aside-shot__caption');
    return (c && c.textContent.trim()) || img.alt || '';
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lb';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML =
      '<span class="lb__count" aria-live="polite"></span>' +
      '<button type="button" class="lb__btn lb__close" aria-label="Close image">' + ICON.close + '</button>' +
      '<button type="button" class="lb__btn lb__prev" aria-label="Previous image">' + ICON.prev + '</button>' +
      '<button type="button" class="lb__btn lb__next" aria-label="Next image">' + ICON.next + '</button>' +
      '<figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption></figure>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.lb__img');
    capEl = overlay.querySelector('.lb__cap');
    countEl = overlay.querySelector('.lb__count');
    btnClose = overlay.querySelector('.lb__close');
    btnPrev = overlay.querySelector('.lb__prev');
    btnNext = overlay.querySelector('.lb__next');

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lb__fig')) close();
    });
    overlay.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function show(i) {
    current = (i + items.length) % items.length;
    var img = items[current];
    imgEl.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
    capEl.textContent = captionFor(img);
    var many = items.length > 1;
    btnPrev.hidden = !many;
    btnNext.hidden = !many;
    countEl.textContent = many ? (current + 1) + ' / ' + items.length : '';
  }

  function step(dir) {
    if (items.length > 1) show(current + dir);
  }

  function open(i, trigger) {
    if (!overlay) build();
    clearTimeout(hideTimer);
    lastFocus = trigger || document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      btnClose.focus();
    });
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hideTimer = setTimeout(function () { overlay.hidden = true; imgEl.removeAttribute('src'); }, reduce ? 0 : 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'Tab') {
      var stops = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
      var idx = stops.indexOf(document.activeElement);
      e.preventDefault();
      idx = e.shiftKey ? (idx <= 0 ? stops.length - 1 : idx - 1) : (idx + 1) % stops.length;
      stops[idx].focus();
    }
  }

  function init() {
    items = [].slice.call(document.querySelectorAll('img')).filter(function (img) {
      return !img.hasAttribute('data-no-lightbox') && !img.closest('.site-nav, .footer, [data-no-lightbox]');
    });
    items.forEach(function (img, i) {
      img.setAttribute('data-lb', '');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'View image full size' + (img.alt ? ': ' + img.alt : ''));
      if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
      img.addEventListener('click', function (e) { e.preventDefault(); open(i, img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, img); }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
