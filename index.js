'use strict'

module.exports = function(cuk) {
  const { path } = cuk.lib
  return Promise.resolve({
    id: 'log',
    tag: 'boot, log',
    level: 1
  })
}