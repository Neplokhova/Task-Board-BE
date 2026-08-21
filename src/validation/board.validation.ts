import Joi from 'joi';

export const createBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Board title is required',
    'any.required': 'Board title is required',
    'string.max': 'Board title must be at most 100 characters',
  }),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).messages({
    'string.empty': 'Board title cannot be empty',
    'string.max': 'Board title must be at most 100 characters',
  }),
});
