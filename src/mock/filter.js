const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`, `Stats`
];

const filterLinks = [
  `all`, `watchlist`, `history`, `favorites`, `stats`
];

const sortNames = [
  `Sort by default`, `Sort by date`, `Sort by rating`
];

const generateFilters = () => {
  return filterNames.map((it, i) => {
    return {
      sortType: sortNames[i],
      name: it,
      link: filterLinks[i],
      count: 1
    };
  });
};

export {generateFilters};
