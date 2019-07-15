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
  var dataForCard = {};
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
    LOW: [-Infinity, 10000],
    MIDDLE: [10000, 50000],
    HIGH: [50000, Infinity]
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
  var generatePin = function (pinProperties, numberProperties, widthPin, heightPin) {
    var pinElement = utils.nodesTemplate.PIN.cloneNode(true);
    var pinImg = pinElement.querySelector('img');
    pinElement.style.cssText = 'left: ' + (pinProperties.location.x - widthPin / 2) + 'px; top: ' + (pinProperties.location.y - heightPin) + 'px;';
    pinImg.src = pinProperties.author.avatar;
    pinImg.alt = 'Метка похожего объявления';
    pinImg.id = 'img' + numberProperties;
    pinElement.id = 'pin' + numberProperties;
    dataForCard[numberProperties] = pinProperties;
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
  var getPins = function (requriedOffers, pinsSettings) {
    var fragment = document.createDocumentFragment();
    requriedOffers.forEach(function (offer, i) {
      var generatedPin = generatePin(offer, i, pinsSettings.WIDTH_PIN, pinsSettings.HEIGHT_PIN);
      fragment.appendChild(generatedPin);
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
    getPins(requriedOffers, pinsSettings);

    /**
     * Фильтрует данные по типу предложения.
     *
     * @param {Array} dataOffers - фильтруемые данные.
     * @param {String} filterName - название примененного фильтра
     * @param {Array} filtersMap - перечисление примененных фильтров
     * @return {Array} dataOffers - отфильтрованные данные
     */
    var filteringType = function (dataOffers, filterName, filtersMap) {
      dataOffers = dataOffers.filter(function (currentOffer) {
        return currentOffer.offer.type === filtersMap[filterName];
      });
      return dataOffers;
    };

    /**
     * Фильтрует данные по Количеству комнат.
     *
     * @param {Array} dataOffers - фильтруемые данные.
     * @param {String} filterName - название примененного фильтра
     * @param {Array} filtersMap - перечисление примененных фильтров
     * @return {Array} dataOffers - отфильтрованные данные
     */
    var filteringRooms = function (dataOffers, filterName, filtersMap) {
      dataOffers = dataOffers.filter(function (currentOffer) {
        return currentOffer.offer.rooms === +filtersMap[filterName];
      });
      return dataOffers;
    };

    /**
     * Фильтрует данные по цене.
     *
     * @param {Array} dataOffers - фильтруемые данные.
     * @param {String} filterName - название примененного фильтра
     * @param {Array} filtersMap - перечисление примененных фильтров
     * @param {Object} filterPriceValues - перечисление значений цены с диапазоном цены
     * @return {Array} dataOffers - отфильтрованные данные
     */
    var filteringPrice = function (dataOffers, filterName, filtersMap, filterPriceValues) {
      var range = filterPriceValues[filtersMap[filterName].toUpperCase()];
      dataOffers = dataOffers.filter(function (currentOffer) {
        return currentOffer.offer.price >= range[0] && currentOffer.offer.price < range[1];
      });
      return dataOffers;
    };

    /**
     * Фильтрует данные по количеству гостей.
     *
     * @param {Array} dataOffers - фильтруемые данные.
     * @param {String} filterName - название примененного фильтра
     * @param {Array} filtersMap - перечисление примененных фильтров
     * @return {Array} dataOffers - отфильтрованные данные
     */
    var filteringGuests = function (dataOffers, filterName, filtersMap) {
      dataOffers = dataOffers.filter(function (currentOffer) {
        return !currentOffer.offer.guests ? currentOffer.offer.guests === +filtersMap[filterName] : currentOffer.offer.guests >= +filtersMap[filterName] && !!(+filtersMap[filterName]);
      });
      return dataOffers;
    };

    /**
     * Фильтрует данные по наличию какой-либо особенности.
     *
     * @param {Array} dataOffers - фильтруемые данные.
     * @param {String} filterName - название примененного фильтра
     * @param {Array} filtersMap - перечисление примененных фильтров
     * @return {Array} dataOffers - отфильтрованные данные
     */
    var filteringFeatures = function (dataOffers, filterName, filtersMap) {
      dataOffers = dataOffers.filter(function (currentOffer) {
        var indexOfFilter = currentOffer.offer.features.indexOf(filterName.slice(StartIndexForSlice.FILTER_NAME));
        return currentOffer.offer.features[indexOfFilter] === filtersMap[filterName];
      });
      return dataOffers;
    };

    var Filter = {
      'HOUSING-TYPE': {
        employ: filteringType
      },
      'HOUSING-ROOMS': {
        employ: filteringRooms
      },
      'HOUSING-PRICE': {
        employ: filteringPrice
      },
      'HOUSING-GUESTS': {
        employ: filteringGuests
      },
      'FILTER-WIFI': {
        employ: filteringFeatures
      },
      'FILTER-DISHWASHER': {
        employ: filteringFeatures
      },
      'FILTER-PARKING': {
        employ: filteringFeatures
      },
      'FILTER-WASHER': {
        employ: filteringFeatures
      },
      'FILTER-ELEVATOR': {
        employ: filteringFeatures
      },
      'FILTER-CONDITIONER': {
        employ: filteringFeatures
      }
    };

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
        var filteredData = filteringData(loadedData, FiltersMap, Filter, FilterPriceValue);
        requriedOffers = sliceToRequriedOffers(filteredData, pinsSettings);
        getPins(requriedOffers, pinsSettings);
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
     * @param {Object} filtersMap - перечисление примененных фильтров
     * @param {Object} filters - перечисление всех фильтров
     * @param {Object} filterPriceValues - перечисление значений цены с диапазоном цены.
     * @return {Array} отфильтрованный массив
     */
    var filteringData = function (dataOffers, filtersMap, filters, filterPriceValues) {
      var filterNames = Object.keys(filtersMap);
      if (filterNames.length === 0) {
        return dataOffers;
      } else {
        var newDataOffers = dataOffers.slice();
        filterNames.forEach(function (filterName) {
          newDataOffers = filters[filterName.toUpperCase()].employ(newDataOffers, filterName, filtersMap, filterPriceValues);
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
      if (dataForCard[evt.target.id.slice(StartIndexForSlice.TARGET_ID)]) {
        card.close();
        card.render(utils.nodesTemplate, dataForCard[evt.target.id.slice(StartIndexForSlice.TARGET_ID)], Type);
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
