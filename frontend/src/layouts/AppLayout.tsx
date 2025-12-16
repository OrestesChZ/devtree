import { useEffect, useState } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import NavigationTabs from "../components/NavigationTabs";
import type { User } from '../types';
import { getUser } from "../api/DevTreeAPI"; // Importamos la función

export default function AppLayout() {

    // Estado para guardar el usuario y saber si está cargando
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Al montar el componente, pedimos el usuario
        getUser()
            .then((data) => {
                setUser(data);
                setIsLoading(false);
            })
            .catch(() => {
                // Si falla (ej: 401), marcamos error y terminamos la carga
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    // 1. Estado de Carga (Spinner simple)
    if (isLoading) return (
        <div className="min-h-screen bg-slate-800 flex justify-center items-center">
            <p className="text-white text-2xl">Cargando datos...</p>
        </div>
    );

    // 2. Estado de Error / No Autorizado -> Redirigir
    if (isError || !user) {
        return <Navigate to="/auth/login" />;
    }

    // 3. Estado de Éxito -> Mostrar Dashboard
    return (
        <>
            <header className="bg-slate-800 py-5">
                <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
                    <div className="w-full p-5 lg:p-0 md:w-1/3">
                        <img src="/logo.svg" className="w-full block" alt="DevTree Logo" />
                    </div>
                    <div className="md:w-1/3 md:flex md:justify-end">
                        <button
                            className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
                            onClick={() => {
                                localStorage.removeItem('AUTH_TOKEN'); // Borrar token
                                window.location.href = '/auth/login'; // Redirigir forzado
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="bg-gray-100 min-h-screen py-10">
                <main className="mx-auto max-w-5xl p-10 md:p-0">

                    <NavigationTabs />

                    <div className="flex justify-end">
                        <Link
                            className="font-bold text-right text-slate-800 text-2xl"
                            // ✅ AHORA SÍ: Usamos el handle dinámico del usuario
                            to={`/${user.handle}`} 
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Visitar Mi Perfil: /{user.handle}
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            {/* Pasamos el usuario a los hijos (Outlet) si fuera necesario mediante Context, 
                                pero por ahora lo dejamos simple */}
                            <Outlet context={user} />
                        </div>
                        <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
                            {/* Aquí irá el visualizador de móvil en el futuro */}
                            <p className="text-white text-center">Simulador de Móvil</p>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-right" />
        </>
    );
}