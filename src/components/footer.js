import AbstractComponent from "./abstract-component";

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

export default class Footer extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return getFooterTemplate(this._films);
  }
}
