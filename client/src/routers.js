import Login from "./pages/Login";
import Main from "./pages/Main";
import Registration from "./pages/Registration";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE } from "./utils/consts";

export const publicRoutes = [
    {
        path:LOGIN_ROUTE,
        Component: Login
    },
    {
        path:REGISTRATION_ROUTE,
        Component: Registration
    },
]
export const authRoutes = [
    {
        path:MAIN_ROUTE,
        Component: Main
    },
]