// Анимации появления/по клику и автозапуск видео в зоне видимости.
(function () {
  var dataEl = document.getElementById('page-data');
  if (!dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EASE = { 'power1.inOut': 'cubic-bezier(0.45, 0, 0.55, 1)' };
  function ease(e) {
    if (EASE[e]) return EASE[e];
    if (/^[\d.\s,-]+$/.test(e)) return 'cubic-bezier(' + e + ')';
    return 'ease-in-out';
  }
  function frame(kf) {
    var f = {};
    if ('opacity' in kf) f.opacity = kf.opacity;
    if ('x' in kf || 'y' in kf) f.transform = 'translate3d(' + (kf.x || '0px') + ',' + (kf.y || '0px') + ',' + (kf.z || '0px') + ')';
    return f;
  }
  // Свойства разных эффектов одного элемента объединяются в один набор кадров.
  function setStart(el, effects) {
    effects.forEach(function (e) { Object.assign(el.style, frame(e.kf[0])); });
  }
  function play(el, effects, reverse) {
    effects.forEach(function (e) {
      var kf = e.kf.map(frame);
      if (reverse) kf.reverse();
      if (reduce) { Object.assign(el.style, kf[kf.length - 1]); return; }
      el.animate(kf, {
        duration: e.duration * 1000, delay: reverse ? 0 : e.delay * 1000,
        easing: ease(e.ease), fill: 'both'
      }).onfinish = function () { Object.assign(el.style, kf[kf.length - 1]); };
    });
  }

  var io = 'IntersectionObserver' in window && new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      en.target._appear.forEach(function (effects) { play(en.target, effects); });
    });
  }, { threshold: 0 });

  data.animations.forEach(function (a) {
    var el = document.querySelector(a.el);
    if (!el || !a.effects.length) return;
    setStart(el, a.effects);
    if (a.on === 'appear') {
      if (!io) return play(el, a.effects);
      (el._appear = el._appear || []).push(a.effects);
      io.observe(el);
    } else {
      var t = document.querySelector(a.trigger) || el;
      var open = false;
      t.style.cursor = 'pointer';
      t.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (open && a.second !== 'reverse') return;
        play(el, a.effects, open);
        open = !open;
      });
    }
  });

  // Видео: играют, пока видны на экране.
  data.videos.forEach(function (sel) {
    var v = document.querySelector(sel);
    if (!v) return;
    v.muted = true;
    if (!io) { v.play(); return; }
    new IntersectionObserver(function (en) {
      en[0].isIntersecting ? v.play().catch(function () {}) : v.pause();
    }, { threshold: 0.2 }).observe(v);
  });
})();
