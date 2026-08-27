// ========================================
// 9×9モンスターズ
// 九九修行 + モンスター図鑑 + セーブ
// ========================================

"use strict";

const SAVE_KEY = "9x9-monsters-save-v3";

const OLD_SAVE_KEYS = [
  "9x9-monsters-save-v2",
  "9x9-monsters-save-v1"
];

const stages = [
  1, 2, 3, 4, 5,
  6, 7, 8, 9
];


const monsters = [

  {
    id: 1,
    stage: 1,
    name: "かけるタマゴ",
    icon: "🥚",
    type: "はじまり",
    desc: "九九の世界から生まれた小さなタマゴ。",
    rare: "★"
  },

  {
    id: 2,
    stage: 2,
    name: "カケルネズミ",
    icon: "🐭",
    type: "すばやさ",
    desc: "計算が速い。2の段を覚えると仲間になる。",
    rare: "★"
  },

  {
    id: 3,
    stage: 3,
    name: "サンスウガエル",
    icon: "🐸",
    type: "みず",
    desc: "九九を唱えると元気になるカエル。",
    rare: "★"
  },

  {
    id: 4,
    stage: 4,
    name: "ヨンヨンウサギ",
    icon: "🐰",
    type: "もり",
    desc: "耳をピンと立てて答えを聞き分ける。",
    rare: "★"
  },

  {
    id: 5,
    stage: 5,
    name: "ゴゴゴゴーレム",
    icon: "🗿",
    type: "いわ",
    desc: "5の段を極めた者だけに心を開く。",
    rare: "★★"
  },

  {
    id: 6,
    stage: 6,
    name: "ロックロク",
    icon: "🐺",
    type: "かぜ",
    desc: "6の段の問題を風のように解く。",
    rare: "★★"
  },

  {
    id: 7,
    stage: 7,
    name: "ナナホシドラ",
    icon: "🐲",
    type: "ほのお",
    desc: "7の段を守る小さなドラゴン。",
    rare: "★★"
  },

  {
    id: 8,
    stage: 8,
    name: "ハチハチビー",
    icon: "🐝",
    type: "でんき",
    desc: "8の段を覚えると羽が光る。",
    rare: "★★★"
  },

  {
    id: 9,
    stage: 9,
    name: "キュウキュウドラゴン",
    icon: "🐉",
    type: "でんせつ",
    desc: "九九のすべてを極めた者の相棒。",
    rare: "★★★"
  }

];


let clearedStages = [];

let stageStars = {};

let caughtMonsters = [];

let adventureUnlocked = false;


let currentStage = 1;

let questionNumber = 0;

let correctCount = 0;

let combo = 0;

let maxCombo = 0;

let currentAnswer = 0;

let answering = false;

let questionTimer = null;

let returnScreen = "training-screen";


// ========================================
// DOM
// ========================================

function el(id) {

  return document.getElementById(id);

}


// ========================================
// 画面
// ========================================

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(
      screen => {
        screen.classList.remove("active");
      }
    );


  const target = el(id);


  if (!target) {

    console.error(
      "画面が見つかりません:",
      id
    );

    return false;

  }


  target.classList.add("active");

  return true;

}


// ========================================
// セーブ表示
// ========================================

function showSaveStatus(
  text,
  success = true
) {

  const status =
    el("save-status");


  if (!status) {
    return;
  }


  status.textContent = text;

  status.style.color =
    success
      ? "#4a8f58"
      : "#c44";

}


// ========================================
// セーブ
// ========================================

function saveGame() {

  const data = {

    version: 3,

    clearedStages: [
      ...clearedStages
    ],

    stageStars: {
      ...stageStars
    },

    caughtMonsters: [
      ...caughtMonsters
    ],

    adventureUnlocked,

    savedAt:
      new Date().toISOString()

  };


  try {

    const json =
      JSON.stringify(data);


    localStorage.setItem(
      SAVE_KEY,
      json
    );


    const verification =
      localStorage.getItem(
        SAVE_KEY
      );


    if (
      verification !== json
    ) {

      throw new Error(
        "保存確認に失敗しました"
      );

    }


    console.log(
      "💾 セーブしました",
      data
    );


    showSaveStatus(
      "💾 セーブしました！",
      true
    );


    return true;

  }

  catch (error) {

    console.error(
      "💾 セーブ失敗:",
      error
    );


    showSaveStatus(
      "⚠️ セーブできませんでした",
      false
    );


    return false;

  }

}


// ========================================
// ロード
// ========================================

function loadGame() {

  try {

    let saved =
      localStorage.getItem(
        SAVE_KEY
      );


    if (!saved) {

      for (
        const key of OLD_SAVE_KEYS
      ) {

        saved =
          localStorage.getItem(key);


        if (saved) {
          break;
        }

      }

    }


    if (!saved) {

      console.log(
        "🆕 新しいゲーム"
      );

      return;

    }


    const data =
      JSON.parse(saved);


    if (
      Array.isArray(
        data.clearedStages
      )
    ) {

      clearedStages =
        data.clearedStages
          .map(Number)
          .filter(
            n => stages.includes(n)
          );

    }


    if (
      data.stageStars &&
      typeof data.stageStars ===
      "object"
    ) {

      stageStars =
        data.stageStars;

    }


    if (
      Array.isArray(
        data.caughtMonsters
      )
    ) {

      caughtMonsters =
        data.caughtMonsters
          .map(Number)
          .filter(
            n =>
              monsters.some(
                monster =>
                  monster.id === n
              )
          );

    }


    adventureUnlocked =
      data.adventureUnlocked === true
      ||
      clearedStages.includes(9);


    // 旧セーブから補完
    clearedStages.forEach(
      stage => {

        const monster =
          monsters.find(
            m => m.stage === stage
          );


        if (
          monster &&
          !caughtMonsters.includes(
            monster.id
          )
        ) {

          caughtMonsters.push(
            monster.id
          );

        }

      }
    );


    console.log(
      "💾 セーブデータを読み込みました",
      {
        clearedStages,
        stageStars,
        caughtMonsters,
        adventureUnlocked
      }
    );

  }

  catch (error) {

    console.error(
      "⚠️ セーブデータ読み込み失敗:",
      error
    );


    clearedStages = [];

    stageStars = {};

    caughtMonsters = [];

    adventureUnlocked = false;

  }

}


// ========================================
// セーブ状態
// ========================================

function updateSaveStatus() {

  const status =
    el("save-status");


  if (!status) {
    return;
  }


  if (
    clearedStages.length === 0
  ) {

    status.textContent =
      "💾 セーブデータは自動保存されます";

    status.style.color =
      "#888";

  }

  else {

    status.textContent =
      `${clearedStages.length}個の段をクリア済み`;

    status.style.color =
      "#4a8f58";

  }

}


// ========================================
// ステージ一覧
// ========================================

function createStageList() {

  const list =
    el("stage-list");


  if (!list) {
    return;
  }


  list.innerHTML = "";


  stages.forEach(
    stageNumber => {

      const button =
        document.createElement(
          "button"
        );


      button.type = "button";

      button.className =
        "stage-button";


      const cleared =
        clearedStages.includes(
          stageNumber
        );


      const unlocked =
        stageNumber === 1
        ||
        clearedStages.includes(
          stageNumber - 1
        );


      if (!unlocked) {

        button.disabled = true;

        button.classList.add(
          "locked"
        );


        button.innerHTML = `

          <span>🔒</span>

          <strong>
            ${stageNumber}の段
          </strong>

          <small>
            前の段をクリアしよう
          </small>

        `;

      }

      else {

        const stars =
          stageStars[
            stageNumber
          ] || "";


        button.innerHTML = `

          <span>
            ${cleared ? "⭐" : "🥋"}
          </span>

          <strong>
            ${stageNumber}の段
          </strong>

          <small>
            ${
              cleared
                ? `修行完了！ ${stars}`
                : "修行開始！"
            }
          </small>

        `;


        button.addEventListener(
          "click",
          () => startTraining(
            stageNumber
          )
        );

      }


      list.appendChild(
        button
      );

    }
  );


  updateSaveStatus();

}


// ========================================
// 修行開始
// ========================================

function startTraining(
  stageNumber
) {

  const unlocked =
    stageNumber === 1
    ||
    clearedStages.includes(
      stageNumber - 1
    );


  if (!unlocked) {
    return;
  }


  currentStage =
    stageNumber;

  questionNumber = 0;

  correctCount = 0;

  combo = 0;

  maxCombo = 0;

  currentAnswer = 0;

  answering = false;


  if (questionTimer) {

    clearTimeout(
      questionTimer
    );

    questionTimer = null;

  }


  const title =
    el("training-title");


  if (title) {

    title.textContent =
      `${stageNumber}の段 修行`;

  }


  showScreen(
    "quiz-screen"
  );


  createQuestion();

}


// ========================================
// 問題
// ========================================

function createQuestion() {

  questionNumber++;


  if (
    questionNumber > 9
  ) {

    finishTraining();

    return;

  }


  answering = true;


  currentAnswer =
    currentStage *
    questionNumber;


  if (el("question")) {

    el("question").textContent =
      `${currentStage} × ${questionNumber} = ?`;

  }


  if (el("progress-text")) {

    el("progress-text").textContent =
      `第${questionNumber}問 / 9問`;

  }


  if (el("progress-fill")) {

    el("progress-fill").style.width =
      `${((questionNumber - 1) / 9) * 100}%`;

  }


  createAnswers();


  if (el("message")) {

    el("message").textContent =
      "正しい答えを選んでね！";

  }

}


// ========================================
// 選択肢
// ========================================

function createAnswers() {

  const container =
    el("answers");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  const choices =
    new Set([
      currentAnswer
    ]);


  while (
    choices.size < 4
  ) {

    const offset =
      Math.floor(
        Math.random() * 11
      ) - 5;


    choices.add(
      Math.max(
        1,
        currentAnswer + offset
      )
    );

  }


  Array.from(
    choices
  )
    .sort(
      () =>
        Math.random() - 0.5
    )
    .forEach(
      value => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";

        button.className =
          "answer";

        button.textContent =
          value;


        button.addEventListener(
          "click",
          () =>
            checkAnswer(
              value,
              button
            )
        );


        container.appendChild(
          button
        );

      }
    );

}


// ========================================
// 答え合わせ
// ========================================

function checkAnswer(
  answer,
  selectedButton
) {

  if (!answering) {
    return;
  }


  answering = false;


  document
    .querySelectorAll(".answer")
    .forEach(
      button => {
        button.disabled = true;
      }
    );


  if (
    answer === currentAnswer
  ) {

    selectedButton.classList.add(
      "correct"
    );


    correctCount++;

    combo++;


    if (
      combo > maxCombo
    ) {

      maxCombo =
        combo;

    }


    if (el("message")) {

      el("message").textContent =
        combo >= 3
          ? `🔥 ${combo}コンボ！すごい！`
          : "✨ 正解！";

    }

  }

  else {

    selectedButton.classList.add(
      "wrong"
    );


    combo = 0;


    document
      .querySelectorAll(".answer")
      .forEach(
        button => {

          if (
            Number(
              button.textContent
            ) === currentAnswer
          ) {

            button.classList.add(
              "correct"
            );

          }

        }
      );


    if (el("message")) {

      el("message").textContent =
        `💡 正解は ${currentAnswer}！`;

    }

  }


  questionTimer =
    setTimeout(
      () => {

        questionTimer = null;

        createQuestion();

      },
      900
    );

}


// ========================================
// 評価
// ========================================

function getStars(score) {

  if (score === 9) {
    return "⭐⭐⭐";
  }

  if (score >= 8) {
    return "⭐⭐☆";
  }

  return "⭐☆☆";

}


// ========================================
// モンスター取得
// ========================================

function getMonsterForStage(stage) {

  return monsters.find(
    monster =>
      monster.stage === stage
  );

}


function catchMonster(monsterId) {

  if (
    !caughtMonsters.includes(
      monsterId
    )
  ) {

    caughtMonsters.push(
      monsterId
    );

    return true;

  }


  return false;

}


// ========================================
// モンスター報酬
// ========================================

function showReward(
  monster,
  isNew
) {

  const box =
    el("reward-box");


  if (!box) {
    return;
  }


  box.classList.remove(
    "hidden"
  );


  box.innerHTML = `

    <div class="reward-title">
      ${
        isNew
          ? "🎉 新しい仲間をGET！"
          : "✨ 仲間と再会！"
      }
    </div>

    <div class="reward-monster">
      ${monster.icon}
    </div>

    <strong>
      ${monster.name}
    </strong>

    <small>
      ${monster.type} / ${monster.rare}
    </small>

    <p>
      ${monster.desc}
    </p>

  `;

}


// ========================================
// 修行終了
// ========================================

function finishTraining() {

  answering = false;


  if (questionTimer) {

    clearTimeout(
      questionTimer
    );

    questionTimer = null;

  }


  const stars =
    getStars(
      correctCount
    );


  if (el("result-correct")) {

    el("result-correct").textContent =
      `${correctCount} / 9`;

  }


  if (el("result-combo")) {

    el("result-combo").textContent =
      maxCombo;

  }


  if (el("result-stars")) {

    el("result-stars").textContent =
      stars;

  }


  const resultTitle =
    el("result-title");


  const resultMessage =
    el("result-message");


  const nextButton =
    el("next-stage");


  const rewardBox =
    el("reward-box");


  if (rewardBox) {

    rewardBox.classList.add(
      "hidden"
    );

    rewardBox.innerHTML = "";

  }


  // ------------------------------------
  // 合格
  // ------------------------------------

  if (
    correctCount >= 8
  ) {

    if (
      !clearedStages.includes(
        currentStage
      )
    ) {

      clearedStages.push(
        currentStage
      );

    }


    const oldStars =
      stageStars[
        currentStage
      ] || "";


    const rank =
      value => {

        if (
          value === "⭐⭐⭐"
        ) {
          return 3;
        }

        if (
          value === "⭐⭐☆"
        ) {
          return 2;
        }

        return 1;

      };


    if (
      !oldStars
      ||
      rank(stars) >
      rank(oldStars)
    ) {

      stageStars[
        currentStage
      ] = stars;

    }


    if (
      currentStage === 9
    ) {

      adventureUnlocked =
        true;

    }


    const monster =
      getMonsterForStage(
        currentStage
      );


    const isNew =
      monster
        ? catchMonster(
            monster.id
          )
        : false;


    // ★ セーブ
    saveGame();


    if (resultTitle) {

      resultTitle.textContent =
        currentStage === 9
          ? "🏆 9×9マスター！"
          : "🥋 修行完了！";

    }


    if (resultMessage) {

      resultMessage.textContent =
        currentStage === 9
          ? "すべての九九を極めた！冒険の扉が開いた！"
          : `${currentStage + 1}の段が解放された！`;

    }


    if (monster) {

      showReward(
        monster,
        isNew
      );

    }


    if (nextButton) {

      nextButton.style.display =
        "inline-block";


      nextButton.textContent =
        currentStage === 9
          ? "🗺️ 冒険へ進む"
          : `🥋 ${currentStage + 1}の段へ`;

    }

  }


  // ------------------------------------
  // 不合格
  // ------------------------------------

  else {

    if (resultTitle) {

      resultTitle.textContent =
        "もう少し修行じゃ！";

    }


    if (resultMessage) {

      resultMessage.textContent =
        "8問以上正解すると合格だよ！";

    }


    if (nextButton) {

      nextButton.style.display =
        "none";

    }

  }


  showScreen(
    "result-screen"
  );

}


// ========================================
// 図鑑
// ========================================

function updateWorldStats() {

  const count =
    el("caught-count");


  const percent =
    el("book-percent");


  if (count) {

    count.textContent =
      `${caughtMonsters.length} / ${monsters.length}`;

  }


  if (percent) {

    percent.textContent =
      `${Math.round(
        caughtMonsters.length /
        monsters.length *
        100
      )}%`;

  }

}


function renderMonsterBook() {

  const list =
    el("monster-list");


  if (!list) {
    return;
  }


  list.innerHTML = "";


  monsters.forEach(
    monster => {

      const caught =
        caughtMonsters.includes(
          monster.id
        );


      const card =
        document.createElement(
          "div"
        );


      card.className =
        `monster-card ${
          caught
            ? "caught"
            : "unknown"
        }`;


      if (caught) {

        const stars =
          stageStars[
            monster.stage
          ] || "";


        card.innerHTML = `

          <div class="monster-number">
            #${String(
              monster.id
            ).padStart(3, "0")}
          </div>

          <div class="monster-icon">
            ${monster.icon}
          </div>

          <div class="monster-info">

            <h2>
              ${monster.name}
            </h2>

            <div class="monster-meta">

              <span>
                ${monster.type}
              </span>

              <span>
                ${monster.rare}
              </span>

              <span>
                ${stars}
              </span>

            </div>

            <p>
              ${monster.desc}
            </p>

            <small>
              ${monster.stage}の段クリアで仲間になる
            </small>

          </div>

        `;

      }

      else {

        card.innerHTML = `

          <div class="monster-number">
            #${String(
              monster.id
            ).padStart(3, "0")}
          </div>

          <div class="monster-icon">
            ❓
          </div>

          <div class="monster-info">

            <h2>
              ？？？？
            </h2>

            <div class="monster-meta">

              <span>
                未発見
              </span>

            </div>

            <p>
              このモンスターを見つけるには、修行を進めよう。
            </p>

            <small>
              ${monster.stage}の段に秘密がある……
            </small>

          </div>

        `;

      }


      list.appendChild(
        card
      );

    }
  );


  if (el("book-summary")) {

    el("book-summary").textContent =
      `${caughtMonsters.length} / ${monsters.length} 発見`;

  }


  updateWorldStats();

}


function openBook(
  fromScreen
) {

  returnScreen =
    fromScreen;


  renderMonsterBook();


  showScreen(
    "book-screen"
  );

}


// ========================================
// ボタン
// ========================================

const startButton =
  el("start-button");


if (startButton) {

  startButton.addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );

}


const backTraining =
  el("back-training");


if (backTraining) {

  backTraining.addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );

}


const retryButton =
  el("retry-stage");


if (retryButton) {

  retryButton.addEventListener(
    "click",
    () => {

      startTraining(
        currentStage
      );

    }
  );

}


const nextStageButton =
  el("next-stage");


if (nextStageButton) {

  nextStageButton.addEventListener(
    "click",
    () => {

      if (
        currentStage === 9
      ) {

        showScreen(
          "adventure-screen"
        );

      }

      else {

        startTraining(
          currentStage + 1
        );

      }

    }
  );

}


const adventureButton =
  el("adventure-button");


if (adventureButton) {

  adventureButton.addEventListener(
    "click",
    () => {

      updateWorldStats();

      showScreen(
        "world-screen"
      );

    }
  );

}


const trainingBookButton =
  el("open-book-training");


if (trainingBookButton) {

  trainingBookButton.addEventListener(
    "click",
    () => {

      openBook(
        "training-screen"
      );

    }
  );

}


const resultBookButton =
  el("result-book");


if (resultBookButton) {

  resultBookButton.addEventListener(
    "click",
    () => {

      openBook(
        "result-screen"
      );

    }
  );

}


const adventureBookButton =
  el("adventure-book");


if (adventureBookButton) {

  adventureBookButton.addEventListener(
    "click",
    () => {

      openBook(
        "adventure-screen"
      );

    }
  );

}


const worldBookButton =
  el("world-book");


if (worldBookButton) {

  worldBookButton.addEventListener(
    "click",
    () => {

      openBook(
        "world-screen"
      );

    }
  );

}


const backBook =
  el("back-book");


if (backBook) {

  backBook.addEventListener(
    "click",
    () => {

      if (
        returnScreen ===
        "result-screen"
      ) {

        showScreen(
          "result-screen"
        );

      }

      else {

        createStageList();

        showScreen(
          returnScreen
        );

      }

    }
  );

}


// ========================================
// ページ終了時セーブ
// ========================================

window.addEventListener(
  "beforeunload",
  () => {

    if (
      clearedStages.length > 0
      ||
      caughtMonsters.length > 0
    ) {

      saveGame();

    }

  }
);


// ========================================
// 起動
// ========================================

loadGame();


console.log(
  "9×9モンスターズ 起動しました！"
);


console.log(
  "💾 セーブシステム: ONLINE"
);


console.log(
  `📖 図鑑: ${
    caughtMonsters.length
  }/${monsters.length}`
);
