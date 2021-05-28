export const whitespaceRule = (value) => {
  const whitespaceRegex = /^\s+$/;
  return !whitespaceRegex.test(value);
};
