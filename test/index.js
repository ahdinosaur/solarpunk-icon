const test = require('ava')

const solarpunkIcon = require('../')

test('solarpunk-icon', function (t) {
  t.truthy(solarpunkIcon, 'module is require-able')
})
