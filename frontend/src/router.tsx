import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
import HandleView from "./views/HandleView";
import HomeView from "./views/HomeView";
import ActivityView from './views/ActivityView';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<HomeView />} />

                <Route element={<AuthLayout />}>
                    <Route path='/auth/login' element={<LoginView />} />
                    <Route path='/auth/register' element={<RegisterView />} />
                </Route>

                {/* 🔐 ADMIN */}
                <Route path='/admin' element={<AppLayout />}>
                    <Route index element={<LinkTreeView />} />
                    <Route path='profile' element={<ProfileView />} />
                    <Route path='activity' element={<ActivityView />} /> {/* ✅ AQUÍ */}
                </Route>

                {/* 🌍 PERFIL PÚBLICO */}
                <Route path='/:handle' element={<AuthLayout />}>
                    <Route index element={<HandleView />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
