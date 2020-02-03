import AbstractSmartComponent from "./abstract-smart-component";
import {getLowest} from "../utils/utils";

const userLevels = {
  0: ``,
  1: `novice`,
  11: `fan`,
  21: `movie buff`,
};

const user = {
  _level: 0,
  get level() {
    return `${userLevels[this._level]}`;
  },
  set level(val) {
    this._level = getLowest(userLevels, val);
  }
};

const getUserTemplate = (level) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${level}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class User extends AbstractSmartComponent {
  constructor() {
    super();
    this._level = ``;
  }

  getTemplate() {
    return getUserTemplate(this._level);
  }

  getLevel() {
    return this._level;
  }

  setLevel(films) {
    user.level = films.reduce((acc, it) => acc + it.isWatched, 0);
    this._level = user.level;
  }

  update() {
    this.rerender();
  }

  recoveryListeners() {}
}
