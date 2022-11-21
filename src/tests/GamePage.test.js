import userEvent from "@testing-library/user-event";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import GamePage from "../pages/GamePage";


describe('Testes da página "GamePage"', () => {
  test('Testa se o timer reduz os segundos', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({token: 'testeDeToken', results:[
        {
          "category":"Entertainment: Video Games",
          "type":"multiple",
          "difficulty":"easy",
          "question":"What is the first weapon you acquire in Half-Life?",
          "correct_answer":"A crowbar",
          "incorrect_answers":[
              "A pistol",
              "The H.E.V suit",
              "Your fists"
          ]
        },]}),
    });
    renderWithRouterAndRedux(<GamePage />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const timer = screen.getByText(/30/i);
    await waitFor(() => {
      expect(timer).toHaveTextContent('27');
    }, {timeout: 3000});
  });

  test('Testa se ao clicar na resposta correta o botão next aparece', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({token: 'testeDeToken', results:[
        {
          "category":"Entertainment: Video Games",
          "type":"multiple",
          "difficulty":"easy",
          "question":"What is the first weapon you acquire in Half-Life?",
          "correct_answer":"A crowbar",
          "incorrect_answers":[
              "A pistol",
              "The H.E.V suit",
              "Your fists"
          ]
        },]}),
    });
    renderWithRouterAndRedux(<GamePage />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const timer = screen.getByText(/30/i);
    await waitFor(() => {
      expect(timer).toHaveTextContent('29');
    }, {timeout: 1000});
    const buttonAnswer = screen.getByTestId('correct-answer');
    expect(buttonAnswer).toBeInTheDocument();
    userEvent.click(buttonAnswer);
    expect(screen.getByTestId('btn-next')).toBeInTheDocument();
    expect(screen.getByTestId('btn-next')).toBeEnabled();
    userEvent.click(screen.getByTestId('btn-next'));
  });
});
