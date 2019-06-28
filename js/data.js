'use strict';

(function () {
  var MAX_PINS = 8;
  var utils = window.utils;
  var dataOffers = {};
  var isLoadSuccess = false;
  var errorTemplate = document.querySelector('#error');
  var Offers = {
    PALACE: {
      TYPE: 'Дворец',
      MIN_PRICE: 10000
    },
    FLAT: {
      TYPE: 'Квартира',
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

  var CoordinateMaps = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var onError = function (message) {
    console.error(message);
    var generateError = function () {
      var error = errorTemplate.cloneNode(true);
      error.display = 'block';
    }
  };

  var onSuccess = function (data, isLoad) {
    var dataOffers = data;
    isLoadSuccess = isLoad;
    return dataOffers;
  };
 dataOffers = window.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
  console.log(dataOffers)


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
  var getAds = function (offers, maximumPins) {
    var adsArray = [];
    for (var i = 0; i < maximumPins; i++) {
      var uniqueImgAdress = offers[i].author.avatar;
      var newCoordinates = [];
      newCoordinates.push(offers[i].location.x);
      newCoordinates.push(offers[i].location.y);
      var offerType = offers[i].offer.type;
      adsArray.push(generateAd(uniqueImgAdress, offerType, newCoordinates[0], newCoordinates[1]));
    }
    return adsArray;
  };

  var ads = getAds(window.dataOffers, window.maxPins);

  window.data = {
    offers: Offers,
    coordinate: CoordinateMaps,
    adArray: ads,
    load: isLoadSuccess,
    loadedData: dataOffers
  };
})();
