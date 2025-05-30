import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "../Modal/Modal"
import "../ListaAmbiente/ListaAmbiente.sass"

export default function ListaAmbiente() {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    const [ambientes, setAmbientes] = useState([]);
    const [salas, setSalas] = useState([]);
    const [disciplina,setDisciplina] = useState([])
    const [professores, setProfessores] = useState([]);
    const [isEditing,setIsEditing] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [createModal, setCreateModal] = useState(false);
    const [editAmbiente,setEditAmbiente] = useState(null)
    const [error, setError] = useState(null);

    const dataInicioRef = useRef();
    const dataTerminoRef = useRef();
    const periodoRef = useRef();
    const salaReservadaRef = useRef();
    const professorResponsavelRef = useRef();
    const disciplinProfessorref = useRef()

    const cleanerForm = () => {
        setTimeout(() => {
            if(dataInicioRef.current) dataInicioRef.current.value = ''
            if(dataTerminoRef.current) dataTerminoRef.current.value = ''
            if(periodoRef.current) periodoRef.current.value=''
            if(salaReservadaRef.current)salaReservadaRef.current.value = ''
            if(professorResponsavelRef.current)professorResponsavelRef.current.value = ''
            if(disciplinProfessorref.current)disciplinProfessorref.current.value =''
        }, 0);
    }

    const openCreateModal = () => {
        setIsEditing(false)
        setEditAmbiente(false)
        setModalOpen(true)
        setTimeout(()=> cleanerForm(),100)
    }

    
    const openEditModal = (ambiente) => {
        setIsEditing(true)
        setEditAmbiente(ambiente)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setIsEditing(false)
        setEditAmbiente(null)
    }

    const buscarAmbientes = () => {
        axios.get("http://127.0.0.1:8000/reservaAmbiente/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setAmbientes(response.data))
        .catch(error =>{
            setError("Erro ao buscar professores.", error)
            alert("Seu token expirou, clique em 'OK' e volte a tela de Login")
            navigation("/")
        } );
    };

    const buscarDisciplinas = () => {
        axios.get("http://127.0.0.1:8000/disciplina/",{
            headers:{Authorization: `Bearer ${token}`}
        })
        .then(response => {console.log("Disciplinas recebidas:", response.data); setDisciplina(response.data)})
        .catch(error => setError("Erro ao buscar disciplinas: ",error))
    }

    const buscarSalas = () => {
        axios.get("http://127.0.0.1:8000/sala/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setSalas(response.data))
        .catch(error => console.error("Erro ao buscar salas:", error));
    };

    const buscarProfessores = () => {
        axios.get("http://127.0.0.1:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfessores(response.data))
        .catch(error => console.error("Erro ao buscar professores:", error));
    };
    
    const handleSubmit = () => {
    
        const formData = {
            Data_inicio: dataInicioRef.current.value,
            Data_termino: dataTerminoRef.current.value,
            Periodo: periodoRef.current.value,
            Sala_reservada: salaReservadaRef.current.value,
            Professor_responsavel: professorResponsavelRef.current.value ,
            Disciplina_professor:disciplinProfessorref.current.value
        };

        if(isEditing){
            axios.put(`http://127.0.0.1:8000/reservaAmbiente/${editAmbiente.id}`, formData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(() => {
                alert("Ambiente atualizado com sucesso!");
                buscarAmbientes();
                setEditAmbiente(null); 
            })
            .catch(error => {
                console.error(`Erro ao editar ambiente: `, error);
            });
        }
        else{

            axios.post("http://127.0.0.1:8000/reservaAmbiente/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                closeModal()
                setCreateModal(false);
                buscarAmbientes();
            })
            .then(response => response.json())  
            .then(data => console.log(data))  
            .catch(error => {
                setError(error.response.data.erro[0])  
            })  
        }

    };

    const deletarAmbiente = (id) =>{
        axios.delete(`http://127.0.0.1:8000/reservaAmbiente/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response =>{
            console.log(`Ambiente ${id} deletado com sucesso`)
            buscarAmbientes()
        })
        .catch(error => {
            console.error(`Erro ao deletar ambiente ${id} `,error)
        })
    }

    useEffect(() => {
        buscarAmbientes();
        buscarSalas();
        buscarProfessores();
        buscarDisciplinas();

        if(isEditing && editAmbiente && modalOpen){
            setTimeout(()=>{
                if(dataInicioRef.current) dataInicioRef.current.value = editAmbiente.Data_inicio
                if(dataTerminoRef.current) dataTerminoRef.current.value = editAmbiente.Data_termino
                if(periodoRef.current) periodoRef.current.value=editAmbiente.Periodo
                if(salaReservadaRef.current)salaReservadaRef.current.value = editAmbiente.Sala_reservada
                if(professorResponsavelRef.current)professorResponsavelRef.current.value = editAmbiente.Professor_responsavel
                if(disciplinProfessorref.current)disciplinProfessorref.current.value =editAmbiente.Disciplina_professor
            })
        }
    }, [isEditing,editAmbiente,modalOpen]);

    return (
        <div className="container-ambiente">
            <h1>Lista de Ambientes</h1>

            {userType === "Gestor" && (
                <>
                    <button onClick={openCreateModal} className="btn-create-ambiente">Criar Ambiente</button>
                </>
            )}

            <ul className="container-informatios">
                {ambientes.length > 0 ? (
                    ambientes.map((a) => (
                        <li key={a.id}>
                            <div className="informations-ambiente">
                                <p>Sala reservada: <strong>{a.numero_sala}</strong></p>
                                <hr />
                                <p>Data de Inicio: <strong>{a.Data_inicio}</strong></p>
                                <p>Data de término: <strong>{a.Data_termino}</strong></p>
                                <p>Periodo <strong>{a.Periodo}</strong></p>
                                <p>Professor responsável: <strong>{a.professor_nome}</strong></p>


                                    {userType === "Gestor" && (
                                        <div className="btn-buscarAmbientes">
                                            <div className="btns-ambiente">
                                                <button onClick={() => deletarAmbiente(a.id)} className="btn-ambiente">
                                                    <img src="../public/lixeira-de-reciclagem.png" alt="" srcSet="" className="icon"/>
                                                </button>

                                                <button onClick={() => openEditModal(a)} className="btn-ambiente">
                                                    <img src="../public/lapis.png" alt="" srcSet="" className="icon"/>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                            </div>
                        </li>
                    ))
                ) : (
                    <p>Não possui Ambientes cadastrados</p>
                )}
            </ul>

            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                className="custom-modal" 
                overlayClassName="custom-overlay" 
                ariaHideApp={   false}
            >
                <h2>{isEditing ? 'Editar Ambiente' : 'Criar Ambiente'}</h2>
                {error && <p className="erro-msg">{error}</p>}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <label>Data de início:</label>
                        <input type="date" ref={dataInicioRef} required />

                        <label>Data de término:</label>
                        <input type="date" ref={dataTerminoRef} required />

                        <label>Período:</label>
                        <select ref={periodoRef} required>
                            <option value="M">Manhã</option>
                            <option value="T">Tarde</option>
                            <option value="N">Noite</option>
                        </select>

                        <label>Sala Reservada:</label>
                        <select ref={salaReservadaRef} required>
                            <option value="">Selecione uma sala</option>
                            {salas.map(sala => (
                                <option key={sala.id} value={sala.id}>{sala.numero}</option> 
                            ))}
                        </select>

                        
                        <label>Professor Responsável:
                            <select ref={professorResponsavelRef} required>
                                <option value="">Selecione um professor</option>
                                {professores.map(professor => (
                                    <option key={professor.NI} value={professor.NI}>{professor.Nome}</option> 
                                ))}

                            </select>
                        </label>

                        <label>Selecione uma Disciplina
                            <select ref={disciplinProfessorref} required>
                                <option value="">Selecione uma Disciplina</option>
                                {disciplina.map(disciplina => (
                                    <option key={disciplina.id} value={disciplina.id}>{disciplina.Nome}</option> 
                                ))}
                            </select>
                        </label>
                   <button type="submit">{isEditing? 'Salvar Alterações':'Criar Ambiente'}</button>
                </form>
            </Modal>

        </div>
    );
}
