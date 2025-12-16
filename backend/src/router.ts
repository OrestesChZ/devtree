import { Router } from 'express'
import { body } from 'express-validator'
import { 
    createAccount, 
    login, 
    getUser, 
    updateProfile, 
    getUserByHandle, 
    searchByHandle,
    registerLinkClick // 👈 NUEVO HANDLER
} from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth' 

const router = Router()

// Auth
router.post('/auth/register', 
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    createAccount
)

router.post('/auth/login', 
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    login
)

// Rutas protegidas
router.get('/user', authenticate, getUser)

router.patch('/user', 
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'),
    handleInputErrors,
    authenticate, 
    updateProfile
)

// 🔥 NUEVA RUTA: contador de clicks
router.post(
    '/link/click',
    body('handle').notEmpty().withMessage('Handle requerido'),
    body('linkName').notEmpty().withMessage('Link requerido'),
    handleInputErrors,
    registerLinkClick
)

// Rutas públicas
router.get('/:handle', getUserByHandle)
router.post('/search', searchByHandle)

export default router
