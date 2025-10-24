import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge } from "react-bootstrap";
import { Trash2, Edit2, MapPin, Plus } from "lucide-react";
import AddressForm from "./AddressForm";
import type { IAddressData } from "../../../../interfaces/address";
import { COLONIAS_DUMMY, MUNICIPIOS_DUMMY } from "../../../../utils/address.data";
import "./styles/AddressManager.css";


interface AddressManagerProps {
  usuarioId: string;
  tipoDireccion: 1 | 2; // 1 = Envío, 2 = Facturación
}

const AddressManager: React.FC<AddressManagerProps> = ({
  usuarioId,
  tipoDireccion
}) => {
  // Estado para las direcciones guardadas
  const [addresses, setAddresses] = useState<IAddressData[]>([]);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para edición
  const [editingAddress, setEditingAddress] = useState<IAddressData | null>(null);

  const isShippingAddress = tipoDireccion === 1;
  const titleText = isShippingAddress ? "Direcciones de Envío" : "Direcciones Fiscales";

  // Función para obtener el nombre de la colonia por ID
  const getColoniaName = (coloniaId: string): string => {
    const colonia = COLONIAS_DUMMY.find(c => c.id === coloniaId);
    return colonia?.descripcion || "";
  };

  // Función para obtener el nombre del municipio por ID
  const getMunicipioName = (municipioId: string): string => {
    const municipio = MUNICIPIOS_DUMMY.find(m => m.id === municipioId);
    return municipio?.descripcion || "";
  };

  // Abrir modal para agregar nueva dirección
  const handleAddNew = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  // Abrir modal para editar dirección existente
  const handleEdit = (address: IAddressData) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  // Guardar dirección (nueva o editada)
  const handleSaveAddress = async (data: IAddressData) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAddress) {
        // Actualizar dirección existente
        setAddresses(prev =>
          prev.map(addr =>
            addr.alias === editingAddress.alias ? data : addr
          )
        );
      } else {
        // Agregar nueva dirección
        setAddresses(prev => [...prev, data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar dirección:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar dirección
  const handleDelete = (alias: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la dirección "${alias}"?`)) {
      setAddresses(prev => prev.filter(addr => addr.alias !== alias));
    }
  };

  return (
    <Container fluid className="p-0">
      {/* Header con título y botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-white profile-section-title mb-0">
          <MapPin className="me-2" size={20} />
          {titleText}
        </h5>
        <Button
          className="hub-btn-gamer"
          onClick={handleAddNew}
        >
          <Plus size={18} className="me-2" />
          Agregar Dirección
        </Button>
      </div>

      {/* Listado de direcciones */}
      {addresses.length === 0 ? (
        <Card className="bg-dark text-white border-secondary">
          <Card.Body className="text-center py-5">
            <MapPin size={48} className="text-secondary mb-3" />
            <p className="text-light mb-0">
              No hay direcciones registradas.
            </p>
            <p className="text-secondary small">
              Agrega una nueva dirección para continuar.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {addresses.map((address, index) => (
            <Col key={index} md={6} lg={4} className="mb-3">
              <Card className="bg-dark text-white border-secondary h-100 address-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-white mb-1">{address.alias}</h6>
                      <Badge bg="secondary" className="badge-address-type">
                        {isShippingAddress ? "Envío" : "Facturación"}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="btn-icon-action"
                        onClick={() => handleEdit(address)}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="btn-icon-action"
                        onClick={() => handleDelete(address.alias)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="address-details">
                    <p className="mb-1 text-light">
                      <strong>Calle:</strong> {address.calle} #{address.numExt}
                      {address.numInt && ` Int. ${address.numInt}`}
                    </p>
                    <p className="mb-1 text-light">
                      <strong>Colonia:</strong> {getColoniaName(address.coloniaId)}
                    </p>
                    <p className="mb-1 text-light">
                      <strong>C.P.:</strong> {address.codigoPostal}
                    </p>
                    <p className="mb-1 text-light">
                      <strong>Municipio:</strong> {getMunicipioName(address.municipioId)}
                    </p>
                    {address.referencias && (
                      <p className="mb-0 text-secondary small mt-2">
                        <em>Referencias: {address.referencias}</em>
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal con el formulario */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        className="address-modal"
      >
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>
            {editingAddress ? "Editar Dirección" : "Agregar Nueva Dirección"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <AddressForm
            tipoDireccion={tipoDireccion}
            usuarioId={usuarioId}
            initialData={editingAddress || undefined}
            onSave={handleSaveAddress}
            isLoading={isLoading}
          />
        </Modal.Body>
      </Modal>


    </Container>
  );
};

export default AddressManager;