// Live FPS counter: replaces the static "60 fps" text with the real frame rate.
(function () {
  var spans = Array.prototype.filter.call(
    document.querySelectorAll('.text-block-wrap-div'),
    function (el) { return /^\s*\d+\s*fps\s*$/i.test(el.textContent); }
  );
  if (!spans.length) return;

  var UPDATE_MS = 250; // how often the number changes
  var frames = 0;
  var last = performance.now();

  function tick(now) {
    frames++;
    var elapsed = now - last;
    if (elapsed >= UPDATE_MS) {
      var fps = Math.round((frames * 1000) / elapsed);
      var text = String(fps).padStart(2, '0') + ' fps';
      spans.forEach(function (el) { el.textContent = text; });
      frames = 0;
      last = now;
    }
    requestAnimationFrame(tick);
  }

  // Tab hidden → browser pauses frames; reset so we don't show a fake drop.
  document.addEventListener('visibilitychange', function () {
    frames = 0;
    last = performance.now();
  });

  requestAnimationFrame(tick);
})();
