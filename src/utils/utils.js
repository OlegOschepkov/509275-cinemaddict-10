import moment from "moment";

const getLowest = (object, val) => Object.keys(object).sort((a, b) => b - a).find((el) => el <= val);

const getRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return moment(date).format(`YYYY/MM/DD HH:MM`);
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

const getHumanReadableDuration = (duration) => {
  const min = duration % 60;
  const hours = Math.floor(duration / 60);
  return hours + `h ` + min + `m`;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export {getLowest, getRandomDate, shuffle, replace, getHumanReadableDuration};
