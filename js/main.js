'use strict';

var WIDTH_PIN = 50;
var HEIGHT_PIN = 70;
var MAX_PINS = 8;

var CoordinateMaps = [
  {MIN_X: 0},
  {MAX_X: 1200},
  {MIN_Y:130},
  {MAX_Y: 630}
];

var b = Object.values(CoordinateMaps[1]);
var c = b.slice(0, 1);
console.log(c);

var Offers = {
  'PALACE': 'Дворец',
  'FLAT': 'Квартира',
  'HOUSE': 'Дом',
  'BUNGALO': 'Бунгало'
};

/**
 * Получает случайный элемент массива.
 *
 * @param {Array} someArray - массив данных.
 * @return {any} someArray[j] - возвращает случайный элемент массива .
 */
var getElementFormArray = function (someArray) {
  var j = Math.floor(Math.random() * someArray.length);
  return someArray[j];
};

/**
 * Генерирует случайное значение.
 *
 * @param {number} minNumber - минимальное значение.
 * @param {number} maxNumber - максимальное значение.
 * @return {number} number - случайное значение.
 */
var generateRandomNumber = function (minNumber, maxNumber) {
  var number = Math.floor(minNumber + (Math.random() * (maxNumber + 1 - minNumber)));
  return number;
};

/**
 * Генерирует объект данных для метки.
 *
 * @param {string} uniqueImgAdress - уникальный адрес изображения.
 * @param {string} offerType - тип предлагаемого жилья.
 * @param {number} coordinateX - координата X.
 * @param {number} coordinateY - координата Y.
 * @return {Object} - объект данных для метки: строка адреса для автара, строка тип предлложения, координаты метки.
 */
var generateAd = function (uniqueImgAdress, offerType, coordinateX, coordinateY) {
  return {
    'author': {
      'avatar': uniqueImgAdress
    },
    'offer': {
      'type': offerType
    },
    'location': {
      'x': coordinateX,
      'y': coordinateY
    }
  };
};

/**
 * Генерирует массив объектов с данными для метки.
 *
 * @param {Array} offers - массив значений предлагаемого жилья.
 * @param {Array} coordinates -  диапазоны координат X и Y.
 * @param {Array} maxPins - максимальное количество меток .
 * @return {Array} adsArray - массив объектов с данными для меток.
 */
var getAds = function (offers, coordinates, maxPins) {
  var adsArray = [];
  for (var i = 0; i < maxPins; i++) {
    var uniqueImgAdress = 'img/avatars/user0' + (i + 1) + '.png';
    var newCoordinates = [];
    coordinates.forEach(function (coordinate, j) {
      var newCoordinateX = generateRandomNumber(Object.values(coordinates[0])[0], Object.values(coordinates[1])[0]);
      var newCoordinateY = generateRandomNumber(Object.values(coordinates[2])[0], Object.values(coordinates[3])[0]);
      newCoordinates.push(newCoordinateX, newCoordinateY);
    });
    var offersKeys = (Object.values(offers));
    var offerType = getElementFormArray(offersKeys);
    adsArray.push(generateAd(uniqueImgAdress, offerType, newCoordinates[0], newCoordinates[1]));
  }
  return adsArray;
};

var ads = getAds(Offers, CoordinateMaps, MAX_PINS);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinList = document.querySelector('.map__pins');
var pinTamplate = document.querySelector('#pin').content.querySelector('.map__pin');

/**
 * Генерирует объект с данными для метки.
 *
 * @param {Object} pinProperties - объект с данными для генерации новой метки.
 * @param {number} widthPin - ширина метки.
 * @param {number} heightPin - высота метки.
 * @return {Object} pinElement - измененный склонированный элемент.
 */
var generatePin = function (pinProperties, widthPin, heightPin) {
  var pinElement = pinTamplate.cloneNode(true);
  pinElement.style.cssText = 'left: ' + (pinProperties.location.x - widthPin / 2) + 'px; top: ' + (pinProperties.location.y - heightPin) + 'px;';
  pinElement.querySelector('img').src = pinProperties.author.avatar;
  pinElement.querySelector('img').alt = 'Метка похожего объявления';
  return pinElement;
};

var fragment = document.createDocumentFragment();

/**
 * Добавляет в DOM склонированные элементы.
 *
 * @param {Array} dataArray - массив с данными для рендера меток.
 * @param {number} widthPin - ширина метки.
 * @param {number} heightPin - высота метки.
 */
var renderPin = function (dataArray, widthPin, heightPin) {
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(generatePin(dataArray[i], widthPin, heightPin));
  }
  pinList.appendChild(fragment);
};

renderPin(ads, WIDTH_PIN, HEIGHT_PIN);
