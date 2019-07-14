'use strict';

(function () {
  var utils = window.utils;
  var form = window.form;
  var pin = window.pin;
  var backend = window.backend;
  var card = window.card;
  var URL = 'https://js.dump.academy/keksobooking';


  /**
   * Сбрасывает страницу в исходное состояние и показывает сообщение после отправки формы.
   *
   */
  var resetPage = function () {
    pin.clear();
    form.reset();
    showPopup();
  };

  /**
   * Добавляет popup в DOM при успешной отправке формы.
   *
   */
  var showPopup = function () {
    var successElement = utils.nodesTemplate.SUCCESS.cloneNode(true);
    utils.nodeMain.appendChild(successElement);

    window.addEventListener('click', removePopup);
    window.addEventListener('keydown', onEscPress);
  };

  /**
   * Удаляет popup из DOM.
   *
   */
  var removePopup = function () {
    if (utils.nodeMain.querySelector('.success')) {
      var successMessageElement = utils.nodeMain.querySelector('.success');
      utils.nodeMain.removeChild(successMessageElement);

      window.removeEventListener('click', removePopup);
      window.removeEventListener('keydown', onEscPress);
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

  utils.nodeFormAd.addEventListener('submit', function (evt) {
    var formData = new FormData(utils.nodeFormAd);
    if (utils.nodeFormAd.checkValidity()) {
      evt.preventDefault();
      backend.publish(URL, formData, resetPage, utils.error);
    }
  });
})();
