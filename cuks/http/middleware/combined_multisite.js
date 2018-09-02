'use strict'

module.exports = function (cuk) {
  const { util } = cuk.pkg.core.lib
  const format = 'combinedMultisite'
  const lib = require('./_lib')(cuk)

  return () => {
    return async (ctx, next) => {
      return lib.factory(ctx, next, format, param => {
        let info = lib.getInfo(ctx, null, {
          duration: param.duration,
          date: lib.formatDate('clf', param.start)
        })
        let message = util.format('%s:%s %s - %s [%s] "%s %s %s/%s" %s %s "%s" "%s"',
          info.hostname, info.port, info.remoteAddr, info.remoteUser, info.date, info.method,
          info.url, info.protocol, info.httpVersion,
          info.status, info.contentLength, info.referer, info.userAgent)
        return message
      })
    }
  }
}
