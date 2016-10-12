/* Рентгеновские тесты
 *
 * В примере ниже тест использует доступ к приватным переменным для проверок.
 * Хотя разумнее было бы сделать публичный АПИ так, чтобы поведение
 * объекта можно было проверить, не заглядывая в его внутреннее состояние.
 *
 * Последний тест — жесть. Намеренно портит состояние кэша подтвержденных
 * мест, чтобы убедиться что нет дополнительного вызова функции, подтверждающей
 * места. Это имеет смысл в контексте теста, где автор уже закрыл глаза
 * на использование приватных переменных в проверках, но лучше было бы
 * явно проверить взаимодействие между `SeatMap` и АПИ подтверждения.
 *
 * [Пример использует префикс `__`, чтобы обозначить приватные переменные.]
 *
 * [Приватность — это не про видимость функций и методов. А о том, от чего
 * не стоит зависеть в своем коде. Приватные функции и методы нестабильны:
 * изменятся или исчезнут в будущем.]
 */

// Тестируемый модуль
var _ = require('lodash')
function SeatMap (ticket, originalSeat) {
  this.fareClass = ticket.fareClass
  this.__currentSeat = originalSeat
  this.__approvals = {}
}

SeatMap.prototype.moveTo = function (newSeat) {
  if (!_.has(this.__approvals, this.fareClass + '.' + newSeat)) {
    this.__qualifyFareClassForSeat(newSeat)
  }

  if (this.__approvals[this.fareClass][newSeat]) {
    this.__currentSeat = newSeat
  }
}

// Тесты
module.exports = {
  beforeEach: function () {
    this.ticket = {fareClass: 'M'}
    this.subject = new SeatMap(this.ticket, '18D')
  },
  approveIfBehindRowTen: function () {
    this.subject.moveTo('11B')

    assert.equal(this.subject.__approvals['M']['11B'], true)
    assert.equal(this.subject.__currentSeat, '11B')
  },
  denyIfAheadOfRowTen: function () {
    this.subject.moveTo('9J')

    assert.equal(this.subject.__approvals['M']['9J'], false)
    assert.equal(this.subject.__currentSeat, '18D')
  },
  willShortCircuitApprovalProcessWhenMemoized: function () {
    this.subject.__approvals['M'] = {'Havanna': 'Sure, why not'}

    this.subject.moveTo('Havanna')

    assert.equal(this.subject.__approvals['M']['Havanna'], 'Sure, why not')
    assert.equal(this.subject.__currentSeat, 'Havanna')
  }
}

// Фейковая реализация
SeatMap.prototype.__qualifyFareClassForSeat = function (seat) {
  var allowed = parseInt(seat.match(/^(\d+)/)[0], 10) > 10
  _.set(this.__approvals, this.fareClass + '.' + seat, allowed)
}
