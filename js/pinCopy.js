'use strict';

(function () {
  var ESC_CODE = 27;
  var data = window.data;
  var main = window.main;
  var form = window.form;
  var card = window.card;
  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error'),
    CARD: document.querySelector('#card').content.querySelector('.map__card')
  };
  var pinList = document.querySelector('.map__pins');
  var mainPin = pinList.querySelector('.map__pin--main');
  var mainElement = document.querySelector('main');
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');


  /**
   * Генерирует объект с данными для метки.
   *
   * @param {Object} pinProperties - объект с данными для генерации новой метки.
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

  var generateCard = function (template, dataForCard) {
    var typeToAnotherType = {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    };

    var cardElement = template.CARD.cloneNode(true);
    cardElement.querySelector('img').src = dataForCard.author.avatar;
    cardElement.querySelector('.popup__title').textContent = dataForCard.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = dataForCard.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = dataForCard.offer.price + 'Р/ночь';

    // вставка типа жилья на русском языке
    Object.keys(typeToAnotherType).forEach(function (key) {
      if (key === dataForCard.type) {
        cardElement.querySelector('.popup__type').textContent = key.value;
      }
    });
    cardElement.querySelector('.popup__text--capacity').textContent = dataForCard.offer.rooms + ' комнаты для ' + dataForCard.offer.guests;
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataForCard.offer.checkin + ', выезд до ' + dataForCard.offer.checkout;

    // удаление из шаблона списка особенностей
    var features = cardElement.querySelector('.popup__features');
    while (features.querySelector('.popup__feature')) {
      features.removeChild(features.querySelector('.popup__feature'));
    }

    // вставка актуальных особенностей
    dataForCard.offer.features.forEach(function (feature) {
      var listItem = document.createElement('li');
      listItem.classList.add('popup__feature', 'popup__feature--' + feature);
      features.appendChild(listItem);
    });

    // вставка описания
    cardElement.querySelector('.popup__description').textContent = dataForCard.offer.description;

    // вставка фотографий
    var photos = cardElement.querySelector('.popup__photos');
    var img = photos.querySelector('img');

    for (var i = 1; i < dataForCard.offer.photos.length; i++) {
      var image = img.cloneNode();
      photos.appendChild(image);
    }

    var images = photos.querySelectorAll('img');
    images.forEach(function (imgNode, i) {
      imgNode.src = dataForCard.offer.photos[i];
    });

    cardElement.querySelector('.popup__avatar').src = dataForCard.author.avatar;
    return cardElement;
  };

  /**
   * Добавляет в DOM склонированные элементы.
   *
   * @param {Array} dataArray - массив с данными для рендера меток.
   * @param {number} widthPin - ширина метки.
   * @param {number} heightPin - высота метки.
   */
  var renderPin = function (dataArray) {
    var WIDTH_PIN = 50;
    var HEIGHT_PIN = 70;
    var newData = dataArray.slice(0, 5);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < newData.length; i++) {
      fragment.appendChild(generatePin(newData[i], i, WIDTH_PIN, HEIGHT_PIN));
    }
    pinList.appendChild(fragment);
    return newData;
  };

  /**
   * Добавляет в DOM склонированные элементы.
   *
   * @param {Array} dataArray - массив с данными для рендера меток.
   * @param {number} widthPin - ширина метки.
   * @param {number} heightPin - высота метки.
   */
  var renderCard = function (dataForCard) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(generateCard(Template, dataForCard));
    filtersContainer.before(fragment);
  };

  var closeCard = function () {
    if (map.querySelector('.map__card')) {
      var card = map.querySelector('.map__card');
      var cardClose = card.querySelector('.popup__close');
      cardClose.removeEventListener('click', closeCard);
      cardClose.removeEventListener('click', onCardEscPress);

      var card = map.querySelector('.map__card');
      map.removeChild(card);
    }
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      closeCard();
    }
  };

  /**
   * Отриосвывает метки при успешном получении данных с сервера.
   *
   * @param {Array} loadedData - массив с данными полученный от сервера.
   */
  var onSuccess = function (loadedData) {
    window.backendData = loadedData;
    window.newData = renderPin(window.backendData);
    main.formFilterElement.addEventListener('change', function (evt) {
      if (evt.target.id === 'housing-type') {
        switch (evt.target.value) {
          case 'house':
            removePins();
            var updatedData = sortingData(window.backendData, 'house');
            window.newData = renderPin(updatedData);
            break;
          case 'flat':
            removePins();
            updatedData = sortingData(window.backendData, 'flat');
            window.newData = renderPin(updatedData);
            break;
          case 'palace':
            removePins();
            updatedData = sortingData(window.backendData, 'palace');
            window.newData = renderPin(updatedData);
            break;
          case 'bungalo':
            removePins();
            updatedData = sortingData(window.backendData, 'bungalo');
            window.newData = renderPin(updatedData);
            break;
          case 'any':
            removePins();
            updatedData = sortingData(window.backendData);
            window.newData = renderPin(updatedData);
        }
      }
    });

    var onPinClick = function (evt) {
      window.newData.forEach(function (offer, i) {
        if (evt.target.id === 'pin' + i || evt.target === pinList.querySelector('#pin' + i + ' img')) {
          closeCard();
          renderCard(window.newData[i]);
          var card = map.querySelector('.map__card');
          var cardClose = card.querySelector('.popup__close');
          cardClose.addEventListener('click', closeCard);
          cardClose.addEventListener('keydown', onCardEscPress);
        }
      });
    };
    pinList.addEventListener('click', onPinClick);
  };

  /**
   * Удаляет метки из DOM дерева.
   *
   */
  var removePins = function () {
    var similarPins = document.querySelectorAll('.map__pin');
    var pins = Array.from(similarPins).slice(1);
    pins.forEach(function (pin) {
      pinList.removeChild(pin);
    });
  };

  /**
   * Фильтрует массив предложений по значению type.
   *
   * @param {Array} dataArray - массив с предложениями.
   * @param {String} type - тип предложения
   * @return {Array} отфильтрованный массив
   */
  var sortingData = function (dataArray, type) {
    if (!type) {
      return dataArray;
    } else {
      var newData = dataArray.slice().filter(function (newDataInner) {
        return newDataInner.offer.type === type;
      });
    }
    return newData;
  };

  /**
   * Показывает окно с ошибкой при ошибке загрузки данных с сервера.
   *
   */
  var onError = function () {
    var error = Template.ERROR.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(error);
    mainElement.appendChild(fragment);
    error.display = 'block';
  };

  // Взаимодействие с меткой
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (main.mapDisabled) {
      main.activate(onSuccess, onError);
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
        X: parseInt(mainPin.style.left, 10),
        Y: parseInt(mainPin.style.top, 10)
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
      mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';

      var Limits = {
        MIN_X: data.coordinate.MIN_X,
        MAX_X: data.coordinate.MAX_X - form.sizePin.WIDTH,
        MIN_Y: data.coordinate.MIN_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT,
        MAX_Y: data.coordinate.MAX_Y - form.sizePin.HEIGHT / 2 - form.sizePin.POINTER_HEIGHT
      };

      if (parseInt(mainPin.style.top, 10) < Limits.MIN_Y) {
        mainPin.style.top = Limits.MIN_Y + 'px';
      }

      if (parseInt(mainPin.style.top, 10) > Limits.MAX_Y) {
        mainPin.style.top = Limits.MAX_Y + 'px';
      }

      if (parseInt(mainPin.style.left, 10) < Limits.MIN_X) {
        mainPin.style.left = Limits.MIN_X + 'px';
      }

      if (parseInt(mainPin.style.left, 10) > Limits.MAX_X) {
        mainPin.style.left = Limits.MAX_X + 'px';
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
      main.mapElement.removeEventListener('mousemove', onMouseMove);
      main.mapElement.removeEventListener('mouseup', onMouseUp);
      var PinCoords = {
        X: parseInt(mainPin.style.left, 10),
        Y: parseInt(mainPin.style.top, 10)
      };
      form.address(PinCoords, form.sizePin, main.mapDisabled);
    };

    main.mapElement.addEventListener('mousemove', onMouseMove);
    main.mapElement.addEventListener('mouseup', onMouseUp);
  });

  window.pin = {
    render: renderPin,
    url: URL,
    template: Template
  };
})();
