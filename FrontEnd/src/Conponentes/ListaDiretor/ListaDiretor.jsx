import { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

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
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfessor, setEditingProfessor] = useState(null);
    const [message, setMessage] = useState(null);
    
    // Estado para armazenar erros de validação
    const [validationErrors, setValidationErrors] = useState({});

    const nomeRef = useRef();
    const telefoneRef = useRef();
    const dataNascimentoRef = useRef();
    const dataContratacaoRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const usuarioRef = useRef();

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
        
        // Limpar erros de validação
        setValidationErrors({});
    };
  
    const openCreateModal = () => {
        setIsEditing(false);
        setEditingProfessor(null);
        setModalOpen(true);
        setTimeout(() => cleanerForm(), 100);
    };

    const openEditModal = (professor) => {
        setIsEditing(true);
        setEditingProfessor(professor);
        setModalOpen(true);
        setValidationErrors({});
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setEditingProfessor(null);
        setValidationErrors({});
    };

    const searchTeacher = () => {
        axios.get("http://127.0.0.1:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfessores(response.data))
        .catch(error =>{
            setError("Erro ao buscar professores.", error)
            alert("Seu token expirou, clique em 'OK' e volte a tela de Login")
            navigation("/")
        } );
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
            password: passwordRef.current.value,
            Usuario: usuarioRef.current.value
        };


        if (isEditing) {
            axios.put(`http://127.0.0.1:8000/professores/${editingProfessor.NI}`, formData, {
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
            axios.post("http://127.0.0.1:8000/professores/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                searchTeacher();
                closeModal();
            })
            .catch(error => {
                console.error("Erro ao criar professor:", error);
            });
        }
    };

    const deleteTeacher = (NI) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:8000/professores/${NI}`, {
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
                if (dataNascimentoRef.current) dataNascimentoRef.current.value = editingProfessor.Data_de_Nascimento || '';
                if (dataContratacaoRef.current) dataContratacaoRef.current.value = editingProfessor.Data_de_contratacao || '';
                if (usernameRef.current) usernameRef.current.value = editingProfessor.username || '';
                if (passwordRef.current) passwordRef.current.value = editingProfessor.password || '';
                if (usuarioRef.current) usuarioRef.current.value = editingProfessor.Usuario || 'Professor';
            }, 100);
        }
    }, [isEditing, editingProfessor, modalOpen]);

    useEffect(() => {
        searchTeacher();
    }, []);

    return (
        <div className="container-diretor">
            <h1>Lista de Funcionários</h1>
            <button onClick={openCreateModal} className="btn-create">NOVO FUNCIONÁRIO</button>
            
            <ul>
                {professores.length > 0 ? (
                    professores.map(prof => (
                        <li key={prof.NI}>
                            <div className="informations">
                                <div>
                                    <p><strong className="Nome-professor-label">{prof.Nome}</strong> - {prof.Usuario}</p>
                                </div>
                                
                                <div className="btns">
                                    <button onClick={() => deleteTeacher(prof.NI)} className="btn">
                                        <img src="../public/lixeira-de-reciclagem.png" alt="deletar" className="icon"/>
                                    </button>
                                    <button onClick={() => openEditModal(prof)} className="btn">
                                        <img src="../public/lapis.png" alt="editar" className="icon"/>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Você não possui permissão para entrar</p>
                )}
            </ul>

            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                className="custom-modal" 
                overlayClassName="custom-overlay" 
                ariaHideApp={false}
            >
                <h2>{isEditing ? 'Editar Professor/Gestor' : 'Criar Professor/Gestor'}</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <label>Nome:
                        <input 
                            type="text" 
                            ref={nomeRef}  
                            placeholder="Digite aqui"
                            className={`campo-texto ${validationErrors.Nome ? 'error' : ''}`}
                        />
                        {validationErrors.Nome && <span className="error-message">{validationErrors.Nome}</span>}
                    </label>

                    <label>Telefone:
                        <input 
                            type="text" 
                            ref={telefoneRef} 
                            placeholder="(XX) XXXX-XXXX" 
                            className={`campo-texto ${validationErrors.Telefone ? 'error' : ''}`}
                        />
                        {validationErrors.Telefone && <span className="error-message">{validationErrors.Telefone}</span>}
                    </label>

                    <label>Data de nascimento:
                        <input 
                            type="date" 
                            ref={dataNascimentoRef}  
                            className={`campo-texto ${validationErrors.Data_de_Nascimento ? 'error' : ''}`}
                        />
                        {validationErrors.Data_de_Nascimento && <span className="error-message">{validationErrors.Data_de_Nascimento}</span>}
                    </label>
                    
                    <label>Data de contratação:
                        <input 
                            type="date" 
                            ref={dataContratacaoRef}  
                            className={`campo-texto ${validationErrors.Data_de_contratacao ? 'error' : ''}`}
                        />
                        {validationErrors.Data_de_contratacao && <span className="error-message">{validationErrors.Data_de_contratacao}</span>}
                    </label>

                    <label>Usuário:
                        <input 
                            type="text" 
                            ref={usernameRef}  
                            placeholder="Digite aqui" 
                            className={`campo-texto ${validationErrors.username ? 'error' : ''}`}
                        />
                        {validationErrors.username && <span className="error-message">{validationErrors.username}</span>}
                    </label>

                    <label>Senha:
                        <input 
                            type="password" 
                            ref={passwordRef}  
                            placeholder="Digite aqui" 
                            className={`campo-texto ${validationErrors.password ? 'error' : ''}`}
                        />
                        {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
                    </label>

                    <label>Tipo:</label>
                    <select 
                        ref={usuarioRef} 
                        className={`campo-texto ${validationErrors.Usuario ? 'error' : ''}`}
                    >
                        <option value="Professor">Professor</option>
                        <option value="Gestor">Gestor</option>
                    </select>
                    {validationErrors.Usuario && <span className="error-message">{validationErrors.Usuario}</span>}
                    
                    <div className="modal-buttons">
                        <button type="submit" className="btn-create">
                            {isEditing ? 'Salvar Alterações' : 'Criar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}