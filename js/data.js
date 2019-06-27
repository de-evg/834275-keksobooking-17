'use strict';

(function () {
  var MAX_PINS = 8;

  window.Offers = {
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

  window.CoordinateMaps = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };

  window.StartUserPinCoordinate = {
    X: 570,
    Y: 375
  };

  var utils = window.utils;

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
      newCoordinates.push(utils.generateRandomNumber(coordinates.MIN_X, coordinates.MAX_X));
      newCoordinates.push(utils.generateRandomNumber(coordinates.MIN_Y, coordinates.MAX_Y));
      var offersKeys = (Object.values(offers));
      var offerType = utils.getElementFormArray(offersKeys);
      adsArray.push(generateAd(uniqueImgAdress, offerType, newCoordinates[0], newCoordinates[1]));
    }
    return adsArray;
  };

  window.ads = getAds(window.Offers, window.CoordinateMaps, MAX_PINS);
})();
