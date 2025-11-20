import React, { useState, useEffect, useRef } from "react";
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
  const {
    data: combosData,
    isLoading: isLoadingCombos,
  } = useGetGenericHook("DatosFacturacionClientes/GetCombos");

  const [fiscales, setFiscales] = useState<IFiscalDataResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billingToDelete, setBillingToDelete] = useState<IFiscalDataResponse | null>(null);
  const [editingBilling, setEditingBilling] = useState<IFiscalDataResponse | null>(null);

  const [formasPago, setFormasPago] = useState<IComboItem[]>([]);
  const [metodosPago, setMetodosPago] = useState<IComboItem[]>([]);
  const [regimenesFiscales, setRegimenesFiscales] = useState<IComboItem[]>([]);
  const [usosCfdi, setUsosCfdi] = useState<IComboItem[]>([]);

  // Refs para control de peticiones
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    postData: deleteBilling,
    isLoading: isDeleting,
    error: errorDeleting,
  } = usePostGenericHook<IGenericParam, IRespuesta<any>>(
    "DatosFacturacionClientes/Eliminar"
  );

  // Cleanup al desmontar
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      isLoadingRef.current = false;
      // Cancelar peticiones pendientes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cargar listado cuando cambie idCliente
  useEffect(() => {
    if (idCliente && isMountedRef.current) {
      loadBillingData();
    }
    
    // Cleanup al cambiar de pestaña
    return () => {
      setFiscales([]);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [idCliente]);

  // Manejar errores
  useEffect(() => {
    if (errorDeleting && isMountedRef.current) {
      onError(errorDeleting);
    }
  }, [errorDeleting]);

  // Procesar combos
  useEffect(() => {
    if (combosData && isMountedRef.current) {
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

  // Función para cargar datos con protección contra llamadas múltiples
  const loadBillingData = async () => {
    // Prevenir llamadas simultáneas
    if (isLoadingRef.current || !isMountedRef.current) {
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    isLoadingRef.current = true;
    setIsLoadingList(true);

    try {
      const response = await axi.get<IRespuesta<IFiscalDataResponse[]>>(
        `DatosFacturacionClientes/ObtenerPorIdCte/${idCliente}`,
        { signal: abortControllerRef.current.signal }
      );

      // Verificar si el componente sigue montado
      if (!isMountedRef.current) {
        return;
      }

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
    } catch (error: any) {
      // No mostrar error si fue cancelación
      if (error.name === 'CanceledError' || error.message === 'canceled') {
        console.log('Petición cancelada correctamente');
        return;
      }
      
      console.error("Error al cargar datos de facturación:", error);
      if (isMountedRef.current) {
        setFiscales([]);
        onError("Error al cargar los datos de facturación");
      }
    } finally {
      if (isMountedRef.current) {
        isLoadingRef.current = false;
        setIsLoadingList(false);
      }
    }
  };

  const handleAddNew = () => {
    setEditingBilling(null);
    setShowModal(true);
  };

  const handleEdit = (billing: IFiscalDataResponse) => {
    setEditingBilling(billing);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBilling(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    onSuccess();
    if (isMountedRef.current) {
      loadBillingData();
    }
  };

  const handleDeleteClick = (billing: IFiscalDataResponse) => {
    setBillingToDelete(billing);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!billingToDelete || !isMountedRef.current) return;

    try {
      const param: IGenericParam = {
        parametro: billingToDelete.idDatoFacturacion
      };

      const response = await deleteBilling(param);

      if (!isMountedRef.current) return;

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
      if (isMountedRef.current) {
        onError("Error al eliminar los datos de facturación");
      }
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