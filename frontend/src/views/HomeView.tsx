import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchProfiles } from '../api/DevTreeAPI'
import { User } from '../types'
import { toast } from 'sonner'

export default function HomeView() {
    const [ search, setSearch ] = useState('')
    const [ results, setResults ] = useState<User[]>([])
    const [ hasSearched, setHasSearched ] = useState(false) // Para controlar si ya buscó

    const handleSearch = async () => {
        setResults([])
        setHasSearched(true)
        try {
            const data = await searchProfiles(search)
            setResults(data)
        } catch (error) {
            toast.error('No se encontraron usuarios con ese nombre')
        }
    }

    return (
        <>
            <header className="bg-slate-800 py-5">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between px-5 md:px-0">
                    <div className="w-full p-5 lg:p-0 md:w-1/3">
                        <img src="/logo.svg" className="w-full block" alt="Logotipo" />
                    </div>
                    <nav className="md:w-1/3 md:flex md:justify-end gap-5">
                        <Link to="/auth/login" className="font-bold text-white text-lg hover:text-cyan-400 uppercase">Iniciar Sesión</Link>
                        <Link to="/auth/register" className="font-bold text-white text-lg hover:text-cyan-400 uppercase">Registro</Link>
                    </nav>
                </div>
            </header>

            <div className="bg-gray-100 min-h-screen py-10 lg:py-20 px-5">
                <main className="mx-auto max-w-5xl">
                    <h1 className="text-4xl lg:text-5xl font-black text-center text-slate-800">
                        Encuentra y conecta con <span className="text-cyan-400">Desarrolladores</span>
                    </h1>
                    <p className="mt-5 text-xl text-center text-slate-500">Únete a la comunidad y comparte tus enlaces</p>

                    {/* Buscador */}
                    <div className="mt-10 flex flex-col md:flex-row gap-5 justify-center max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar por handle (ej: david)"
                            className="p-3 rounded-lg border border-gray-300 w-full text-lg"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button 
                            className="bg-cyan-400 p-3 rounded-lg text-slate-800 uppercase font-bold hover:bg-cyan-500 transition-colors"
                            onClick={handleSearch}
                        >
                            Buscar
                        </button>
                    </div>

                    {/* Resultados */}
                    <div className="mt-10 max-w-2xl mx-auto">
                        {results.length > 0 ? (
                            <ul className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
                                {results.map(user => (
                                    <li key={user.handle} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className='flex items-center gap-4'>
                                           {user.image && <img src={user.image} className="w-10 h-10 rounded-full"/>} 
                                           <p className="text-xl font-bold text-slate-800">{user.handle}</p>
                                        </div>
                                        <Link 
                                            to={`/${user.handle}`} 
                                            className="text-cyan-500 hover:text-cyan-700 font-bold"
                                        >
                                            Ver Perfil &rarr;
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : hasSearched && (
                            <p className="text-center text-gray-500 text-lg">No hay resultados para tu búsqueda</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}