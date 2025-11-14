import React, { useState, useEffect, type ChangeEvent } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Form, Spinner } from "react-bootstrap";
import { Trash2, Edit2, MapPin, Plus } from "lucide-react";
import { useAuthData } from "../../../../store/useAuthStore";
import useGetGenericHook from "../../../../hooks/accessData/useGetGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { IComboItem, IFiscalData, ValidationErrors } from "../../../../interfaces/billing";
import "./styles/AddressManager.css";
import "./styles/Profile.css";

interface BillingDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const BillingData: React.FC<BillingDataTabProps> = ({ onSuccess, onError }) => {
  const { id } = useAuthData();

  // Hook para obtener los combos
  const {
    data: combosData,
    isLoading: isLoadingCombos,
  } = useGetGenericHook("DatosFacturacionClientes/GetCombos");

  // Listado de registros fiscales (local, simulado)
  const [fiscales, setFiscales] = useState<IFiscalData[]>([]);

  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Índice en edición
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Campos fiscales
  const [fiscalData, setFiscalData] = useState<IFiscalData>({
    usuarioId: id || "",
    razonSocial: "",
    rfc: "",
    correoFactura: "",
    regimenFiscalId: "",
    cpFiscal: "",
    usoCfdiId: "",
    formaPagoId: "",
    metodoPagoId: "",
  });

  const [formasPago, setFormasPago] = useState<IComboItem[]>([]);
  const [metodosPago, setMetodosPago] = useState<IComboItem[]>([]);
  const [regimenesFiscales, setRegimenesFiscales] = useState<IComboItem[]>([]);
  const [usosCfdi, setUsosCfdi] = useState<IComboItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Procesar datos de combos cuando se cargan
useEffect(() => {
  if (combosData) {
    const response = combosData as IRespuesta<IComboItem[][]>;

    if (response.exito && response.data) {
      // response.data es un array de arrays
      response.data.forEach((item) => {
        // Hacer casting explícito a array de IComboItem
        const comboArray = item as IComboItem[];
        
        // Verificar que comboArray tenga elementos
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

  const validarRFC = (rfcValue: string): boolean => {
    // RFC Genérico
    if (rfcValue === "XAXX010101000") {
      return true;
    }
    // Persona Moral: 12 caracteres
    const rfcMoralRegex = /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/;
    // Persona Física: 13 caracteres
    const rfcFisicaRegex = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcMoralRegex.test(rfcValue) || rfcFisicaRegex.test(rfcValue);
  };

  const validarCorreo = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  // Validación especial para RFC
  if (name === "rfc") {
    const rfcUpperCase = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (rfcUpperCase.length <= 13) {
      setFiscalData(prev => ({ ...prev, [name]: rfcUpperCase }));
    }
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    return;
  }

  // Validación para código postal (solo números, máximo 5 dígitos)
  if (name === "cpFiscal") {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 5) {
      setFiscalData(prev => ({ ...prev, [name]: numericValue }));
    }
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    return;
  }

  setFiscalData(prev => ({ ...prev, [name]: value }));

  // Limpiar error de validación
  if (validationErrors[name as keyof ValidationErrors]) {
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  }
};

  const setRFCGenerico = () => {
    setFiscalData(prev => ({ ...prev, rfc: "XAXX010101000" }));
    setValidationErrors(prev => ({ ...prev, rfc: undefined }));
  };

  const resetFields = () => {
    setFiscalData({
      usuarioId: id || "",
      razonSocial: "",
      rfc: "",
      correoFactura: "",
      regimenFiscalId: "",
      cpFiscal: "",
      usoCfdiId: "",
      formaPagoId: "",
      metodoPagoId: "",
    });
    setValidationErrors({});
  };

  // Abrir modal para nuevo registro
  const handleAddNew = () => {
    setEditingIndex(null);
    resetFields();
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (index: number) => {
    const item = fiscales[index];
    setEditingIndex(index);
    setFiscalData(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  // Validar datos fiscales
  const validateData = (): boolean => {
    const errs: ValidationErrors = {};
    let isValid = true;

    if (!fiscalData.razonSocial.trim()) {
      errs.razonSocial = "La razón social es requerida";
      isValid = false;
    }

    if (!fiscalData.rfc.trim()) {
      errs.rfc = "El RFC es requerido";
      isValid = false;
    } else if (!validarRFC(fiscalData.rfc)) {
      errs.rfc = "RFC inválido. Debe ser de 12 caracteres (Moral) o 13 (Física)";
      isValid = false;
    }

    if (!fiscalData.correoFactura.trim()) {
      errs.correoFactura = "El correo de facturación es requerido";
      isValid = false;
    } else if (!validarCorreo(fiscalData.correoFactura)) {
      errs.correoFactura = "El correo no es válido";
      isValid = false;
    }

    if (!fiscalData.regimenFiscalId) {
      errs.regimenFiscalId = "El régimen fiscal es requerido";
      isValid = false;
    }

    if (!fiscalData.cpFiscal.trim()) {
      errs.cpFiscal = "El código postal fiscal es requerido";
      isValid = false;
    } else if (!/^\d{5}$/.test(fiscalData.cpFiscal)) {
      errs.cpFiscal = "El código postal debe tener 5 dígitos";
      isValid = false;
    }

    if (!fiscalData.usoCfdiId) {
      errs.usoCfdiId = "El uso de CFDI es requerido";
      isValid = false;
    }

    if (!fiscalData.formaPagoId) {
      errs.formaPagoId = "La forma de pago es requerida";
      isValid = false;
    }

    if (!fiscalData.metodoPagoId) {
      errs.metodoPagoId = "El método de pago es requerido";
      isValid = false;
    }

    setValidationErrors(errs);
    return isValid;
  };

  // Guardar datos fiscales
  const handleSaveFiscal = async () => {
    if (!validateData()) {
      onError("Por favor completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);
    try {
      // Aquí implementarás la llamada al API para guardar los datos
      // const response = await axios.post('endpoint', fiscalData);
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 800));

      setFiscales(prev => {
        if (editingIndex !== null) {
          const copia = [...prev];
          copia[editingIndex] = fiscalData;
          return copia;
        }
        return [...prev, fiscalData];
      });

      onSuccess();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar datos de facturación:", error);
      onError("Error al guardar los datos de facturación");
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar registro
  const handleDelete = (index: number) => {
    if (window.confirm("¿Estás seguro de eliminar estos datos de facturación?")) {
      setFiscales(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Función auxiliar para obtener el texto del combo por ID
  const getComboText = (comboArray: IComboItem[], id: string): string => {
    const item = comboArray.find(c => c.valor === id);
    return item ? item.texto : id;
  };

  if (isLoadingCombos) {
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
          <MapPin className="me-2" size={20} />
          Datos de Facturación
        </h5>
        <Button className="hub-btn-gamer" onClick={handleAddNew}>
          <Plus size={18} className="me-2" />
          Agregar Datos
        </Button>
      </div>

      {/* Listado o vacío */}
      {fiscales.length === 0 ? (
        <Card className="bg-dark text-white border-secondary">
          <Card.Body className="text-center py-5">
            <MapPin size={48} className="text-secondary mb-3" />
            <p className="text-light mb-0">No hay datos de facturación registrados.</p>
            <p className="text-secondary small">Agrega un nuevo registro para continuar.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {fiscales.map((item, index) => (
            <Col key={index} md={6} lg={4} className="mb-3">
              <Card className="bg-dark text-white border-secondary h-100 address-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="text-white mb-1">{item.razonSocial}</h6>
                      <Badge bg="secondary" className="badge-address-type">Facturación</Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="btn-icon-action" 
                        onClick={() => handleEdit(index)} 
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="btn-icon-action" 
                        onClick={() => handleDelete(index)} 
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="address-details">
                    <p className="mb-1 text-light"><strong>RFC:</strong> {item.rfc}</p>
                    <p className="mb-1 text-light"><strong>Correo:</strong> {item.correoFactura}</p>
                    <p className="mb-1 text-light"><strong>Régimen:</strong> {getComboText(regimenesFiscales, item.regimenFiscalId)}</p>
                    <p className="mb-1 text-light"><strong>C.P. Fiscal:</strong> {item.cpFiscal}</p>
                    <p className="mb-1 text-light"><strong>Uso CFDI:</strong> {getComboText(usosCfdi, item.usoCfdiId)}</p>
                    <p className="mb-1 text-light"><strong>Forma de pago:</strong> {getComboText(formasPago, item.formaPagoId)}</p>
                    <p className="mb-1 text-light"><strong>Método de pago:</strong> {getComboText(metodosPago, item.metodoPagoId)}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal con datos fiscales */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="address-modal">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>
            {editingIndex !== null ? "Editar Datos de Facturación" : "Agregar Datos de Facturación"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formRazonSocial">
                <Form.Label>Razón Social *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre o Razón Social"
                  name="razonSocial"
                  value={fiscalData.razonSocial}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.razonSocial}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.razonSocial}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="formRFC">
                <Form.Label>RFC *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="RFC (12 o 13 caracteres)"
                  name="rfc"
                  value={fiscalData.rfc}
                  onChange={handleInputChange}
                  maxLength={13}
                  isInvalid={!!validationErrors.rfc}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.rfc}
                </Form.Control.Feedback>
                <Form.Text className="text-light profile-form-text">
                  12 caracteres para Persona Moral, 13 para Persona Física
                </Form.Text>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Label>&nbsp;</Form.Label>
              <Button
                variant="outline-light"
                className="w-100"
                onClick={setRFCGenerico}
                type="button"
              >
                RFC Genérico
              </Button>
            </Col> */}
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCorreoFactura">
                <Form.Label>Correo de Facturación *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="correo@ejemplo.com"
                  name="correoFactura"
                  value={fiscalData.correoFactura}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.correoFactura}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.correoFactura}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCpFiscal">
                <Form.Label>Código Postal Fiscal *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="5 dígitos"
                  name="cpFiscal"
                  value={fiscalData.cpFiscal}
                  onChange={handleInputChange}
                  maxLength={5}
                  isInvalid={!!validationErrors.cpFiscal}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.cpFiscal}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formRegimenFiscal">
                <Form.Label>Régimen Fiscal *</Form.Label>
                <Form.Select
                  name="regimenFiscalId"
                  value={fiscalData.regimenFiscalId}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.regimenFiscalId}
                >
                  <option value="">Selecciona un régimen fiscal</option>
                  {regimenesFiscales.map((regimen) => (
                    <option key={regimen.valor} value={regimen.valor}>
                      {regimen.texto}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.regimenFiscalId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formUsoCfdi">
                <Form.Label>Uso de CFDI *</Form.Label>
                <Form.Select
                  name="usoCfdiId"
                  value={fiscalData.usoCfdiId}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.usoCfdiId}
                >
                  <option value="">Selecciona un uso de CFDI</option>
                  {usosCfdi.map((uso) => (
                    <option key={uso.valor} value={uso.valor}>
                      {uso.texto}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.usoCfdiId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFormaPago">
                <Form.Label>Forma de Pago *</Form.Label>
                <Form.Select
                  name="formaPagoId"
                  value={fiscalData.formaPagoId}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.formaPagoId}
                >
                  <option value="">Selecciona una forma de pago</option>
                  {formasPago.map((forma) => (
                    <option key={forma.valor} value={forma.valor}>
                      {forma.texto}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.formaPagoId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMetodoPago">
                <Form.Label>Método de Pago *</Form.Label>
                <Form.Select
                  name="metodoPagoId"
                  value={fiscalData.metodoPagoId}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.metodoPagoId}
                >
                  <option value="">Selecciona un método de pago</option>
                  {metodosPago.map((metodo) => (
                    <option key={metodo.valor} value={metodo.valor}>
                      {metodo.texto}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.metodoPagoId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button 
            className="w-100 hub-btn-gamer" 
            onClick={handleSaveFiscal} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-grow spinner-grow-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Guardando...
              </>
            ) : (
              "Guardar Datos de Facturación"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BillingData;