# gm-prioritization-matrix

### Prioritization Matrix Prototype

Frontend prototype to experiment with animations/behaviors for the Prioritization Matrix Guided Method. The prototype is currently live [here](https://neo-283.getforge.io/).

There is a "live" version of the prototype [here](https://live-priority-gm.getforge.io/) as well, which pulls submitted form data from Jotform. The code for that version is in the `live-version` branch of this repo.

There is a bit of dead code in this repo since it was built quickly, the main files to look at are `ScrollMagic.tsx` (which defines the intro screens and intro and scrolling animations), `ScrollMagicLive.tsx` (which wraps the `ScrollMagic` component and fetches data from Jotform), and `Graph.tsx`, which renders the graph of avatars.

The standard deviation logic (which there was some discussion of updating), happens here: https://github.com/tactivos/gm-prioritization-matrix/blob/main/src/ScrollMagic.jsx#L148

This prototype is built with React, Tailwind,[GreenSock](https://greensock.com/docs/), and Vite. To run:

```
npm install
npm run dev
```

To create a new build, run `npm run build` and the `/dist` folder will be updated with the build files.
