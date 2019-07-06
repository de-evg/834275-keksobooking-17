'use strict';

(function () {

  /**
   * Получает случайный элемент массива.
   *
   * @param {Array} someArray - массив данных.
   * @return {any} someArray[j] - возвращает случайный элемент массива .
   */
  var getElementFormArray = function (someArray) {
    var j = Math.floor(Math.random() * someArray.length);
    return someArray[j];
  };

  /**
   * Генерирует случайное значение.
   *
   * @param {number} minNumber - минимальное значение.
   * @param {number} maxNumber - максимальное значение.
   * @return {number} number - случайное значение.
   */
  var generateRandomNumber = function (minNumber, maxNumber) {
    var number = Math.floor(minNumber + (Math.random() * (maxNumber + 1 - minNumber)));
    return number;
  };

  /**
   * Показывает окно с ошибкой при ошибке загрузки данных с сервера.
   * @param {Object} template - перечисление шаблонов
   * @param {Object} parentElement - DOM элемент, в который добавится склонированный элемент
   */
  var onError = function (template, parentElement) {
    var error = template.ERROR.cloneNode(true);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(error);
    parentElement.appendChild(fragment);
    error.display = 'block';
  };

  window.utils = {
    getElementFormArray: getElementFormArray,
    generateRandomNumber: generateRandomNumber,
    error: onError
  };
})();
