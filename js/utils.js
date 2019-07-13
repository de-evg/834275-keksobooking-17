'use strict';

(function () {
  var mainElement = document.querySelector('main');

  var mapElement = mainElement.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mainPinElement = mapPinsElement.querySelector('.map__pin--main');

  var filtersContainerElement = mapElement.querySelector('.map__filters-container');
  var mapFiltersElement = filtersContainerElement.querySelector('.map__filters');
  var mapFiterFieldsetElement = mapFiltersElement.querySelector('fieldset');
  var mapFiltersCollection = mapFiltersElement.querySelectorAll('.map__filter');
  var formAdElement = mainElement.querySelector('.ad-form');
  var formAdFieldsetsElement = formAdElement.querySelectorAll('fieldset');

  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error'),
    CARD: document.querySelector('#card').content.querySelector('.map__card'),
    SUCCESS: document.querySelector('#success').content.querySelector('.success')
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
    error: onError,
    nodeMain: mainElement,
    nodeMap: mapElement,
    nodePinList: mapPinsElement,
    nodeMainPin: mainPinElement,
    nodeFiltersContainer: filtersContainerElement,
    nodeFormMapFilters: mapFiltersElement,
    nodeMapFiterFieldset: mapFiterFieldsetElement,
    nodeMapFilters: mapFiltersCollection,
    nodeFormAd: formAdElement,
    nodeFormAdFieldsets: formAdFieldsetsElement,
    nodesTemplate: Template
  };
})();
