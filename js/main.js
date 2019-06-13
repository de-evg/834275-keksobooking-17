'use strict';

var WIDTH_PIN = 50;
var HEIGHT_PIN = 70;
var MAX_PINS = 8;

var COORDINATE_MAP_PINS = {
  X: {
    MIN_WIDTH_MAP_PINS: 0,
    MAX_WIDTH_MAP_PINS: 1200
  },
  Y: {
    MIN_HEIGTH_MAP_PINS: 130,
    MAX_HEIGTH_MAP_PINS: 630
  }
};

var AD = {
  NUMBERS: {
    MIN: 1,
    MAX: 8
  },
  OFFERS: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ]
};
// обявление массива для проверки на уникальность случайного числа
var randomNumbers = [];

/**
 * Генерирует адреса изображения для автара.
 *
 * @param {number} minNumberImg - минимальное число.
 * @param {number} maxNumberImg - максимальное число.
 * @return {string} - адрес изображения со случайной цифрой в конце строки в диапазоне [1, 8].
 */
var generateAvatarImg = function (minNumberImg, maxNumberImg) {
  // получаю случайное число
  var n = Math.floor(minNumberImg + (Math.random() * maxNumberImg));
  // выполняю проверку на уникальность
  if (checkRandomNumber(n, maxNumberImg)) {
    // создаю уникальную строку с адресом
    return 'img/avatars/user0' + n + '.png';
  } else {
    // повторяю генерацию случайного числа
    return generateAvatarImg(minNumberImg, maxNumberImg);
  }
};

/**
 * Проверяет на уникальность случайного числа.
 *
 * @param {number} randomNumber - случайное число.
 * @param {number} maxNumberImg - максимальное число.
 * @return {boolean} - возвращает логическое true или false.
 */
var checkRandomNumber = function (randomNumber, maxNumberImg) {
  // проверяю на наличие в массиве случайного числа
  if (randomNumbers.indexOf(randomNumber) === -1) {
    // добавляю в массив новое случайное число
    randomNumbers.push(randomNumber);
    return true;
  }
  return false;
};

console.log(randomNumbers);

/**
 * Получает случайный элемент массива.
 *
 * @param {Array} someArray - массив данных.
 * @return {Array} someArray[j] - возвращает случайный элемент массива.
 */
var getElementFormArray = function (someArray) {
  var j = Math.floor(Math.random() * someArray.length);
  return someArray[j];
};

/**
 * Генерирует случайную координату X.
 *
 * @param {number} minCoordinate - минимальная координата X.
 * @param {number} maxCoordinate - максимальная координата X.
 * @param {number} widthPin - ширина метки.
 * @return {number} coordinateX - случайная координата X.
 */
var generateCoordinateX = function (minCoordinate, maxCoordinate, widthPin) {
  var coordinateX = Math.floor(minCoordinate + (Math.random() * (maxCoordinate - minCoordinate)) - widthPin / 2);
  return coordinateX;
};

/**
 * Генерирует случайную координату Y.
 *
 * @param {number} minCoordinate - минимальная координата Y.
 * @param {number} maxCoordinate - максимальная координата Y.
 * @param {number} heightPin - высота метки.
 * @return {number} coordinateY - случайная координата Y.
 */
var generateCoordinateY = function (minCoordinate, maxCoordinate, heightPin) {
  var coordinateY = Math.floor(minCoordinate + (Math.random() * (maxCoordinate - minCoordinate)) - heightPin);
  return coordinateY;
};

/**
 * Генерирует объект данных для метки.
 *
 * @param {number} minNumberImg - минимальное число изображения для автара.
 * @param {number} maxNumberImg - максимальное число изображения для автара.
 * @param {Array} offersArray - массив рекламных предложений.
 * @param {number} minCoordinateX - минимальная координата X.
 * @param {number} maxCoordinateX - максимальная координата X.
 * @param {number} widthPin - ширина метки.
 * @param {number} minCoordinateY - минимальная координата Y.
 * @param {number} maxCoordinateY - максимальная координата Y.
 * @param {number} heightPin - высота метки.
 * @return {Object} - объект данных  для метки: строка адреса для автара, строка тип предлложения, координаты метки.
 */
var generateAd = function (minNumberImg, maxNumberImg, offersArray, minCoordinateX, maxCoordinateX, widthPin, minCoordinateY, maxCoordinateY, heightPin) {
  return {
    'author': {
      'avatar': generateAvatarImg(minNumberImg, maxNumberImg)
    },
    'offer': {
      'type': getElementFormArray(offersArray)
    },
    'location': {
      'x': generateCoordinateX(minCoordinateX, maxCoordinateX, widthPin),
      'y': generateCoordinateY(minCoordinateY, maxCoordinateY, heightPin)
    }
  };
};

/**
 * Генерирует массив объектов с данными для метки.
 *
 * @param {number} minNumberImg - минимальное число изображения для автара.
 * @param {number} maxNumberImg - максимальное число изображения для автара.
 * @param {Array} offersArray - массив рекламных предложений.
 * @param {number} minCoordinateX - минимальная координата X.
 * @param {number} maxCoordinateX - максимальная координата X.
 * @param {number} widthPin - ширина метки.
 * @param {number} minCoordinateY - минимальная координата Y.
 * @param {number} maxCoordinateY - максимальная координата Y.
 * @param {number} heightPin - высота метки.
 * @param {Array} maxPins - максимальное количество меток .
 * @return {Array} adsArray - массив объектов с данными для меток.
 */
var getAds = function (minNumberImg, maxNumberImg, offersArray, minCoordinateX, maxCoordinateX, widthPin, minCoordinateY, maxCoordinateY, heightPin, maxPins) {
  var adsArray = [];
  for (var i = 0; i < maxPins; i++) {
    adsArray.push(generateAd(AD.NUMBERS.MIN, AD.NUMBERS.MAX, AD.OFFERS, COORDINATE_MAP_PINS.X.MIN_WIDTH_MAP_PINS, COORDINATE_MAP_PINS.X.MAX_WIDTH_MAP_PINS, WIDTH_PIN, COORDINATE_MAP_PINS.Y.MIN_HEIGTH_MAP_PINS, COORDINATE_MAP_PINS.Y.MAX_HEIGTH_MAP_PINS, HEIGHT_PIN));
  }
  return adsArray;
};

var ads = getAds(AD.NUMBERS.MIN, AD.NUMBERS.MAX, AD.OFFERS, COORDINATE_MAP_PINS.X.MIN_WIDTH_MAP_PINS, COORDINATE_MAP_PINS.X.MAX_WIDTH_MAP_PINS, WIDTH_PIN, COORDINATE_MAP_PINS.Y.MIN_HEIGTH_MAP_PINS, COORDINATE_MAP_PINS.Y.MAX_HEIGTH_MAP_PINS, HEIGHT_PIN, MAX_PINS);

console.log(ads);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinList = document.querySelector('.map__pins');
var pinTamplate = document.querySelector('#pin').content.querySelector('.map__pin');

/**
 * Генерирует массив объектов с данными для метки.
 *
 * @param {Object} pinProperties - объект с данными для генерации новой метки.
 * @return {Object} pinElement - измененный склонированный элемент.
 */
var generatePin = function (pinProperties) {
  var pinElement = pinTamplate.cloneNode(true);
  pinElement.style.cssText = 'left: ' + pinProperties.location.x + 'px; top: ' + pinProperties.location.y + 'px;';
  pinElement.querySelector('img').src = pinProperties.author.avatar;
  pinElement.querySelector('img').alt = pinProperties.offer.type;
  return pinElement;
};

var fragment = document.createDocumentFragment();

/**
 * Добавляет в DOM склонированные элементы.
 *
 * @param {Array} dataArray - массив с данными для рендера меток.
 */
var renderPin = function (dataArray) {
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(generatePin(dataArray[i]));
  }
  pinList.appendChild(fragment);
};

renderPin(ads);
