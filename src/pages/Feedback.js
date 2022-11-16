import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends React.Component {
  returnToRankingPage = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { history, assertions, score } = this.props;
    const minAssertions = 3;
    return (
      <div>
        <Header />

        {
          assertions < minAssertions
            ? <h2 data-testid="feedback-text">Could be better... </h2>
            : <h2 data-testid="feedback-text">Well Done! </h2>
        }
        <div>
          Score:
          {' '}
          <span data-testid="feedback-total-score">{ score }</span>
        </div>

        <div>
          Assertions:
          {' '}
          <span data-testid="feedback-total-question">{ assertions }</span>
        </div>

        <div>
          <button
            data-testid="btn-play-again"
            type="button"
            onClick={ () => history.push('/') }
          >
            Play again
          </button>
          <button
            data-testid="btn-ranking"
            type="button"
            onClick={ this.returnToRankingPage }
          >
            Ranking
          </button>
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  assertions: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
});

export default connect(mapStateToProps)(Feedback);
