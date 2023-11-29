import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resetScore } from '../redux/actions';

import '../styles/Ranking.css';

class Ranking extends React.Component {
  constructor() {
    super();
    this.state = {
      localRanking: [],
    };
  }

  componentDidMount() {
    const localData = JSON.parse(localStorage.getItem('ranking'));
    const sortData = localData.sort((a, b) => b.score - a.score);
    this.setState({ localRanking: sortData });
  }

  handleClick = () => {
    const { history, dispatch } = this.props;
    dispatch(resetScore());
    history.push('/');
  };

  render() {
    const { localRanking } = this.state;
    return (
      <main className="ranking-main-container">
        <h1 data-testid="ranking-title">Ranking</h1>
        <button
          type="button"
          data-testid="btn-go-home"
          className="btn-go-home"
          onClick={ this.handleClick }
        >
          Back to Login
        </button>
        <section className="ranking-container">
          <ol>
            {localRanking.map((player, i) => (
              <li
                key={ i }
              >
                <div className="li-container">
                  <img src={ player.picture } alt="Player Avatar" />
                  <h2 data-testid={ `player-name-${i}` }>{player.name}</h2>
                  <p data-testid={ `player-score-${i}` }>{player.score}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Ranking);
