const api_url = 'https://api.nasa.gov/planetary/apod?api_key=eZ4aOutFSQ3iQuTHHK4LaReFfNxc0RgcJAsSeBOt&';

let appEl = document.querySelector('.js-app');
let titleEl = document.querySelector('.js-title');
let pictureEl = document.querySelector('.js-picture');
let dateEl = document.querySelector('.js-date');
let copyEl = document.querySelector('.js-copy');
let explanationEl = document.querySelector('.js-explanation');
let loadingEl = document.querySelector('.js-loading');
let contentEl = document.querySelector('.js-content');
let previousButtonEl = document.querySelector('.js-previous-day');
let nextButtonEl = document.querySelector('.js-next-day');
let todayButtonEl = document.querySelector('.js-today');
let bottomEl = document.querySelector('.js-bottom');
let picture = new Image();

const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth() + 1;
const todayYear = today.getFullYear();
const todayDate = todayYear + '-' + todayMonth + '-' + todayDay;

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDay = yesterday.getDate();
const yesterdayMonth = yesterday.getMonth() + 1;
const yesterdayYear = yesterday.getFullYear();
const yesterdayDate = yesterdayYear + '-' + yesterdayMonth + '-' + yesterdayDay;

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
  pictureDateFormat = date.toDateString();
}

setPictureDate();

// Defining async function
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

// Calling that async function
getapi(api_url, pictureDate);

// Function to hide the loader
function hideloader(callback) {
  appEl.classList.remove('is-starting', 'is-loading');
  callback();
}

function showloader() {
  appEl.classList.add('is-loading')
}

function checkToday() {
  if (pictureDate === todayDate) {
    nextButtonEl.style.display = 'none';
    todayButtonEl.style.display = 'none';
  } else if (pictureDate === yesterdayDate) {
    nextButtonEl.style.display = 'flex';
    todayButtonEl.style.display = 'none';
  } else {
    nextButtonEl.style.display = 'flex';
    todayButtonEl.style.display = 'flex';
  }
}

function setDocumentHeight() {
  const viewportHeight = window.innerHeight;
  let bodyHeight = document.body.clientHeight;
  let checkpoint = (bodyHeight - viewportHeight) * 1.25;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= checkpoint) {
      opacity = 1 - currentScroll / checkpoint;
    } else {
      opacity = 0;
    }

    pictureEl.style.opacity = opacity;
  });
}

function show(data, callback) {
  checkToday();

  if (data.media_type === 'video') {
    hideloader(setDocumentHeight);
    pictureEl.innerHTML = `
    <div class="app__video">
      <iframe class="app__player" src="${data.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `;
  } else {
    picture.src = data.url;

    picture.onload = function () {
      hideloader(setDocumentHeight);
    }
    pictureEl.innerHTML = `
      <img class="app__img" src="${data.url}" alt="${data.title}">
    `;
  }

  titleEl.innerHTML = data.title;
  explanationEl.innerHTML = data.explanation;
  dateEl.innerHTML = pictureDateFormat;

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
  checkToday();
  showloader();
  getapi(api_url, pictureDate);
});

nextButtonEl.addEventListener('click', function () {
  date.setDate(date.getDate() + 1);
  setPictureDate();
  checkToday();
  showloader();
  getapi(api_url, pictureDate);
});

todayButtonEl.addEventListener('click', function () {
  date.setDate(today.getDate());
  setPictureDate();
  checkToday();
  showloader();
  getapi(api_url, pictureDate);
});

