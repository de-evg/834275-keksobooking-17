'use strict';

(function () {
  window.SizeMainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    POINTER_HEIGHT: 22
  };


  var selectTypeOffer = window.formAd.querySelector('#type');
  var selectTimeIn = window.formAd.querySelector('#timein');
  var selectTimeOut = window.formAd.querySelector('#timeout');
  var price = window.formAd.querySelector('#price');
  /**
   * Генерирует и изменяет значение координат главной метки.
   *
   * @param {Object} startPinCoordinate - начальные координаты метки.
   * @param {Object} sizeMainPin - перечисление размеров метки
   * @param {boolean} flag - состояние активности карты
   */
  window.generateAddress = function (startPinCoordinate, sizeMainPin, flag) {
    var address = window.formAd.querySelector('#address');
    if (flag) {
      address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2)));
    } else {
      address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT)));
    }
  };
  window.generateAddress(window.StartUserPinCoordinate, window.SizeMainPin, window.isMapDisabled);

  /**
   * Устанавливает плейсхолдер и минимальное значение для цены
   * в зависимости от типа предолжения
   *
   * @param {Object} offer - объект с параметрами выбранного типа.
   * @param {Object} inputFieldElement - DOM элемент для которго устанавилваются атрибуты
   */
  var setMinPrice = function (offer, inputFieldElement) {
    var typeOffer = offer.selectedOption.value.toUpperCase();
    var attribute = offer.offersObj[typeOffer].MIN_PRICE;
    inputFieldElement.min = attribute;
    inputFieldElement.placeholder = attribute;
  };

  /**
   * Получает объект option в состоянии selected
   *
   * @param {Collection} select - коллекция option
   * @return {Object} selectedOption - выбранный option
   */
  var getSelectedOption = function (select) {
    var index;
    var selectedOption;
    index = select.selectedIndex;
    selectedOption = select[index];
    select.addEventListener('change', function () {
      index = select.selectedIndex;
      selectedOption = select[index];
    });
    return selectedOption;
  };

  /**
   * Устанавливает плейсхолдер и минимальное значение цены
   * для option в состоянии selected по-умолчанию
   *
   * @param {Collection} select - коллекция option
   * @param {Object} offers - перечисление типов предложений
   * @param {Object} inputFieldElement - DOM элемент для которго устанавилваются атрибуты
   */
  var getDefaultMinPrice = function (select, offers, inputFieldElement) {
    var offer = {
      selectedOption: getSelectedOption(select),
      offersObj: offers
    };
    setMinPrice(offer, inputFieldElement);
  };
  getDefaultMinPrice(selectTypeOffer, window.Offers, price);


  /**
   * Устанавливает время выселения в зависимости от выбранного времени заселения и наоборот
   *
   * @param {string} selectedTime - значение выбранного option
   * @param {Collection} syncTimes - коллекция option, значение одного из них
   * должно быть аналогично selectedTime и выбрано как selected
   */
  var setTime = function (selectedTime, syncTimes) {
    for (var i = 0; i < syncTimes.length; i++) {
      if (syncTimes[i].value === selectedTime.value) {
        syncTimes[i].selected = true;
      }
    }
  };

  window.formAd.addEventListener('click', function (evt) {
    switch (evt.target.id) {
      case 'type':
        var offer = {
          selectedOption: getSelectedOption(selectTypeOffer),
          offersObj: window.Offers
        };
        setMinPrice(offer, price);
        break;
      case 'timein':
        var selectedOption = getSelectedOption(selectTimeIn);
        setTime(selectedOption, selectTimeOut);
        break;
      case 'timeout':
        selectedOption = getSelectedOption(selectTimeOut);
        setTime(selectedOption, selectTimeIn);
        break;
    }
  });
})();