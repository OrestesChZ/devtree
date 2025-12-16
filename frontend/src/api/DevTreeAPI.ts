import { isAxiosError } from 'axios'
import api from '../config/axios'
import { User, RegisterForm, LoginForm } from '../types'

// === AUTH ===

export async function registerUser(formData: RegisterForm) {
    try {
        const { data } = await api.post('/auth/register', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}

export async function loginUser(formData: LoginForm) {
    try {
        const { data } = await api.post('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN', data) 
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}

export async function getUser() {
    try {
        const { data } = await api.get<User>('/user')
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}

export async function updateProfile(formData: User) {
    try {
        const { data } = await api.patch<string>('/user', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}

export async function getUserByHandle(handle: string) {
    try {
        const { data } = await api.get<User>(`/${handle}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}

// === BUSCADOR (Solo la llamada a la API) ===

export async function searchProfiles(handle: string) {
    try {
        const { data } = await api.post('/search', { handle })
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw new Error('Ha ocurrido un error inesperado')
    }
}