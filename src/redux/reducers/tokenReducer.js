import { REQUEST_TOKEN, RESET_TOKEN, RESPONSE_TOKEN } from '../actions';

const INITIAL_STATE = {
  token: '',
  loading: false,
};

const tokenReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case REQUEST_TOKEN:
    return {
      ...state,
      loading: true,
    };
  case RESPONSE_TOKEN:
    localStorage.setItem('token', action.payload.token);
    return {
      ...state,
      loading: false,
      token: action.payload.token,
    };
  case RESET_TOKEN:
    return {
      ...state,
      token: '',
    };

  default:
    return state;
  }
};

export default tokenReducer;
