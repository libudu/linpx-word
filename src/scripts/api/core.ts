import { uiApi } from "..";

export const globalCore = {
  restart: () => {
    uiApi.restart();
  },
};