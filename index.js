import cors from 'cors'
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

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use((res, next) => {
	res.headers('Access-Control-Allow-Origin', '*')
	res.headers('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	res.headers('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.header['Access-Control-Allow-Origin'] = '*'
	next()
})
app.options('*', cors())

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
