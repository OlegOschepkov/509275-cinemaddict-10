const getSortMarkup = (filter, isActive) => {
  const {sortType} = filter;


  return (
    `<li><a href="#" class="sort__button ${isActive ? `sort__button--active` : ``}"">${sortType}</a></li>`
  );
};

export const getSortTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => getSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${filtersMarkup}
    </ul>`
  );
};
