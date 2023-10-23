import { PrismaClient } from '@prisma/client'
import { number } from 'yup'

const prisma = new PrismaClient()

export const getAll = async (req, res) => {
	const order = req.query.order
	const limit = req.query.limit
	try {
		const products = await prisma.product.findMany({
			include: {
				author: true,
			},
			orderBy: {
				price: order,
			},
			take: limit ? +limit : 100,
		})

		res.json(products)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to get products',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const productId = req.params.id
		const product = await prisma.product.findUnique({
			where: { id: +productId },
			include: {
				author: true,
			},
		})

		if (!product) {
			return res.status(500).json({
				message: 'Failed to find a product',
			})
		}

		res.json(product)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Filed to get a product',
		})
	}
}

export const create = async (req, res) => {
	try {
		const product = await prisma.product.create({
			data: {
				name: req.body.name,
				description: req.body.description,
				price: +req.body.price,
				size: req.body.size,
				image: `http://localhost:5000${req.body.image}`,
				putOnSale: req.body.putOnSale,
				directSale: req.body.directSale,
				author: { connect: { id: req.userId } },
			},
			include: {
				author: true,
			},
		})

		res.json(product)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to create a product',
		})
	}
}

// export const remove = async (req, res) => {
// 	try {
// 		const productId = req.params.id
// 		const product = await prisma.product.delete({
// 			where: {
// 				id: +productId,
// 			},
// 		})

// 		if (!product) {
// 			return res.status(500).json({
// 				message: 'Failed to find a product'
// 			})
// 		}

// 		res.json({
// 			success: true
// 		})
// 	} catch (err) {
// 		console.log(err);
// 		res.status(500).json({
// 			message: 'Failed to remove a product'
// 		})
// 	}
// }
