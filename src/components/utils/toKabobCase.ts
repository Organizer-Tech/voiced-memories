export const toKabobCase = (string: string) => {
  const kabobCased = string
    .split(' ')
    .map((word) => word.toLowerCase())
    .join('-');

  return kabobCased;
};
