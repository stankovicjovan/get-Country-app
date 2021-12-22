'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const message = document.querySelector('.message');

const btn2 = document.querySelector('.btn-country--2');
const input = document.querySelector('.input-area');

const renderCoutnry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${+(
      data.population / 1000000
    ).toFixed(1)}M</p>
    <p class="country__row"><span>🗣️</span>${
      Object.values(data.languages)[0]
    }</p>
    <p class="country__row"><span>💰</span>${
      Object.values(data.currencies)[0].name
    }</p>
  </div>
</article>
`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  message.textContent = '';
  message.insertAdjacentText('beforeend', msg);
  message.style.opacity = 1;
};
const mathRandom = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// function in both functions
const helperFunction = async function (res) {
  if (!res.ok) throw new Error('Problem getting location data!');

  const data = await res.json();

  renderCoutnry(data[0]);

  const neighbour = data[0].borders;
  if (!neighbour) throw new Error(`Neighbours doesnt exist!`);

  const neighbour2 = neighbour[mathRandom(0, neighbour.length - 1)];

  const res2 = await fetch(
    `https://restcountries.com/v3.1/alpha/${neighbour2}`
  );

  const data2 = await res2.json();

  renderCoutnry(data2[0], 'neighbour');
};

// with check input
const whereAmI = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);

    helperFunction(res);
  } catch (err) {
    console.error(err);
    renderError(`Something went wrong : ${err.message} Please try again`);

    throw err;
  }
};

// check coords of device
const whereAmI2 = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

    if (!resGeo.ok) throw new Error('Problem getting location data!');

    const dataGeo = await resGeo.json();

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );

    helperFunction(res);
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(err);
    renderError(`Something went wrong : ${err.message} Please try again`);
    throw err;
  }
};

btn.addEventListener('click', async function () {
  try {
    countriesContainer.textContent = '';
    const pos = await whereAmI2();
    renderError(pos);
  } catch (err) {
    err;
  }
});
btn2.addEventListener('click', async function () {
  try {
    message.textContent = '';
    countriesContainer.textContent = '';
    const pos = await whereAmI(input.value);
    input.value = '';
  } catch (err) {
    err;
  }
});
