import React from "react";
import { Modal, Button } from "react-bootstrap";
import { AlertTriangle } from "lucide-react";
import type { IFiscalDataResponse } from "../../../../interfaces/billing";

interface BillingDeleteModalProps {
  show: boolean;
  onHide: () => void;
  billing: IFiscalDataResponse | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

const BillingDeleteModal: React.FC<BillingDeleteModalProps> = ({
  show,
  onHide,
  billing,
  isDeleting,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered className="address-modal">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="d-flex align-items-center">
          <AlertTriangle className="me-2 text-warning" size={24} />
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <p className="mb-0">
          ¿Estás seguro de que deseas eliminar los datos de facturación de{" "}
          <strong>{billing?.razonSocial}</strong>?
        </p>
        <p className="text-secondary small mt-2 mb-0">
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button 
          id="btnCancelaEliminarDataBilling"
          variant="secondary" 
          onClick={onHide} 
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button 
          id="btnConfirmaEliminarDataBilling"
          variant="danger" 
          onClick={onConfirm} 
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span
                className="spinner-grow spinner-grow-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Eliminando...
            </>
          ) : (
            "Eliminar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillingDeleteModal;