import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Receipt, Plus } from "lucide-react";
import useGetGenericHook from "../../../../hooks/accessData/useGetGenericHook";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import axi from "../../../../services/apiClient";
import BillingCard from "./BillingCard";
import BillingFormModal from "./BillingFormModal";
import BillingDeleteModal from "./BillingDeleteModal";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { IComboItem, IFiscalDataResponse } from "../../../../interfaces/billing";
import type { IGenericParam } from "../../../../interfaces/parametros";
import "./styles/AddressManager.css";
import "./styles/Profile.css";

interface BillingDataTabProps {
  idCliente: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const BillingData: React.FC<BillingDataTabProps> = ({ idCliente, onSuccess, onError }) => {
  // Hook para obtener los combos
  const {
    data: combosData,
    isLoading: isLoadingCombos,
  } = useGetGenericHook("DatosFacturacionClientes/GetCombos");

  // Listado de registros fiscales
  const [fiscales, setFiscales] = useState<IFiscalDataResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billingToDelete, setBillingToDelete] = useState<IFiscalDataResponse | null>(null);
  const [editingBilling, setEditingBilling] = useState<IFiscalDataResponse | null>(null);

  // Estados de los combos
  const [formasPago, setFormasPago] = useState<IComboItem[]>([]);
  const [metodosPago, setMetodosPago] = useState<IComboItem[]>([]);
  const [regimenesFiscales, setRegimenesFiscales] = useState<IComboItem[]>([]);
  const [usosCfdi, setUsosCfdi] = useState<IComboItem[]>([]);

  // Hook para eliminar datos de facturación
  const {
    postData: deleteBilling,
    isLoading: isDeleting,
    error: errorDeleting,
  } = usePostGenericHook<IGenericParam, IRespuesta<any>>(
    "DatosFacturacionClientes/Eliminar"
  );

  // Función para cargar el listado de datos de facturación
  const loadBillingData = async () => {
    setIsLoadingList(true);
    try {
      const response = await axi.get<IRespuesta<IFiscalDataResponse[]>>(
        `DatosFacturacionClientes/ObtenerPorIdCte/${idCliente}`
      );

      if (response.data.exito && response.data.data) {
        let dataArray: IFiscalDataResponse[] = [];
        
        if (Array.isArray(response.data.data)) {
          dataArray = response.data.data as IFiscalDataResponse[];
        } else {
          dataArray = [response.data.data] as IFiscalDataResponse[];
        }
        
        setFiscales(dataArray);
      } else {
        setFiscales([]);
      }
    } catch (error) {
      console.error("Error al cargar datos de facturación:", error);
      setFiscales([]);
      onError("Error al cargar los datos de facturación");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Cargar listado al montar el componente
  useEffect(() => {
    if (idCliente) {
      loadBillingData();
    }
  }, [idCliente]);

  // Manejar errores del hook de eliminación
  useEffect(() => {
    if (errorDeleting) {
      onError(errorDeleting);
    }
  }, [errorDeleting, onError]);

  // Procesar datos de combos cuando se cargan
  useEffect(() => {
    if (combosData) {
      const response = combosData as IRespuesta<IComboItem[][]>;

      if (response.exito && response.data) {
        response.data.forEach((item) => {
          const comboArray = item as IComboItem[];
          
          if (comboArray.length > 0) {
            const tipoCombo = comboArray[0].combo;

            switch (tipoCombo) {
              case "FormasPago":
                setFormasPago(comboArray);
                break;
              case "MetodosPago":
                setMetodosPago(comboArray);
                break;
              case "RegimenFiscal":
                setRegimenesFiscales(comboArray);
                break;
              case "UsoCfdi":
                setUsosCfdi(comboArray);
                break;
            }
          }
        });
      }
    }
  }, [combosData]);

  // Abrir modal para nuevo registro
  const handleAddNew = () => {
    setEditingBilling(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (billing: IFiscalDataResponse) => {
    setEditingBilling(billing);
    setShowModal(true);
  };

  // Cerrar modal de formulario
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBilling(null);
  };

  // Manejar éxito después de guardar
  const handleSaveSuccess = () => {
    handleCloseModal();
    onSuccess();
    loadBillingData();
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (billing: IFiscalDataResponse) => {
    setBillingToDelete(billing);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!billingToDelete) return;

    try {
      const param: IGenericParam = {
        parametro: billingToDelete.idDatoFacturacion
      };

      const response = await deleteBilling(param);

      if (response && response.exito) {
        onSuccess();
        setShowDeleteModal(false);
        setBillingToDelete(null);
        loadBillingData();
      } else {
        onError(response?.mensaje || "Error al eliminar los datos de facturación");
      }
    } catch (error) {
      console.error("Error al eliminar datos de facturación:", error);
      onError("Error al eliminar los datos de facturación");
    }
  };

  if (isLoadingCombos || isLoadingList) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-2">Cargando datos...</p>
      </div>
    );
  }

  return (
    <Container fluid className="p-0" style={{ marginTop: "15px" }}>
      {/* Header y botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-white profile-section-title mb-0">
          <Receipt className="me-2" size={20} />
          Datos de Facturación
        </h5>
        <Button 
          id="btnAgregarDataBilling"
          className="hub-btn-gamer" 
          onClick={handleAddNew}
          >
          <Plus size={18} className="me-2" />
          Agregar Datos
        </Button>
      </div>

      {/* Listado o vacío */}
      {fiscales.length === 0 ? (
        <Card className="bg-dark text-white border-secondary">
          <Card.Body className="text-center py-5">
            <Receipt size={48} className="text-secondary mb-3" />
            <p className="text-light mb-0">No hay datos de facturación registrados.</p>
            <p className="text-secondary small">Agrega un nuevo registro para continuar.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {fiscales.map((item) => (
            <Col key={item.idDatoFacturacion} md={6} className="mb-3">
              <BillingCard
                billing={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDeleteClick(item)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal con formulario */}
      <BillingFormModal
        show={showModal}
        onHide={handleCloseModal}
        idCliente={idCliente}
        editingBilling={editingBilling}
        formasPago={formasPago}
        metodosPago={metodosPago}
        regimenesFiscales={regimenesFiscales}
        usosCfdi={usosCfdi}
        onSuccess={handleSaveSuccess}
        onError={onError}
      />

      {/* Modal de confirmación de eliminación */}
      <BillingDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        billing={billingToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
};

export default BillingData;