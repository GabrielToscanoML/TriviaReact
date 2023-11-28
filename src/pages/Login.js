import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playerUser } from '../redux/actions';

import '../styles/Login.css';
import Loading from '../components/Loading';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      score: 0,
      loading: false,
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => this.validationLogin());
  };

  validationLogin = () => {
    const { email, name } = this.state;
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    let result;
    if (email.match(mailformat)) {
      result = true;
    } else {
      result = false;
    }
    return !(result && name.length > 0);
  };

  handleClick = async () => {
    const { history, dispatch } = this.props;

    this.setState({ loading: true });

    dispatch(playerUser(this.state));

    const respose = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await respose.json();
    localStorage.setItem('token', data.token);

    this.setState({ loading: false });

    history.push('/game');
  };

  onClickButton = () => {
    const { history } = this.props;
    history.push('/configuration');
  };

  render() {
    const { email, name, loading } = this.state;

    if (loading) return <main className="loading-container"><Loading /></main>;

    return (
      <main className="main-login-container">
        <form className="form-container">
          <h1>Welcome to Trivia!</h1>
          <label htmlFor="name">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={ name }
              onChange={ (e) => this.handleChange(e) }
              id="name"
              data-testid="input-player-name"
            />
          </label>
          <label htmlFor="email">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={ email }
              onChange={ (e) => this.handleChange(e) }
              id="email"
              data-testid="input-gravatar-email"
            />
          </label>
          <button
            type="button"
            data-testid="btn-play"
            disabled={ this.validationLogin() }
            onClick={ this.handleClick }
          >
            Play
          </button>
          <button
            type="button"
            data-testid="btn-settings"
            onClick={ this.onClickButton }
          >
            Settings
          </button>
        </form>
      </main>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
