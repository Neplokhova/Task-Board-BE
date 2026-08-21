import { NextFunction, Request, Response } from 'express';

import BoardService from '../services/board.service.js';

async function createBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await BoardService.createBoard(req.body);

    return res.status(201).json({
      success: true,
      data: board,
      message: 'Board created successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function getBoardByPublicId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const board = await BoardService.getBoardByPublicId(
      req.params.publicId.toString(),
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
        code: 'BOARD_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: board,
      message: 'Board opened successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function updateBoardById(
  req: Request<{ publicId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const updatedBoard = await BoardService.updateBoard(
      req.params.publicId,
      req.body,
    );

    if (!updatedBoard) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
        code: 'BOARD_NOT_FOUND',
      });
    }

    return res.status(201).json({
      success: true,
      data: updatedBoard,
      message: 'Board updated successfully',
    });
  } catch (e) {
    return next(e);
  }
}

async function deleteBoardById(
  req: Request<{ publicId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const board = await BoardService.getBoardByPublicId(req.params.publicId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found',
        code: 'BOARD_NOT_FOUND',
      });
    }

    await BoardService.deleteBoard(req.params.publicId);
    return res.status(201).json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (e) {
    return next(e);
  }
}

export { createBoard, updateBoardById, getBoardByPublicId, deleteBoardById };
