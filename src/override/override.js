$(function () {
  const unsplash = new Unsplash.default({
    applicationId: "d39a01d0afa7b51ca661ea6ebab52603bd76777e42427dd9f7c2cd5a6dc90398",
    secret: "cf53c6b76854ea12934c56c145a85c3ede4f04c66eac028a0bcf526af331c111",
    callbackUrl: "https://oijdgkicifciofgbfcapbpndlmdjccjh.chromiumapp.org/auth-success"
  });

  unsplash.photos.getRandomPhoto({
    query: 'ocean',
    width: 1920,
    height: 1080
  })
      .then(Unsplash.toJson)
      .then(res => {
        const img = new Image();
        img.onload = function () {
          const container = $('#photoContainer');
          container.css('background', 'url(' + res.urls.custom + ') no-repeat center center fixed');
          container.css('background-size', 'cover');
          container.fadeIn(500);
        };

        img.src = res.urls.custom;
      });
});
