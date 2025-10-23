import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ModalConfirmarProps {
  show: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children?: React.ReactNode;
}

// const defaultConfirm = () => alert("Acción confirmada");
const defaultTitle = "Título del modal";

const ModalConfirmar: React.FC<ModalConfirmarProps> = ({ show, onClose, onConfirm, title = defaultTitle, children }) => {
  
    return (
    <Modal show={show} onHide={onClose} centered>
      
      { title && (
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        { onConfirm && (
          <Button variant="primary" onClick={onConfirm}>
            Guardar cambios
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmar;