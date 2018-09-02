'use strict'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib

  return (name) => {
    let log = cuk.pkg.log.lib.winston.loggers.get(name)
    return log
  }
}