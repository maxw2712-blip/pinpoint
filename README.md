# Pinpoint

A geography and history game in a single web page: find modern countries and the realms of ten historical periods
(1500 BCE to 1960), physical features and flags, date historical maps by year, and answer history and global-security
questions. It includes a daily challenge, a mastery map and an Explore mode.

**Play:** https://maxw2712-blip.github.io/pinpoint/

## Building

`src/` is the source. `python3 build.py` (no dependencies) inlines it into the self-contained `pinpoint.html`.
A Planets mode (Mars, the Moon, Venus) is archived: `python3 build.py --planets` builds the game with it.
Tests are jsdom simulations in `tests/` (`cd tests && npm install && node sim_explore.js`, and so on).

## Licence

Copyright (C) 2026 Max Wilford.

Pinpoint is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See [LICENSE](LICENSE) for the full text.

The game is GPL-3.0 because it includes the historical border data below.

## Third-party data

| Material | Source | Licence |
|---|---|---|
| Historical borders | [historical-basemaps](https://github.com/aourednik/historical-basemaps) by Ágoston Nagy and Andre Ourednik, simplified | GPL-3.0 |
| Modern borders, physical features, shaded relief | [Natural Earth](https://www.naturalearthdata.com/) (modern borders via world-atlas) | Public domain |
| Modern flags | [flag-icons](https://github.com/lipis/flag-icons) | MIT |
| Historical flags | Wikimedia Commons, mostly public domain; some CC BY-SA 4.0 and five CC BY-SA 3.0, each credited in the game's "Credits and sources"; a few drawn for this project | As credited |
| City lights | NASA, Earth's City Lights (DMSP, 1994–95) | Public domain |
| Planet textures (archived mode, only in a `--planets` build) | threex.planets (NASA mission data) | See source |
| Libraries (loaded from a CDN) | [D3](https://d3js.org/) 7.9.0, [topojson-client](https://github.com/topojson/topojson-client) 3.1.0 | ISC |

Note: CC BY-SA 3.0 is not formally compatible with GPL-3.0. The five CC BY-SA 3.0 flags (Nejd and Hasa 1914, Tunis
before 1831, Oudh, Nepal before 1962, Spain 1785–1931) are kept under their own licence and credited individually.

Realm names, capitals and regions for the historical maps were written for this game and are checked in
`docs/pinpoint_realms.xlsx`; corrections are welcome.
