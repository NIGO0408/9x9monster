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
    name: "トロール",
    image: null,
    type: "いわタイプ",
    desc: "のんびりしているが力持ち。",
    rare: "★",
    baseHP: 30,
    baseAttack: 12,
    baseDefense: 15
  },

  {
    id: 2,
    stage: 2,
    name: "スライム",
    image: null,
    type: "みずタイプ",
    desc: "ぷるぷるしている不思議な仲間。",
    rare: "★",
    baseHP: 25,
    baseAttack: 10,
    baseDefense: 12
  },

  {
    id: 3,
    stage: 3,
    name: "ピヨコ",
    image: null,
    type: "ひかりタイプ",
    desc: "小さな体で元気いっぱい。",
    rare: "★",
    baseHP: 22,
    baseAttack: 13,
    baseDefense: 10
  },

  {
    id: 4,
    stage: 4,
    name: "ゴブリン",
    image: null,
    type: "やみタイプ",
    desc: "ちょっといたずら好きなモンスター。",
    rare: "★",
    baseHP: 35,
    baseAttack: 15,
    baseDefense: 13
  },

  {
    id: 5,
    stage: 5,
    name: "ロックン",
    image: null,
    type: "いわタイプ",
    desc: "全身が岩でできている。",
    rare: "★★",
    baseHP: 45,
    baseAttack: 18,
    baseDefense: 22
  },

  {
    id: 6,
    stage: 6,
    name: "ウルフ",
    image: null,
    type: "かぜタイプ",
    desc: "素早さが自慢のモンスター。",
    rare: "★★",
    baseHP: 38,
    baseAttack: 22,
    baseDefense: 15
  },

  {
    id: 7,
    stage: 7,
    name: "ファントム",
    image: null,
    type: "やみタイプ",
    desc: "夜の森に現れる謎のモンスター。",
    rare: "★★",
    baseHP: 42,
    baseAttack: 24,
    baseDefense: 18
  },

  {
    id: 8,
    stage: 8,
    name: "ドラゴン",
    image: null,
    type: "ほのおタイプ",
    desc: "強大な力を持つドラゴン。",
    rare: "★★★",
    baseHP: 60,
    baseAttack: 30,
    baseDefense: 25
  },

  {
    id: 9,
    stage: 9,
    name: "キングドラゴン",
    image: null,
    type: "ほのおタイプ",
    desc: "九九を極めた者だけが出会える王。",
    rare: "★★★",
    baseHP: 80,
    baseAttack: 40,
    baseDefense: 35
  }
];


/* =========================================================
   はじまりの森の敵
   ========================================================= */

const forestEnemies = [
  {
    name: "スライム",
    image: null,
    level: 1,
    hp: 20,
    attack: 5
  },

  {
    name: "きのこモン",
    image: null,
    level: 2,
    hp: 24,
    attack: 6
  },

  {
    name: "ゴブリン",
    image: null,
    level: 2,
    hp: 28,
    attack: 7
  }
];


/* =========================================================
   はじまりの森 ボス
   ========================================================= */

const forestBoss = {
  name: "森の守護者",
  image: null,
  level: 5,
  hp: 45,
  attack: 8
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
   森の冒険状態
   ========================================================= */

/*
   0 = 未クリア
   1 = バトル①クリア
   2 = バトル②クリア
   3 = バトル③クリア
   4 = バトル④クリア
   5 = ボス撃破
*/

let forestProgress = 0;


/*
   現在の森で持ち越しているHP
*/

let forestCurrentHP = 0;


/*
   森で使用しているモンスター
*/

let forestBattleMonsterId = null;


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
   DOM
   ========================================================= */

function el(id) {
  return document.getElementById(id);
}


/* =========================================================
   画面切り替え
   ========================================================= */

function showScreen(id) {

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


  /*
     ★重要
     画面を切り替えたら
     必ずページ最上部へ戻す。
  */

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
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

function requiredExp(level) {
  return level * 100;
}


/* =========================================================
   セーブ
   ========================================================= */

function saveGame() {

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

    forestBattleMonsterId
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


/* =========================================================
   モンスター特訓
   ========================================================= */

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


  const a =
    monster.stage;


  const b =
    Math.floor(
      Math.random() * 9
    ) + 1;


  const answer =
    a * b;


  const response =
    prompt(
      `🥋 ${monster.name}の特訓！\n\n` +
      `${a} × ${b} = ?\n\n` +
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
      `💡 正解は ${answer} です！\n\n` +
      "もう一度挑戦してみよう！"
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

function openWorld() {

  updateWorldStats();

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


  updateForestMap();


  showScreen(
    "forest-screen"
  );
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
        5 *
        100
      }%`;

  }


  const text =
    el("forest-progress-text");


  if (text) {

    text.textContent =
      `${forestProgress} / 5 バトルクリア`;

  }
}


/* =========================================================
   森のバトル開始
   ========================================================= */

function startForestBattle(
  battleNumber
) {

  const number =
    Number(
      battleNumber
    );


  if (
    number < 1 ||
    number > 5
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

  if (
    number === 5
  ) {

    currentWildMonster = {
      ...forestBoss,
      hp: forestBoss.hp
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


    currentWildMonster = {

      ...base,

      /*
         バトルが進むほど
         少しずつ強くする
      */

      hp:
        base.hp +
        (
          number - 1
        ) * 4,

      attack:
        base.attack +
        (
          number - 1
        )

    };

  }


  setupBattle();


  showScreen(
    "battle-screen"
  );
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


  battlePlayerHP =
    Math.min(
      forestCurrentHP,
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
      currentBattleNumber === 5
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
      currentBattleNumber === 5
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
        currentBattleNumber === 5
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


  battleMessage(
    currentBattleNumber === 5
      ? "⚠️ 森の守護者が現れた！"
      : `⚔️ バトル${currentBattleNumber}！九九で攻撃しよう！`
  );


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

  const a =
    Math.floor(
      Math.random() * 3
    ) + 1;


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

  forestCurrentHP =
    battlePlayerHP;


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


  /*
     報酬
  */

  battleExpReward =
    currentBattleNumber === 5
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


  /*
     ★現在HPを保存
  */

  forestCurrentHP =
    battlePlayerHP;


  /*
     ★森の進行を更新
  */

  if (
    currentBattleNumber >
    forestProgress
  ) {

    forestProgress =
      currentBattleNumber;

  }


  /*
     ボス撃破
  */

  if (
    currentBattleNumber === 5
  ) {

    adventureUnlocked =
      true;

  }


  /*
     結果画面
  */

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

    if (
      currentBattleNumber === 5
    ) {

      message.textContent =
        "森の守護者を倒した！";

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
      currentBattleNumber === 5
        ? "🗺️ 冒険マップへ"
        : `⚔️ バトル${currentBattleNumber + 1}へ`;

  }


  saveGame();


  updateForestMap();

  updateWorldStats();


  showScreen(
    "battle-result-screen"
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
      700
    );

  }
}


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

    icon.textContent =
      "💦";

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

    exp.textContent =
      "+0";

  }


  if (coins) {

    coins.textContent =
      "+0";

  }


  if (next) {

    next.textContent =
      "🔄 最初から挑戦";

  }


  /*
     敗北したら
     次回は①から満タン。
  */

  forestCurrentHP =
    0;


  forestBattleMonsterId =
    null;


  saveGame();


  showScreen(
    "battle-result-screen"
  );
}


/* =========================================================
   次のバトル
   ========================================================= */

function nextBattle() {

  /*
     敗北
  */

  if (
    battlePlayerHP <= 0
  ) {

    startForestBattle(
      1
    );

    return;

  }


  /*
     ボス撃破
  */

  if (
    currentBattleNumber === 5
  ) {

    /*
       今回の冒険終了。

       次回は①から
       満タンで再挑戦。
    */

    forestCurrentHP =
      0;


    forestBattleMonsterId =
      null;


    saveGame();


    openWorld();


    return;

  }


  /*
     次のバトル
  */

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

}


/* =========================================================
   森へ戻る
   ========================================================= */

function battleReturnForest() {

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

    forestCurrentHP =
      battlePlayerHP;

  }


  saveGame();


  updateForestMap();


  showScreen(
    "forest-screen"
  );
}


/* =========================================================
   バトル画面から森へ
   ========================================================= */

function battleBackForest() {

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

    forestCurrentHP =
      battlePlayerHP;

  }


  saveGame();


  updateForestMap();


  showScreen(
    "forest-screen"
  );
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
  battleBackForest
);


/* バトル結果 → 次 */

el("battle-next-button")?.addEventListener(
  "click",
  nextBattle
);


/* バトル結果 → 森 */

el("battle-return-forest")?.addEventListener(
  "click",
  battleReturnForest
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
