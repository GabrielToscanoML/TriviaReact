import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetToken } from '../redux/actions';

class GamePage extends Component {
  constructor() {
    super();

    this.state = {
      questionIndex: 0,
      score: 0,
    };
  }

  async componentDidMount() {
    const { token } = this.props;
    const localToken = localStorage.getItem('token');
    const getToken = token || localToken;
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${getToken}`);
      const questions = await response.json();

      const expiredTokenCode = 3;
      if (questions.response_code === expiredTokenCode
        || questions.token === 'INVALID_TOKEN') {
        const { dispatch } = this.props;
        dispatch(resetToken());
        this.returnToLogin();
      }
      this.setState({ questions: questions.results });
    } catch (error) {
      console.log(error);
      this.returnToLogin();
    }
  }

  returnToLogin = () => {
    const { history } = this.props;

    localStorage.removeItem('token');
    this.setState({ questionIndex: 0 });

    history.push('/');
  };

  checkAnswer = (answer) => {
    const { questionIndex } = this.state;

    // const fiveSeconds = 5000;
    // setTimeout(() => {
    //   this.setState({
    //     questionIndex: questionIndex + 1 });
    // }, fiveSeconds);

    this.setState({
      questionIndex: questionIndex + 1 });

    console.log(answer.value ? 'Correto!' : 'Incorreto!');

    const maxQuestionsDelayed = 4;
    if (questionIndex === maxQuestionsDelayed) return this.returnToLogin();
  };

  prepData = (possibleAnswers, index) => {
    const currQuestion = possibleAnswers[index];

    if (currQuestion.type === 'boolean') {
      const answers = [{ answer: currQuestion.correct_answer, value: true },
        { answer: currQuestion.incorrect_answers[0], value: false }];
      return answers;
    }

    const incorrect = currQuestion.incorrect_answers
      .map((incAns) => ({ answer: incAns, value: false }));
    const correct = { answer: currQuestion.correct_answer, value: true };
    const answers = [...incorrect, correct];
    const numForShuffle = 0.5;
    const ShuffledAnswers = answers.sort(() => Math.random() - numForShuffle);
    return ShuffledAnswers;
  };

  render() {
    const { questions, questionIndex, score } = this.state;
    const { loading } = this.props;
    if (!questions || loading) return <p>Loading...</p>;

    const answers = this.prepData(questions, questionIndex);

    return (
      <div>
        <p id="score">
          Score:
          {' '}
          {score}
        </p>
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
              onClick={ () => this.checkAnswer(currAnswer) }
              data-testid={ currAnswer.value ? 'correct-answer' : `wrong-answer-${i}` }
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
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.tokenReducer.loading,
  token: state.tokenReducer.token,
});

export default connect(mapStateToProps)(GamePage);
