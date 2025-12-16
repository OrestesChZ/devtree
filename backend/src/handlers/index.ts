import { Request, Response } from 'express'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { generateJWT } from '../utils/jwt'

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('El usuario ya está registrado')
        return res.status(409).json({ error: error.message })
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()
    res.status(201).send('Registro creado correctamente')
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto')
        return res.status(401).json({ error: error.message })
    }

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
        const handleExists = await User.findOne({ handle })

        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({ error: error.message })
        }

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

        const user = await User.findOne({ handle })
            .select('-_id -password -email -__v')

        if (!user) {
            const error = new Error('El usuario no existe')
            return res.status(404).json({ error: error.message })
        }

        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body

        const userExists = await User.find({
            handle: { $regex: handle, $options: 'i' }
        }).select('handle name image -_id')

        if (!userExists.length) {
            const error = new Error('No se encontraron resultados')
            return res.status(404).json({ error: error.message })
        }

        res.json(userExists)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const registerLinkClick = async (req: Request, res: Response) => {
    try {
        const { handle, linkName } = req.body

        // 1. Buscar usuario
        const user = await User.findOne({ handle })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        // 2. Buscar el link
        const link = user.links.find(link => link.name === linkName && link.enabled)
        if (!link) {
            const error = new Error('Link no encontrado o deshabilitado')
            return res.status(404).json({ error: error.message })
        }

        // 3. Incrementar contador
        link.clicks = (link.clicks || 0) + 1

        // 4. Guardar cambios
        await user.save()

        res.json({ message: 'Click registrado correctamente' })

    } catch (e) {
        const error = new Error('Error al registrar click')
        return res.status(500).json({ error: error.message })
    }
}

