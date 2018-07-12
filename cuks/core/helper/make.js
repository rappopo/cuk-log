'use strict'

module.exports = function(cuk) {
  const { _, path, fs, helper } = cuk.pkg.core.lib
  const pkgId = 'log'
  const pkg = cuk.pkg[pkgId]

  return (name, opts = {}) => {
    const winston = pkg.lib.winston
    let names = name.split(':')
    const dir = path.join(cuk.dir.data, 'log', names[0]),
      file = path.join(dir, names[1] + '.log')
    fs.ensureDirSync(dir)
    if (!_.has(winston.loggers.loggers, name)) {
      let cfg = helper('core:merge')(pkg.cfg.common.opts, _.omit(opts, ['json']))
      cfg.file = file
      winston.loggers.add(name, {
        transports: [ new winston.transports.Rotate(cfg)]
      })
      winston.loggers.get(name).exitOnError = false
    }
    return winston.loggers.get(name)
  }
}