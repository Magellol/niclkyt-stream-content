import React from "react";
import { ReactElement } from "react";

export const key1 = (options: {
  username: string;
  link: (children: ReactElement) => ReactElement;
}): ReactElement => (
  <>
    {options.username} liked your photo View it on your{" "}
    {options.link(<>profile</>)}
  </>
);

export const key2 = (options: { n: number; topic: string }): string =>
  `${new Intl.NumberFormat("en-US").format(
    options.n
  )} photos have been published in the ${options.topic} topic.`;

export const key3 = (options: { status: "open" | "closed" }) =>
  `This topic is ${(() => {
    switch (options.status) {
      case "open":
        return "now open";
      case "closed":
        return "unfortunately closed";
    }
  })()}`;
