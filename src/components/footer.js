export const getFooterTemplate = (films) => {
  const qty = films.length;
  return (
    `<footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${qty} movies inside</p>
        </section>
      </footer>
`
  );
};
