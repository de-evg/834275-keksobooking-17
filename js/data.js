'use strict';

(function () {
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

  window.data = {
    offers: Offers,
    coordinate: CoordinateMaps
  };
})();
