'use strict';

(function () {
  var utils = window.utils;
  var form = window.form;
  var pin = window.pin;
  var backend = window.backend;
  var card = window.card;
  var URL = 'https://js.dump.academy/keksobooking';

  var resetPage = function () {
    pin.clear();
    form.reset();
    var successElement = utils.nodesTemplate.SUCCESS.cloneNode(true);
    utils.nodeMain.appendChild(successElement);
  };

  utils.nodeFormAd.addEventListener('submit', function (evt) {
    var formData = new FormData(utils.nodeFormAd);
    if (utils.nodeFormAd.checkValidity()) {
      evt.preventDefault();
      backend.publish(URL, formData, resetPage, utils.error);

    }

    /**
     * Удаляет popup из DOM.
     *
     */
    var removePopup = function () {
      if (utils.nodeMain.querySelector('.success')) {
        utils.nodeMain.removeChild(utils.nodeMain.querySelector('.success'));
        document.removeEventListener('click', removePopup);
        document.removeEventListener('keydown', onEscPress);
      }
    };

    /**
     * Удаляет popup из DOM нажатием клаваиши ESC.
     *
     * @param {Object} evtKeyPress - объект события DOM
     */
    var onEscPress = function (evtKeyPress) {
      if (evtKeyPress.keyCode === card.escCode) {
        removePopup();
      }
    };
    document.addEventListener('click', removePopup);
    document.addEventListener('keydown', onEscPress);
  });
})();
