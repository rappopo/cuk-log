'use strict'

const winston = require('winston')
require('winston-logrotate')

module.exports = function(cuk){
  let pkgId = 'log',
    pkg = cuk.pkg[pkgId]
  const { _, debug, helper, path, fs } = cuk.lib

  pkg.trace('Initializing...')

  pkg.lib.winston = winston

  return new Promise((resolve, reject) => {
    /*
    _.each(helper('core:pkgs')(), p => {
      let cfg = _.get(p, 'cfg.cuks.log')
      if (false === !!cfg) return
      let defCfg = {
        console: false,
        file: {
          colorize: false,
          timestamp: true,
          json: true,
          size: '100m',
          keep: 5,
          compress: true
        }
      }
      if (cfg === true) {
        cfg = defCfg
      } else if (_.isPlainObject(cfg)) {
        cfg.console = !!cfg.console
        if (cfg.file === true)
          cfg.file = defCfg.file
        else if (_.isPlainObject(cfg.file))
          cfg.file = helper('core:merge')(defCfg.file, cfg.file)
        else
          cfg.file = false
      }
      let transports = []
      if (cfg.console) transports.push(new winston.transports.Console())
      if (cfg.file) {
        let dir = path.join(cuk.dir.data, 'log', p.id)
        fs.ensureDirSync(dir)
        cfg.file.file = path.join(dir, 'pkg.log')
        transports.push(new winston.transports.Rotate(cfg.file))
      }
      winston.loggers.add(p.id, {
        transports: transports
      })
      winston.loggers.get(p.id).exitOnError = false
      p.log = (severity, msg, meta) => {
        helper('log:get')(p.id).log(severity, msg, meta)
      }
      pkg.trace('Serve » %s', p.id)
    })
    */
    resolve(true)
  })
}