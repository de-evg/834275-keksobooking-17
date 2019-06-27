'use strict';

(function () {
  var WIDTH_PIN = 50;
  var HEIGHT_PIN = 70;
  var data = window.data;
  var map = document.querySelector('.map');
  var formAd = document.querySelector('.ad-form');
  var formMapFilters = document.querySelector('.map__filters');
  var mapFilters = formMapFilters.querySelectorAll('.map__filter');
  var mapFiterFieldset = formMapFilters.querySelector('fieldset');
  var formAdFieldsets = formAd.querySelectorAll('fieldset');
  var isMapDisabled = true;

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
    if (toggle !== formAd.classList.contains('ad-form--disabled')) {
      formAd.classList.toggle('ad-form--disabled');
    }
  };

  /**
   * Активирует фильтр, форму и показывает похожие объявления
   *
   * @param {Object} module - объект модуля содержащий фукцию renderPin
   */
  var activateMap = function (module) {
    map.classList.remove('map--faded');
    module.renderPin(data.ads, WIDTH_PIN, HEIGHT_PIN);
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

  window.main = {
    map: map,
    formAd: formAd,
    isMapDisabled: isMapDisabled,
    activateMap: activateMap
  };
})();
