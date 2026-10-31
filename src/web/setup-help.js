// Makes a DATA_KEY and SETUP_TOKEN in this browser, so the secrets never pass through the server,
// the hosting company or anyone helping with the setup.
(function () {
  'use strict';
  var box = document.getElementById('keys');
  if (box.getAttribute('data-show') !== '1') return; // only when a key is what's missing
  var b64 = function (u8) { var s = ''; for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s); };
  var bytes = function (n) { var u = new Uint8Array(n); crypto.getRandomValues(u); return u; };
  document.getElementById('k1').textContent = b64(bytes(32));
  document.getElementById('k2').textContent = b64(bytes(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  box.hidden = false;
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.getAttribute('data-copy')).textContent;
      navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Select and copy it instead'; });
    });
  });
})();
