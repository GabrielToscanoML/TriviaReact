// import { PLAYER_USER } from '../actions';
import { resetScore, SUM_ASSERTIONS } from '../actions';

const initialState = {
  name: '',
  score: 0,
  gravatarEmail: '',
  assertions: 0,
};

const player = (state = initialState, action) => {
  switch (action.type) {
  case 'PLAYER_USER':
    return {
      ...state,
      name: action.value.name,
      gravatarEmail: action.value.email,
      score: action.value.score,
    };
  case resetScore:
    return {
      ...initialState,
    };
  case SUM_ASSERTIONS:
    return {
      ...state,
      assertions: state.assertions + action.payload,
    };
  default:
    return state;
  }
};

export default player;
