import { Conteudo } from "../components/Conteudo/Conteudo";
import ListaProfesores from "../components/ListaProfessores/ListaProfessores";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token")); 

    
    useEffect(() => {
        if (!token) {
            Swal.fire({
            title:`Acesso Negado`,
            text:"Necessita do token para continuar",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
            customClass: {
                title: "msg-deletar-titulo msg-deletar",
              }
        })
            navigate("/", { replace: true });
        }
    }, [token, navigate]); 

    return  (
        <main>
            <Conteudo />
            <ListaProfesores />
        </main>
    ) ; 
}
