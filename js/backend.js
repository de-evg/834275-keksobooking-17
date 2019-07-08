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

  var load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response, PinsSettings);
      } else {
        onError(utils.nodeTemplate, utils.nodeMain);
      }
    });

    xhr.addEventListener('error', function () {
      onError(utils.nodeTemplate, utils.nodeMain);
    });

    xhr.addEventListener('timeout', function () {
      onError(utils.nodeTemplate, utils.nodeMain);
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', url);
    xhr.send();
  };

  var save = function (url, formData, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess();
      } else {
        onError(utils.nodeTemplate, utils.nodeMain);
      }
    });

    xhr.addEventListener('error', function () {
      onError(utils.nodeTemplate, utils.nodeMain);
    });

    xhr.addEventListener('timeout', function () {
      onError(utils.nodeTemplate, utils.nodeMain);
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
