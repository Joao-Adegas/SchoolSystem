import { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import Modal from "../Modal/Modal"
import "../ListaSalas/ListaSalas.sass"

export default function ListaSalas() {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");


    const [sala, setSala] = useState([]);
    const [isEditing,setEditing] = useState(false)
    const [editSala,setEditSala] = useState(null)
    const [modalOpen,setOpenModal] = useState(false)

    const numeroRef = useRef() 

    const cleanerForm = () => {
        setTimeout(() => {
            if(numeroRef.current) numeroRef.current.value = ''
        }, 0);
    }

    const openCreateModal = () => {
        setEditing(false)
        setEditSala(null)
        setOpenModal(true)
        setTimeout(() => cleanerForm(), 100);
    }

    const openEditModal = (sala) => {
        setEditing(true)
        setEditSala(sala)
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        setEditing(false)
        setEditSala(null)
    }

    const buscarSala = () => {
      
        axios.get("http://127.0.0.1:8000/sala/", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log("Resposta da API Django:", response.data);
            setSala(response.data);
        }).catch(error => {
            console.error("Erro ao buscar sala:", error);
        });
    };

    const handleSubmit =() =>{

        const formData ={
            numero:numeroRef.current.value
        }

        if(isEditing){
            axios.put(`http://127.0.0.1:8000/sala/${editSala.id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            .then(() => {
                buscarSala()
                closeModal()
            })
            .catch(error =>{
                console.log("Erro ao editar sala: ",error)
            })
        }
        else{

            axios.post("http://127.0.0.1:8000/sala/", formData, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                console.log(response.data.results);
                buscarSala(); 
                closeModal()
            }).catch(error => {
                console.log("Erro ao criar sala: ", error);
            });

        }

    }


    const deletarSala = (id) => {
    
       
        axios.delete(`http://127.0.0.1:8000/sala/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            buscarSala()
        }).catch(error => {
            console.error("Erro ao deletar sala:", error);
        });
    };

    useEffect(()=>{
        buscarSala()

        if(isEditing && editSala && modalOpen){
            setTimeout(()=>{
                if(numeroRef.current) numeroRef.current.value = editSala.numero || ''
            },100)
        }
    },[isEditing,editSala,modalOpen])


    return (
        
        <div className='container-salas'>

            <h1>Lista de Salas</h1>

            
                <>  
                {userType == "Gestor" && (
                        <button onClick={openCreateModal} className='btn-create-salas'>NOVA SALA</button>
                    )}
                    <ul>
                        {sala.length > 0 ? (
                            sala.map(sala => (
                                <li key={sala.id}>
                                    <div className="informations-sala">
                                        <p>Identificação: <strong>{sala.id}</strong> - Número: {sala.numero}</p>
                                        <div className="btns-salas">
                                            <button onClick={() => deletarSala(sala.id)} className='btn-salas'>
                                                <img src="../public/lixeira-de-reciclagem.png" alt="deletar" srcSet="" className="icon"/>
                                            </button>
                                            <button onClick={() => openEditModal(sala)} className='btn-salas'>
                                                <img src="../public/lapis.png" alt="editar" srcSet="" className="icon"/>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                              <p>Você não possui salas reservadas</p>
                        )}
                    </ul>
                </>
            

            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                className="custom-modal" 
                overlayClassName="custom-overlay"
                shouldCloseOnOverlayClick={false}
               >

                <h2>{isEditing ? 'Editar Sala' : 'Criar Sala'}</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                    <label>Numero Da Sala:
                        <input type="number" ref={numeroRef} required placeholder="Digite aqui"/>
                    </label>

                                        
                    <div className="modal-buttons">

                        <button type="submit" className="btn-create">
                            {isEditing ? 'Salvar Alterações' : 'Criar'}
                        </button>

                        <button className='btn-create close-btn' onClick={closeModal}>
                            Cancelar
                        </button>
                      
                    </div>
 
                </form>
            </Modal>

            
        </div>
    );
}
