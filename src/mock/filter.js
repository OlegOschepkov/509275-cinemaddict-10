const filterNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`, `Stats`
];

const filterLinks = [
  `all`, `watchlist`, `history`, `favorites`, `stats`
];

const generateFilters = () => {
  return filterNames.map((it, i) => {
    return {
      name: it,
      link: filterLinks[i],
    };
  });
};

export {generateFilters};
