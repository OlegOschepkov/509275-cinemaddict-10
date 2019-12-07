import {getRandomArrayItem, getRandomArrayItems, getRandomNumber, getRandomIntegerNumber, randomDate} from '../utils/utils';

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

const filmNamesOrigin = [
  `The Shawshank Redemption`,
  `The Green Mile`,
  `Forrest Gump`,
  `Schindler's List`,
  `1+1`,
  `Inception`,
  `Léon`,
  `The Lion King`,
  `Fight Club`,
  `Иван Васильевич меняет профессию`,
  `La vita è bella`,
  `Knockin' on Heaven's Door`,
  `The Godfather`,
  `Pulp Fiction`,
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

const directors = [
  `Фрэнк Дарабонт`,
  `Роберт Земекис `,
  `Оливье Накаш`,
  `Леонид Гайдай`,
  `Роберто Бениньи`,
  `Кристофер Нолан`
];

const screenwriters = [
  `Стивен Кинг`,
  `Уинстон Грум`,
  `Эрик Рот`,
  `Томас Кенилли`,
  `Стивен Зеллиан`,
  `Владлен Бахнов`,
  `Михаил Булгаков`
];

const actors = [
  `Александр Демьяненко`,
  `Юрий Яковлев`,
  `Леонид Куравлёв`,
  `Наталья Крачковская`,
  `Савелий Крамаров`,
  `Наталья Селезнёва`,
  `Владимир Этуш`,
  `Михаил Пуговкин`,
  `Сергей Филиппов`,
  `Наталья Кустинская`,
  `Том Хэнкс`,
  `Робин Райт`,
  `Салли Филд`,
  `Гэри Синиз`,
  `Майкелти Уильямсон`,
  `Майкл Коннер Хэмпфри`,
  `Ханна Р. Холл`,
  `Сэм Андерсон`,
];

const countrys = [
  `СССР`,
  `США`,
  `Италия`,
  `Франция`,
];

const getUniqueNames = (array, start, stop) => {
  const nameSet = new Set();
  const maxLength = getRandomIntegerNumber(start, stop);
  while (nameSet.size < maxLength) {
    nameSet.add(getRandomArrayItem(array));
  }
  return [...nameSet].join(`, `);
};


const today = new Date();

const generatePopup = () => {
  return {
    poster: getRandomArrayItem(posters),
    name: getRandomArrayItem(filmNames),
    nameOrigin: getRandomArrayItem(filmNamesOrigin),
    pegi: getRandomIntegerNumber(3, 18),
    rating: getRandomNumber(0, 10),
    userRating: getRandomNumber(0, 10),
    director: getUniqueNames(directors, 1, 2),
    screenwriter: getUniqueNames(screenwriters, 1, 3),
    actor: getUniqueNames(actors, 1, 10),
    fullDate: randomDate(new Date(1888, 0, 1), today, true),
    duration: getRandomIntegerNumber(0, 3) + `h ` + getRandomIntegerNumber(0, 59) + `m`,
    country: getUniqueNames(countrys, 1, 2),
    genre: getRandomArrayItems(genres, 1, 3, `, `),
    fullDescription: getRandomArrayItems(descriptionParts, 5, 10),
    filterTag: getRandomArrayItem(filterTags),
  };
};

export {generatePopup};
