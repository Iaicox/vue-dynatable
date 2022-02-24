export function ArrayOrderUpdate(array, items, compareArr, orderKey = 'order') {
  array.forEach(el => {
      const find = items.find(item => CheckUnicByKeysArr(item, el, compareArr))
      find && (el[orderKey] = find[orderKey])
    })
  array.sort((a, b) => a[orderKey] - b[orderKey])
  array.forEach((el, i) => {
      el[orderKey] = i
      return el
    })
  return array
}

export function getSortDirection(dir) {
  switch (dir) {
    case undefined:
    case '':
      return 'ascending'
    case 'ascending':
      return 'descending'
    case 'descending':
      return ''
  }
}

export function CheckUnicByKeysArr(itemToCheck, itemOriginal, compareArr = []) {
  if (typeof compareArr === 'string')
    compareArr = [compareArr]

  return compareArr.every(key => itemOriginal[key] === itemToCheck[key])
}

export function FixChildrenOrder(headers) {
  const children = headers.filter(el => el.parent),
        newIds = [],
        mins = {}

  children.forEach(child => {
    const parentId = `id-${child.parent}`
    mins[parentId] = Math.min(...children.filter(el => CheckUnicByKeysArr(child, el, ['parent'])).map(el => el.order))
    child.order = mins[parentId]
    newIds.push(child)
  })
  ArrayOrderUpdate(headers, newIds, ['value'])
}

export function CollectClasses(classes, args = {}) {
  const classItem = {}

  if (typeof classes === 'string')
    classItem[classes] = true
  else if (typeof classes === 'array')
    classes.forEach(item => Object.assign(classItem, CollectClasses(item, args)))
  else if (typeof classes === 'object')
    Object.entries(classes).forEach(([key, value]) => Object.assign(classItem, {[key]: CollectClasses(value, args)}))
  else if (typeof classes === 'function')
    return classes(args)

  return classItem
}

// Приведение строки к числу если возможно
export function toNumber(val) {
  if (isNull(val) || typeof val === 'undefined')
    return ''
  if (isNaN(+val))
    return val
  else
    return +val
}
export function isNull(val) {
  return typeof val === 'object' && !val
}
export function isObjEmpty(obj) {
  return typeof obj === 'object' && !Object.keys(obj).length
}
export function objGoByPath(obj, pathList) {
  if (!pathList || !obj)
    return obj
  if (typeof pathList === 'string')
    pathList = pathList.split('.')
  if (!Array.isArray(pathList))
    return obj


  const original = obj
  const lastKey = pathList.splice(pathList.length - 1, 1)
  const itemParent = pathList.reduce((obj, path) => obj[path] ?? {}, obj)
  const item = itemParent[lastKey]
  return { itemParent, item, original, lastKey }
}

export function uniteObj(primary, secondary, shouldSavePaths = []) {
  const unitedObj = Object.assign({}, secondary, primary)

  if (shouldSavePaths.length) {
    shouldSavePaths.forEach(path => {
      const { item: savedValue , lastKey: key } = objGoByPath(secondary, path)
      const { itemParent: secondaryObj } = objGoByPath(unitedObj, path)
      Object.assign(secondaryObj, {[key]: savedValue})
    })
  }

  return unitedObj
}

export function calcWidth(countCols) {
  return Math.min(~~(50 / countCols + 5 * (countCols - 1)), ~~(100 / countCols))
}

export function compareArrayObject(array1, array2, key) {
  if (array1.length !== array2.length)
    return false

  return array1.some((item, i) => CheckUnicByKeysArr(item, array2[i], key))
}
export function compareSimpleArray(array1, array2) {
  if (array1.length !== array2.length)
    return false

  return array1.some((el, i) => el !== array2[i])
}


const Helpers = {
  ArrayOrderUpdate,
  getSortDirection,
  CheckUnicByKeysArr,
  FixChildrenOrder,
  CollectClasses,
  toNumber,
  isNull,
  isObjEmpty,
  objGoByPath,
  uniteObj,
  calcWidth,
  compareArrayObject,
  compareSimpleArray,
}

export default Helpers