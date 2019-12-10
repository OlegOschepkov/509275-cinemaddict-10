import {createElement} from '../utils/utils';

const getLoadMoreBtnTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getLoadMoreBtnTemplate();
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
