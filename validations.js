import { body } from 'express-validator'

export const loginValidation = [
	body('nickname', 'Invalid nickname format'),
	body('password', 'Password must have 5 symbols').isLength({ min: 5 }),
]

export const registerValidation = [
	body('firstName', 'Enter your firstName').isLength({ min: 3 }),
	body('lastName', 'Enter your firstName').isLength({ min: 3 }),
	body('nickname', 'Enter your nickname').isLength({ min: 3 }),
	body('password', 'Password must have 5 symbols').isLength({ min: 5 }),
	body('avatar', 'Invalid link to avatar').optional().isString(),
]

// Change descriptin({ max })
export const productCreateValidation = [
	body('name', 'Enter name product').isLength({ min: 3 }).isString(),
	body('description', 'Enter description product')
		.isLength({ min: 3 })
		.isString(),
	body('price', 'Invalid price format').isString(),
	body('size', 'Invalid size format').isString(),
	body('image', 'Invalid link to image').isString(),
]
