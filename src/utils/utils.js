import moment from "moment";

const getLowest = (object, val) => Object.keys(object).sort((a, b) => b - a).find((el) => el <= val);

const getRandomDate = (start, end, option) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  if (option) {

    return moment(date).format(`DD MMMM YYYY`);
  } else {

    return moment(date).format(`YYYY/MM/DD HH:MM`);
  }
};

const replace = (newComponent, oldComponent) => {
  if (newComponent && oldComponent) {
    const parentElement = oldComponent.getElement().parentElement;
    const newElement = newComponent.getElement();
    const oldElement = oldComponent.getElement();

    const isExistElements = !!(parentElement && newElement && oldElement);

    if (isExistElements && parentElement.contains(oldElement)) {
      parentElement.replaceChild(newElement, oldElement);
    }
  }
};

const getHumanRadableDuration = (duration) => {
  const min = parseInt(duration % 60, 10);
  const hours = parseInt((duration / 60) % 24, 10);
  return hours + `h ` + min + `m`;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export {getLowest, getRandomDate, shuffle, replace, getHumanRadableDuration};
