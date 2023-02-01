import Parse from 'parse/dist/parse.min.js';

export const initParse = () => {
  Parse.initialize(import.meta.env.VITE_APP_ID);
  Parse.serverURL = import.meta.env.VITE_SERVER_URL;
};
