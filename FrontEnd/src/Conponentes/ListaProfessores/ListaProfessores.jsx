import { useEffect, useState } from "react";
import axios from "axios";
import "../ListaProfessores/ListaProfessores.sass"



export default function ListaProfesores() {
    const [dados, setDados] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    const buscarProfessores = () => {

        axios.get("http://localhost:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log(response.data);
            setDados(response.data);
        })
        .catch(error =>{
            setError("Erro ao buscar professores.", error)
        } );
    };

    useEffect(() => {
     buscarProfessores()
      
    }, []);

    return (
        <div>
            {userType === "Gestor" && (
                <>
                    <div className="Lista">
                        <ul>
                            {
                                dados.map((prof, index) => (
                                    <li key={index}>
                                        <div className="informations">
                                            <p><strong>{prof.Nome}</strong> - {prof.Usuario}</p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
