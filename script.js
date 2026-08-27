"use strict";

// ========================================
// 9×9モンスターズ
// 九九修行 + モンスター図鑑 + セーブ
// ========================================


// ========================================
// セーブデータの名前
// ========================================

const SAVE_KEY = "9x9-monsters-save-v5";


// ========================================
// ステージ
// ========================================

const stages = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9
];


// ========================================
// モンスター
// ========================================

const monsters = [

  {
    id: 1,
    stage: 1,
    name: "トロール",

    // 後で画像を決めたらここに入れる
    // 例：
    // image: "images/troll.png"

    image: null,

    type: "いわタイプ",

    desc:
      "のんびりしているが力持ち。",

    rare: "★"
  },


  {
    id: 2,
    stage: 2,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "まだ誰も見たことのないモンスター。",
    rare: "★"
  },


  {
    id: 3,
    stage: 3,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "九九の森の奥にいるらしい……。",
    rare: "★"
  },


  {
    id: 4,
    stage: 4,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "まだ秘密のモンスター。",
    rare: "★"
  },


  {
    id: 5,
    stage: 5,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "強い力を持っているらしい。",
    rare: "★★"
  },


  {
    id: 6,
    stage: 6,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "素早く動くモンスターらしい。",
    rare: "★★"
  },


  {
    id: 7,
    stage: 7,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "7の段の奥に秘密がある。",
    rare: "★★"
  },


  {
    id: 8,
    stage: 8,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "かなり珍しいモンスターらしい。",
    rare: "★★★"
  },


  {
    id: 9,
    stage: 9,
    name: "？？？？",
    image: null,
    type: "？？？",
    desc:
      "九九を極めた者だけが出会えるという。",
    rare: "★★★"
  }

];


// ========================================
// ゲーム状態
// ========================================

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

}


// ========================================
// セーブ
// ========================================

function saveGame() {

  const data = {

    version: 5,

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

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(data)
    );


    console.log(
      "💾 セーブしました"
    );


    updateSaveStatus();

  }

  catch (error) {

    console.error(
      "セーブに失敗しました:",
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
            stage =>
              stages.includes(stage)
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


    adventureUnlocked =
      data.adventureUnlocked === true;


    console.log(
      "💾 セーブデータを読み込みました"
    );

  }

  catch (error) {

    console.error(
      "ロードに失敗しました:",
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


      button.type =
        "button";

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

        button.disabled =
          true;

        button.classList.add(
          "locked"
        );


        button.innerHTML = `

          <span>
            🔒
          </span>

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

    questionTimer =
      null;

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
// 問題作成
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
// 選択肢
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
        currentAnswer
        +
        Math.floor(
          Math.random() * 11
        )
        - 5
      );


    choices.add(
      wrong
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
    .querySelectorAll(
      ".answer"
    )
    .forEach(
      button => {

        button.disabled =
          true;

      }
    );


  if (
    answer === currentAnswer
  ) {

    selectedButton
      .classList
      .add(
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


    el("message")
      .textContent =
      combo >= 3
        ? `🔥 ${combo}コンボ！すごい！`
        : "✨ 正解！";

  }

  else {

    selectedButton
      .classList
      .add(
        "wrong"
      );


    combo = 0;


    document
      .querySelectorAll(
        ".answer"
      )
      .forEach(
        button => {

          if (
            Number(
              button.textContent
            )
            ===
            currentAnswer
          ) {

            button
              .classList
              .add(
                "correct"
              );

          }

        }
      );


    el("message")
      .textContent =
      `💡 正解は ${currentAnswer}！`;

  }


  questionTimer =
    setTimeout(
      () => {

        questionTimer =
          null;

        createQuestion();

      },
      900
    );

}


// ========================================
// 星評価
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
// モンスター取得
// ========================================

function getMonsterForStage(
  stage
) {

  return monsters.find(
    monster =>
      monster.stage === stage
  );

}


function catchMonster(
  monsterId
) {

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
// モンスター画像
// ========================================

function monsterImageHTML(
  monster,
  className
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

      ${monsterImageHTML(
        monster,
        "reward-monster-image"
      )}

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


  if (questionTimer) {

    clearTimeout(
      questionTimer
    );

    questionTimer =
      null;

  }


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


  // ======================================
  // 合格
  // ======================================

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


    if (
      currentStage === 9
    ) {

      el("result-title")
        .textContent =
        "🏆 9×9マスター！";


      el("result-message")
        .textContent =
        "すべての九九を極めた！冒険の扉が開いた！";

    }

    else {

      el("result-title")
        .textContent =
        "🥋 修行完了！";


      el("result-message")
        .textContent =
        `${currentStage + 1}の段が解放された！`;

    }


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
// 図鑑
// ========================================

function renderMonsterBook() {

  const list =
    el("monster-list");


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
            ).padStart(
              3,
              "0"
            )}
          </div>


          <div class="monster-icon">

            ${monsterImageHTML(
              monster,
              "book-monster-image"
            )}

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
            ).padStart(
              3,
              "0"
            )}
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
// 冒険ステータス
// ========================================

function updateWorldStats() {

  el("caught-count")
    .textContent =
    `${caughtMonsters.length} / ${monsters.length}`;


  el("book-percent")
    .textContent =
    `${Math.round(
      caughtMonsters.length
      /
      monsters.length
      *
      100
    )}%`;

}


// ========================================
// セーブデータ消去
// ========================================

function resetGame() {

  const answer =
    confirm(
      "⚠️ セーブデータを消去します。\n\n" +
      "クリアした段、星評価、モンスター図鑑などがすべて消えます。\n\n" +
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
      "セーブデータ削除失敗:",
      error
    );

  }


  // ======================================
  // ゲーム状態を初期化
  // ======================================

  clearedStages = [];

  stageStars = {};

  caughtMonsters = [];

  adventureUnlocked =
    false;


  currentStage = 1;

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

    questionTimer =
      null;

  }


  createStageList();


  alert(
    "✨ セーブデータをリセットしました！\n\n" +
    "1の段から冒険を始めよう！"
  );


  showScreen(
    "training-screen"
  );


  console.log(
    "🗑️ セーブデータをリセットしました"
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


el("open-book-training")
  .addEventListener(
    "click",
    () => {

      openBook(
        "training-screen"
      );

    }
  );


el("result-book")
  .addEventListener(
    "click",
    () => {

      openBook(
        "result-screen"
      );

    }
  );


el("adventure-book")
  .addEventListener(
    "click",
    () => {

      openBook(
        "adventure-screen"
      );

    }
  );


el("world-book")
  .addEventListener(
    "click",
    () => {

      openBook(
        "world-screen"
      );

    }
  );


el("back-book")
  .addEventListener(
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


el("reset-game")
  .addEventListener(
    "click",
    resetGame
  );


// ========================================
// ページ終了時にも保存
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
// ゲーム起動
// ========================================

loadGame();

createStageList();


console.log(
  "🎮 9×9モンスターズ 起動しました！"
);

console.log(
  "💾 セーブシステム: ONLINE"
);

console.log(
  `📖 図鑑: ${
    caughtMonsters.length
  }/${monsters.length}`
);
