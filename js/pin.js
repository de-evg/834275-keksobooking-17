'use strict';

(function () {
  var pinTamplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

/**
 * Генерирует объект с данными для метки.
 *
 * @param {Object} pinProperties - объект с данными для генерации новой метки.
 * @param {number} widthPin - ширина метки.
 * @param {number} heightPin - высота метки.
 * @return {Object} pinElement - измененный склонированный элемент.
 */
 var generatePin = function (pinProperties, widthPin, heightPin) {
  var pinElement = pinTamplate.cloneNode(true);
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
 window.renderPin = function (dataArray, widthPin, heightPin) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(generatePin(dataArray[i], widthPin, heightPin));
  }
  pinList.appendChild(fragment);
};

// Перемещение метки
mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  window.activateMap();
  isMapDisabled = false;

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
      MIN_X: window.CoordinateMaps.MIN_X,
      MAX_X: window.CoordinateMaps.MAX_X - window.SizeMainPin.WIDTH,
      MIN_Y: window.CoordinateMaps.MIN_Y - window.SizeMainPin.HEIGHT / 2 - window.SizeMainPin.POINTER_HEIGHT,
      MAX_Y: window.CoordinateMaps.MAX_Y - window.SizeMainPin.HEIGHT / 2 - window.SizeMainPin.POINTER_HEIGHT
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
    window.generateAddress(PinCoords, window.SizeMainPin, window.isMapDisabled);
  };

  /**
   * Удаляет отслеживание событий и передает координаты в форму при отжатии кнопки мыши
   *
   * @param {Object} upEvt - DOM объект события
   *
   */
   var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    window.map.removeEventListener('mousemove', onMouseMove);
    window.map.removeEventListener('mouseup', onMouseUp);
    var PinCoords = {
      X: parseInt(mainPin.style.left, 10),
      Y: parseInt(mainPin.style.top, 10)
    };
    window.generateAddress(PinCoords, SizeMainPin, isMapDisabled);
  };

  map.addEventListener('mousemove', onMouseMove);
  map.addEventListener('mouseup', onMouseUp);
});
})();
