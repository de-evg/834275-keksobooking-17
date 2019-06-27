'use strict';

var WIDTH_PIN = 50;
var HEIGHT_PIN = 70;




var CoordinateMaps = {
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};

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
var pinList = document.querySelector('.map__pins');
var selectTypeOffer = formAd.querySelector('#type');
var selectTimeIn = formAd.querySelector('#timein');
var selectTimeOut = formAd.querySelector('#timeout');
var mainPin = map.querySelector('.map__pin--main');
var price = formAd.querySelector('#price');
var isMapDisabled = true;










