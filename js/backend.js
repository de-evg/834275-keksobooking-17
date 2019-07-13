'use strict';

(function () {
  var utils = window.utils;
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;
  var PinsSettings = {
    WIDTH_PIN: 50,
    HEIGHT_PIN: 70,
    MAX_PINS: 5
  };

  /**
   * Получает данные с сервера.
   *
   * @param {string} url - адрес сервера.
   * @param {function} onSuccess - обработчик при успешном получения данных
   * @param {function} onError -  обработчик при ошибке
   */
  var load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response, PinsSettings);
      } else {
        onError(utils.nodesTemplate, utils.nodeMain);
      }
    });

    xhr.addEventListener('error', function () {
      onError(utils.nodesTemplate, utils.nodeMain);
    });

    xhr.addEventListener('timeout', function () {
      onError(utils.nodesTemplate, utils.nodeMain);
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', url);
    xhr.send();
  };

  /**
   * Отправляет на сервер форму.
   *
   * @param {string} url - адрес сервера.
   * @param {Object} formData - данные формы
   * @param {function} onSuccess - обработчик при успешном отправлении данных
   * @param {function} onError -  обработчик при ошибке
   */
  var save = function (url, formData, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess();
      } else {
        onError(utils.nodesTemplate, utils.nodeMain);
      }
    });

    xhr.addEventListener('error', function () {
      onError(utils.nodesTemplate, utils.nodeMain);
    });

    xhr.addEventListener('timeout', function () {
      onError(utils.nodesTemplate, utils.nodeMain);
    });

    xhr.timeout = TIMEOUT;
    xhr.open('POST', url);
    xhr.send(formData);
  };

  window.backend = {
    loading: load,
    publish: save
  };
})();
