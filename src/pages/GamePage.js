import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class GamePage extends Component {
  constructor() {
    super();

    this.state = {
      questionIndex: 0,
      score: 0,
      timer: 30,
      isWaiting: true,
      areDisabled: false,
    };
  }

  async componentDidMount() {
    const { questionIndex } = this.state;
    const localToken = localStorage.getItem('token');
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${localToken}`);
      const questions = await response.json();

      this.waitFiveSeconds(this.startTimer);

      const expiredTokenCode = 3;
      if (questions.response_code === expiredTokenCode
        || questions.token === 'INVALID_TOKEN') {
        this.redirectToPage();
      }

      this.setState({ questions: questions.results });
      this.prepData(questions.results, questionIndex);
    } catch (error) {
      console.log(error);
      this.redirectToPage();
    }
  }

  componentDidUpdate() {

  }

  waitFiveSeconds = (funcToBeExecuted) => {
    this.setState({ isWaiting: true });

    const fiveSeconds = 5000;
    setTimeout(() => {
      funcToBeExecuted();
      this.setState({ isWaiting: false });
    }, fiveSeconds);
  };

  redirectToPage = (pathname = '/') => {
    const { history } = this.props;

    localStorage.removeItem('token');
    this.setState({ questionIndex: 0 });

    history.push(pathname);
  };

  checkAnswer = (answer) => {
    const { questionIndex } = this.state;

    this.setState({
      questionIndex: questionIndex + 1 });

    console.log(answer.value ? 'Correto!' : 'Incorreto!');

    const maxQuestionsDelayed = 4;
    if (questionIndex === maxQuestionsDelayed) return this.redirectToPage('/feedback');
  };

  prepData = (possibleAnswers, index) => {
    const currQuestion = possibleAnswers[index];

    if (currQuestion.type === 'boolean') {
      const answers = [{ answer: currQuestion.correct_answer, value: true },
        { answer: currQuestion.incorrect_answers[0], value: false, index: 0 }];
      const numForShuffle = 0.5;
      const ShuffledAnswers = answers.sort(() => numForShuffle - Math.random());
      this.setState({ answers: ShuffledAnswers });
    }

    const incorrect = currQuestion.incorrect_answers
      .map((incAns, i) => ({ answer: incAns, value: false, index: i }));
    const correct = { answer: currQuestion.correct_answer, value: true };
    const answers = [...incorrect, correct];
    const numForShuffle = 0.5;
    const ShuffledAnswers = answers.sort(() => numForShuffle - Math.random());
    this.setState({ answers: ShuffledAnswers });
  };

  startTimer = () => {
    this.setState({ timer: 30 });
    const oneSecond = 1000;
    const interval = setInterval(() => {
      const { timer } = this.state;
      this.setState({ timer: timer - 1 });

      if (timer === 1) {
        this.setState({ areDisabled: true });

        clearInterval(interval);
      }
    }, oneSecond);
  };

  render() {
    const { questions, questionIndex, score, timer, answers,
      areDisabled, isWaiting } = this.state;

    if (!questions) return <p>Loading...</p>;
    if (isWaiting) {
      return (
        <div>
          <Header />
          <p>{questions[questionIndex].category}</p>
          <p>{questions[questionIndex].question}</p>
        </div>
      );
    }

    return (
      <div>
        <Header />

        <p id="score">
          Score:
          {' '}
          {score}
        </p>
        <span>
          Time:
          {' '}
          {timer}
        </span>
        <p
          id="category"
          data-testid="question-category"
        >
          {questions[questionIndex].category}
        </p>
        <p
          id="quenstionText"
          data-testid="question-text"
        >
          {questions[questionIndex].question}
        </p>
        <section data-testid="answer-options">
          {answers.map((currAnswer, i) => (
            <button
              type="button"
              key={ i }
              disabled={ areDisabled }
              onClick={ () => this.checkAnswer(currAnswer) }
              data-testid={ currAnswer.value ? 'correct-answer'
                : `wrong-answer-${currAnswer.index}` }
            >
              {currAnswer.answer}
            </button>))}
        </section>
      </div>
    );
  }
}

GamePage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default connect()(GamePage);
