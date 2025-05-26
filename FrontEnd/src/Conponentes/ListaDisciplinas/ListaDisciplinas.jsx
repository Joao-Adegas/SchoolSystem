import {useState,useRef,useEffect} from 'react'
import axios from 'axios'
import Modal from "../Modal/Modal"

export default function ListaDisciplinas(){

    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("user_type");
    const nome = localStorage.getItem("nome")

    const [disciplina,setDisciplina] = useState([])
    const [professores,setProfessores] = useState([])
    const [createModal,setCreateModal] = useState(false)
    const [isEditing,setIsEditing] = useState(null)
    const [modalOpen,setModalOpen]= useState(false)
    const [editModal,setEditModal] = useState(null)
    const [editDisciplina,setEditDisciplina] = useState(null)

    const NomeRef = useRef()
    const CursoRef = useRef()
    const Carga_HorariaRef = useRef()
    const DescricaoRef = useRef()
    const Professor_responsavelRef = useRef()

    const cleanerForm = () => {
        setTimeout(() => {
            if(NomeRef.current)NomeRef.current.value = ''
            if(CursoRef.current)NomeRef.current.value = ''
            if(Carga_HorariaRef.current)Carga_HorariaRef.current.value = ''
            if(DescricaoRef.current)DescricaoRef.current.value = ''
            if(Professor_responsavelRef.current)Professor_responsavelRef.current.value = ''
        }, 0);
    }

    const openCreateModal = () => {
        setIsEditing(false)
        setEditDisciplina(null)
        setModalOpen(true)
        setTimeout(()=>cleanerForm(),100)
    }


    const openEditModal = (disciplina) =>{
        setIsEditing(true)
        setEditDisciplina(disciplina)
        setModalOpen(true)
    }

    const closeModal = () =>{
        setModalOpen(false)
        setIsEditing(false)
        setEditDisciplina(null)
    }

    const buscarDisciplina = () => {
        axios.get(`http://127.0.0.1:8000/disciplina/`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setDisciplina(response.data)
        })
        .catch(error => {
            console.error("Erro ao buscar sala:",error)
        })
    }

    const listarProfessores = () =>{
        axios.get("http://127.0.0.1:8000/professores/",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Professores:",response.data)
            setProfessores(response.data)
        })
    }

    const handleSubmit = () => {
       

        const formData = {
            Nome:NomeRef.current.value,
            Curso:CursoRef.current.value,
            Carga_Horaria:Carga_HorariaRef.current.value,
            Descricao:DescricaoRef.current.value,
            Professor_responsavel:Professor_responsavelRef.current.value
        }

        if(isEditing){
            axios.put(`http://127.0.0.1:8000/disciplina/${editDisciplina.id}`,formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
            })
            .then(response => {
                buscarDisciplina()
                closeModal()
            })
            .catch(error =>{
                console.log(`Erro ao editar a disciplina `,error)
            })
        }
        else{

            axios.post("http://127.0.0.1:8000/disciplina/",formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(response => {
                console.log("Dados enviados:", response.data.results)
                buscarDisciplina()
                closeModal()
            })
            .catch(error => {
                console.log("Erro ao criar Disciplina: ",error)
            })
        }

    }

    const deletarDisciplina = (id) =>{
        axios.delete(`http://127.0.0.1:8000/disciplina/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response => {
            console.log(`A disciplina ${id} foi deletada com sucesso`)
            buscarDisciplina()
        })
        .catch(error =>{
            console.error("erro ao deletar uma disciplina :",error)
        })
    }

    useEffect(()=>{
        buscarDisciplina()
        listarProfessores()

        if(isEditing && editDisciplina && modalOpen){
            setTimeout(()=>{
                if(NomeRef.current)NomeRef.current.value = editDisciplina.Nome
                if(CursoRef.current)CursoRef.current.value = editDisciplina.Curso
                if(Carga_HorariaRef.current)Carga_HorariaRef.current.value = editDisciplina.Carga_Horaria
                if(DescricaoRef.current)DescricaoRef.current.value = editDisciplina.Descricao
                if(Professor_responsavelRef.current)Professor_responsavelRef.current.value = editDisciplina.Professor_responsavel
            })
        }
    },[isEditing,editDisciplina,modalOpen])

    return(
        <div>
            <h1>Disciplinas da {nome}</h1>

        	<div>
                    {userType === "Gestor" &&(
                        <button onClick={openCreateModal}>Criar Disciplina</button>
                    )}

                    <ul>
                        {disciplina.length > 0 ? ( 
                                disciplina.map(a =>(
                                    <li key={a.id}>

                                            <div className="informations-disciplina">
                                                <p>Nome: {a.Nome}</p>
                                                <p>Curso: {a.Curso}</p>
                                                <p>Carga Horaria: {a.Carga_Horaria}</p>
                                                <p>Descrição: {a.Descricao}</p>
                                                <p>Professor: {a.professor_nome}</p>
                                            </div>

                                            {userType === "Gestor" && (
                                                <>
                                                <button onClick={() => deletarDisciplina(a.id)}>Deletar</button>
                                                <button onClick={() => openEditModal(a)}>Editar</button>
                                                </>
                                            )}

                                    </li>
                                ))
                            ):(
                                <p>{nome} Não possui disciplinas cadastradas</p>
                            )}
                    </ul>

                {/* {
                    createModal && (
                        <div className="modal-disciplinas">
                            <h2>Criar Disciplina</h2>
                            <form onSubmit={handleSubmit}>
                                <p>Nome da disciplina:</p>
                                <input type="text" ref={NomeRef} required />
                                <p>Curso:</p>
                                <input type="text" ref={CursoRef} />
                                <p>Carga Horaria:</p>
                                <input type="time" ref={Carga_HorariaRef} />
                                <p>Descrição:</p>
                                <textarea ref={DescricaoRef} rows={5} cols={50}/>
                                <p>Professor responsável:</p>

                                <select ref={Professor_responsavelRef} required>
                                    <option value="">Selecione um professor</option>
                                    {professores.map(b => (
                                            <option key={b.NI} value={b.NI}>{b.Nome}</option>
                                        ))}
                                </select>
                                <button type='submit'>Criar</button>
                                <button onClick={() => setCreateModal(false)}>Fechar</button>
                            </form>
                        </div>
                    )
                }
                
                {editModal && (
                        <div className="modal-disciplinas">
                            <h2>Criar Disciplina</h2>
                            <form onSubmit={handleEditSbmit}>
                                <p>Nome da disciplina:</p>
                                <input type="text" ref={NomeRef}  defaultValue={editModal.Nome} required />
                                <p>Curso:</p>
                                <input type="text" ref={CursoRef} defaultValue={editModal.Curso}/>
                                <p>Carga Horaria:</p>
                                <input type="time" ref={Carga_HorariaRef} defaultValue={editModal.Carga_Horaria}/>
                                <p>Descrição:</p>
                                <textarea ref={DescricaoRef} rows={5} cols={50} defaultValue={editModal.Descricao}/>
                                <p>Professor responsável:</p>

                                <select ref={Professor_responsavelRef} defaultValue={editModal.Professor_responsavel} required>
                                    <option value="">Selecione um professor</option>
                                    {professores.map(b => (
                                            <option key={b.NI} value={b.NI}>{b.Nome} - {b.NI}</option>
                                        ))}
                                </select>
                                <button type='submit'>Salvar Alterações</button>
                                <button onClick={() => setCreateModal(false)}>Fechar</button>
                            </form>
                        </div>
                )} */}

                <Modal 
                    isOpen={modalOpen} 
                    onClose={closeModal} 
                    className="custom-modal" 
                    overlayClassName="custom-overlay" 
                    ariaHideApp={false}
                >
                    <h2>{isEditing ? 'Editar Ambiente' : 'Criar Ambiente'}</h2>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <p>Nome da disciplina:</p>
                                <input type="text" ref={NomeRef}   required />
                                <p>Curso:</p>
                                <input type="text" ref={CursoRef} />
                                <p>Carga Horaria:</p>
                                <input type="time" ref={Carga_HorariaRef} />
                                <p>Descrição:</p>
                                <textarea ref={DescricaoRef} rows={5} cols={50} />
                                <p>Professor responsável:</p>

                                <select ref={Professor_responsavelRef}  required>
                                    <option value="">Selecione um professor</option>
                                    {professores.map(b => (
                                            <option key={b.NI} value={b.NI}>{b.Nome} - {b.NI}</option>
                                        ))}
                                </select>

                        <button type="submit">{isEditing? 'Salvar Alterações':'Criar Ambiente'}</button>
                    </form>
                </Modal>
                
            </div>

        </div>
    )
}