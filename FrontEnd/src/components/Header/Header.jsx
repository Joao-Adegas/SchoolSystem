import "./Header.sass"
import { BarraDeNavegacao } from "../BarraDeNavegacao/BarraDeNavegacao";

export function Header() {
    return (
      <div className="ContainerHeader">
        <h1>Gerencimaneto Escolar</h1>
        <BarraDeNavegacao/>
      </div >
    );
  }
  