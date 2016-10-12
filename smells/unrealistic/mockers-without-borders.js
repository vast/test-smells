/* Моки без границ
 *
 * Читая пример ниже, вы можете вспомнить свое правило, по которому определяете,
 * когда использовать фейковые зависимости. Иметь такое правило важно для
 * консистентности кода. Но большинство таких правил не очень:
 *
 *   * «Мокать только те модули, что делают ввод-вывод» — субъективный подход,
 *   зависящий еще и от архитектуры приложения. Тесты будет легче рефакторить,
 *   если вместо этого застабить сам ввод-вывод (база данных в памяти,
 *   перехватывание сетевых запросов).
 *
 *   * Если мокать только нереализованный функционал, станет тяжело работать
 *   с тестами по мере реализации. Читателю из будущего (когда все уже
 *   реализовано) такие тесты не расскажут, по какому правилу мокать.
 *
 *   * «Мокать только тогда, когда без мока не обойтись» — фривольное
 *   правило, которому тяжело следовать консистентно. Более того, если
 *   не получается проверить функциональность без мока, — это приговор
 *   дизайну тестируемого модуля. Его стоит переработать.
 *
 *   * Наш подход — сначала определиться с задачей тестируемого модуля. Если
 *   его ответственность — разбить задачу на несколько вызовов зависимостей,
 *   то задача теста — проверить взаимодействие между модулем и зависимостями.
 *   В этом случае все зависимости мокаем, чтобы упростить тест.
 *
 *   Такой тест не утверждает, что тестируемый модуль «работает». Тест
 *   проверяет, что модуль должен работать, если зависимости реализованы
 *   и соответствуют контракту АПИ.
 */

// Тестируемый модуль
var App = {}

App.payMerchants = function (startDate, endDate) {
  var transactions = App.fetch(startDate, endDate)
  var purchaseOrders = App.createPurchaseOrders(App.groupByMerchant(transactions))
  App.submit(purchaseOrders)
}

// Тесты
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    td.replace(App, 'fetch')
    td.replace(App, 'submit')
  },
  paysMerchantsWithTotals: function () {
    var transactions = [
      {merchant: 'Nike', desc: 'Shoes', amount: 119.20},
      {merchant: 'Nike', desc: 'Waterproof spray', amount: 10.10},
      {merchant: 'Apple', desc: 'iPad', amount: 799.99},
      {merchant: 'Apple', desc: 'iPad Cover', amount: 59.99}
    ]
    var startDate = new Date(2015, 0, 1)
    var endDate = new Date(2015, 11, 31)
    td.when(App.fetch(startDate, endDate)).thenReturn(transactions)

    App.payMerchants(startDate, endDate)

    td.verify(App.submit([
      {merchant: 'Nike', total: 129.30},
      {merchant: 'Apple', total: 859.98}
    ]))
  },
  afterEach: function () {
    td.reset()
  }
}

// Фейковая реализация
var _ = require('lodash')

App.fetch = function (startDate, endDate) {
  // Imagine something that hits a data store here
}

App.groupByMerchant = function (transactions) {
  return _.groupBy(transactions, 'merchant')
}

App.createPurchaseOrders = function (transactionsByMerchant) {
  return _.map(transactionsByMerchant, function (transactions, merchant) {
    return {
      merchant: merchant,
      total: _.sumBy(transactions, 'amount')
    }
  })
}

App.submit = function (purchaseOrders) {
  // Imagine something that hits a payment processor here
}
