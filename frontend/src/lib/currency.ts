export const getCurrencyConfig = () => {
  return {
    locale: "en-IE",
    currency: "EUR"
  };
};

export const formatCurrency = (value: number | string) => {
  const { locale, currency } = getCurrencyConfig();
  const numericVal = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;
  
  if (isNaN(numericVal)) return value; // fallback
  
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency 
  }).format(numericVal);
};
