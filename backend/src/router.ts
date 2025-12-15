import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, login, getUser, updateProfile, getUserByHandle, searchByHandle } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth' 


const router = Router()


// ... tus rutas de auth/register y auth/login siguen igual ...

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

// Rutas Protegidas
router.get('/user', authenticate, getUser) 

//nueva ruta 

router.patch('/user', 
    body('handle').notEmpty().withMessage('El handle no puede ir vacío'), // Validamos que al menos envíe el handle
    handleInputErrors,
    authenticate, 
    updateProfile
)

// Ruta Pública 
router.get('/:handle', getUserByHandle)
router.post('/search', searchByHandle)

export default router