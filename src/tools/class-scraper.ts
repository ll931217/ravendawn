import { load } from "cheerio";

const url = "https://wiki.ravendawn.online/index.php?title=Archetypes";
const page = await fetch(url, {
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
  },
}).then((res) => res.text());
const $ = load(page);

type Class = {
  name: string;
  archetypes: string[];
};

type Classes = {
  [key: string]: Class;
};

const classesTable = $(
  "body #content #bodyContent #mw-content-text table:last-child tbody",
);
const classes: Classes = {};

$(classesTable)
  .children("tr")
  .each((_, el) => {
    const name = $(el).find("td:first-child").text().replace("\n", "");
    const key = name.toLowerCase().replace(" ", "_");
    const archetypes: string[] = [];
    $(el)
      .find("td")
      .slice(1)
      .each((_, el) => {
        archetypes.push($(el).find("a").text());
      });
    classes[key] = { name, archetypes };
  });

Bun.write("src/data/classes.json", JSON.stringify(classes, null, 2));
