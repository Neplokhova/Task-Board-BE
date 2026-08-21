import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

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

type BoardDocument = Awaited<
    ReturnType<typeof boardRepository.findBoardByPublicId>
>;

type CreatedCard = Awaited<
    ReturnType<typeof cardRepository.createOne>
>;

type LastCard = Awaited<
    ReturnType<typeof cardRepository.findLastByBoardAndStatus>
>;

type UpdatedCard = Awaited<
    ReturnType<typeof cardRepository.updateById>
>;

type MovedCard = Awaited<
    ReturnType<typeof cardRepository.moveCard>
>;

type DeletedCard = Awaited<
    ReturnType<typeof cardRepository.deleteById>
>;

describe('CardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCard', () => {
        it('creates the first card at position 0', async () => {
            const board = {
                _id: new Types.ObjectId(),
                publicId: 'public-board-id',
                title: 'Task Board',
            } as BoardDocument;

            const createdCard = {
                _id: new Types.ObjectId(),
                title: 'Task A',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: board?._id,
                position: 0,
            } as CreatedCard;

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue(null);

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue(createdCard);

            const result = await CardService.createCard(
                'Task A',
                'public-board-id',
                'Description',
            );

            expect(cardRepository.findLastByBoardAndStatus)
                .toHaveBeenCalledWith(
                    board?._id,
                    CardStatus.TODO,
                );

            expect(cardRepository.createOne)
                .toHaveBeenCalledWith({
                    title: 'Task A',
                    description: 'Description',
                    status: CardStatus.TODO,
                    boardId: board?._id,
                    position: 0,
                });

            expect(result).toEqual(createdCard);
        });

        it('creates a new card after the last TODO card', async () => {
            const board = {
                _id: new Types.ObjectId(),
                publicId: 'public-board-id',
                title: 'Task Board',
            } as BoardDocument;

            const lastCard = {
                _id: new Types.ObjectId(),
                title: 'Task D',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: board?._id,
                position: 3,
            } as LastCard;

            const createdCard = {
                _id: new Types.ObjectId(),
                title: 'Task E',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: board?._id,
                position: 4,
            } as CreatedCard;

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue(lastCard);

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue(createdCard);

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
                    boardId: board?._id,
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
                _id: new Types.ObjectId(),
                publicId: 'public-board-id',
                title: 'Task Board',
            } as BoardDocument;

            const createdCard = {
                _id: new Types.ObjectId(),
                title: 'Task A',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: board?._id,
                position: 0,
            } as CreatedCard;

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board);

            vi.mocked(cardRepository.findLastByBoardAndStatus)
                .mockResolvedValue(null);

            vi.mocked(cardRepository.createOne)
                .mockResolvedValue(createdCard);

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
                    boardId: board?._id,
                    position: 0,
                });
        });
    });

    describe('updateCard', () => {
        it('updates a card', async () => {
            const updatedCard = {
                _id: new Types.ObjectId(),
                title: 'Updated',
                description: 'Updated description',
                status: CardStatus.TODO,
                boardId: new Types.ObjectId(),
                position: 0,
            } as UpdatedCard;

            vi.mocked(cardRepository.updateById)
                .mockResolvedValue(updatedCard);

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
                _id: new Types.ObjectId(),
                title: 'Task',
                description: 'Description',
                status: CardStatus.DONE,
                boardId: new Types.ObjectId(),
                position: 2,
            } as MovedCard;

            vi.mocked(cardRepository.moveCard)
                .mockResolvedValue(movedCard);

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
                _id: new Types.ObjectId(),
                title: 'Task',
                description: 'Description',
                status: CardStatus.TODO,
                boardId: new Types.ObjectId(),
                position: 0,
            } as DeletedCard;

            vi.mocked(cardRepository.deleteById)
                .mockResolvedValue(deletedCard);

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