let getLeafElements = function(element) {
  element = element || document.getElementsByTagName('html')[0];

  if (element.children.length) {
    let results = [];
    for (let i = 0; i < element.children.length; i++) {
      results = results.concat(getLeafElements(element.children[i]));
    }
    return results;
  } else {
    return [element];
  }
}

let getElementArea = function (element) {
  const { x, y } = element.getBoundingClientRect();
  return x * y;
}

let elementAreaPredicate = function (element) {
  return getElementArea(element) > 0;
}

let randomElement = function (elems) {
  const rndIdx = Math.floor(Math.random() * elems.length);
  return elems[rndIdx];
}

let ghostElement = function(element) {
  const parent = element.parentElement;
  
  const clone = element.cloneNode(true);

  parent.insertBefore(clone, element);
}

var elems = getLeafElements().filter(elementAreaPredicate);

console.log('DOMGoose functions:\n\ngetLeafElements\ngetElementArea\nelementAreaPredicate\nElements assigned to elems');