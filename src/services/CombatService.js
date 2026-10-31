
import {
  setQuestion,
  renderAnswerButtons,
  renderQuestionIllustration
} from "../views/ArenaView.js";

let currentAnswer = "";
let currentTopic = "Geral";
let currentExplanation = "";

const questionPools = {
  facil: [
    {
      question: "Uma pessoa possui 3 camisetas e 2 calças. Quantas combinações diferentes pode formar?",
      options: ["5", "6", "8", "9"],
      answer: "6",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Uma lanchonete oferece 4 sucos ou 3 refrigerantes. Quantas opções de bebida existem?",
      options: ["7", "12", "4", "3"],
      answer: "7",
      topic: "Princípio Aditivo",
    },
    {
      question: "Um restaurante oferece 2 entradas ou 5 pratos principais. Quantas opções existem?",
      options: ["10", "7", "5", "3"],
      answer: "7",
      topic: "Princípio Aditivo",
    },
    {
      question: "Uma lanchonete oferece 3 sanduíches e 4 sucos. Quantas combinações podem ser feitas?",
      options: ["7", "12", "9", "16"],
      answer: "12",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Uma pessoa possui 5 camisetas e 2 calças. Quantas combinações diferentes pode formar?",
      options: ["7", "10", "12", "15"],
      answer: "10",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Existem 3 caminhos e 2 meios de transporte. Quantas combinações podem ser feitas?",
      options: ["5", "6", "8", "9"],
      answer: "6",
      topic: "Princípio Multiplicativo",
    },
  ],

  normal: [
    {
      question: "Em uma gaveta existem 10 meias e 9 gavetas disponíveis. O que podemos garantir?",
      options: [
        "Uma gaveta terá pelo menos 2 meias",
        "Todas terão 1 meia",
        "Uma ficará vazia",
        "Todas terão 2 meias",
      ],
      answer: "Uma gaveta terá pelo menos 2 meias",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Quantos códigos de 2 algarismos podem ser formados permitindo repetição?",
      options: ["10", "20", "100", "90"],
      answer: "100",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Uma pessoa possui 6 camisetas e 3 calças. Quantas combinações diferentes pode formar?",
      options: ["9", "18", "12", "21"],
      answer: "18",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Quantos códigos de 4 algarismos distintos podem ser formados usando os dígitos de 0 a 9, permitindo zero no início?",
      options: ["5040", "10000", "3024", "9000"],
      answer: "5040",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Em um grupo de 8 pessoas, o que podemos garantir sobre os dias da semana em que fazem aniversário?",
      options: [
        "Pelo menos duas fazem aniversário no mesmo dia da semana",
        "Todas fazem aniversário em dias diferentes",
        "Exatamente duas fazem aniversário no domingo",
        "Todas fazem aniversário no mesmo dia",
      ],
      answer: "Pelo menos duas fazem aniversário no mesmo dia da semana",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Uma pessoa possui 4 camisetas e 3 calças. Quantas combinações diferentes pode formar?",
      options: ["7", "12", "10", "16"],
      answer: "12",
      topic: "Princípio Multiplicativo",
    },
  ],

  dificil: [
    {
      question: "Em uma turma com 13 alunos, o que podemos garantir sobre os meses de aniversário?",
      options: [
        "Pelo menos dois alunos fazem aniversário no mesmo mês",
        "Todos fazem aniversário em meses diferentes",
        "Exatamente dois fazem aniversário em janeiro",
        "Todos fazem aniversário no mesmo mês",
      ],
      answer: "Pelo menos dois alunos fazem aniversário no mesmo mês",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Se 8 bolas forem distribuídas em 3 caixas, o que podemos garantir?",
      options: [
        "Pelo menos uma caixa terá 3 bolas ou mais",
        "Todas terão exatamente 2 bolas",
        "Uma caixa ficará vazia",
        "Todas terão a mesma quantidade",
      ],
      answer: "Pelo menos uma caixa terá 3 bolas ou mais",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Quantos códigos de 5 algarismos distintos podem ser formados usando os dígitos de 0 a 9, permitindo zero no início?",
      options: ["30240", "5040", "90000", "10000"],
      answer: "30240",
      topic: "Princípio Multiplicativo",
    },
    {
      question: "Se 7 livros forem distribuídos em 3 prateleiras, o que podemos garantir?",
      options: [
        "Pelo menos uma prateleira terá 3 livros ou mais",
        "Todas terão exatamente 2 livros",
        "Uma ficará vazia",
        "Todas terão a mesma quantidade",
      ],
      answer: "Pelo menos uma prateleira terá 3 livros ou mais",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Se 6 pessoas utilizarem 5 computadores, o que podemos garantir?",
      options: [
        "Pelo menos duas pessoas utilizarão o mesmo computador",
        "Todas utilizarão computadores diferentes",
        "Uma pessoa ficará sem computador",
        "Todas utilizarão o mesmo computador",
      ],
      answer: "Pelo menos duas pessoas utilizarão o mesmo computador",
      topic: "Princípio da Casa dos Pombos",
    },
    {
      question: "Quantos códigos de 4 algarismos distintos podem ser formados sem começar com zero?",
      options: ["4536", "5040", "3024", "9000"],
      answer: "4536",
      topic: "Princípio Multiplicativo",
    },
  ],
};

const explanations = {
  facil: [
    "Pelo princípio multiplicativo, multiplicamos as possibilidades: 3 × 2 = 6.",
    "Pelo princípio aditivo, somamos as opções: 4 + 3 = 7.",
    "Pelo princípio aditivo, somamos as possibilidades: 2 + 5 = 7.",
    "Pelo princípio multiplicativo: 3 × 4 = 12 combinações.",
    "Pelo princípio multiplicativo: 5 × 2 = 10 combinações.",
    "Pelo princípio multiplicativo: 3 × 2 = 6 combinações.",
  ],

  normal: [
    "Pelo princípio da casa dos pombos, distribuindo 10 meias em 9 gavetas, pelo menos uma gaveta terá duas ou mais meias.",
    "Cada posição possui 10 possibilidades. Portanto: 10 × 10 = 100 códigos.",
    "Pelo princípio multiplicativo: 6 × 3 = 18 combinações.",
    "São 10 possibilidades para o primeiro algarismo, 9 para o segundo, 8 para o terceiro e 7 para o quarto: 10 × 9 × 8 × 7 = 5040.",
    "Existem 7 dias da semana e 8 pessoas. Pelo princípio da casa dos pombos, pelo menos duas fazem aniversário no mesmo dia da semana.",
    "Pelo princípio multiplicativo: 4 × 3 = 12 combinações.",
  ],

  dificil: [
    "Existem 12 meses e 13 alunos. Pelo princípio da casa dos pombos, pelo menos dois fazem aniversário no mesmo mês.",
    "Distribuindo 8 bolas em 3 caixas, pelo menos uma terá 3 ou mais bolas, pois 8 ÷ 3 = 2,67.",
    "São 10 × 9 × 8 × 7 × 6 = 30240 códigos, permitindo zero no início.",
    "Distribuindo 7 livros em 3 prateleiras, pelo menos uma terá 3 ou mais livros.",
    "Como existem 6 pessoas e apenas 5 computadores, pelo menos duas pessoas utilizarão o mesmo computador.",
    "Para o primeiro algarismo temos 9 possibilidades. Para os seguintes, 9, 8 e 7: 9 × 9 × 8 × 7 = 4536.",
  ],
};

const questionBags = {
  facil: [],
  normal: [],
  dificil: [],
};

function getNextQuestion(difficulty) {
  const pool = questionPools[difficulty];
  const bag = questionBags[difficulty];

  if (bag.length === 0) {
    bag.push(...pool.map((_, index) => index));

    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }

  return pool[bag.pop()];
}

function getCurrentAnswer() {
  return currentAnswer;
}

function getCurrentTopic() {
  return currentTopic;
}

function getCurrentExplanation() {
  return currentExplanation;
}

function generateQuestion(difficulty, onSelect) {
  document.getElementById("diagram").innerHTML = "";
  document.getElementById("options").innerHTML = "";

  const level = questionPools[difficulty]
    ? difficulty
    : "normal";

  const selectedQuestion = getNextQuestion(level);

  const questionIndex = questionPools[level].indexOf(selectedQuestion);

  currentAnswer = selectedQuestion.answer;
  currentTopic = selectedQuestion.topic;
  currentExplanation = explanations[level][questionIndex];

  setQuestion(selectedQuestion.question);

  renderQuestionIllustration(selectedQuestion.question);

  renderAnswerButtons(selectedQuestion.options, onSelect);
}

export {
  generateQuestion,
  getCurrentAnswer,
  getCurrentTopic,
  getCurrentExplanation
};
