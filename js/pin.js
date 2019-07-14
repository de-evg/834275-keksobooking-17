'use strict';

(function () {
  var utils = window.utils;
  var debounce = window.debounce;
  var main = window.main;
  var form = window.form;
  var card = window.card;
  var StartIndexForSlice = {
    FILTER_NAME: 7,
    TARGET_ID: 3
  };
  var FiltersMap = {};
  var Type = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };
  var CoordinateMaps = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };
  var FilterPriceValue = {
    LOW: [10000],
    MIDDLE: [10000, 50000],
    HIGH: [50000]
  };

  /**
   * Генерирует объект с данными для метки.
   *
   * @param {Object} pinProperties - объект с данными для генерации новой метки.
   * @param {number} numberProperties - номер объекта с данными метки для формирования id
   * @param {number} widthPin - ширина метки.
   * @param {number} heightPin - высота метки.
   * @param {Object} cardData - объект с данными для карточки.
   * @return {Object} pinElement - измененный склонированный элемент.
   */
  var generatePin = function (pinProperties, numberProperties, widthPin, heightPin, cardData) {
    var pinElement = utils.nodesTemplate.PIN.cloneNode(true);
    pinElement.style.cssText = 'left: ' + (pinProperties.location.x - widthPin / 2) + 'px; top: ' + (pinProperties.location.y - heightPin) + 'px;';
    pinElement.querySelector('img').src = pinProperties.author.avatar;
    pinElement.querySelector('img').alt = 'Метка похожего объявления';
    pinElement.querySelector('img').id = 'img' + numberProperties;
    pinElement.id = 'pin' + numberProperties;
    cardData[numberProperties] = pinProperties;
    return pinElement;
  };

  /**
   * Обновляет массив до необходимого количство объектов с данными для метки.
   *
   * @param {Array} filteredData - массив с объектами для генерации меток.
   * @param {Object} pinsSettings - перечисление параметров меток.
   * @return {Array} обновленный массив.
   */
  var sliceToRequriedOffers = function (filteredData, pinsSettings) {
    return filteredData.slice(0, pinsSettings.MAX_PINS);
  };

  /**
   * Генерирует необходимое количество меток и добавляет их в DOM.
   *
   * @param {Array} requriedOffers - массив с данными для рендера меток.
   * @param {Object} pinsSettings - перечисление параметров меток.
   * @param {Object} cardData - объект с данными для карточки.
   */
  var getPins = function (requriedOffers, pinsSettings, cardData) {
    var fragment = document.createDocumentFragment();
    requriedOffers.forEach(function (offer, i) {
      fragment.appendChild(generatePin(offer, i, pinsSettings.WIDTH_PIN, pinsSettings.HEIGHT_PIN, cardData));
    });
    utils.nodePinList.appendChild(fragment);
  };

  /**
   * Отриcовывает метки при успешном получении данных с сервера.
   *
   * @param {Array} loadedData - массив с данными полученный от сервера.
   * @param {Object} pinsSettings - перечисление параметров меток.
   */
  var renderPins = function (loadedData, pinsSettings) {
    var requriedOffers = sliceToRequriedOffers(loadedData, pinsSettings);
    var dataForCard = {};
    getPins(requriedOffers, pinsSettings, dataForCard);

    /**
     * Обрабатывает изменение фильтра.
     *
     * @param {Object} evt - DOM объект собыитя.
     */
    var onFilterChange = function (evt) {
      updateFiltersMap(evt.target, FiltersMap);
      debounce.set(function () {
        card.close();
        removePins();
        var filteredData = filteringData(loadedData, evt.target, FiltersMap);
        requriedOffers = sliceToRequriedOffers(filteredData, pinsSettings);
        getPins(requriedOffers, pinsSettings, dataForCard);
      });
    };
    utils.nodeFormMapFilters.addEventListener('change', onFilterChange);

    /**
     * Перечисляет примененные фильтры.
     *
     * @param {Object} filterElement - измененный фильтр.
     * @param {Object} filtersMap - перечисление примененных фильтров
     */
    var updateFiltersMap = function (filterElement, filtersMap) {
      var filterName = filterElement.id;
      var value = filterElement.value;
      if (value === 'any' || filterElement.checked === false) {
        delete filtersMap[filterName];
      } else {
        filtersMap[filterName] = value;
      }
    };

    /**
     * Фильтрует массив предложений.
     *
     * @param {Array} dataOffers - массив с предложениями.
     * @param {Object} changedFilterElement - тип предложения
     * @param {Object} filtersMap - перечисление примененных фильтров
     * @return {Array} отфильтрованный массив
     */
    var filteringData = function (dataOffers, changedFilterElement, filtersMap) {
      var filterNames = Object.keys(filtersMap);
      if (filterNames.length === 0) {
        return dataOffers;
      } else {
        var newDataOffers = dataOffers.slice();
        filterNames.forEach(function (filterName) {
          switch (filterName) {
            case 'housing-type':
              newDataOffers = newDataOffers.filter(function (currentOffer) {
                return currentOffer.offer.type === filtersMap[filterName];
              });
              break;

            case 'housing-rooms':
              newDataOffers = newDataOffers.filter(function (currentOffer) {
                return currentOffer.offer.rooms === +filtersMap[filterName];
              });
              break;

            case 'housing-price':
              switch (filtersMap[filterName]) {
                case 'low':
                  newDataOffers = newDataOffers.filter(function (currentOffer) {
                    return currentOffer.offer.price < FilterPriceValue.LOW[0];
                  });
                  break;
                case 'middle':
                  newDataOffers = newDataOffers.filter(function (currentOffer) {
                    return currentOffer.offer.price >= FilterPriceValue.MIDDLE[0] && currentOffer.offer.price < FilterPriceValue.MIDDLE[1];
                  });
                  break;
                case 'high':
                  newDataOffers = newDataOffers.filter(function (currentOffer) {
                    return currentOffer.offer.price > FilterPriceValue.HIGH[0];
                  });
                  break;
              }
              break;

            case 'housing-guests':
              newDataOffers = newDataOffers.filter(function (currentOffer) {
                if (!currentOffer.offer.guests) {
                  return currentOffer.offer.guests === +filtersMap[filterName];
                } else {
                  return currentOffer.offer.guests >= +filtersMap[filterName] && !!(+filtersMap[filterName]);
                }

              });
              break;
            case 'filter-' + filterName.slice(StartIndexForSlice.FILTER_NAME):
              newDataOffers = newDataOffers.filter(function (currentOffer) {
                var indexOfFilter = currentOffer.offer.features.indexOf(filterName.slice(StartIndexForSlice.FILTER_NAME));
                return currentOffer.offer.features[indexOfFilter] === filtersMap[filterName];
              });
              break;
          }
        });
      }
      return newDataOffers;
    };

    /**
     * Обрабатывает нажатие на метку похожего объявления.
     *
     * @param {Object} evt - DOM объект собыитя.
     */
    var onPinClick = function (evt) {
      if (dataForCard[evt.target.id.slice(StartIndexForSlice.TARAGET_ID)]) {
        card.close();
        card.render(utils.nodesTemplate, dataForCard[evt.target.id.slice(StartIndexForSlice.TARAGET_ID)], Type);
      }
    };
    utils.nodePinList.addEventListener('click', onPinClick);

    utils.nodeFormAd.addEventListener('reset', function () {
      clearMap();
    });
  };


  /**
   * Удаляет метки из DOM дерева.
   *
   */
  var removePins = function () {
    var similarPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pins = Array.from(similarPinElements);
    pins.forEach(function (pin) {
      utils.nodePinList.removeChild(pin);
    });
  };

  /**
   * Возвращает карту с метками в исходное состояние.
   *
   */
  var resetPin = function () {
    utils.nodeMainPin.style.top = form.pinCoords.Y + 'px';
    utils.nodeMainPin.style.left = form.pinCoords.X + 'px';
  };

  /**
   * Возвращает страницу в исходное состояние.
   */
  var clearMap = function () {
    resetPin();
    main.mapDisabled = true;
    removePins();
    card.close();
    utils.nodeFormMapFilters.reset();
    main.disable();
    FiltersMap = {};
  };

  // Взаимодействие с меткой
  utils.nodeMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (main.mapDisabled) {
      main.activate(renderPins, utils.error, 'GET');
    }
    main.mapDisabled = false;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * Перемещенает метку и передает координаты в форму
     *
     * @param {Object} moveEvt - DOM объект события
     *
     */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var PinCoords = {
        X: parseInt(utils.nodeMainPin.style.left, 10),
        Y: parseInt(utils.nodeMainPin.style.top, 10)
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      utils.nodeMainPin.style.top = utils.nodeMainPin.offsetTop - shift.y + 'px';
      utils.nodeMainPin.style.left = utils.nodeMainPin.offsetLeft - shift.x + 'px';

      var Limits = {
        MIN_X: CoordinateMaps.MIN_X,
        MAX_X: CoordinateMaps.MAX_X - form.sizePin.WIDTH,
        MIN_Y: CoordinateMaps.MIN_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT,
        MAX_Y: CoordinateMaps.MAX_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT
      };

      if (parseInt(utils.nodeMainPin.style.top, 10) < Limits.MIN_Y) {
        utils.nodeMainPin.style.top = Limits.MIN_Y + 'px';
      }

      if (parseInt(utils.nodeMainPin.style.top, 10) > Limits.MAX_Y) {
        utils.nodeMainPin.style.top = Limits.MAX_Y + 'px';
      }

      if (parseInt(utils.nodeMainPin.style.left, 10) < Limits.MIN_X) {
        utils.nodeMainPin.style.left = Limits.MIN_X + 'px';
      }

      if (parseInt(utils.nodeMainPin.style.left, 10) > Limits.MAX_X) {
        utils.nodeMainPin.style.left = Limits.MAX_X + 'px';
      }
      form.address(PinCoords, form.sizePin, main.mapDisabled);
    };

    /**
     * Удаляет отслеживание событий и передает координаты в форму при отжатии кнопки мыши
     *
     * @param {Object} upEvt - DOM объект события
     *
     */
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      utils.nodeMap.removeEventListener('mousemove', onMouseMove);
      utils.nodeMap.removeEventListener('mouseup', onMouseUp);
      var PinCoords = {
        X: parseInt(utils.nodeMainPin.style.left, 10),
        Y: parseInt(utils.nodeMainPin.style.top, 10)
      };
      form.address(PinCoords, form.sizePin, main.mapDisabled);
    };

    utils.nodeMap.addEventListener('mousemove', onMouseMove);
    utils.nodeMap.addEventListener('mouseup', onMouseUp);
  });

  window.pin = {
    remove: removePins,
    clear: clearMap,
    filters: FiltersMap
  };
})();
