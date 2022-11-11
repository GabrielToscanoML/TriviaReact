// import { PLAYER_USER } from '../actions';
import { resetScore } from '../actions';

const initialState = {
  name: '',
  score: 0,
  gravatarEmail: '',
};

const player = (state = initialState, action) => {
  switch (action.type) {
  case 'PLAYER_USER':
  //  console.log(action.value);
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
  default:
    return state;
  }
};

export default player;
