// lang/index.ts
// Generated.

// If we forgot to update another locale this will error out because it won't have the same type as `enUS`

import * as enUS from "./en-US";
import * as esES from "./es-ES";

type Locale = "en-US" | "es-ES";

declare const useLocale: () => Locale;

export const useTranslations = (): typeof enUS => {
  const locale = useLocale();

  switch (locale) {
    case "en-US":
      return enUS;
    case "es-ES":
      return esES;
  }
};
