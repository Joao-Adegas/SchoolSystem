import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../ListaDiretor/ListaDiretor.sass"
import Modal from "../Modal/Modal"

        

export default function ListaDiretor() {
   
    const token = localStorage.getItem("token");
  
    const [professores, setProfessores] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProfessor, setEditingProfessor] = useState(null);
    const [message, setMessage] = useState(null);

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
    };

  
    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setEditingProfessor(null);

    };

    const searchTeacher = () => {
        axios.get("http://127.0.0.1:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfessores(response.data))
        .catch(error => setError("Erro ao buscar professores.", error));
    };


    const handleSubmit = () => {
        
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
                setMessage({ type: 'error', text: 'Erro ao editar professor.' });
            });
        } else {
       
            axios.post("http://127.0.0.1:8000/professores/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                searchTeacher();
                closeModal();
                setMessage({ type: 'success', text: 'Professor criado com sucesso!' });
            })
            .catch(error => {
                console.error("Erro ao criar professor:", error);
                setMessage({ type: 'error', text: 'Erro ao criar professor.' });
            });
        }
    };

    const deleteTeacher = (NI) => {
        if (window.confirm('Tem certeza que deseja deletar este professor?')) {
            axios.delete(`http://127.0.0.1:8000/professores/${NI}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                searchTeacher();
                setMessage({ type: 'success', text: 'Professor deletado com sucesso!' });
            })
            .catch(error => {
                console.error("Erro ao deletar professor:", error);
                setMessage({ type: 'error', text: 'Erro ao deletar professor.' });
            });
        }
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
                                <p><strong>Nome: </strong>{prof.Nome} - {prof.Usuario}</p>
                                <div className="btns">
                                    <button onClick={() => deleteTeacher(prof.NI)} className="btn">
                                        <img src="../public/lixeira-de-reciclagem.png" alt="deletar" srcSet="" className="icon"/>
                                    </button>
                                    <button onClick={() => openEditModal(prof)} className="btn">
                                        <img src="../public/lapis.png" alt="deletar" srcSet="" className="icon"/>
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
                        <input type="text" ref={nomeRef} required placeholder="Digite aqui"className="campo-texto"/>
                    </label>

                    <label>Telefone:
                        <input type="text" ref={telefoneRef} required placeholder="Digite aqui" className="campo-texto"/>
                    </label>

                    <label>Data de nascimento:
                        <input type="date" ref={dataNascimentoRef} required placeholder="Digite aqui" className="campo-texto"/>
                    </label>
                    
                    <label>Data de contratação:
                        <input type="date" ref={dataContratacaoRef} required placeholder="Digite aqui" className="campo-texto"/>
                    </label>

                    <label>Usuário:
                        <input type="text" ref={usernameRef} required placeholder="Digite aqui" className="campo-texto"/>
                    </label>

                    <label>Senha:
                        <input type="password" ref={passwordRef} required placeholder="Digite aqui" className="campo-texto"/>
                    </label>

                    <label>Tipo:</label>
                    <select ref={usuarioRef} required className="campo-texto">
                        <option value="Professor">Professor</option>
                        <option value="Gestor">Gestor</option>
                    </select>
                    
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