import AbstractComponent from "./abstract-component";

const getUserTemplate = (level) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${level}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class User extends AbstractComponent {
  constructor(level) {
    super();
    this._level = level;
  }

  getTemplate() {
    return getUserTemplate(this._level);
  }
}
