/* fix for Unsplash undeclared */
/*global Unsplash */

function fadeOut(el) {
  el.addEventListener('transitionend', function listener() {
    el.style.display = 'none';
    el.removeEventListener('transitionend', listener);
  });
  el.className = 'fadeOut';
}

function setBackgroundImage(url) {
  const photoContainer = document.getElementById('photoContainer');

  photoContainer.style.background = `url(${url}) no-repeat center center fixed`;
  photoContainer.style.backgroundSize = 'cover';
}

function setCreditUrl(user) {
  const photoCredit = document.getElementById('photoCredit');

  photoCredit.innerHTML = `<a href="${user.links.html}">${user.name}</a> / <a href="https://unsplash.com">Unsplash</a>`;
}

function setText() {
  const user = JSON.parse(localStorage.getItem('user'));
  const container = document.getElementById('container');

  if (user === null || user.name === false && user.showText) {
    container.innerHTML =
        ['<form id="usernameForm">',
          '<label for="username">What\'s your name ?</label>',
          '<input type="text" id="username" required>',
          '</form>'
        ].join('');
    const usernameForm = document.getElementById('usernameForm');
    usernameForm.addEventListener('submit', function (e) {
      localStorage.setItem('user', JSON.stringify({ name: usernameForm.children[1].value, showText: true }));
      e.preventDefault();
      setText();
    });
  } else if (user.showText) {
    const hours = new Date().getHours();
    let title;
    if (hours < 12) {
      title = `Good morning, ${user.name}.`;
    } else if (hours < 17) {
      title = `Good afternoon, ${user.name}.`;
    } else {
      title = `Good evening, ${user.name}.`;
    }
    container.innerHTML = `<h1 id="helloText">${title}</h1>`;
  } else {
    container.innerHTML = '';
  }
}

function setUpSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsContainer = document.getElementById('settings-container');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  settingsBtn.addEventListener('click', function () {
    settingsContainer.style.display = 'block';
  });
  settingsCloseBtn.addEventListener('click', function () {
    settingsContainer.style.display = 'none';
  });

  const changeName = document.getElementById('changeName');
  const toggleText = document.getElementById('toggleText');

  changeName.addEventListener('click', function () {
    localStorage.removeItem('user');
    setText();
  });
  toggleText.addEventListener('click', function () {
    const newUser = JSON.parse(localStorage.getItem('user'));
    if (newUser) {
      newUser.showText = !newUser.showText;
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.setItem('user', JSON.stringify({ name: false, showText: false }));
    }
    setText();
  });
}

function getAndDisplayImage() {
  const unsplash = new Unsplash.default({
    applicationId: 'd39a01d0afa7b51ca661ea6ebab52603bd76777e42427dd9f7c2cd5a6dc90398',
    secret: 'cf53c6b76854ea12934c56c145a85c3ede4f04c66eac028a0bcf526af331c111'
  });
  const image = JSON.parse(localStorage.getItem('image'));
  const imgPath = 'custom';
  const imgElem = new Image();

  if (image !== null) {
    setBackgroundImage(image.url);
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
            setBackgroundImage(res.urls[imgPath]);
            setCreditUrl(res.user);
          };
        }
        localStorage.setItem('image', JSON.stringify({ url: res.urls[imgPath], photographer: res.user }));
        imgElem.src = res.urls[imgPath];
      });
}

function main() {
  getAndDisplayImage();
  setText();
  setUpSettings();

  setTimeout(function () {
    fadeOut(document.getElementById('hider'));
  }, 0);
}

document.addEventListener('DOMContentLoaded', main);
