import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Edit2, Trash2 } from "lucide-react";
import type { IFiscalDataResponse } from "../../../../interfaces/billing";

interface BillingCardProps {
  billing: IFiscalDataResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const BillingCard: React.FC<BillingCardProps> = ({ billing, onEdit, onDelete }) => {
  return (
    <Card className="bg-dark text-white border-secondary h-100 address-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="text-white mb-1">{billing.razonSocial}</h6>
            <Badge bg="secondary" className="badge-address-type">Facturación</Badge>
          </div>
          <div className="d-flex gap-2">
            <Button 
              id="btnEditarDataBilling"
              variant="outline-light" 
              size="sm" 
              className="btn-icon-action" 
              onClick={onEdit}
              title="Editar"
            >
              <Edit2 size={16} />
            </Button>
            <Button 
              id="btnEliminarDataBilling"
              variant="outline-danger" 
              size="sm" 
              className="btn-icon-action" 
              onClick={onDelete}
              title="Eliminar"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <div className="address-details">
          <p className="mb-1 text-light"><strong>RFC:</strong> {billing.rfc}</p>
          <p className="mb-1 text-light"><strong>Correo:</strong> {billing.correo}</p>
          <p className="mb-1 text-light"><strong>Régimen:</strong> {billing.regimen}</p>
          <p className="mb-1 text-light"><strong>C.P. Fiscal:</strong> {billing.cpFiscal}</p>
          <p className="mb-1 text-light"><strong>Uso CFDI:</strong> {billing.usoCfdi || "No especificado"}</p>
          <p className="mb-1 text-light"><strong>Forma de pago:</strong> {billing.formaPago}</p>
          <p className="mb-1 text-light"><strong>Método de pago:</strong> {billing.metodoPago}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BillingCard;