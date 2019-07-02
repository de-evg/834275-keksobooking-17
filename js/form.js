'use strict';

(function () {
  var main = window.main;
  var data = window.data;
  var SizeMainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    POINTER_HEIGHT: 22
  };

  var StartUserPinCoordinate = {
    X: 570,
    Y: 375
  };

  var selectTypeOffer = main.formAdElement.querySelector('#type');
  var selectTimeIn = main.formAdElement.querySelector('#timein');
  var selectTimeOut = main.formAdElement.querySelector('#timeout');
  var price = main.formAdElement.querySelector('#price');
  /**
   * Генерирует и изменяет значения координат главной метки в поле адреса в форме.
   *
   * @param {Object} startPinCoordinate - начальные координаты метки.
   * @param {Object} sizeMainPin - перечисление размеров метки
   * @param {boolean} flag - состояние активности карты
   */
  var generateAddress = function (startPinCoordinate, sizeMainPin, flag) {
    var address = main.formAdElement.querySelector('#address');
    if (flag) {
      address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2)));
    } else {
      address.value = (Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2)) + ', ' + Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT)));
    }
  };
  generateAddress(StartUserPinCoordinate, SizeMainPin, main.mapDisabled);

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
  getDefaultMinPrice(selectTypeOffer, data.offers, price);

  /**
   * Устанавливает время выселения в зависимости от выбранного времени заселения и наоборот
   *
   * @param {Object} selectedTime - выбранный option
   * @param {Collection} syncTimes - коллекция option, значение одного из них
   * должно быть аналогично selectedTime и выбрано как selected
   */
  var setTime = function (selectedTime, syncTimes) {
    var syncTimesOptions = Array.from(syncTimes);
    syncTimesOptions.forEach(function (option) {
      if (option.value === selectedTime.value) {
        option.selected = true;
      }
    });
  };

  main.formAdElement.addEventListener('change', function (evt) {
    switch (evt.target.id) {
      case 'type':
        var offer = {
          selectedOption: getSelectedOption(selectTypeOffer),
          offersObj: data.offers
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

  window.form = {
    sizePin: SizeMainPin,
    address: generateAddress
  };
})();
