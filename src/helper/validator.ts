export const numberInputGreaterThanZeroValidate = (message: string) => ({
  validator(rule: any, value: any) {
    if (value && Number(value) < 0) return Promise.reject(message);
    return Promise.resolve();
  },
});

export const validateMaxMinInput = (maxInput: number, minInput?: number) => ({
  validator(rule: any, value: any) {
    if (value && Number(value) > maxInput)
      return Promise.reject(`最大${maxInput}数学まで入力してください。`);
    if (value && minInput && Number(value) < minInput)
      return Promise.reject(`最小${minInput}数学まで入力してください。`);
    return Promise.resolve();
  },
});
