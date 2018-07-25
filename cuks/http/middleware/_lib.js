'use strict'

module.exports = function(cuk) {
  const { _, helper, path, fs, moment } = cuk.pkg.core.lib
  const pkgId = 'log'
  const pkg = cuk.pkg[pkgId]
  const winston = pkg.lib.winston

  pkg.tmp = {}

  const makeLog = (format, options = {}) => {
    const dir = path.join(cuk.dir.data, 'log', 'http', format),
      logs = [{
        id: 'access',
        file: path.join(dir, 'access.log')
      }, {
        id: 'error',
        file: path.join(dir, 'error.log')
      }]
    fs.ensureDirSync(dir)
    _.each(logs, l => {
      let id = `http:${format}:${l.id}`
      let cfg = helper('core:merge')(pkg.cfg.common.opts, _.omit(options, ['formatter']))
      cfg.file = l.file
      let formatter = _.get(options, 'formatter.' + l.id)
      if (formatter)
        cfg.formatter = formatter
      if (!_.has(winston.loggers.loggers, id)) {
        winston.loggers.add(id, {
          transports: [ new winston.transports.Rotate(cfg)]
        })
        winston.loggers.get(id).exitOnError = false
      }
    })
  }

  const formatDate = (format, dt) => {
    if (!dt) dt = moment()
    switch (format || 'web') {
      case 'clf': return dt.format('DD/MMM/YYYY:HH:mm:ss ZZ')
      case 'iso': return dt.toISOString()
      case 'web': return dt.toDate().toUTCString()
    }
  }

  const getInfo = (ctx, err, extra) => {
    extra = extra || {}
    const status = err
      ? (err.isBoom ? err.output.statusCode : err.status || 500)
      : (ctx.status || 404)
    let user = '-'
    if (ctx.header.authorization) {
      const parts = ctx.header.authorization.split(' ')
      if (parts[1]) user = new Buffer(parts[1], 'base64').toString().split(':')[0]
    }
    const parts = ctx.header.authorization
    let data = {
      hostname: ctx.request.hostname,
      port: ctx.header.host.split(':')[1],
      remoteAddr: ctx.ip,
      remoteUser: user,
      method: ctx.method,
      url: ctx.originalUrl,
      protocol: ctx.request.protocol,
      httpVersion: ctx.req.httpVersion,
      status: status,
      contentLength: ctx.response.length || '-',
      referer: ctx.header.referer || ctx.header.referrer || '',
      userAgent: ctx.header['user-agent']
    }
    return _.merge(data, extra)
  }

  const factory = async (ctx, next, format, accessFn, errorFn) => {
    const key = 'cuks.log.' + format + '.' + ctx.path
    let called = _.get(pkg.tmp, key)
    if (called) return next()
    _.set(pkg.tmp, key, true)
    makeLog(format, {
      json: false,
      formatter: {
        access: function(opt) {
          return opt.message || ''
        }
      }
    })
    let start = moment()
    try {
      await next()
      winston.loggers.get(`http:${format}:access`).info(accessFn({
        start: start,
        duration: moment().diff(start)
      }))
    } catch(e) {
//        winston.loggers.get(`http:${format}:error`).error(e.message)
    }

  }

  return {
    makeLog: makeLog,
    formatDate: formatDate,
    getInfo: getInfo,
    factory: factory
  }
}