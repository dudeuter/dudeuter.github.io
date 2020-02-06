/**
 * getLeafElements gets all leaf elements of the selected element, it selects the first html element in the document as it's default parameter
 * @param {HTMLElement} [element=html] DOM Element
 */

let getHtmlElement = function() {
  return document.getElementsByTagName('html')[0];
}

let getLeafElements = function (element) {
  element = element || getHtmlElement();

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

  const ghost = element.cloneNode(true);
  ghost.style.position = 'fixed';

  element.style.opacity = 0;

  parent.insertBefore(ghost, element);

  return ghost;
}

/**
 * moveElement, appends a top and left style to the element to move it to a position in the window
 * @param {HTMLElement} element A HTML element in the DOM
 * @param {Number} newx a new X position relative to the left of the window to move the element to
 * @param {Number} newy a new Y position relative to the top of the window to move the element to
 */
let moveElement = function (element, newx, newy) {
  element.style.left = newx + 'px';
  element.style.top = newy + 'px';
}

/**
 * moveElementRelative, appends a top and left style to the element, and moves it to a position on the window relative to where it was
 * @param {HTMLElement} element 
 * @param {Number} pushx 
 * @param {Number} pushy 
 */
let moveElementRelative = function (element, pushx, pushy) {
  const { x, y } = element.getBoundingClientRect();
  moveElement(element, x + pushx, y + pushy);
}

let driver = function (element) {
  let ghost = ghostElement(element);
  setInterval(() => {
    moveElementRelative(ghost, Math.round(Math.random()) ? 1 : -1, Math.round(Math.random()) ? 1 : -1);
  }, 40);
}

class Goose {
  constructor() {
    this._node = document.createElement('div');
    this._node.id = 'goose';

    getHtmlElement().appendChild(this._node);
  }
}


/**
 * test code
 */


var elems = getLeafElements().filter(elementAreaPredicate);

var span = elems[0];

var div = elems[1];

// var g = ghostElement(span);

new Goose();