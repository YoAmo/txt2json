export default {
    sources: {
      nodata: { },
      astropixels: {
        url: "http://astropixels.com/",
        files: [
          "./sources/astropixels/sun_2001-2050(equinox-solstice)(astropixels).txt",
          "./sources/astropixels/sun_2051-2100(equinox-solstice)(astropixels).txt",
        ],
      },
      calendario365: {
        url: "https://www.calendario-365.es/luna/lunar-fases.html",
        files: [
          "./sources/calendario365/moon_2020(calendario365).txt",
          "./sources/calendario365/moon_2021(calendario365).txt",
        ],
      },
    },
  }