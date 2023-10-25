// import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'

import {
	CollectionController,
	ProductController,
	UserController,
} from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import {
	loginValidation,
	productCreateValidation,
	registerValidation,
} from './validations.js'
import cors from './cors.js'

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

// const corsOptions = {
// 	origin: '*',
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization'],
// 	credentials: true,
// 	maxAge: 600,
// }

app.use(express.json())
// app.use(cors(corsOptions))
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/collections', cors(), CollectionController.getAll)

app.get('/products', ProductController.getAll)
app.get('/products/:id', ProductController.getOne)
app.post(
	'/products',
	checkAuth,
	productCreateValidation,
	handleValidationErrors,
	ProductController.create
)

app.listen('dive-sea-backend.vercel.app' || 5000, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server Ok')
})
