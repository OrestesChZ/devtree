import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { social } from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { updateProfile } from '../api/DevTreeAPI'
import type { User, SocialNetwork } from '../types'

export default function LinkTreeView() {

    // 1. Usuario cargado desde AppLayout
    const user = useOutletContext<User>()
    
    // 2. Estado para manejar los links
    const [devTreeLinks, setDevTreeLinks] = useState<SocialNetwork[]>(
        social.map(item => {
            // Buscar si el usuario ya tiene este link
            const existingLink = user.links.find(link => link.name === item.name)
            
            return {
                name: item.name,
                url: existingLink ? existingLink.url : '',
                enabled: existingLink ? existingLink.enabled : false,
                clicks: existingLink ? existingLink.clicks : 0 // ✅ FIX CLAVE
            }
        })
    )

    // 3. Cambio de URL
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === e.target.name) {
                return { ...link, url: e.target.value }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
    }

    // 4. Habilitar / Deshabilitar link
    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetwork) {
                return { ...link, enabled: !link.enabled }
            }
            return link
        })
        setDevTreeLinks(updatedLinks)
    }

    // 5. Guardar cambios en BD
    const handleSave = async () => {
        try {
            const updatedUser: User = {
                ...user,
                links: devTreeLinks
            }

            await updateProfile(updatedUser)
            toast.success('Cambios guardados correctamente')
        } catch (error) {
            toast.error('Error al guardar los cambios')
        }
    }

    return (
        <div className="space-y-5">
            {devTreeLinks.map(item => {
                const socialItem = social.find(s => s.name === item.name)

                return (
                    <DevTreeInput
                        key={item.name}
                        item={{ ...item, image: socialItem?.image || '' }}
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
                    />
                )
            })}

            <button
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold hover:bg-cyan-500 transition-colors"
                onClick={handleSave}
            >
                Guardar Cambios
            </button>
        </div>
    )
}
