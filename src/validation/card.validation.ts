import Joi from 'joi';
import { CardStatus } from '../utils/enum.js';

export const createCardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Card title is required',
    'any.required': 'Card title is required',
    'string.max': 'Card title must be at most 100 characters',
  }),

  description: Joi.string().trim().max(300).allow('').optional().messages({
    'string.max': 'Card description must be at most 300 characters',
  }),
});

export const updateCardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).messages({
    'string.empty': 'Card title cannot be empty',
    'string.max': 'Card title must be at most 100 characters',
  }),

  description: Joi.string().trim().max(300).allow('').messages({
    'string.max': 'Card description must be at most 300 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided',
  });

export const moveCardSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .required()
    .messages({
      'any.required': 'Card status is required',
      'any.only': 'Invalid card status',
    }),

  position: Joi.number().integer().min(0).required().messages({
    'any.required': 'Card position is required',
    'number.integer': 'Card position must be an integer',
    'number.min': 'Card position cannot be negative',
  }),
});
