'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;
  var PinsSettings = {
    WIDTH_PIN: 50,
    HEIGHT_PIN: 70,
    MAX_PINS: 5
  };

  /**
   * Настройки запрса на сервера
   *
   * @param {string} url - адрес сервера.
   * @param {function} onSuccess - обработчик при успешном получения данных
   * @param {function} onError - обработчик при ошибке
   * @param {string} method - метод запроса
   * @return {Object} xhr - объект XMLHttpRequest
   */
  var xhrRequestSetup = function (url, onSuccess, onError, method) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        switch (method) {
          case 'GET':
            onSuccess(xhr.response, PinsSettings);
            break;
          case 'POST':
            onSuccess();
            break;
        }
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.addEventListener('timeout', function () {
      onError();
    });

    xhr.timeout = TIMEOUT;
    xhr.open(method, url);
    return xhr;
  };

  /**
   * Получает данные с сервера.
   *
   * @param {string} url - адрес сервера.
   * @param {function} onSuccess - обработчик при успешном получения данных
   * @param {function} onError -  обработчик при ошибке
   */
  var load = function (url, onSuccess, onError) {
    var method = 'GET';
    var requestName = xhrRequestSetup(url, onSuccess, onError, method);
    requestName.send();
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
    var method = 'POST';
    var requestName = xhrRequestSetup(url, onSuccess, onError, method);
    requestName.send(formData);
  };

  window.backend = {
    loading: load,
    publish: save
  };
})();
