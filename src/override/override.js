function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

document.addEventListener("DOMContentLoaded", function () {
  const unsplash = new Unsplash.default({
    applicationId: "d39a01d0afa7b51ca661ea6ebab52603bd76777e42427dd9f7c2cd5a6dc90398",
    secret: "cf53c6b76854ea12934c56c145a85c3ede4f04c66eac028a0bcf526af331c111",
    callbackUrl: "https://oijdgkicifciofgbfcapbpndlmdjccjh.chromiumapp.org/auth-success"
  });

  const imgPath = 'custom';

  unsplash.photos.getRandomPhoto({
    query: 'ocean',
    width: 1920,
    height: 1080
  })
      .then(Unsplash.toJson)
      .then(res => {
        const img = new Image();
        img.onload = function () {
          const photoContainer = document.getElementById('photoContainer');
          photoContainer.style.background = 'url(' + res.urls[imgPath] + ') no-repeat center center fixed';
          photoContainer.style.backgroundSize = 'cover';
          fadeIn(photoContainer, 'block');
        };

        img.src = res.urls[imgPath];
      });
});
