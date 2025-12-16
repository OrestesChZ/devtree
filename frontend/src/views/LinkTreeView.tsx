import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { social } from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { updateProfile } from '../api/DevTreeAPI'
import type { User, SocialNetwork } from '../types'


export default function LinkTreeView() {

    // 1. Recuperamos el usuario que ya cargó el AppLayout
    const user = useOutletContext<User>()
    
    // 2. Estado para manejar los links visualmente
    const [devTreeLinks, setDevTreeLinks] = useState<SocialNetwork[]>(social.map( item => {
        // Buscamos si el usuario ya tiene este link guardado
        const existingLink = user.links.find(link => link.name === item.name)
        
        // Si existe, usamos sus datos. Si no, creamos uno vacío/deshabilitado.
        return {
            name: item.name,
            url: existingLink ? existingLink.url : '',
            enabled: existingLink ? existingLink.enabled : false
        }
    }))

    // 3. Manejar cambio en el Input (URL)
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => {
            if(link.name === e.target.name) {
                return { ...link, url: e.target.value }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
    }

    // 4. Manejar el Switch (Habilitar/Deshabilitar)
    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if(link.name === socialNetwork) {
                return { ...link, enabled: !link.enabled }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
    }

    // 5. Guardar en Base de Datos
    const handleSave = async () => {
        try {
            // Preparamos el objeto completo del usuario actualizado
            // (Mantenemos handle y description iguales, solo cambiamos links)
            const updatedUser : User = {
                ...user,
                links: devTreeLinks
            }

            await updateProfile(updatedUser) // Llamada a la API
            toast.success('Cambios Guardados Correctamente')
        } catch (error) {
            toast.error('Error al guardar los cambios')
        }
    }

    return (
        <div className='space-y-5'>
            {devTreeLinks.map(item => {
                // Buscamos la imagen correspondiente en el array estático 'social'
                const socialItem = social.find(s => s.name === item.name)
                
                return (
                    <DevTreeInput 
                        key={item.name}
                        item={{ ...item, image: socialItem?.image || '' }} // Pasamos la imagen
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
                    />
                )
            })}

            <button
                className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold hover:bg-cyan-500 transition-colors'
                onClick={handleSave}
            >Guardar Cambios</button>
        </div>
    )
}