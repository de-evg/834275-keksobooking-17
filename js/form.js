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
  var userAvatar = utils.nodeFormAd.querySelector('.ad-form-header__preview img');
  var photoContainer = utils.nodeFormAd.querySelector('.ad-form__photo-container');

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

  var DeafultFormValues = {
    ADDRESS: '602, 407',
    PRICE: '1000',
    AVATAR: 'img/muffin-grey.svg'
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
  /**
   * Проверяет соответствует ли количество комнат количеству гостей.
   *
   */
  var validateCapacity = function () {
    var selectedRoom = getSelectedOption(selectRoomElement);
    var selectedCapacity = getSelectedOption(selectCapacityElement);
    var maxCapacity = Rooms[selectedRoom.value].value.slice().filter(function (capacityPossiblyValue) {
      return capacityPossiblyValue === selectedCapacity.value;
    });
    if (maxCapacity <= selectedCapacity.value && maxCapacity.length > 0) {
      selectCapacityElement.setCustomValidity('');
    } else {
      selectCapacityElement.setCustomValidity(Rooms[selectedRoom.value].validateMessage);
    }
  };

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
    } else {
      x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT));
    }
    addressElement.value = x + ', ' + y;
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

  /**
   * Устанавливает минимальную цену в зависимости от типа жилья
   *
   */
  var setMinPrice = function () {
    var selectedOption = getSelectedOption(selectTypeOfferElement);
    var attribute = OfferMinPriceMap[selectedOption.value.toUpperCase()].MIN_PRICE;
    priceElement.min = attribute;
    priceElement.placeholder = attribute;
  };

  /**
   * Устанавилвает адрес для изображения из вставленного в input файла
   *
   * @param {Object} changedElement - измененный элемент формы (input)
   * @param {Object} image - обновляемый html объект изображения
   */
  var insertUserImage = function (changedElement, image) {
    var file = changedElement.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  /**
   * Добавляет изображения в DOM
   *
   * @param {Object} changedElement - измененный элемент формы (input)
   * @param {Object} image - обновляемый DOM объект изображения
   */
  var insertRoomImage = function (changedElement, image) {
    var photos = utils.nodeFormAd.querySelector('.ad-form__photo');
    var img = image.cloneNode(true);
    img.width = 70;
    img.height = 70;
    insertUserImage(changedElement, img);
    var fragment = document.createDocumentFragment();
    if (photos.querySelector('img')) {
      var photosTemplate = photos.cloneNode(false);
      photosTemplate.appendChild(img);
      fragment.appendChild(photosTemplate);
      photoContainer.appendChild(fragment);
    } else {
      fragment.appendChild(img);
      photos.appendChild(fragment);
    }
  };

  var resetUserAvatar = function (defaultValues) {
    userAvatar.src = defaultValues.AVATAR;
  };

  var resetRoomImages = function () {
    var photos = utils.nodeFormAd.querySelector('.ad-form__photo');
    var photosTemplate = photos.cloneNode(false);
    var allPhotos = utils.nodeFormAd.querySelectorAll('.ad-form__photo');
    allPhotos.forEach(function (photo) {
      photoContainer.removeChild(photo);
    });
    var fragment = document.createDocumentFragment();
    fragment.appendChild(photosTemplate);
    photoContainer.appendChild(fragment);
  };

  /**
   * Устанавливает минимальную цену в зависимости от типа жилья
   *
   * @param {Object} evtChange - событие изменения элмента формы
   */
  var setTime = function (evtChange) {
    TimeMap[evtChange.target.id.toUpperCase()].value = evtChange.target.value;
  };

  var Selector = {
    TYPE: {
      updateForm: setMinPrice
    },
    TIMEIN: {
      updateForm: setTime
    },
    TIMEOUT: {
      updateForm: setTime
    },
    ROOM_NUMBER: {
      updateForm: validateCapacity
    },
    CAPACITY: {
      updateForm: validateCapacity
    }
  };

  var UserImage = {
    AVATAR: {
      insert: insertUserImage,
      reset: resetUserAvatar
    },
    IMAGES: {
      insert: insertRoomImage,
      reset: resetRoomImages
    }
  };

  Selector.TYPE.updateForm();
  Selector.CAPACITY.updateForm();

  utils.nodeFormAd.addEventListener('change', function (evt) {
    switch (evt.target.tagName) {
      case 'SELECT':
        Selector[evt.target.id.toUpperCase()].updateForm(evt);
        break;
      case 'INPUT':
        if (evt.target.type === 'file') {
          UserImage[evt.target.name.toUpperCase()].insert(evt.target, userAvatar);
        }
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
    UserImage.AVATAR.reset(DeafultFormValues);
    UserImage.IMAGES.reset();
  };

  utils.nodeFormAd.addEventListener('reset', function () {
    resetForm();
  });

  window.form = {
    sizePin: SizeMainPin,
    address: generateAddress,
    pinCoords: StartUserPinCoordinate,
    reset: resetForm
  };
})();
