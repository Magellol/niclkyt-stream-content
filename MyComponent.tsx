import * as React from "react";
import { useTranslations } from "./lang-index";

type User = { username: string };

const MyComponent: React.FC<{ user: User }> = ({ user }) => {
  const translations = useTranslations(); // Reads current locales from context and select the appropriate translation TS file

  return (
    <div>
      <div>
        {/* // 1. Go to definition work
            // 2. Argument are type safe, username must be a `string`; `link` must return a `ReactElement`
            // 3. Warns about unknown keys for a given translation file
        */}
        {translations.key1({
          username: user.username,
          link: (x) => <a href="/profile">{x}</a>,
        })}
      </div>
      <div>
        {translations.key2({
          n: 10,
          topic: "Architecture",
        })}
      </div>
      <div>
        {translations.key3({
          status: "open",
        })}
      </div>
    </div>
  );
};
