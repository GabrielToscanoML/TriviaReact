import React from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../styles/Header.css';

class Header extends React.Component {
  render() {
    const { email, name, score } = this.props;
    return (
      <header className="header-container">
        <main className="main-header-container">
          <h1>Trivia</h1>
          <section className="header-right-side">
            <img
              data-testid="header-profile-picture"
              src={ `https://www.gravatar.com/avatar/${md5(email).toString()}` }
              alt="Foto de perfil"
            />
            <h1 data-testid="header-player-name">{ name }</h1>
            <h1>|</h1>
            <h1 data-testid="header-score">
              { score }
              {' '}
              Pts
            </h1>
          </section>
        </main>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

Header.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

Header.defaultProps = {
  email: 'defaultEmail@email.com',
};

export default connect(mapStateToProps)(Header);
