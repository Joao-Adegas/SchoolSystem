import "../Layout/layout.sass"
import { Header } from "../Header/Header"
import { Rodape } from "../Rodape/Rodape"
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        
        <div className="body">
            <header>
                <Header />
            </header>

            <main role="main">
                <Outlet />
            </main>

            <footer>
                <Rodape />
            </footer>

        </div>
        
    )
}