"use strict";

import { WindowApi } from "./WindowApi.js";

export class FileHandler extends WindowApi{

    constructor(){
        super(WindowApi);
    }

    writeJsonFile = (data, path, file) =>{
        data = JSON.stringify(data, '', 4);
        let test = this.windowApi.pathJoin(this.windowApi.srcPath, path);
        let test2 = this.windowApi.pathJoin(test,file);
        this.windowApi.writeFile(test2, data);
    }

    readJsonFile = (path, file) =>{
        let test = this.windowApi.pathJoin(this.windowApi.srcPath, path);
        let test2 = this.windowApi.pathJoin(test, file);
        let data = this.windowApi.readFile(test2);
        data = JSON.parse(data);
        return data;
    }

    readTxtFile = (path, file) =>{
        let test = this.windowApi.pathJoin(this.windowApi.srcPath, path);
        let test2 = this.windowApi.pathJoin(test, file);
        let data = this.windowApi.readFile(test2);
        return data;
    }
}

/**
 * Json File schreiben
 * ReadFile Funktion
 */