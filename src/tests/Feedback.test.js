import React from "react";
import App from "../App";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
describe('Testa a tela de Feedback', () => {
    test('Testa se após logar e responder as perguntas com 3 acertos tudo é renderizado corretamente', () => {
        const initialStateMock = {
            player: {
                name: 'Fulana',
                gravatarEmail: 'test@test.com',
                score: 78,
                assertions: 3,
            }
        };
        renderWithRouterAndRedux(<App />, initialStateMock, '/feedback');
        expect(screen.getByTestId('header-player-name')).toHaveTextContent('Fulana');
        expect(screen.getByTestId('header-score')).toHaveTextContent(78);
        expect(screen.getByTestId('feedback-text')).toHaveTextContent('Well Done!');
        expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ranking/i })).toBeInTheDocument();
    });
    test('Testa se após logar e responder as perguntas com menos de 3 acertos tudo é renderizado corretamente', () => {
        const initialStateMock = {
            player: {
                name: 'Fulana',
                gravatarEmail: 'test@test.com',
                score: 58,
                assertions: 1,
            }
        };
        renderWithRouterAndRedux(<App />, initialStateMock, '/feedback');
        expect(screen.getByTestId('header-player-name')).toHaveTextContent('Fulana');
        expect(screen.getByTestId('header-score')).toHaveTextContent(58);
        expect(screen.getByTestId('feedback-text')).toHaveTextContent('Could be better...');
        expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ranking/i })).toBeInTheDocument();
    });
    test('Testa se o Botão Play again volta para tela incial', () => {
        const initialStateMock = {
            player: {
                name: 'Fulana',
                gravatarEmail: 'test@test.com',
                score: 78,
                assertions: 3,
            }
        };
        renderWithRouterAndRedux(<App />, initialStateMock, '/feedback');
        userEvent.click(screen.getByRole('button', { name: /play again/i }))
        expect(screen.getByTestId('input-player-name')).toBeInTheDocument()
        expect(screen.getByTestId('input-gravatar-email')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /play/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /configurações/i })).toBeInTheDocument();

    });
    test('Testa se o Botão Ranking direciona para tela de Ranking', () => {
        const initialStateMock = {
            player: {
                name: 'Fulana',
                gravatarEmail: 'test@test.com',
                score: 78,
                assertions: 3,
            }
        };
        renderWithRouterAndRedux(<App />, initialStateMock, '/feedback');
        userEvent.click(screen.getByRole('button', { name: /ranking/i }))
        expect(screen.getByTestId('ranking-title')).toBeInTheDocument()

    });
});