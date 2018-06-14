'use strict'

module.exports = function(cuk) {
  const pkgId = 'log'
  const pkg = cuk.pkg[pkgId]
  const winston = pkg.lib.winston

  return (options = {}) => {
    const dir = path.join(cuk.dir.data, 'log', options.pkgId),
      file = path.join(dir, options.name + '.log')
    const name = `${options.pkgId}:${options.name}`
    fs.ensureDirSync(dir)
    if (!_.has(winston.loggers.loggers, name)) {
      let cfg = helper('core:merge')(pkg.cfg.default, _.omit(options, ['json']))
      cfg.file = file
      winston.loggers.add(name, {
        transports: [ new winston.transports.Rotate(cfg)]
      })
      winston.loggers.get(name).exitOnError = false
    }
  }
}