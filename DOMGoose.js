/**
 * getLeafElements gets all leaf elements of the selected element, it selects the first html element in the document as it's default parameter
 * @param {HTMLElement} [element=html] DOM Element
 */

let getHtmlElement = function () {
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

let driver = function (element, cb = () => { }) {
  let ghost = ghostElement(element);
  setInterval(() => {
    moveElementRelative(ghost, Math.round(Math.random()) ? 1 : -1, Math.round(Math.random()) ? 1 : -1);
    cb(ghost);
  }, 40);
  return ghost;
}

let getMidPoint = function (element) {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x: x + (width / 2), y: y + (height / 2) };
}

let rectCollisionDetection = function (element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    return true;
  }
  return false;
}

class Goose {
  constructor() {
    this._node = document.createElement('div');
    this._node.id = 'goose';

    // bind methods
    this.draw = this.draw.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.decideTarget = this.decideTarget.bind(this);
    // end methods

    this._targets = randomElement(getLeafElements().filter(elementAreaPredicate));

    getHtmlElement().appendChild(this._node);
    this._heartbeat = setInterval(this.draw, 40);

  }

  draw() {
    moveElementRelative(this._node, Math.round(Math.random()) ? 1 : -1, Math.round(Math.random()) ? 1 : -1);
  }

  decideTarget() {
  }

  getPosition() {
    
  }

  getRect() {
    return this._node.getBoundingClientRect();
  }
}

// getLeafElements().filter(elementAreaPredicate).forEach(element => {
//   driver(element);
// })

/**
 * test code
 */


var elems = getLeafElements().filter(elementAreaPredicate);

var span = elems[0];

var div = elems[1];

// // var g = ghostElement(span);

// let flag = false;

// let driven = driver(span);

// driver(div, (ghost) => {
//   if (rectCollisionDetection(ghost, span)) {
//     console.log('collided!');
//   }
// });


let goose = new Goose();