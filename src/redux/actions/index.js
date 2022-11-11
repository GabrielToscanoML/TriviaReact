export const userLogin = 'userLogin';
export const PLAYER_USER = 'PLAYER_USER';
export const RESET_SCORE = 'RESET-SCORE';
export const SUM_ASSERTIONS = 'SUM_ASSERTIONS';

export const logIn = (value) => ({ type: userLogin, value });

export const playerUser = (value) => ({ type: PLAYER_USER, value });

export const resetScore = (value) => ({ type: RESET_SCORE, value });

export const sumAssertion = (assertion) => ({ type: SUM_ASSERTIONS, payload: assertion });
