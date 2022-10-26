> Internationalization

The process of updating a codebase and infrastructure to make localization possible and easier.

> Localization

The process of adapting content for a given locale including translating text, formating dates and numbers. Contextual and cultural changes.
A locale contains two parts: a language e.g `es` and a country/regional code such as `es-ES` (spain) or `es-MX` (mexico)

## Localizing Unsplash.com

### Infrastructure

We've tried a bunch of open source solution out there

What we were looking for:

- type safe
- Relative small runtime
- Code splittable
- Maintained

We've tried Polyglot from Airbnb, FormatJS, fbt from Facebook,... and some were good but they didn't tick all the boxes we wanted, there was always a trade-off we weren't willing to take. We then ask ourselves how much work would it be to build all of this ourselves?

- Using ICU (International component for Unicode) messages to represent content to translate
- Formatting dates and numbers, lists using Internationalization API (Intl)
- Fully Type-safe
- 0 runtime
- Convert ICU messages into functions
- Enforcing translations using newtypes
- Intlc (Internationalization compiler) https://github.com/unsplash/intlc

### Formatting examples

- 10,000 (en-US) vs 10.000 (es-ES)
- 50% (en-US) vs 50 % (es-ES)
- Plural rules (1 photo vs 5 photos)
- Lists (a, b and c / a, b or C)

### ICU

ICU stands for International Component for Unicode. Many other localization libraries have adaopted this standard.
We can specify static text as well as variable that will be replaced at runtime.

```json
"key1": {
  // Standard variable interpolation with JSX
  "message": "{username} liked your photo. View it on your <link>profile</link>.",
  "backend": "tsx"
}

"key2": {
  // Using numbers
  "message": "{n, number} photos have been published in the {topic} topic.",
  "backend": "ts"
}

"key3": {
  // Using select (represents union types ) closed | open
  "message": "This topic is {status, select, closed {unfortunately closed} open {now open}}",
  "backend": "ts"
}
```

ICU supports strings, number, date, select, etc

We send these json files to a translation service which sends us back version of that file for all supported locale.
We then process them using `intlc` our compiler which creates type-safe functions from these ICU messages and generate TS files we can then import into our components

`intlc` stands for `IntlCompiler` which takes ICU messages as input and outputs TS files (we will support other "backend") in the future.

https://github.com/unsplash/intlc

```tsx
// lang/en-US.tsx
import { ReactElement } from "react";
const key = (options: {
  username: string;
  link: (children: ReactElement) => ReactElement;
}): ReactElement => (
  <>
    {options.username} liked your photo View it on your {x.link(<>profile</>)}
  </>
);

const key2 = (options: {n: number; topic: string}): string => `${new Intl.NumberFormat('en-US').format(options.n)} photos have been published in the ${options.topic} topic.`;
const key3 = (options: {status: "open" | "closed"}) => `This topic is ${(() => {
  switch (options.status) {
    case "open":
      return "now open";
    case "closed":
      return "unfortunately closed"
  }
}())}`

// lang/index.ts
// Generated.

// If we forgot to update another locale this will error out because it won't have the same type as `enUS`

import * as enUS from "./en-US.tsx";
import * as esES from "./es-ES.tsx";

export const useTranslations = (): typeof enUS => {
  const locale = useLocale();

  switch (locale) {
    case "en-US":
      return enUs;
    case "es-ES":
      return esEs;
  }
}



const MyComponent: React.FC = () => {
  const translations = useTranslations(); // Reads current locales from context and select the appropriate translation TS file

  return <div>
    <div>
      // 1. Go to definition work
      // 2. Argument are type safe, username must be a `string`; `link` must return a `ReactElement`
      // 3. Warns about unknown keys for a given translation file
      {translations.key1({
        username: user.username
        link: x => <a href="/profile">{x}</a>
      })}
    </div>
    <div>
      {translations.key2({
        n: 10,
        topic: "Architecture"
      })}
    </div>
    <div>
      {translations.key3({
        status: "open"
      })}
    </div>
  </div>
}
```

### newtypes
> Talk about what newtypes is

Enforcing translations in components. How do we make sure we didn't let english slip into a component which wouldn't work when a user browses in spanish?
We've created a newtype called `Intlzd` which is short for `Internationalized` which is a _special_ type of a string. We can then update component props and react base types to enforce the usage of this type instead of allowing any `string`
