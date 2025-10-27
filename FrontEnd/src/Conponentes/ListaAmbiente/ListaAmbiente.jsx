import { useEffect, useState, useRef } from "react";
import { z } from "zod"

import axios from "axios";
import Modal from "../Modal/Modal"

import "../ListaAmbiente/ListaAmbiente.sass"

const schema = z.object({
  Periodo: z.string().min(1, "O campo 'Periodo' não pode estar vazio"),
  Sala_reservada: z.string().min(1, "O campo 'Sala reservada' não pode estar vazio"),
  Disciplina_professor: z.string().min(1, "O campo 'Disciplina professor' não pode estar vazio"),
});

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

    const [validationErrors,setValidationErrors] = useState({})

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
        setValidationErrors({});
        setModalOpen(true)
        setTimeout(()=> cleanerForm(),100)
    }

    const openEditModal = (ambiente) => {
        setIsEditing(true)
        setValidationErrors({});
        setEditAmbiente(ambiente)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setIsEditing(false)
        setEditAmbiente(null)
    }

    const buscarAmbientes = () => {
        axios.get("http://localhost:8000/reservaAmbiente/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setAmbientes(response.data))
        .catch(error =>{
            setError("Erro ao buscar professores.", error)
        } );
    };

    const buscarDisciplinas = () => {
        axios.get("http://localhost:8000/disciplina/",{
            headers:{Authorization: `Bearer ${token}`}
        })
        .then(response => {console.log("Disciplinas recebidas:", response.data); setDisciplina(response.data)})
        .catch(error => setError("Erro ao buscar disciplinas: ",error))
    }

    const buscarSalas = () => {
        axios.get("http://localhost:8000/sala/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setSalas(response.data))
        .catch(error => console.error("Erro ao buscar salas:", error));
    };

    const buscarProfessores = () => {
        axios.get("http://localhost:8000/professores/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfessores(response.data))
        .catch(error => console.error("Erro ao buscar professores:", error));
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
            }
            return false;
        }
    };
    
    const handleSubmit = () => {
        const formData = {
            Data_inicio: dataInicioRef.current.value,
            Data_termino: dataTerminoRef.current.value,
            Periodo: periodoRef.current.value,
            Sala_reservada: salaReservadaRef.current.value,
            Disciplina_professor: disciplinProfessorref.current.value
        };

        if (!validateForm({
            Periodo: formData.Periodo,
            Sala_reservada: formData.Sala_reservada,
            Disciplina_professor: formData.Disciplina_professor
        })) {
            return; 
        }

        if (isEditing) {
            axios.put(`http://localhost:8000/reservaAmbiente/${editAmbiente.id}`, formData, { 
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                alert("Ambiente atualizado com sucesso!");
                buscarAmbientes();
                closeModal();
            })
            .catch(error => {
                console.error(`Erro ao editar ambiente: `, error);
            });
        } else {
            axios.post("http://localhost:8000/reservaAmbiente/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                closeModal();
                setCreateModal(false);
                buscarAmbientes();
            })  
            .catch(error => {
                setError(error.response?.data?.erro?.[0] || "Erro ao criar ambiente.");  
            });  
        }
    };

    const deletarAmbiente = (id) =>{
        axios.delete(`http://localhost:8000/reservaAmbiente/${id}`,{
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
                if(disciplinProfessorref.current) disciplinProfessorref.current.value = editAmbiente.Disciplina_professor;

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
                                <p >Professor responsável: <strong className="professor-ambiente">{a.professor_nome}</strong></p>
                                <p>Sala reservada: <strong className="professor-ambiente">{a.numero_sala}</strong></p>
                                <p>Data de Inicio: <strong>{a.Data_inicio}</strong></p>
                                <p>Data de término: <strong>{a.Data_termino}</strong></p>
                                <p>Periodo <strong>{a.Periodo}</strong></p>
                                <p>Disciplina: <strong className="professor-ambiente">{a.disciplina_nome}</strong></p>


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
            ariaHideApp={false}
        >
            <h2>{isEditing ? 'Editar Ambiente' : 'Criar Ambiente'}</h2>
            {error && <p className="erro-msg">{error}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <label>Data de início:</label>
                <input type="date" ref={dataInicioRef}  />

                <label>Data de término:</label>
                <input type="date" ref={dataTerminoRef}  />

                <label>Período:</label>
                <select ref={periodoRef}  className={validationErrors.Periodo ? "error" : ""}>
                    <option value="">Selecione</option>
                    <option value="M">Manhã</option>
                    <option value="T">Tarde</option>
                    <option value="N">Noite</option>
                </select>
                {validationErrors.Periodo && <p className="error-message">{validationErrors.Periodo}</p>}

                <label>Sala Reservada:</label>
                <select ref={salaReservadaRef}  className={validationErrors.Sala_reservada ? "error" : ""}>
                    <option value="">Selecione uma sala</option>
                    {salas.map(sala => (
                        <option key={sala.id} value={sala.id}>{sala.numero}</option> 
                    ))}
                </select>
                {validationErrors.Sala_reservada && <p className="error-message">{validationErrors.Sala_reservada}</p>}

                <label>Selecione uma Disciplina:</label>
                <select ref={disciplinProfessorref}  className={validationErrors.Disciplina_professor ? "error" : ""}>
                    <option value="">Selecione uma disciplina</option>
                    {disciplina.map(disciplina => (
                        <option key={disciplina.id} value={disciplina.id}>{disciplina.Nome}</option> 
                    ))}
                </select>
                {validationErrors.Disciplina_professor && <p className="error-message">{validationErrors.Disciplina_professor}</p>}

                <button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Ambiente'}</button>
            </form>
        </Modal>


        </div>
    );
}
