import { beforeEach, describe, expect, it, vi } from 'vitest';

import CardService from '../../src/services/card.service.js';
import {
    boardRepository,
    cardRepository,
} from '../../src/repositories/index.repository.js';
import { CardStatus } from '../../src/utils/enum.js';

vi.mock('../../src/repositories/index.repository.js', () => ({
    boardRepository: {
        findBoardByPublicId: vi.fn(),
    },
    cardRepository: {
        findLastByBoardAndStatus: vi.fn(),
        createOne: vi.fn(),
        updateById: vi.fn(),
        moveCard: vi.fn(),
        deleteById: vi.fn(),
        findById: vi.fn(),
    },
}));

describe('CardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCard', () => {
        it('creates the first card at position 0', async () => {
            const board = {
                _id: 'board-id',
                publicId: 'public-board-id',
                title: 'Task Board',
            };

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board as any);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue(null);

            const createdCard = {
                _id: 'card-id',
                title: 'Task A',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: board._id,
                position: 0,
            };

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue(createdCard as any);

            const result = await CardService.createCard(
                'Task A',
                'public-board-id',
                'Description',
            );

            expect(cardRepository.findLastByBoardAndStatus)
                .toHaveBeenCalledWith(
                    board._id,
                    CardStatus.TODO,
                );

            expect(cardRepository.createOne)
                .toHaveBeenCalledWith({
                    title: 'Task A',
                    description: 'Description',
                    status: CardStatus.TODO,
                    boardId: board._id,
                    position: 0,
                });

            expect(result).toEqual(createdCard);
        });

        it('creates a new card after the last TODO card', async () => {
            const board = {
                _id: 'board-id',
                publicId: 'public-board-id',
                title: 'Task Board',
            };

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board as any);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue({
                    position: 3,
                } as any);

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue({
                    position: 4,
                } as any);

            await CardService.createCard(
                'Task E',
                'public-board-id',
                'Description',
            );

            expect(cardRepository.createOne)
                .toHaveBeenCalledWith({
                    title: 'Task E',
                    description: 'Description',
                    status: CardStatus.TODO,
                    boardId: board._id,
                    position: 4,
                });
        });

        it('throws BOARD_NOT_FOUND when the board does not exist', async () => {
            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(null);

            await expect(
                CardService.createCard(
                    'Task A',
                    'unknown-board',
                ),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'BOARD_NOT_FOUND',
                message: 'Board not found',
            });

            expect(cardRepository.createOne)
                .not.toHaveBeenCalled();
        });

        it('trims title and description', async () => {
            const board = {
                _id: 'board-id',
                publicId: 'public-board-id',
            };

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board as any);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue(null);

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue({} as any);

            await CardService.createCard(
                '   Task A   ',
                'public-board-id',
                '   Description   ',
            );

            expect(cardRepository.createOne)
                .toHaveBeenCalledWith({
                    title: 'Task A',
                    description: 'Description',
                    status: CardStatus.TODO,
                    boardId: board._id,
                    position: 0,
                });
        });
    });

    describe('updateCard', () => {
        it('updates a card', async () => {
            const updatedCard = {
                _id: 'card-id',
                title: 'Updated',
                description: 'Updated description',
            };

            vi.mocked(cardRepository.updateById)
                .mockResolvedValue(updatedCard as any);

            const result = await CardService.updateCard(
                'card-id',
                'Updated',
                'Updated description',
            );

            expect(cardRepository.updateById)
                .toHaveBeenCalledWith(
                    'card-id',
                    {
                        title: 'Updated',
                        description: 'Updated description',
                    },
                    {
                        new: true,
                    },
                );

            expect(result).toEqual(updatedCard);
        });
    });

    describe('moveCard', () => {
        it('moves a card', async () => {
            const movedCard = {
                _id: 'card-id',
                status: CardStatus.DONE,
                position: 2,
            };

            vi.mocked(cardRepository.moveCard)
                .mockResolvedValue(movedCard as any);

            const result = await CardService.moveCard(
                'card-id',
                CardStatus.DONE,
                2,
            );

            expect(cardRepository.moveCard)
                .toHaveBeenCalledWith(
                    'card-id',
                    CardStatus.DONE,
                    2,
                );

            expect(result).toEqual(movedCard);
        });

        it('throws CARD_NOT_FOUND when card does not exist', async () => {
            vi.mocked(cardRepository.moveCard)
                .mockResolvedValue(null);

            await expect(
                CardService.moveCard(
                    'unknown-card',
                    CardStatus.DONE,
                    0,
                ),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'CARD_NOT_FOUND',
                message: 'Card not found',
            });
        });
    });

    describe('deleteCard', () => {
        it('deletes a card', async () => {
            const deletedCard = {
                _id: 'card-id',
            };

            vi.mocked(cardRepository.deleteById)
                .mockResolvedValue(deletedCard as any);

            const result = await CardService.deleteCard('card-id');

            expect(cardRepository.deleteById)
                .toHaveBeenCalledWith('card-id');

            expect(result).toEqual(deletedCard);
        });

        it('throws CARD_NOT_FOUND when card does not exist', async () => {
            vi.mocked(cardRepository.deleteById)
                .mockResolvedValue(null);

            await expect(
                CardService.deleteCard('unknown-card'),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'CARD_NOT_FOUND',
            });
        });
    });
});