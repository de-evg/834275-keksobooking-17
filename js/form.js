'use strict';

(function () {
  var utils = window.utils;
  var main = window.main;
  var OfferMinPriceMap = {
    PALACE: {
      TYPE: 'Дворец',
      MIN_PRICE: 10000
    },
    FLAT: {
      TYPE: 'Квартира',
      MIN_PRICE: 1000
    },
    HOUSE: {
      TYPE: 'Дом',
      MIN_PRICE: 5000
    },
    BUNGALO: {
      TYPE: 'Бунгало',
      MIN_PRICE: 0
    }
  };
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
    PRICE: '1000'
  };

  var selectTypeOfferElement = utils.nodeFormAd.querySelector('#type');
  var selectTimeInElement = utils.nodeFormAd.querySelector('#timein');
  var selectTimeOutElement = utils.nodeFormAd.querySelector('#timeout');
  var selectRoomElement = utils.nodeFormAd.querySelector('#room_number');
  var selectCapacityElement = utils.nodeFormAd.querySelector('#capacity');
  var priceElement = utils.nodeFormAd.querySelector('#price');
  var addressElement = utils.nodeFormAd.querySelector('#address');

  /**
   * Генерирует и изменяет значения координат главной метки в поле адреса в форме.
   *
   * @param {Object} startPinCoordinate - начальные координаты метки.
   * @param {Object} sizeMainPin - перечисление размеров метки
   * @param {boolean} flag - состояние активности карты
   * @return {string} координаты метки
   */
  var generateAddress = function (startPinCoordinate, sizeMainPin, flag) {
    if (flag) {
      var x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      var y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2));
    } else {
      x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT));
    }
    addressElement.value = x + ', ' + y;
    return addressElement.value;
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
  getDefaultMinPrice(selectTypeOfferElement, OfferMinPriceMap, priceElement);

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
  validateCapacity(getSelectedOption(selectRoomElement), selectCapacityElement, Rooms);

  utils.nodeFormAd.addEventListener('change', function (evt) {
    switch (evt.target.id) {
      case 'type':
        var offer = {
          selectedOption: getSelectedOption(evt.target),
          offersObj: OfferMinPriceMap
        };
        setMinPrice(offer, priceElement);
        break;
      case 'timein':
        var selectedOption = getSelectedOption(evt.target);
        setTime(selectedOption, selectTimeOutElement);
        break;
      case 'timeout':
        selectedOption = getSelectedOption(evt.target);
        setTime(selectedOption, selectTimeInElement);
        break;
      case 'room_number':
        selectedOption = getSelectedOption(evt.target);
        validateCapacity(selectedOption, selectCapacityElement, Rooms);
        break;
      case 'capacity':
        selectedOption = getSelectedOption(selectRoomElement);
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
    priceElement.placeholder = DeafultFormValues['PRICE'];
    addressElement.placeholder = DeafultFormValues['ADDRESS'];

  };

  utils.nodeFormAd.addEventListener('reset', function () {
    resetForm();
  });

  window.form = {
    sizePin: SizeMainPin,
    address: generateAddress,
    option: getSelectedOption,
    pinCoords: StartUserPinCoordinate,
    reset: resetForm
  };
})();
