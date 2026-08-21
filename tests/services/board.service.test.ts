import { beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('BoardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createBoard', () => {
        it('creates a board', async () => {
            const board = {
                title: 'Task Board',
            };

            vi.mocked(boardRepository.createOne)
                .mockResolvedValue(board as any);

            const result = await BoardService.createBoard(
                board as any,
            );

            expect(boardRepository.createOne)
                .toHaveBeenCalledWith(board);

            expect(result).toEqual(board);
        });
    });

    describe('getBoardByPublicId', () => {
        it('returns board with cards grouped by status', async () => {
            const board = {
                _id: 'board-id',
                publicId: 'public-id',
                title: 'Task Board',
            };

            const cards = [
                {
                    _id: 'card-1',
                    title: 'Task A',
                    description: 'Description A',
                    status: CardStatus.TODO,
                    position: 0,
                },
                {
                    _id: 'card-2',
                    title: 'Task B',
                    description: 'Description B',
                    status: CardStatus.IN_PROGRESS,
                    position: 0,
                },
                {
                    _id: 'card-3',
                    title: 'Task C',
                    description: 'Description C',
                    status: CardStatus.DONE,
                    position: 0,
                },
            ];

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board as any);

            vi.mocked(cardRepository.findByBoardId)
                .mockResolvedValue(cards as any);

            const result =
                await BoardService.getBoardByPublicId('public-id');

            expect(result).toEqual({
                id: 'public-id',
                name: 'Task Board',
                cards: {
                    todo: [
                        {
                            id: 'card-1',
                            name: 'Task A',
                            description: 'Description A',
                            status: 'todo',
                            position: 0,
                        },
                    ],
                    'in-progress': [
                        {
                            id: 'card-2',
                            name: 'Task B',
                            description: 'Description B',
                            status: 'in-progress',
                            position: 0,
                        },
                    ],
                    done: [
                        {
                            id: 'card-3',
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
                _id: 'board-id',
                publicId: 'public-id',
                title: 'Updated Board',
            };

            vi.mocked(boardRepository.updateByPublicId)
                .mockResolvedValue(updatedBoard as any);

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
            const board = {
                _id: 'board-id',
                publicId: 'public-id',
            };

            vi.mocked(boardRepository.findBoardByPublicId)
                .mockResolvedValue(board as any);

            vi.mocked(cardRepository.findByBoardAndDelete)
                .mockResolvedValue({ deletedCount: 2 } as any);

            vi.mocked(boardRepository.deleteByPublicId)
                .mockResolvedValue(board as any);

            await BoardService.deleteBoard('public-id');

            expect(cardRepository.findByBoardAndDelete)
                .toHaveBeenCalledWith(board._id);

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