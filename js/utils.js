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

  window.utils = {
    getElementFormArray: getElementFormArray,
    generateRandomNumber: generateRandomNumber
  };
})();
