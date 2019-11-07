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
const kakureruTime = 2000;
const initialCount = 10;
let currentCount = initialCount;
let level = 1;
let score = 0;
let appearedMoguras = 0;
let mogurasArr = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
//ここでinterval系を宣言しておかないとクリア処理できない・・?
let intervalCountDown;
let intervalDeruMogura;
let intervalKakureruMogura;

//カウンター要素を生成
const counter = document.getElementById("counter");
const counterText = document.createElement("div");
counterText.textContent = currentCount + "秒間もぐらをたたけ！ Level: " + level;
counterText.classList.add("counterText");
counter.appendChild(counterText);

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
    const row = document.createElement("div");
    row.classList.add("container");
    moguraField.appendChild(row);
    //hole要素を生成
    for (let j = 0 ; j < mogurasArr[i].length ; j++) {
        let hole = document.createElement("div");
        hole.classList.add("relative", "hole");
        moguraField.lastElementChild.appendChild(hole);
        hole = moguraField.lastElementChild.lastElementChild;
        //holeの子要素としてana画像要素を作成、クラスを付与、初期画像を設定
        const imgHole = document.createElement("img");
        imgHole.classList.add("ana");
        imgHole.src = imgAna;
        hole.appendChild(imgHole);
        //holeの子要素としてmogura画像要素を作成、クラスを付与、初期画像を設定、mogurasArr連携用xy属性を設定、クリックイベントを設定
        const imgMogura = document.createElement("img");
        imgMogura.classList.add("mogura", "uwagaki");
        imgMogura.src = imgNormalMogura;
        imgMogura.setAttribute("x",i);
        imgMogura.setAttribute("y",j);
        imgMogura.onclick = hitMogura;
        hole.appendChild(imgMogura);
    }
}

/******************** Main Process ********************/
//カウントダウン
function countDown() {
    //スタート押して1秒タイムラグを作る
    if (currentCount === initialCount + 1) {
        currentCount = currentCount - 1;
        counterText.classList.add("zoomOut");
        counterText.textContent = "START!!!";
    //通常のカウントダウン処理
    } else if (currentCount > 4) {
        currentCount = currentCount - 1;
        counterText.textContent = "残り" + currentCount + "秒";
    } else if (currentCount > 1) {
        currentCount = currentCount - 1;
        counterText.classList.add("alert");
        counterText.textContent = "残り" + currentCount + "秒";
    //終了
    } else if (currentCount === 1) {
        currentCount = currentCount - 1;
        counterText.textContent = "TIME UP!"; //ここだけアニメーションが効くのはなぜ・・？
        counter.appendChild(counterText);
        clearInterval(intervalCountDown);
        clearInterval(intervalDeruMogura);
        clearInterval(intervalKakureruMogura);
        setTimeout(resetMogura, kakureruTime + 100, imgItaiMogura, 1);
        setTimeout(closeGame, kakureruTime + 100);
    }
}

//モグラが定期的に出現する
const moguras = document.getElementsByClassName("mogura");
function deruMogura() {
    let mogura;
    let x;
    let y;
    //すでに出ているところには出現しない
    for (let i = 0;i < 999; i++) {
        const rand = Math.floor(Math.random() * moguras.length);
        mogura = moguras[rand];
        x = mogura.getAttribute("x");
        y = mogura.getAttribute("y");
        if (mogurasArr[x][y] === 0) {
            break;
        }
        //998回ったらおそらくモグラがいっぱいの状況なので関数を終了する
        if (i === 998) {
            return;
        }
    }
    mogura.classList.add("effect-fade");
    mogura.src = imgNormalMogura;
    mogurasArr[x][y] = 1;
    console.log("deta " + x + ", " + y);
    appearedMoguras++; 
    setTimeout((mogura) => { kakureruMogura(mogura); }, kakureruTime, mogura);
}

/******************** Sub Mogura Process ********************/
//モグラをリセット
function resetMogura(img, status) {
    const moguras = document.getElementsByClassName("mogura");
    let mogurasNum = 0;
    for (i = 0;i < mogurasArr.length;i++){ 
        for (j = 0;j < mogurasArr[i].length;j++){
            mogurasArr[i][j] = status;
            moguras[mogurasNum].src = img;
            mogurasNum++;
        }
    }
}
    
//モグラが叩かれたら
function hitMogura() {
    const mogura = event.target;
    mogura.classList.remove("effect-fade");
    mogura.src = imgItaiMogura;
    console.log("tataita " + mogura.getAttribute("x") + ", " + mogura.getAttribute("y"));
    score++;
    clearInterval(intervalKakureruMogura); //これを入れないと、通常の"2秒後隠れる処理"が残って下記の隠れる処理と重複しまう
    intervalKakureruMogura = setTimeout(kakureruMogura, 200, mogura);
}

//モグラが隠れる
function kakureruMogura(mogura) {
    mogura.classList.remove("effect-fade");
    mogura.src = "";
    const x = mogura.getAttribute("x");
    const y = mogura.getAttribute("y");
    mogurasArr[x][y] = 0;
}

/******************** Event Handler ********************/
//ボタンが押された際の各処理
function buttonClick() {
    const button = event.target;
    if (button.innerHTML === "START") {
        currentCount++; //countDown開始時の処理用
        resetMogura("", 0);
        setTimeout(() => { intervalCountDown = setInterval(countDown, 1000); }, 100); //テストプレイして調整する
        setTimeout(() => { intervalDeruMogura = setInterval(deruMogura, 1900 / level + 100 ); }, 900); //テストプレイして調整する
        startButton.innerHTML = 'STOP';
    } else if (button.innerHTML === "STOP") {
        clearInterval(intervalCountDown);
        clearInterval(intervalDeruMogura);
        startButton.innerHTML = "RESET";
    } else if (button.innerHTML === "RESET") {
        level = 1;
        setTimeout(resetGame, 2100);
        startButton.innerHTML = "wait a moment ...";
        if(button.parentNode.lastElementChild.innerHTML === "Go to next Level"){ //冗長な感じ、要改善
            button.parentNode.removeChild(button.parentNode.lastElementChild);
        }
    } else if (button.innerHTML === "Go to next Level") {
        setTimeout(resetGame, 2100);
        startButton.innerHTML = "wait a moment ...";
        button.parentNode.removeChild(button);
    }
}

/******************** Reset/Close Process ********************/
//ゲーム再開示のリセット処理
function resetGame() {
    currentCount = initialCount;
    counterText.textContent = currentCount + "秒間もぐらをたたけ！ Level: " + level;
    counterText.classList.remove("zoomOut", "alert");
    score = 0;
    appearedMoguras = 0;
    resetMogura(imgNormalMogura, 0)
    startButton.innerHTML = "START";
}

//ゲーム終了時の処理
function closeGame() {
    counterText.classList.remove("zoomOut", "alert");
    counterText.textContent = "あなたのスコアは" + score + "/" + appearedMoguras;
    if (score === appearedMoguras) {
        counterText.textContent += " PERFECT!!";
    }
    startButton.innerHTML = "RESET";
    level++;
    buttons.appendChild(goNextLevelButton);
}
