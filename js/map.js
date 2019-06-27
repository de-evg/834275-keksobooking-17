'use strict';

(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var formMapFilters = document.querySelector('.map__filters');
  var mapFilters = formMapFilters.querySelectorAll('.map__filter');
  var mapFiterFieldset = formMapFilters.querySelector('fieldset');
  window.map = document.querySelector('.map');
  window.formAd = document.querySelector('.ad-form');
  var formAdFieldsets = window.formAd.querySelectorAll('fieldset');
  window.isMapDisabled = true;

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
   * Переключает состояние формы disable/active.
   *
   * @param {boolean} toggle - переключатель disable(true)/active(false).
   */
  var isAdFormDisabled = function (toggle) {
    formAdFieldsets.forEach(function (fieldset) {
      fieldset.disabled = toggle;
    });
    if (toggle !== window.formAd.classList.contains('ad-form--disabled')) {
      window.formAd.classList.toggle('ad-form--disabled');
    }
  };

  /**
   * Активирует фильтр, форму и показывает похожие объявления
   */
  window.activateMap = function () {
    window.map.classList.remove('map--faded');
    window.renderPin(window.ads, WIDTH_PIN, HEIGHT_PIN);
    window.isMapDisabled = false;
    isFilterDisabled(false);
    isAdFormDisabled(false);
  };

  /**
   * Блокирует карту, фильтр и форму
   */
  var disableMap = function () {
    if (!window.map.classList.contains('map--faded')) {
      window.map.classList.add('map--faded');
    }
    window.isMapDisabled = true;
    isFilterDisabled(true);
    isAdFormDisabled(true);
  };
  disableMap();
})();
