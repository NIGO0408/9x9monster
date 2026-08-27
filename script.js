"use strict";

// ========================================
// 9×9モンスターズ
// 冒険・バトルシステム
// ========================================

const SAVE_KEY = "9x9-monsters-save-v7";


// ========================================
// モンスター
// ========================================

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


// ========================================
// 野生モンスター
// ========================================

const wildMonsters = [

  {
    name: "スライム",
    image: null,
    level: 1,
    hp: 30,
    maxHp: 30,
    attack: 6
  },

  {
    name: "きのこモン",
    image: null,
    level: 2,
    hp: 36,
    maxHp: 36,
    attack: 7
  },

  {
    name: "ゴブリン",
    image: null,
    level: 2,
    hp: 42,
    maxHp: 42,
    attack: 8
  }

];


// ========================================
// ゲームデータ
// ========================================

let clearedStages = [];

let stageStars = {};

let caughtMonsters = [];

let monsterData = {};

let adventureUnlocked = false;

let battleWins = 0;


// ========================================
// 修行
// ========================================

let currentStage = 1;

let questionNumber = 0;

let correctCount = 0;

let combo = 0;

let maxCombo = 0;

let currentAnswer = 0;

let answering = false;

let questionTimer = null;


// ========================================
// モンスター
// ========================================

let selectedMonsterId = null;

let levelupMonsterId = null;


// ========================================
// バトル
// ========================================

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


// ========================================
// 図鑑から戻る場所
// ========================================

let returnScreen = "training-screen";


// ========================================
// DOM取得
// ========================================

function el(id) {

  return document.getElementById(id);

}


// ========================================
// 画面切り替え
// ========================================

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

}


// ========================================
// モンスター初期データ
// ========================================

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


// ========================================
// モンスター情報取得
// ========================================

function getMonsterData(monsterId) {

  if (!monsterData[monsterId]) {

    const monster = monsters.find(
      item =>
        item.id === Number(monsterId)
    );


    if (!monster) {

      return null;

    }


    monsterData[monsterId] =
      createMonsterData(monster);

  }


  return monsterData[monsterId];

}


// ========================================
// 必要EXP
// ========================================

function requiredExp(level) {

  return level * 100;

}


// ========================================
// セーブ
// ========================================

function saveGame() {

  const data = {

    version: 7,

    clearedStages:
      [...clearedStages],

    stageStars:
      {...stageStars},

    caughtMonsters:
      [...caughtMonsters],

    monsterData:
      {...monsterData},

    adventureUnlocked,

    battleWins

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


// ========================================
// ロード
// ========================================

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
            id =>
              monsters.some(
                monster =>
                  monster.id === id
              )
          );

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
      Number(data.battleWins) || 0;

  }

  catch (error) {

    console.error(
      "ロード失敗:",
      error
    );

  }

}


// ========================================
// セーブ状態表示
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
// 修行ステージ一覧
// ========================================

function createStageList() {

  const list =
    el("stage-list");


  if (!list) {

    return;

  }


  list.innerHTML = "";


  for (
    let stageNumber = 1;
    stageNumber <= 9;
    stageNumber++
  ) {

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
      stageNumber === 1 ||
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
        () =>
          startTraining(
            stageNumber
          )
      );

    }


    list.appendChild(button);

  }


  updateSaveStatus();

}


// ========================================
// 修行開始
// ========================================

function startTraining(stageNumber) {

  const unlocked =
    stageNumber === 1 ||
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


  el("training-title")
    .textContent =
      `${stageNumber}の段 修行`;


  showScreen(
    "quiz-screen"
  );


  createQuestion();

}


// ========================================
// 修行問題
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


  el("question")
    .textContent =
      `${currentStage} × ${questionNumber} = ?`;


  el("progress-text")
    .textContent =
      `第${questionNumber}問 / 9問`;


  el("progress-fill")
    .style.width =
      `${
        (
          (questionNumber - 1)
          / 9
          * 100
        )
      }%`;


  createAnswers();


  el("message")
    .textContent =
      "正しい答えを選んでね！";

}


// ========================================
// 修行選択肢
// ========================================

function createAnswers() {

  const container =
    el("answers");


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


    choices.add(wrong);

  }


  [...choices]
    .sort(
      () =>
        Math.random() - 0.5
    )
    .forEach(value => {

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

    });

}


// ========================================
// 修行回答
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
    .querySelectorAll(
      ".answer"
    )
    .forEach(
      button =>
        button.disabled = true
    );


  if (
    answer === currentAnswer
  ) {

    selectedButton
      .classList
      .add("correct");


    correctCount++;

    combo++;


    if (
      combo > maxCombo
    ) {

      maxCombo =
        combo;

    }


    el("message")
      .textContent =
      combo >= 3
        ? `🔥 ${combo}コンボ！すごい！`
        : "✨ 正解！";

  }

  else {

    selectedButton
      .classList
      .add("wrong");


    combo = 0;


    document
      .querySelectorAll(
        ".answer"
      )
      .forEach(button => {

        if (
          Number(
            button.textContent
          )
          ===
          currentAnswer
        ) {

          button.classList.add(
            "correct"
          );

        }

      });


    el("message")
      .textContent =
      `💡 正解は ${currentAnswer}！`;

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


// ========================================
// 段に対応するモンスター
// ========================================

function getMonsterForStage(stage) {

  return monsters.find(
    monster =>
      monster.stage === stage
  );

}


// ========================================
// モンスターGET
// ========================================

function catchMonster(monsterId) {

  if (
    !caughtMonsters.includes(
      monsterId
    )
  ) {

    caughtMonsters.push(
      monsterId
    );


    getMonsterData(
      monsterId
    );


    return true;

  }


  return false;

}


// ========================================
// モンスター表示
// ========================================

function monsterVisual(
  monster,
  className = ""
) {

  if (
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


// ========================================
// GET報酬表示
// ========================================

function showReward(
  monster,
  isNew
) {

  const box =
    el("reward-box");


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


// ========================================
// 修行終了
// ========================================

function finishTraining() {

  answering = false;


  const stars =
    getStars(
      correctCount
    );


  el("result-correct")
    .textContent =
    `${correctCount} / 9`;


  el("result-combo")
    .textContent =
    maxCombo;


  el("result-stars")
    .textContent =
    stars;


  const rewardBox =
    el("reward-box");


  rewardBox.classList.add(
    "hidden"
  );


  rewardBox.innerHTML =
    "";


  const nextButton =
    el("next-stage");


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


    saveGame();


    el("result-title")
      .textContent =
      currentStage === 9
        ? "🏆 9×9マスター！"
        : "🥋 修行完了！";


    el("result-message")
      .textContent =
      currentStage === 9
        ? "すべての九九を極めた！冒険の扉が開いた！"
        : `${currentStage + 1}の段が解放された！`;


    nextButton.style.display =
      "inline-block";


    nextButton.textContent =
      currentStage === 9
        ? "🗺️ 冒険へ進む"
        : `🥋 ${currentStage + 1}の段へ`;

  }

  else {

    el("result-title")
      .textContent =
      "もう少し修行じゃ！";


    el("result-message")
      .textContent =
      "8問以上正解すると合格だよ！";


    nextButton.style.display =
      "none";

  }


  showScreen(
    "result-screen"
  );

}


// ========================================
// 育成画面
// ========================================

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
      selectedMonsterId
    )
  ) {

    selectedMonsterId =
      caughtMonsters[0];

  }


  renderMonsterParty();

  renderMonsterDetail();

  showScreen(
    "monster-screen"
  );

}


// ========================================
// 育成モンスター一覧
// ========================================

function renderMonsterParty() {

  const party =
    el("monster-party");


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
        selectedMonsterId ===
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


// ========================================
// 育成詳細
// ========================================

function renderMonsterDetail() {

  const detail =
    el("monster-detail");


  if (!selectedMonsterId) {

    detail.innerHTML =
      "";

    return;

  }


  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(selectedMonsterId)
    );


  if (!monster) {

    return;

  }


  const data =
    getMonsterData(
      monster.id
    );


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

    </div>

  `;

}


// ========================================
// EXP
// ========================================

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


  data.exp += amount;


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


// ========================================
// レベルアップ
// ========================================

function showLevelUp(
  monsterId,
  oldLevel
) {

  levelupMonsterId =
    monsterId;


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


  el("levelup-monster")
    .innerHTML = `

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

      <div class="level-change">

        Lv.${oldLevel}
        →
        Lv.${data.level}

      </div>

    `;


  el("levelup-message")
    .textContent =
    `${monster.name}はさらに強くなった！`;


  el("levelup-stats")
    .innerHTML = `

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


  showScreen(
    "levelup-screen"
  );

}


// ========================================
// 育成用九九
// ========================================

function trainMonster() {

  if (!selectedMonsterId) {

    openMonsterScreen();

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
    userAnswer === answer
  ) {

    const oldLevel =
      data.level;


    const exp =
      25;


    const leveledUp =
      gainExp(
        selectedMonsterId,
        exp
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
        `+${exp} EXP\n\n` +
        `${monster.name}は元気に成長中！`
      );


      renderMonsterParty();

      renderMonsterDetail();

    }

  }

  else {

    alert(
      `💡 正解は ${answer} です！\n\n` +
      `もう一度挑戦してみよう！`
    );

  }

}


// ========================================
// 図鑑
// ========================================

function renderMonsterBook() {

  const list =
    el("monster-list");


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


  el("book-summary")
    .textContent =
    `${caughtMonsters.length} / ${monsters.length} 発見`;


  updateWorldStats();

}


// ========================================
// 図鑑を開く
// ========================================

function openBook(fromScreen) {

  returnScreen =
    fromScreen;


  renderMonsterBook();


  showScreen(
    "book-screen"
  );

}


// ========================================
// ワールド情報
// ========================================

function updateWorldStats() {

  el("caught-count")
    .textContent =
    `${caughtMonsters.length} / ${monsters.length}`;


  el("book-percent")
    .textContent =
    `${Math.round(
      caughtMonsters.length /
      monsters.length *
      100
    )}%`;

}


// ========================================
// はじまりの森
// ========================================

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
      caughtMonsters[0];

  }


  const monster =
    monsters.find(
      item =>
        item.id ===
        Number(selectedMonsterId)
    );


  if (!monster) {

    return;

  }


  const data =
    getMonsterData(
      monster.id
    );


  el("forest-party-name")
    .textContent =
    `${monster.name} Lv.${data.level}`;


  showScreen(
    "forest-screen"
  );

}


// ========================================
// 森を探索
// ========================================

function exploreForest() {

  if (
    caughtMonsters.length === 0
  ) {

    openForest();

    return;

  }


  if (!selectedMonsterId) {

    selectedMonsterId =
      caughtMonsters[0];

  }


  const randomIndex =
    Math.floor(
      Math.random() *
      wildMonsters.length
    );


  const base =
    wildMonsters[
      randomIndex
    ];


  currentWildMonster = {

    ...base,

    hp: base.maxHp

  };


  setupBattle();


  showScreen(
    "battle-screen"
  );


  setTimeout(
    () => {

      battleMessage(
        `⚡ 野生の${currentWildMonster.name}が現れた！`
      );

    },
    200
  );

}


// ========================================
// バトル準備
// ========================================

function setupBattle() {

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


  if (
    !monster ||
    !data
  ) {

    return;

  }


  battlePlayerMaxHP =
    data.hp;


  battlePlayerHP =
    data.hp;


  battleEnemyMaxHP =
    currentWildMonster.maxHp;


  battleEnemyHP =
    currentWildMonster.hp;


  battleCombo =
    0;


  battleAnswering =
    true;


  el("enemy-name")
    .textContent =
    `野生の${currentWildMonster.name}`;


  el("enemy-level")
    .textContent =
    `Lv.${currentWildMonster.level}`;


  el("player-battle-name")
    .textContent =
    monster.name;


  el("player-battle-level")
    .textContent =
    data.level;


  el("enemy-image")
    .innerHTML =
    currentWildMonster.image
      ? `
        <img
          src="${currentWildMonster.image}"
          alt="${currentWildMonster.name}"
        >
      `
      : "👾";


  el("player-battle-image")
    .innerHTML =
    monsterVisual(
      monster,
      "battle-monster-image"
    );


  updateBattleHP();


  createBattleQuestion();

}


// ========================================
// バトルメッセージ
// ========================================

function battleMessage(text) {

  el("battle-message")
    .textContent =
    text;

}


// ========================================
// バトルHP
// ========================================

function updateBattleHP() {

  const enemyPercent =
    Math.max(
      0,
      battleEnemyHP /
      battleEnemyMaxHP *
      100
    );


  const playerPercent =
    Math.max(
      0,
      battlePlayerHP /
      battlePlayerMaxHP *
      100
    );


  el("enemy-hp")
    .style.width =
    `${enemyPercent}%`;


  el("player-hp")
    .style.width =
    `${playerPercent}%`;


  el("enemy-hp-text")
    .textContent =
    `${Math.max(
      0,
      battleEnemyHP
    )} / ${battleEnemyMaxHP}`;


  el("player-hp-text")
    .textContent =
    `${Math.max(
      0,
      battlePlayerHP
    )} / ${battlePlayerMaxHP}`;

}


// ========================================
// バトル問題
// ========================================

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
        Number(selectedMonsterId)
    );


  if (!monster) {

    return;

  }


  const a =
    Math.min(
      9,
      Math.max(
        1,
        monster.stage
      )
    );


  const b =
    Math.floor(
      Math.random() * 9
    ) + 1;


  battleAnswer =
    a * b;


  el("battle-question")
    .textContent =
    `${a} × ${b} = ?`;


  createBattleAnswers();

}


// ========================================
// バトル選択肢
// ========================================

function createBattleAnswers() {

  const container =
    el("battle-answers");


  container.innerHTML =
    "";


  const choices =
    new Set([
      battleAnswer
    ]);


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
    .forEach(value => {

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

    });

}


// ========================================
// バトル回答
// ========================================

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
        item.disabled =
          true
    );


  const data =
    getMonsterData(
      selectedMonsterId
    );


  if (!data) {

    return;

  }


  if (
    answer === battleAnswer
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


    if (
      battleEnemyHP <= 0
    ) {

      battleTimer =
        setTimeout(
          battleWin,
          800
        );

      return;

    }


    battleTimer =
      setTimeout(
        enemyAttack,
        800
      );

  }

  else {

    button.classList.add(
      "wrong"
    );


    battleCombo =
      0;


    battleMessage(
      `💡 正解は ${battleAnswer}！`
    );


    battleTimer =
      setTimeout(
        enemyAttack,
        800
      );

  }

}


// ========================================
// 敵の攻撃
// ========================================

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


  battleMessage(
    `👹 ${currentWildMonster.name}の攻撃！ ${damage}ダメージ！`
  );


  updateBattleHP();


  if (
    battlePlayerHP <= 0
  ) {

    battleTimer =
      setTimeout(
        battleLose,
        900
      );

    return;

  }


  battleTimer =
    setTimeout(
      createBattleQuestion,
      900
    );

}


// ========================================
// 勝利
// ========================================

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
    30 +
    (
      battleCombo >= 3
        ? 10
        : 0
    );


  const oldLevel =
    data.level;


  const leveledUp =
    gainExp(
      selectedMonsterId,
      battleExpReward
    );


  el("battle-result-icon")
    .textContent =
    "🏆";


  el("battle-result-title")
    .textContent =
    "勝利！";


  el("battle-result-message")
    .textContent =
    `野生の${currentWildMonster.name}を倒した！`;


  el("battle-exp")
    .textContent =
    `+${battleExpReward}`;


  el("battle-wins")
    .textContent =
    battleWins;


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


// ========================================
// 敗北
// ========================================

function battleLose() {

  el("battle-result-icon")
    .textContent =
    "💦";


  el("battle-result-title")
    .textContent =
    "今回は負けてしまった…";


  el("battle-result-message")
    .textContent =
    "修行して、もう一度挑戦しよう！";


  el("battle-exp")
    .textContent =
    "+0";


  el("battle-wins")
    .textContent =
    battleWins;


  showScreen(
    "battle-result-screen"
  );

}


// ========================================
// 逃げる
// ========================================

function runBattle() {

  if (battleTimer) {

    clearTimeout(
      battleTimer
    );

    battleTimer = null;

  }


  battleAnswering =
    false;


  showScreen(
    "forest-screen"
  );

}


// ========================================
// セーブデータリセット
// ========================================

function resetGame() {

  const answer =
    confirm(
      "⚠️ セーブデータを消去します。\n\n" +
      "クリアした段、星評価、モンスター、" +
      "レベル、経験値、図鑑、冒険記録などが" +
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

  stageStars = {};

  caughtMonsters = [];

  monsterData = {};

  adventureUnlocked =
    false;

  battleWins = 0;

  currentStage = 1;

  questionNumber = 0;

  correctCount = 0;

  combo = 0;

  maxCombo = 0;

  currentAnswer = 0;

  answering = false;

  selectedMonsterId = null;

  levelupMonsterId = null;

  currentWildMonster = null;

  battlePlayerHP = 0;

  battleEnemyHP = 0;

  battleAnswering = false;


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


  alert(
    "✨ セーブデータをリセットしました！\n\n" +
    "1の段から冒険を始めよう！"
  );


  showScreen(
    "training-screen"
  );

}


// ========================================
// ボタン
// ========================================

el("start-button")
  .addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );


el("back-training")
  .addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );


el("retry-stage")
  .addEventListener(
    "click",
    () => {

      startTraining(
        currentStage
      );

    }
  );


el("next-stage")
  .addEventListener(
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


el("result-monsters")
  .addEventListener(
    "click",
    openMonsterScreen
  );


el("result-book")
  .addEventListener(
    "click",
    () =>
      openBook(
        "result-screen"
      )
  );


el("result-world")
  .addEventListener(
    "click",
    () =>
      showScreen(
        "world-screen"
      )
  );


el("open-monsters-training")
  .addEventListener(
    "click",
    openMonsterScreen
  );


el("open-book-training")
  .addEventListener(
    "click",
    () =>
      openBook(
        "training-screen"
      )
  );


el("open-world-training")
  .addEventListener(
    "click",
    () =>
      showScreen(
        "world-screen"
      )
  );


el("train-monster")
  .addEventListener(
    "click",
    trainMonster
  );


el("back-from-monsters")
  .addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );


el("levelup-ok")
  .addEventListener(
    "click",
    () => {

      renderMonsterParty();

      renderMonsterDetail();

      showScreen(
        "monster-screen"
      );

    }
  );


el("adventure-button")
  .addEventListener(
    "click",
    () => {

      updateWorldStats();

      showScreen(
        "world-screen"
      );

    }
  );


el("adventure-monsters")
  .addEventListener(
    "click",
    openMonsterScreen
  );


el("adventure-book")
  .addEventListener(
    "click",
    () =>
      openBook(
        "adventure-screen"
      )
  );


el("world-book")
  .addEventListener(
    "click",
    () =>
      openBook(
        "world-screen"
      )
  );


el("forest-button")
  .addEventListener(
    "click",
    openForest
  );


el("explore-forest")
  .addEventListener(
    "click",
    exploreForest
  );


el("back-world")
  .addEventListener(
    "click",
    () =>
      showScreen(
        "world-screen"
      )
  );


el("run-battle")
  .addEventListener(
    "click",
    runBattle
  );


el("battle-again")
  .addEventListener(
    "click",
    exploreForest
  );


el("battle-world")
  .addEventListener(
    "click",
    () =>
      showScreen(
        "world-screen"
      )
  );


el("battle-monsters")
  .addEventListener(
    "click",
    openMonsterScreen
  );


el("world-training")
  .addEventListener(
    "click",
    () => {

      createStageList();

      showScreen(
        "training-screen"
      );

    }
  );


el("world-monsters")
  .addEventListener(
    "click",
    openMonsterScreen
  );


el("back-book")
  .addEventListener(
    "click",
    () => {

      showScreen(
        returnScreen
      );

    }
  );


el("reset-game")
  .addEventListener(
    "click",
    resetGame
  );


// ========================================
// ページ終了時セーブ
// ========================================

window.addEventListener(
  "beforeunload",
  () => {

    saveGame();

  }
);


// ========================================
// 起動
// ========================================

loadGame();

createStageList();

updateWorldStats();


console.log(
  "🎮 9×9モンスターズ 起動！"
);

console.log(
  "🌳 はじまりの森 ONLINE"
);

console.log(
  "⚔️ モンスターバトル ONLINE"
);
