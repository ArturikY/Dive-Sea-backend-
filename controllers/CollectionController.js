import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAll = async (req, res) => {
	try {
		const collections = await prisma.collection.findMany()

		res.json(collections)
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Failed to get collections' })
	}
}
