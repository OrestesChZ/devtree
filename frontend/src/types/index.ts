export type SocialNetwork = {
    name: string
    url: string
    enabled: boolean
    clicks: number // 👈 NUEVO
}

export type User = {
    handle: string
    name: string
    email: string
    image: string
    description: string
    links: SocialNetwork[]
}

export type RegisterForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>

export type ActivityLog = {
    _id: string
    action: 'UPDATE_URL' | 'ENABLE_LINK' | 'DISABLE_LINK'
    linkName: string
    oldValue?: string
    newValue?: string
    createdAt: string
}

