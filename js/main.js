'use strict';

var WIDTH_PIN = 50;
var HEIGHT_PIN = 70;
var WIDTH_MAIN_PIN = 65;
var HEIGHT_MAIN_PIN = 65;
var MAX_PINS = 8;

var CoordinateMaps = {
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};

var Offers = {
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALO: 'Бунгало'
};

var startUserPinCoordinate = {
  X: 570,
  Y: 375
};

var map = document.querySelector('.map');
var formMapFilters = document.querySelector('.map__filters');
var mapFilters = formMapFilters.querySelectorAll('.map__filter');
var mapFiterFieldset = formMapFilters.querySelector('fieldset');
var formAd = document.querySelector('.ad-form');
var formAdFieldsets = formAd.querySelectorAll('fieldset');
var main = document.querySelector('main');
var price = formAd.querySelector('#price');
var pinList = document.querySelector('.map__pins');

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
    newCoordinates.push(generateRandomNumber(coordinates.MIN_X, coordinates.MAX_X));
    newCoordinates.push(generateRandomNumber(coordinates.MIN_Y, coordinates.MAX_Y));
    var offersKeys = (Object.values(offers));
    var offerType = getElementFormArray(offersKeys);
    adsArray.push(generateAd(uniqueImgAdress, offerType, newCoordinates[0], newCoordinates[1]));
  }
  return adsArray;
};

var ads = getAds(Offers, CoordinateMaps, MAX_PINS);

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

/**
 * Добавляет в DOM склонированные элементы.
 *
 * @param {Array} dataArray - массив с данными для рендера меток.
 * @param {number} widthPin - ширина метки.
 * @param {number} heightPin - высота метки.
 */
var renderPin = function (dataArray, widthPin, heightPin) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(generatePin(dataArray[i], widthPin, heightPin));
  }
  pinList.appendChild(fragment);
};

/**
 * Переключает состояние фильтра disable/active.
 *
 * @param {boolean} toggle - переключатель disable(true)/active(false).
 */
var isFilterDisabled = function (toggle) {
  mapFilters.forEach(function (filter) {
    filter.disabled = toggle;
  });
  mapFiterFieldset.disabled = toggle;
  if (toggle !== formMapFilters.classList.contains('map__filters--disabled')) {
    formMapFilters.classList.toggle('map__filters--disabled');
  }
};

var generateAddress = function (startPinCoordinate) {
  var address = formAd.querySelector('#address');
  address.value = (startPinCoordinate.X + WIDTH_MAIN_PIN / 2) + ', ' + (startPinCoordinate.Y + HEIGHT_MAIN_PIN / 2);
};
generateAddress(startUserPinCoordinate);

/**
 * Переключает состояние формы disable/active.
 *
 * @param {boolean} toggle - переключатель disable(true)/active(false).
 */
var isAdFormDisabled = function (toggle) {
  formAdFieldsets.forEach(function (fieldset) {
    fieldset.disabled = toggle;
  });
  if (toggle !== formAd.classList.contains('ad-form--disabled')) {
    formAd.classList.toggle('ad-form--disabled');
  }
};

/**
 * Отслеживает нажатие кнопки мыши на .map__pin--main
 * и запускает функцию активации карты
 */
main.addEventListener('mouseup', function (evt) {
  if (evt.target.closest('.map__pin--main')) {
    activateMap();
  }
}, false);

/**
 * Активирует фильтр, форму и показывает похожие объявления
 */
var activateMap = function () {
  map.classList.remove('map--faded');
  renderPin(ads, WIDTH_PIN, HEIGHT_PIN);
  isFilterDisabled(false);
  isAdFormDisabled(false);
};

/**
 * Блокирует карту, фильтр и форму
 */
var disableMap = function () {
  if (!map.classList.contains('map--faded')) {
    map.classList.add('map--faded');
  }
  isFilterDisabled(true);
  isAdFormDisabled(true);
};
disableMap();

formAd.addEventListener('click', function (evt) {
  if (evt.target.id === 'type') {
    var selectedType = evt.target.value;
    setMinPrice(selectedType);
  }
  if (evt.target.id === 'timein') {
    var selectedTime = evt.target.value;
    var syncTimes = formAd.querySelector('#timeout').querySelectorAll('option');
    setTime(selectedTime, syncTimes);
  }
  if (evt.target.id === 'timeout') {
    selectedTime = evt.target.value;
    syncTimes = formAd.querySelector('#timein').querySelectorAll('option');
    setTime(selectedTime, syncTimes);
  }
});

/**
 * Устанавливает плейсхолдер и минимальное значение для цены
 * в зависимости от типа предолжения
 *
 * @param {string} typeOffer - наименование типа жилья
 */
var setMinPrice = function (typeOffer) {
  if (typeOffer === 'bungalo') {
    price.min = '0';
    price.placeholder = '0';
  }
  if (typeOffer === 'flat') {
    price.min = '1000';
    price.placeholder = '1000';
  }
  if (typeOffer === 'house') {
    price.min = '5000';
    price.placeholder = '5000';
  }
  if (typeOffer === 'palace') {
    price.min = '10000';
    price.placeholder = '10000';
  }
};

/**
 * Устанавливает минимальную цену и плейсхолдер
 * для option выбранного по-умолчанию
 *
 */
var setDefaultMinPrice = function () {
  var types = formAd.querySelector('#type').querySelectorAll('option');
  types.forEach(function (defaultSelectedType) {
    if (defaultSelectedType.selected === true) {
      setMinPrice(defaultSelectedType.value);
    }
  });
};
setDefaultMinPrice();

/**
 * Устанавливает время выселения в зависимости от выбранного времени заселения и наоборот
 *
 * @param {string} selectedTime - значение выбранного option
 * @param {Collection} syncTimes - коллекция option, значение одного из них
 * должно быть аналогично selectedTime и выбрано как selected
 */
var setTime = function (selectedTime, syncTimes) {
  syncTimes.forEach(function (time) {
    if (selectedTime === time.value) {
      time.selected = true;
    }
  });
};
