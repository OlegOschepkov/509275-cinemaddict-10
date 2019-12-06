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

export {getRandomArrayItem, getRandomArrayItems, getRandomNumber, getRandomIntegerNumber, clamp, randomDate};
