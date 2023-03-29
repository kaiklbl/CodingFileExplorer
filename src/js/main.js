const $ = data => document.querySelector(data);
const pre = window.api;

// -----------Seiten Variablen----------
const main = $('main');
// header
const backBtn = $('#back-btn');
const forwardBtn = $('#forward-btn');
const headerPath = $('.path');

// settings
const settings = $('.settings');
const settingsBox = $('.settings-box');
const settingsColorBtn = $('#color-btn');
const settingsFileDir = $('#dir-file');
const settingsModus = $('#modus-btn');

const colorBox = $('.color-box');
const colorBoxBack = $('#color-box-back');
const colorBoxApply = $('#color-box-apply');
const colorBoxStandart = $('#color-box-standart');

// colorBox inputs
const num1 = $('#num1');const num2 = $('#num2');const num3 = $('#num3');const num4 = $('#num4');
const num5 = $('#num5');const num6 = $('#num6');const num7 = $('#num7');const num8 = $('#num8');
const num9 = $('#num9');const num10 = $('#num10');const num11 = $('#num11');const num12 = $('#num12');
const num13 = $('#num13');const num14 = $('#num14');const num15 = $('#num15');const num16 = $('#num16');
const num17 = $('#num17');const num18 = $('#num18');
const header = $('header');
const body = $('body');
// --------

// folderAuswahl
const dirBox = $('.dir-box');
const dirBoxFolder = $('.dir-box-contents');
const dirBoxBack = $('#dir-box-back');
const dirBoxApply = $('#dir-box-apply');
const dirBoxStandart = $('#dir-box-standart');

const searchInput = $('#search');
const searchBtn = $('.search-btn');
const closeBtn = $('.close-btn');

const makeOptionsBtn = $('.makeOptions');
const advancedCodingDir = $('.advancedCodingDir');
const codingBoxes = $('.codingBoxes');
const createAdvancedCodingDirBtn = $('#createAdvancedCodingDirBtn');
const backfromAdvancedCodingDir = $('#backfromAdvancedCodingDir');

// footer
const plusBtn = $('#plus-btn');
const buttonMenu = $('.button-menu');
const makeDir = $('#makeDir');
const makeCodingDir = $('#makeCodingDir');
const makeFile = $('#makeFile');
const createBox = $('.create-box');

// FavoritenListe
const favBox = $('.fav-box');
const favBoxList = $('#fav-list-box');
const favBoxBack = $('#fav-box-back');


// AnfangsPfad / Aktueller Pfad
let currentPath = pre.getHomeDir();

let history = [];

// ---------------------------Allgemeine Funktionen---------------------
// blendent eines aus das andere ein
const displayBlockNone = (block, none) =>{
    block.style.display = 'block';
    none.style.display = 'none';
}

// WriteFile Funktion
const writeJsonFile = (data, path, file) =>{
    data = JSON.stringify(data, '', 4);
    let test = pre.pathJoin(pre.srcPath, path);
    let test2 = pre.pathJoin(test,file);
    pre.writeFile(test2, data);
}

// ReadFile Funktion
const readJsonFile = (path, file) =>{
    let test = pre.pathJoin(pre.srcPath, path);
    let test2 = pre.pathJoin(test, file);
    let data = pre.readFile(test2);
    data = JSON.parse(data);
    return data;
}

const readTxtFile = (path, file) =>{
    let test = pre.pathJoin(pre.srcPath, path);
    let test2 = pre.pathJoin(test, file);
    let data = pre.readFile(test2);
    return data;
}

// Farben ändern
const changeHtmlColors = (bodyColor, textColor, buttonColor, headerColor) =>{
    body.style.backgroundImage = bodyColor;
    body.style.color = textColor;
    plusBtn.style.backgroundColor = buttonColor;
    header.style.backgroundColor = headerColor;
}

body.addEventListener('contextmenu', ()=>{
    pre.openCmd(currentPath);
    pre.openWin(currentPath);
})
main.addEventListener('click', () =>{
    if (main.style.opacity != 1) {
        main.style.opacity = 1;
        plusBtn.innerHTML = '+';
        let noneList = [settingsBox, colorBox, dirBox, advancedCodingDir, buttonMenu, makeOptionsBtn, createBox, favBox];
        noneList.forEach(elem => elem.style.display = 'none');
    }
})

// -------------Beim Start erstellte Ordner/Files--------------
const createMain = () =>{
    main.innerHTML = "";
    pathSync(currentPath);

    // Alle Elemente aus Pfad hollen
    let dirs = pre.getDirContents(currentPath);
    let folders = getFoldersFiles();
    
    dirs.forEach(elem => {
        let div = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');

        // auf Symboltype zugreifen
        let type = elem[Object.getOwnPropertySymbols(elem)[0]] + ' ' + elem.name
        let typ3 = fileFolderImg(folders,type[0],img,elem.name);
        if(typ3) return;
        

        // Bei Ordnerdbclick in den Ordner rein und die main neu erstellen
        div.addEventListener('dblclick', e =>{
            if(type[0] == 1){
                pre.openFile(pre.pathJoin(currentPath, elem.name));
            }else{
                history.push(currentPath);
                currentPath = pre.pathJoin(currentPath, elem.name);
                createMain();
            } 
        })

        div.addEventListener('contextmenu', (e) =>{
            pre.openDir(currentPath, elem.name);
            pre.addFavorite(pre.pathJoin(currentPath, elem.name));
        })

        // wenn Name zu lange dann verkürze
        p.textContent = elem.name.length >= 15 ? elem.name.substring(0,15): elem.name;

        div.appendChild(img);
        div.appendChild(p);
        main.appendChild(div);
    });

}


const getFoldersFiles = () =>{
    let test = pre.pathJoin(pre.srcPath, 'data');
    let folders = pre.readFile(pre.pathJoin(test, 'folder.json'));
    folders = JSON.parse(folders);
    return folders;
}

const fileFolderImg = (folders,type,img,elem) =>{
    // Überprüfung ob file oder Ordner
    if(type == 1 ){
        img.src = folders.file;
    } else if(type == 2){
        img.src = folders.dir;
        
        // überprüfung auf Zugriffsrechte
        try {
            pre.getDirContents(pre.pathJoin(currentPath,elem)).forEach(file => {
              try {
                pre.fileAccess(pre.pathJoin(currentPath,elem), file);
              } catch (error) {
                return true;
              }
            });
          } catch (error) {
            return true;
          }

        // Sucht ob im Ordner coding Datei sind falls ja ersetze das Bild 
        let codingFolder = pre.getDirContents(pre.pathJoin(currentPath, elem));
        codingFolder.forEach(ele => {
            if(ele.name.includes('.html') || ele.name.includes('.css') || ele.name.includes('.js')){
                img.src = folders.codingDir;
            }
        });
    }else{
        return true;
    }
    img.title = elem;

    return false;
}


// ------------------------------------header Sachen---------------------------------
// Einen Pfad zurück
const pathBack = () =>{
    history.push(currentPath);
    currentPath = pre.pathJoin(currentPath, "../");
    createMain();
}

// gespeicherte History back
const historyBack = () =>{
    if(history.length != 0){
        let newPath = history.pop();
        currentPath = newPath;
        createMain();
    }
}

// header Pfad aktuell halten
const pathSync = currentPath => {
    let sub = 0;
    let hPath = '';
    if(currentPath.length > 85){
        sub = currentPath.length - 85;
    }
    hPath = currentPath.substring(sub,currentPath.length);
    headerPath.innerHTML = hPath;
}

forwardBtn.addEventListener('click', historyBack);
backBtn.addEventListener('click', pathBack);


// ---------------------------------Settings
const showSettings = () =>{
    if(settingsBox.style.display == 'block'){
        settingsBox.style.display = 'none';
        colorBox.style.display = 'none'
        main.style.opacity = 1;
    }else{
        settingsBox.style.display = 'block';
        main.style.opacity = 0.4;
    }
}
settings.addEventListener('click',showSettings);


// -------------------------------color
// Alte num Inputs aus File auslesen
const getOldNumInputs = () =>{
    let test = pre.pathJoin(pre.srcPath, 'data');
    let nums = pre.readFile(pre.pathJoin(test, 'num.json'));
    nums = JSON.parse(nums);
    return nums;
}

// Alle Inputs mit den alten Werten aufüllen
const giveOldNumValues = (nums,numList) =>{
    let counter = 0;
    for (let i in nums) {
        numList[counter].value = nums[i]
        counter++;
    }
}

// colorBox anzeigen / ausblenden / getOldNumValues / giveOldNumValues
const showColorBox = () =>{
    colorBox.style.display == 'block' ? displayBlockNone(settingsBox,colorBox):displayBlockNone(colorBox,settingsBox);
    let nums = getOldNumInputs();
    let numList = [num1,num2,num3,num4,num5,num6,num7,num8,num9,num10,num11,num12,num13,num14,num15,num16,num17,num18];
    giveOldNumValues(nums,numList);
}

// Eigenen Farben holln
const ownColors = () =>{
    let test = pre.pathJoin(pre.srcPath, 'data');
    let colors = pre.readFile(pre.pathJoin(test, 'color.json'));
    colors = JSON.parse(colors);
    return colors.colors;
}

// Eigene Farben setzten
const setOwnColor = () =>{
    let colors = ownColors();
    changeHtmlColors(colors.body,colors.text,colors.button,colors.header);
}

// setzt die neuen num werte
const setNumInputs = (...arg) =>{
    let nums = {
        num1 : arg[0][0].value,
        num2 : arg[0][1].value,
        num3 : arg[0][2].value,
        num4 : arg[0][3].value,
        num5 : arg[0][4].value,
        num6 : arg[0][5].value,
        num7 : arg[0][6].value,
        num8 : arg[0][7].value,
        num9 : arg[0][8].value,
        num10 : arg[0][9].value,
        num11 : arg[0][10].value,
        num12 : arg[0][11].value,
        num13 : arg[0][12].value,
        num14 : arg[0][13].value,
        num15 : arg[0][14].value,
        num16 : arg[0][15].value,
        num17 : arg[0][16].value,
        num18 : arg[0][17].value,
    }
    writeJsonFile(nums,'data','num.json');
}

// Farbe wechseln und in color.json speichern
const colorChange = () =>{
    let numList = [num1,num2,num3,num4,num5,num6,num7,num8,num9,num10,num11,num12,num13,num14,num15,num16,num17,num18];
    for (let i = 0; i < numList.length; i++) {
        if (numList[i].value > 255) {
            numList[i].value = 255
        }
    }

    let data = {
        colors : {
            body: `linear-gradient(rgb(${num1.value},${num2.value},${num3.value}),rgb(${num4.value},${num5.value},${num6.value}))`,
            header: `rgb(${num16.value},${num17.value},${num18.value})`,
            button: `rgb(${num10.value},${num11.value},${num12.value})`,
            buttonHover: `rgb(${num13.value},${num14.value},${num15.value})`,
            text: `rgb(${num7.value},${num8.value},${num9.value})`
        }
    }
    changeHtmlColors(data.colors.body,data.colors.text,data.colors.button,data.colors.header);
    writeJsonFile(data,'data','color.json');
    setNumInputs(numList);
}

// setzt die StandartColor werte
const standartColor = () =>{
    let test = pre.pathJoin(pre.srcPath, 'data');
    let test2 = pre.readFile(pre.pathJoin(test, 'standart.json'));
    let standartColor = JSON.parse(test2);

    let data = {
        colors : {
            body: standartColor[0].colors.body,
            header: standartColor[0].colors.header,
            button: standartColor[0].colors.button,
            buttonHover: standartColor[0].colors.buttonHover,
            text: standartColor[0].colors.text
        }
    }
    writeJsonFile(data,'data','color.json');
    setOwnColor();
}

settingsColorBtn.addEventListener('click', showColorBox);
colorBoxBack.addEventListener('click', () => displayBlockNone(settingsBox, colorBox));
colorBoxApply.addEventListener('click', colorChange);
colorBoxStandart.addEventListener('click', standartColor);

// butten events für :hover
plusBtn.addEventListener('mouseenter', () =>{
    color = ownColors();
    plusBtn.style.backgroundColor = color.buttonHover;
})
plusBtn.addEventListener('mouseleave', () =>{
    color = ownColors();
    plusBtn.style.backgroundColor = color.button;
})

// --------------------------File/Ordner auswahl---------------------
// um dirBox anzeigen und ausblenden
const showDirBox = () =>{
    dirBox.style.display == 'block'?displayBlockNone(settingsBox,dirBox):displayBlockNone(dirBox,settingsBox);
    createDirBoxContent();
}

// Erzeugt die verschiedenen folders zum auswählen
const createDirBoxContent = () =>{
    dirBoxFolder.innerHTML = '';
    let dirs = readJsonFile('data','folderImg.json');
    
    // jeden img ein Bild aus den Daten geben und in div anhängen
    for (let folderPack in dirs) {
        let div = document.createElement('div');
        for (let prop in dirs[folderPack]) {
            let img = document.createElement('img');
            img.src = dirs[folderPack][prop];
            div.appendChild(img);
        }
        // Wenn click speicher Daten in Json und änder backgroundColor
        div.addEventListener('click', ()=>{
            let folder = {
                file: dirs[folderPack].file,
                codingDir: dirs[folderPack].codingFolder,
                dir: dirs[folderPack].folder
            }
            writeJsonFile(folder, "data","folder.json");

            for (let i = 0; i < dirBoxFolder.children.length; i++) {
                dirBoxFolder.children[i].style.backgroundColor = '#ececec';
            }
            div.style.backgroundColor = 'rgb(196, 196, 196)';
        })
        dirBoxFolder.appendChild(div);
      }
}

// übernimmt die geenderten folder
const applyDirBox = () =>{
    dirBox.style.display = 'none';
    settingsBox.style.display = 'none';
    main.style.opacity = 1;
    createMain()
}

// auf Standart zurückstellen
const standartFolderFiles = () =>{
    let standartFolder = readJsonFile('data','standart.json');
    standartFolder = standartFolder[0].folder;
    writeJsonFile(standartFolder,"data","folder.json");
    createMain();
}

settingsFileDir.addEventListener('click', showDirBox);
dirBoxBack.addEventListener('click', () => displayBlockNone(settingsBox, dirBox));
dirBoxApply.addEventListener('click', applyDirBox);
dirBoxStandart.addEventListener('click', standartFolderFiles);



// -------------------------Favoriten-------------------
let favList = [];

const showFavBox = () =>{
    if(favBox.style.display == 'block'){
        favBox.style.display = 'none';
        main.style.opacity = 1;
        searchInput.value = '';
    }else{
        favBox.style.display = 'block';
        main.style.opacity = 0.4;
    }
}

const deleteFav = name =>{
    let newFavList = favList.filter(elem => elem.name != name);
    favList = newFavList;
    console.log(favList);
    createFavListBox();
    writeJsonFile(favList, 'data', 'favoriten.json');
    readFavorite();
}

const createFavListBox = () =>{
    favBoxList.innerHTML = "";
    favList.forEach(elem =>{
        let outerDiv = document.createElement('div');
        let nameDiv = document.createElement('div');
        let btnDiv = document.createElement('div');

        nameDiv.textContent = elem.name;
        btnDiv.textContent = 'löschen';

        btnDiv.addEventListener('click', () =>{
            deleteFav(elem.name);
        })

        outerDiv.addEventListener('dblclick', () =>{
            history.push(currentPath);
            currentPath = elem.path;
            showFavBox();
            createMain();
        })

        outerDiv.appendChild(nameDiv);
        outerDiv.appendChild(btnDiv);
        favBoxList.appendChild(outerDiv);
    })
}

const readFavorite = () =>{
    favList = readJsonFile('data','favoriten.json');
}

const createFavorite = (favDir, input) =>{
    let favoriteObj = {path: favDir, name: input.value};
    let check = favList.find(elem => elem.name == input.value);
    if(check == undefined){
    favList.push(favoriteObj);
    console.log(favList);
    writeJsonFile(favList, 'data', 'favoriten.json');
    readFavorite();
    } else{
        console.log("Gibts schon");
        // TODO: gscheite es gibt scho meldung
    }
}

favBoxBack.addEventListener('click', showFavBox);


// -----------------------------------File Suche
const searchDirFile = () =>{
    let dirs = pre.getHomeDir();
    let searched = [];

    const getContent = (dir, current) =>{

        dir = pre.getDirContents(current);

        // geh durch alle dir elems
        for (let elem = 0; elem < dir.length; elem++) {
            
            type = dir[elem][Object.getOwnPropertySymbols(dir[elem])[0]];

            // Objekt erstelln für gefundene Items
            if (dir[elem].name.includes(searchInput.value)) {

                let listObject = {
                    listPath: pre.pathJoin(current, dir[elem].name),
                    listType: type
                };
                
                searched.push(listObject);
            }

            // Falls es eine Datei is überspringe den Durchlauf
            if(type == 1){
                continue;
            } // Falls Datei ändere Pfad und mach funktion Nochmal
            else if(type == 2){
                current = pre.pathJoin(current, dir[elem].name);
                getContent(dir[elem], current)
            } // Falls SystemDatei überspringe den Durchlauf
            else if(type == 3){
                continue;
            } // Falls es nix mehr gibt geh in den Vohrigen Pfad zurück
            else{
                current = pre.pathJoin(current, '../');
                continue;
            }
            // Weiß nicht ob das benötigt wird 
            current = pre.pathJoin(current, '../');
        }
    }
    
    getContent(dirs, currentPath);
    let folders = getFoldersFiles();
    main.innerHTML = '';

    searched.forEach(elem => {
        let div = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');
        
        // Überprüfung ob file oder Ordner
        if(elem.listType == 1 ){
            img.src = folders.file;
        } else if(elem.listType == 2){
            img.src = folders.dir;
            
            // Sucht ob im Ordner coding Datei sind falls ja ersetze das Bild 
            let codingFolder = pre.getDirContents(elem.listPath);
            codingFolder.forEach(ele => {
                if(ele.name.includes('.html') || ele.name.includes('.css') || ele.name.includes('.js')){
                    img.src = folders.codingDir;
                }
            });
        }else{
            return;
        }
        img.title = elem.listPath;
        
//      Weiß noch nicht ob benötigt wird
        div.setAttribute('data', elem.listPath);

        // Bei Ordnerdbclick in den Ordner rein und die main neu erstellen
        div.addEventListener('dblclick', e =>{
            if(type[0] == 1){
                pre.openFile(elem.listPath);
            }else{
                currentPath = elem.listPath;
                createMain();
            } 
        })

        // wenn Name zu lange dann verkürze
        const getLastElement = path => {
            let pathElements = path.split(/[/\\]/);
            return pathElements.pop();
          }
          let lastPath = getLastElement(elem.listPath);
        p.textContent = lastPath.length >= 15 ? lastPath.substring(0,15): lastPath;

        div.appendChild(img);
        div.appendChild(p);
        main.appendChild(div);
    });

}

const searchBtnFun = () =>{
    if (searchInput.value == '#favlist') {
        showFavBox();
        createFavListBox();
    }
    else if(searchInput.value[0] == '#'){
        let input = searchInput.value.substring(1);
        let fav = favList.find(elem => elem.name == input);
        history.push(currentPath);
        currentPath = fav.path
        searchInput.value = '';
        createMain();
    }else{
        searchDirFile();
    }
}

searchBtn.addEventListener('click', searchBtnFun);
searchInput.addEventListener('keyup', (e) =>{
    if(e.key == 'Enter'){
        searchBtnFun();
    }
})



// Close Button -- beendet das Programm
closeBtn.addEventListener('click',() => pre.appQuit());

// --------------------------------------footer-----------------------------------------
// Styles von: buttonMenu.display / main.opacity / plusBtn.innerHtml
const backPlusMenu = (btnMenu, opacity, plusOrMinus) =>{
    buttonMenu.style.display = btnMenu;
    makeOptionsBtn.style.display = btnMenu;
    main.style.opacity = opacity;
    plusBtn.innerHTML = plusOrMinus;
}
const createPlusBtnMenu = () =>{
    let folders = getFoldersFiles();
    let list = [makeFile,makeCodingDir,makeDir];
    let text = ['Datei erstellen','Coding Ordner erstellen','Ordner erstellen'];
    counter = 0;
    for(let key in folders){
        list[counter].innerHTML = '';
        let img = document.createElement('img');
        let span = document.createElement('span');

        img.src = folders[key];
        span.textContent = text[counter];

        list[counter].appendChild(img);
        list[counter].appendChild(span);

        counter++;
    }
}

// Plus Button menu auf und zu machen
plusBtn.addEventListener('click',() => {
    if(plusBtn.innerHTML == '-'){
        backPlusMenu('none', 1, '+');
        createBox.style.display = 'none';
    }else{
        backPlusMenu('flex', 0.4, '-');
        createPlusBtnMenu();
    }
})


// advanced Coding Dir
let advancedSafe = '';
let advancedCodingList = ['Electron App', 'Scss/Ts'];
const createAdvancedCodingDirs = () =>{
    codingBoxes.innerHTML = '';
    let folder = getFoldersFiles().codingDir;
    
    advancedCodingList.forEach(elem =>{
        let div = document.createElement('div');
        let img = document.createElement('img');
        let span = document.createElement('span');

        img.src = folder;
        span.textContent = elem;

        div.addEventListener('click', ()=>{
            for (let i = 0; i < codingBoxes.children.length; i++) {
                codingBoxes.children[i].style.backgroundColor = '#ececec';
            }
            div.style.backgroundColor = 'rgb(196, 196, 196)';
            advancedSafe = elem;
        })

        div.appendChild(img);
        div.appendChild(span);
        codingBoxes.appendChild(div);
    })
}


makeOptionsBtn.addEventListener('click', () =>{
    backPlusMenu('none',0.4, '-');
    advancedCodingDir.style.display = 'block';
    createAdvancedCodingDirs(); 
})
createAdvancedCodingDirBtn.addEventListener('click', ()=>{
    showCreateBox(advancedSafe);
    advancedCodingDir.style.display = 'none';
})
backfromAdvancedCodingDir.addEventListener('click', () =>{
    advancedCodingDir.style.display = 'none';
    backPlusMenu('none',1, '+');
})

// --------Plus Menu Buttons
// Nach Ordner/File erstellen main anzeigen
const createBoxFun = () =>{
    backPlusMenu('none', 1, '+');
    createBox.style.display = 'none';
    createMain();
}


const checkIfExists = (input) =>{
    let arr = pre.getDirContents(currentPath);
    let result = arr.find(elem => {
        return elem.name === input;
      });
    return result;
}
// Ordner Namen schon vergeben?
const checkIfCorrect = (input) =>{
    let check = checkIfExists(input);
    if(check != undefined) {
        pre.Notification('Fehler',`"${input}" existiert schon`);
        return true;
    }
    if(input.length < 1){
        pre.Notification('Fehler',`Der Name ${input} ist zu kurz.`);
        return true;
    }
    return false;
}


// Ordner/File erstellen
const createDirOrFile = (p,input, option) =>{
    if(p.innerHTML == 'Ordner'){
        let isGooood = checkIfCorrect(input);
        if(isGooood) return;
        pre.mkDir(currentPath, input)
    }else if(p.innerHTML == 'File'){
        let isGooood = checkIfCorrect(input);
        if(isGooood) return;
        pre.mkFile(currentPath, input ,option);
    } 
    createBoxFun();
}

// Mach einen CodingOrdner mit der übergebenen Liste
const createCodingDir = (input, testList) =>{
    const folderFile = (file) =>{
        pre.mkDir(currentPath, file);
        currentPath = pre.pathJoin(currentPath, file);
    }
    let isGooood = checkIfCorrect(input);
        if(isGooood) return;

    pre.mkDir(currentPath, input);
    currentPath = pre.pathJoin(currentPath, input);
    if (testList.includes('.html')) {
        createHtml(testList);
    }
    if (testList.includes('.txt')) {
        createTxt();
    }
    if(testList.includes('.css')){
        folderFile('css');
        createCss()
        currentPath = pre.pathJoin(currentPath, "../");
    }
    if(testList.includes('.js')){
        folderFile('js');
        createJs();
        currentPath = pre.pathJoin(currentPath, "../");
    }
    if(testList.includes('.ts')){
        folderFile('ts');
        pre.mkFile(currentPath, 'main' ,'.ts');
        currentPath = pre.pathJoin(currentPath, "../");
    }
    if(testList.includes('.php')){
        pre.mkFile(currentPath, 'index' ,'.php');
    }
    if(testList.includes('.scss')){
        folderFile('scss');
        pre.mkFile(currentPath, 'style' ,'.scss');
        currentPath = pre.pathJoin(currentPath, "../");
    }
    if(testList.includes('dbconfig')){
        folderFile('dbconfig');
        createDbConfig();
        currentPath = pre.pathJoin(currentPath, "../");
    }
    currentPath = pre.pathJoin(currentPath, "../");
    createBoxFun();
}

const createElectronApp = (input) =>{
    let isGooood = checkIfCorrect(input.value);
        if(isGooood) return;
     
    pre.mkDir(currentPath, input.value);
    currentPath = pre.pathJoin(currentPath, input.value);
    createAppJs();
    createPreloadJs();
    createReadmeAppJs();
    createCodingDir('public', ['.html','.css','.js']);
}

const createScssTs = (input) =>{
    createCodingDir(input.value, ['.scss', '.ts']);
    currentPath = pre.pathJoin(currentPath, input.value);
    createCodingDir('public',['.html','.css','.js']);
}


// Create Box erzeugen und mit Inhalten befüllen
const showCreateBox = (name, favDir = '') =>{
    makeOptionsBtn.style.display = 'none';
    main.style.opacity = 0.4;
    createBox.innerHTML = '';
    displayBlockNone(createBox,buttonMenu);

    let p = document.createElement('p');
    p.textContent = name;

    //  Elemente Erzeugen in createBox bei /Ordner/File
    // Ordner
    if(p.textContent == 'Ordner'){
        let input = document.createElement('input');
        let button = document.createElement('button');
        button.textContent = 'erstellen';
        button.addEventListener('click', ()=>createDirOrFile(p,input.value, ''));
        createBox.appendChild(p);
        createBox.appendChild(input);
        createBox.appendChild(button);
    } 
    // File
    else if(p.textContent == 'File'){
        let input = document.createElement('input');
        let button = document.createElement('button');
        let select = document.createElement('select');

        // Dokument typen / an die option übergeben
        let fileTypes = ['.html','.css','.js','.txt','.php','.scss','.ts', '.py' ];
        fileTypes.forEach(type => {
            let option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });

        button.textContent = 'erstellen';
        button.addEventListener('click', ()=>createDirOrFile(p,input.value, select.value));
        createBox.appendChild(p);
        createBox.appendChild(input);
        createBox.appendChild(select);
        createBox.appendChild(button);
    }
    // CodingOrdner
    else if(p.textContent == 'CodingOrdner'){
        let fileTypes = ['.html','.css','.scss','.js', '.ts','.txt', '.php','dbconfig' ];
        let input = document.createElement('input');
        let div = document.createElement('div');
        let button = document.createElement('button');
        
        createBox.appendChild(p);
        createBox.appendChild(input);

        let testList = [];

        // Für jeden fileType eine Eigene checkBox
        fileTypes.forEach(file => {
            let checkBox = document.createElement('input');
            let label = document.createElement('label');
            let br = document.createElement('br');
            label.textContent = file + ": ";
            label.htmlFor = file;
            checkBox.type = "checkbox";
            checkBox.name = file;
            div.appendChild(label);
            div.appendChild(checkBox);
            div.appendChild(br);

            // Filetypen an testList übergeben :: TODO umbenenen
            checkBox.addEventListener('click', (e) =>{
                if(testList.includes(file)){
                    testList.splice(testList.indexOf(file),1);
                }else{
                    testList.unshift(file);
                }
                
            })
        });

        button.addEventListener('click', () => createCodingDir(input.value, testList));
        button.textContent = 'erstellen';
        createBox.appendChild(div);
        createBox.appendChild(button);
    }else if(p.textContent == 'Favoriten'){
        let input = document.createElement('input');
        let button = document.createElement('button');
        button.textContent = 'hinzufügen';
        button.addEventListener('click', ()=>{
            createFavorite(favDir, input);
            createBoxFun();
        });
        createBox.appendChild(p);
        createBox.appendChild(input);
        createBox.appendChild(button);
    }else{
        let input = document.createElement('input');
        let button = document.createElement('button');
        button.textContent = 'erstellen';
        button.addEventListener('click', ()=>{
            switch(p.textContent){
                case 'Electron App':
                    createElectronApp(input);
                break;
                case 'Scss/Ts':
                    createScssTs(input);
                break;
                default:
                    pre.Notification('Glückwunsch', 'Sie haben das Programm gecracket');
            }
        })
        createBox.appendChild(p);
        createBox.appendChild(input);
        createBox.appendChild(button);
    }
}

// plus button menü button 
makeDir.addEventListener('click', () =>showCreateBox('Ordner'));
makeFile.addEventListener('click', () =>showCreateBox('File'));
makeCodingDir.addEventListener('click', () =>showCreateBox('CodingOrdner'));


// ----------------------Inhalte für Files von Templates holln 
const createHtml = (testList) =>{
    if(testList.includes('.js') && testList.includes('.css')){
        var path = 'htmlCssJs.txt';
    } else if(testList.includes('.js')){
        var path = 'htmlJs.txt';
    } else if(testList.includes('.css')){
        var path = 'htmlCss.txt';
    } else{
        var path = 'html.txt';
    }

    let data = readTxtFile('templates', path);

    pre.mkFile(currentPath, 'index' ,'.html', data);
}
const createTxt =  () =>{
    let data = readTxtFile('templates', 'text.txt');
    pre.mkFile(currentPath, 'help' ,'.txt', data);
}
const createJs = () =>{
    let data = readTxtFile('templates', 'js.txt');
    pre.mkFile(currentPath, 'main' ,'.js', data);
}
const createCss = () =>{
    let data = readTxtFile('templates', 'css.txt');
    pre.mkFile(currentPath, 'style' ,'.css', data);
}
const createDbConfig = () =>{
    let data = readTxtFile('templates', 'dbconfig.txt');
    pre.mkFile(currentPath, 'dbconfig' ,'.php', data);
}
const createAppJs = () =>{
    let data = readTxtFile('templates', 'appJs.txt');
    pre.mkFile(currentPath, 'app', '.js', data);
}
const createPreloadJs = () =>{
    let data = readTxtFile('templates', 'preloadJs.txt');
    pre.mkFile(currentPath, 'preload', '.js', data);
}
const createReadmeAppJs = () =>{
    let data = readTxtFile('templates', 'readmeAppJs.txt');
    pre.mkFile(currentPath, 'README', '.txt', data);
}



readFavorite();
setOwnColor();
createMain();