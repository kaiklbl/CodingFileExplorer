import { WindowApi } from "./WindowApi";

export class History extends WindowApi{

    history = [];

    constructor(){
        super(WindowApi);
    }

    addToHistory(path){
        this.history.push(path);
    }
}