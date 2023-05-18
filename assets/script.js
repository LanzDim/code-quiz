var timeLeft = 60;
var timeID;
var timerEl = document.getElementById("time");
var startButton = document.getElementById("start-btn");
var nextButton = document.getElementById("next-btn");
var questionsContainerEl = document.getElementById("questions-container");
var mainContainerEl = document.getElementById("main-container");
var questionEl = document.getElementById("question");
var answerButtonsEl = document.getElementById("answer-btn");
var checkAnswerEl = document.getElementById("check-answer");
var viewHighScores = document.getElementById("highscores-tab");
var submitButton = document.getElementById("submit-btn");
var clearScoreButton = document.getElementById("clear-btn");
var namesTab = document.getElementById("names");
var scoreBoard = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];

var mixedQuestions, currentQuestionIndex;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++
    setNextQuestion()
});

function countDown() {
  var timeInterval = setInterval(function () {
    timerEl.textContent = "Time: " + timeLeft;
    timeLeft--;
    if (timeLeft <= 0) {
      timerEl.textContent = "";
      clearInterval(timeInterval);
      saveScore();
    }
  }, 1000);
}

function startGame() {
  mainContainerEl.classList.add("hide");
  mixedQuestions = question.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionsContainerEl.classList.remove("hide");

  countDown();
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(mixedQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

function resetState() {
    nextButton.classList.add("hide");
  checkAnswerEl.classList.add("hide");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}

function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;
  if (correct) {
   checkAnswerEl.innerHTML = "Correct Answer!"; 
  } else {
    checkAnswerEl.innerHTML = "Wrong Answer!"
  }

  Array.from(answerButtonsEl.children).forEach(button => {
    setStatusClass(button, button.dataset.correct);
  })

  if (mixedQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    checkAnswerEl.classList.remove("hide");
  } else {
    startButton.classList.remove("hide");
    saveScore();
  }
};

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
};

function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("wrong");
};


function saveScore() {
  var initials = initialsField.value;
  var score = timeLeft;
  var newScore = { initials: initials, score: score };
  scores.push(newScore);
  localStorage.setItem("scores", JSON.stringify(scores));
  showHighScores();
  viewHighScores.click();
  scoreBoard.innerText = score;
};

function showHighScores(names) {
document.getElementById("higihscores").classList.remove("hide")
document.getElementById("scores-container").classList.add("hide");
mainContainerEl.classList.add("hide");
questionsContainerEl.classList.add("hide");
if (typeof names == "string") {
    var score = {
        names, timeLeft
    }
    scores.push(score)
}
  
  var highScores = JSON.parse(localStorage.getItem("scores"));
  highScores.sort((a, b) => b.score - a.score);
  highScores.forEach((score) => {
    for(i = 0; i < scores.length; i++) {
        var div1 = document.createElement("div");
        div1.setAttribute("class","name-div");
        div1.innerText = scores[i].initials;
        var div2 = document.createElement("div");
        div2.setAttribute("class", "score-div");
        div2.innerText = scores[i].timerLeft;

        highScoresEl.appendChild(div1);
        highScoresEl.appendChild(div2);
    }
  });
};

viewHighScores.addEventListener("click", showHighScores);

submitButton.addEventListener("click", function (event) {
    event.preventDefault()
    var initials = document.querySelector("#names-tab").value;
    showHighScores(initials);
});

restartButton.addEventListener("click", function() {
    window.location.reload();
});

clearScoreButton.addEventListener("click", function() {
    localStorage.clear();
    document.getElementById("highscore").innerHTML = "";
});