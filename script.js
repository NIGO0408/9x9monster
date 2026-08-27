"use strict";

/* =========================================================
   9×9モンスターズ
   script.js
   クリーン完全統合版
   ========================================================= */


/* =========================================================
   セーブ
   ========================================================= */

function syncLegacyForestState() {
  forestProgress = adventureProgress.forest;
  forestCurrentHP = adventureCurrentHP.forest;
  forestBattleMonsterId = adventureBattleMonsterId.forest;
}

function saveGame() {

  syncLegacyForestState();

  const data = {
    version: 11,
    clearedStages: [...clearedStages],
    stageStars: {...stageStars},
    caughtMonsters: [...caughtMonsters],
    monsterData: {...monsterData},
    adventureUnlocked,
    battleWins,

    /* 新しい共通冒険データ */
    adventureProgress: {...adventureProgress},
    adventureCurrentHP: {...adventureCurrentHP},
    adventureBattleMonsterId: {...adventureBattleMonsterId},

    /* 旧データ互換 */
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
    console.error("セーブ失敗:", error);
  }
}


/* =========================================================
   ロード
   ========================================================= */

function loadGame() {

  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);

    if (Array.isArray(data.clearedStages)) {
      clearedStages = data.clearedStages
        .map(Number)
        .filter(stage => stage >= 1 && stage <= 9);
    }

    if (data.stageStars && typeof data.stageStars === "object") {
      stageStars = data.stageStars;
    }

    if (Array.isArray(data.caughtMonsters)) {
      caughtMonsters = data.caughtMonsters
        .map(Number)
        .filter(id => monsters.some(monster => monster.id === id));
    }

    if (data.monsterData && typeof data.monsterData === "object") {
      monsterData = data.monsterData;
    }

    adventureUnlocked = data.adventureUnlocked === true;
    battleWins = Number(data.battleWins) || 0;

    /* 新形式 */
    if (data.adventureProgress && typeof data.adventureProgress === "object") {
      adventureProgress.forest = Math.max(0, Math.min(5, Number(data.adventureProgress.forest) || 0));
      adventureProgress.lake = Math.max(0, Math.min(5, Number(data.adventureProgress.lake) || 0));
    }
    else {
      /* 旧形式から森だけ移行 */
      adventureProgress.forest = Math.max(0, Math.min(5, Number(data.forestProgress) || 0));
      adventureProgress.lake = 0;
    }

    if (data.adventureCurrentHP && typeof data.adventureCurrentHP === "object") {
      adventureCurrentHP.forest = Math.max(0, Number(data.adventureCurrentHP.forest) || 0);
      adventureCurrentHP.lake = Math.max(0, Number(data.adventureCurrentHP.lake) || 0);
    }
    else {
      adventureCurrentHP.forest = Math.max(0, Number(data.forestCurrentHP) || 0);
      adventureCurrentHP.lake = 0;
    }

    if (data.adventureBattleMonsterId && typeof data.adventureBattleMonsterId === "object") {
      adventureBattleMonsterId.forest = data.adventureBattleMonsterId.forest ? Number(data.adventureBattleMonsterId.forest) : null;
      adventureBattleMonsterId.lake = data.adventureBattleMonsterId.lake ? Number(data.adventureBattleMonsterId.lake) : null;
    }
    else {
      adventureBattleMonsterId.forest = data.forestBattleMonsterId ? Number(data.forestBattleMonsterId) : null;
      adventureBattleMonsterId.lake = null;
    }

    syncLegacyForestState();
  }
  catch (error) {
    console.error("ロード失敗:", error);
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

window.scrollTo({
  top: 0,
  behavior: "instant"
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

function openWorld() {
  updateWorldStats();
  updateAdventureMap("forest");
  updateAdventureMap("lake");
  showScreen("world-screen");
}


/* =========================================================
   冒険ステージ共通
   ========================================================= */

function getAdventureConfig(key) {
  return adventureStages[key] || null;
}

function isAdventureUnlocked(key) {
  const config = getAdventureConfig(key);
  return !!config && config.unlock();
}

function getAdventureProgress(key) {
  return adventureProgress[key] || 0;
}

function setAdventureProgress(key, value) {
  adventureProgress[key] = Math.max(0, Math.min(5, Number(value) || 0));
  syncLegacyForestState();
}

function openAdventureStage(key) {

  const config = getAdventureConfig(key);
  if (!config) return;

  if (!isAdventureUnlocked(key)) {
    if (key === "lake") {
      alert("🌊 九九の湖はまだ閉ざされている！\n\nまず「はじまりの森」をクリアしよう！");
    }
    return;
  }

  if (caughtMonsters.length === 0) {
    alert(
      "冒険には仲間が必要です！\n\n" +
      "まず1の段をクリアして\n" +
      "モンスターを仲間にしよう！"
    );
    return;
  }

  if (!selectedMonsterId || !caughtMonsters.includes(Number(selectedMonsterId))) {
    selectedMonsterId = Number(caughtMonsters[0]);
  }

  currentAdventureKey = key;
  updateAdventureMap(key);

  /* ステージ画面を共通HTMLに描画 */
  const title = el("adventure-stage-title");
  const sub = el("adventure-stage-subtitle");
  const art = el("adventure-stage-art");
  const introTitle = el("adventure-stage-intro-title");
  const introText = el("adventure-stage-intro-text");
  const progressTitle = el("adventure-progress-title");

  if (title) title.textContent = `${config.icon} ${config.name}`;
  if (sub) sub.textContent = "全5バトル";
  if (art) art.textContent = config.introIcon;
  if (introTitle) introTitle.textContent = config.introTitle;
  if (introText) introText.textContent = config.introText;
  if (progressTitle) progressTitle.textContent = `${config.name}の攻略状況`;

  const currentHP = adventureCurrentHP[key];
  const data = getMonsterData(selectedMonsterId);
  const partyName = el("adventure-party-name");
  if (partyName && data) {
    const monster = monsters.find(m => m.id === Number(selectedMonsterId));
    if (monster) partyName.textContent = `${monster.name} Lv.${data.level}`;
  }

  const hpText = el("adventure-party-hp");
  if (hpText && data) {
    hpText.textContent = currentHP > 0 ? `HP ${currentHP} / ${data.hp}` : `HP ${data.hp} / ${data.hp}`;
  }

  showScreen(key === "lake" ? "lake-screen" : "forest-screen");
}

function openForest() {
  openAdventureStage("forest");
}

function openLake() {
  openAdventureStage("lake");
}

function updateAdventureMap(key) {

  const progress = getAdventureProgress(key);
  const config = getAdventureConfig(key);
  if (!config) return;

  const screenId = key === "lake" ? "lake-screen" : "forest-screen";
  const screen = el(screenId);
  if (screen && currentAdventureKey === key) {
    const nodes = screen.querySelectorAll(".adventure-battle-node, .adventure-boss-node, .battle-node, .boss-node");
    nodes.forEach(node => {
      const number = Number(node.dataset.battle);
      const unlocked = number === 1 || progress >= number - 1;
      const cleared = progress >= number;
      node.disabled = !unlocked;
      node.classList.toggle("locked-node", !unlocked);
      node.classList.toggle("cleared-node", cleared);
      const icon = node.querySelector(".node-icon");
      if (!icon) return;
      if (cleared) icon.textContent = "⭐";
      else if (number === 5) icon.textContent = unlocked ? "👹" : "🔒";
      else icon.textContent = unlocked ? "⚔️" : "🔒";
    });

    const goal = screen.querySelector(".adventure-goal-node, .goal-node");
    if (goal) {
      goal.classList.toggle("locked-node", progress < 5);
      const icon = goal.querySelector(".node-icon");
      if (icon) icon.textContent = progress >= 5 ? "🏆" : "🔒";
    }

    const fill = el(`${key}-progress-fill`);
    if (fill) fill.style.width = `${progress / 5 * 100}%`;

    const text = el(`${key}-progress-text`);
    if (text) text.textContent = `${progress} / 5 バトルクリア`;
  }

  /* ワールドマップ側 */
  const mapArea = el(`${key}-area`);
  if (mapArea) {
    const unlocked = isAdventureUnlocked(key);
    mapArea.disabled = !unlocked;
    mapArea.classList.toggle("locked-area", !unlocked);
    const small = mapArea.querySelector("small");
    if (small) {
      small.textContent = unlocked
        ? (progress >= 5 ? "クリア済み・再挑戦可能" : "冒険へ出発")
        : (key === "lake" ? "はじまりの森クリアで解放" : "ロック中");
    }
  }
}

function startForestBattle(number) {
  startAdventureBattle("forest", number);
}

function startLakeBattle(number) {
  startAdventureBattle("lake", number);
}

function startAdventureBattle(key, battleNumber) {

  const config = getAdventureConfig(key);
  const number = Number(battleNumber);

  if (!config || number < 1 || number > 5 || !isAdventureUnlocked(key)) return;
  if (number > 1 && getAdventureProgress(key) < number - 1) return;

  if (caughtMonsters.length === 0) {
    openAdventureStage(key);
    return;
  }

  if (!selectedMonsterId || !caughtMonsters.includes(Number(selectedMonsterId))) {
    selectedMonsterId = Number(caughtMonsters[0]);
  }

  currentAdventureKey = key;
  currentBattleNumber = number;

  const selectedId = Number(selectedMonsterId);
  const monsterChanged = adventureBattleMonsterId[key] !== selectedId;

  /* ①・モンスター変更時・HP切れは満タン。それ以外は前戦HPを持ち越す。 */
  if (number === 1 || monsterChanged || adventureCurrentHP[key] <= 0) {
    const data = getMonsterData(selectedId);
    if (!data) return;
    adventureCurrentHP[key] = data.hp;
    adventureBattleMonsterId[key] = selectedId;
  }

  /* 敵決定 */
  if (number === 5) {
    currentWildMonster = { ...config.boss, hp: config.boss.hp, maxHp: config.boss.hp };
  }
  else {
    const base = config.enemies[Math.floor(Math.random() * config.enemies.length)];
    currentWildMonster = {
      ...base,
      hp: base.hp + (number - 1) * 4,
      maxHp: base.hp + (number - 1) * 4,
      attack: base.attack + (number - 1)
    };
  }

  setupBattle();
  showScreen("battle-screen");
}


/* =========================================================
   バトル準備
   ========================================================= */

function setupBattle() {

  const monster = monsters.find(item => item.id === Number(selectedMonsterId));
  const data = getMonsterData(selectedMonsterId);
  const config = getAdventureConfig(currentAdventureKey);

  if (!monster || !data || !currentWildMonster || !config) return;

  if (battleTimer) {
    clearTimeout(battleTimer);
    battleTimer = null;
  }

  battlePlayerMaxHP = data.hp;
  battlePlayerHP = Math.min(adventureCurrentHP[currentAdventureKey], battlePlayerMaxHP);
  battleEnemyMaxHP = currentWildMonster.maxHp || currentWildMonster.hp;
  battleEnemyHP = currentWildMonster.hp;
  battleCombo = 0;
  battleAnswering = false;

  const battleNumber = el("battle-number");
  if (battleNumber) {
    battleNumber.textContent = currentBattleNumber === 5
      ? `👹 ${config.name}・BOSS BATTLE`
      : `⚔️ ${config.name}・BATTLE ${currentBattleNumber}`;
  }

  const battleBack = el("battle-back-button");
  if (battleBack) battleBack.textContent = `← ${config.name}へ戻る`;

  const battleReturn = el("battle-return-forest");
  if (battleReturn) battleReturn.textContent = `${config.icon} ${config.name}のマップへ`;

  const enemyName = el("enemy-name");
  const enemyLevel = el("enemy-level");
  const enemyImage = el("enemy-image");
  if (enemyName) enemyName.textContent = currentBattleNumber === 5 ? currentWildMonster.name : `野生の${currentWildMonster.name}`;
  if (enemyLevel) enemyLevel.textContent = `Lv.${currentWildMonster.level}`;
  if (enemyImage) {
    if (currentWildMonster.image) {
      enemyImage.innerHTML = `<img src="${currentWildMonster.image}" alt="${currentWildMonster.name}">`;
    } else {
      enemyImage.textContent = currentBattleNumber === 5 ? "👹" : (currentAdventureKey === "lake" ? "🌊" : "👾");
    }
  }

  const playerName = el("player-monster-name");
  const playerLevel = el("player-monster-level");
  const playerImage = el("player-monster-image");
  if (playerName) playerName.textContent = monster.name;
  if (playerLevel) playerLevel.textContent = `Lv.${data.level}`;
  if (playerImage) playerImage.innerHTML = monsterVisual(monster, "battle-monster-image");

  updateBattleHP();
  battleMessage(currentBattleNumber === 5
    ? `⚠️ ${currentWildMonster.name}が現れた！`
    : `⚔️ ${config.name}・バトル${currentBattleNumber}！九九で攻撃しよう！`);

  battleTimer = setTimeout(() => {
    battleTimer = null;
    createBattleQuestion();
  }, 250);
}


/* =========================================================
   バトルメッセージ
   ========================================================= */

function battleMessage(text) {
  const message = el("battle-message");
  if (message) message.textContent = text;
}


/* =========================================================
   バトルHP表示
   ========================================================= */

function updateBattleHP() {
  const enemyPercent = battleEnemyMaxHP > 0 ? Math.max(0, battleEnemyHP / battleEnemyMaxHP * 100) : 0;
  const playerPercent = battlePlayerMaxHP > 0 ? Math.max(0, battlePlayerHP / battlePlayerMaxHP * 100) : 0;
  const enemyFill = el("enemy-hp-fill");
  const playerFill = el("player-hp-fill");
  const enemyText = el("enemy-hp-text");
  const playerText = el("player-hp-text");
  if (enemyFill) enemyFill.style.width = `${enemyPercent}%`;
  if (playerFill) playerFill.style.width = `${playerPercent}%`;
  if (enemyText) enemyText.textContent = `${Math.max(0, battleEnemyHP)} / ${battleEnemyMaxHP}`;
  if (playerText) playerText.textContent = `${Math.max(0, battlePlayerHP)} / ${battlePlayerMaxHP}`;
}


/* =========================================================
   ステージ別・九九問題
   ========================================================= */

function createBattleQuestion() {
  if (battleEnemyHP <= 0 || battlePlayerHP <= 0) return;

  const config = getAdventureConfig(currentAdventureKey);
  if (!config) return;

  battleAnswering = true;

  const a = Math.floor(Math.random() * (config.questionMax - config.questionMin + 1)) + config.questionMin;
  const b = Math.floor(Math.random() * 9) + 1;
  battleAnswer = a * b;

  const question = el("battle-question");
  if (question) question.textContent = `${a} × ${b} = ?`;

  createBattleAnswers();
}

function createBattleAnswers() {
  const container = el("battle-answers");
  if (!container) return;
  container.innerHTML = "";
  const choices = new Set([battleAnswer]);
  while (choices.size < 4) {
    const wrong = Math.max(1, battleAnswer + Math.floor(Math.random() * 11) - 5);
    choices.add(wrong);
  }
  [...choices].sort(() => Math.random() - 0.5).forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "battle-answer";
    button.textContent = value;
    button.addEventListener("click", () => checkBattleAnswer(value, button));
    container.appendChild(button);
  });
}


/* =========================================================
   バトル回答
   ========================================================= */

function checkBattleAnswer(answer, button) {
  if (!battleAnswering) return;
  battleAnswering = false;
  document.querySelectorAll(".battle-answer").forEach(item => item.disabled = true);

  const data = getMonsterData(selectedMonsterId);
  if (!data) return;

  if (Number(answer) === Number(battleAnswer)) {
    button.classList.add("correct");
    battleCombo++;
    let damage = data.attack;
    if (battleCombo >= 3) damage += 5;
    battleEnemyHP = Math.max(0, battleEnemyHP - damage);
    battleMessage(battleCombo >= 3 ? `🔥 ${battleCombo}コンボ！ ${damage}ダメージ！` : `💥 ${damage}ダメージ！`);
    updateBattleHP();

    if (battleEnemyHP <= 0) {
      battleTimer = setTimeout(() => { battleTimer = null; battleWin(); }, 500);
      return;
    }

    battleTimer = setTimeout(() => { battleTimer = null; enemyAttack(); }, 400);
  }
  else {
    button.classList.add("wrong");
    battleCombo = 0;
    document.querySelectorAll(".battle-answer").forEach(item => {
      if (Number(item.textContent) === Number(battleAnswer)) item.classList.add("correct");
    });
    battleMessage(`💡 正解は ${battleAnswer}！`);
    battleTimer = setTimeout(() => { battleTimer = null; enemyAttack(); }, 450);
  }
}


/* =========================================================
   敵攻撃
   ========================================================= */

function enemyAttack() {
  if (battleEnemyHP <= 0 || battlePlayerHP <= 0) return;
  const data = getMonsterData(selectedMonsterId);
  if (!data) return;

  const damage = Math.max(1, currentWildMonster.attack - Math.floor(data.defense / 5));
  battlePlayerHP = Math.max(0, battlePlayerHP - damage);
  adventureCurrentHP[currentAdventureKey] = battlePlayerHP;
  syncLegacyForestState();
  battleMessage(`👹 ${currentWildMonster.name}の攻撃！ ${damage}ダメージ！`);
  updateBattleHP();
  saveGame();

  if (battlePlayerHP <= 0) {
    battleTimer = setTimeout(() => { battleTimer = null; battleLose(); }, 500);
    return;
  }

  battleTimer = setTimeout(() => { battleTimer = null; createBattleQuestion(); }, 300);
}


/* =========================================================
   バトル勝利
   ========================================================= */

function battleWin() {
  const data = getMonsterData(selectedMonsterId);
  const config = getAdventureConfig(currentAdventureKey);
  if (!data || !config) return;

  battleWins++;
  battleExpReward = currentBattleNumber === 5 ? 100 : 20 + currentBattleNumber * 5;
  const oldLevel = data.level;
  const leveledUp = gainExp(selectedMonsterId, battleExpReward);

  adventureCurrentHP[currentAdventureKey] = battlePlayerHP;
  setAdventureProgress(currentAdventureKey, Math.max(getAdventureProgress(currentAdventureKey), currentBattleNumber));

  const isBoss = currentBattleNumber === 5;
  const icon = el("battle-result-icon");
  const title = el("battle-result-title");
  const message = el("battle-result-message");
  const exp = el("battle-exp");
  const coins = el("battle-coins");
  const next = el("battle-next-button");

  if (icon) icon.textContent = isBoss ? "🏆" : "⚔️";
  if (title) title.textContent = isBoss ? `${config.icon} ${config.name}クリア！` : "🎉 バトル勝利！";
  if (message) {
    message.textContent = isBoss
      ? `${config.boss.name}を倒した！`
      : `バトル${currentBattleNumber}クリア！\n残りHP ${battlePlayerHP} / ${battlePlayerMaxHP}`;
  }
  if (exp) exp.textContent = `+${battleExpReward}`;
  if (coins) coins.textContent = `+${currentBattleNumber * 5}`;
  if (next) next.textContent = isBoss ? "🗺️ 冒険マップへ" : `⚔️ バトル${currentBattleNumber + 1}へ`;

  saveGame();
  updateAdventureMap(currentAdventureKey);
  updateWorldStats();
  showScreen("battle-result-screen");

  if (leveledUp) {
    setTimeout(() => showLevelUp(selectedMonsterId, oldLevel), 700);
  }
}


/* =========================================================
   バトル敗北
   ========================================================= */

function battleLose() {
  const config = getAdventureConfig(currentAdventureKey);
  const icon = el("battle-result-icon");
  const title = el("battle-result-title");
  const message = el("battle-result-message");
  const exp = el("battle-exp");
  const coins = el("battle-coins");
  const next = el("battle-next-button");

  if (icon) icon.textContent = "💦";
  if (title) title.textContent = "今回は負けてしまった…";
  if (message) message.textContent = `${config ? config.name : "冒険"}をやり直そう！`;
  if (exp) exp.textContent = "+0";
  if (coins) coins.textContent = "+0";
  if (next) next.textContent = "🔄 最初から挑戦";

  adventureCurrentHP[currentAdventureKey] = 0;
  adventureBattleMonsterId[currentAdventureKey] = null;
  syncLegacyForestState();
  saveGame();
  showScreen("battle-result-screen");
}


/* =========================================================
   次のバトル
   ========================================================= */

function nextBattle() {
  const key = currentAdventureKey;

  if (battlePlayerHP <= 0) {
    startAdventureBattle(key, 1);
    return;
  }

  if (currentBattleNumber === 5) {
    adventureCurrentHP[key] = 0;
    adventureBattleMonsterId[key] = null;
    syncLegacyForestState();
    saveGame();
    openWorld();
    return;
  }

  const next = currentBattleNumber + 1;
  if (getAdventureProgress(key) >= next - 1) {
    startAdventureBattle(key, next);
  }
}


/* =========================================================
   バトルからステージマップへ
   ========================================================= */

function battleReturnAdventure() {
  if (battleTimer) {
    clearTimeout(battleTimer);
    battleTimer = null;
  }
  battleAnswering = false;

  if (battlePlayerMaxHP > 0) {
    adventureCurrentHP[currentAdventureKey] = battlePlayerHP;
  }
  syncLegacyForestState();
  saveGame();
  openAdventureStage(currentAdventureKey);
}

function battleBackForest() {
  battleReturnAdventure();
}

function battleReturnForest() {
  battleReturnAdventure();
}


/* =========================================================
   セーブデータリセット
   ========================================================= */

function resetGame() {

  const answer = confirm(
    "⚠️ セーブデータをすべて消去します。\n\n" +
    "・九九のクリア状況\n" +
    "・星評価\n" +
    "・仲間モンスター\n" +
    "・育成データ\n" +
    "・冒険記録\n" +
    "・はじまりの森の進行\n" +
    "・九九の湖の進行\n\n" +
    "すべて最初からになります。\n\n" +
    "本当に消去しますか？"
  );

  if (!answer) return;

  try {
    localStorage.removeItem(SAVE_KEY);
  }
  catch (error) {
    console.error(error);
  }

  clearedStages = [];
  stageStars = {};
  caughtMonsters = [];
  monsterData = {};
  adventureUnlocked = false;
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

  adventureProgress = { forest: 0, lake: 0 };
  adventureCurrentHP = { forest: 0, lake: 0 };
  adventureBattleMonsterId = { forest: null, lake: null };
  currentAdventureKey = "forest";

  forestProgress = 0;
  forestCurrentHP = 0;
  forestBattleMonsterId = null;

  currentBattleNumber = 0;
  currentWildMonster = null;
  battlePlayerHP = 0;
  battlePlayerMaxHP = 0;
  battleEnemyHP = 0;
  battleEnemyMaxHP = 0;
  battleAnswer = 0;
  battleAnswering = false;
  battleCombo = 0;

  if (questionTimer) { clearTimeout(questionTimer); questionTimer = null; }
  if (battleTimer) { clearTimeout(battleTimer); battleTimer = null; }

  createStageList();
  updateAdventureMap("forest");
  updateAdventureMap("lake");
  updateWorldStats();

  alert("✨ セーブデータをリセットしました！\n\n1の段から新しい冒険を始めよう！");
  showScreen("training-screen");
}


/* =========================================================
   ボタン接続
   ========================================================= */

/* タイトル → 修行 */
el("start-button")?.addEventListener("click", () => {
  createStageList();
  showScreen("training-screen");
});

/* 修行クイズ → 修行道場 */
el("back-training")?.addEventListener("click", () => {
  createStageList();
  showScreen("training-screen");
});

/* 修行結果 → 次 */
el("next-stage")?.addEventListener("click", () => {
  if (currentStage === 9) showScreen("adventure-screen");
  else startTraining(currentStage + 1);
});

/* 修行結果 → 再挑戦 */
el("retry-stage")?.addEventListener("click", () => startTraining(currentStage));

/* 修行結果 → 図鑑 */
el("monster-book-button")?.addEventListener("click", () => openBook("result-screen"));
el("result-book")?.addEventListener("click", () => openBook("result-screen"));

/* 冒険解禁画面 → ワールド */
el("adventure-button")?.addEventListener("click", openWorld);

/* ワールド → 戻る */
el("world-back-button")?.addEventListener("click", () => showScreen("training-screen"));

/* ワールド → 森 / 湖 */
el("forest-area")?.addEventListener("click", openForest);
el("lake-area")?.addEventListener("click", openLake);

/* 森・湖 → ワールド */
el("forest-back-button")?.addEventListener("click", openWorld);
el("lake-back-button")?.addEventListener("click", openWorld);

/* 森・湖のバトルノード */
document.querySelectorAll("#forest-screen .battle-node, #forest-screen .boss-node, #lake-screen .battle-node, #lake-screen .boss-node").forEach(node => {
  node.addEventListener("click", () => {
    const number = Number(node.dataset.battle);
    startAdventureBattle(currentAdventureKey, number);
  });
});

/* バトル → 冒険ステージ */
el("battle-back-button")?.addEventListener("click", battleBackForest);

/* バトル結果 → 次 */
el("battle-next-button")?.addEventListener("click", nextBattle);

/* バトル結果 → 冒険ステージ */
el("battle-return-forest")?.addEventListener("click", battleReturnForest);

/* 育成 → 開く */
el("monster-button")?.addEventListener("click", openMonsterScreen);

/* 育成 → 冒険 */
el("back-world")?.addEventListener("click", openWorld);

/* レベルアップ → 育成 */
el("levelup-button")?.addEventListener("click", () => {
  renderMonsterParty();
  renderMonsterDetail();
  showScreen("training-monster-screen");
});

/* 図鑑 → 戻る */
el("book-back")?.addEventListener("click", () => showScreen(returnScreen));

/* リセット */
el("reset-data")?.addEventListener("click", resetGame);

/* 下部メニュー → 修行 */
el("training-button")?.addEventListener("click", () => {
  createStageList();
  showScreen("training-screen");
});

/* 下部メニュー → 冒険 */
el("world-button")?.addEventListener("click", openWorld);

/* 下部メニュー → 育成 */
el("monster-button")?.addEventListener("click", openMonsterScreen);

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

updateAdventureMap("forest");
updateAdventureMap("lake");

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
  "🌊 九九の湖 ONLINE"
);

console.log(
  "⚔️ 5連戦バトル ONLINE"
);

console.log(
  "🧮 森：1～3の段 / 湖：3～5の段"
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
