import {createElement} from '../utils/utils';

const getFooterTemplate = (films) => {
  const qty = films.length;

  return (
    `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${qty} movies inside</p>
        </section>
      </footer>`
  );
};

export default class Footer {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return getFooterTemplate(this._films);
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
