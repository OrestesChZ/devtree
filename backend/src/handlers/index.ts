import { Request, Response } from 'express'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { generateJWT } from '../utils/jwt'

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body

    // 1. Verificar si el Email ya existe
    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json({ error: error.message })
    }

    // 2. Verificar si el Handle ya existe 
    const handle = slug(req.body.handle, '') // Generamos el slug aquí
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    // 3. Crear el usuario
    const user = new User(req.body)
    
    // 4. Asignar el hash y el handle sanitizado
    user.password = await hashPassword(password)
    user.handle = handle // guardamos el slug!

    await user.save()

    res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
    //La validación de errores ya la hizo el middleware handleInputErrors en el router

    const { email, password } = req.body

    // 1. Verificar si el usuario existe
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    // 2. Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto')
        return res.status(401).json({ error: error.message })
    }

    // 3. Generar Token
    const token = generateJWT({ id: user._id })
    
    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({handle})

        // Validamos si el usuario quiere cambiar su handle y si ya está ocupado
        // req.user viene del middleware authenticate, si te marca error en .user ignóralo por ahora o reinicia VS Code
        if(handleExists && handleExists.email !== req.user.email){
             const error = new Error('Nombre de usuario no disponible')
             return res.status(409).json({error: error.message})
        }

        // Actualizamos los datos del usuario logueado
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        // Buscamos el usuario y traemos solo los datos públicos (excluyendo password e ID)
        const user = await User.findOne({handle}).select('-_id -password -email -__v')

        if(!user) {
            const error = new Error('El usuario no existe')
            return res.status(404).json({ error: error.message })
        }

        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

// Buscar usuarios por handle (buscador)
export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        // Buscamos usuarios cuyo handle contenga el texto (insensible a mayúsculas)
        const userExists = await User.find({
            handle: { $regex: handle, $options: 'i' } 
        }).select('handle name image -_id') // Solo devolvemos datos públicos

        if(!userExists.length){
            const error = new Error('No se encontraron resultados')
            return res.status(404).json({error: error.message})
        }

        res.json(userExists)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}