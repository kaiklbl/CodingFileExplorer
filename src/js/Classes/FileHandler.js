export class FileHandler{

    constructor(){
        this.pre = window.api;
    }

    
    writeJsonFile = (data, path, file) =>{
        data = JSON.stringify(data, '', 4);
        let test = this.pre.pathJoin(this.pre.srcPath, path);
        let test2 = this.pre.pathJoin(test,file);
        this.pre.writeFile(test2, data);
    }

    
    readJsonFile = (path, file) =>{
        let test = this.pre.pathJoin(this.pre.srcPath, path);
        let test2 = this.pre.pathJoin(test, file);
        let data = this.pre.readFile(test2);
        data = JSON.parse(data);
        return data;
    }

    readTxtFile = (path, file) =>{
        let test = this.pre.pathJoin(this.pre.srcPath, path);
        let test2 = this.pre.pathJoin(test, file);
        let data = this.pre.readFile(test2);
        return data;
    }
}

/**
 * Json File schreiben
 * ReadFile Funktion
 */