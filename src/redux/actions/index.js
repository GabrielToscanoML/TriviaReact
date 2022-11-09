export const userLogin = 'userLogin';
export const PLAYER_USER = 'PLAYER_USER';

export const logIn = (value) => ({ type: userLogin, value });
export const playerUser = (value) => ({ type: PLAYER_USER, value });
