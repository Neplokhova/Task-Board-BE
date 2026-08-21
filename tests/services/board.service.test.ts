import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

import BoardService from '../../src/services/board.service.js';
import {
    boardRepository,
    cardRepository,
} from '../../src/repositories/index.repository.js';
import { CardStatus } from '../../src/utils/enum.js';

vi.mock('../../src/repositories/index.repository.js', () => ({
    boardRepository: {
        createOne: vi.fn(),
        findBoardByPublicId: vi.fn(),
        updateByPublicId: vi.fn(),
        deleteByPublicId: vi.fn(),
    },
    cardRepository: {
        findByBoardId: vi.fn(),
        findByBoardAndDelete: vi.fn(),
    },
}));

type BoardDocument = NonNullable<
    Awaited<ReturnType<typeof boardRepository.findBoardByPublicId>>
>;

type CreatedBoard = Awaited<
    ReturnType<typeof boardRepository.createOne>
>;

type UpdatedBoard = NonNullable<
    Awaited<ReturnType<typeof boardRepository.updateByPublicId>>
>;

type CardDocuments = Awaited<
    ReturnType<typeof cardRepository.findByBoardId>
>;

type DeletedCards = Awaited<
    ReturnType<typeof cardRepository.findByBoardAndDelete>
>;

describe('BoardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createBoard', () => {
        it('creates a board', async () => {
            const board = {
                publicId: 'public-board-id',
                title: 'Task Board',
            };

            const createdBoard = board as CreatedBoard;

            vi.mocked(boardRepository.createOne)
                .mockResolvedValue(createdBoard);

            const result = await BoardService.createBoard(board);

            expect(boardRepository.createOne)
                .toHaveBeenCalledWith(board);

            expect(result).toEqual(createdBoard);
        });
    });

    describe('getBoardByPublicId', () => {
        it('returns board with cards grouped by status', async () => {
            const boardId = new Types.ObjectId();

            const board = {
                _id: boardId,
                publicId: 'public-id',
                title: 'Task Board',
            } as BoardDocument;

            const card1Id = new Types.ObjectId(
                '507f1f77bcf86cd799439011',
            );

            const card2Id = new Types.ObjectId(
                '507f1f77bcf86cd799439012',
            );

            const card3Id = new Types.ObjectId(
                '507f1f77bcf86cd799439013',
            );

            const cards = [
                {
                    _id: card1Id,
                    title: 'Task A',
                    description: 'Description A',
                    status: CardStatus.TODO,
                    position: 0,
                },
                {
                    _id: card2Id,
                    title: 'Task B',
                    description: 'Description B',
                    status: CardStatus.IN_PROGRESS,
                    position: 0,
                },
                {
                    _id: card3Id,
                    title: 'Task C',
                    description: 'Description C',
                    status: CardStatus.DONE,
                    position: 0,
                },
            ] as CardDocuments;

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board);

            vi.mocked(cardRepository.findByBoardId)
                .mockResolvedValue(cards);

            const result =
                await BoardService.getBoardByPublicId('public-id');

            expect(result).toEqual({
                id: 'public-id',
                name: 'Task Board',
                cards: {
                    todo: [
                        {
                            id: card1Id.toString(),
                            name: 'Task A',
                            description: 'Description A',
                            status: 'todo',
                            position: 0,
                        },
                    ],
                    'in-progress': [
                        {
                            id: card2Id.toString(),
                            name: 'Task B',
                            description: 'Description B',
                            status: 'in-progress',
                            position: 0,
                        },
                    ],
                    done: [
                        {
                            id: card3Id.toString(),
                            name: 'Task C',
                            description: 'Description C',
                            status: 'done',
                            position: 0,
                        },
                    ],
                },
            });
        });

        it('throws BOARD_NOT_FOUND when board does not exist', async () => {
            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(null);

            await expect(
                BoardService.getBoardByPublicId('unknown-board'),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'BOARD_NOT_FOUND',
                message: 'Board not found',
            });

            expect(cardRepository.findByBoardId)
                .not.toHaveBeenCalled();
        });
    });

    describe('updateBoard', () => {
        it('updates a board by public ID', async () => {
            const updatedBoard = {
                _id: new Types.ObjectId(),
                publicId: 'public-id',
                title: 'Updated Board',
            } as UpdatedBoard;

            vi.mocked(boardRepository.updateByPublicId)
                .mockResolvedValue(updatedBoard);

            const result = await BoardService.updateBoard(
                'public-id',
                {
                    title: 'Updated Board',
                },
            );

            expect(boardRepository.updateByPublicId)
                .toHaveBeenCalledWith(
                    'public-id',
                    {
                        title: 'Updated Board',
                    },
                    {
                        new: true,
                    },
                );

            expect(result).toEqual(updatedBoard);
        });

        it('throws BOARD_NOT_FOUND when board does not exist', async () => {
            vi.mocked(boardRepository.updateByPublicId)
                .mockResolvedValue(null);

            await expect(
                BoardService.updateBoard(
                    'unknown-board',
                    {
                        title: 'Updated',
                    },
                ),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'BOARD_NOT_FOUND',
            });
        });
    });

    describe('deleteBoard', () => {
        it('deletes the cards and then the board', async () => {
            const boardId = new Types.ObjectId();

            const board = {
                _id: boardId,
                publicId: 'public-id',
                title: 'Task Board',
            } as BoardDocument;

            const deletedCards = {
                acknowledged: true,
                deletedCount: 2,
            } as DeletedCards;

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board);

            vi.mocked(cardRepository.findByBoardAndDelete)
                .mockResolvedValue(deletedCards);

            vi.mocked(boardRepository.deleteByPublicId)
                .mockResolvedValue(board);

            await BoardService.deleteBoard('public-id');

            expect(cardRepository.findByBoardAndDelete)
                .toHaveBeenCalledWith(boardId);

            expect(boardRepository.deleteByPublicId)
                .toHaveBeenCalledWith('public-id');
        });

        it('throws BOARD_NOT_FOUND when board does not exist', async () => {
            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(null);

            await expect(
                BoardService.deleteBoard('unknown-board'),
            ).rejects.toMatchObject({
                statusCode: 404,
                code: 'BOARD_NOT_FOUND',
            });

            expect(cardRepository.findByBoardAndDelete)
                .not.toHaveBeenCalled();

            expect(boardRepository.deleteByPublicId)
                .not.toHaveBeenCalled();
        });
    });
});