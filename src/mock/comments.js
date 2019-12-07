import {getRandomArrayItem, getRandomIntegerNumber, randomDate} from "../utils/utils";

const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `The film opens following a murder at a cabaret`,
  `in Mexico City in 1936, and then `,
  `events leading up to it in flashback`,
  `Царь Иоанн Васильевич Грозный в современной Москве слушает на магнитофоне песню Высоцкого «Эх, раз, ещё раз».`,
  `Крымский хан действительно шалил на Изюмском шляхе в 1571 году.`,
  `Таким образом, ответ Ивана Васильевича должен был звучать как «Лето семь тысяч тридцать восьмое от сотворения мира».`,
  `Шведский посол говорит не на шведском, а на немецком языке.`,
];

const authors = [
  `Tim Macoveev`,
  `John Doe`,
  `Some Random`,
  `This Viewer`,
  `Trololo`,
  `MegaFan`,
  `Иванов Иван Иваныч`,
];

const emoji = [
  `images/emoji/angry.png`,
  `images/emoji/puke.png`,
  `images/emoji/sleeping.png`,
  `images/emoji/smile.png`,
  `images/emoji/trophy.png`
];

const today = new Date();

const generateComment = () => {
  return {
    text: getRandomArrayItem(comments),
    author: getRandomArrayItem(authors),
    date: randomDate(new Date(2010, 0, 1), today, false),
    emoji: Math.random() > 0.5 ? getRandomArrayItem(emoji) : ``
  };
};

const count = getRandomIntegerNumber(3, 7);

const generateComments = () => new Array(count).fill(``).map((it, i) => generateComment(i));

export {generateComments};

