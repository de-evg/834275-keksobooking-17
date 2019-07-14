'use strict';

(function () {
  var utils = window.utils;
  var main = window.main;
  var selectTypeOfferElement = utils.nodeFormAd.querySelector('#type');
  var selectTimeInElement = utils.nodeFormAd.querySelector('#timein');
  var selectTimeOutElement = utils.nodeFormAd.querySelector('#timeout');
  var selectRoomElement = utils.nodeFormAd.querySelector('#room_number');
  var selectCapacityElement = utils.nodeFormAd.querySelector('#capacity');
  var priceElement = utils.nodeFormAd.querySelector('#price');
  var addressElement = utils.nodeFormAd.querySelector('#address');

  var TimeMap = {
    TYPE: selectTypeOfferElement,
    TIMEIN: selectTimeOutElement,
    TIMEOUT: selectTimeInElement,
    ROOM: selectRoomElement,
    CAPACITY: selectCapacityElement,
    PRICE: priceElement
  };

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

  var Selector = {
    TYPE: {
      setMinPrice: function (targetElement, offersType, inputFieldElement) {
        var attribute = offersType[targetElement.value.toUpperCase()].MIN_PRICE;
        inputFieldElement.min = attribute;
        inputFieldElement.placeholder = attribute;
      }
    },
    TIMEIN: {
      setTime: function (evtChangeTime, timeMap) {
        timeMap[evtChangeTime.target.id.toUpperCase()].value = evtChangeTime.target.value;
      }
    },
    TIMEOUT: {
      setTime: function (evtChangeTime, timeMap) {
        timeMap[evtChangeTime.target.id.toUpperCase()].value = evtChangeTime.target.value;
      }
    },
    ROOM_NUMBER: {
      validateCapacity: function (rooms, selectedRoom, selectedCapacity) {
        var maxCapacity = rooms[selectedRoom.value].value.slice().filter(function (capacityPossiblyValue) {
          return capacityPossiblyValue === selectedCapacity.value;
        });
        if (maxCapacity <= selectedCapacity.value && maxCapacity.length > 0) {
          selectCapacityElement.setCustomValidity('');
        } else {
          selectCapacityElement.setCustomValidity(Rooms[selectedRoom.value].validateMessage);
        }
      }
    },
    CAPACITY: {
      validateCapacity: function (rooms, selectedRoom, selectedCapacity) {
        var maxCapacity = rooms[selectedRoom.value].value.slice().filter(function (capacityPossiblyValue) {
          return capacityPossiblyValue === selectedCapacity.value;
        });
        if (maxCapacity <= selectedCapacity.value && maxCapacity.length > 0) {
          selectCapacityElement.setCustomValidity('');
        } else {
          selectCapacityElement.setCustomValidity(Rooms[selectedRoom.value].validateMessage);
        }
      }
    }
  };

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

  Selector.TYPE.setMinPrice(selectTypeOfferElement, OfferMinPriceMap, priceElement);
  Selector.CAPACITY.validateCapacity(Rooms, getSelectedOption(selectRoomElement), getSelectedOption(selectCapacityElement), selectCapacityElement);

  utils.nodeFormAd.addEventListener('change', function (evt) {
    switch (evt.target.id) {
      case 'type':
        Selector[evt.target.id.toUpperCase()].setMinPrice(evt.target, OfferMinPriceMap, priceElement);
        break;
      case 'timein':
        Selector[evt.target.id.toUpperCase()].setTime(evt, TimeMap);
        break;
      case 'timeout':
        Selector[evt.target.id.toUpperCase()].setTime(evt, TimeMap);
        break;
      case 'room_number':
        Selector[evt.target.id.toUpperCase()].validateCapacity(Rooms, evt.target, getSelectedOption(selectCapacityElement), selectCapacityElement);
        break;
      case 'capacity':
        Selector[evt.target.id.toUpperCase()].validateCapacity(Rooms, getSelectedOption(selectRoomElement), evt.target, selectCapacityElement);
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
