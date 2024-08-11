// https://opentdb.com/api.php?amount=10&category=19&difficulty=medium

// GET ELEMENTS
let form = document.querySelector("form");
let categoryMenu = document.querySelector("#selectCategory");
let difficultyMenu = document.querySelector("#selectDiff");
let questionNumber = document.querySelector("#selectNumber");
let submitBtn = document.querySelector("#startBtn");
let myRow = document.querySelector(".row");
let myQuiz;
let questions;
let myQuestion;
submitBtn.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyMenu.value;
  let number = questionNumber.value;
  myQuiz = new Quiz(category, difficulty, number);
  questions = await myQuiz.getAllQues();
  myQuestion = new Question(0);
  console.log(questions);
  form.classList.add("d-none");
  myQuestion.display();
});
class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }
  async getAllQues() {
    let res = await fetch(
      `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`
    );
    let data = await res.json();
    return data.results;
  }
  showRes() {
    return `<div
      class="question shadow-lg col-12 p-4 rounded-3"
    >
      <div class="w-100 d-flex flex-column justify-content-between align-items-center">
        <h2 style="margin-bottom:1.5rem;">
        ${
          this.score == this.number
            ? "Congratulations"
            : `Your Score is ${this.score} out of ${this.number}`
        }
        </h2>
  <button class="btn btn-info rounded-pill px-5 py-2 again"><i class="bi bi-arrow-repeat"></i>Try Again</button>

      </div>
    </div>`;
  }
}
class Question {
  constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.difficulty = questions[index].difficulty;
    this.category = questions[index].category;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.myAllAnswers = this.getAllAnswers();
    this.isAnswerd = false;
  }
  getAllAnswers() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    allAnswers.sort();
    return allAnswers;
  }
  display() {
    const questionMarkUp = `
    <div
      class="question shadow-lg col-12 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
    >
      <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      questions.length
    } Questions</span>
      </div>
      <h3 class="text-capitalize text-center fw-bold">${this.question}</h3>  
      <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
      ${this.myAllAnswers.map((choice) => `<li>${choice}</li>`).join("")}
      </ul>
      <h2 class="text-capitalize text-center score-color h3 fw-bold">
        <i class="bi bi-emoji-laughing"></i> 
        Score: ${myQuiz.score}
      </h2>        
    </div>`;
    myRow.innerHTML = questionMarkUp;
    let allChoises = document.querySelectorAll(".choices li");
    allChoises.forEach((li) => {
      li.addEventListener("click", () => {
        this.checkAnswer(li);
        this.nextQues();
      });
    });
  }
  checkAnswer(choice) {
    if (!this.isAnswerd) {
      this.isAnswerd = true;
      if (choice.innerHTML == this.correct_answer) {
        myQuiz.score++;
        choice.classList.add("correct", "animate__animated", "animate__pulse");
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQues() {
    this.index++;
    setTimeout(() => {
      if (this.index < questions.length) {
        let myNewQues = new Question(this.index);
        myNewQues.display();
      } else {
        myRow.innerHTML = myQuiz.showRes();
        document.querySelector(".again").addEventListener("click", ()=>{
           window.location.reload() 
        })
      }
    }, 2000);
  }
}
