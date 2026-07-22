// Restrained fade-up reveal on scroll. No dependencies, no build step.
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible') })
    return
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el) })
})()

// Lightbox: click any case-study screenshot to view it larger.
// No dependencies — builds one overlay and reuses it for every image.
;(function () {
  var images = document.querySelectorAll('.aside-shot img, .split-media__image img')
  if (images.length === 0) return

  var overlay = document.createElement('div')
  overlay.className = 'lightbox-overlay'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">Close ✕</button>' +
    '<img alt="">' +
    '<div class="lightbox-caption"></div>'
  document.body.appendChild(overlay)

  var imgEl = overlay.querySelector('img')
  var captionEl = overlay.querySelector('.lightbox-caption')
  var closeBtn = overlay.querySelector('.lightbox-close')

  function open(src, alt) {
    imgEl.src = src
    imgEl.alt = alt || ''
    captionEl.textContent = alt || ''
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }
  function close() {
    overlay.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  images.forEach(function (img) {
    img.addEventListener('click', function () { open(img.src, img.alt) })
  })
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close()
  })
  closeBtn.addEventListener('click', close)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close()
  })
})()
