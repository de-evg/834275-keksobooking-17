'use strict';

(function () {
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
   * @param {function} onSuccess - функция обработки успешного получения данных
   * @param {function} onError - функция обработки ошибки при запросе/получении данных
   */
  var activateMap = function (onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    window.load(URL, onSuccess, onError);
    map.classList.remove('map--faded');
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
    mapElement: map,
    formAdElement: formAd,
    formFilterElement: formMapFilters,
    mapDisabled: isMapDisabled,
    activate: activateMap
  };
})();
