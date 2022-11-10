import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const userLogin = (name, email) => {

  userEvent.type(screen.getByTestId('input-player-name'), name);
  userEvent.type(screen.getByTestId('input-gravatar-email'), email);
}

describe('Testa a página de login', () => {
   test('Verifica a renderização do componente quando iniciado', () => {
    renderWithRouterAndRedux(<App />)

    expect(screen.getByPlaceholderText('Nome'))
    expect(screen.getByPlaceholderText('E-mail'))
   });

   test('Verifica os inputs e a recepção dos dados digitados', () => {
     renderWithRouterAndRedux(<App />)

     userLogin('Name tester', 'tester@tester.com');
    expect(screen.getByTestId('input-player-name').value).toBe('Name tester');
    expect(screen.getByTestId('input-gravatar-email').value).toBe('tester@tester.com');
   })

   test('Verifica se o botão de configuração redireciona para a página correta', () => {
      const { history } = renderWithRouterAndRedux(<App />);

      userEvent.click(screen.getByTestId('btn-settings'));
      expect(history.location.pathname).toBe('/configuration');
   });

   test('Verifica se o botão de play redireciona para a página correta', async () => {
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
         json: jest.fn().mockResolvedValue({token: '9c0bc17ffc4b6f8dc8cc5175c72887295f1dbd110366144ee5646dab14cd46a5'})
      })
      const { history } = renderWithRouterAndRedux(<App />);


      userLogin('Name tester', 'tester@tester.com');
      userEvent.click(screen.getByTestId('btn-play'));
  
      await waitFor(() => expect(history.location.pathname).toBe('/game'))
    });
});
