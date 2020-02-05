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
  const { width, height } = element.getBoundingClientRect();
  return width * height;
}

let elementAreaPredicate = function (element) {
  return getElementArea(element) > 0;
}

let randomElement = function (elems) {
  const rndIdx = Math.floor(Math.random() * elems.length);
  return elems[rndIdx];
}

let ghostElement = function (element) {
  const parent = element.parentElement;
  
  const clone = element.cloneNode(true);
  clone.style.position = 'fixed';

  element.style.opacity = 0;

  parent.insertBefore(clone, element);

  return clone;
}

let moveElement = function (element, x, y) {
  element.style.top = x + 'px';
  element.style.left = y + 'px';
}

var elems = getLeafElements().filter(elementAreaPredicate);

var a = elems[0];

var b = ghostElement(a);
