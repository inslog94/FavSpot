function loadScript(src, callback) {
  var plugin_path = '../js/template/';
  var script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

export function loadAllScripts() {
  loadScript('/frontend/assets/js/template/jquery-3.6.0.min.js', function () {
    loadScript('/frontend/assets/js/template/plugins-jquery.js', function () {
      loadScript(
        '/frontend/assets/js/template/slick/slick.min.js',
        function () {
          loadScript('/frontend/assets/js/template/custom.js', function () {
            loadScript(
              'https://unpkg.com/swiper/swiper-bundle.min.js',
              function () {
                // All scripts have been loaded
                // console.log('All scripts loaded.');
              }
            );
          });
        }
      );
    });
  });
}
