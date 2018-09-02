'use strict'

module.exports = function (cuk) {
  const { util } = cuk.pkg.core.lib
  const format = 'json'
  const lib = require('./_lib')(cuk)

  return () => {
    return async (ctx, next) => {
      return lib.factory(ctx, next, format, param => {
        let info = lib.getInfo(ctx, null, {
          duration: param.duration,
          date: lib.formatDate('iso', param.start)
        })
        return JSON.stringify(info)
      })
    }
  }
}

