export const AGE_VALIDATION = {
  MIN_AGE: 18,
  MAX_AGE: 100,
};

export const validateAge = (value: number): boolean => {
  return value >= AGE_VALIDATION.MIN_AGE && value <= AGE_VALIDATION.MAX_AGE;
};

export const preventNonNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'e' || e.key === '-' || e.key === '+') {
    e.preventDefault();
  }
};
