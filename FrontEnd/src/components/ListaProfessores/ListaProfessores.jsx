import { useEffect, useState } from "react";
import axios from "axios";
import "../ListaProfessores/ListaProfessores.sass"
import { Plus, Pen, Trash } from "lucide-react";


export default function ListaProfesores() {
    const [dados, setDados] = useState([]);
    const [abrirModal, setAbrirModal] = useState(false);
    const [professorLogado, setProfessorLogado] = useState(null);
    const [disciplina, setDisciplina] = useState([]);
    const [error, setError] = useState(null);;
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    const buscarProfessores = () => {

        axios.get("http://localhost:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log("SetDados: ", response.data);
                setDados(response.data);
            })
            .catch(error => {
                setError("Erro ao buscar professores.", error)
            });
    };

    const buscarProfessorLogado = () => {
        axios.get("http://localhost:8000/professores/me/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setProfessorLogado(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar professor logado", error);
            });
    };


    const buscarDisciplina = () => {
        axios.get(`http://localhost:8000/disciplina/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setDisciplina(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar sala:", error)
            })
    }

    useEffect(() => {
        if (userType === "Gestor") {
            buscarProfessores();
            buscarDisciplina();
        } else if (userType === "Professor") {
            buscarProfessorLogado();
        }
    }, []);


    return (
        <section className="container-ambiente">
            <div className="top">
                <div className="left">
                    <h1>Professores</h1>
                    <p>Gerencie os professores cadastrados no sistema</p>
                </div>


            </div>

            <div className="container-table">
                <table className="ambiente-table">
                    <thead>
                        {userType == "Gestor" ? (
                            <tr>
                                <th>NI</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Data de contratação</th>
                                <th>Usuario</th>
                                <th>Disciplinas</th>
                            </tr>

                        ) : (
                            <tr>
                                <th>NI</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Data de contratação</th>
                                <th>Usuario</th>
                                <th>Disciplinas</th>
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {userType === "Gestor" &&
                            dados.map((prof) => (
                                <tr key={prof.NI}>
                                    <td>{prof.NI}</td>
                                    <td>{prof.Nome}</td>
                                    <td>{prof.email}</td>
                                    <td>{prof.Telefone}</td>
                                    <td>{prof.Data_de_contratacao}</td>
                                    <td>{prof.username}</td>
                                    <td className="disciplina-td">
                                        {prof.disciplinas.length > 0
                                            ? prof.disciplinas.map(d => d.Nome).join(", ")
                                            : "Sem disciplinas"}
                                    </td>
                                </tr>
                            ))
                        }
                        {userType === "Professor" && professorLogado && (
                            <tr>
                                <td>{professorLogado.NI}</td>
                                <td>{professorLogado.Nome}</td>
                                <td>{professorLogado.email}</td>
                                <td>{professorLogado.Telefone}</td>
                                <td>{professorLogado.Data_de_contratacao}</td>
                                <td>{professorLogado.username}</td>
                                <td className="disciplina-td">
                                    {professorLogado.disciplinas.length > 0
                                        ? professorLogado.disciplinas.map(d => d.Nome).join(", ")
                                        : "Sem disciplinas"}
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </div>
        </section>


    );
}
