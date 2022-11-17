import React from "react";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen } from '@testing-library/react';
import App from "../App";
import userEvent from "@testing-library/user-event";

describe('Testa o componente Ranking', () => {
    test('Testa se após após tres jogadas o ranking é renderizado corretamente', () => {
        const initialStateMock = {
            player: {
                name: 'player3',
                gravatarEmail: 'player3@email.com',
                score: 150,
                assertions: 2
            }
        }
        const arr = [
            { "name": "player1", "score": 60, "picture": "https://www.gravatar.com/avatar/6c837561c64aa9127eb2d02a9e2057d7" }, { "name": "player2", "score": 53, "picture": "https://www.gravatar.com/avatar/6c837561c64aa9127eb2d02a9e2057d7" }, { "name": "player3", "score": 97, "picture": "https://www.gravatar.com/avatar/6c837561c64aa9127eb2d02a9e2057d7" }]
        window.localStorage.setItem('ranking', JSON.stringify(arr));
        const localData = JSON.parse(localStorage.getItem('ranking'));
        renderWithRouterAndRedux(<App />, initialStateMock, '/ranking');

        const winner = screen.getByTestId('player-name-0');
        expect(winner).toHaveTextContent('player3')

        const second = screen.getByTestId('player-name-1');
        expect(second).toHaveTextContent('player1')

        const third = screen.getByTestId('player-name-2');
        expect(third).toHaveTextContent('player2')

    });
    test('Testa se ao clicar no botão é redirecionado para a página inical', () => {
        const initialStateMock = {
            player: {
                name: 'player3',
                gravatarEmail: 'player3@email.com',
                score: 150,
                assertions: 2
            }
        }
        renderWithRouterAndRedux(<App />, initialStateMock, '/ranking');
        userEvent.click(screen.getByTestId('btn-go-home'));
        expect(screen.getByTestId('input-player-name')).toBeInTheDocument()
        expect(screen.getByTestId('input-gravatar-email')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /play/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /configurações/i })).toBeInTheDocument();
    })
})
