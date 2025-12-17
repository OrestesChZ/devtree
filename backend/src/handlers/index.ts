import { Request, Response } from 'express'
import User from "../models/User"
import ActivityLog from '../models/ActivityLog'
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { generateJWT } from '../utils/jwt'

// =======================
// AUTH
// =======================

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(409).json({ error: 'El usuario ya está registrado' })
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        return res.status(409).json({ error: 'Nombre de usuario no disponible' })
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
        return res.status(404).json({ error: 'El usuario no existe' })
    }

    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Password incorrecto' })
    }

    const token = generateJWT({ id: user._id })
    res.send(token)
}

// =======================
// USER
// =======================

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })

        if (handleExists && handleExists.email !== req.user.email) {
            return res.status(409).json({ error: 'Nombre de usuario no disponible' })
        }

        // 🔥 REGISTRO DE HISTORIAL DE CAMBIOS
        links.forEach((newLink: any) => {
            const oldLink = req.user.links.find(
                (link: any) => link.name === newLink.name
            )

            if (!oldLink) return

            // Cambio de URL
            if (oldLink.url !== newLink.url) {
                ActivityLog.create({
                    user: req.user._id,
                    action: 'UPDATE_URL',
                    linkName: newLink.name,
                    oldValue: oldLink.url,
                    newValue: newLink.url
                })
            }

            // Activar / Desactivar link
            if (oldLink.enabled !== newLink.enabled) {
                ActivityLog.create({
                    user: req.user._id,
                    action: newLink.enabled ? 'ENABLE_LINK' : 'DISABLE_LINK',
                    linkName: newLink.name
                })
            }
        })

        // Actualización normal del perfil
        req.user.description = description
        req.user.handle = handle
        req.user.links = links

        await req.user.save()
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        return res.status(500).json({ error: 'Hubo un error' })
    }
}

// =======================
// PUBLIC
// =======================

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params

        const user = await User.findOne({ handle })
            .select('-_id -password -email -__v')

        if (!user) {
            return res.status(404).json({ error: 'El usuario no existe' })
        }

        res.json(user)
    } catch (e) {
        return res.status(500).json({ error: 'Hubo un error' })
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body

        const userExists = await User.find({
            handle: { $regex: handle, $options: 'i' }
        }).select('handle name image -_id')

        if (!userExists.length) {
            return res.status(404).json({ error: 'No se encontraron resultados' })
        }

        res.json(userExists)
    } catch (e) {
        return res.status(500).json({ error: 'Hubo un error' })
    }
}

// =======================
// CLICK TRACKING
// =======================

export const registerLinkClick = async (req: Request, res: Response) => {
    try {
        const { handle, linkName } = req.body

        const user = await User.findOne({ handle })
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        const link = user.links.find(
            link => link.name === linkName && link.enabled
        )

        if (!link) {
            return res.status(404).json({ error: 'Link no encontrado o deshabilitado' })
        }

        link.clicks = (link.clicks || 0) + 1
        await user.save()

        res.json({ message: 'Click registrado correctamente' })
    } catch (e) {
        return res.status(500).json({ error: 'Error al registrar click' })
    }
}

// =======================
// ACTIVITY LOG
// =======================

export const getActivityLog = async (req: Request, res: Response) => {
    try {
        const logs = await ActivityLog.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50)

        res.json(logs)
    } catch (e) {
        res.status(500).json({ error: 'Error obteniendo historial' })
    }
}
