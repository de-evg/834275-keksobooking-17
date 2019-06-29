'use strict';

(function () {
  var data = window.data;
  var main = window.main;
  var form = window.form;
  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error')
  };
  var pinList = document.querySelector('.map__pins');
  var mainPin = main.mapElement.querySelector('.map__pin--main');
  var mainElement = document.querySelector('main');


  /**
   * Генерирует объект с данными для метки.
   *
   * @param {Object} pinProperties - объект с данными для генерации новой метки.
   * @param {number} widthPin - ширина метки.
   * @param {number} heightPin - высота метки.
   * @return {Object} pinElement - измененный склонированный элемент.
   */
  var generatePin = function (pinProperties, widthPin, heightPin) {
    var pinElement = Template.PIN.cloneNode(true);
    pinElement.style.cssText = 'left: ' + (pinProperties.location.x - widthPin / 2) + 'px; top: ' + (pinProperties.location.y - heightPin) + 'px;';
    pinElement.querySelector('img').src = pinProperties.author.avatar;
    pinElement.querySelector('img').alt = 'Метка похожего объявления';
    return pinElement;
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
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < dataArray.length; i++) {
      fragment.appendChild(generatePin(dataArray[i], WIDTH_PIN, HEIGHT_PIN));
    }
    pinList.appendChild(fragment);
  };

  /**
   * Отриосвывает метки при успешном получении данных с сервера.
   *
   * @param {Array} loadedData - массив с данными полученный от сервера.
   */
  var onSuccess = function (loadedData) {
    renderPin(loadedData);
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
    main.activate(onSuccess, onError);
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
    url: URL
  };
})();
