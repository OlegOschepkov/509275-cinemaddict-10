const getCountMarkup = (filterTag) => {
  const count = filterTag.length;
  return (
    `${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`
  );
};

const getFilterMarkup = (filter, isActive, films) => {
  const {name, link} = filter;
  const countMarkup = getCountMarkup(films.filter((it) => it.filterTag === name.toLowerCase()));
  return (
    `<a href="#${link}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
        ${name} ${countMarkup}</a>`
  );
};

const getSortMarkup = (filter, isActive) => {
  const {sortType} = filter;
  return (sortType ? `<li><a href="#" class="sort__button ${isActive ? `sort__button--active` : ``}"">${sortType}</a></li>` : ``);
};

export const getFilterTemplate = (filters, films) => {
  // const countMarkup = getCountMarkup(films);

  const filtersMarkup = filters.map((it, i) => getFilterMarkup(it, i === 0, films)).join(`\n`);
  const sortMarkup = filters.map((it, i) => getSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>
    <ul class="sort">
      ${sortMarkup}
    </ul>`
  );
};
