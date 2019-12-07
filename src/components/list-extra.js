export const getExtraListTemplate = (type) => {
  const {extraType} = type;

  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">${extraType}</h2>
    <div class="films-list__container"></div>
  </section>`
  );
};

