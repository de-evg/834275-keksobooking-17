'use strict';

(function () {
  var utils = window.utils;
  var ESC_CODE = 27;

  /**
   * Генерирует DOM элемент карточки с предложением.
   *
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - номер объекта с данными конкретной метки
   * @param {Object} types - словарь типа меток (eng: рус).
   * @return {Object} cardElement - DOM элемент карточки с предложением
   */
  var generateCard = function (template, dataForCard, types) {
    var cardElement = template.CARD.cloneNode(true);
    cardElement.querySelector('img').src = dataForCard.author.avatar;
    cardElement.querySelector('.popup__title').textContent = dataForCard.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = dataForCard.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = dataForCard.offer.price + '₽/ночь';

    // вставка типа жилья на русском языке
    var offerType = Object.keys(types).filter(function (key) {
      return key.toLowerCase() === dataForCard.offer.type;
    });
    cardElement.querySelector('.popup__type').textContent = types[offerType];

    cardElement.querySelector('.popup__text--capacity').textContent = dataForCard.offer.rooms + ' комнаты для ' + dataForCard.offer.guests;
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataForCard.offer.checkin + ', выезд до ' + dataForCard.offer.checkout;

    // удаление из шаблона списка особенностей
    var featuresElement = cardElement.querySelector('.popup__features');
    while (featuresElement.querySelector('.popup__feature')) {
      featuresElement.removeChild(featuresElement.querySelector('.popup__feature'));
    }

    // вставка актуальных особенностей
    dataForCard.offer.features.forEach(function (feature) {
      var listItemElement = document.createElement('li');
      listItemElement.classList.add('popup__feature', 'popup__feature--' + feature);
      featuresElement.appendChild(listItemElement);
    });

    // вставка описания
    cardElement.querySelector('.popup__description').textContent = dataForCard.offer.description;

    // вставка фотографий
    var photosElement = cardElement.querySelector('.popup__photos');
    var imgElement = photosElement.querySelector('img');

    dataForCard.offer.photos.forEach(function (addressPhoto) {
      var newImg = imgElement.cloneNode();
      newImg.src = addressPhoto;
      photosElement.appendChild(newImg);
    });
    photosElement.removeChild(imgElement);

    // вставка аватара
    cardElement.querySelector('.popup__avatar').src = dataForCard.author.avatar;

    return cardElement;
  };

  /**
   * Добавляет в DOM карту с предложением.
   *
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - номер объекта с данными конкретной метки
   * @param {Object} types - словарь типа меток (eng: рус).
   */
  var renderCard = function (template, dataForCard, types) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(generateCard(template, dataForCard, types));
    utils.nodeFiltersContainer.before(fragment);
  };

  /**
   * Закрывает карту.
   *
   */
  var closeCard = function () {
    if (utils.nodeMap.querySelector('.map__card')) {
      var renderedCardElement = utils.nodeMap.querySelector('.map__card');
      var cardCloseElement = renderedCardElement.querySelector('.popup__close');
      cardCloseElement.removeEventListener('click', closeCard);
      renderedCardElement.removeEventListener('click', onCardEscPress);

      var currentCard = utils.nodeMap.querySelector('.map__card');
      utils.nodeMap.removeChild(currentCard);
    }
  };

  /**
   * Закрывает карту при нажатии наа ESC.
   * @param {Object} evt - DOM объект события
   */
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      closeCard();
    }
  };

  window.card = {
    getCard: generateCard,
    render: renderCard,
    close: closeCard,
    pressEsc: onCardEscPress,
    escCode: ESC_CODE
  };
})();
