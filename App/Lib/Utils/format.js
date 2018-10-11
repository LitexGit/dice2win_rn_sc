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

const formatDate = d => {
  let date = ''
  if(d instanceof Date) {
    date = d.toISOString().slice(0,10)
  }
  return date
}

const sectionlize = (items) => {
  let sections = []
  if(Array.isArray(items) && items.length) {
    let dateGroup = groupBy(items, 'date')
    let d = new Date()
    let today = formatDate(d)
    d.setDate(d.getDate() - 1)
    let yesterday = formatDate(d)
    Object.keys(dateGroup).forEach(key=>{
      let data = dateGroup[key]
      key===today && (key='today')
      key===yesterday && (key='yesterday')
      sections.push({ key, data })
    })
  }

  return sections
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    acc
    return acc;
  }, {});
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
  formatDate,
  sectionlize,
  groupBy,
}
