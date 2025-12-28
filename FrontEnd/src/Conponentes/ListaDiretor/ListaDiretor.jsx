import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Plus,Trash,Pen } from "lucide-react";
import axios from "axios";
import Modal from "../Modal/Modal"
import Swal from "sweetalert2";

import "../ListaDiretor/ListaDiretor.sass"

const schema = z.object({
    Nome: z.string().min(3, "O nome deve possuir ao menos 3 letras"),
    Telefone: z.string().max(15, "O numero de telefone deve ter no maximo 15 digitos").min(10, "O telefone deve ter pelo menos 10 dígitos"),
    Data_de_Nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    Data_de_contratacao: z.string().min(1, "Data de contratação é obrigatória"),
    username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    Usuario: z.enum(["Professor", "Gestor"], "Tipo de usuário inválido")
});

export default function ListaDiretor() {
    const token = localStorage.getItem("token");
    const navigation = useNavigate()

    const [professores, setProfessores] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const [editingProfessor, setEditingProfessor] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const nomeRef = useRef();
    const telefoneRef = useRef();
    const dataNascimentoRef = useRef();
    const dataContratacaoRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const usuarioRef = useRef();
    const emailRef = useRef();

    const cleanerForm = () => {

        setTimeout(() => {
            if (nomeRef.current) nomeRef.current.value = '';
            if (telefoneRef.current) telefoneRef.current.value = '';
            if (dataNascimentoRef.current) dataNascimentoRef.current.value = '';
            if (dataContratacaoRef.current) dataContratacaoRef.current.value = '';
            if (usernameRef.current) usernameRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';
            if (usuarioRef.current) usuarioRef.current.value = 'Professor';
        }, 0);

        setValidationErrors({});
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setEditingProfessor(null);
        setModalOpen(true);
        setError(null)
        setTimeout(() => cleanerForm(), 100);
    };

    const openEditModal = (professor) => {
        setIsEditing(true);
        setEditingProfessor(professor);
        setModalOpen(true);
        setError(null)
        setValidationErrors({});
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setEditingProfessor(null);
        setValidationErrors({});
    };

    const searchTeacher = () => {
        axios.get("http://localhost:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setProfessores(response.data))
            .catch(error => {
                setError("Erro ao buscar professores.", error)
                alert("Seu token expirou, clique em 'OK' e volte a tela de Login")
                navigation("/")
            });
    };

    const validateForm = (formData) => {
        try {
            schema.parse(formData);
            setValidationErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = {};
                error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                setValidationErrors(errors);
                return false;
            }
            return false;
        }
    };

    const handleSubmit = async () => {
        const formData = {
            Nome: nomeRef.current.value,
            Telefone: telefoneRef.current.value,
            Data_de_Nascimento: dataNascimentoRef.current.value,
            Data_de_contratacao: dataContratacaoRef.current.value,
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            Usuario: usuarioRef.current.value
        };

        const isValid = validateForm(formData);
        if (!isValid) {
            setError(null)
            return;
        }

        if (isEditing) {
            axios.put(`http://localhost:8000/professores/${editingProfessor.NI}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    searchTeacher();
                    closeModal();

                })
                .catch(error => {
                    console.error("Erro ao editar professor:", error);

                });
        } else {
            axios.post("http://localhost:8000/professores/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    searchTeacher();
                    closeModal();
                })
                .catch(error => {
                    console.error("Erro ao criar professor:", error);
                    setError(Object.values(error.response.data)?.[0]?.[0] || "Erro inesperado");
                });
        }
    };

    const deleteTeacher = (NI) => {
        Swal.fire({
            title: `Tem certeza?`,
            text: "Você não poderá reverter esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!",
            customClass: {
                title: "msg-deletar-titulo msg-deletar",
                text: "msg-deletar"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8000/professores/${NI}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(() => {
                        searchTeacher();
                        Swal.fire("Deletado!", "O professor foi removido com sucesso.", "success");
                    })
                    .catch(error => {
                        console.error("Erro ao deletar professor:", error);
                        Swal.fire("Erro!", "Não foi possível deletar o professor.", "error");
                    });
            }
        });
    };

    useEffect(() => {
        if (isEditing && editingProfessor && modalOpen) {
            setTimeout(() => {
                if (nomeRef.current) nomeRef.current.value = editingProfessor.Nome || '';
                if (telefoneRef.current) telefoneRef.current.value = editingProfessor.Telefone || '';
                if (emailRef.current) emailRef.current.value = editingProfessor.email || '';
                if (dataNascimentoRef.current) dataNascimentoRef.current.value = editingProfessor.Data_de_Nascimento || '';
                if (dataContratacaoRef.current) dataContratacaoRef.current.value = editingProfessor.Data_de_contratacao || '';
                if (usernameRef.current) usernameRef.current.value = editingProfessor.username || '';
                if (passwordRef.current) passwordRef.current.value = '';
                if (usuarioRef.current) usuarioRef.current.value = editingProfessor.Usuario || 'Professor';
            }, 100);
        }
    }, [isEditing, editingProfessor, modalOpen]);

    useEffect(() => {
        searchTeacher();
    }, []);

    return (
        <section className="container-ambiente">
            <div className="top">
                <div className="left">
                    <h1>Funcionários</h1>
                    <p>Gerencie os funcionários e suas informações no sistema</p>
                </div>

                <div className="right">
                    <button onClick={openCreateModal} className='btn-create-ambiente'> <Plus />  <span>Adicionar Funcionário</span></button>
                </div>
            </div>

            <div className="container-table">
                <table className="ambiente-table">
                    <thead>
                        <tr>
                            <th>NI</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Data Nascimento</th>
                            <th>Data Contratação</th>
                            <th>Usuário</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>


                    <tbody>
                        {professores.length > 0 ? (
                            professores.map((a) => (
                                <tr key={a.NI}>
                                    <td>{a.NI}</td>  
                                    <td>{a.Nome}</td>
                                    <td>{a.Telefone}</td>
                                    <td>{a.Data_de_Nascimento}</td>
                                    <td>{a.Data_de_contratacao}</td>
                                    <td>{a.username}</td>
                                    <td>{a.email}</td>
                                    <td>{a.Usuario}</td>
                                    
                                    <td>
                                        <div className="actions">
                                            <button className="edit" onClick={() => openEditModal(a)}> <Pen size={20} /> </button>
                                            <button className="delete" onClick={() => deleteTeacher(a.NI)}> <Trash size={20} /> </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-table">
                                    Nenhum Ambiente Reservado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>



            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                className="custom-modal"
                overlayClassName="custom-overlay"
                ariaHideApp={false}
            >

                <h2>{isEditing ? 'Editar Funcionário' : 'Criar Funcionário'}</h2>
                {error && <p className="erro-msg">{error}</p>}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <label>Nome</label>
                    <input type="text" ref={nomeRef} />

                    <label>Telefone</label>
                    <input type="text" ref={telefoneRef} />

                    <label>Data de nascimento</label>
                    <input
                        type="date"
                        ref={dataNascimentoRef}
                        className={`campo-texto ${validationErrors.Data_de_Nascimento ? 'error' : ''}`}
                    />

                    {validationErrors.Data_de_Nascimento && <p className="error-message">{validationErrors.Data_de_Nascimento}</p>}

                    <label>Data de contratação:</label>
                    <input
                        type="date"
                        ref={dataContratacaoRef}
                        className={`campo-texto ${validationErrors.Data_de_contratacao ? 'error' : ''}`}
                    />
                    {validationErrors.Data_de_contratacao && <p className="error-message">{validationErrors.Data_de_contratacao}</p>}

                    <label>Usuário:</label>
                    <input
                        type="text"
                        ref={usernameRef}
                        placeholder="Digite aqui"
                        className={`campo-texto ${validationErrors.username ? 'error' : ''}`}
                    />

                    {validationErrors.username && <p className="error-message">{validationErrors.username}</p>}


                    <label htmlFor="">Email</label>
                    <input
                        type="email"
                        ref={emailRef}
                        placeholder="Digite aqui"
                        className={`campo-texto ${validationErrors.email ? 'error' : ''}`}
                    />

                    <label >Senha</label>
                    <input
                        type="password"
                        ref={passwordRef}
                        placeholder="********"
                        className={`campo-texto ${validationErrors.password ? 'error' : ''}`}
                    />
                    <label htmlFor="">Tipo</label>
                    <select
                        ref={usuarioRef}
                        className={`campo-texto ${validationErrors.Usuario ? 'error' : ''}`}
                    >
                        <option value="Professor">Professor</option>
                        <option value="Gestor">Gestor</option>
                    </select>
                    {validationErrors.Usuario && <span className="error-message">{validationErrors.Usuario}</span>}


                    <div className="btns">
                        <button onClick={closeModal} className="btn-cancalar" >Cancelar</button>
                        <button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Ambiente'}</button>
                    </div>
                </form>
            </Modal>


        </section>
    )
}