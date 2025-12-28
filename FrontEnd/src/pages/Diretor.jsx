import ListaDiretor from "../Conponentes/ListaDiretor/ListaDiretor"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Diretor() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            Swal.fire({
                title: `Acesso Negado`,
                text: "Necessita do token para continuar",
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
    return (
        <div>
            <ListaDiretor />
        </div>
    )
}