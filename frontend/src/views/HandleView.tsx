import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getUserByHandle } from '../api/DevTreeAPI'
import type { User } from '../types'
import { social } from '../data/social'
import { registerLinkClick } from '../api/DevTreeAPI'


export default function HandleView() {

    const params = useParams()
    const handle = params.handle!
    
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUserByHandle(handle)
            .then(data => {
                setUser(data)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [handle])

    if(loading) return <p className="text-center text-white text-2xl mt-10">Cargando perfil...</p>
    if(error || !user) return <Navigate to={'/404'} /> // O redirigir a login

    return (
        <div className="space-y-6 text-white">
            <p className='text-5xl text-center font-black'>{handle}</p>
            
            {user.image && (
                <img src={user.image} className="max-w-[250px] mx-auto rounded-full" alt="Imagen de perfil" />
            )}

            <p className='text-lg text-center font-bold'>{user.description}</p>

            <div className="mt-20 flex flex-col gap-6">
                {user.links.length ? 
                    user.links.map( link => {
                        if(link.enabled) {
                             const socialLink = social.find(s => s.name === link.name)
                             // Fallback por si acaso
                             const socialImage = socialLink ? socialLink.image : '' 
                             
                             return (
                                <a 
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    onClick={() => registerLinkClick(user.handle, link.name)}
                                    className="bg-white px-5 py-4 flex items-center gap-5 rounded-lg text-slate-800 hover:bg-slate-200 transition-colors"
                                >
                                    {socialImage && (
                                        <img src={socialImage} alt="icono red social" className="w-12"/>
                                    )}
                                    <p className="text-black capitalize font-bold text-lg">
                                        Visita mi: {link.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {link.clicks} visitas
                                    </p>
                                </a>
                             )
                        }
                    }) 
                : <p className="text-center">No hay enlaces en este perfil</p>}
            </div>
        </div>
    )
}