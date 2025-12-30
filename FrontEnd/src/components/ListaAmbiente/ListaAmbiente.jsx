import { useEffect, useState, useRef } from "react";
import { z } from "zod"
import axios from "axios";
import Modal from "../Modal/Modal"
import { Pen, Trash, Plus } from "lucide-react"
import Swal from "sweetalert2";

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
    const [disciplina, setDisciplina] = useState([])
    const [professores, setProfessores] = useState([]);

    const [isEditing, setIsEditing] = useState(false)
    const [editAmbiente, setEditAmbiente] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpenSalas, setModalOpenSalas] = useState(false);

    const [isEditingSala, setIsEditingSala] = useState(false);
    const [salaEmEdicao, setSalaEmEdicao] = useState(null);

    const [createModal, setCreateModal] = useState(false);

    const [error, setError] = useState(null);

    const [validationErrors, setValidationErrors] = useState({})

    const dataInicioRef = useRef();
    const dataTerminoRef = useRef();
    const periodoRef = useRef();
    const salaReservadaRef = useRef();
    const professorResponsavelRef = useRef();
    const disciplinProfessorref = useRef()
    const numeroRef = useRef();

    const cleanerForm = () => {
        setTimeout(() => {
            if (dataInicioRef.current) dataInicioRef.current.value = ''
            if (dataTerminoRef.current) dataTerminoRef.current.value = ''
            if (periodoRef.current) periodoRef.current.value = ''
            if (salaReservadaRef.current) salaReservadaRef.current.value = ''
            if (professorResponsavelRef.current) professorResponsavelRef.current.value = ''
            if (disciplinProfessorref.current) disciplinProfessorref.current.value = ''
        }, 0);
    }

    const openCreateModal = () => {
        setIsEditing(false)
        setEditAmbiente(false)
        setValidationErrors({});
        setModalOpen(true)
        setTimeout(() => cleanerForm(), 100)
    }
    const openEditModalSalas = (sala) => {
        setIsEditingSala(true);
        setSalaEmEdicao(sala);
        setModalOpenSalas(true);
    };

    const openEditModal = (ambiente) => {
        setIsEditing(true)
        setValidationErrors({});
        setEditAmbiente(ambiente)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false);
        setModalOpenSalas(false);
        setIsEditingSala(false);
        setSalaEmEdicao(null);
    };

    const buscarAmbientes = () => {
        axios.get("http://localhost:8000/reservaAmbiente/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => { setAmbientes(response.data); console.log("Reservas: ", response.data) })
            .catch(error => {
                setError("Erro ao buscar professores.", error)
            });
    };

    const buscarDisciplinas = () => {
        axios.get("http://localhost:8000/disciplina/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => { console.log("Disciplinas recebidas:", response.data); setDisciplina(response.data) })
            .catch(error => setError("Erro ao buscar disciplinas: ", error))
    }

    const buscarSalas = () => {
        axios.get("http://localhost:8000/salas/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => { setSalas(response.data); })
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
            axios.patch(
                `http://localhost:8000/reservaAmbiente/${editAmbiente.id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
                .then(() => {
                    alert("Ambiente atualizado com sucesso!");
                    buscarAmbientes();
                    closeModal();
                })
                .catch(error => {
                    console.error("Erro ao editar ambiente:", error);
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

    const deletarAmbiente = (id) => {
        axios.delete(`http://localhost:8000/reservaAmbiente/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(`Ambiente ${id} deletado com sucesso`)
                buscarAmbientes()
            })
            .catch(error => {
                console.error(`Erro ao deletar ambiente ${id} `, error)
            })
    }

    const handleSubmitSalas = () => {
        const formData = {
            numero: numeroRef.current.value
        };

        if (isEditingSala && salaEmEdicao) {
            axios.put(`http://localhost:8000/sala/${salaEmEdicao.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    buscarSalas();
                    closeModal();
                })
                .catch(error => {
                    console.error("Erro ao editar sala:", error);
                });

        } else {
            axios.post("http://localhost:8000/sala/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    buscarSalas();
                    closeModal();
                })
                .catch(error => {
                    console.error("Erro ao criar sala:", error);
                });
        }
    };



    const deletarSala = (id) => {
        Swal.fire({
            title: `Tem certeza que deseja deletar a sala ${id}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!",
            customClass: {
                title: "msg-deletar-titulo msg-deletar",
            }
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`http://localhost:8000/sala/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response => {
                    buscarSalas()
                }).catch(error => {
                    console.error("Erro ao deletar sala:", error);
                });
            }
        })

    };

    useEffect(() => {
        buscarAmbientes();
        buscarSalas();
        buscarProfessores();
        buscarDisciplinas();

        if (isEditing && editAmbiente && modalOpen) {
            setTimeout(() => {
                if (dataInicioRef.current) dataInicioRef.current.value = editAmbiente.Data_inicio
                if (dataTerminoRef.current) dataTerminoRef.current.value = editAmbiente.Data_termino
                if (periodoRef.current) periodoRef.current.value = editAmbiente.Periodo
                if (salaReservadaRef.current) salaReservadaRef.current.value = editAmbiente.Sala_reservada
                if (professorResponsavelRef.current) professorResponsavelRef.current.value = editAmbiente.Professor_responsavel
                if (disciplinProfessorref.current) disciplinProfessorref.current.value = editAmbiente.Disciplina_professor;
                if (isEditingSala && salaEmEdicao && numeroRef.current)  numeroRef.current.value = salaEmEdicao.numero;
            })
        }
    }, [isEditing, editAmbiente, modalOpen,salaEmEdicao]);

    return (
        <section className="container-ambiente">
            <div className="top">
                <div className="left">
                    <h1>Reservas de Ambientes</h1>
                    <p>Gerencie as reservas de salas e laboratórios</p>
                </div>

                <div className="right">
                    <button onClick={openCreateModal} className='btn-create-ambiente'> <Plus />  <span>Reservar</span></button>
                </div>
            </div>

            <div className="container-table">
                <table className="ambiente-table">
                    <thead>
                        <tr>
                            <th>Sala</th>
                            <th>Data Início</th>
                            <th>Data Término</th>
                            <th>Período</th>
                            <th>Professor</th>
                            <th>Disciplina</th>
                            <th>Ações</th>
                        </tr>
                    </thead>


                    <tbody>
                        {ambientes.length > 0 ? (
                            ambientes.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.numero_sala}</td>
                                    <td>{a.Data_inicio}</td>
                                    <td>{a.Data_termino}</td>
                                    <td>
                                        <span className={`badge ${a.Periodo === 'M'
                                            ? 'badge-manha'
                                            : a.Periodo === 'T'
                                                ? 'badge-tarde'
                                                : 'badge-noite'
                                            }`}>
                                            {a.Periodo === 'M' ? 'Manhã' : a.Periodo === 'T' ? 'Tarde' : 'Noite'}
                                        </span>
                                    </td>
                                    <td>{a.professor_nome}</td>
                                    <td>{a.disciplina_nome}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="edit" onClick={() => openEditModal(a)}> <Pen size={20} /> </button>
                                            <button className="delete" onClick={() => deletarAmbiente(a.id)}> <Trash size={20} /> </button>
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

            {userType == "Gestor" && (

                <div className="table-salas">
                    <div className="header-salas">
                        <h1>Salas do sistema</h1>
                        <Plus onClick={() => setModalOpenSalas(true)} />
                    </div>
                    <div className="container-table-salas">
                        <table className="ambiente-table">
                            <thead>
                                <tr>
                                    <th>Salas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody >
                                {salas.length > 0 ? (
                                    salas.map((sala) => (
                                        <tr key={sala.id}>
                                            <td>{sala.numero}</td>
                                            <td className="actions">
                                                <Pen size={20} className="btn-create-sala" onClick={() => openEditModalSalas(sala)} />
                                                <Trash size={20} color="red" onClick={() => deletarSala(sala.id)} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="empty-table">
                                            Nenhum Sala Criada
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}

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
                    <input type="date" ref={dataInicioRef} />

                    <label>Data de término:</label>
                    <input type="date" ref={dataTerminoRef} />

                    <label>Período:</label>
                    <select ref={periodoRef} className={validationErrors.Periodo ? "error" : ""}>
                        <option value="">Selecione</option>
                        <option value="M">Manhã</option>
                        <option value="T">Tarde</option>
                        <option value="N">Noite</option>
                    </select>
                    {validationErrors.Periodo && <p className="error-message">{validationErrors.Periodo}</p>}

                    <label>Sala Reservada:</label>
                    <select ref={salaReservadaRef} className={validationErrors.Sala_reservada ? "error" : ""}>
                        <option value="" className="option">Selecione uma sala</option>
                        {salas.map(sala => (
                            <option key={sala.id} value={sala.id}>{sala.numero}</option>
                        ))}
                    </select>
                    {validationErrors.Sala_reservada && <p className="error-message">{validationErrors.Sala_reservada}</p>}

                    <label>Selecione uma Disciplina:</label>
                    <select ref={disciplinProfessorref} className={validationErrors.Disciplina_professor ? "error" : ""}>
                        <option value="">Selecione uma disciplina</option>
                        {disciplina.map(disciplina => (
                            <option key={disciplina.id} value={disciplina.id}>{disciplina.Nome}</option>
                        ))}
                    </select>
                    {validationErrors.Disciplina_professor && <p className="error-message">{validationErrors.Disciplina_professor}</p>}

                    <div className="btns">
                        <button onClick={closeModal} className="btn-cancalar" >Cancelar</button>
                        <button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Ambiente'}</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={modalOpenSalas}
                onClose={closeModal}
                className="custom-modal"
                overlayClassName="custom-overlay"
            >

                <h2>{isEditingSala ? 'Editar Sala' : 'Criar Sala'}</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmitSalas(); }}>

                    <label>Numero Da Sala:
                        <input type="number" ref={numeroRef} placeholder="Digite aqui" />
                    </label>


                    <div className="btns">

                        <button
                            type="button"
                            className="btn-cancalar"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-create">
                            {isEditingSala ? 'Salvar Alterações' : 'Criar'}
                        </button>


                    </div>

                </form>
            </Modal>

        </section>
    );
}
