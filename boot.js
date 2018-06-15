'use strict'

const winston = require('winston')
require('winston-logrotate')

module.exports = function(cuk){
  let pkgId = 'log',
    pkg = cuk.pkg[pkgId]
  const { _, debug, helper, path, fs } = cuk.lib

  pkg.lib.winston = winston

  return new Promise((resolve, reject) => {
    const disabled = _.get(pkg.cfg, 'common.disabled', [])
    _.each(helper('core:pkgs')(), p => {
      let cfg = _.get(p, 'cfg.cuks.log')
      if (false === !!cfg) return
      let opts = {
        pkgId: p.id,
        name: cfg.name || 'general',
        opts: cfg.opts || {}
      }
      let name = `${opts.pkgId}:${opts.name}`
      if (disabled.indexOf(name) > -1) {
        helper('core:bootTrace')('%A Disabled %K %s %L DDIR:./log/%s/%s.log', null, null, name, null, p.id, opts.name)
        return
      }
      helper('log:make')(opts, true)
      helper('core:bootTrace')('%A Enabled %K %s %L DDIR:./log/%s/%s.log', null, null, name, null, p.id, opts.name)
      p.log = (severity, msg, meta) => {
        helper('log:get')(p.id).log(severity, msg, meta)
      }
    })
    resolve(true)
  })
}