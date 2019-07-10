'use strict';

(function () {
  var utils = window.utils;
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
  var Rooms = {
    '100': {
      value: ['0'],
      validateMessage: 'Для этого предложения не предусмотрено размещение гостей'
    },
    '1': {
      value: ['1'],
      validateMessage: 'Для этого предложения возможно размещение не более 1 гостя'
    },
    '2': {
      value: ['1', '2'],
      validateMessage: 'Для этого предложения возможно размещение не более 2 гостей'
    },
    '3': {
      value: ['1', '2', '3'],
      validateMessage: 'Для этого предложения возможно размещение не более 3 гостей'
    }
  };
  var DeafultFormValues = {
    ADDRESS: '602, 462',
    PRICE: 1000,
  };

  var selectTypeOffer = utils.nodeFormAd.querySelector('#type');
  var selectTimeIn = utils.nodeFormAd.querySelector('#timein');
  var selectTimeOut = utils.nodeFormAd.querySelector('#timeout');
  var selectRoom = utils.nodeFormAd.querySelector('#room_number');
  var selectCapacity = utils.nodeFormAd.querySelector('#capacity');
  var price = utils.nodeFormAd.querySelector('#price');
  var address = utils.nodeFormAd.querySelector('#address');
  /**
   * Генерирует и изменяет значения координат главной метки в поле адреса в форме.
   *
   * @param {Object} startPinCoordinate - начальные координаты метки.
   * @param {Object} sizeMainPin - перечисление размеров метки
   * @param {boolean} flag - состояние активности карты
   */
  var generateAddress = function (startPinCoordinate, sizeMainPin, flag) {
    if (flag) {
      var x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      var y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2));
      address.value = x + ', ' + y;
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

  /**
   * Устанавливает количество мест в зависимости от выбранного количества комнат
   *
   * @param {Object} selectedRoom - выбранное количество комнат
   * @param {Object} capacity - коллекция option, значение одного из них
   * должно быть выбрано в зависимости от selectedRoom
   * @param {Object} rooms - перечисление комнат и их свойств
   */
  var validateCapacity = function (selectedRoom, capacity, rooms) {
    var maxCapacity = rooms[selectedRoom.value].value.slice().filter(function (capacityPossiblyValue) {
      return capacityPossiblyValue === capacity.value;
    });
    if (maxCapacity <= capacity.value && maxCapacity.length > 0) {
      capacity.setCustomValidity('');
    } else {
      capacity.setCustomValidity(Rooms[selectedRoom.value].validateMessage);
    }
  };
  validateCapacity(getSelectedOption(selectRoom), selectCapacity, Rooms);

  utils.nodeFormAd.addEventListener('change', function (evt) {
    switch (evt.target.id) {
      case 'type':
        var offer = {
          selectedOption: getSelectedOption(evt.target),
          offersObj: data.offers
        };
        setMinPrice(offer, price);
        break;
      case 'timein':
        var selectedOption = getSelectedOption(evt.target);
        setTime(selectedOption, selectTimeOut);
        break;
      case 'timeout':
        selectedOption = getSelectedOption(evt.target);
        setTime(selectedOption, selectTimeIn);
        break;
      case 'room_number':
        selectedOption = getSelectedOption(evt.target);
        validateCapacity(selectedOption, selectCapacity, Rooms);
        break;
      case 'capacity':
        selectedOption = getSelectedOption(selectRoom);
        validateCapacity(selectedOption, evt.target, Rooms);
        break;
    }
  });

  /**
   * Приводит значения полей формы к исходному состоянию
   *
   */
  var resetForm = function () {
    utils.nodeFormAd.reset();
    price.placeholder = DeafultFormValues.PRICE;
    generateAddress(StartUserPinCoordinate, SizeMainPin, main.mapDisabled);
  };

  window.form = {
    sizePin: SizeMainPin,
    address: generateAddress,
    option: getSelectedOption,
    pinCoords: StartUserPinCoordinate,
    reset: resetForm
  };
})();
