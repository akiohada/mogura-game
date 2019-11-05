/***************************************************************
 * Descripsion: Learning Javascript Basics
 * Copyright: Shinsuke Matsuda xHack
 * Original Author: Shinsuke Matsuda xHack
 * Date Created: 2019-11-02
***************************************************************/

/******************** Initializing Process ********************/
const imgAna = "images/穴.png";
const imgItaiMogura = "images/モグ1.png";
const imgNormalMogura = "images/モグ2.png";
const initialCount = 5;
let currentCount = initialCount;
let level = 1;
let score = 0;
let appearedMoguras = 0;
let mogurasArr = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
let intervalCountDown;
let intervalDeruMogura;
let intervalKakureruMogura;

//カウンター要素を生成
const counter = document.getElementById("counter");
counter.textContent = currentCount + "秒間もぐらをたたけ！ Level: " + level;

//メッセージ要素を生成
const message = document.createElement("p");

//ボタン要素を生成
const buttons = document.getElementById("buttons");
const startButton = document.createElement("button");
startButton.innerHTML = "START";
startButton.classList.add("button");
startButton.onclick = buttonClick;
buttons.appendChild(startButton);
const goNextLevelButton = document.createElement("button");
goNextLevelButton.innerHTML = "Go to next Level";
goNextLevelButton.classList.add("button");
goNextLevelButton.onclick = buttonClick;

//container要素を生成
const moguraField = document.getElementById("moguraField");
for (let i = 0 ; i < mogurasArr.length ; i++) {
    const div = document.createElement("div");
    moguraField.appendChild(div);
    moguraField.lastElementChild.classList.add("container");
    //hole要素を生成
    for (let j = 0 ; j < mogurasArr[i].length ; j++) {
        const div = document.createElement("div");
        moguraField.lastElementChild.appendChild(div);
        const hole = moguraField.lastElementChild.lastElementChild;
        hole.classList.add("relative", "hole");
        //holeの子要素としてana画像要素を作成、クラスを付与、初期画像を設定
        const imgHole = document.createElement("img");
        hole.appendChild(imgHole);
        hole.lastElementChild.classList.add("ana");
        hole.lastElementChild.src = imgAna;
        //holeの子要素としてana画像要素を作成、クラスを付与、初期画像を設定、mogurasArr連携用xy属性を設定、クリックイベントを設定
        const imgMogura = document.createElement("img");
        hole.appendChild(imgMogura);
        const mogura = hole.lastElementChild;
        mogura.classList.add("mogura", "uwagaki");
        mogura.src = imgNormalMogura;
        mogura.setAttribute("x",i);
        mogura.setAttribute("y",j);
        mogura.onclick = hitMogura;
    }
}

/******************** Main Process ********************/
//カウントダウン
function countDown () {
    const count = currentCount
    if (count == initialCount + 1) {
        //console.log("countdown 1st");
        //resetMogura("", 0);
        currentCount = currentCount - 1;
        counter.classList.add("zoomOut");
        counter.textContent = "残り" + currentCount + "秒";
    } else if (count == 1) {
        currentCount = currentCount - 1;
        //console.log("countdown " + currentCount);
        counter.textContent = "TIME UP!";
        clearInterval(intervalCountDown);
        clearInterval(intervalDeruMogura);
        clearInterval(intervalKakureruMogura);
        setTimeout(resetMogura, 2100, imgItaiMogura, 1);
        setTimeout(closeGame, 2500);
    } else if (count > 1) {
        currentCount = currentCount - 1;
        //console.log("countdown " + currentCount);
        counter.textContent = "残り" + currentCount + "秒";
    }
}

//モグラが定期的に出現する
const moguras = document.getElementsByClassName("mogura");
function deruMogura(){
    console.log("deruMogura start");
    let mogura;
    let x;
    let y;
    //すでに出ているところには出現しない
    for (let i = 0;i < 99999; i++ ) {
        const rand = Math.floor(Math.random() * moguras.length);
        mogura = moguras[rand];
        x = mogura.getAttribute("x");
        y = mogura.getAttribute("y");
        if (mogurasArr[x][y] == 0) {
            break;
        }
    }
    mogura.classList.add("effect-fade");
    mogura.src = imgNormalMogura;
    mogurasArr[x][y] = 1;
    appearedMoguras++; 
    console.log("mogura arise at " + x + " - " + y + " Number " + appearedMoguras);
    setTimeout((mogura) => {
        kakureruMogura(mogura);
    }, 2000, mogura);
}

/******************** Sub Mogura Process ********************/
//モグラをリセット
function resetMogura (img, status) {
    const moguras = document.getElementsByClassName("mogura");
    //console.log("moguras number = " + moguras.length)
    let mogurasNum = 0;
    for (i = 0;i < mogurasArr.length;i++){ 
        for (j = 0;j < mogurasArr[i].length;j++){
            //console.log("mogurasArr value = " + mogurasArr[i][j]);
            mogurasArr[i][j] = status;
            moguras[mogurasNum].src = img;
            moguras[mogurasNum].classList.remove("effect-fade");
            //console.log("mogurasNum = " + mogurasNum);
            //console.log(moguras[mogurasNum].src);
            mogurasNum++;
        }
    }
}
    
//モグラが叩かれたら
function hitMogura(){
    const mogura = event.target;
    mogura.classList.remove("effect-fade");
    mogura.src = imgItaiMogura;
    score++;
    clearInterval(intervalKakureruMogura); //これを入れないと、通常の"2秒後隠れる処理"が残って重複しまう
    intervalKakureruMogura = setTimeout(kakureruMogura, 300, mogura);
}

//モグラが隠れる
function kakureruMogura(mogura){
    mogura.classList.remove("effect-fade");
    mogura.src = "";
    const x = mogura.getAttribute("x");
    const y = mogura.getAttribute("y");
    mogurasArr[x][y] = 0;
}

/******************** Event Handler ********************/
//ボタンが押された際の各処理
function buttonClick(){
    const button = event.target;
    if (button.innerHTML == "STOP") {
        clearInterval(intervalCountDown);
        clearInterval(intervalDeruMogura);
        startButton.innerHTML = "RESET";
    } else if (button.innerHTML == "RESET") {
        level = 1;
        setTimeout(resetGame, 2100);
        startButton.innerHTML = "wait a moment ...";
        message.textContent = "";
        if(counter.lastElementChild){
            counter.lastElementChild.parentNode.removeChild(counter.lastElementChild);
        }
        if(button.parentNode.lastElementChild.innerHTML == "Go to next Level"){
            button.parentNode.removeChild(button.parentNode.lastElementChild);
        }
    } else if (button.innerHTML == "START") {
        resetMogura("",0);
        currentCount++;
        setTimeout(() => {
            intervalCountDown = setInterval(countDown, 1000);
        }, 100);
        setTimeout(() => {
            intervalDeruMogura = setInterval(deruMogura, 1900 / level + 100 );
        }, 100);
        startButton.innerHTML = 'STOP';
    } else if (button.innerHTML == "Go to next Level") {
        setTimeout(resetGame, 2100);
        startButton.innerHTML = "wait a moment ...";
        message.textContent = "";
        if(counter.lastElementChild){
            counter.lastElementChild.parentNode.removeChild(counter.lastElementChild);
        }
        button.parentNode.removeChild(button);
    }
}

/******************** Reset/Close Process ********************/
//ゲーム再開示のリセット処理
function resetGame(){
    currentCount = initialCount;
    counter.textContent = currentCount + "秒間もぐらをたたけ！ Level: " + level;
    counter.classList.remove("zoomOut");
    score = 0;
    appearedMoguras = 0;
    resetMogura(imgNormalMogura, 0)
    startButton.innerHTML = "START";
}

//ゲーム終了時の処理
function closeGame(){
    counter.textContent = "あなたのスコアは" + score + "/" + appearedMoguras + "出てきました";
    if (score == appearedMoguras) {
        message.textContent = "PERFECT!!";
        counter.appendChild(message);
    }
    startButton.innerHTML = "RESET";
    level++;
    buttons.appendChild(goNextLevelButton);
}
