export const userLogin = 'userLogin';
export const PLAYER_USER = 'PLAYER_USER';
export const RESET_SCORE = 'RESET-SCORE';

export const logIn = (value) => ({ type: userLogin, value });

export const playerUser = (value) => ({ type: PLAYER_USER, value });

export const resetScore = (value) => ({ type: RESET_SCORE, value });
