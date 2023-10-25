"use strict";

export class WindowApi{

    windowApi = window.api;

    constructor() {
        if (new.target === WindowApi) {
          throw new Error("Abstrakte Klassen können nicht instanziiert werden.");
        }
      }
}