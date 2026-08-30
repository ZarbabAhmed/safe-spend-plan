export interface CurrencyDef {
  code: string;
  symbol: string;
  name: string;
  /** symbol placed before amount with a space, e.g. "Rs. 150,000" */
  prefix: string;
  locale: string;
}

export const CURRENCIES: CurrencyDef[] = [
  { code: "PKR", symbol: "Rs.", name: "Pakistani Rupee", prefix: "Rs. ", locale: "en-PK" },
  { code: "USD", symbol: "$", name: "US Dollar", prefix: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", prefix: "€", locale: "en-IE" },
  { code: "GBP", symbol: "£", name: "British Pound", prefix: "£", locale: "en-GB" },
  { code: "AED", symbol: "AED", name: "UAE Dirham", prefix: "AED ", locale: "en-AE" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", prefix: "SAR ", locale: "en-SA" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", prefix: "₹", locale: "en-IN" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", prefix: "৳", locale: "en-BD" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", prefix: "₺", locale: "tr-TR" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", prefix: "RM ", locale: "en-MY" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", prefix: "C$", locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", prefix: "A$", locale: "en-AU" },
];

export const DEFAULT_CURRENCY = "PKR";

export function getCurrency(code: string): CurrencyDef {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
}
