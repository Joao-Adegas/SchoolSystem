import "../Layout/layout.sass"
import { Header } from "../Header/Header"
import { Rodape } from "../Rodape/Rodape"
import { Outlet } from "react-router-dom";
import Aside from "../Aside/Aside"

export default function Layout() {
    return (
        
        <div className="body">
            <Aside />
            <main className="content">
                <Outlet />
            </main>
        </div>
        
    )
}