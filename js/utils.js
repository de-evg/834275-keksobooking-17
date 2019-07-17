'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

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

  window.utils = {
    key: KeyCode,
    nodeMain: mainElement,
    nodeMap: mapElement,
    nodeMapPins: mapPinsElement,
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
