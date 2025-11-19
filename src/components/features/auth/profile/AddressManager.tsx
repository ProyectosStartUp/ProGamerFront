import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Spinner } from "react-bootstrap";
import { Trash2, Edit2, MapPin, Plus, AlertTriangle } from "lucide-react";
import AddressForm from "./AddressForm";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IAddressData } from "../../../../interfaces/address";
import type { IGenericParam } from "../../../../interfaces/parametros";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import "./styles/AddressManager.css";

interface AddressManagerProps {
  usuarioId: string;
  tipoDireccion: 1 | 2; // 1 = Envío, 2 = Facturación
  onSuccess: () => void;
  onError: (message: string) => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  usuarioId,
  tipoDireccion,
  onSuccess,
  onError
}) => {
  // Estado para las direcciones guardadas
  const [addresses, setAddresses] = useState<IAddressData[]>([]);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<IAddressData | null>(null);
  
  // Estado para edición
  const [editingAddress, setEditingAddress] = useState<IAddressData | null>(null);

  // Hook para cargar direcciones
  const { 
    postData: fetchAddresses, 
    isLoading: isLoadingAddresses, 
    error: errorAddresses 
  } = usePostGenericHook<IGenericParam, IRespuesta<IAddressData[]>>(
    "Direcciones/ObtenerDireccionesPorIdCte"
  );

  // Hook para eliminar dirección
  const {
    postData: deleteAddress,
    isLoading: isDeleting,
    error: errorDelete
  } = usePostGenericHook<IGenericParam, IRespuesta<any>>(
    "Direcciones/Eliminar"
  );

  const isShippingAddress = tipoDireccion === 1;
  const titleText = isShippingAddress ? "Direcciones de Envío" : "Direcciones Fiscales";

  // Cargar direcciones al montar el componente o cuando cambie el usuarioId
  useEffect(() => {
    if (usuarioId) {
      loadAddresses();
    }
  }, [usuarioId]);

  // Manejar errores de carga
  useEffect(() => {
    if (errorAddresses) {
      onError(errorAddresses);
    }
  }, [errorAddresses, onError]);

  // Manejar errores de eliminación
  useEffect(() => {
    if (errorDelete) {
      onError(errorDelete);
    }
  }, [errorDelete, onError]);

  // Función para cargar direcciones
  const loadAddresses = async () => {
    try {
      const param: IGenericParam = {
        parametro: usuarioId
      };

      const response = await fetchAddresses(param);

      if (response && response.exito && response.data) {
        // El data puede venir como array directo o dentro de un objeto
        let addressesArray: any[] = [];
        
        if (Array.isArray(response.data)) {
          addressesArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // Si data es un objeto que contiene el array
          addressesArray = (response.data as any).data || [];
        }

        // Filtrar direcciones según el tipo
        const filteredAddresses = addressesArray.filter(
          (addr: any) => addr.esFiscal === (tipoDireccion === 2)
        );
        
        setAddresses(filteredAddresses as IAddressData[]);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
      setAddresses([]);
    }
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

  // Manejar éxito después de guardar
  const handleSaveSuccess = () => {
    handleCloseModal();
    onSuccess();
    // Recargar la lista de direcciones
    loadAddresses();
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (address: IAddressData) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      const param: IGenericParam = {
        parametro: addressToDelete.idDireccion
      };

      const response = await deleteAddress(param);

      if (response && response.exito) {
        onSuccess();
        setShowDeleteModal(false);
        setAddressToDelete(null);
        // Recargar la lista de direcciones
        loadAddresses();
      } else {
        onError(response?.mensaje || "Error al eliminar la dirección");
      }
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      onError("Error al eliminar la dirección");
    }
  };

  // Mostrar loader mientras carga
  if (isLoadingAddresses) {
    return (
      <Container fluid className="p-0">
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="light" role="status">
            <span className="visually-hidden">Cargando direcciones...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      {/* Header con título y botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-white profile-section-title mb-0">
          <MapPin className="me-2" size={20} />
          {titleText}
        </h5>
        <Button
          id="btnAgregaDireccion"          
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
            <Col key={address.idDireccion || index} md={6} lg={4} className="mb-3">
              <Card className="bg-dark text-white border-secondary h-100 address-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-white mb-1">{address.aliasDireccion}</h6>
                      <Badge bg="secondary" className="badge-address-type">
                        {address.esFiscal ? "Facturación" : "Envío"}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                      id="btnEditarDireccion"
                        variant="outline-light"
                        size="sm"
                        className="btn-icon-action"
                        onClick={() => handleEdit(address)}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        id="btnBorraDireccion"
                        variant="outline-danger"
                        size="sm"
                        className="btn-icon-action"
                        onClick={() => handleDeleteClick(address)}
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
                    {address.colonia && (
                      <p className="mb-1 text-light">
                        <strong>Colonia:</strong> {address.colonia}
                      </p>
                    )}
                    <p className="mb-1 text-light">
                      <strong>C.P.:</strong> {address.codigoPostal}
                    </p>
                    {address.municipio && (
                      <p className="mb-1 text-light">
                        <strong>Municipio:</strong> {address.municipio}
                      </p>
                    )}
                    {address.entidadFva && (
                      <p className="mb-1 text-light">
                        <strong>Estado:</strong> {address.entidadFva}
                      </p>
                    )}
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
            initialData={
              editingAddress 
                ? { 
                    ...editingAddress,
                    idCliente: usuarioId
                  } 
                : { idCliente: usuarioId }
            }
            onSuccess={handleSaveSuccess}
            onError={onError}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="address-modal"
      >
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title className="d-flex align-items-center">
            <AlertTriangle className="me-2 text-warning" size={24} />
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p className="mb-0">
            ¿Estás seguro de que deseas eliminar la dirección{" "}
            <strong>{addressToDelete?.aliasDireccion}</strong>?
          </p>
          
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button
            id="btnCancelaBorrarDireccion"
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            id="btnConfirmaBorrarDireccion"
            variant="danger"
            onClick={handleConfirmDelete}
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
    </Container>
  );
};

export default AddressManager;