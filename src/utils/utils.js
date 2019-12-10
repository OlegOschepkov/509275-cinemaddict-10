const getRandomArrayItem = (array) => array[getRandomIntegerNumber(0, array.length)];

const getRandomArrayItems = (array, start, end, symbol) => {
  const quantity = getRandomIntegerNumber(start, end);
  let total = ``;
  for (let i = 0; i < quantity; i++) {
    if (symbol && i > 0) {
      total = total + symbol + getRandomArrayItem(array);
    } else {
      total = total + getRandomArrayItem(array);
    }
  }
  return total;
};

const getRandomNumber = (min, max) => Math.floor(min + (max * Math.random()) * 100) / 100;

const getRandomIntegerNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const clamp = (val, min, max) => Math.max(Math.min(max, val), min);

const randomDate = (start, end, option) => {
  let options = {};
  if (option) {
    options = {
      year: `numeric`,
      month: `long`,
      day: `numeric`
    };
  } else {
    options = {
      year: `numeric`,
      month: `long`,
      day: `numeric`,
      hour: `numeric`,
      minute: `numeric`
    };
  }
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleString(`en-GB`, options);
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const FILMS_COUNT = 15;

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export {getRandomArrayItem, getRandomArrayItems, getRandomNumber, getRandomIntegerNumber, clamp, randomDate, createElement, RenderPosition, render, FILMS_COUNT, shuffle};
