'use strict';

(function () {
  var utils = window.utils;
  var data = window.data;
  var main = window.main;
  var form = window.form;
  var card = window.card;
  var Type = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error'),
    CARD: document.querySelector('#card').content.querySelector('.map__card')
  };

  /**
   * Генерирует объект с данными для метки.
   *
   * @param {Object} pinProperties - объект с данными для генерации новой метки.
   * @param {number} numberProperties - номер объекта с данными метки для формирования id
   * @param {number} widthPin - ширина метки.
   * @param {number} heightPin - высота метки.
   * @return {Object} pinElement - измененный склонированный элемент.
   */
  var generatePin = function (pinProperties, numberProperties, widthPin, heightPin) {
    var pinElement = Template.PIN.cloneNode(true);
    pinElement.style.cssText = 'left: ' + (pinProperties.location.x - widthPin / 2) + 'px; top: ' + (pinProperties.location.y - heightPin) + 'px;';
    pinElement.querySelector('img').src = pinProperties.author.avatar;
    pinElement.querySelector('img').alt = 'Метка похожего объявления';
    pinElement.id = 'pin' + numberProperties;
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
   */
  var getPins = function (updatedData, pinsSettings) {
    var fragment = document.createDocumentFragment();
    updatedData.forEach(function (offer, i) {
      fragment.appendChild(generatePin(offer, i, pinsSettings.WIDTH_PIN, pinsSettings.HEIGHT_PIN));
    });
    utils.nodePinList.appendChild(fragment);
  };

  /**
   * Отриосвывает метки при успешном получении данных с сервера.
   *
   * @param {Array} loadedData - массив с данными полученный от сервера.
   * @param {Object} pinsSettings - перечисление параметров меток.
   */
  var renderPins = function (loadedData, pinsSettings) {
    var updatedData = getUpdatedData(loadedData, pinsSettings);
    getPins(updatedData, pinsSettings);

    var filterData = function (evt) {
      switch (evt.target.id) {
        case 'housing-type':
          removePins();
          var filteredData = filteringData(loadedData, evt.target.value);
          updatedData = getUpdatedData(filteredData, pinsSettings);
          getPins(updatedData, pinsSettings);
          break;
      }
    };

    utils.nodeFormMapFilters.addEventListener('change', filterData);

    /**
     * Обрабатывает нажатие на метку похожего объявления.
     *
     * @param {Object} evt - DOM объект собыитя.
     */
    var onPinClick = function (evt) {
      updatedData.forEach(function (offer, i) {
        if (evt.target.id === 'pin' + i || evt.target === utils.nodePinList.querySelector('#pin' + i + ' img')) {
          card.close();
          card.render(Template, offer, Type);
          var renderedCard = utils.nodeMap.querySelector('.map__card');
          var cardClose = renderedCard.querySelector('.popup__close');
          cardClose.addEventListener('click', card.close);
          renderedCard.addEventListener('keydown', card.pressEsc);
        }
      });
    };
    utils.nodePinList.addEventListener('click', onPinClick);
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
   * Фильтрует массив предложений по значению type.
   *
   * @param {Array} dataArray - массив с предложениями.
   * @param {String} type - тип предложения
   * @return {Array} отфильтрованный массив
   */
  var filteringData = function (dataArray, type) {
    if (type === 'any') {
      return dataArray;
    } else {
      var newData = dataArray.slice().filter(function (newDataInner) {
        return newDataInner.offer.type === type;
      });
    }
    return newData;
  };

  // Взаимодействие с меткой
  utils.nodeMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (main.mapDisabled) {
      main.activate(renderPins, utils.error);
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
    template: Template
  };
})();
