import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { playerUser } from '../redux/actions';

class GamePage extends Component {
  constructor() {
    super();

    this.state = {
      questionIndex: 0,
      score: 0,
      isAnswered: false,
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
      this.redirectToPage();
    }
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

  nextOne = () => {
    this.setState({
      isAnswered: false,
    }, () => {
      this.setState((prevState) => ({
        ...prevState,
        questionIndex: prevState.questionIndex + 1,
      }));
    });
  };

  checkAnswer = (answer, difficulty) => {
    const { questionIndex, score } = this.state;
    const { name, email, dispatch } = this.props;
    this.setState({
      isAnswered: true,
    });
    if (answer.value) {
      this.calculatePoints(difficulty);
    }
    const maxQuestionsDelayed = 4;
    if (questionIndex === maxQuestionsDelayed) {
      const verification = JSON.parse(localStorage.getItem('ranking'));
      if (verification) {
        localStorage.setItem('ranking', JSON.stringify([...verification, { name, score, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }]));
      } else { localStorage.setItem('ranking', JSON.stringify([{ name, score, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }])); }
      dispatch(playerUser({ name, score, picture: `https://www.gravatar.com/avatar/${md5(email).toString()}` }));
      this.redirectToPage('/feedback');
    }
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

  calculatePoints = () => {
    const { questions, questionIndex, timer, score } = this.state;
    let points = 0;
    const hard = 3;
    const medium = 2;
    switch (questions[questionIndex].difficulty) {
    case 'easy':
      points = timer;
      break;
    case 'medium':
      points = timer * medium;
      break;
    case 'hard':
      points = timer * hard;
      break;
    default:
      break;
    }
    this.setState({ score: score + points });
  };

  render() {
    const { questions, questionIndex, score, timer, answers,
      areDisabled, isWaiting, isAnswered } = this.state;

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
              style={ { border: getBorderColor(isAnswered, currAnswer.value) } }
              disabled={ areDisabled }
              onClick={ () => this.checkAnswer(
                currAnswer,
                questions[questionIndex].difficulty,
              ) }
              data-testid={ currAnswer.value ? 'correct-answer'
                : `wrong-answer-${currAnswer.index}` }
            >
              {currAnswer.answer}
            </button>))}
          <div>
            {isAnswered && (
              <button
                type="button"
                data-testid="btn-next"
                onClick={ this.nextOne }
              >
                Next
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }
}

GamePage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  email: state.player.gravatarEmail,
  name: state.player.name,
});

export default connect(mapStateToProps)(GamePage);
