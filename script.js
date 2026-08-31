"use strict";

/* =========================================================
   9×9モンスターズ
   script.js
   クリーン完全統合版
   ========================================================= */


/* =========================================================
   セーブ
   ========================================================= */

const SAVE_KEY = "9x9-monsters-save-v7";


/* =========================================================
   モンスター
   ========================================================= */

const monsters = [
  {
    id: 1,
    stage: 1,
    name: "スライム",
    image: "images/slime.png",
    type: "みずタイプ",
    desc: "ぷるぷるしている不思議な仲間。",
    rare: "★",
    maxLevel: 30,
    baseHP: 15,
    baseAttack: 6,
    baseDefense: 7,
    hpGrowth: 2,
    attackGrowth: 1,
    defenseGrowth: 1
  },

  {
    id: 2,
    stage: 2,
    name: "キノコン",
    image: "images/kinokon.png",
    type: "いわタイプ",
    desc: "のんびりしているが力持ち。",
    rare: "★",
    maxLevel: 30,
    baseHP: 18,
    baseAttack: 7,
    baseDefense: 9,
    hpGrowth: 2,
    attackGrowth: 1,
    defenseGrowth: 1
  },

  {
    id: 3,
    stage: 3,
    name: "ゴブリン",
    image: "images/gobulin.png",
    type: "ひかりタイプ",
    desc: "小さな体で元気いっぱい。",
    rare: "★",
    maxLevel: 30,
    baseHP: 21,
    baseAttack: 8,
    baseDefense: 10,
    hpGrowth: 2,
    attackGrowth: 2,
    defenseGrowth: 1
  },

  {
    id: 4,
    stage: 4,
    name: "ゴースト",
    image: "images/gosuto.png",
    type: "やみタイプ",
    desc: "夜の森に現れる謎のモンスター。",
    rare: "★",
    maxLevel: 20,
    baseHP: 25,
    baseAttack: 10,
    baseDefense: 11,
    hpGrowth: 3,
    attackGrowth: 1,
    defenseGrowth: 2
  },

  {
    id: 5,
    stage: 5,
    name: "ワーウルフ",
    image: "images/wauruhu.png",
    type: "かぜタイプ",
    desc: "素早さが自慢のモンスター。",
    rare: "★★",
    maxLevel: 20,
    baseHP: 28,
    baseAttack: 13,
    baseDefense: 12,
    hpGrowth: 3,
    attackGrowth: 2,
    defenseGrowth: 1
  },

  {
    id: 6,
    stage: 6,
    name: "イエティ",
    image: "images/ietexi.png",
    type: "こおりタイプ",
    desc: "大きな体と力を持つモンスター。",
    rare: "★★",
    maxLevel: 20,
    baseHP: 32,
    baseAttack: 15,
    baseDefense: 13,
    hpGrowth: 3,
    attackGrowth: 1,
    defenseGrowth: 2
  },

  {
    id: 7,
    stage: 7,
    name: "ミノタウロス",
    image: "images/minotaurosu.png",
    type: "いわタイプ",
    desc: "強大な力を持つ怪物。",
    rare: "★★",
    maxLevel: 15,
    baseHP: 36,
    baseAttack: 18,
    baseDefense: 16,
    hpGrowth: 4,
    attackGrowth: 3,
    defenseGrowth: 1
  },

  {
    id: 8,
    stage: 8,
    name: "ゴーレム",
    image: "images/gouremu.png",
    type: "いわタイプ",
    desc: "圧倒的な防御力を誇る巨人。",
    rare: "★★★",
    maxLevel: 15,
    baseHP: 42,
    baseAttack: 16,
    baseDefense: 23,
    hpGrowth: 4,
    attackGrowth: 2,
    defenseGrowth: 3
  },

  {
    id: 9,
    stage: 9,
    name: "ドラゴン",
    image: "images/doragon.png",
    type: "ほのおタイプ",
    desc: "九九を極めた者だけが出会える王。",
    rare: "★★★",
    maxLevel: 15,
    baseHP: 48,
    baseAttack: 21,
    baseDefense: 21,
    hpGrowth: 5,
    attackGrowth: 2,
    defenseGrowth: 2
  }
];

/* =========================================================
   はじまりの森の敵
   ========================================================= */

const forestEnemies = [
  {
    name: "野生のスライム",
    image: "images/yasei_slime.png",
    level: 1,
    hp: 30,
    attack: 5
  },

  {
    name: "ワルキノコ",
    image: "images/warukinoko.png",
    level: 2,
    hp: 42,
    attack: 6
  },

  {
    name: "オバケバナ",
    image: "images/obakebana.png",
    level: 3,
    hp: 55,
    attack: 7
  },

  {
    name: "ゴブリンリーダー",
    image: "images/goburin_rida.png",
    level: 4,
    hp: 70,
    attack: 8
  },

  {
    name: "ウッドラー",
    image: "images/uddora.png",
    level: 5,
    hp: 70,
    attack: 9
  }
];

/* =========================================================
   はじまりの森 ボス
   ========================================================= */

const forestBoss = {
  name: "森の守護者",
  image: "images/morinosyugosya.png",
  level: 7,
  hp: 100,
  attack: 10
};


/* =========================================================
   ゲームデータ
   ========================================================= */

let clearedStages = [];
let stageStars = {};
let caughtMonsters = [];
let monsterData = {};

let adventureUnlocked = false;
let battleWins = 0;


/* =========================================================
   修行状態
   ========================================================= */

let currentStage = 1;
let questionNumber = 0;
let correctCount = 0;
let combo = 0;
let maxCombo = 0;
let currentAnswer = 0;
let answering = false;
let questionTimer = null;


/* =========================================================
   モンスター状態
   ========================================================= */

let selectedMonsterId = null;
let levelupMonsterId = null;


/* =========================================================
   冒険ステージ共通状態
   ========================================================= */

const adventureStages = {
  forest: {
    id: "forest",
    name: "はじまりの森",
    progress: 0,
    currentHP: 0,
    battleMonsterId: null,
    questionMin: 1,
    questionMax: 3,
   enemies: [
      { name: "野生のスライム", image: "images/yasei_slime.png", level: 1, hp: 12, attack: 4 },
      { name: "ワルキノコ", image: "images/warukinoko.png", level: 2, hp: 18, attack: 6 },
      { name: "オバケバナ", image: "images/obakebana.png", level: 3, hp: 24, attack: 7 },
      { name: "ゴブリンリーダー", image: "images/goburin_rida.png", level: 4, hp: 30, attack: 9 },
      { name: "ウッドラー", image: "images/uddora.png", level: 5, hp: 38, attack: 8 }
    ],
    boss: { name: "森の守護者", image: "images/morinosyugosya.png", level: 7, hp: 55, attack: 11 }
  },

  lake: {
    id: "lake",
    name: "九九の湖",
    progress: 0,
    currentHP: 0,
    battleMonsterId: null,
    questionMin: 3,
    questionMax: 5,
    enemies: [
      { name: "あわモン", image: null, level: 3, hp: 27, attack: 8 },
      { name: "ウォータースライム", image: null, level: 4, hp: 32, attack: 10 },
      { name: "ツノザカナ", image: null, level: 4, hp: 36, attack: 12 },
      { name: "シンカイモン", image: null, level: 5, hp: 42, attack: 14 }
    ],
    boss: { name: "湖底の主", image: null, level: 7, hp: 65, attack: 17 }
  }
};

let forestProgress = 0;
let forestCurrentHP = 0;
let forestBattleMonsterId = null;

let lakeProgress = 0;
let lakeCurrentHP = 0;
let lakeBattleMonsterId = null;

let currentAdventureStage = "forest";

/* =========================================================
   バトル状態
   ========================================================= */

let currentBattleNumber = 0;

let currentWildMonster = null;

let battlePlayerHP = 0;
let battlePlayerMaxHP = 0;

let battleEnemyHP = 0;
let battleEnemyMaxHP = 0;

let battleAnswer = 0;
let battleAnswering = false;

let battleTimer = null;
let battleCombo = 0;

let battleExpReward = 0;

let returnScreen = "training-screen";



/* =========================================================
   冒険ステージ共通ヘルパー
   ========================================================= */

function getAdventureStage(stageId = currentAdventureStage) {
  return adventureStages[stageId] || adventureStages.forest;
}

function syncAdventureState(stageId = currentAdventureStage) {
  const stage = getAdventureStage(stageId);
  if (stageId === "forest") {
    stage.progress = forestProgress;
    stage.currentHP = forestCurrentHP;
    stage.battleMonsterId = forestBattleMonsterId;
  } else {
    stage.progress = lakeProgress;
    stage.currentHP = lakeCurrentHP;
    stage.battleMonsterId = lakeBattleMonsterId;
  }
  return stage;
}

function saveAdventureStage(stageId = currentAdventureStage) {
  /*
     現在のライブ状態を adventureStages に同期する。

     以前は逆方向（staleな adventureStages → live変数）に
     コピーしていたため、湖のバトル後に
       lakeProgress
       lakeCurrentHP
       lakeBattleMonsterId
     が初期値へ戻ってしまっていた。
  */
  syncAdventureState(stageId);
}

function getAdventureQuestion(stageId = currentAdventureStage) {
  const stage = getAdventureStage(stageId);
  const table = [];
  for (let n = stage.questionMin; n <= stage.questionMax; n++) table.push(n);
  const multiplier = table[Math.floor(Math.random() * table.length)];
  const factor = Math.floor(Math.random() * 9) + 1;
  return {
    multiplier,
    factor,
    answer: multiplier * factor
  };
}

function isForestCleared() {
  return forestProgress >= 5;
}

function isLakeUnlocked() {
  return isForestCleared();
}

function isLakeCleared() {
  return lakeProgress >= 5;
}

/* =========================================================
   DOM
   ========================================================= */

function el(id) {
  return document.getElementById(id);
}


/* =========================================================
   画面切り替え
   ========================================================= */

function showScreen(id) {

  /*
     クリックしたボタンのフォーカスを外す。
     フォーカスされたボタンの位置へ
     ブラウザが戻そうとするのを防ぐ。
  */
  if (
    document.activeElement &&
    typeof document.activeElement.blur === "function"
  ) {
    document.activeElement.blur();
  }


  document
    .querySelectorAll(".screen")
    .forEach(screen => {
      screen.classList.remove("active");
    });


  const target = el(id);


  if (!target) {
    console.error(
      "画面が見つかりません:",
      id
    );
    return;
  }


  target.classList.add("active");

const opBgm = el("op-bgm");

  if (opBgm) {
    if (id === "title-screen") {
      opBgm.currentTime = 0;
      opBgm.play();
    } else {
      opBgm.pause();
      opBgm.currentTime = 0;
    }
  }
   
  /*
     画面切り替え直後に最上部へ。
  */
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });


  /*
     ブラウザのフォーカス処理が終わった後にも
     もう一度最上部を指定する。
  */
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  });


  updateBottomMenu(id);
}


/* =========================================================
   下部メニュー
   ========================================================= */

function updateBottomMenu(screenId) {

  const menu = el("menu");

  if (!menu) {
    return;
  }


  if (screenId === "title-screen") {
    menu.classList.add("hidden");
  }
  else {
    menu.classList.remove("hidden");
  }
}


/* =========================================================
   モンスター初期データ
   ========================================================= */

function createMonsterData(monster) {

  return {
    id: monster.id,
    level: 1,
    exp: 0,
    hp: monster.baseHP,
    attack: monster.baseAttack,
    defense: monster.baseDefense
  };
}


/* =========================================================
   モンスター情報取得
   ========================================================= */

function getMonsterData(monsterId) {

  const id = Number(monsterId);


  if (!monsterData[id]) {

    const monster =
      monsters.find(
        item => item.id === id
      );


    if (!monster) {
      return null;
    }


    monsterData[id] =
      createMonsterData(monster);
  }


  return monsterData[id];
}


/* =========================================================
   必要EXP
   ========================================================= */

function requiredExp(level, stage) {
  const stageRate = {
    1: 80,
    2: 90,
    3: 100,
    4: 120,
    5: 140,
    6: 160,
    7: 180,
    8: 210,
    9: 240
  };

  return level * (stageRate[stage] || 100);
}


/* =========================================================
   セーブ
   ========================================================= */

function saveGame() {

  syncAdventureState("forest");
  syncAdventureState("lake");

  const data = {

    version: 10,

    clearedStages: [
      ...clearedStages
    ],

    stageStars: {
      ...stageStars
    },

    caughtMonsters: [
      ...caughtMonsters
    ],

    monsterData: {
      ...monsterData
    },

    adventureUnlocked,

    battleWins,

    forestProgress,

    forestCurrentHP,

    forestBattleMonsterId,
    lakeProgress,
    lakeCurrentHP,
    lakeBattleMonsterId
  };


  try {

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(data)
    );

    updateSaveStatus();

  }

  catch (error) {

    console.error(
      "セーブ失敗:",
      error
    );

  }
}


/* =========================================================
   ロード
   ========================================================= */

function loadGame() {

  try {

    const saved =
      localStorage.getItem(
        SAVE_KEY
      );


    if (!saved) {
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
            stage =>
              stage >= 1 &&
              stage <= 9
          );
    }


    if (
      data.stageStars &&
      typeof data.stageStars === "object"
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
            id =>
              monsters.some(
                monster =>
                  monster.id === id
              )
          );
    }


    if (
      data.monsterData &&
      typeof data.monsterData === "object"
    ) {

      monsterData =
        data.monsterData;
    }


    adventureUnlocked =
      data.adventureUnlocked === true;


    battleWins =
      Number(
        data.battleWins
      ) || 0;


    forestProgress =
      Number(
        data.forestProgress
      ) || 0;


    forestProgress =
      Math.max(
        0,
        Math.min(
          5,
          forestProgress
        )
      );


    forestCurrentHP =
      Number(
        data.forestCurrentHP
      ) || 0;


    forestBattleMonsterId =
      data.forestBattleMonsterId
        ? Number(
            data.forestBattleMonsterId
          )
        : null;

    lakeProgress =
      Math.max(0, Math.min(5, Number(data.lakeProgress) || 0));

    lakeCurrentHP =
      Number(data.lakeCurrentHP) || 0;

    lakeBattleMonsterId =
      data.lakeBattleMonsterId
        ? Number(data.lakeBattleMonsterId)
        : null;

  }

  catch (error) {

    console.error(
      "ロード失敗:",
      error
    );

  }
}


/* =========================================================
   セーブ表示
   ========================================================= */

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

  }

  else {

    status.textContent =
      `${clearedStages.length}個の段をクリア済み`;

  }
}


/* =========================================================
   修行ステージ一覧
   ========================================================= */

function createStageList() {

  const list =
    el("stage-list");


  if (!list) {
    return;
  }


  list.innerHTML = "";


  for (
    let stage = 1;
    stage <= 9;
    stage++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "stage-button";


    const cleared =
      clearedStages.includes(
        stage
      );


    const unlocked =
      stage === 1 ||
      clearedStages.includes(
        stage - 1
      );


    if (!unlocked) {

      button.disabled =
        true;

      button.classList.add(
        "locked"
      );


      button.innerHTML = `

        <span>🔒</span>

        <strong>
          ${stage}の段
        </strong>

        <small>
          前の段をクリアしよう
        </small>

      `;

    }

    else {

      const stars =
        stageStars[stage] || "";


      button.innerHTML = `

        <span>
          ${cleared ? "⭐" : '<img src="images/sisyou.png" class="master-icon">'}
        </span>

        <strong>
          ${stage}の段
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
        () =>
          startTraining(stage)
      );

    }


    list.appendChild(
      button
    );

  }


  updateSaveStatus();
}


/* =========================================================
   修行開始
   ========================================================= */

function startTraining(stage) {

  const unlocked =
    stage === 1 ||
    clearedStages.includes(
      stage - 1
    );


  if (!unlocked) {
    return;
  }


  currentStage =
    Number(stage);


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
      `${currentStage}の段 修行`;

  }


  showScreen(
    "quiz-screen"
  );


  createQuestion();
}


/* =========================================================
   修行問題
   ========================================================= */

function createQuestion() {

  questionNumber++;


  if (
    questionNumber > 9
  ) {

    finishTraining();

    return;

  }


  answering = true;


  /*
     通常修行は
     その段を順番に出題
  */

  currentAnswer =
    currentStage *
    questionNumber;


  const question =
    el("question");


  if (question) {

    question.textContent =
      `${currentStage} × ${questionNumber} = ?`;

  }


  const progress =
    el("progress-text");


  if (progress) {

    progress.textContent =
      `第${questionNumber}問 / 9問`;

  }


  const progressFill =
    el("progress-fill");


  if (progressFill) {

    progressFill.style.width =
      `${
        (
          (questionNumber - 1) /
          9 *
          100
        )
      }%`;

  }


  createAnswers();


  const message =
    el("message");


  if (message) {

    message.textContent =
      "正しい答えを選んでね！";

  }
}


/* =========================================================
   修行選択肢
   ========================================================= */

function createAnswers() {

  const container =
    el("answers");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  const choices =
    new Set();


  choices.add(
    currentAnswer
  );


  while (
    choices.size < 4
  ) {

    const wrong =
      Math.max(
        1,
        currentAnswer +
        Math.floor(
          Math.random() * 11
        ) - 5
      );


    choices.add(
      wrong
    );

  }


  [...choices]
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


/* =========================================================
   修行回答
   ========================================================= */

function checkAnswer(
  answer,
  button
) {

  if (!answering) {
    return;
  }


  answering = false;


  document
    .querySelectorAll(
      ".answer"
    )
    .forEach(
      item =>
        item.disabled = true
    );


  const message =
    el("message");


  if (
    Number(answer) ===
    Number(currentAnswer)
  ) {

    button.classList.add(
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


    if (message) {

      message.textContent =
        combo >= 3
          ? `🔥 ${combo}コンボ！すごい！`
          : "✨ 正解！";

    }

  }

  else {

    button.classList.add(
      "wrong"
    );


    combo = 0;


    document
      .querySelectorAll(
        ".answer"
      )
      .forEach(
        item => {

          if (
            Number(
              item.textContent
            ) ===
            Number(currentAnswer)
          ) {

            item.classList.add(
              "correct"
            );

          }

        }
      );


    if (message) {

      message.textContent =
        `💡 正解は ${currentAnswer}！`;

    }

  }


  /*
     次の問題まで0.45秒。
     以前よりテンポを改善。
  */

  questionTimer =
    setTimeout(
      () => {

        questionTimer = null;

        createQuestion();

      },
      450
    );
}


/* =========================================================
   星評価
   ========================================================= */

function getStars(score) {

  if (
    score === 9
  ) {

    return "⭐⭐⭐";

  }


  if (
    score >= 8
  ) {

    return "⭐⭐☆";

  }


  return "⭐☆☆";
}


/* =========================================================
   段 → モンスター
   ========================================================= */

function getMonsterForStage(stage) {

  return monsters.find(
    monster =>
      monster.stage ===
      Number(stage)
  );
}


/* =========================================================
   モンスターGET
   ========================================================= */

function catchMonster(monsterId) {

  const id =
    Number(monsterId);


  if (
    !caughtMonsters.includes(id)
  ) {

    caughtMonsters.push(
      id
    );


    getMonsterData(id);


    return true;

  }


  return false;
}


/* =========================================================
   モンスター表示
   ========================================================= */

function monsterVisual(
  monster,
  className = ""
) {

  if (
    monster &&
    monster.image
  ) {

    return `

      <img
        class="${className}"
        src="${monster.image}"
        alt="${monster.name}"
      >

    `;

  }


  return `

    <div
      class="${className} monster-placeholder"
    >
      👾
    </div>

  `;
}


/* =========================================================
   GET報酬
   ========================================================= */

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

    <div
      id="reward-monster"
      class="reward-monster"
    >

      ${
        monsterVisual(
          monster,
          "reward-monster-image"
        )
      }

    </div>

    <strong>
      ${monster.name}
    </strong>

    <small>
      ${monster.type}
      ／
      ${monster.rare}
    </small>

    <p>
      ${monster.desc}
    </p>

  `;
}


/* =========================================================
   修行終了
   ========================================================= */

function finishTraining() {

  answering = false;


  const stars =
    getStars(
      correctCount
    );


  const resultCorrect =
    el("result-correct");


  const resultCombo =
    el("result-combo");


  const resultStars =
    el("result-stars");


  if (resultCorrect) {

    resultCorrect.textContent =
      `${correctCount} / 9`;

  }


  if (resultCombo) {

    resultCombo.textContent =
      maxCombo;

  }


  if (resultStars) {

    resultStars.textContent =
      stars;

  }


  const rewardBox =
    el("reward-box");


  if (rewardBox) {

    rewardBox.classList.add(
      "hidden"
    );

    rewardBox.innerHTML =
      "";

  }


  const nextButton =
    el("next-stage");


  if (
    correctCount >= 8
  ) {

    /*
       段クリア
    */

    if (
      !clearedStages.includes(
        currentStage
      )
    ) {

      clearedStages.push(
        currentStage
      );

    }


    /*
       星評価
    */

    const oldStars =
      stageStars[
        currentStage
      ] || "";


    const starValue =
      stars === "⭐⭐⭐"
        ? 3
        : stars === "⭐⭐☆"
          ? 2
          : 1;


    const oldValue =
      oldStars === "⭐⭐⭐"
        ? 3
        : oldStars === "⭐⭐☆"
          ? 2
          : oldStars === "⭐☆☆"
            ? 1
            : 0;


    if (
      starValue > oldValue
    ) {

      stageStars[
        currentStage
      ] = stars;

    }


    /*
       モンスターGET
    */

    const monster =
      getMonsterForStage(
        currentStage
      );


    if (monster) {

      const isNew =
        catchMonster(
          monster.id
        );


      showReward(
        monster,
        isNew
      );

    }


    /*
       9の段までクリアすると
       冒険解禁
    */

    if (
      currentStage === 9
    ) {

      adventureUnlocked =
        true;

    }


    const title =
      el("result-title");


    const message =
      el("result-message");


    if (title) {

      title.textContent =
        currentStage === 9
          ? "🏆 9×9マスター！"
          : "🥋 修行完了！";

    }


    if (message) {

      message.textContent =
        currentStage === 9
          ? "すべての九九を極めた！冒険の扉が開いた！"
          : `${currentStage + 1}の段が解放された！`;

    }


    if (nextButton) {

      nextButton.style.display =
        "inline-block";


      nextButton.textContent =
        currentStage === 9
          ? "🗺️ 冒険へ進む"
          : `🥋 ${currentStage + 1}の段へ`;

    }


    saveGame();

  }

  else {

    const title =
      el("result-title");


    const message =
      el("result-message");


    if (title) {

      title.textContent =
        "もう少し修行じゃ！";

    }


    if (message) {

      message.textContent =
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


/* =========================================================
   モンスター育成画面
   ========================================================= */

function openMonsterScreen() {

  if (
    caughtMonsters.length === 0
  ) {

    alert(
      "まだ仲間がいません！\n\n" +
      "まずは1の段をクリアして\n" +
      "モンスターを仲間にしよう！"
    );

    return;

  }


  if (
    !selectedMonsterId ||
    !caughtMonsters.includes(
      Number(selectedMonsterId)
    )
  ) {

    selectedMonsterId =
      Number(
        caughtMonsters[0]
      );

  }


  renderMonsterParty();

  renderMonsterDetail();


  showScreen(
    "training-monster-screen"
  );
}


/* =========================================================
   育成モンスター一覧
   ========================================================= */

function renderMonsterParty() {

  const party =
    el("monster-party");


  if (!party) {
    return;
  }


  party.innerHTML = "";


  caughtMonsters.forEach(
    monsterId => {

      const monster =
        monsters.find(
          item =>
            item.id ===
            Number(monsterId)
        );


      if (!monster) {
        return;
      }


      const data =
        getMonsterData(
          monster.id
        );


      if (!data) {
        return;
      }


      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "party-monster";


      if (
        Number(
          selectedMonsterId
        ) ===
        monster.id
      ) {

        button.classList.add(
          "selected"
        );

      }


      button.innerHTML = `

        <div class="party-image">

          ${
            monsterVisual(
              monster,
              "party-monster-image"
            )
          }

        </div>

        <strong>
          ${monster.name}
        </strong>

        <small>
          Lv.${data.level}
        </small>

      `;


      button.addEventListener(
        "click",
        () => {

          selectedMonsterId =
            monster.id;

          renderMonsterParty();

          renderMonsterDetail();

        }
      );


      party.appendChild(
        button
      );

    }
  );
}


/* =========================================================
   育成詳細
   ========================================================= */

function renderMonsterDetail() {

  const detail =
    el("monster-detail");

  if (!detail) {
    return;
  }

  /* 通常の育成画面に戻す */
  detail.className =
    "monster-detail";


  if (!selectedMonsterId) {

    detail.innerHTML =
      "";

    return;

  }


  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(
          selectedMonsterId
        )
    );


  if (!monster) {
    return;
  }


  const data =
    getMonsterData(
      monster.id
    );


  if (!data) {
    return;
  }


  const required =
  requiredExp(
    data.level,
    monster.stage
  );


  const percent =
  data.level >= monster.maxLevel
    ? 100
    : Math.min(
        100,
        Math.round(
          data.exp /
          required *
          100
        )
      );


  detail.innerHTML = `

    <div class="detail-image">

      ${
        monsterVisual(
          monster,
          "detail-monster-image"
        )
      }

    </div>

    <div class="detail-info">

      <div class="detail-title">

        <h2>
          ${monster.name}
        </h2>

        <span>
          ${monster.rare}
        </span>

      </div>

      <p class="monster-type">
        ${monster.type}
      </p>

      <div class="level-line">

        <strong>
          Lv.${data.level}
        </strong>

        <span>
  ${data.level >= monster.maxLevel
    ? "EXP MAX"
    : `EXP ${data.exp} / ${required}`}
</span>

      </div>

      <div class="exp-bar">

        <div
          style="width:${percent}%"
        ></div>

      </div>

      <div class="stats-grid">

        <div>
          <span>
            ❤️ HP
          </span>

          <strong>
            ${data.hp}
          </strong>
        </div>

        <div>
          <span>
            ⚔️ こうげき
          </span>

          <strong>
            ${data.attack}
          </strong>
        </div>

        <div>
          <span>
            🛡️ ぼうぎょ
          </span>

          <strong>
            ${data.defense}
          </strong>
        </div>

      </div>

      <p class="monster-desc">
        ${monster.desc}
      </p>

      <button
        id="train-monster"
        class="main-button"
      >
        🥋 九九で特訓する
      </button>

    </div>

  `;


  const trainButton =
    el("train-monster");


  if (trainButton) {

    trainButton.addEventListener(
      "click",
      trainMonster
    );

  }
}


/* =========================================================
   EXP獲得
   ========================================================= */

function gainExp(
  monsterId,
  amount
) {

  const data =
    getMonsterData(
      monsterId
    );

  if (!data) {
    return false;
  }

  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(monsterId)
    );

  if (!monster) {
    return false;
  }

  data.exp +=
    Number(amount);

  let leveledUp =
    false;

  while (
    data.level < monster.maxLevel &&
    data.exp >=
    requiredExp(
      data.level,
      monster.stage
    )
  ) {

    data.exp -=
      requiredExp(
        data.level,
        monster.stage
      );

    data.level++;

    data.hp +=
      monster.hpGrowth;

    data.attack +=
      monster.attackGrowth;

    data.defense +=
      monster.defenseGrowth;

    leveledUp =
      true;
  }

  if (
    data.level >=
    monster.maxLevel
  ) {
    data.level =
      monster.maxLevel;

    data.exp = 0;
  }

  saveGame();

  return leveledUp;
}


/* =========================================================
   モンスター特訓
   4択ミニバトル版
========================================================= */

let trainingQuestion = 0;
let trainingAnswer = 0;
let trainingAnswering = false;


/*
   特訓開始
*/

function trainMonster() {

  if (!selectedMonsterId) {
    return;
  }


  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(selectedMonsterId)
    );


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (!monster || !data) {
    return;
  }


  trainingQuestion = 0;
  trainingAnswer = 0;
  trainingAnswering = false;


  renderTrainingBattle();
}


/* =========================================================
   特訓画面
========================================================= */

function renderTrainingBattle() {

  const detail =
    el("monster-detail");

  if (!detail) {
    return;
  }

  /* 特訓中は通常の2列レイアウトを解除 */
  detail.className =
    "monster-detail training-mode";

  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(selectedMonsterId)
    );


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (!monster || !data) {
    return;
  }


  detail.innerHTML = `

    <div class="training-battle">

      <div class="training-header">
        <div class="training-title">
          🥋 モンスター特訓！
        </div>

        <div class="training-subtitle">
          ${monster.name}の力を鍛えよう！
        </div>
      </div>


      <div class="training-monster-card">

        <div class="training-monster-image">

          ${
            monsterVisual(
              monster,
              "training-monster-image-inner"
            )
          }

        </div>


        <div class="training-monster-info">

          <strong>
            ${monster.name}
          </strong>

          <span>
            Lv.${data.level}
          </span>

        </div>

      </div>


      <div class="training-message">
        九九でパワーアップ！
      </div>


      <div
        id="training-question"
        class="training-question"
      >
        問題を準備中...
      </div>


      <div
        id="training-answers"
        class="training-answers"
      >
      </div>


      <div
        id="training-result"
        class="training-result"
      >
      </div>


      <button
        type="button"
        id="training-cancel"
        class="training-cancel"
      >
        ← 育成画面に戻る
      </button>

    </div>

  `;


  const cancelButton =
    el("training-cancel");


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        renderMonsterParty();
        renderMonsterDetail();

      }
    );

  }


 createTrainingQuestion();

requestAnimationFrame(() => {
  const monsterCard = document.querySelector(".training-monster-card");

  if (monsterCard) {
    monsterCard.scrollIntoView({
      behavior: "instant",
      block: "start"
    });
  }
});
}


/* =========================================================
   特訓問題作成
========================================================= */

function createTrainingQuestion() {

  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(selectedMonsterId)
    );


  if (!monster) {
    return;
  }


  trainingQuestion++;
  trainingAnswering = true;


  /*
     モンスターが覚えている段を使用
  */

  const a =
    monster.stage;


  const b =
    Math.floor(
      Math.random() * 9
    ) + 1;


  trainingAnswer =
    a * b;


  const question =
    el("training-question");


  if (question) {

    question.textContent =
      `${a} × ${b} = ?`;

  }


  createTrainingAnswers();
}


/* =========================================================
   特訓選択肢
========================================================= */

function createTrainingAnswers() {

  const container =
    el("training-answers");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  const choices =
    new Set();


  choices.add(
    trainingAnswer
  );


  /*
     間違い選択肢
  */

  while (
    choices.size < 4
  ) {

    const offset =
      Math.floor(
        Math.random() * 13
      ) - 6;


    const wrong =
      trainingAnswer +
      offset;


    if (wrong > 0) {

      choices.add(
        wrong
      );

    }

  }


  /*
     シャッフル
  */

  [...choices]
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
          "training-answer";


        button.textContent =
          value;


        button.addEventListener(
          "click",
          () =>
            answerTrainingQuestion(
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


/* =========================================================
   特訓回答
========================================================= */

function answerTrainingQuestion(
  answer,
  button
) {

  if (!trainingAnswering) {
    return;
  }


  trainingAnswering =
    false;


  const container =
    el("training-answers");


  if (container) {

    container
      .querySelectorAll(
        "button"
      )
      .forEach(
        item =>
          item.disabled = true
      );

  }


  const result =
    el("training-result");


  /*
     正解
  */

  if (
    Number(answer) ===
    Number(trainingAnswer)
  ) {

    button.classList.add(
      "correct"
    );


    if (result) {

      result.innerHTML = `
<div class="training-perfect">
  🎉 特訓成功！
</div>

        <div class="training-exp">
          +25 EXP
        </div>
      `;

    }


    const oldLevel =
      getMonsterData(
        selectedMonsterId
      ).level;


    const leveledUp =
      gainExp(
        selectedMonsterId,
        25
      );


    /*
       レベルアップ
    */

    if (leveledUp) {

      setTimeout(
        () => {

          showLevelUp(
            selectedMonsterId,
            oldLevel
          );

        },
        650
      );


      return;
    }


    /*
       通常の特訓成功
    */

    setTimeout(
      () => {

        renderMonsterParty();
        renderMonsterDetail();

      },
      700
    );

  }


  /*
     不正解
  */

  else {

    button.classList.add(
      "wrong"
    );


    document
      .querySelectorAll(
        ".training-answer"
      )
      .forEach(
        item => {

          if (
            Number(
              item.textContent
            ) ===
            Number(
              trainingAnswer
            )
          ) {

            item.classList.add(
              "correct"
            );

          }

        }
      );


    if (result) {

      result.innerHTML = `
<div class="training-miss">
  💦 特訓失敗！
</div>

        <div class="training-correct-answer">
          正解は ${trainingAnswer}！
        </div>

        <button
          type="button"
          class="training-retry"
          id="training-retry"
        >
          🔄 もう一度特訓する
        </button>
      `;

    }


    const retryButton =
      el("training-retry");


    if (retryButton) {

      retryButton.addEventListener(
        "click",
        () => {

          createTrainingQuestion();

        }
      );

    }

  }

}

/* =========================================================
   レベルアップ
   ========================================================= */

function showLevelUp(
  monsterId,
  oldLevel
) {

  levelupMonsterId =
    Number(monsterId);


  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(monsterId)
    );


  const data =
    getMonsterData(
      monsterId
    );


  if (
    !monster ||
    !data
  ) {
    return;
  }


  const monsterBox =
    el("levelup-monster");


  if (monsterBox) {

    monsterBox.innerHTML = `

      <div class="levelup-image">

        ${
          monsterVisual(
            monster,
            "levelup-monster-image"
          )
        }

      </div>

      <strong>
        ${monster.name}
      </strong>

    `;

  }


  const levelChange =
    el("level-change");


  if (levelChange) {

    levelChange.textContent =
      `Lv.${oldLevel} → Lv.${data.level}`;

  }


  const stats =
    document.querySelector(
      ".levelup-stats"
    );


  if (stats) {

    stats.innerHTML = `

      <div>
        ❤️ HP
        <strong>
          ${data.hp}
        </strong>
      </div>

      <div>
        ⚔️ こうげき
        <strong>
          ${data.attack}
        </strong>
      </div>

      <div>
        🛡️ ぼうぎょ
        <strong>
          ${data.defense}
        </strong>
      </div>

    `;

  }


  showScreen(
    "levelup-screen"
  );
}


/* =========================================================
   モンスター図鑑
   ========================================================= */

function renderMonsterBook() {

  const list =
    el("monster-list");


  if (!list) {
    return;
  }


  list.innerHTML =
    "";


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

        const data =
          getMonsterData(
            monster.id
          );


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

            ${
              monsterVisual(
                monster,
                "book-monster-image"
              )
            }

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
                Lv.${data.level}
              </span>

              <span>
                ${stars}
              </span>

            </div>

            <p>
              ${monster.desc}
            </p>

            <small>
              ${monster.stage}の段で仲間になる
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

            <div class="unknown-monster">
              ?
            </div>

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
              このモンスターを見つけるには、
              修行を進めよう。
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


  updateWorldStats();
}


/* =========================================================
   図鑑を開く
   ========================================================= */

function openBook(fromScreen) {

  returnScreen =
    fromScreen;


  renderMonsterBook();


  showScreen(
    "monster-book-screen"
  );
}


/* =========================================================
   ワールド情報
   ========================================================= */

function updateWorldStats() {

  const playerLevel =
    el("player-level");


  if (playerLevel) {

    /*
       現段階では
       クリア段数を冒険レベルとして表示
    */

    playerLevel.textContent =
      `Lv.${Math.max(
        1,
        clearedStages.length
      )}`;

  }


  const coins =
    el("player-coins");


  if (coins) {

    coins.textContent =
      battleWins * 5;

  }
}


/* =========================================================
   ワールドマップ
   ========================================================= */

function updateLakeAreaAvailability() {

  const area = el("lake-area");

  if (!area) {
    return;
  }

  const unlocked = forestProgress >= 5;

  area.disabled = !unlocked;
  area.classList.toggle("locked-area", !unlocked);

  const small = area.querySelector("small");

  if (small) {
    small.textContent = unlocked
      ? "湖へ冒険に出よう！"
      : "はじまりの森クリアで解放";
  }
}

function openWorld() {

  updateWorldStats();
  updateLakeAreaAvailability();
  updateLakeMap();

  showScreen(
    "world-screen"
  );
}


/* =========================================================
   はじまりの森を開く
   ========================================================= */

function openForest() {

  if (
    caughtMonsters.length === 0
  ) {

    alert(
      "冒険には仲間が必要です！\n\n" +
      "まず1の段をクリアして\n" +
      "モンスターを仲間にしよう！"
    );

    return;

  }


  if (
    !selectedMonsterId ||
    !caughtMonsters.includes(
      Number(selectedMonsterId)
    )
  ) {

    selectedMonsterId =
      Number(
        caughtMonsters[0]
      );

  }

   showScreen("forest-screen");

  updateForestMap();

  
}


/* =========================================================
   森マップ更新
   ========================================================= */

function updateForestMap() {

  const nodes =
    document.querySelectorAll(
      "#forest-screen .battle-node, " +
      "#forest-screen .boss-node"
    );


  nodes.forEach(
    node => {

      const number =
        Number(
          node.dataset.battle
        );


      const unlocked =
        number === 1 ||
        forestProgress >=
        number - 1;


      const cleared =
        forestProgress >=
        number;


      node.disabled =
        !unlocked;


      node.classList.toggle(
        "locked-node",
        !unlocked
      );


      node.classList.toggle(
        "cleared-node",
        cleared
      );


      const icon =
        node.querySelector(
          ".node-icon"
        );


      if (!icon) {
        return;
      }


      if (cleared) {

        icon.textContent =
          "⭐";

      }

      else if (
        number === 6
      ) {

        icon.textContent =
          unlocked
            ? "👹"
            : "🔒";

      }

      else {

        icon.textContent =
          unlocked
            ? "⚔️"
            : "🔒";

      }

    }
  );


  const goal =
    document.querySelector(
      "#forest-screen .goal-node"
    );


  if (goal) {

    goal.classList.toggle(
      "locked-node",
      forestProgress < 6
    );


    if (
      forestProgress >= 5
    ) {

      const icon =
        goal.querySelector(
          ".node-icon"
        );


      if (icon) {

        icon.textContent =
          "🏆";

      }

    }

  }


  const fill =
    el("forest-progress-fill");


  if (fill) {

    fill.style.width =
      `${
        forestProgress /
        6 *
        100
      }%`;

  }


  const text =
    el("forest-progress-text");


  if (text) {

    text.textContent =
      `${forestProgress} / 6 バトルクリア`;

  }
}


/* =========================================================
   森のバトル開始
   ========================================================= */

function startForestBattle(
  battleNumber
) {

  currentAdventureStage = "forest";

  const number =
    Number(
      battleNumber
    );


  if (
    number < 1 ||
    number > 6
  ) {
    return;
  }


  /*
     未解放なら開始不可
  */

  if (
    number > 1 &&
    forestProgress <
    number - 1
  ) {
    return;
  }


  if (
    caughtMonsters.length === 0
  ) {

    openForest();

    return;

  }


  if (
    !selectedMonsterId ||
    !caughtMonsters.includes(
      Number(selectedMonsterId)
    )
  ) {

    selectedMonsterId =
      Number(
        caughtMonsters[0]
      );

  }


  currentBattleNumber =
    number;


  /*
     モンスターが変わった場合は
     新しいモンスターのHPを使用
  */

  const selectedId =
    Number(
      selectedMonsterId
    );


  const monsterChanged =
    forestBattleMonsterId !==
    selectedId;


  /*
     初戦または
     モンスター変更時は満タン。

     ②～⑤では前戦のHPを持ち越す。
  */

  if (
    number === 1 ||
    monsterChanged ||
    forestCurrentHP <= 0
  ) {

    const data =
      getMonsterData(
        selectedId
      );


    if (!data) {
      return;
    }


    forestCurrentHP =
      data.hp;


    forestBattleMonsterId =
      selectedId;

  }


  /*
   敵決定
*/

if (number === 6) {

  currentWildMonster = {
    ...forestBoss,
    hp: forestBoss.hp
  };

} else {

  const base =
    forestEnemies[number - 1];

  currentWildMonster = {
    ...base,
    hp: base.hp,
    attack: base.attack
  };

}
   setupBattle();
   showScreen("battle-screen");
}
   
/* =========================================================
   バトル準備
   ========================================================= */

function setupBattle() {

  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(
          selectedMonsterId
        )
    );


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (
    !monster ||
    !data ||
    !currentWildMonster
  ) {

    return;

  }


  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer =
      null;

  }


  /*
     味方HP

     ★ここがHP持ち越しの核心。
  */

  battlePlayerMaxHP =
    data.hp;


  const currentStageHP =
    currentAdventureStage === "lake"
      ? lakeCurrentHP
      : forestCurrentHP;

  /*
     ステージ内の連戦ではHPを持ち越す。
     バトル①の開始時だけ満タンにする。
  */
  const shouldStartFullHP =
    currentBattleNumber === 1 ||
    currentStageHP <= 0;

  battlePlayerHP =
    shouldStartFullHP
      ? battlePlayerMaxHP
      : Math.min(
          currentStageHP,
          battlePlayerMaxHP
        );


  /*
     敵HP
  */

  battleEnemyMaxHP =
    currentWildMonster.hp;


  battleEnemyHP =
    currentWildMonster.hp;


  battleCombo =
    0;


  battleAnswering =
    false;


  /*
     ヘッダー
  */

  const battleNumber =
    el("battle-number");


  if (battleNumber) {

    battleNumber.textContent =
      currentBattleNumber === 6
        ? "👹 BOSS BATTLE"
        : `⚔️ BATTLE ${currentBattleNumber}`;

  }


  /*
     敵
  */

  const enemyName =
    el("enemy-name");


  const enemyLevel =
    el("enemy-level");


  const enemyImage =
    el("enemy-image");


  if (enemyName) {

    enemyName.textContent =
      currentBattleNumber === 6
        ? currentWildMonster.name
        : `野生の${currentWildMonster.name}`;

  }


  if (enemyLevel) {

    enemyLevel.textContent =
      `Lv.${currentWildMonster.level}`;

  }


  if (enemyImage) {

    if (
      currentWildMonster.image
    ) {

      enemyImage.innerHTML = `

        <img
          src="${currentWildMonster.image}"
          alt="${currentWildMonster.name}"
        >

      `;

    }

    else {

      enemyImage.textContent =
        currentBattleNumber === 6
          ? "👹"
          : "👾";

    }

  }


  /*
     味方
  */

  const playerName =
    el("player-monster-name");


  const playerLevel =
    el("player-monster-level");


  const playerImage =
    el("player-monster-image");


  if (playerName) {

    playerName.textContent =
      monster.name;

  }


  if (playerLevel) {

    playerLevel.textContent =
      `Lv.${data.level}`;

  }


  if (playerImage) {

    playerImage.innerHTML =
      monsterVisual(
        monster,
        "battle-monster-image"
      );

  }


  updateBattleHP();


  const isLake =
    currentAdventureStage === "lake";

  battleMessage(
    currentBattleNumber === 6
      ? (
          isLake
            ? "⚠️ 湖底の主が現れた！"
            : "⚠️ 森の守護者が現れた！"
        )
      : `⚔️ バトル${currentBattleNumber}！九九で攻撃しよう！`
  );

  const battleBackButton =
    el("battle-back-button");

  if (battleBackButton) {
    battleBackButton.textContent =
      isLake
        ? "← 湖のマップへ"
        : "← 森のマップへ";
  }

  const battleReturnButton =
    el("battle-return-forest");

  if (battleReturnButton) {
    battleReturnButton.textContent =
      isLake
        ? "🌊 湖のマップへ"
        : "🌳 森のマップへ";
  }


  /*
     問題開始は0.25秒後
  */

  battleTimer =
    setTimeout(
      () => {

        battleTimer =
          null;

        createBattleQuestion();

      },
      250
    );
}


/* =========================================================
   バトルメッセージ
   ========================================================= */

function battleMessage(text) {

  const message =
    el("battle-message");


  if (message) {

    message.textContent =
      text;

  }
}


/* =========================================================
   バトルHP表示
   ========================================================= */

function updateBattleHP() {

  const enemyPercent =
    battleEnemyMaxHP > 0
      ? Math.max(
          0,
          battleEnemyHP /
          battleEnemyMaxHP *
          100
        )
      : 0;


  const playerPercent =
    battlePlayerMaxHP > 0
      ? Math.max(
          0,
          battlePlayerHP /
          battlePlayerMaxHP *
          100
        )
      : 0;


  const enemyFill =
    el("enemy-hp-fill");


  const playerFill =
    el("player-hp-fill");


  const enemyText =
    el("enemy-hp-text");


  const playerText =
    el("player-hp-text");


  if (enemyFill) {

    enemyFill.style.width =
      `${enemyPercent}%`;

  }


  if (playerFill) {

    playerFill.style.width =
      `${playerPercent}%`;

  }


  if (enemyText) {

    enemyText.textContent =
      `${Math.max(
        0,
        battleEnemyHP
      )} / ${battleEnemyMaxHP}`;

  }


  if (playerText) {

    playerText.textContent =
      `${Math.max(
        0,
        battlePlayerHP
      )} / ${battlePlayerMaxHP}`;

  }
}


/* =========================================================
   ★★★ 森の九九問題 ★★★
   ========================================================= */

function createBattleQuestion() {

  /*
     戦闘終了後は問題を出さない
  */

  if (
    battleEnemyHP <= 0 ||
    battlePlayerHP <= 0
  ) {

    return;

  }


  battleAnswering =
    true;


  /*
     ★重要

     はじまりの森は
     1～3の段だけ。

     モンスターの段は関係ない。
  */

  const stage =
    getAdventureStage(
      currentAdventureStage
    );

  const a =
    Math.floor(
      Math.random() *
        (
          stage.questionMax -
          stage.questionMin +
          1
        )
    ) +
    stage.questionMin;


  const b =
    Math.floor(
      Math.random() * 9
    ) + 1;


  battleAnswer =
    a * b;


  const question =
    el("battle-question");


  if (question) {

    question.textContent =
      `${a} × ${b} = ?`;

  }


  createBattleAnswers();
}


/* =========================================================
   バトル選択肢
   ========================================================= */

function createBattleAnswers() {

  const container =
    el("battle-answers");


  if (!container) {
    return;
  }


  container.innerHTML =
    "";


  const choices =
    new Set();


  choices.add(
    battleAnswer
  );


  while (
    choices.size < 4
  ) {

    const wrong =
      Math.max(
        1,
        battleAnswer +
        Math.floor(
          Math.random() * 11
        ) - 5
      );


    choices.add(
      wrong
    );

  }


  [...choices]
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
          "battle-answer";


        button.textContent =
          value;


        button.addEventListener(
          "click",
          () =>
            checkBattleAnswer(
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


/* =========================================================
   バトル回答
   ========================================================= */

function checkBattleAnswer(
  answer,
  button
) {

  if (
    !battleAnswering
  ) {
    return;
  }


  battleAnswering =
    false;


  document
    .querySelectorAll(
      ".battle-answer"
    )
    .forEach(
      item =>
        item.disabled = true
    );


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (!data) {
    return;
  }


  /*
     正解
  */

  if (
    Number(answer) ===
    Number(battleAnswer)
  ) {

    button.classList.add(
      "correct"
    );


    battleCombo++;


    let damage =
      data.attack;


    /*
       3コンボ以上なら
       ボーナス攻撃
    */

    if (
      battleCombo >= 3
    ) {

      damage += 5;

    }


    battleEnemyHP =
      Math.max(
        0,
        battleEnemyHP -
        damage
      );


    battleMessage(
      battleCombo >= 3
        ? `🔥 ${battleCombo}コンボ！ ${damage}ダメージ！`
        : `💥 ${damage}ダメージ！`
    );


    updateBattleHP();


    /*
       敵撃破
    */

    if (
      battleEnemyHP <= 0
    ) {

      battleTimer =
        setTimeout(
          () => {

            battleTimer =
              null;

            battleWin();

          },
          500
        );


      return;

    }


    /*
       敵の反撃
    */

    battleTimer =
      setTimeout(
        () => {

          battleTimer =
            null;

          enemyAttack();

        },
        400
      );

  }


  /*
     不正解
  */

  else {

    button.classList.add(
      "wrong"
    );


    battleCombo =
      0;


    /*
       正解を光らせる
    */

    document
      .querySelectorAll(
        ".battle-answer"
      )
      .forEach(
        item => {

          if (
            Number(
              item.textContent
            ) ===
            Number(
              battleAnswer
            )
          ) {

            item.classList.add(
              "correct"
            );

          }

        }
      );


    battleMessage(
      `💡 正解は ${battleAnswer}！`
    );


    battleTimer =
      setTimeout(
        () => {

          battleTimer =
            null;

          enemyAttack();

        },
        450
      );

  }
}


/* =========================================================
   敵攻撃
   ========================================================= */

function enemyAttack() {

  if (
    battleEnemyHP <= 0 ||
    battlePlayerHP <= 0
  ) {

    return;

  }


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (!data) {
    return;
  }


  const damage =
    Math.max(
      1,
      currentWildMonster.attack -
      Math.floor(
        data.defense / 5
      )
    );


  battlePlayerHP =
    Math.max(
      0,
      battlePlayerHP -
      damage
    );


  /*
     ★HP持ち越し
  */

  if (
    currentAdventureStage === "lake"
  ) {
    lakeCurrentHP =
      battlePlayerHP;
  }
  else {
    forestCurrentHP =
      battlePlayerHP;
  }


  battleMessage(
    `👹 ${
      currentWildMonster.name
    }の攻撃！ ${damage}ダメージ！`
  );


  updateBattleHP();


  /*
     戦闘中HPを保存
  */

  saveGame();


  /*
     味方が倒れた
  */

  if (
    battlePlayerHP <= 0
  ) {

    battleTimer =
      setTimeout(
        () => {

          battleTimer =
            null;

          battleLose();

        },
        500
      );


    return;

  }


  /*
     次の問題
  */

  battleTimer =
    setTimeout(
      () => {

        battleTimer =
          null;

        createBattleQuestion();

      },
      300
    );
}


/* =========================================================
   バトル勝利
   ========================================================= */

function battleWin() {

  const data =
    getMonsterData(
      selectedMonsterId
    );

  if (!data) {
    return;
  }

  battleWins++;

  battleExpReward =
    currentBattleNumber === 6
      ? 100
      : 20 +
        currentBattleNumber *
        5;

  const oldLevel =
    data.level;
  
  const leveledUp =
    gainExp(
      selectedMonsterId,
      battleExpReward
    );

  const isLake =
    currentAdventureStage === "lake";

  /*
     現在HPと進行状況を
     ステージ別に保存。
  */
  if (isLake) {
    lakeCurrentHP =
      battlePlayerHP;

    if (
      currentBattleNumber >
      lakeProgress
    ) {
      lakeProgress =
        currentBattleNumber;
    }

    lakeBattleMonsterId =
      Number(selectedMonsterId);
  }
  else {
    forestCurrentHP =
      battlePlayerHP;

    if (
      currentBattleNumber >
      forestProgress
    ) {
      forestProgress =
        currentBattleNumber;
    }

    forestBattleMonsterId =
      Number(selectedMonsterId);
  }

  const icon =
    el("battle-result-icon");

  const title =
    el("battle-result-title");

  const message =
    el("battle-result-message");

  const exp =
    el("battle-exp");

  const coins =
    el("battle-coins");

  const next =
    el("battle-next-button");

  if (icon) {
    icon.textContent =
      currentBattleNumber === 6
        ? "🏆"
        : "⚔️";
  }

  if (title) {
    title.textContent =
      currentBattleNumber === 6
        ? (
            isLake
              ? "🌊 九九の湖クリア！"
              : "🌳 はじまりの森クリア！"
          )
        : "🎉 バトル勝利！";
  }

  if (message) {
    if (
      currentBattleNumber === 6
    ) {
      message.textContent =
        isLake
          ? "湖底の主を倒した！"
          : "森の守護者を倒した！";
    }
    else {
      message.textContent =
        `バトル${currentBattleNumber}クリア！\n` +
        `残りHP ${battlePlayerHP} / ${battlePlayerMaxHP}`;
    }
  }

  if (exp) {
    exp.textContent =
      `+${battleExpReward}`;
  }

  if (coins) {
    coins.textContent =
      `+${currentBattleNumber * 5}`;
  }

  if (next) {
    next.textContent =
      currentBattleNumber === 6
        ? "🗺️ 冒険マップへ"
        : `⚔️ バトル${currentBattleNumber + 1}へ`;
  }

  const returnButton =
    el("battle-return-forest");

  if (returnButton) {
    returnButton.textContent =
      isLake
        ? "🌊 湖のマップへ"
        : "🌳 森のマップへ";
  }

  if (isLake) {
    updateLakeMap();
  }
  else {
    updateForestMap();
  }

  updateWorldStats();

  saveGame();

  showScreen(
    "battle-result-screen"
  );

  if (leveledUp) {
    setTimeout(
      () => {
        showLevelUp(
          selectedMonsterId,
          oldLevel
        );
      },
      700
    );
  }
}


/* =========================================================
   バトル敗北


/* =========================================================
   バトル敗北
   ========================================================= */

function battleLose() {

  const icon =
    el("battle-result-icon");

  const title =
    el("battle-result-title");

  const message =
    el("battle-result-message");

  const exp =
    el("battle-exp");

  const coins =
    el("battle-coins");

  const next =
    el("battle-next-button");

  if (icon) {
    icon.textContent = "💦";
  }

  if (title) {
    title.textContent =
      "今回は負けてしまった…";
  }

  if (message) {
    message.textContent =
      "もっと育成して、もう一度挑戦しよう！";
  }

  if (exp) {
    exp.textContent = "+0";
  }

  if (coins) {
    coins.textContent = "+0";
  }

  if (next) {
    next.textContent =
      "🔄 最初から挑戦";
  }

  const returnButton =
    el("battle-return-forest");

  if (returnButton) {
    returnButton.textContent =
      currentAdventureStage === "lake"
        ? "🌊 湖のマップへ"
        : "🌳 森のマップへ";
  }

  if (
    currentAdventureStage === "lake"
  ) {
    lakeCurrentHP = 0;
    lakeBattleMonsterId = null;
    updateLakeMap();
  }
  else {
    forestProgress = 0;
    forestCurrentHP = 0;
    forestBattleMonsterId = null;
    updateForestMap();
  }

  saveGame();

  showScreen(
    "battle-result-screen"
  );
}


/* =========================================================
   次のバトル


/* =========================================================
   次のバトル
   ========================================================= */

function nextBattle() {

  const isLake =
    currentAdventureStage === "lake";

  /*
     敗北後は、そのステージの①から再挑戦。
  */
  if (
    battlePlayerHP <= 0
  ) {

    if (isLake) {
      lakeProgress = 0;
      lakeCurrentHP = 0;
      lakeBattleMonsterId = null;
      saveGame();
      startLakeBattle(1);
    }
    else {
      forestProgress = 0;
      forestCurrentHP = 0;
      forestBattleMonsterId = null;
      saveGame();
      startForestBattle(1);
    }

    return;
  }

  /*
     ボス撃破後はワールドマップへ。
  */
  if (
    currentBattleNumber === 6
  ) {

    if (isLake) {
      lakeCurrentHP = 0;
      lakeBattleMonsterId = null;
    }
    else {
      forestCurrentHP = 0;
      forestBattleMonsterId = null;
    }

    saveGame();
    openWorld();

    return;
  }

  const next =
    currentBattleNumber + 1;

  /*
     今のバトル終了時HPを必ず保存してから
     次のバトルを開始する。
  */
  if (isLake) {

    lakeCurrentHP =
      battlePlayerHP;

    lakeBattleMonsterId =
      Number(selectedMonsterId);

    /*
       現在のバトルは勝利済みなので、
       次の番号をそのまま開始する。
       進行度の判定に依存しない。
    */
    lakeProgress =
      Math.max(
        lakeProgress,
        currentBattleNumber
      );

    saveAdventureStage("lake");
    saveGame();

    startLakeBattle(next);

  }
  else {

    forestCurrentHP =
      battlePlayerHP;

    forestBattleMonsterId =
      Number(selectedMonsterId);

    forestProgress =
      Math.max(
        forestProgress,
        currentBattleNumber
      );

    saveAdventureStage("forest");
    saveGame();

    startForestBattle(next);
  }
}


/* =========================================================
   森へ戻る




/* =========================================================
   森へ戻る
   ========================================================= */

function battleReturnAdventure() {

  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer =
      null;

  }


  battleAnswering =
    false;


  /*
     HPを保存
  */

  if (
    battlePlayerMaxHP > 0
  ) {

    if (
      currentAdventureStage === "lake"
    ) {
      lakeCurrentHP =
        battlePlayerHP;
    }
    else {
      forestCurrentHP =
        battlePlayerHP;
    }

  }


  saveGame();


  if (
    currentAdventureStage === "lake"
  ) {
    updateLakeMap();

    showScreen(
      "lake-screen"
    );
  }
  else {
    updateForestMap();

    showScreen(
      "forest-screen"
    );
  }
}


/* =========================================================
   バトル画面から森へ
   ========================================================= */

function battleBackAdventure() {

  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer =
      null;

  }


  battleAnswering =
    false;


  if (
    battlePlayerMaxHP > 0
  ) {

    if (
      currentAdventureStage === "lake"
    ) {
      lakeCurrentHP =
        battlePlayerHP;
    }
    else {
      forestCurrentHP =
        battlePlayerHP;
    }

  }


  saveGame();


  if (
    currentAdventureStage === "lake"
  ) {
    updateLakeMap();

    showScreen(
      "lake-screen"
    );
  }
  else {
    updateForestMap();

    showScreen(
      "forest-screen"
    );
  }
}


/* =========================================================
   セーブデータリセット
   ========================================================= */

function resetGame() {

  const answer =
    confirm(
      "⚠️ セーブデータをすべて消去します。\n\n" +
      "・九九のクリア状況\n" +
      "・星評価\n" +
      "・仲間モンスター\n" +
      "・育成データ\n" +
      "・冒険記録\n" +
      "・はじまりの森の進行\n\n" +
      "すべて最初からになります。\n\n" +
      "本当に消去しますか？"
    );


  if (!answer) {
    return;
  }


  try {

    localStorage.removeItem(
      SAVE_KEY
    );

  }

  catch (error) {

    console.error(
      error
    );

  }


  /*
     ゲームデータ初期化
  */

  clearedStages = [];
  stageStars = {};
  caughtMonsters = [];
  monsterData = {};

  adventureUnlocked =
    false;

  battleWins =
    0;


  /*
     修行
  */

  currentStage =
    1;

  questionNumber =
    0;

  correctCount =
    0;

  combo =
    0;

  maxCombo =
    0;

  currentAnswer =
    0;

  answering =
    false;


  /*
     モンスター
  */

  selectedMonsterId =
    null;

  levelupMonsterId =
    null;


  /*
     森
  */

  forestProgress =
    0;

  forestCurrentHP =
    0;

  forestBattleMonsterId =
    null;


  /*
     湖
  */

  lakeProgress =
    0;

  lakeCurrentHP =
    0;

  lakeBattleMonsterId =
    null;


  /*
     バトル
  */

  currentBattleNumber =
    0;

  currentWildMonster =
    null;

  battlePlayerHP =
    0;

  battlePlayerMaxHP =
    0;

  battleEnemyHP =
    0;

  battleEnemyMaxHP =
    0;

  battleAnswer =
    0;

  battleAnswering =
    false;

  battleCombo =
    0;


  /*
     タイマー停止
  */

  if (questionTimer) {

    clearTimeout(
      questionTimer
    );

    questionTimer =
      null;

  }


  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer =
      null;

  }


  createStageList();

  updateForestMap();

  updateWorldStats();


  alert(
    "✨ セーブデータをリセットしました！\n\n" +
    "1の段から新しい冒険を始めよう！"
  );


  showScreen(
    "training-screen"
  );
}



/* =========================================================
   九九の湖
   ========================================================= */

function openLake() {
  if (!isLakeUnlocked()) {
    alert("九九の湖は、はじまりの森をクリアすると解放されます！");
    return;
  }

  if (caughtMonsters.length === 0) {
    alert("冒険には仲間が必要です！\n\nまず修行してモンスターを仲間にしよう！");
    return;
  }

  if (!selectedMonsterId || !caughtMonsters.includes(Number(selectedMonsterId))) {
    selectedMonsterId = Number(caughtMonsters[0]);
  }

  updateLakeMap();
  showScreen("lake-screen");
}

function updateLakeMap() {
  const nodes = document.querySelectorAll(
    "#lake-screen .battle-node, #lake-screen .boss-node"
  );

  nodes.forEach(node => {
    const number = Number(node.dataset.battle);
    const unlocked = number === 1 || lakeProgress >= number - 1;
    const cleared = lakeProgress >= number;

    node.disabled = !unlocked;
    node.classList.toggle("locked-node", !unlocked);
    node.classList.toggle("cleared-node", cleared);

    const icon = node.querySelector(".node-icon");
    if (!icon) return;

    if (cleared) icon.textContent = "⭐";
    else if (number === 5) icon.textContent = unlocked ? "👑" : "🔒";
    else icon.textContent = unlocked ? "⚔️" : "🔒";
  });

  const fill = el("lake-progress-fill");
  if (fill) fill.style.width = `${lakeProgress / 5 * 100}%`;

  const progress = el("lake-progress-text");
  if (progress) progress.textContent = `${lakeProgress} / 5 バトルクリア`;
}

function startLakeBattle(battleNumber) {

  const number =
    Number(battleNumber);

  if (
    number < 1 ||
    number > 6
  ) {
    return;
  }

  if (
    number > 1 &&
    lakeProgress < number - 1
  ) {
    return;
  }

  if (
    caughtMonsters.length === 0
  ) {
    openLake();
    return;
  }

  if (
    !selectedMonsterId ||
    !caughtMonsters.includes(
      Number(selectedMonsterId)
    )
  ) {
    selectedMonsterId =
      Number(caughtMonsters[0]);
  }

  const selectedId =
    Number(selectedMonsterId);

  const data =
    getMonsterData(selectedId);

  if (!data) {
    return;
  }

  currentAdventureStage =
    "lake";

  currentBattleNumber =
    number;

  const monsterChanged =
    lakeBattleMonsterId !==
    selectedId;

  /*
     ①またはモンスター変更時は満タン。
     ②～⑤は前戦のHPを持ち越す。
  */
  if (
    number === 1 ||
    monsterChanged ||
    lakeCurrentHP <= 0
  ) {
    lakeCurrentHP =
      data.hp;

    lakeBattleMonsterId =
      selectedId;
  }

  /*
     湖の敵を決定。
     ⑤は湖底の主。
  */
  if (
    number === 5
  ) {
    currentWildMonster = {
      ...adventureStages.lake.boss
    };
  }
  else {
    const base =
      adventureStages.lake.enemies[
        Math.floor(
          Math.random() *
          adventureStages.lake.enemies.length
        )
      ];

    currentWildMonster = {
      ...base,

      /*
         後半ほど少しだけ強くする。
         基本攻撃力は湖の設定値を使用。
      */
      hp:
        base.hp +
        (number - 1) * 2,

      attack:
        base.attack +
        (number - 1)
    };
  }

  saveAdventureStage("lake");

  setupBattle();

  showScreen(
    "battle-screen"
  );
}




/* =========================================================
   ボタン接続
   ========================================================= */


/* タイトル → 修行 */

el("start-button")?.addEventListener(
    "click",
    () => {

        createStageList();

        showScreen(
            "training-screen"
        );

    }
);


/* 修行クイズ → 修行道場 */

el("back-training")?.addEventListener(
  "click",
  () => {

    createStageList();

    showScreen(
      "training-screen"
    );

  }
);


/* 修行結果 → 次 */

el("next-stage")?.addEventListener(
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


/* 修行結果 → 再挑戦 */

el("retry-stage")?.addEventListener(
  "click",
  () => {

    startTraining(
      currentStage
    );

  }
);


/* 修行結果 → 図鑑 */

el("monster-book-button")?.addEventListener(
  "click",
  () => {

    openBook(
      "result-screen"
    );

  }
);


/* 冒険解禁画面 → ワールド */

el("adventure-button")?.addEventListener(
  "click",
  openWorld
);


/* ワールド → 戻る */

el("world-back-button")?.addEventListener(
  "click",
  () => {

    showScreen(
      "training-screen"
    );

  }
);


/* ワールド → 森 */

el("forest-area")?.addEventListener(
  "click",
  openForest
);

/* ワールド → 湖 */
el("lake-area")?.addEventListener(
  "click",
  openLake
);

/* 湖のバトルノード */
document
  .querySelectorAll(
    "#lake-screen .battle-node, #lake-screen .boss-node"
  )
  .forEach(node => {
    node.addEventListener("click", () => {
      startLakeBattle(Number(node.dataset.battle));
    });
  });

/* 湖 → ワールド */
el("lake-back-button")?.addEventListener(
  "click",
  openWorld
);


/* 森 → ワールド */

el("forest-back-button")?.addEventListener(
  "click",
  openWorld
);


/* 森のバトルノード */

document
  .querySelectorAll(
    "#forest-screen .battle-node, " +
    "#forest-screen .boss-node"
  )
  .forEach(
    node => {

      node.addEventListener(
        "click",
        () => {

          const number =
            Number(
              node.dataset.battle
            );


          startForestBattle(
            number
          );

        }
      );

    }
  );


/* バトル → 森 */

el("battle-back-button")?.addEventListener(
  "click",
  battleBackAdventure
);


/* バトル結果 → 次 */

el("battle-next-button")?.addEventListener(
  "click",
  nextBattle
);


/* バトル結果 → 森 */

el("battle-return-forest")?.addEventListener(
  "click",
  battleReturnAdventure
);


/* 育成 → 開く */

el("monster-button")?.addEventListener(
  "click",
  openMonsterScreen
);


/* 育成 → 冒険 */

el("back-world")?.addEventListener(
  "click",
  openWorld
);


/* レベルアップ → 育成 */

el("levelup-button")?.addEventListener(
  "click",
  () => {

    renderMonsterParty();

    renderMonsterDetail();

    showScreen(
      "training-monster-screen"
    );

  }
);


/* 図鑑 → 戻る */

el("book-back")?.addEventListener(
  "click",
  () => {

    showScreen(
      returnScreen
    );

  }
);


/* リセット */

el("reset-data")?.addEventListener(
  "click",
  resetGame
);


/* 下部メニュー → 修行 */

el("training-button")?.addEventListener(
  "click",
  () => {

    createStageList();

    showScreen(
      "training-screen"
    );

  }
);


/* 下部メニュー → 冒険 */

el("world-button")?.addEventListener(
  "click",
  openWorld
);


/* 下部メニュー → 育成 */

el("monster-button")?.addEventListener(
  "click",
  openMonsterScreen
);


/* =========================================================
   ページ終了時セーブ
   ========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    saveGame();

  }
);


/* =========================================================
   起動
   ========================================================= */

loadGame();
updateLakeAreaAvailability();

createStageList();

updateForestMap();

updateWorldStats();


/*
   最初はタイトル
*/

showScreen(
  "title-screen"
);


/* =========================================================
   起動確認
   ========================================================= */

console.log(
  "🎮 9×9モンスターズ 起動！"
);

console.log(
  "🥋 九九修行 ONLINE"
);

console.log(
  "👾 モンスター ONLINE"
);

console.log(
  "💪 育成 ONLINE"
);

console.log(
  "📖 図鑑 ONLINE"
);

console.log(
  "🗺️ 冒険 ONLINE"
);

console.log(
  "🌳 はじまりの森 ONLINE"
);

console.log(
  "⚔️ 5連戦バトル ONLINE"
);

console.log(
  "🧮 森の出題範囲：1～3の段"
);

console.log(
  "❤️ HP持ち越し ONLINE"
);

console.log(
  "📱 画面切り替え時：最上部へ"
);
/* =========================================================
   GitHub 最終更新日時
========================================================= */

async function showLastUpdate() {

  const updateTime =
    document.getElementById("update-time");

  if (!updateTime) {
    return;
  }

  try {

    const response =
      await fetch(
        "https://api.github.com/repos/nigo0408/9x9monster/commits?per_page=1"
      );

    if (!response.ok) {
      throw new Error(
        "GitHub API error"
      );
    }

    const commits =
      await response.json();

    if (
      !commits.length ||
      !commits[0].commit
    ) {

      throw new Error(
        "更新日時を取得できませんでした"
      );

    }

    const date =
      new Date(
        commits[0].commit.author.date
      );


    /*
       日本時間で
       月/日 時:分
       に変換
    */

    const month =
      date.getMonth() + 1;

    const day =
      date.getDate();

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");


    updateTime.textContent =
      `Last Update　${month}/${day} ${hours}:${minutes}`;

  }

  catch (error) {

    console.error(
      "最終更新日時の取得に失敗しました:",
      error
    );

    updateTime.textContent =
      "Last Update　---";

  }
}


/*
   ゲーム起動時に取得
*/

showLastUpdate();


/* =========================================================
   起動時の安全処理
   ========================================================= */
window.addEventListener("error", event => {
  console.error("9×9モンスターズ:", event.error || event.message);
});

document.addEventListener("click", () => {

  const opBgm = el("op-bgm");

  if (
    opBgm &&
    document
      .getElementById("title-screen")
      ?.classList.contains("active")
  ) {
    opBgm.play();
  }

});
