// import { PLAYER_USER } from '../actions';

const initialState = {
  name: '',
  assertions: '',
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
      assertions: action.value.name,

    };
  default:
    return state;
  }
};

export default player;
