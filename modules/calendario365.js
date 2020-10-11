import { moonTerms, saveDate } from "/js/dates.js";

let moonData = {};
// CALENDARIO365
function linesToData(arr) {
  return arr.map((line) => line.trim().replace(/\t/g, ",").split(","));
}

// Split into smaller functions doing small tasks
export default function (lines) {
  let arr = linesToData(lines);
  // Get year as last word from first line
  let year, columns;
  year = arr.shift();
  year = year[0].split(" ").pop();
  console.log({ year });
  columns = arr.shift();
  moonData[year] = [];
  arr.forEach((a) => {
    if (a.length == 4) {
      let dist = Number(a[3].match(/(\d+)/g).join("")),
        phase,
        special;
      if (a[0].includes("Superluna")) {
        phase = moonTerms.ES.phases[2];
        special = moonTerms.ES.special[0];
      } else {
        phase = a[0].toLowerCase();
        special = "";
      }

      let obj = {
        gregDate: saveDate({
          date: a[1] + " " + a[2],
          UTCTime: true,
          format: "locale",
          lang: "ES",
        }),
        dist,
        phase,
        special,
      };
      moonData[year].push(obj);
    }
  });
  console.log({ moonData });
  return { moon: moonData };
}
