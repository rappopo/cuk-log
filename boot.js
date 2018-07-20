'use strict'

const winston = require('winston')
require('winston-logrotate')

module.exports = function(cuk){
  let pkgId = 'log',
    pkg = cuk.pkg[pkgId]
  const { _, debug, helper, path, fs } = cuk.pkg.core.lib

  pkg.lib.winston = winston

  return new Promise((resolve, reject) => {
    const disabled = _.get(pkg.cfg, 'common.disabled', [])
    _.each(helper('core:pkgs')(), p => {
      let cfg = _.get(p, 'cfg.cuks.log')
      if (false === !!cfg) return
      _.forOwn(cfg, (v, k) => {
        v = v || {}
        let name = `${p.id}:${k}`
        if (disabled.indexOf(name) > -1) {
          helper('core:trace')('|  |- Disabled => %s -> DDIR:./log/%s/%s.log', name, p.id, k)
          return
        }
        helper('log:make')(name, v)
        helper('core:trace')('|  |- Enabled => %s -> DDIR:./log/%s/%s.log', name, p.id, k)
        if (k === 'main')
          p.log = (severity, msg, meta) => {
            helper('log:get')(name).log(severity, msg, meta)
          }
      })
    })
    resolve(true)
  })
}