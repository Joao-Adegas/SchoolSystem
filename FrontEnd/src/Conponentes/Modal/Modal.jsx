import Modal from "react-modal";
import "../Modal/Modal.sass"

Modal.setAppElement("#root"); 

export default function ModalComponent({ isOpen, onClose, children }){
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
        
            {children} 
        </Modal>
    );
}