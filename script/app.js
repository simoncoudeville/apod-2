const api_url = 'https://api.nasa.gov/planetary/apod?api_key=eZ4aOutFSQ3iQuTHHK4LaReFfNxc0RgcJAsSeBOt&';

let titleEl = document.querySelector('.js-title');
let pictureEl = document.querySelector('.js-picture');
let dateEl = document.querySelector('.js-date');
let copyEl = document.querySelector('.js-copy');
let explanationEl = document.querySelector('.js-explanation');
let loadingEl = document.querySelector('.js-loading');
let contentEl = document.querySelector('.js-content');
let picture = new Image();

let previousButtonEl = document.querySelector('.js-previous-day');
let nextButtonEl = document.querySelector('.js-next-day');

const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth() + 1;
const todayYear = today.getFullYear();
const todayDate = todayYear + '-' + todayMonth + '-' + todayDay;

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
  // pictureDateFormat = date.toLocaleDateString(); 
  // pictureDateFormat = date.toLocaleString(); 
  // pictureDateFormat = date.toString(); 
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
    // hideloader();
    show(data);
  }

  // show(data);
}

// Calling that async function
getapi(api_url, pictureDate);

// Function to hide the loader
function hideloader() {
  loadingEl.style.display = 'none';
  contentEl.style.display = 'block';
}

function showloader() {
  loadingEl.style.display = 'flex';
  contentEl.style.display = 'none';
}

showloader();

function checkToday() {
  if (pictureDate === todayDate) {
    nextButtonEl.style.display = 'none';
  } else {
    nextButtonEl.style.display = 'flex';
  }
}

function show(data) {
  checkToday();
  
  if (data.media_type === 'video') {
    hideloader();
    pictureEl.innerHTML = `
    <div class="app__video">
      <iframe class="app__player" src="${data.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `;
  } else {
    picture.src = data.url;

    picture.onload = function() {
      hideloader();
    }

    // pictureEl.innerHTML = `
    //   <img class="app__picture" src="${data.hdurl}" alt="${data.title}">
    // `;
    pictureEl.innerHTML = `
      <img class="app__img" src="${data.url}" alt="${data.title}">
    `;
  }

  titleEl.innerHTML = data.title;
  explanationEl.innerHTML = data.explanation;
  dateEl.innerHTML = pictureDateFormat;

  if (data.copyright) {
    copyEl.innerHTML = `<span class="u-meta">Image credit:</span> ${data.copyright}`;
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
