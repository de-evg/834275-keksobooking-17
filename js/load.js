'use strict';

(function () {
  window.load = function (url, onSuccess, onError) {
    var isLoadSuccess = false;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        isLoadSuccess = true;
        onSuccess(xhr.response, isLoadSuccess);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.timeout = 10000;

    xhr.open('GET' , url);
    xhr.send();
  };
})();
