import dataOBJ from "./js/dataBase.js";
import {
  linesToArray,
  dataToSunPhases,
  addNSCDates,
} from "./sources/astropixels/index.js";
import {
  linesToData,
  dataToMoonPhases,
} from "./sources/calendario365/index.js";

let astroData = {
  sun: {},
  moon: {},
};

let config = {
  /**
   * @values ('json' | 'locale' | 'ms' | 'any' ) Output format of dates if not stablished beforehand
   */
  saveDatesAs: "ms",
};

// GLOBAL FUNCTIONS
function getTextLines(data) {
  return data.split("\n");
}

function addData(obj) {
  console.log({
    obj,
  });
  astroData = {
    ...astroData,
    ...obj,
  };
  return astroData;
}

function showData(dataToScreen, el) {
  const elData = el
    ? document.querySelector(`#${el}`)
    : document.querySelector("#data");

  elData.innerHTML = JSON.stringify(dataToScreen, null, 2);
  console.log({ dataToScreen });
  return dataToScreen;
}

/**
 * Loads the module and retrieves de info with the functions imported
 * Now it only gets data from 1 file per source
 * @param {String} module
 */
async function load(module) {
  console.log({ module });

  let { default: dataToObject } = await import(`./modules/${module}.js`);

  let newCode = new Promise((resolve, reject) => {
    let files = [];
    let filesArr = dataOBJ.sources[module]["files"];
    if (filesArr != undefined) {
      resolve(fetch(`${filesArr[0]}`));
    }
  });

  return await newCode
    .then((res) => {
      return res.text();
    })
    .then(getTextLines)
    //.then((linesToData)
    .then(dataToObject)
    .then((result) => {
      return result;
    });
}

/**
 * Collects the name of the sources
 * Loads the module for that source 'load(source)'
 */
let sourcesArr = [];
for (let source in dataOBJ.sources) {
  sourcesArr.push(load(source));
}

//const sourcesOBJ = {};
Promise.all(sourcesArr)
  .then(function (responses) {
    console.log({ responses });
    return responses;
  })
  .then((obj) => {
    console.log({ obj });
    showData(obj, "tests");
  });

// ----------------------------------------------------------------------------------------------
/**
 * Code to be replaced
 */

/**
 * Check all sources in dataOBJ object
 */
let files = [];
for (let source in dataOBJ.sources) {
  let filesArr = dataOBJ.sources[source]["files"];
  if (filesArr != undefined) {
    filesArr.forEach((url) => files.push(fetch(`${url}`)));
  }
}
Promise.all(files)
  .then(function (responses) {
    // returns a new array formed with .map()
    return Promise.all(
      responses.map(async function (response) {
        const url = response.url;
        const txt = await response.text();
        return {
          url,
          txt,
        };
      })
    );
  })
  .then(function (arr) {
    arr.forEach((doc) => {
      if (doc.url.includes("/astropixels/")) {
        let data = linesToArray(getTextLines(doc.txt));
        addData(addNSCDates(dataToSunPhases(data)));
      } else if (doc.url.includes("/calendario365/")) {
        let data = linesToData(getTextLines(doc.txt));
        addData(dataToMoonPhases(data));
      } else {
        console.log(`need new code to extract infor from:\n ${doc.url}`);
      }
    });
  })
  .catch(function (error) {
    // if there's an error, log it
    console.log(error);
  })
  .finally(() => {
    showData({
      astroData,
    });
  });
