import { WindowApi } from "./WindowApi.js";

export class Path extends WindowApi{

    currentPath;

    constructor(){
        super(WindowApi);
        this.currentPath = this.windowApi.getHomeDir();
    }


}