'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  return (pkgId) => {
    let log = cuk.pkg.log.lib.winston.loggers.get(pkgId)
    return log
  }
}