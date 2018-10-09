'use strict'

import { utils } from 'ethers'

const DECIMAL = 6 // how many decimal places to display


const displayETH = e => {
  if(!e) { return 0 }

  (e > 10e5) && (e = utils.formatEther(e))
  !isFloat(e) && (e = parseFloat(e))
  e = e.toFixed(DECIMAL)
  return parseFloat(e)
}

const isString = n => typeof(n)==='string'
const isNumber = n => Number(n)===n
const isInt = n => Number(n) === n && n % 1 === 0
const isFloat = n => Number(n) === n && n % 1 !== 0

module.exports = {
  DECIMAL,
  isString,
  isNumber,
  isInt,
  isFloat,
  displayETH,
}
