'use strict';

(function () {
  var utils = window.utils;

  /**
   * Заполняет склонированный HTML элемент данными выбранного предложения.
   *
   * @param {Object} cardElement - склонированный HTML элемент
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - объекта с данными выбранного предложения
   * @param {Object} types - словарь типа меток (eng: рус).
   * @return {Object} cardElement - DOM элемент карточки с предложением
   */
  var generateCardElement = function (cardElement, template, dataForCard, types) {
    // вставка аватара
    try {
      var userAvatar = cardElement.querySelector('.popup__avatar');
      if (!dataForCard.author.avatar) {
        throw new SyntaxError('Данные некорректны');
      }
      userAvatar.src = dataForCard.author.avatar;
    } catch (err) {
      userAvatar.style.display = 'none';
    }

    // вставка заголовка
    try {
      var offerTitle = cardElement.querySelector('.popup__title');
      if (!dataForCard.offer.title) {
        throw new SyntaxError('Данные некорректны');
      }
      offerTitle.textContent = dataForCard.offer.title;
    } catch (err) {
      offerTitle.style.display = 'none';
    }

    // вставка адреса
    try {
      var offerAddress = cardElement.querySelector('.popup__text--address');
      if (!dataForCard.offer.address) {
        throw new SyntaxError('Данные некорректны');
      }
      offerAddress.textContent = dataForCard.offer.address;
    } catch (err) {
      offerAddress.style.display = 'none';
    }

    // вставка цены
    try {
      var offerPrice = cardElement.querySelector('.popup__text--price');
      if (!dataForCard.offer.price) {
        throw new SyntaxError('Данные некорректны');
      }
      offerPrice.textContent = dataForCard.offer.price + '₽/ночь';
    } catch (err) {
      offerPrice.style.display = 'none';
    }

    // вставка типа жилья на русском языке
    try {
      var typeHousing = cardElement.querySelector('.popup__type');
      if (!dataForCard.offer.type) {
        throw new SyntaxError('Данные некорректны');
      }
      var offerType = Object.keys(types).filter(function (key) {
        return key.toLowerCase() === dataForCard.offer.type;
      });
      typeHousing.textContent = types[offerType];
    } catch (err) {
      typeHousing.style.display = 'none';
    }

    // вставка строки с количеством комнат и количеством гостей
    try {
      var offerCapacity = cardElement.querySelector('.popup__text--capacity');
      if (!dataForCard.offer.rooms || !dataForCard.offer.guests) {
        throw new SyntaxError('Данные некорректны');
      }
      offerCapacity.textContent = dataForCard.offer.rooms + ' комнаты для ' + dataForCard.offer.guests;
    } catch (err) {
      offerCapacity.style.display = 'none';
    }

    try {
      var offerTime = cardElement.querySelector('.popup__text--time');
      if (!dataForCard.offer.checkin || !dataForCard.offer.checkout) {
        throw new SyntaxError('Данные некорректны');
      }
      offerTime.textContent = 'Заезд после ' + dataForCard.offer.checkin + ', выезд до ' + dataForCard.offer.checkout;
    } catch (err) {
      offerTime.style.display = 'none';
    }

    // вставка особенностей
    try {
      var featuresElement = cardElement.querySelector('.popup__features');
      if (dataForCard.offer.features.length === 0 || !dataForCard.offer.features) {
        throw new SyntaxError('Данные некорректны');
      }
      // удаление из шаблона списка особенностей
      while (featuresElement.querySelector('.popup__feature')) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature'));
      }

      // вставка актуальных особенностей
      dataForCard.offer.features.forEach(function (feature) {
        var listItemElement = document.createElement('li');
        listItemElement.classList.add('popup__feature', 'popup__feature--' + feature);
        featuresElement.appendChild(listItemElement);
      });
    } catch (err) {
      featuresElement.style.display = 'none';
    }

    // вставка описания
    try {
      var offerDescription = cardElement.querySelector('.popup__description');
      if (!dataForCard.offer.description) {
        throw new SyntaxError('Данные некорректны');
      }
      offerDescription.textContent = dataForCard.offer.description;
    } catch (err) {
      offerDescription.style.display = 'none';
    }

    // вставка фотографий
    try {
      var photosElement = cardElement.querySelector('.popup__photos');
      var imgElement = photosElement.querySelector('img');
      if (dataForCard.offer.photos.length === 0 || !dataForCard.offer.photos.length) {
        throw new SyntaxError('Данные некорректны');
      }
      dataForCard.offer.photos.forEach(function (addressPhoto) {
        var newImg = imgElement.cloneNode();
        newImg.src = addressPhoto;
        photosElement.appendChild(newImg);
      });
      photosElement.removeChild(imgElement);
    } catch (err) {
      photosElement.style.display = 'none';
    }

    return cardElement;
  };

  /**
   * Добавляет в DOM карту с предложением.
   *
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - объект с данными конкретной метки
   * @param {Object} types - словарь типа меток (eng: рус).
   */
  var renderCard = function (template, dataForCard, types) {
    var cardElement = template.CARD.cloneNode(true);
    var generatedCardElement = generateCardElement(cardElement, template, dataForCard, types);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(generatedCardElement);
    utils.nodeFiltersContainer.before(fragment);

    var cardCloseElement = utils.nodeMap.querySelector('.map__card .popup__close');
    cardCloseElement.addEventListener('click', onButtonCloseClick);
    window.addEventListener('keydown', onCardEscPress);
  };

  /**
   * Закрывает карту.
   *
   */
  var onButtonCloseClick = function () {
    if (utils.nodeMap.querySelector('.map__card')) {
      var currentCard = utils.nodeMap.querySelector('.map__card');
      utils.nodeMap.removeChild(currentCard);
      window.removeEventListener('keydown', onCardEscPress);
    }
  };

  /**
   * Закрывает карту при нажатии наа ESC.
   * @param {Object} evt - DOM объект события
   */
  var onCardEscPress = function (evt) {
    if (evt.keyCode === utils.key.ESC) {
      onButtonCloseClick();
    }
  };

  window.card = {
    render: renderCard,
    close: onButtonCloseClick,
  };
})();
