/* Пропущенные проверки
 *
 * Запах: тесты не проверяют часть функционала тестируемого модуля.
 *
 * Причины:
 *   1. Тестируемый модуль делает кучу несвязанных вещей. Функционал без тестов
 *      либо неважен, либо про него забыли, либо он не согласуется с
 *      названием модуля. Тестируемый модуль нарушает SRP:
 *      https://en.wikipedia.org/wiki/Single_responsibility_principle
 *
 *      Лечение: вытащите лишнюю ответственность в отдельные модули.
 *               Тестируемый модуль оставьте для их координации.
 *               Если код без тестов связан с логированием или безопасностью,
 *               возможно, проблему можно решить мидлварью или AOP.
 *
 *   2. То, что делает модуль, тяжело проверить целиком. Схалтурили: не добавили
 *      проверки для сложных случаев, оставив часть функционала без тестов.
 *
 *      Лечение: добавьте проверки, если есть возможность и это не трудоемко.
 *
 *               Скорее всего, код остался без тестов, потому что его трудно
 *               проверить. В этом случае решайте:
 *                   возможно, функционал неважен, можно жить и без тестов;
 *                   возможно, тестируемый модуль можно переписать так,
 *                   чтобы возвращаемое значение или сайд-эффекты было легко
 *                   проверить;
 *                   возможно, это неудачное место и код без тестов стоит
 *                   переместить.
 *
 * Замечания к примеру:
 *   Очевидно, что строку с `item.lastAccessedAt` не проверили: если удалить ее,
 *   тесты пройдут.
 *
 *   Подумайте, как добавить адекватную проверку, и как исправить
 *   тестируемый модуль, чтобы он предсказуемо работал со временем.
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

// Тесты
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
