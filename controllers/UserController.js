import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)

		const user = await prisma.user.create({
			data: {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				nickname: req.body.nickname,
				password: passwordHash,
				avatar: req.body.avatar
					? `http://localhost:5000${req.body.avatar}`
					: 'http://localhost:5000/uploads/user.png',
			},
		})

		const token = jwt.sign(
			{
				id: user.id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		res.json({ ...user, token })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed registration',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { nickname: req.body.nickname },
		})

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			})
		}

		const isValidPass = await bcrypt.compare(req.body.password, user.password)

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Invalid login or password',
			})
		}

		const token = jwt.sign(
			{
				id: user.id,
			},
			'secret123',
			{ expiresIn: '30d' }
		)

		res.json({ ...user, token })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed authorization',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.userId,
			},
		})

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.json({ ...user })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'No access',
		})
	}
}
