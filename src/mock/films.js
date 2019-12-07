import {getRandomArrayItem, getRandomArrayItems, getRandomNumber, getRandomIntegerNumber, FILMS_COUNT} from '../utils/utils';

const filmNames = [
  `Побег из Шоушенка`,
  `Зеленая миля`,
  `Форрест Гамп`,
  `Список Шиндлера`,
  `1+1`,
  `Начало`,
  `Леон`,
  `Король Лев`,
  `Бойцовский клуб`,
  `Иван Васильевич меняет профессию`,
  `Жизнь прекрасна`,
  `Достучаться до небес`,
  `Крестный отец`,
  `Криминальное чтиво`,
  `Операция «Ы» и другие приключения Шурика`
];

const descriptionParts = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const posters = [
  `images/posters/made-for-each-other.png`,
  `images/posters/popeye-meets-sinbad.png`,
  `images/posters/sagebrush-trail.jpg`,
  `images/posters/santa-claus-conquers-the-martians.jpg`,
  `images/posters/the-dance-of-life.jpg`,
  `images/posters/the-great-flamarion.jpg`,
  `images/posters/the-man-with-the-golden-arm.jpg`
];

const genres = [
  `Absurdist/surreal/whimsical`,
  `Comedy`,
  `Drama`,
  `Fantasy`,
  `Historical`,
  `Magical realism`,
  `Paranoid fiction`,
  `Romance`,
  `Saga`,
  `Thriller`,
  `Urban`,
];

const filterTags = [
  ``,
  `watchlist`,
  `history`,
  `favorites`,
  `stats`
];

const getUniqueNames = () => {
  const nameSet = new Set();
  while (nameSet.size < FILMS_COUNT) {
    nameSet.add(getRandomArrayItem(filmNames));
  }
  return nameSet;
};

const today = new Date();
const year = today.getFullYear();
const uniqueNames = [...getUniqueNames()];

const generateFilm = (i) => {
  return {
    name: uniqueNames[i],
    poster: getRandomArrayItem(posters),
    description: getRandomArrayItems(descriptionParts, 1, 3),
    rating: getRandomNumber(0, 10),
    year: getRandomIntegerNumber(1888, year),
    duration: getRandomIntegerNumber(0, 3) + `h ` + getRandomIntegerNumber(0, 59) + `m`,
    genre: getRandomArrayItems(genres, 1, 3, `, `),
    comments: getRandomIntegerNumber(0, 30),
    filterTag: getRandomArrayItem(filterTags)
  };
};

const generateFilms = (count) => new Array(count).fill(``).map((it, i) => generateFilm(i));

export {generateFilm, generateFilms};
