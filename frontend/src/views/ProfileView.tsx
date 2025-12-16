import { useForm } from "react-hook-form"
import { useOutletContext } from "react-router-dom"
import { toast } from "sonner"
import ErrorMessage from "../components/ErrorMessage"
import type { User, ProfileForm } from '../types' // Asegúrate de tener ProfileForm en types o usa User
import { updateProfile } from "../api/DevTreeAPI"

export default function ProfileView() {

    // 1. Obtenemos el usuario actual del Contexto
    const user = useOutletContext<User>()

    // 2. Configuramos el formulario con los datos actuales del usuario
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            handle: user.handle,
            description: user.description
        }
    })

    // 3. Función para enviar los cambios
    const handleUserProfileUpdate = async (data: ProfileForm) => {
        const userFormData = {
            ...user, // Mantenemos los datos que no cambian (email, links, etc)
            handle: data.handle,
            description: data.description
        }

        try {
            await updateProfile(userFormData)
            toast.success('Perfil actualizado correctamente')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Hubo un error')
        }
    }

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileUpdate)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            
            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="handle">Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle"
                    {...register('handle', {
                        required: "El nombre de usuario es obligatorio"
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="description">Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu descripción biográfica"
                    {...register('description', {
                        required: "La descripción es obligatoria"
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label htmlFor="image">Imagen:</label>
                <input
                    id="image"
                    type="file"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={() => { toast.info('La subida de imágenes requiere configuración adicional en el backend') }}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold cursor-pointer transition-colors hover:bg-cyan-500"
                value="Guardar Cambios"
            />
        </form>
    )
}