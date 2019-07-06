'use strict';

(function () {
  var utils = window.utils;
  var pin = window.pin;
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;
  window.load = function (url, renderPins, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        renderPins(xhr.response);
      } else {
        utils.error(pin.template, pin.nodeElement);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', url);
    xhr.send();
  };
})();
