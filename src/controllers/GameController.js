import { getState, setState, resetGame } from "../models/GameState.js";
import { playSound } from "../services/AudioService.js";
import {
  generateQuestion,
  getCurrentAnswer,
  getCurrentTopic,
  getCurrentExplanation,
} from "../services/CombatService.js";
import {
  updateScore,
  updateBars,
  setLog,
  updateTimerDisplay,
} from "../views/HudView.js";
import {
  shakeArena,
  animateCharacter,
  spawnDamageFloat,
  lockAnswers,
} from "../views/ArenaView.js";
import { show, hide, setEndScreen, fadeOutThen } from "../views/ScreenView.js";

let countdownInterval = null;
let selectedTimeLimit = null;

let tutorialCurrentStep = 0;

const tutorialSteps = [
  {
    title: "🎮 OBJETIVO DO JOGO",
    text: "Seu objetivo é derrotar o inimigo respondendo corretamente às questões de Matemática Discreta. Acerte as respostas para causar dano ao adversário e vencer a batalha.",
  },
  {
    title: "⚔️ ESCOLHA SUA DIFICULDADE",
    text: "Escolha entre Fácil, Normal e Difícil. Cada nível altera a pontuação, o dano causado e a penalidade por respostas incorretas.",
  },
  {
    title: "🧠 RESPONDA ÀS QUESTÕES",
    text: "Leia atentamente cada questão e escolha uma das alternativas disponíveis. Cada acerto aumenta sua pontuação e causa dano ao inimigo.",
  },
  {
    title: "⏱️ TEMPO E COMBOS",
    text: "Você pode escolher jogar com tempo limitado ou sem cronômetro. Acerte questões consecutivas para aumentar seu combo e receber bônus de dano e pontuação.",
  },
  {
    title: "🏆 VITÓRIA E DERROTA",
    text: "Derrote o inimigo para vencer! Cuidado com os erros e com o tempo. No modo One Error, uma única resposta incorreta ou tempo esgotado encerra a partida.",
  },
];

function updateTutorial() {
  const title = document.getElementById("tutorial-title");
  const text = document.getElementById("tutorial-text");
  const step = document.getElementById("tutorial-step");
  const prev = document.getElementById("tutorial-prev");
  const next = document.getElementById("tutorial-next");

  const current = tutorialSteps[tutorialCurrentStep];

  if (!title || !text || !step || !prev || !next) return;

  title.textContent = current.title;
  text.textContent = current.text;

  step.textContent =
    `${tutorialCurrentStep + 1} / ${tutorialSteps.length}`;

  prev.disabled = tutorialCurrentStep === 0;

  next.textContent =
    tutorialCurrentStep === tutorialSteps.length - 1
      ? "FINALIZAR"
      : "PRÓXIMO →";
}

function openTutorial() {
  tutorialCurrentStep = 0;

  updateTutorial();

  document
    .getElementById("tutorial-modal")
    .classList.remove("hidden");
}

function closeTutorial() {
  document
    .getElementById("tutorial-modal")
    .classList.add("hidden");
}

function nextTutorialStep() {
  if (tutorialCurrentStep < tutorialSteps.length - 1) {
    tutorialCurrentStep++;
    updateTutorial();
  } else {
    closeTutorial();
  }
}

function previousTutorialStep() {
  if (tutorialCurrentStep > 0) {
    tutorialCurrentStep--;
    updateTutorial();
  }
}

const POINTS_BY_LEVEL = {
  facil: 10,
  normal: 15,
  dificil: 20,
};

const PENALTY_BY_LEVEL = {
  facil: 5,
  normal: 7,
  dificil: 10,
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getHitMessage(damage, points) {
  return randomItem([
    `Golpe certeiro! -${damage} HP / +${points} pts`,
    `Boa resposta! O inimigo sofreu -${damage} HP / +${points} pts`,
    `Ataque bem-sucedido! -${damage} HP / +${points} pts`,
    `Você acertou em cheio! -${damage} HP / +${points} pts`,
  ]);
}

function getComboMessage(combo, damage, points) {
  return randomItem([
    `ACERTO CRÍTICO! Combo x${combo} -${damage} HP / +${points} pts`,
    `Sequência perfeita! Combo x${combo} -${damage} HP / +${points} pts`,
    `O herói ganhou ritmo! Combo x${combo} -${damage} HP / +${points} pts`,
    `Pressão total! Combo x${combo} -${damage} HP / +${points} pts`,
  ]);
}

function getMissMessage(damage, penalty) {
  return randomItem([
    `Resposta incorreta! Você perdeu -${damage} HP / -${penalty} pts`,
    `Vacilo no cálculo! -${damage} HP / -${penalty} pts`,
    `O inimigo aproveitou seu erro! -${damage} HP / -${penalty} pts`,
    `Errou a relação! -${damage} HP / -${penalty} pts`,
  ]);
}

function getTimeoutMessage(damage, penalty) {
  return randomItem([
    `Tempo esgotado! -${damage} HP / -${penalty} pts`,
    `Você hesitou demais! -${damage} HP / -${penalty} pts`,
    `O tempo acabou e o inimigo atacou! -${damage} HP / -${penalty} pts`,
    `Sem resposta a tempo! -${damage} HP / -${penalty} pts`,
  ]);
}

function getOneErrorMessage(penalty) {
  return randomItem([
    `Erro fatal! Fim de jogo / -${penalty} pts`,
    `Uma única falha foi suficiente! / -${penalty} pts`,
    `No modo One Error, qualquer deslize encerra a luta / -${penalty} pts`,
    `Você caiu no primeiro erro / -${penalty} pts`,
  ]);
}

function getOneErrorTimeoutMessage(penalty) {
  return randomItem([
    `Tempo esgotado! No modo One Error isso encerra a luta / -${penalty} pts`,
    `Você demorou demais. Fim de jogo / -${penalty} pts`,
    `No One Error, o tempo também pune com derrota / -${penalty} pts`,
    `O cronômetro zerou e a batalha acabou / -${penalty} pts`,
  ]);
}

function normalizeTopicName(topic) {
  const map = {
    "É função": "É função",
    Funcao: "É função",
    Função: "É função",
    Dominio: "Domínio",
    Domínio: "Domínio",
    Reflexiva: "Reflexiva",
    Simetrica: "Simétrica",
    Simétrica: "Simétrica",
    Antissimetrica: "Antissimétrica",
    Antissimétrica: "Antissimétrica",
    Transitiva: "Transitiva",
    Imagem: "Imagem",
    Contradominio: "Contradomínio",
    Contradomínio: "Contradomínio",
    Injetora: "Injetora",
    Sobrejetora: "Sobrejetora",
    Bijetora: "Bijetora",
    "Elemento sem imagem": "Elemento sem imagem",
  };

  return map[topic] || topic || "Geral";
}

function registerTopicResult(topic, field) {
  const normalizedTopic = normalizeTopicName(topic);
  const { statsByTopic } = getState();

  const current = statsByTopic[normalizedTopic] || {
    correct: 0,
    wrong: 0,
    timeout: 0,
  };

  setState({
    statsByTopic: {
      ...statsByTopic,
      [normalizedTopic]: {
        ...current,
        [field]: current[field] + 1,
      },
    },
  });
}

function getHardestTopic() {
  const { statsByTopic } = getState();
  const entries = Object.entries(statsByTopic);

  if (!entries.length) return "Nenhum conteúdo identificado";

  const specificEntries = entries.filter(([topic]) => topic !== "É função");
  const source = specificEntries.length ? specificEntries : entries;

  source.sort((a, b) => {
    const aWeight = a[1].wrong + a[1].timeout;
    const bWeight = b[1].wrong + b[1].timeout;
    return bWeight - aWeight;
  });

  const hardest = source[0];

  if (hardest[1].wrong + hardest[1].timeout === 0) {
    return "Nenhuma dificuldade! Você acertou todas as questões!";
  }

  return hardest[0];
}
function getLastSpecificTopic() {
  const { lastTopic, statsByTopic } = getState();

  if (lastTopic && lastTopic !== "É função") {
    return lastTopic;
  }

  const entries = Object.keys(statsByTopic).filter(
    (topic) => topic !== "É função",
  );

  if (entries.length) {
    return entries[entries.length - 1];
  }

  return lastTopic || "Não identificado";
}

function stopTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// Mostra a resolução e informa se o jogador acertou ou errou.
function showExplanation(correct = false) {
  const screen = document.getElementById("explanation-screen");
  const badge = document.getElementById("result-badge");
  const answer = document.getElementById("explanation-answer");
  const explanation = document.getElementById("explanation-text");

  if (!screen || !answer || !explanation) {
    console.error("Elemento da resolução não encontrado:", {
      screen,
      answer,
      explanation,
      badge
    });
    return;
  }

  if (badge) {
    badge.textContent = correct
      ? "✓ VOCÊ ACERTOU!"
      : "✕ VOCÊ ERROU!";

    badge.className = correct
      ? "rounded-full px-4 py-2 text-sm font-bold border border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
      : "rounded-full px-4 py-2 text-sm font-bold border border-red-400/50 bg-red-500/20 text-red-300";
  }

  answer.textContent = `Resposta correta: ${getCurrentAnswer()}`;

  explanation.textContent =
    getCurrentExplanation() || "Resolução não disponível.";

  screen.classList.remove("hidden");
}

// Fecha a explicação e continua a partida.
function continueAfterExplanation() {
  document.getElementById("explanation-screen").classList.add("hidden");

  const updated = getState();

  if (updated.playerHP <= 0 || updated.enemyHP <= 0) {
    endGame();
    return;
  }

  generateQuestion(updated.difficulty, onAnswer);
  setState({ locked: false });
  startQuestionTimer();
}

function resolveTimeout() {
  const {
    locked,
    playerHP,
    enemyHP,
    difficulty,
    gameMode,
    score,
    timeoutAnswers,
  } = getState();

  if (locked || playerHP <= 0 || enemyHP <= 0) return;

  const topic = getCurrentTopic();
  const penalty = PENALTY_BY_LEVEL[difficulty] ?? 5;
  const damageBase = { facil: 15, normal: 20, dificil: 25 };

  const damage =
    (damageBase[difficulty] ?? 20) + Math.floor(Math.random() * 6) - 2;

  setState({ locked: true });
  lockAnswers();
  stopTimer();

  registerTopicResult(topic, "timeout");

  if (gameMode === "one-error") {
    setState({
      playerHP: 0,
      combo: 0,
      score: Math.max(0, score - penalty),
      timeoutAnswers: timeoutAnswers + 1,
      lastTopic: normalizeTopicName(topic),
    });

    setLog(getOneErrorTimeoutMessage(penalty));
    spawnDamageFloat("heroChar", "KO", "hero");
    animateCharacter("enemy");
    playSound("error");
  } else {
    setState({
      playerHP: playerHP - damage,
      combo: 0,
      score: Math.max(0, score - penalty),
      timeoutAnswers: timeoutAnswers + 1,
      lastTopic: normalizeTopicName(topic),
    });

    setLog(getTimeoutMessage(damage, penalty));
    spawnDamageFloat("heroChar", damage, "hero");
    animateCharacter("enemy");
    playSound("error");
  }

  const updated = getState();

  updateBars(updated.playerHP, updated.enemyHP);
  updateScore(updated.score);
  shakeArena();

  showExplanation(false);
}

function startQuestionTimer() {
  stopTimer();

  const limit = selectedTimeLimit;

  if (limit === null) {
    updateTimerDisplay(null);
    return;
  }

  setState({ timeLeft: limit });
  updateTimerDisplay(limit);

  countdownInterval = setInterval(() => {
    const { timeLeft, playerHP, enemyHP, locked } = getState();

    if (locked || playerHP <= 0 || enemyHP <= 0) {
      stopTimer();
      return;
    }

    const nextTime = timeLeft - 1;

    setState({ timeLeft: nextTime });
    updateTimerDisplay(nextTime);

    if (nextTime <= 0) {
      resolveTimeout();
    }
  }, 1000);
}

function onAnswer(selected) {
  const {
    locked,
    playerHP,
    enemyHP,
    difficulty,
    score,
    combo,
    gameMode,
    correctAnswers,
    wrongAnswers,
    maxCombo,
  } = getState();

  if (locked || playerHP <= 0 || enemyHP <= 0) return;

  const topic = getCurrentTopic();
  const normalizedTopic = normalizeTopicName(topic);

  setState({ locked: true });
  lockAnswers();
  stopTimer();

  const DAMAGE_BY_LEVEL = {
    facil: 15,
    normal: 20,
    dificil: 25,
  };

  const base = DAMAGE_BY_LEVEL[difficulty] ?? 20;
  const randomBonus = Math.floor(Math.random() * 6) - 2;
  const correct = selected === getCurrentAnswer();

  let damage = base + randomBonus;

  if (correct) {
    const nextCombo = combo + 1;
    const comboBonus = nextCombo >= 3 ? 10 : nextCombo === 2 ? 5 : 0;
    const pointsBase = POINTS_BY_LEVEL[difficulty] ?? 10;
    const totalPoints = pointsBase + comboBonus;

    damage += comboBonus;

    setState({
      score: score + totalPoints,
      enemyHP: enemyHP - damage,
      combo: nextCombo,
      maxCombo: Math.max(maxCombo, nextCombo),
      correctAnswers: correctAnswers + 1,
      lastTopic: normalizedTopic,
    });

    registerTopicResult(normalizedTopic, "correct");

    setLog(
      comboBonus > 0
        ? getComboMessage(nextCombo, damage, totalPoints)
        : getHitMessage(damage, totalPoints),
    );

    spawnDamageFloat("enemyChar", damage, "enemy");
    animateCharacter("hero");
    playSound("hit");
  } else if (gameMode === "one-error") {
    const penalty = PENALTY_BY_LEVEL[difficulty] ?? 5;

    setState({
      playerHP: 0,
      combo: 0,
      score: Math.max(0, score - penalty),
      wrongAnswers: wrongAnswers + 1,
      lastTopic: normalizedTopic,
    });

    registerTopicResult(normalizedTopic, "wrong");
    setLog(getOneErrorMessage(penalty));
    spawnDamageFloat("heroChar", "KO", "hero");
    animateCharacter("enemy");
    playSound("error");
  } else {
    const penalty = PENALTY_BY_LEVEL[difficulty] ?? 5;

    setState({
      playerHP: playerHP - damage,
      combo: 0,
      score: Math.max(0, score - penalty),
      wrongAnswers: wrongAnswers + 1,
      lastTopic: normalizedTopic,
    });

    registerTopicResult(normalizedTopic, "wrong");
    setLog(getMissMessage(damage, penalty));
    spawnDamageFloat("heroChar", damage, "hero");
    animateCharacter("enemy");
    playSound("error");
  }

  const updated = getState();

  updateBars(updated.playerHP, updated.enemyHP);
  updateScore(updated.score);
  shakeArena();

  showExplanation(correct);
}

function startGame(difficulty, gameMode = "classic") {
  resetGame(difficulty, gameMode, selectedTimeLimit);

  fadeOutThen("menu", () => {
    hide("menu");
    show("game-view");
    updateBars(100, 100);
    updateScore(0);

    setLog(gameMode === "one-error" ? "MODO ONE ERROR" : "");

    generateQuestion(difficulty, onAnswer);
    setState({ locked: false });

    startQuestionTimer();
  });
}

function endGame() {
  stopTimer();

  const {
    enemyHP,
    score,
    correctAnswers,
    wrongAnswers,
    timeoutAnswers,
    maxCombo,
  } = getState();

  hide("game-view");

  setEndScreen(
    enemyHP <= 0,
    score,
    {
      correctAnswers,
      wrongAnswers,
      timeoutAnswers,
      maxCombo,
    },
    getHardestTopic(),
    getLastSpecificTopic(),
  );

  show("end-screen");

  if (enemyHP <= 0) playSound("win");
  else playSound("lose");
}

function restartGame() {
  stopTimer();

  document.getElementById("explanation-screen").classList.add("hidden");

  hide("end-screen");
  show("menu");
}

function dismissIntro() {
  console.log("Clique na tela inicial detectado!");

  const intro = document.getElementById("intro");

  intro.classList.add("anim-intro-out");

  setTimeout(() => {
    hide("intro");
    show("menu");
  }, 850);
}

function bindEvents() {
  document
    .getElementById("intro")
    .addEventListener("click", dismissIntro);

  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".time-btn").forEach((item) => {
        item.classList.remove(
          "border-gold/40",
          "bg-gold/20",
          "text-gold-light",
        );

        item.classList.add(
          "border-white/15",
          "bg-black/35",
          "text-white/80",
        );
      });

      btn.classList.remove(
        "border-white/15",
        "bg-black/35",
        "text-white/80",
      );

      btn.classList.add(
        "border-gold/40",
        "bg-gold/20",
        "text-gold-light",
      );

      selectedTimeLimit =
        btn.dataset.time === "free" ? null : Number(btn.dataset.time);
    });
  });

  document.querySelectorAll("button[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      playSound("click");
      startGame(btn.dataset.level, btn.dataset.mode || "classic");
    });
  });

  document
    .getElementById("continue-btn")
    .addEventListener("click", continueAfterExplanation);

  document
    .getElementById("restart-btn")
    .addEventListener("click", restartGame);

  document
    .getElementById("tutorial-open")
    .addEventListener("click", openTutorial);

  document
    .getElementById("tutorial-close")
    .addEventListener("click", closeTutorial);

  document
    .getElementById("tutorial-next")
    .addEventListener("click", nextTutorialStep);

  document
    .getElementById("tutorial-prev")
    .addEventListener("click", previousTutorialStep);
}

bindEvents();
