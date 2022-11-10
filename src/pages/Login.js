import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playerUser } from '../redux/actions';
import { getToken } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      score: 0,
    };
  }

  handleChange = ({ target }) => {
    const { name, value } = target;

    this.setState({
      [name]: value,
    });

    this.validationLogin();
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

  handleClick = () => {
    const { history, dispatch } = this.props;
    dispatch(playerUser(this.state));
    dispatch(getToken());
    history.push('/game');
  };

  onClickButton = () => {
    const { history } = this.props;
    console.log(this.props);
    history.push('/configuration');
  };

  render() {
    const { email, name } = this.state;
    return (
      <form>
        <label htmlFor="name">
          <input
            type="text"
            name="name"
            placeholder="Nome"
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
          Configurações
        </button>
      </form>
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
