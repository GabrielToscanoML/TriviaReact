import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { playerUser, sumAssertion } from '../redux/actions';
import Loading from '../components/Loading';

import '../styles/Game.css';
import timerIcon from '../assets/timer-image.svg';

const he = require('he');

class GamePage extends Component {
  constructor() {
    super();

    this.state = {
      questionIndex: 0,
      score: 0,
      isAnswered: false,
      timer: 30,
      areDisabled: false,
    };
  }

  async componentDidMount() {
    const localToken = localStorage.getItem('token');
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${localToken}`);
      const questions = await response.json();
      this.startTimer();
      const expiredTokenCode = 3;
      if (questions.response_code === expiredTokenCode
        || questions.token === 'INVALID_TOKEN') {
        this.redirectToPage();
      }
      this.formatText(questions.results);
      this.setState({ questions: questions.results,
        answers: this.prepData(questions.results) });
    } catch (error) {
      this.redirectToPage();
    }
  }

  formatText = (result) => {
    result.forEach((obj) => {
      obj.category = he.decode(obj.category);
      obj.question = he.decode(obj.question);
      obj.correct_answer = he.decode(obj.correct_answer);
      obj.incorrect_answers = obj.incorrect_answers.map((answer) => he.decode(answer));
    });
    return result;
  };

  redirectToPage = (pathname = '/') => {
    const { history } = this.props;
    localStorage.removeItem('token');
    this.setState({ questionIndex: 0 });
    history.push(pathname);
  };

  nextOne = () => {
    const { questionIndex } = this.state;
    const maxQuestionIndex = 4;
    if (questionIndex === maxQuestionIndex) this.redirectToPage('/feedback');
    this.setState({
      isAnswered: false,
    }, () => {
      this.setState((prevState) => ({
        ...prevState,
        questionIndex: prevState.questionIndex + 1,
      }));
    });
    this.startTimer();
  };

  checkAnswer = (answer) => {
    const { questionIndex, interval } = this.state;
    const { name, email } = this.props;
    this.setState({
      isAnswered: true,
    });
    clearInterval(interval);
    this.calculatePoints(answer);
    const { score } = this.state;
    const maxQuestionsDelayed = 4;
    if (questionIndex === maxQuestionsDelayed) {
      const verification = JSON.parse(localStorage.getItem('ranking'));
      if (verification) {
        localStorage.setItem('ranking', JSON.stringify([...verification, { name, score, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }]));
      } else { localStorage.setItem('ranking', JSON.stringify([{ name, score, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }])); }
    }
  };

  prepData = (possibleAnswers) => possibleAnswers.map((currQuestion) => {
    if (currQuestion.type === 'boolean') {
      const answers = [{ answer: currQuestion.correct_answer, value: true },
        { answer: currQuestion.incorrect_answers[0], value: false, index: 0 }];
      const numForShuffle = 0.5;
      const shuffledAnswers = answers.sort(() => numForShuffle - Math.random());
      return shuffledAnswers;
    }
    const incorrect = currQuestion.incorrect_answers
      .map((incAns, i) => ({ answer: incAns, value: false, index: i }));
    const correct = { answer: currQuestion.correct_answer, value: true };
    const answers = [...incorrect, correct];
    const numForShuffle = 0.5;
    const shuffledAnswers = answers.sort(() => numForShuffle - Math.random());
    return shuffledAnswers;
  });

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
    this.setState({ interval });
  };

  calculatePoints = (answer) => {
    const { questions, questionIndex, timer, score } = this.state;
    const { dispatch, name, email } = this.props;
    if (answer.value) {
      dispatch(sumAssertion(1));
      let points = 0;
      const hard = 3;
      const medium = 2;
      if (questions[questionIndex].difficulty === 'easy') {
        points = timer;
      } else if (questions[questionIndex].difficulty === 'medium') {
        points = timer * medium;
      } else {
        points = timer * hard;
      }
      const newScore = score + points;
      dispatch(playerUser({ name, score: newScore, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }));
      return this.setState({ score: newScore });
    }
    this.setState({ score });
  };

  render() {
    const { questions, questionIndex, score, timer, answers,
      areDisabled, isAnswered } = this.state;
    if (!questions) return <main className="loading-container"><Loading /></main>;

    function getBorderColor(answered2, currAnswer) {
      let result;
      if (answered2) {
        if (currAnswer) {
          result = '3px solid rgb(6, 240, 15)';
        } else {
          result = '3px solid red';
        }
      } else {
        result = '1px solid black';
      }
      return result;
    }

    return (
      <div>
        <Header />
        <main className="main-game-container">
          <section className="left-side">
            <h1
              id="category"
              data-testid="question-category"
            >
              {questions[questionIndex].category}
            </h1>
            <h3
              id="quenstionText"
              data-testid="question-text"
            >
              {questions[questionIndex].question}
            </h3>
            <div className="timer-score">
              <img src={ timerIcon } alt="Timer Icon" />
              <span>
                Time:
                { ' ' }
                {timer}
              </span>
              <p data-testid="header-score" id="score">
                Score:
                { ' ' }
                { score }
              </p>
            </div>
          </section>
          <section
            className="game-right-side"
            data-testid="answer-options"
          >
            {answers[questionIndex].map((currAnswer, i) => (
              <button
                className="some-buttons"
                type="button"
                key={ i }
                style={ { border: getBorderColor(isAnswered, currAnswer.value) } }
                disabled={ areDisabled }
                onClick={ () => this.checkAnswer(currAnswer) }
                data-testid={ currAnswer.value ? 'correct-answer'
                  : `wrong-answer-${currAnswer.index}` }
              >
                {currAnswer.answer}
              </button>))}
            <div>
              {isAnswered && (
                <button
                  className="some-buttons next-button"
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.nextOne }
                >
                  Next
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

GamePage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  email: PropTypes.string,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
GamePage.defaultProps = {
  email: 'defaultEmail@email.com',
};
const mapStateToProps = (state) => ({
  email: state.player.gravatarEmail,
  name: state.player.name,
});

export default connect(mapStateToProps)(GamePage);
