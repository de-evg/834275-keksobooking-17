'use strict';

var WIDTH_PIN = 50;
var HEIGHT_PIN = 70;
var MAX_PINS = 8;

var SizeMainPin = {
  WIDTH: 65,
  HEIGHT: 65,
  POINTER_HEIGHT: 22
};

var CoordinateMaps = {
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};

var Offers = {
  PALACE: {
    TYPE:'Дворец',
    MIN_PRICE: 10000
  },
  FLAT: {
    TYPE:'Квартира',
    MIN_PRICE: 1000
  },
  HOUSE: {
    TYPE: 'Дом',
    MIN_PRICE: 5000
  },
  BUNGALO: {
    TYPE: 'Бунгало',
    MIN_PRICE: 0
  }
};

var StartUserPinCoordinate = {
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
var pinList = document.querySelector('.map__pins');
var selectTypeOffer = formAd.querySelector('#type');
var selectTimeIn = formAd.querySelector('#timein');
var selectTimeOut = formAd.querySelector('#timeout');
var mainPin = map.querySelector('.map__pin--main');
var price = formAd.querySelector('#price');
var isMapDisabled = true;

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

/**
 * Генерирует и изменяет значение координат главного пина.
 *
 * @param {Object} startPinCoordinate - начальные координаты пина.
 * @param {number} widthMainPin - ширина пина
 * @param {number} heightMainPin - высота пина
 */
window.generateAddress = function (startPinCoordinate, sizeMainPin) {
  var address = formAd.querySelector('#address');
  isMapDisabled ?
  address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2))) :
  address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT)));
};
window.generateAddress(StartUserPinCoordinate, SizeMainPin);


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
    window.activateMap();
  }
}, false);

/**
 * Активирует фильтр, форму и показывает похожие объявления
 */
window.activateMap = function () {
  map.classList.remove('map--faded');
  renderPin(ads, WIDTH_PIN, HEIGHT_PIN);
  isMapDisabled = false;
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
  isMapDisabled = true;
  isFilterDisabled(true);
  isAdFormDisabled(true);
};
disableMap();

/**
 * Устанавливает плейсхолдер и минимальное значение для цены
 * в зависимости от типа предолжения
 *
 * @param {Object} offer - объект с параметрами выбранного типа.
 * @param {Object} inputFieldElement - DOM элемент для которго устанавилваются атрибуты
 */
var setMinPrice = function (offer, inputFieldElement) {
  var typeOffer = offer.selectedOption.value.toUpperCase();
  var attribute = offer.offersObj[typeOffer].MIN_PRICE;
  inputFieldElement.min = attribute;
  inputFieldElement.placeholder = attribute;
};

/**
 * Получает объект option в состоянии selected
 *
 * @param {Collection} select - коллекция option
 * @return {Object} selectedOption - выбранный option
 */
var getSelectedOption = function (select) {
  var index;
  var selectedOption;
  index = select.selectedIndex;
  selectedOption = select[index];
  select.addEventListener('change', function () {
    index = select.selectedIndex;
    selectedOption = select[index];
  });
  return selectedOption;
};

/**
 * Устанавливает плейсхолдер и минимальное значение цены
 * для option в состоянии selected по-умолчанию
 *
 * @param {Collection} select - коллекция option
 * @param {Object} offers - перечисление типов предложений
 * @param {Object} inputFieldElement - DOM элемент для которго устанавилваются атрибуты
 */
var getDefaultMinPrice = function (select, offers, inputFieldElement) {
  var offer = {
    selectedOption: getSelectedOption(select),
    offersObj: offers
  }
  setMinPrice(offer, inputFieldElement);
};
getDefaultMinPrice(selectTypeOffer, Offers, price);


/**
 * Устанавливает время выселения в зависимости от выбранного времени заселения и наоборот
 *
 * @param {string} selectedTime - значение выбранного option
 * @param {Collection} syncTimes - коллекция option, значение одного из них
 * должно быть аналогично selectedTime и выбрано как selected
 */
var setTime = function (selectedTime, syncTimes) {
  for (var i = 0; i < syncTimes.length; i++) {
    if (syncTimes[i].value === selectedTime.value) {
      syncTimes[i].selected = true;
    }
  }
};

formAd.addEventListener('click', function (evt) {
  switch (evt.target.id) {
    case 'type':
    var offer = {
      selectedOption: getSelectedOption(selectTypeOffer),
      offersObj: Offers
    };
    setMinPrice(offer, price);
    break;
    case 'timein':
    var selectedOption = getSelectedOption(selectTimeIn);
    setTime(selectedOption, selectTimeOut);
    break;
    case 'timeout':
    var selectedOption = getSelectedOption(selectTimeOut);
    setTime(selectedOption, selectTimeIn);
    break;
  }
});

// Перемещение метки
mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  window.activateMap();
  isMapDisabled = false;

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

/**
 * Перемещенает метку и передает координаты в форму
 *
 * @param {Object} moveEvt - DOM объект события
 *
 */
var onMouseMove = function (moveEvt) {
  moveEvt.preventDefault();

  var shift = {
    x: startCoords.x - moveEvt.clientX,
    y: startCoords.y - moveEvt.clientY
  };

  var PinCoords = {
    X: parseInt(mainPin.style.left, 10),
    Y: parseInt(mainPin.style.top, 10)
  };

  startCoords = {
    x: moveEvt.clientX,
    y: moveEvt.clientY
  };

  mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
  mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';

  var Limits = {
    MIN_X: CoordinateMaps.MIN_X,
    MAX_X: CoordinateMaps.MAX_X - SizeMainPin.WIDTH,
    MIN_Y: CoordinateMaps.MIN_Y - SizeMainPin.HEIGHT / 2 - SizeMainPin.POINTER_HEIGHT,
    MAX_Y: CoordinateMaps.MAX_Y - SizeMainPin.HEIGHT / 2 - SizeMainPin.POINTER_HEIGHT
  };

  if (parseInt(mainPin.style.top, 10) < Limits.MIN_Y) {
    mainPin.style.top = Limits.MIN_Y + 'px';
  };

  if (parseInt(mainPin.style.top, 10) > Limits.MAX_Y) {
    mainPin.style.top = Limits.MAX_Y + 'px';
  };

  if (parseInt(mainPin.style.left, 10) < Limits.MIN_X) {
    mainPin.style.left = Limits.MIN_X + 'px';
  };

  if (parseInt(mainPin.style.left, 10) > Limits.MAX_X) {
    mainPin.style.left = Limits.MAX_X + 'px';
  };
  window.generateAddress(PinCoords, SizeMainPin);
};

/**
 * Удаляет отслеживание событий и передает координаты в форму при отжатии кнопки мыши
 *
 * @param {Object} upEvt - DOM объект события
 *
 */
var onMouseUp = function (upEvt) {
  upEvt.preventDefault();
  map.removeEventListener('mousemove', onMouseMove);
  map.removeEventListener('mouseup', onMouseUp);
  var PinCoords = {
    X: parseInt(mainPin.style.left, 10),
    Y: parseInt(mainPin.style.top, 10)
  };
  window.generateAddress(PinCoords, SizeMainPin);
};

map.addEventListener('mousemove', onMouseMove);
map.addEventListener('mouseup', onMouseUp);
});

var test = {};
test.keys
