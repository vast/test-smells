/* Запах: Пропущенные проверки
 *
 * Симптом: Тесты не проверяют часть функционала тестируемого модуля
 *
 * Причины:
 *   1. Тестируемый модуль делает кучу несвязанных вещей. Функционал без тестов
 *      либо неважен, либо про него забыли, либо он не согласуется с
 *      названием модуля. Проще говоря, тестируемый объект нарушает SRP
 *      (https://en.wikipedia.org/wiki/Single_responsibility_principle)
 *
 *      Лечение: вытащите лишнюю ответственность в отдельные модули.
 *               Тестируемый модуль оставьте для их координации.
 *               Если код без тестов связан с логированием или безопаностью,
 *               возомжно, проблему можно решить мидлварью или AOP.
 *
 *   2. То, что делает модуль, тяжело проверить целиком. Не стали добавлять
 *      проверки, оставили часть функционала без тестов.
 *
 *      Лечение: добавьте проверки, если есть возможность и это не трудоемко.
 *               Скорее всего, код остался без тестов, потому что его трудно
 *               проверить. В этом случае решайте: возможно, функционал
 *               не важен, можно жить и без тестов; возможно, тестируемый
 *               модуль можно переписать так, чтобы возвращаемое значение
 *               или сайд-эффекты было легко проверить; возможно, это
 *               неудачное место и код без тестов стоит переместить.
 *
 * Замечания к примеру:
 *   Очевидо, что строка с `item.lastAccessedAt` не была проверена.
 *   Если удалить ее, тесты пройдут. Подумайте, как добавить адекватную
 *   проверку, как исправить тестируемый модуль, чтобы он работал предсказуемо
 *   работал со временем.
 *
 *   Еще круче: подумайте, как бы вы исправили `fetch` так, чтобы ему
 *   не приходилось изменять скачиваемое значение через `lastAccessedAt`.
 */

// Тестируемый модуль
function fetch (id) {
  var item = find(id)
  item.lastAccessedAt = new Date().getTime()
  return item
}

// Test
module.exports = {
  getsTheItem: function () {
    var result = fetch(42)

    assert.equal(result.name, 'Fred')
  }
}

// Фейковая реализация
function find (id) {
  if (id === 42) {
    return Object.create({ name: 'Fred' })
  }
}

