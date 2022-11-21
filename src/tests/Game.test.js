import userEvent from "@testing-library/user-event";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import GamePage from "../pages/Game";

describe('Testes da página "GamePage"', () => {
  jest.setTimeout(30000);

  test('Testa se as respostas ficam desabilitadas após o timer zerar', async () => {
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
    const buttonAnswer = screen.getByTestId('correct-answer');

    await waitFor(() => {
      // expect(timer).toHaveTextContent('1');
      expect(buttonAnswer).toBeDisabled();
    }, {timeout: 30000});
  });

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

  test('Testa se ao clicar na resposta correta na dificuldade difícil o score atualiza', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({token: 'testeDeToken', results:[
        {
          "category":"Entertainment: Video Games",
          "type":"boolean",
          "difficulty":"hard",
          "question":"TF2: Sentry rocket damage falloff is calculated based on the distance between the sentry and the enemy, not the engineer and the enemy",
          "correct_answer":"False",
          "incorrect_answers":[
              "True"
          ]
        },]}),
    });
    renderWithRouterAndRedux(<GamePage />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const buttonAnswer = screen.getByTestId('correct-answer');
    const userScore = screen.getAllByTestId('header-score');
    expect(buttonAnswer).toBeInTheDocument();
    userEvent.click(buttonAnswer);
    expect(userScore[1]).toHaveTextContent('90');
  });

  test('Testa se ao clicar na resposta errada o score mantém', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({token: 'testeDeToken', results:[
        {
          "category":"Entertainment: Video Games",
          "type":"boolean",
          "difficulty":"hard",
          "question":"TF2: Sentry rocket damage falloff is calculated based on the distance between the sentry and the enemy, not the engineer and the enemy",
          "correct_answer":"False",
          "incorrect_answers":[
              "True"
          ]
        },]}),
    });
    renderWithRouterAndRedux(<GamePage />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const buttonAnswer = screen.getByTestId('wrong-answer-0');
    const userScore = screen.getAllByTestId('header-score');
    expect(buttonAnswer).toBeInTheDocument();
    userEvent.click(buttonAnswer);
    expect(userScore[1]).toHaveTextContent('0');
  });

  test('Testa se ao clicar na resposta correta na dificuldade média o score altera', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({token: 'testeDeToken', results:[
        {
          "category": "Entertainment: Video Games",
          "type": "multiple",
          "difficulty": "medium",
          "question": "What is the punishment for playing Postal 2 in New Zealand?",
          "correct_answer": "10 years in prison and a fine of $50,000",
          "incorrect_answers": [
            "Fine of $5,000",
            "Nothing",
            "15 years in prison and a fine of $10,000"
        ]
        },]}),
    });
    renderWithRouterAndRedux(<GamePage />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
    const buttonAnswer = screen.getByTestId('correct-answer');
    const userScore = screen.getAllByTestId('header-score');
    expect(buttonAnswer).toBeInTheDocument();
    userEvent.click(buttonAnswer);
    expect(userScore[1]).toHaveTextContent('60');
  });

  // test('Testa erro de token inválido', async () => {
  //   jest.spyOn(global, 'fetch');
  //   global.fetch.mockResolvedValue({
  //     json: jest.fn().mockResolvedValue({
  //       "response_code": 3,
  //       "results": []
  //     }),
  //   });
  //   const { history } = renderWithRouterAndRedux(<GamePage />);
  //   expect(history.location.pathname).toBe('/');
  // });
});
