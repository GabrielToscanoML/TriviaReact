import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  returnToRankingPage = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { history } = this.props;
    return (
      <div>
        <Header />
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
    );
  }
}

Feedback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Feedback;
