const api_url = 'https://api.nasa.gov/planetary/apod?api_key=eZ4aOutFSQ3iQuTHHK4LaReFfNxc0RgcJAsSeBOt&thumbs=true&';

let appEl = document.querySelector('.js-app');
let titleEl = document.querySelector('.js-title');
let pictureEl = document.querySelector('.js-figure');
let dateEl = document.querySelector('.js-date');
let copyEl = document.querySelector('.js-copy');
let explanationEl = document.querySelector('.js-explanation');
let loadingEl = document.querySelector('.js-loading');
let contentEl = document.querySelector('.js-content');
let previousButtonEl = document.querySelector('.js-previous-day');
let nextButtonEl = document.querySelector('.js-next-day');
// let todayButtonEl = document.querySelector('.js-today');
let picture = new Image();

const today = new Date();
const todayDateString = today.toDateString();

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDateString = yesterday.toDateString();

let date = new Date();
let dateDay = '';
let dateMonth = '';
let dateYear = '';
let pictureDate = '';

function setPictureDate() {
  dateDay = date.getDate();
  dateMonth = date.getMonth() + 1;
  dateYear = date.getFullYear();
  pictureDate = dateYear + '-' + dateMonth + '-' + dateDay;
  pictureDateString = date.toDateString();
}

setPictureDate();

async function getapi(url, date) {
  // Storing response
  const response = await fetch(
    url +
    new URLSearchParams({
      date: date,
    }).toString()
  );

  // Storing data in form of JSON
  var data = await response.json();

  if (response) {
    show(data);
  }
}

getapi(api_url, pictureDate);

function hideloader(callback) {
  appEl.classList.remove('is-starting', 'is-loading');
  callback();
}

function showloader() {
  appEl.classList.add('is-loading')
}

function checkToday() {
  if (pictureDateString === todayDateString) {
    appEl.classList.add('is-today');
    appEl.classList.remove('is-yesterday');
    nextButtonEl.setAttribute('disabled', true);
  } else {
    appEl.classList.remove('is-yesterday', 'is-today');
    nextButtonEl.removeAttribute('disabled');
  }
}

function scrollImage() {
  const viewportHeight = window.innerHeight;
  let bodyHeight = document.body.clientHeight;
  let scrollDistance = bodyHeight - viewportHeight;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    const scrollDifference = currentScroll / scrollDistance;
    pictureEl.style.setProperty('--scrollDifference', scrollDifference);
  });
}

function show(data) {
  checkToday();

  if (data.media_type === 'video') {
    hideloader(scrollImage);
    pictureEl.innerHTML = `
      <iframe width="320" height="180" class="app__player" src="${data.url}" title="video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>    
    `;
  } else {
    picture.src = data.url;
    picture.onload = function () {
      hideloader(scrollImage);
    }
    pictureEl.innerHTML = `
      <img class="app__img" src="${data.url}" alt="${data.title}">
    `;
  }

  titleEl.innerHTML = data.title;
  explanationEl.innerHTML = data.explanation;
  dateEl.innerHTML = pictureDateString;

  if (data.copyright) {
    copyEl.innerHTML = `Image credit: ${data.copyright}`;
    copyEl.style.display = 'block';
  } else {
    copyEl.style.display = 'none';
  }
}

previousButtonEl.addEventListener('click', function () {
  date.setDate(date.getDate() - 1);
  setPictureDate();
  // checkToday();
  showloader();
  getapi(api_url, pictureDate);
});

nextButtonEl.addEventListener('click', function () {
  date.setDate(date.getDate() + 1);
  setPictureDate();
  // checkToday();
  showloader();
  getapi(api_url, pictureDate);
});

