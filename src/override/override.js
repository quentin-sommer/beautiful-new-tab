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

function setUpClearUser() {
  const clearUser = document.getElementById('clearUser');
  clearUser.innerHTML = '<p>Change name</p>';

  clearUser.addEventListener('click', function () {
    localStorage.removeItem('user');
    setText();
  });
}

function setImgUrl(url) {
  const photoContainer = document.getElementById('photoContainer');

  photoContainer.style.background = 'url(' + url + ') no-repeat center center fixed';
  photoContainer.style.backgroundSize = 'cover';
  fadeIn(photoContainer, 'block');
}

function setCreditUrl(user) {
  const photoCredit = document.getElementById('photoCredit');

  photoCredit.innerHTML = '<a href="' + user.links.html + '">' + user.name + '</a> / <a href="https://unsplash.com">Unsplash</a>';
}

function setText() {
  const user = localStorage.getItem('user');
  const container = document.getElementById('container');

  if (user === null) {
    container.innerHTML = [
      '<form id="usernameForm">',
      '<label for="username">What\'s your name ?</label>',
      '<input type="text" id="username">',
      '</form>'
    ].join("");
    const usernameForm = document.getElementById('usernameForm');

    usernameForm.addEventListener("submit", function (e) {
      localStorage.setItem('user', usernameForm.children[1].value);
      e.preventDefault();
      setText();
    });
  } else {
    const hours = new Date().getHours();
    let title;
    if (hours < 12) {
      title = `Good morning, ${user}.`;
    } else if (hours < 17) {
      title = `Good afternoon, ${user}.`;
    } else {
      title = `Good evening, ${user}.`;
    }
    container.innerHTML = '<h1 id="helloText">' + title + '</h1>';
    setUpClearUser();
  }
  fadeIn(container, 'block');
}

function main() {
  const unsplash = new Unsplash.default({
    applicationId: "d39a01d0afa7b51ca661ea6ebab52603bd76777e42427dd9f7c2cd5a6dc90398",
    secret: "cf53c6b76854ea12934c56c145a85c3ede4f04c66eac028a0bcf526af331c111"
  });
  const image = JSON.parse(localStorage.getItem('image'));
  const imgPath = 'custom';
  const imgElem = new Image();

  if (image !== null) {
    setImgUrl(image.url);
    setCreditUrl(image.photographer);
  }

  unsplash.photos.getRandomPhoto({
    width: 1920,
    height: 1080,
    featured: true
  })
      .then(Unsplash.toJson)
      .then(res => {
        if (image === null) {
          imgElem.onload = function () {
            setImgUrl(res.urls[imgPath]);
            setCreditUrl(res.user);
          };
        }
        localStorage.setItem('image', JSON.stringify({ url: res.urls[imgPath], photographer: res.user }));
        imgElem.src = res.urls[imgPath];
      });
  setText();
}

document.addEventListener("DOMContentLoaded", main);
