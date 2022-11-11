// import { PLAYER_USER } from '../actions';

const initialState = {
  name: '',
  score: 0,
  gravatarEmail: '',
  assertions: 0,
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
  default:
    return state;
  }
};

export default player;
