import ListaProfessores from "../Conponentes/ListaProfessores/ListaProfessores"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function Professores() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            Swal.fire({
                title: `Acesso Negado`,
                text: "Necessita do token para continuar",
                icon: "warning",
                confirmButtonColor: "#000000ff",
                confirmButtonText: "OK",
                customClass: {
                    title: "msg-deletar-titulo msg-deletar",
                }
            })
            navigate("/", { replace: true });
        }
    }, [token, navigate]);
    return (

        <div>
            <ListaProfessores />
        </div>
    )
}