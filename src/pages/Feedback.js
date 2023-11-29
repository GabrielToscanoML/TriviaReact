import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

import '../styles/Feedback.css';

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
        <main className="feedback-main-container">
          {
            assertions < minAssertions
              ? <h2 data-testid="feedback-text" className="red">Could be better... </h2>
              : <h2 data-testid="feedback-text" className="green">Well Done! </h2>
          }
          <section className="score-assertion-section">
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
          </section>

          <section className="feedback-buttons-section">
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
          </section>
        </main>
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
