import {createElement} from '../utils/utils';

const getExtraListTemplate = (type) => {
  const {extraType} = type;

  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">${extraType}</h2>
    <div class="films-list__container"></div>
  </section>`
  );
};

export default class Footer {
  constructor(type) {
    this._type = type;
    this._element = null;
  }

  getTemplate() {
    return getExtraListTemplate(this._type);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
