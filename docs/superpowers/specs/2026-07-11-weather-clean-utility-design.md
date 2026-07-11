# Weather Clean Utility Design

Goal: improve the weather app as a fast, readable utility and fix city search.

Design read: redesign of a weather web app for everyday users, with a polished consumer utility language, using the existing React, Vite, Ant Design stack.

Dials: variance 5, motion 3, density 5.

Scope:
- Keep the current routes and OpenWeatherMap data flow.
- Replace the heavy background image with lightweight CSS atmosphere.
- Improve the home search area, favorites, current weather card, and detail grid.
- Fix search so duplicate city names are selectable and Enter can choose the first result.
- Keep Vercel static deployment settings intact.

Constraints:
- No new UI framework.
- Keep Ant Design.
- Keep Russian visible copy.
- Keep dark and light themes.
- Build must pass with `npm run build`.
