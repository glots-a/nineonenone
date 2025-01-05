export const isValidEan13 = (value: string | undefined): boolean => {
  if (typeof value === 'string') {
    return /^\d{13}$/.test(value);
  }
  return false;
};
