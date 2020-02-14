let swap = function (a, p1, p2) {
  [a[p1], a[p2]] = [a[p2], a[p1]];
}

let shuffle = function (array) {
  const newArr = [...array];
  for (let i = 0; i < newArr.length; i++) {
    swap(newArr, i, Math.floor(Math.random() * (newArr.length - i)) + i);
  }
  return newArr;
}

let getRect = function (element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return { x: x + window.scrollX, y: y + window.scrollY, width, height };
}

let randomGenerator = function* (array) {
  const vals = shuffle(array);
  for (let i = 0; i < vals.length; i++) {
    yield vals[i];
  }
}

let getHtmlElement = function () {
  return document.getElementsByTagName('html')[0];
}

/**
 * getLeafElements gets all leaf elements of the selected element, it selects the first html element in the document as it's default parameter
 * @param {HTMLElement} [element=html] DOM Element
 * @returns {Array} returns an array of HTMLElements
 */
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
  const { width, height } = getRect(element);
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
  const { width, height } = getRect(element);

  const ghost = element.cloneNode(true);
  ghost.style.position = 'absolute';
  ghost.style.width = `${width}px`;
  ghost.style.height = `${height}px`;


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
  const { x, y } = getRect(element);
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

let driveAway = function (element, cb = () => { }) {
  let ghost = ghostElement(element);
  setInterval(() => {
    moveElementRelative(ghost, 4, 4);
    cb(ghost);
  }, 40);
  return ghost;
}

let getMidPoint = function (element) {
  const { x, y, width, height } = getRect(element);
  return { x: x + (width / 2), y: y + (height / 2) };
}

let rectCollisionDetection = function (element1, element2) {
  const rect1 = getRect(element1);
  const rect2 = getRect(element2);
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    return true;
  }
  return false;
}

class Goose {
  constructor(targets, velocity) {
    this._node = document.createElement('img');
    this._node.src = 'https://i.ya-webdesign.com/images/goose-clipart-7.png';

    // styling
    this._node.style.width = '100px';
    this._node.style.height = '100px';
    this._node.style.position = 'absolute';
    this._node.style.top = '0';
    this._node.style.left = '0';
    this._node.style.zIndex = '1';
    // end styling

    // bind methods
    this.draw = this.draw.bind(this);
    this.decideTarget = this.decideTarget.bind(this);
    // end methods

    this._velocity = velocity || 6;
    this._targets = targets || getLeafElements().filter(elementAreaPredicate);
    this._order = randomGenerator(this._targets);
    this._target = null;
    this._children = [];

    getHtmlElement().appendChild(this._node);
    this._heartbeat = setInterval(this.draw, 40);

  }

  draw() {
    if (!this._target) {
      this._target = this._order.next().value;
    }

    if (rectCollisionDetection(this._target, this._node)) {
      this._children.push(ghostElement(this._target));
      const next = this._order.next();

      if (next.done) {
        clearInterval(this._heartbeat);
      } else {
        this._target = next.value;
      }
    }

    const mp = getMidPoint(this._target);

    const { x, y } = this.getRect();

    const vx = mp.x - x;
    const vy = mp.y - y;

    const movex = (vx * this._velocity / Math.sqrt(vx ** 2 + vy ** 2));
    const movey = (vy * this._velocity / Math.sqrt(vx ** 2 + vy ** 2));

    moveElementRelative(this._node, movex, movey);
    this._children.forEach(child => {
      moveElementRelative(child, movex, movey);
    });
  }

  decideTarget() {
    this._target = randomElement(this._targets);
  }

  getRect() {
    return getRect(this._node);
  }
}

let goose = new Goose(getLeafElements(document.querySelector('#main')).concat(...document.querySelectorAll('.chat')).filter(elementAreaPredicate));