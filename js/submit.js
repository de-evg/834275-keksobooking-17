'use strict';

(function () {
  var utils = window.utils;
  var form = window.form;
  var pin = window.pin;
  var backend = window.backend;
  var card = window.card;
  var URL = 'https://js.dump.academy/keksobooking';

  /**
   * Удаляет popup из DOM.
   *
   */
  var onPopupClick = function () {
    var successMessageElement = utils.nodeMain.querySelector('.success');
    utils.nodeMain.removeChild(successMessageElement);

    window.removeEventListener('click', onPopupClick);
    window.removeEventListener('keydown', onEscPress);
  };

  /**
   * Удаляет popup из DOM нажатием клаваиши ESC.
   *
   * @param {Object} evt - объект события DOM
   */
  var onEscPress = function (evt) {
    if (evt.keyCode === card.escCode) {
      onPopupClick();
    }
  };

  /**
   * Добавляет popup в DOM при успешной отправке формы.
   *
   */
  var showPopup = function () {
    var successElement = utils.nodesTemplate.SUCCESS.cloneNode(true);
    successElement.tabIndex = 1;
    var fragment = document.createDocumentFragment(successElement);
    fragment.appendChild(successElement);
    utils.nodeMain.appendChild(fragment);
    utils.nodeMain.querySelector('.success').focus();

    window.addEventListener('click', onPopupClick);
    window.addEventListener('keydown', onEscPress);
  };

  /**
   * Сбрасывает страницу в исходное состояние и показывает сообщение после отправки формы.
   *
   */
  var resetPage = function () {
    pin.clear();
    form.reset();
    showPopup();
  };

  utils.nodeFormAd.addEventListener('submit', function (evt) {
    var formData = new FormData(utils.nodeFormAd);
    if (utils.nodeFormAd.checkValidity()) {
      evt.preventDefault();
      backend.publish(URL, formData, resetPage, utils.error);
    }
  });
})();
