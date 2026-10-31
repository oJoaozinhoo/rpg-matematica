
import {
  setQuestion,
  renderAnswerButtons
} from "../views/ArenaView.js";

let currentAnswer = "";
let currentTopic = "Geral";
let answerCallback = () => {};

const questions = [
  {
    question: "Ana possui 3 camisetas e 2 calças. Quantas combinações diferentes ela pode formar usando uma camiseta e uma calça?",
    options: ["5", "6", "8", "9"],
    answer: "6",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Uma lanchonete oferece 4 tipos de suco ou 3 tipos de refrigerante. Escolhendo apenas uma bebida, quantas opções existem?",
    options: ["7", "12", "1", "4"],
    answer: "7",
    topic: "Princípio aditivo"
  },
  {
    question: "Existem 10 meias para serem distribuídas em 9 gavetas. O que podemos garantir?",
    options: [
      "Cada gaveta terá pelo menos uma meia",
      "Pelo menos uma gaveta terá 2 meias ou mais",
      "Todas as gavetas terão exatamente 2 meias",
      "Nenhuma gaveta terá mais de uma meia"
    ],
    answer: "Pelo menos uma gaveta terá 2 meias ou mais",
    topic: "Princípio da casa dos pombos"
  },
  {
    question: "Uma lanchonete oferece 3 tipos de sanduíche e 4 tipos de suco. Quantos pedidos diferentes podem ser feitos escolhendo um de cada?",
    options: ["7", "12", "10", "14"],
    answer: "12",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Em uma turma existem 13 alunos. Considerando os 12 meses do ano, o que podemos garantir sobre os aniversários?",
    options: [
      "Todos terão meses diferentes",
      "Pelo menos dois alunos fazem aniversário no mesmo mês",
      "Exatamente dois alunos fazem aniversário no mesmo mês",
      "Existem 13 meses diferentes"
    ],
    answer: "Pelo menos dois alunos fazem aniversário no mesmo mês",
    topic: "Princípio da casa dos pombos"
  },
  {
    question: "Um restaurante oferece 2 opções de entrada ou 5 opções de prato principal. Escolhendo apenas uma opção, quantas possibilidades existem?",
    options: ["2", "5", "7", "10"],
    answer: "7",
    topic: "Princípio aditivo"
  },
  {
    question: "Uma senha possui 2 algarismos. Cada posição pode receber qualquer número de 0 a 9, inclusive com repetição. Quantas senhas existem?",
    options: ["10", "100", "90", "20"],
    answer: "100",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Oito bolas serão distribuídas em 3 caixas. Qual é a quantidade mínima de bolas que podemos garantir em pelo menos uma caixa?",
    options: ["2", "3", "4", "8"],
    answer: "3",
    topic: "Princípio da casa dos pombos"
  }
];

let questionBag = [];

function getNextQuestion() {
  if (questionBag.length === 0) {
    questionBag = questions.map((_, index) => index);

    for (let i = questionBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionBag[i], questionBag[j]] =
        [questionBag[j], questionBag[i]];
    }
  }

  return questions[questionBag.pop()];
}

function getCurrentAnswer() {
  return currentAnswer;
}

function getCurrentTopic() {
  return currentTopic;
}

function generateQuestion(difficulty, onSelect) {
  document.getElementById("diagram").innerHTML = "";
  document.getElementById("options").innerHTML = "";

  answerCallback = onSelect;

  const selectedQuestion = getNextQuestion();

  currentAnswer = selectedQuestion.answer;
  currentTopic = selectedQuestion.topic;

  setQuestion(selectedQuestion.question);

  renderAnswerButtons(
    selectedQuestion.options,
    answerCallback
  );
}


const questions = [
  {
    question: "Ana possui 3 camisetas e 2 calças. Quantas combinações diferentes ela pode formar usando uma de cada?",
    options: ["5", "6", "8", "9"],
    answer: "6",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Uma lanchonete oferece 4 tipos de suco ou 3 tipos de refrigerante. Quantas opções de bebida existem?",
    options: ["7", "12", "4", "3"],
    answer: "7",
    topic: "Princípio aditivo"
  },
  {
    question: "Existem 10 meias para distribuir em 9 gavetas. O que podemos garantir?",
    options: [
      "Todas terão uma meia",
      "Pelo menos uma gaveta terá 2 meias",
      "Todas terão 2 meias",
      "Nenhuma terá 2 meias"
    ],
    answer: "Pelo menos uma gaveta terá 2 meias",
    topic: "Casa dos pombos"
  },
  {
    question: "Uma lanchonete oferece 3 sanduíches e 4 sucos. Quantos pedidos diferentes podem ser feitos escolhendo um de cada?",
    options: ["7", "12", "10", "14"],
    answer: "12",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Em uma turma existem 13 alunos e 12 meses do ano. O que podemos garantir sobre os aniversários?",
    options: [
      "Todos fazem aniversário em meses diferentes",
      "Pelo menos dois fazem aniversário no mesmo mês",
      "Todos fazem aniversário no mesmo mês",
      "Existem 13 meses"
    ],
    answer: "Pelo menos dois fazem aniversário no mesmo mês",
    topic: "Casa dos pombos"
  },
  {
    question: "Um restaurante oferece 2 entradas ou 5 pratos principais. Escolhendo apenas uma opção, quantas possibilidades existem?",
    options: ["2", "5", "7", "10"],
    answer: "7",
    topic: "Princípio aditivo"
  },
  {
    question: "Uma senha possui 2 algarismos, de 0 a 9, permitindo repetição. Quantas senhas diferentes existem?",
    options: ["10", "100", "90", "20"],
    answer: "100",
    topic: "Princípio multiplicativo"
  },
  {
    question: "Oito bolas serão distribuídas em 3 caixas. Qual é o mínimo garantido em pelo menos uma caixa?",
    options: ["2", "3", "4", "8"],
    answer: "3",
    topic: "Casa dos pombos"
  }
];

let questionBag = [];

function generateQuestion(difficulty, onSelect) {
  document.getElementById("diagram").innerHTML = "";
  document.getElementById("options").innerHTML = "";

  answerCallback = onSelect;

  if (questionBag.length === 0) {
    questionBag = questions.map((_, index) => index);

    for (let i = questionBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionBag[i], questionBag[j]] =
        [questionBag[j], questionBag[i]];
    }
  }

  const question = questions[questionBag.pop()];

  applyQuestion(question);
}

