'use strict';

(function () {
  var mainElement = document.querySelector('main');

  var map = mainElement.querySelector('.map');
  var pinList = map.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');

  var filtersContainer = map.querySelector('.map__filters-container');
  var formMapFilters = filtersContainer.querySelector('.map__filters');
  var mapFiterFieldset = formMapFilters.querySelector('fieldset');
  var mapFilters = formMapFilters.querySelectorAll('.map__filter');
  var formAd = mainElement.querySelector('.ad-form');
  var formAdFieldsets = formAd.querySelectorAll('fieldset');

  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error'),
    CARD: document.querySelector('#card').content.querySelector('.map__card'),
    SUCCESS: document.querySelector('#success').content.querySelector('.success')
  };

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
   * Показывает окно с ошибкой при ошибке загрузки данных с сервера.
   * @param {Object} template - перечисление шаблонов
   * @param {Object} parentElement - DOM элемент, в который добавится склонированный элемент
   */
  var onError = function (template, parentElement) {
    var error = template.ERROR.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(error);
    parentElement.appendChild(fragment);
    error.display = 'block';
  };

  window.utils = {
    getElementFormArray: getElementFormArray,
    generateRandomNumber: generateRandomNumber,
    error: onError,
    nodeMain: mainElement,
    nodeMap: map,
    nodePinList: pinList,
    nodeMainPin: mainPin,
    nodeFiltersContainer: filtersContainer,
    nodeFormMapFilters: formMapFilters,
    nodeMapFiterFieldset: mapFiterFieldset,
    nodeMapFilters: mapFilters,
    nodeFormAd: formAd,
    nodeFormAdFieldsets: formAdFieldsets,
    nodeTemplate: Template
  };
})();
