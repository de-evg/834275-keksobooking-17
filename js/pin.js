'use strict';

(function () {
  var utils = window.utils;
  var data = window.data;
  var main = window.main;
  var form = window.form;
  var card = window.card;
  var formResetBtn = utils.nodeFormAd.querySelector('.ad-form__reset');
  var FiltersMap = {};
  var Type = {
    'PALACE': 'Дворец',
    'FLAT': 'Квартира',
    'HOUSE': 'Дом',
    'BUNGALO': 'Бунгало'
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
    var pinElement = utils.nodeTemplate.PIN.cloneNode(true);
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
   * @param {Array} dataArray - массив с объектами для генерации меток.
   * @param {Object} pinsSettings - перечисление параметров меток.
   * @return {Array} обновленный массив.
   */
  var getUpdatedData = function (dataArray, pinsSettings) {
    return dataArray.slice(0, pinsSettings.MAX_PINS);
  };

  /**
   * Генерирует необходимое количество меток и добавляет их в DOM.
   *
   * @param {Array} updatedData - массив с данными для рендера меток.
   * @param {Object} pinsSettings - перечисление параметров меток.
   * @param {Object} cardData - объект с данными для карточки.
   */
  var getPins = function (updatedData, pinsSettings, cardData) {
    var fragment = document.createDocumentFragment();
    updatedData.forEach(function (offer, i) {
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
    var updatedData = getUpdatedData(loadedData, pinsSettings);
    var dataForCard = {};
    getPins(updatedData, pinsSettings, dataForCard);

    /**
     * Фильтрует массив предложений.
     *
     * @param {Object} evt - DOM объект собыитя.
     */
    var filterData = function (evt) {
      removePins();
      createFilterMap(evt.target, FiltersMap);
      var filteredData = filteringData(loadedData, evt.target, FiltersMap);
      updatedData = getUpdatedData(filteredData, pinsSettings);
      window.setTimeout(function () {
        getPins(updatedData, pinsSettings, dataForCard);
      }, 500);
    };
    utils.nodeFormMapFilters.addEventListener('change', filterData);

    /**
     * Наполняет перечисление примененных фильтров.
     *
     * @param {Object} filterElement - node полученный по событию.
     * @param {Object} filtersMap - перечисление примененных фильтров
     */
    var createFilterMap = function (filterElement, filtersMap) {
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
     * @param {Array} dataArray - массив с предложениями.
     * @param {Object} changedFilterElement - тип предложения
     * @param {Object} filtersMap - перечисление примененных фильтров
     * @return {Array} отфильтрованный массив
     */
    var filteringData = function (dataArray, changedFilterElement, filtersMap) {
      var filterNames = Object.keys(filtersMap);
      if (filterNames.length === 0) {
        return dataArray;
      } else {
        var newData = dataArray.slice();
        filterNames.forEach(function (filter) {
          switch (filter) {
            case 'housing-type':
              newData = newData.filter(function (currentOffer) {
                return currentOffer.offer.type === filtersMap[filter];
              });
              break;

            case 'housing-rooms':
              newData = newData.filter(function (currentOffer) {
                return currentOffer.offer.rooms === +filtersMap[filter];
              });
              break;

            case 'housing-price':
              switch (filtersMap[filter]) {
                case 'low':
                  newData = newData.filter(function (currentOffer) {
                    return currentOffer.offer.price < 10000;
                  });
                  break;
                case 'middle':
                  newData = newData.filter(function (currentOffer) {
                    return currentOffer.offer.price >= 10000 && currentOffer.offer.price < 50000;
                  });
                  break;
                case 'high':
                  newData = newData.filter(function (currentOffer) {
                    return currentOffer.offer.price > 50000;
                  });
                  break;
              }
              break;

            case 'housing-guests':
              newData = newData.filter(function (currentOffer) {
                if (currentOffer.offer.guests === 0) {
                  return currentOffer.offer.guests === +filtersMap[filter];
                } else {
                  return currentOffer.offer.guests >= +filtersMap[filter] && +filtersMap[filter] !== 0;
                }

              });
              break;
            case 'filter-' + filter.slice(7):
              newData = newData.filter(function (currentOffer) {
                var indexOfFilter = currentOffer.offer.features.indexOf(filter.slice(7));
                return currentOffer.offer.features[indexOfFilter] === filtersMap[filter];
              });
              break;
          }
        });
      }
      return newData;
    };

    /**
     * Обрабатывает нажатие на метку похожего объявления.
     *
     * @param {Object} evt - DOM объект собыитя.
     */
    var onPinClick = function (evt) {
      card.close();
      card.render(utils.nodeTemplate, dataForCard[evt.target.id.slice(3)], Type);
      var renderedCard = utils.nodeMap.querySelector('.map__card');
      var cardClose = renderedCard.querySelector('.popup__close');
      cardClose.addEventListener('click', card.close);
      renderedCard.addEventListener('keydown', card.pressEsc);
    };

    utils.nodePinList.addEventListener('click', onPinClick);

    formResetBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      resetPin();
      form.reset();
    });
  };


  /**
   * Удаляет метки из DOM дерева.
   *
   */
  var removePins = function () {
    var similarPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var pins = Array.from(similarPins);
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
  var clearPage = function () {
    resetPin();
    main.mapDisabled = true;
    removePins();
    card.close();
    form.reset();
    utils.nodeFormMapFilters.reset();
    main.disable();
    Object.keys(FiltersMap).forEach(function (key) {
      delete FiltersMap[key];
    });
    var successElement = utils.nodeTemplate.SUCCESS.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(successElement);
    utils.nodeMain.appendChild(fragment);
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
        MIN_X: data.coordinate.MIN_X,
        MAX_X: data.coordinate.MAX_X - form.sizePin.WIDTH,
        MIN_Y: data.coordinate.MIN_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT,
        MAX_Y: data.coordinate.MAX_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT
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
    clear: clearPage,
    filters: FiltersMap
  };
})();
