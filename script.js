"use strict";

/* =========================================================
   9×9モンスターズ
   script.js 完全統合版

   ・九九修行
   ・セーブ / ロード
   ・モンスターGET
   ・モンスター育成
   ・モンスター図鑑
   ・冒険マップ
   ・はじまりの森
   ・5連戦バトル
   ・バトル進行セーブ
   ========================================================= */


// =========================================================
// セーブ
// =========================================================

const SAVE_KEY = "9x9-monsters-save-v7";


// =========================================================
// モンスター
// =========================================================

const monsters = [

  {
    id: 1,
    stage: 1,
    name: "トロール",
    type: "いわタイプ",
    rare: "★",
    desc: "のんびりしているが力持ち。",
    image: null,
    baseHP: 30,
    baseAttack: 12,
    baseDefense: 15
  },

  {
    id: 2,
    stage: 2,
    name: "スライム",
    type: "みずタイプ",
    rare: "★",
    desc: "ぷるぷるしている不思議な仲間。",
    image: null,
    baseHP: 25,
    baseAttack: 10,
    baseDefense: 12
  },

  {
    id: 3,
    stage: 3,
    name: "ピヨコ",
    type: "ひかりタイプ",
    rare: "★",
    desc: "小さな体で元気いっぱい。",
    image: null,
    baseHP: 22,
    baseAttack: 13,
    baseDefense: 10
  },

  {
    id: 4,
    stage: 4,
    name: "ゴブリン",
    type: "やみタイプ",
    rare: "★",
    desc: "ちょっといたずら好きなモンスター。",
    image: null,
    baseHP: 35,
    baseAttack: 15,
    baseDefense: 13
  },

  {
    id: 5,
    stage: 5,
    name: "ロックン",
    type: "いわタイプ",
    rare: "★★",
    desc: "全身が岩でできている。",
    image: null,
    baseHP: 45,
    baseAttack: 18,
    baseDefense: 22
  },

  {
    id: 6,
    stage: 6,
    name: "ウルフ",
    type: "かぜタイプ",
    rare: "★★",
    desc: "素早さが自慢のモンスター。",
    image: null,
    baseHP: 38,
    baseAttack: 22,
    baseDefense: 15
  },

  {
    id: 7,
    stage: 7,
    name: "ファントム",
    type: "やみタイプ",
    rare: "★★",
    desc: "夜の森に現れる謎のモンスター。",
    image: null,
    baseHP: 42,
    baseAttack: 24,
    baseDefense: 18
  },

  {
    id: 8,
    stage: 8,
    name: "ドラゴン",
    type: "ほのおタイプ",
    rare: "★★★",
    desc: "強大な力を持つドラゴン。",
    image: null,
    baseHP: 60,
    baseAttack: 30,
    baseDefense: 25
  },

  {
    id: 9,
    stage: 9,
    name: "キングドラゴン",
    type: "ほのおタイプ",
    rare: "★★★",
    desc: "九九を極めた者だけが出会える王。",
    image: null,
    baseHP: 80,
    baseAttack: 40,
    baseDefense: 35
  }

];


// =========================================================
// 森の敵
// =========================================================

const forestEnemies = [

  {
    name: "スライム",
    icon: "🟢",
    level: 1,
    hp: 24,
    attack: 5
  },

  {
    name: "きのこモン",
    icon: "🍄",
    level: 2,
    hp: 30,
    attack: 6
  },

  {
    name: "ゴブリン",
    icon: "👺",
    level: 2,
    hp: 36,
    attack: 7
  },

  {
    name: "ウルフ",
    icon: "🐺",
    level: 3,
    hp: 42,
    attack: 8
  }

];


// =========================================================
// 森のボス
// =========================================================

const forestBoss = {

  name: "森の守護者",
  icon: "👹",
  level: 5,
  hp: 70,
  attack: 10

};


// =========================================================
// ゲームデータ
// =========================================================

let clearedStages = [];

let stageStars = {};

let caughtMonsters = [];

let monsterData = {};

let adventureUnlocked = false;

let battleWins = 0;

let coins = 0;

let playerLevel = 1;


// 森の進行
// 0 = 未クリア
// 1 = バトル①クリア
// 2 = バトル②クリア
// 3 = バトル③クリア
// 4 = バトル④クリア
// 5 = ボス撃破

let forestProgress = 0;


// =========================================================
// 修行状態
// =========================================================

let currentStage = 1;

let questionNumber = 0;

let correctCount = 0;

let combo = 0;

let maxCombo = 0;

let currentAnswer = 0;

let answering = false;

let questionTimer = null;


// =========================================================
// モンスター状態
// =========================================================

let selectedMonsterId = null;

let returnScreen = "training-screen";


// =========================================================
// バトル状態
// =========================================================

let currentBattleNumber = 0;

let currentEnemy = null;

let battlePlayerHP = 0;

let battlePlayerMaxHP = 0;

let battleEnemyHP = 0;

let battleEnemyMaxHP = 0;

let battleAnswer = 0;

let battleAnswering = false;

let battleTimer = null;

let battleCombo = 0;

let battleExpReward = 0;

let battleCoinReward = 0;

let battleOldLevel = 1;

let battleLeveledUp = false;


// =========================================================
// DOM
// =========================================================

function el(id) {

  return document.getElementById(id);

}


function onClick(id, handler) {

  const target = el(id);

  if (!target) {

    return;

  }

  target.addEventListener(
    "click",
    handler
  );

}


// =========================================================
// 画面切り替え
// =========================================================

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );

    });


  const target = el(id);

  if (!target) {

    console.error(
      "画面が見つかりません:",
      id
    );

    return;

  }


  target.classList.add(
    "active"
  );


  updateMenu(id);

}


// =========================================================
// 下部メニュー
// =========================================================

function updateMenu(screenId) {

  const menu = el("menu");

  if (!menu) {

    return;

  }


  if (
    screenId === "title-screen"
  ) {

    menu.classList.add(
      "hidden"
    );

  }

  else {

    menu.classList.remove(
      "hidden"
    );

  }

}


// =========================================================
// モンスターデータ
// =========================================================

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


function getMonsterData(monsterId) {

  const id = Number(
    monsterId
  );


  if (!monsterData[id]) {

    const monster =
      monsters.find(
        item =>
          item.id === id
      );


    if (!monster) {

      return null;

    }


    monsterData[id] =
      createMonsterData(
        monster
      );

  }


  return monsterData[id];

}


function requiredExp(level) {

  return level * 100;

}


// =========================================================
// セーブ
// =========================================================

function saveGame() {

  const data = {

    version: 9,

    clearedStages:
      [...clearedStages],

    stageStars:
      {...stageStars},

    caughtMonsters:
      [...caughtMonsters],

    monsterData:
      {...monsterData},

    adventureUnlocked,

    battleWins,

    coins,

    playerLevel,

    forestProgress

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


// =========================================================
// ロード
// =========================================================

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
            value =>
              value >= 1 &&
              value <= 9
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
          .map(Number);

    }


    if (
      data.monsterData &&
      typeof data.monsterData ===
      "object"
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


    coins =
      Number(
        data.coins
      ) || 0;


    playerLevel =
      Number(
        data.playerLevel
      ) || 1;


    forestProgress =
      Number(
        data.forestProgress
      ) || 0;


    if (
      forestProgress < 0
    ) {

      forestProgress = 0;

    }


    if (
      forestProgress > 5
    ) {

      forestProgress = 5;

    }

  }

  catch (error) {

    console.error(
      "ロード失敗:",
      error
    );

  }

}


// =========================================================
// セーブ表示
// =========================================================

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


// =========================================================
// 修行ステージ
// =========================================================

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
          ${cleared ? "⭐" : "🥋"}
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


// =========================================================
// 修行開始
// =========================================================

function startTraining(stage) {

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


// =========================================================
// 修行問題
// =========================================================

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


  const question =
    el("question");


  if (question) {

    question.textContent =
      `${currentStage} × ${questionNumber} = ?`;

  }


  const progressText =
    el("progress-text");


  if (progressText) {

    progressText.textContent =
      `第${questionNumber}問 / 9問`;

  }


  const fill =
    el("progress-fill");


  if (fill) {

    fill.style.width =
      `${
        (
          (questionNumber - 1)
          / 9
          * 100
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


// =========================================================
// 修行選択肢
// =========================================================

function createAnswers() {

  const container =
    el("answers");


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


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


// =========================================================
// 修行回答
// =========================================================

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

    maxCombo =
      Math.max(
        maxCombo,
        combo
      );


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


  questionTimer =
    setTimeout(
      () => {

        questionTimer =
          null;

        createQuestion();

      },
      450
    );

}


// =========================================================
// 星評価
// =========================================================

function getStars(score) {

  if (score === 9) {

    return "⭐⭐⭐";

  }


  if (score >= 8) {

    return "⭐⭐☆";

  }


  return "⭐☆☆";

}


// =========================================================
// 段のモンスター
// =========================================================

function getMonsterForStage(stage) {

  return monsters.find(
    monster =>
      monster.stage ===
      Number(stage)
  );

}


// =========================================================
// モンスターGET
// =========================================================

function catchMonster(monsterId) {

  const id =
    Number(monsterId);


  if (
    !caughtMonsters.includes(id)
  ) {

    caughtMonsters.push(id);

    getMonsterData(id);

    return true;

  }


  return false;

}


// =========================================================
// モンスター表示
// =========================================================

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


// =========================================================
// GET表示
// =========================================================

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


  const rewardMonster =
    el("reward-monster");


  const rewardName =
    el("reward-name");


  const rewardDescription =
    el("reward-description");


  if (rewardMonster) {

    rewardMonster.innerHTML =
      monsterVisual(
        monster,
        "reward-monster-image"
      );

  }


  if (rewardName) {

    rewardName.textContent =
      monster.name;

  }


  if (rewardDescription) {

    rewardDescription.textContent =
      isNew
        ? `${monster.type}　${monster.rare}`
        : "また仲間に会えた！";

  }


  const title =
    box.querySelector(
      ".reward-title"
    );


  if (title) {

    title.textContent =
      isNew
        ? "🎉 新しい仲間をGET！"
        : "✨ 仲間と再会！";

  }

}


// =========================================================
// 修行終了
// =========================================================

function finishTraining() {

  const stars =
    getStars(
      correctCount
    );


  const correct =
    el("result-correct");


  const comboResult =
    el("result-combo");


  const starsResult =
    el("result-stars");


  if (correct) {

    correct.textContent =
      `${correctCount} / 9`;

  }


  if (comboResult) {

    comboResult.textContent =
      maxCombo;

  }


  if (starsResult) {

    starsResult.textContent =
      stars;

  }


  const reward =
    el("reward-box");


  if (reward) {

    reward.classList.add(
      "hidden"
    );

  }


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


    const starValue =
      stars === "⭐⭐⭐"
        ? 3
        : stars === "⭐⭐☆"
          ? 2
          : 1;


    const oldStars =
      stageStars[
        currentStage
      ] || "";


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
          ? "すべての九九を極めた！"
          : `${currentStage + 1}の段が解放された！`;

    }


    const next =
      el("next-stage");


    if (next) {

      next.style.display =
        "block";


      next.textContent =
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


    const next =
      el("next-stage");


    if (title) {

      title.textContent =
        "もう少し修行じゃ！";

    }


    if (message) {

      message.textContent =
        "8問以上正解すると合格だよ！";

    }


    if (next) {

      next.style.display =
        "none";

    }

  }


  showScreen(
    "result-screen"
  );

}


// =========================================================
// 育成
// =========================================================

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


// =========================================================
// 育成パーティ
// =========================================================

function renderMonsterParty() {

  const party =
    el("monster-party");


  if (!party) {

    return;

  }


  party.innerHTML =
    "";


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


// =========================================================
// 育成詳細
// =========================================================

function renderMonsterDetail() {

  const detail =
    el("monster-detail");


  if (!detail) {

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

    detail.innerHTML =
      "";

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
      data.level
    );


  const percent =
    Math.min(
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
          EXP
          ${data.exp}
          /
          ${required}
        </span>

      </div>

      <div class="exp-bar">

        <div
          style="width:${percent}%"
        ></div>

      </div>

      <div class="stats-grid">

        <div>
          <span>❤️ HP</span>
          <strong>${data.hp}</strong>
        </div>

        <div>
          <span>⚔️ こうげき</span>
          <strong>${data.attack}</strong>
        </div>

        <div>
          <span>🛡️ ぼうぎょ</span>
          <strong>${data.defense}</strong>
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


  onClick(
    "train-monster",
    trainMonster
  );

}


// =========================================================
// EXP
// =========================================================

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


  data.exp +=
    Number(amount);


  let leveledUp =
    false;


  while (
    data.exp >=
    requiredExp(
      data.level
    )
  ) {

    data.exp -=
      requiredExp(
        data.level
      );


    data.level++;

    data.hp += 5;

    data.attack += 2;

    data.defense += 2;


    leveledUp =
      true;

  }


  saveGame();


  return leveledUp;

}


// =========================================================
// 育成特訓
// =========================================================

function trainMonster() {

  if (!selectedMonsterId) {

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


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (
    !monster ||
    !data
  ) {

    return;

  }


  const b =
    Math.floor(
      Math.random() * 9
    ) + 1;


  const answer =
    monster.stage * b;


  const response =
    prompt(
      `🥋 ${monster.name}の特訓！\n\n` +
      `${monster.stage} × ${b} = ?\n\n` +
      `答えを入力してください。`
    );


  if (
    response === null
  ) {

    return;

  }


  const userAnswer =
    Number(
      response.trim()
    );


  if (
    userAnswer !== answer
  ) {

    alert(
      `💡 正解は ${answer} です！`
    );

    return;

  }


  const oldLevel =
    data.level;


  const leveledUp =
    gainExp(
      selectedMonsterId,
      25
    );


  if (leveledUp) {

    showLevelUp(
      selectedMonsterId,
      oldLevel
    );

  }

  else {

    alert(
      `✨ 正解！\n\n` +
      `+25 EXP\n\n` +
      `${monster.name}は元気に成長中！`
    );


    renderMonsterParty();

    renderMonsterDetail();

  }

}


// =========================================================
// レベルアップ
// =========================================================

function showLevelUp(
  monsterId,
  oldLevel
) {

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


  const hp =
    el("levelup-hp");


  const attack =
    el("levelup-attack");


  const defense =
    el("levelup-defense");


  if (hp) {

    hp.textContent =
      "+5";

  }


  if (attack) {

    attack.textContent =
      "+2";

  }


  if (defense) {

    defense.textContent =
      "+2";

  }


  showScreen(
    "levelup-screen"
  );

}


// =========================================================
// 図鑑
// =========================================================

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

}


// =========================================================
// 図鑑を開く
// =========================================================

function openBook(fromScreen) {

  returnScreen =
    fromScreen;


  renderMonsterBook();


  showScreen(
    "monster-book-screen"
  );

}


// =========================================================
// 冒険マップ
// =========================================================

function updateWorldStats() {

  const level =
    el("player-level");


  const coin =
    el("player-coins");


  if (level) {

    level.textContent =
      `Lv.${playerLevel}`;

  }


  if (coin) {

    coin.textContent =
      coins;

  }

}


function openWorld() {

  updateWorldStats();

  updateForestButton();

  showScreen(
    "world-screen"
  );

}


// =========================================================
// 森ボタン
// =========================================================

function updateForestButton() {

  const button =
    el("forest-area");


  if (!button) {

    return;

  }


  // 仲間がいない場合だけロック

  button.disabled =
    caughtMonsters.length === 0;


  const small =
    button.querySelector(
      "small"
    );


  if (!small) {

    return;

  }


  if (
    caughtMonsters.length === 0
  ) {

    small.textContent =
      "1の段をクリアして仲間をGET！";

  }

  else if (
    forestProgress >= 5
  ) {

    small.textContent =
      "🏆 はじまりの森クリア！";

  }

  else {

    small.textContent =
      `探索 ${forestProgress} / 5`;

  }

}


// =========================================================
// はじまりの森
// =========================================================

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


  if (!selectedMonsterId) {

    selectedMonsterId =
      Number(
        caughtMonsters[0]
      );

  }


  updateForestMap();


  showScreen(
    "forest-screen"
  );

}


// =========================================================
// 森マップ更新
// =========================================================

function updateForestMap() {

  const nodes =
    document.querySelectorAll(
      "#forest-screen .battle-node"
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


      if (icon) {

        if (cleared) {

          icon.textContent =
            "⭐";

        }

        else if (
          number === 5
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

    }
  );


  const goal =
    document.querySelector(
      "#forest-screen .goal-node"
    );


  if (goal) {

    goal.classList.toggle(
      "locked-node",
      forestProgress < 5
    );

  }


  const fill =
    el("forest-progress-fill");


  if (fill) {

    fill.style.width =
      `${forestProgress / 5 * 100}%`;

  }


  const text =
    el("forest-progress-text");


  if (text) {

    text.textContent =
      `${forestProgress} / 5 バトルクリア`;

  }

}


// =========================================================
// 森バトル開始
// =========================================================

function startForestBattle(number) {

  number =
    Number(number);


  if (
    number < 1 ||
    number > 5
  ) {

    return;

  }


  // ①は常に可能
  // ②なら①、③なら②……
  // をクリアしている必要がある

  const unlocked =
    number === 1 ||
    forestProgress >=
    number - 1;


  if (!unlocked) {

    return;

  }


  // 既にクリア済みのステージは再戦可能

  currentBattleNumber =
    number;


  if (
    number === 5
  ) {

    currentEnemy = {

      ...forestBoss

    };

  }

  else {

    const base =
      forestEnemies[
        Math.floor(
          Math.random() *
          forestEnemies.length
        )
      ];


    currentEnemy = {

      ...base,

      hp:
        base.hp +
        (number - 1) * 4

    };

  }


  setupBattle();


  showScreen(
    "battle-screen"
  );

}


// =========================================================
// バトル準備
// =========================================================

function setupBattle() {

  if (!selectedMonsterId) {

    selectedMonsterId =
      Number(
        caughtMonsters[0]
      );

  }


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
    !currentEnemy
  ) {

    return;

  }


  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer = null;

  }


  battlePlayerMaxHP =
    data.hp;


  battlePlayerHP =
    data.hp;


  battleEnemyMaxHP =
    currentEnemy.hp;


  battleEnemyHP =
    currentEnemy.hp;


  battleCombo = 0;

  battleAnswering = false;


  const battleNumber =
    el("battle-number");


  if (battleNumber) {

    battleNumber.textContent =
      currentBattleNumber === 5
        ? "BOSS BATTLE"
        : `BATTLE ${currentBattleNumber}`;

  }


  const enemyName =
    el("enemy-name");


  const enemyLevel =
    el("enemy-level");


  const enemyImage =
    el("enemy-image");


  if (enemyName) {

    enemyName.textContent =
      currentEnemy.name;

  }


  if (enemyLevel) {

    enemyLevel.textContent =
      `Lv.${currentEnemy.level}`;

  }


  if (enemyImage) {

    enemyImage.textContent =
      currentEnemy.icon;

  }


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


  battleMessage(
    currentBattleNumber === 5
      ? "⚠️ 森の守護者が現れた！"
      : "九九に答えて攻撃しよう！"
  );


  // 最初の問題は短い待ち時間

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


// =========================================================
// バトルメッセージ
// =========================================================

function battleMessage(text) {

  const message =
    el("battle-message");


  if (message) {

    message.textContent =
      text;

  }

}


// =========================================================
// HP更新
// =========================================================

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


// =========================================================
// バトル問題
// =========================================================

function createBattleQuestion() {

  if (
    battleEnemyHP <= 0 ||
    battlePlayerHP <= 0
  ) {

    return;

  }


  battleAnswering =
    true;


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


  const a =
    monster.stage;


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


// =========================================================
// バトル選択肢
// =========================================================

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
          Math.random() * 9
        ) - 4
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


// =========================================================
// バトル回答
// =========================================================

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


    // ======================================
    // 敵撃破
    // ======================================

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
          550
        );


      return;

    }


    // ======================================
    // 敵の攻撃
    // ======================================

    battleTimer =
      setTimeout(
        () => {

          battleTimer =
            null;

          enemyAttack();

        },
        500
      );

  }

  else {

    button.classList.add(
      "wrong"
    );


    battleCombo = 0;


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
            Number(battleAnswer)
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
        550
      );

  }

}


// =========================================================
// 敵の攻撃
// =========================================================

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
      currentEnemy.attack -
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


  battleMessage(
    `👹 ${currentEnemy.name}の攻撃！ ${damage}ダメージ！`
  );


  updateBattleHP();


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
        600
      );


    return;

  }


  // ======================================
  // 次の問題
  // ここを短くしてテンポ改善
  // ======================================

  battleTimer =
    setTimeout(
      () => {

        battleTimer =
          null;

        createBattleQuestion();

      },
      350
    );

}


// =========================================================
// バトル勝利
// =========================================================

function battleWin() {

  if (
    !currentEnemy
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


  battleWins++;


  battleExpReward =
    currentBattleNumber === 5
      ? 80
      : 25 +
        currentBattleNumber * 5;


  battleCoinReward =
    currentBattleNumber === 5
      ? 30
      : 5 +
        currentBattleNumber * 2;


  battleOldLevel =
    data.level;


  battleLeveledUp =
    gainExp(
      selectedMonsterId,
      battleExpReward
    );


  coins +=
    battleCoinReward;


  // =====================================================
  // ★ここが今回の重要修正
  //
  // 現在のバトル番号をクリア状態として保存する
  // =====================================================

  if (
    currentBattleNumber >
    forestProgress
  ) {

    forestProgress =
      currentBattleNumber;

  }


  // ボス撃破
  if (
    currentBattleNumber === 5
  ) {

    adventureUnlocked =
      true;

  }


  const icon =
    el("battle-result-icon");


  const title =
    el("battle-result-title");


  const message =
    el("battle-result-message");


  const exp =
    el("battle-exp");


  const coin =
    el("battle-coins");


  const nextButton =
    el("battle-next-button");


  if (icon) {

    icon.textContent =
      currentBattleNumber === 5
        ? "🏆"
        : "⚔️";

  }


  if (title) {

    title.textContent =
      currentBattleNumber === 5
        ? "🌳 はじまりの森クリア！"
        : "🎉 バトル勝利！";

  }


  if (message) {

    message.textContent =
      currentBattleNumber === 5
        ? "森の守護者を倒した！"
        : `${currentEnemy.name}を倒した！`;

  }


  if (exp) {

    exp.textContent =
      `+${battleExpReward}`;

  }


  if (coin) {

    coin.textContent =
      `+${battleCoinReward}`;

  }


  if (nextButton) {

    nextButton.textContent =
      currentBattleNumber === 5
        ? "🗺️ 冒険マップへ"
        : `🌳 次のバトルへ`;

  }


  // ======================================
  // ★勝利した瞬間にセーブ
  // ======================================

  saveGame();


  // ======================================
  // ★森の表示も即更新
  // ======================================

  updateForestMap();


  updateWorldStats();

  updateForestButton();


  showScreen(
    "battle-result-screen"
  );

}


// =========================================================
// バトル敗北
// =========================================================

function battleLose() {

  const icon =
    el("battle-result-icon");


  const title =
    el("battle-result-title");


  const message =
    el("battle-result-message");


  const exp =
    el("battle-exp");


  const coin =
    el("battle-coins");


  const nextButton =
    el("battle-next-button");


  if (icon) {

    icon.textContent =
      "💦";

  }


  if (title) {

    title.textContent =
      "今回は負けてしまった…";

  }


  if (message) {

    message.textContent =
      "修行して、もう一度挑戦しよう！";

  }


  if (exp) {

    exp.textContent =
      "+0";

  }


  if (coin) {

    coin.textContent =
      "+0";

  }


  if (nextButton) {

    nextButton.textContent =
      "🔄 もう一度挑戦";

  }


  showScreen(
    "battle-result-screen"
  );

}


// =========================================================
// バトル結果 → 次へ
// =========================================================

function nextBattle() {

  // 敗北時
  if (
    battlePlayerHP <= 0
  ) {

    startForestBattle(
      currentBattleNumber
    );

    return;

  }


  // ボス撃破
  if (
    currentBattleNumber === 5
  ) {

    openWorld();

    return;

  }


  // 次のバトルへ

  const next =
    currentBattleNumber + 1;


  if (
    forestProgress >=
    next - 1
  ) {

    startForestBattle(
      next
    );

  }

  else {

    battleReturnForest();

  }

}


// =========================================================
// 森へ戻る
// =========================================================

function battleReturnForest() {

  updateForestMap();

  showScreen(
    "forest-screen"
  );

}


// =========================================================
// バトル画面から森へ
// =========================================================

function battleBackForest() {

  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer = null;

  }


  battleAnswering =
    false;


  updateForestMap();


  showScreen(
    "forest-screen"
  );

}


// =========================================================
// データリセット
// =========================================================

function resetGame() {

  const answer =
    confirm(
      "⚠️ セーブデータを消去します。\n\n" +
      "クリアした段、星評価、モンスター、" +
      "育成データ、コイン、冒険の進行などが" +
      "すべて消えます。\n\n" +
      "本当に最初からプレイしますか？"
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


  clearedStages = [];

  stageStars = [];

  caughtMonsters = [];

  monsterData = {};

  adventureUnlocked =
    false;

  battleWins = 0;

  coins = 0;

  playerLevel = 1;

  forestProgress = 0;


  currentStage = 1;

  questionNumber = 0;

  correctCount = 0;

  combo = 0;

  maxCombo = 0;

  currentAnswer = 0;

  answering = false;


  selectedMonsterId =
    null;


  currentBattleNumber =
    0;

  currentEnemy =
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


  if (questionTimer) {

    clearTimeout(
      questionTimer
    );

    questionTimer = null;

  }


  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer = null;

  }


  createStageList();

  updateWorldStats();

  updateForestMap();

  updateForestButton();


  alert(
    "✨ セーブデータをリセットしました！\n\n" +
    "1の段から冒険を始めよう！"
  );


  showScreen(
    "training-screen"
  );

}


// =========================================================
// ボタン設定
// =========================================================


// ---------------------------------------------------------
// タイトル
// ---------------------------------------------------------

onClick(
  "start-button",
  () => {

    createStageList();

    showScreen(
      "training-screen"
    );

  }
);


// ---------------------------------------------------------
// 修行クイズ → 修行道場
// ---------------------------------------------------------

onClick(
  "back-training",
  () => {

    createStageList();

    showScreen(
      "training-screen"
    );

  }
);


// ---------------------------------------------------------
// 修行結果 → 次
// ---------------------------------------------------------

onClick(
  "next-stage",
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


// ---------------------------------------------------------
// 修行結果 → 再挑戦
// ---------------------------------------------------------

onClick(
  "retry-stage",
  () => {

    startTraining(
      currentStage
    );

  }
);


// ---------------------------------------------------------
// 図鑑
// ---------------------------------------------------------

onClick(
  "monster-book-button",
  () =>
    openBook(
      "result-screen"
    )
);


// ---------------------------------------------------------
// 九九マスター → 冒険
// ---------------------------------------------------------

onClick(
  "adventure-button",
  openWorld
);


// ---------------------------------------------------------
// 冒険マップ → 戻る
// ---------------------------------------------------------

onClick(
  "world-back-button",
  () => {

    showScreen(
      "training-screen"
    );

  }
);


// ---------------------------------------------------------
// 森
// ---------------------------------------------------------

onClick(
  "forest-area",
  openForest
);


// ---------------------------------------------------------
// 森 → 冒険マップ
// ---------------------------------------------------------

onClick(
  "forest-back-button",
  openWorld
);


// ---------------------------------------------------------
// 森のバトルノード
// ---------------------------------------------------------

document
  .querySelectorAll(
    "#forest-screen .battle-node"
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


// ---------------------------------------------------------
// バトル → 森
// ---------------------------------------------------------

onClick(
  "battle-back-button",
  battleBackForest
);


// ---------------------------------------------------------
// バトル結果 → 次
// ---------------------------------------------------------

onClick(
  "battle-next-button",
  nextBattle
);


// ---------------------------------------------------------
// バトル結果 → 森
// ---------------------------------------------------------

onClick(
  "battle-return-forest",
  battleReturnForest
);


// ---------------------------------------------------------
// 育成
// ---------------------------------------------------------

onClick(
  "monster-button",
  openMonsterScreen
);


// ---------------------------------------------------------
// 育成 → 冒険
// ---------------------------------------------------------

onClick(
  "back-world",
  openWorld
);


// ---------------------------------------------------------
// レベルアップ → 育成
// ---------------------------------------------------------

onClick(
  "levelup-button",
  () => {

    renderMonsterParty();

    renderMonsterDetail();

    showScreen(
      "training-monster-screen"
    );

  }
);


// ---------------------------------------------------------
// 図鑑 → 戻る
// ---------------------------------------------------------

onClick(
  "book-back",
  () => {

    showScreen(
      returnScreen
    );

  }
);


// ---------------------------------------------------------
// セーブデータ削除
// ---------------------------------------------------------

onClick(
  "reset-data",
  resetGame
);


// ---------------------------------------------------------
// 下部メニュー：修行
// ---------------------------------------------------------

onClick(
  "training-button",
  () => {

    createStageList();

    showScreen(
      "training-screen"
    );

  }
);


// ---------------------------------------------------------
// 下部メニュー：冒険
// ---------------------------------------------------------

onClick(
  "world-button",
  openWorld
);


// =========================================================
// ページ終了時セーブ
// =========================================================

window.addEventListener(
  "beforeunload",
  () => {

    saveGame();

  }
);


// =========================================================
// 起動
// =========================================================

loadGame();

createStageList();

updateWorldStats();

updateForestMap();

updateForestButton();

showScreen(
  "title-screen"
);


console.log(
  "🎮 9×9モンスターズ 完全統合版 起動！"
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
  "💾 セーブ ONLINE"
);
