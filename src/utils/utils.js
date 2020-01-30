import moment from "moment";

// const getRandomArrayItem = (array) => array[getRandomIntegerNumber(0, array.length)];

// const getRandomArrayItems = (array, start, end, symbol) => {
//   const quantity = getRandomIntegerNumber(start, end);
//   let total = ``;
//   for (let i = 0; i < quantity; i++) {
//     if (symbol && i > 0) {
//       total = total + symbol + getRandomArrayItem(array);
//     } else {
//       total = total + getRandomArrayItem(array);
//     }
//   }
//   return total;
// };

// const getRandomNumber = (min, max) => Math.floor(min + (max * Math.random()) * 100) / 100;

// const getRandomIntegerNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

// const clamp = (val, min, max) => Math.max(Math.min(max, val), min);

const getLowest = (object, val) => Object.keys(object).sort((a, b) => b - a).find((el) => el <= val);

const getRandomDate = (start, end, option) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  if (option) {
    // console.log(moment(date).format(`HH:MM`))

    return moment(date).format(`DD MMMM YYYY`);
  } else {
    // console.log(moment(date).format(`HH:MM`))

    return moment(date).format(`YYYY/MM/DD HH:MM`);
  }
};

// const randomDuration = () => {
//   const start = new Date(2010, 1, 1, 0, 1);
//   const end = new Date(2010, 1, 1, 2, 59);
//   const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//   return moment.duration(moment(date).diff(moment(start))).asMilliseconds();
// };

// const getDuration = () => {
//   const duration = randomDuration();
//   const min = parseInt((duration/(1000*60))%60);
//   const hours = parseInt((duration/(1000*60*60))%24);
//   const itog = hours + ` h ` + min + ` min`;
//   return itog;
// }

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

// const FILMS_COUNT = 15;

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export {getLowest, getRandomDate, shuffle, replace, getHumanRadableDuration};
