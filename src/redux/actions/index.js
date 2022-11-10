export const userLogin = 'userLogin';
export const PLAYER_USER = 'PLAYER_USER';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const RESPONSE_TOKEN = 'RESPONSE_TOKEN';
export const RESPONSE_FAIL = 'RESPONSE_FAIL';

export const logIn = (value) => ({ type: userLogin, value });
export const playerUser = (value) => ({ type: PLAYER_USER, value });

const requestToken = () => ({
  type: REQUEST_TOKEN,
});

const responseToken = (token) => ({
  type: RESPONSE_TOKEN,
  payload: token,
});

const responseFail = (error) => ({
  type: RESPONSE_TOKEN,
  payload: error,
});

export const getToken = () => async (dispatch) => {
  try {
    dispatch(requestToken());
    const respose = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await respose.json();
    dispatch(responseToken(data));
  } catch (error) {
    dispatch(responseFail(error));
  }
};
