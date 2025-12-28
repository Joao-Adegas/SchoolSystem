import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Modal from "../Modal/Modal"
import "../ListaDisciplinas/ListaDisciplinas.sass"
import { Plus } from 'lucide-react'
import { Pen, Trash } from 'lucide-react'

export default function ListaDisciplinas() {

    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("user_type");
    const nome = localStorage.getItem("nome")

    const [disciplina, setDisciplina] = useState([])
    const [professores, setProfessores] = useState([])
    const [createModal, setCreateModal] = useState(false)
    const [isEditing, setIsEditing] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModal, setEditModal] = useState(null)
    const [editDisciplina, setEditDisciplina] = useState(null)

    const NomeRef = useRef()
    const CursoRef = useRef()
    const Carga_HorariaRef = useRef()
    const DescricaoRef = useRef()
    const Professor_responsavelRef = useRef()

    const cleanerForm = () => {
        setTimeout(() => {
            if (NomeRef.current) NomeRef.current.value = ''
            if (CursoRef.current) NomeRef.current.value = ''
            if (Carga_HorariaRef.current) Carga_HorariaRef.current.value = ''
            if (DescricaoRef.current) DescricaoRef.current.value = ''
            if (Professor_responsavelRef.current) Professor_responsavelRef.current.value = ''
        }, 0);
    }

    const openCreateModal = () => {
        setIsEditing(false)
        setEditDisciplina(null)
        setModalOpen(true)
        setTimeout(() => cleanerForm(), 100)
    }


    const openEditModal = (disciplina) => {
        setIsEditing(true)
        setEditDisciplina(disciplina)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setIsEditing(false)
        setEditDisciplina(null)
    }

    const buscarDisciplina = () => {
        axios.get(`http://localhost:8000/disciplina/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data)
                setDisciplina(response.data)
            })
            .catch(error => {
                console.error("Erro ao buscar sala:", error)
            })
    }

    const listarProfessores = () => {
        axios.get("http://localhost:8000/professores/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Professores:", response.data)
                setProfessores(response.data)
            })
    }

    const handleSubmit = () => {

        const formData = {
            Nome: NomeRef.current.value,
            Curso: CursoRef.current.value,
            Carga_Horaria: Carga_HorariaRef.current.value,
            Descricao: DescricaoRef.current.value,
            Professor_responsavel: Professor_responsavelRef.current.value
        }

        if (isEditing) {
            axios.put(`http://localhost:8000/disciplina/${editDisciplina.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    buscarDisciplina()
                    closeModal()
                })
                .catch(error => {
                    console.log(`Erro ao editar a disciplina `, error)
                })
        }
        else {

            axios.post("http://localhost:8000/disciplina/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log("Dados enviados:", response.data.results)
                    buscarDisciplina()
                    closeModal()
                })
                .catch(error => {
                    console.log("Erro ao criar Disciplina: ", error)
                })
        }

    }

    const deletarDisciplina = (id) => {
        axios.delete(`http://localhost:8000/disciplina/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(`A disciplina ${id} foi deletada com sucesso`)
                buscarDisciplina()
            })
            .catch(error => {
                console.error("erro ao deletar uma disciplina :", error)
            })
    }

    useEffect(() => {
        buscarDisciplina()
        listarProfessores()

        if (isEditing && editDisciplina && modalOpen) {
            setTimeout(() => {
                if (NomeRef.current) NomeRef.current.value = editDisciplina.Nome
                if (CursoRef.current) CursoRef.current.value = editDisciplina.Curso
                if (Carga_HorariaRef.current) Carga_HorariaRef.current.value = editDisciplina.Carga_Horaria
                if (DescricaoRef.current) DescricaoRef.current.value = editDisciplina.Descricao
                if (Professor_responsavelRef.current) Professor_responsavelRef.current.value = editDisciplina.Professor_responsavel
            })
        }
    }, [isEditing, editDisciplina, modalOpen])

    return (
        <section className="container-ambiente">
            <div className="top">
                <div className="left">
                    <h1>Disciplinas</h1>
                    <p>Gerencie todas as disciplinas cadastradas no sistema</p>

                </div>

                <div className="right">
                    {userType === "Gestor" && (
                        <>
                            <button onClick={openCreateModal} className='btn-create-ambiente'> <Plus />  <span>Criar Disciplina</span></button>
                        </>
                    )}
                </div>
            </div>

            <div className="container-table">
                <table className="ambiente-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Curso</th>
                            <th>Carga Horária</th>
                            <th>Professor</th>
                            {userType === "Gestor" && <th>Ações</th>}
                        </tr>
                    </thead>


                    <tbody>
                        {disciplina.length > 0 ? (
                            disciplina.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.Nome}</td>
                                    <td>{a.Curso}</td>
                                    <td>{a.Carga_Horaria}</td>
                                    <td>{a.professor_nome}</td>

                                    {userType === "Gestor" && (
                                        <td className="actions">
                                            <button
                                                className="btn-icon edit"
                                                onClick={() => openEditModal(a)}
                                            >
                                                <Pen size={20} />

                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => deletarDisciplina(a.id)}
                                            >
                                                <Trash size={20} />
                                            </button>

                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-table">
                                    {nome} não possui disciplinas cadastradas
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
                <h2>{isEditing ? 'Editar Disciplina' : 'Criar Disciplina'}</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <p>Nome da disciplina:</p>
                    <input type="text" ref={NomeRef} placeholder='Digite aqui' required />
                    <p>Curso:</p>
                    <input type="text" placeholder='Digite aqui' ref={CursoRef} required />
                    <p>Carga Horaria:</p>
                    <input type="text" placeholder='Digite aqui' ref={Carga_HorariaRef} required/>
                    <p>Descrição:</p>
                    <textarea ref={DescricaoRef} rows={5} cols={50} />
                    <p>Professor responsável:</p>

                    <select ref={Professor_responsavelRef} required>
                        <option value="">Selecione um professor</option>
                        {professores.map(b => (
                            <option key={b.NI} value={b.NI}>{b.Nome} - {b.NI}</option>
                        ))}
                    </select>

                    <div className="btns">

                        <button onClick={closeModal} className='btn-cancelar'>Cancelar</button>
                        <button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Disciplina'}</button>
                    </div>
                </form>
            </Modal>



        </section>
    )
}