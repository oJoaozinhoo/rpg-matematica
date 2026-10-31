
import {
  setQuestion,
  renderAnswerButtons
} from "../views/ArenaView.js";

let currentAnswer = "";
let currentTopic = "Geral";

const questionPools = {
  facil: [
    {
      question: "Ana possui 3 camisetas e 2 calças. Quantas combinações diferentes ela pode formar usando uma de cada?",
      options: ["5", "6", "8", "9"],
      answer: "6",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Uma lanchonete oferece 4 tipos de suco ou 3 tipos de refrigerante. Escolhendo apenas uma bebida, quantas opções existem?",
      options: ["7", "12", "4", "3"],
      answer: "7",
      topic: "Princípio aditivo"
    },
    {
      question: "Um restaurante oferece 2 opções de entrada ou 5 opções de prato principal. Escolhendo apenas uma opção, quantas possibilidades existem?",
      options: ["2", "5", "7", "10"],
      answer: "7",
      topic: "Princípio aditivo"
    },
    {
      question: "Uma lanchonete oferece 3 tipos de sanduíche e 4 tipos de suco. Quantos pedidos diferentes podem ser feitos escolhendo um de cada?",
      options: ["7", "12", "10", "14"],
      answer: "12",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Uma pessoa possui 5 camisetas e 2 calças. Quantas combinações diferentes pode formar usando uma de cada?",
      options: ["7", "10", "12", "15"],
      answer: "10",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Existem 3 caminhos para chegar à escola e 2 meios de transporte disponíveis. Escolhendo um caminho e um transporte, quantas possibilidades existem?",
      options: ["5", "6", "8", "9"],
      answer: "6",
      topic: "Princípio multiplicativo"
    }
  ],

  normal: [
    {
      question: "Existem 10 meias para serem distribuídas em 9 gavetas. O que podemos garantir?",
      options: [
        "Cada gaveta terá pelo menos uma meia",
        "Pelo menos uma gaveta terá 2 meias ou mais",
        "Todas terão exatamente 2 meias",
        "Nenhuma terá mais de uma meia"
      ],
      answer: "Pelo menos uma gaveta terá 2 meias ou mais",
      topic: "Princípio da casa dos pombos"
    },
    {
      question: "Uma senha possui 2 algarismos. Cada posição pode receber qualquer número de 0 a 9, inclusive com repetição. Quantas senhas existem?",
      options: ["10", "100", "90", "20"],
      answer: "100",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Uma loja oferece 6 camisetas e 3 calças. Quantos conjuntos diferentes podem ser formados escolhendo uma de cada?",
      options: ["9", "18", "15", "20"],
      answer: "18",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Um código possui 4 algarismos diferentes, escolhidos entre 0 e 9. Quantos códigos podem ser formados, permitindo zero na primeira posição?",
      options: ["5040", "10000", "4000", "9000"],
      answer: "5040",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Oito pessoas fazem aniversário em dias da semana. O que podemos garantir?",
      options: [
        "Todas nasceram no mesmo dia",
        "Pelo menos duas nasceram no mesmo dia da semana",
        "Todas nasceram em dias diferentes",
        "Exatamente duas nasceram no mesmo dia"
      ],
      answer: "Pelo menos duas nasceram no mesmo dia da semana",
      topic: "Princípio da casa dos pombos"
    },
    {
      question: "Uma pessoa possui 4 camisas e 3 calças. Quantas combinações diferentes pode formar usando uma de cada?",
      options: ["7", "12", "16", "24"],
      answer: "12",
      topic: "Princípio multiplicativo"
    }
  ],

  dificil: [
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
      question: "Oito bolas serão distribuídas em 3 caixas. Qual é a quantidade mínima de bolas que podemos garantir em pelo menos uma caixa?",
      options: ["2", "3", "4", "8"],
      answer: "3",
      topic: "Princípio da casa dos pombos"
    },
    {
      question: "Uma senha possui 5 algarismos diferentes, escolhidos entre 0 e 9. Quantas senhas podem ser formadas?",
      options: ["30240", "100000", "50000", "15120"],
      answer: "30240",
      topic: "Princípio multiplicativo"
    },
    {
      question: "Sete livros serão distribuídos em 3 prateleiras. Qual é o mínimo de livros que podemos garantir em pelo menos uma prateleira?",
      options: ["2", "3", "4", "7"],
      answer: "3",
      topic: "Princípio da casa dos pombos"
    },
    {
      question: "Seis pessoas utilizam 5 computadores. O que podemos garantir?",
      options: [
        "Cada pessoa terá um computador exclusivo",
        "Pelo menos duas pessoas utilizarão o mesmo computador",
        "Todas utilizarão o mesmo computador",
        "Duas pessoas ficarão sem computador"
      ],
      answer: "Pelo menos duas pessoas utilizarão o mesmo computador",
      topic: "Princípio da casa dos pombos"
    },
    {
      question: "Um código possui 4 algarismos diferentes, escolhidos entre 0 e 9. O primeiro não pode ser zero. Quantos códigos existem?",
      options: ["4536", "5040", "9000", "3024"],
      answer: "4536",
      topic: "Princípio multiplicativo"
    }
  ]
};

const questionBags = {
  facil: [],
  normal: [],
  dificil: []
};

function getNextQuestion(difficulty) {
  const level = questionPools[difficulty]
    ? difficulty
    : "normal";

  const questions = questionPools[level];

  if (questionBags[level].length === 0) {
    questionBags[level] = questions.map((_, index) => index);

    for (let i = questionBags[level].length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [
        questionBags[level][i],
        questionBags[level][j]
      ] = [
        questionBags[level][j],
        questionBags[level][i]
      ];
    }
  }

  return questions[questionBags[level].pop()];
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

  const selectedQuestion = getNextQuestion(difficulty);

  currentAnswer = selectedQuestion.answer;
  currentTopic = selectedQuestion.topic;

  setQuestion(selectedQuestion.question);
  renderAnswerButtons(selectedQuestion.options, onSelect);
}

export {
  generateQuestion,
  getCurrentAnswer,
  getCurrentTopic
};
