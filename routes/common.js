function routerfunc(obj, info) {
  var execode = '';
  var middle = [];
  if (obj.middleware.length > 0) {
    for (var i = 0; i < obj.middleware.length; i++) {
      middle.push(`obj.middleware[${i}]`)
    }
    var middle = middle.join();
    execode = `
    router.${obj.command}(obj.url, ${middle}, obj.set)
    `
  } else {
    execode = `
    router.${obj.command}(obj.url, obj.set)
    `
  }
  info.push(new Function(
    ['router', 'obj'], `${execode}`
  ))
}

function routerSet(router, setArray) {
  var info = []
  var len = setArray.length
  for (i = 0; i < len; i++) {
    routerfunc(setArray[i], info)
  }

  for (i = 0; i < len; i++) {
    info[i](router, setArray[i])
  }
  info = null
}


module.exports = routerSet
