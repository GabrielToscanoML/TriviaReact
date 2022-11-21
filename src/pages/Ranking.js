import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resetScore } from '../redux/actions';

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
      <div>
        <h4 data-testid="ranking-title">Ranking</h4>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleClick }
        >
          Login
        </button>
        <div>
          {localRanking.map((player, i) => (
            <span key={ i }>
              <img src={ player.picture } alt="Player Avatar" />
              <span data-testid={ `player-name-${i}` }>{player.name}</span>
              <span data-testid={ `player-score-${i}` }>{player.score}</span>
            </span>
          ))}
        </div>
      </div>
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
