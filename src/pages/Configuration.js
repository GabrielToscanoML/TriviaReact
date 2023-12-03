import React from 'react';
import PropTypes from 'prop-types';

class Configuration extends React.Component {
  handleClick = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    return (
      <main>
        <h1 data-testid="settings-title">This page will be developed soon</h1>
        <button
          type="button"
          data-testid="btn-go-home"
          className="btn-go-home"
          onClick={ this.handleClick }
        >
          Back to Login
        </button>
      </main>
    );
  }
}

Configuration.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Configuration;
