
import "./BarraDeNavegacao.sass";


export function BarraDeNavegacao(){
    return(
        <nav className="navigation">
            <ul className="lista">
                <li className="nav-link"> <a href="/">Login</a></li>
                <li className="nav-link"><a href="/Home">Página Inicial</a> </li    >
                <li className="nav-link"> Missão </li>
                <li className="nav-link"> Visão </li>
                <li className="nav-link"> Valores </li>
            </ul>
        </nav>
    )
}