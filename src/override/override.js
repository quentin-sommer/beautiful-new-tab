function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .05) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

function setImgUrl(url) {
  const photoContainer = document.getElementById('photoContainer');
  photoContainer.style.background = 'url(' + url + ') no-repeat center center fixed';
  photoContainer.style.backgroundSize = 'cover';
  fadeIn(photoContainer, 'block');
  setText();
}

function setCreditUrl(user) {
  console.log(user);
  const userP = document.getElementById('photoCredit');
  userP.innerHTML = '<a href="' + user.links.html + '">' + user.name + '</a> / <a href="https://unsplash.com">Unsplash</a>';
}

function setText() {
  const hours = new Date().getHours();
  const textElem = document.getElementById('helloText');

  if (hours < 12) {
    textElem.innerHTML = 'Good morning, Quentin.';
  } else if (hours < 17) {
    textElem.innerHTML = 'Good afternoon, Quentin.';
  } else {
    textElem.innerHTML = 'Good evening, Quentin.';
  }
}

function main() {
  const unsplash = new Unsplash.default({
    applicationId: "d39a01d0afa7b51ca661ea6ebab52603bd76777e42427dd9f7c2cd5a6dc90398",
    secret: "cf53c6b76854ea12934c56c145a85c3ede4f04c66eac028a0bcf526af331c111",
    callbackUrl: "https://oijdgkicifciofgbfcapbpndlmdjccjh.chromiumapp.org/auth-success"
  });
  const imgPath = 'custom';
  let fromLocal = true;
  const img = JSON.parse(localStorage.getItem('image'));

  if (img !== null) {
    setImgUrl(img.url);
    setCreditUrl(img.photographer);
  } else {
    fromLocal = false;
  }

  unsplash.photos.getRandomPhoto({
    width: 1920,
    height: 1080,
    featured: true
  })
      .then(Unsplash.toJson)
      .then(res => {
        const img = new Image();
        localStorage.setItem('image', JSON.stringify({ url: res.urls[imgPath], photographer: res.user }));
        if (fromLocal === false) {
          img.onload = function () {
            setImgUrl(res.urls[imgPath]);
            setCreditUrl(res.user);
          };
        }
        img.src = res.urls[imgPath];
      });
}

document.addEventListener("DOMContentLoaded", main);
