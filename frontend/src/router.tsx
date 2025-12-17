import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
import HandleView from "./views/HandleView";
import HomeView from "./views/HomeView";
import ActivityView from './views/ActivityView'


export default function Router(){
    return(
        <BrowserRouter>
            <Routes>

                <Route path='/' element={<HomeView />} />
                
                <Route element={<AuthLayout/>}>                    
                    <Route path='/auth/login' element={<LoginView/>}/>
                    <Route path='/auth/register' element={<RegisterView/>}/>
                </Route>

                <Route path='/admin' element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>}></Route>
                    <Route path='profile' element={<ProfileView/>}></Route>
                </Route>

                {/* Ruta Pública para ver perfiles  */}
                <Route path='/:handle' element={<AuthLayout/>}>
                    <Route element={<HandleView/>} index={true}/>
                </Route>

                <Route path="activity" element={<ActivityView />} />


            </Routes>
        </BrowserRouter>
    )
}