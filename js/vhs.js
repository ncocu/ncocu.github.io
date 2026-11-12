// Subtle VHS overlay: scanlines, grain, tracking band, flicker, vignette, slight RGB split on text.
// Purely decorative: pointer-events none, disabled animation for prefers-reduced-motion.
(function () {
  var STRENGTH = 1; // 0..1+ — общий множитель заметности

  // Grain texture, generated once.
  var size = 160;
  var c = document.createElement('canvas');
  c.width = c.height = size;
  var ctx = c.getContext('2d');
  var img = ctx.createImageData(size, size);
  for (var i = 0; i < img.data.length; i += 4) {
    var v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  var noise = c.toDataURL('image/png');

  var css = [
    '.vhs{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden}',
    '.vhs__lines{position:absolute;inset:0;opacity:' + 0.22 * STRENGTH + ';',
    '  background:repeating-linear-gradient(to bottom,rgba(0,0,0,.6) 0,rgba(0,0,0,.6) 1px,transparent 1px,transparent 3px);',
    '  animation:vhs-flicker 4s steps(1) infinite}',
    '.vhs__grain{position:absolute;inset:-160px;opacity:' + 0.05 * STRENGTH + ';mix-blend-mode:overlay;',
    '  background:url(' + noise + ');animation:vhs-grain .5s steps(1) infinite}',
    '.vhs__band{position:absolute;left:0;right:0;height:14vh;top:-20vh;opacity:' + 0.05 * STRENGTH + ';',
    '  background:linear-gradient(to bottom,transparent,rgba(255,255,255,.9) 45%,rgba(255,255,255,.4) 55%,transparent);',
    '  mix-blend-mode:overlay;animation:vhs-band 11s linear infinite}',
    '.vhs__vignette{position:absolute;inset:0;',
    '  background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,' + 0.28 * STRENGTH + ') 100%)}',
    '.text-block-wrap-div{text-shadow:.5px 0 rgba(255,40,90,.22),-.5px 0 rgba(40,200,255,.22)}',
    '@keyframes vhs-grain{0%{transform:translate(0,0)}20%{transform:translate(-40px,30px)}40%{transform:translate(50px,-20px)}',
    '  60%{transform:translate(-20px,-60px)}80%{transform:translate(70px,40px)}100%{transform:translate(0,0)}}',
    '@keyframes vhs-band{0%{top:-20vh}70%,100%{top:120vh}}',
    '@keyframes vhs-flicker{0%,100%{opacity:' + 0.22 * STRENGTH + '}47%{opacity:' + 0.17 * STRENGTH + '}49%{opacity:' + 0.26 * STRENGTH + '}}',
    '@media (prefers-reduced-motion:reduce){.vhs *{animation:none!important}.vhs__band{display:none}}'
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.className = 'vhs';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="vhs__grain"></div><div class="vhs__lines"></div><div class="vhs__band"></div><div class="vhs__vignette"></div>';
  document.body.appendChild(root);
})();
