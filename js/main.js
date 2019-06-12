'use strict';

var COORDINATE_MAP_PINS = {
  x: {
    MIN_WIDTH_MAP_PINS: 0,
    MAX_WIDTH_MAP_PINS: 1200
  },
  y: {
    MIN_HEIGTH_MAP_PINS: 130,
    MAX_HEIGTH_MAP_PINS: 630
  }
};

var AD = {
  numbers: {
    min: 1,
    max: 8
  },
  offers: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ]
}
//обявление массива для проверки на уникальность случайного числа
var randomNumbers = [];


/**
 * Генерирует адреса изображения для автара.
 *
 * @param {number} minNumberImg - минимальное число.
 * @param {number} maxNumberImg - максимальное число.
 * @return {string} - адрес изображения со случайной цифрой в конце строки в диапазоне [1, 8].
 */
var generateAvatarImg = function (minNumberImg, maxNumberImg) {
  //получаю случайное число
  var n = Math.floor(minNumberImg + (Math.random() * maxNumberImg));
  //выполняю проверку на уникальность
  if (checkRandomNumber(n, maxNumberImg)) {
    //создаю уникальную строку с адресом
    return 'img/avatars/user0' + n + '.png';
  } else {
    //повторяю генерацию случайного числа
    return generateAvatarImg(minNumberImg, maxNumberImg);
  }
};

/**
 * Проверяет на уникальность случайного числа.
 *
 * @param {number} randomNumber - случайное число.
 * @param {number} maxNumberImg - максимальное число.
 * @return {boolean} true - возвращает логическое true.
 */
var checkRandomNumber = function (randomNumber, maxNumberImg) {
  //проверяю на количество выбранных уникальных номеров
  if (randomNumbers.length < maxNumberImg) {
    //проверяю на наличие в массиве случайного числа
    if (randomNumbers.indexOf(randomNumber) === -1) {
      //добавляю в массив новое случайное число
      randomNumbers.push(randomNumber);
      return true;
    }
  }
};

/**
 * Получает случайный элемент массива.
 *
 * @param {Array} someArray - массив данных.
 * @return {Array} someArray[j] - возвращает случайный элемент массива.
 */
var getElementFormArray = function (someArray) {
  var j = Math.floor(Math.random() * someArray.length);
  return someArray[j];
}

/**
 * Генерирует случайную координату.
 *
 * @param {number} minCoordinate - минимальная координата.
 * @param {number} maxCoordinate - максимальная координата.
 * @return {number} coordinate - случайная координата.
 */
var generateCoordinate = function (minCoordinate, maxCoordinate) {
  var coordinate = Math.floor(minCoordinate + (Math.random() * (maxCoordinate - minCoordinate)));
  return coordinate;
}

//генерирует данные для объекта
var generateAd = function (minNumberImg, maxNumberImg, offersArray, minCoordinateX, maxCoordinateX, minCoordinateY, maxCoordinateY) {
  return {
    'author': {
      avatar: generateAvatarImg(minNumberImg, maxNumberImg)
    },
    'offer': {
      'type': getElementFormArray(offersArray)
    },
    'location': {
      'x': generateCoordinate(minCoordinateX, maxCoordinateX),
      'y': generateCoordinate(minCoordinateY, maxCoordinateY)
    }
  };
};

//генерация массива объявлений(объектов)
var ads = [];
while (randomNumbers.length !== AD.numbers.max) {
  ads.push(generateAd(AD.numbers.min, AD.numbers.max, AD.offers, COORDINATE_MAP_PINS.x.MIN_WIDTH_MAP_PINS, COORDINATE_MAP_PINS.x.MAX_WIDTH_MAP_PINS, COORDINATE_MAP_PINS.y.MIN_HEIGTH_MAP_PINS, COORDINATE_MAP_PINS.y.MAX_HEIGTH_MAP_PINS));
  console.log(ads);
}
