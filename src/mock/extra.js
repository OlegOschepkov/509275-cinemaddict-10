const extraNames = [
  `Top rated`, `Most commented`
];

const extraFlags = [
  `rating`, `commentsQuantity`
];

const generateExtra = () => {
  return extraNames.map((it, i) => {
    return {
      extraName: it,
      extraFlag: extraFlags[i]
    };
  });
};

export {generateExtra};
