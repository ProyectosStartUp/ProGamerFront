import React, { useState, type ChangeEvent } from "react";
import { Container, Row, Col, Card, Button, Modal, Badge, Form } from "react-bootstrap";
import { Trash2, Edit2, MapPin, Plus } from "lucide-react";
import { useAuthStore } from "../../../../store/useAuthStore";
import "./styles/AddressManager.css";
import "./styles/Profile.css";

interface ValidationErrors {
  rfc?: string;
  razonSocial?: string;
  correoFactura?: string;
  regimenFiscal?: string;
  cpFiscal?: string;
  usoCfdi?: string;
  formaPago?: string;
}

interface IFiscalData {
  razonSocial: string;
  rfc: string;
  correoFactura: string;
  regimenFiscal: string;
  cpFiscal: string;
  usoCfdi: string;
  formaPago: string;
}

interface BillingDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const BillingData: React.FC<BillingDataTabProps> = ({ onSuccess, onError }) => {
  const { nombreUsuario } = useAuthStore();

  // Listado de registros fiscales (local, simulado)
  const [fiscales, setFiscales] = useState<IFiscalData[]>([]);

  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Índice en edición
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Campos fiscales
  const [razonSocial, setRazonSocial] = useState("");
  const [rfc, setRfc] = useState("");
  const [correoFactura, setCorreoFactura] = useState("");
  const [regimenFiscal, setRegimenFiscal] = useState("");
  const [cpFiscal, setCpFiscal] = useState("");
  const [usoCfdi, setUsoCfdi] = useState("");
  const [formaPago, setFormaPago] = useState("");

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validarRFC = (rfcValue: string): boolean => {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfcValue);
  };

  const validarCorreo = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRfcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rfcValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (rfcValue.length <= 13) setRfc(rfcValue);
    if (validationErrors.rfc) setValidationErrors(prev => ({ ...prev, rfc: undefined }));
  };

  const handleCpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 5) setCpFiscal(value);
    if (validationErrors.cpFiscal) setValidationErrors(prev => ({ ...prev, cpFiscal: undefined }));
  };

  const resetFields = () => {
    setRazonSocial("");
    setRfc("");
    setCorreoFactura("");
    setRegimenFiscal("");
    setCpFiscal("");
    setUsoCfdi("");
    setFormaPago("");
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
    setRazonSocial(item.razonSocial);
    setRfc(item.rfc);
    setCorreoFactura(item.correoFactura);
    setRegimenFiscal(item.regimenFiscal);
    setCpFiscal(item.cpFiscal);
    setUsoCfdi(item.usoCfdi);
    setFormaPago(item.formaPago);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIndex(null);
  };

  // Guardar datos fiscales (sin AddressForm)
  const handleSaveFiscal = async () => {
    const errs: ValidationErrors = {};

    if (!razonSocial.trim()) errs.razonSocial = "La razón social o nombre es requerido";

    if (!rfc.trim()) errs.rfc = "El RFC es requerido";
    else if (!validarRFC(rfc)) errs.rfc = "El RFC no tiene un formato válido";

    if (!correoFactura.trim()) errs.correoFactura = "El correo de facturación es requerido";
    else if (!validarCorreo(correoFactura)) errs.correoFactura = "El correo no es válido";

    if (!regimenFiscal.trim()) errs.regimenFiscal = "El régimen fiscal es requerido";

    if (!cpFiscal.trim()) errs.cpFiscal = "El código postal fiscal es requerido";
    else if (!/^\d{5}$/.test(cpFiscal)) errs.cpFiscal = "El código postal debe tener 5 dígitos";

    if (!usoCfdi.trim()) errs.usoCfdi = "El uso de CFDI es requerido";
    if (!formaPago.trim()) errs.formaPago = "La forma de pago es requerida";

    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      onError("Por favor completa los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 800));

      const nuevo: IFiscalData = {
        razonSocial,
        rfc,
        correoFactura,
        regimenFiscal,
        cpFiscal,
        usoCfdi,
        formaPago,
      };

      setFiscales(prev => {
        if (editingIndex !== null) {
          const copia = [...prev];
          copia[editingIndex] = nuevo;
          return copia;
        }
        return [...prev, nuevo];
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
                      <Button variant="outline-light" size="sm" className="btn-icon-action" onClick={() => handleEdit(index)} title="Editar">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="btn-icon-action" onClick={() => handleDelete(index)} title="Eliminar">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="address-details">
                    <p className="mb-1 text-light"><strong>RFC:</strong> {item.rfc}</p>
                    <p className="mb-1 text-light"><strong>Correo:</strong> {item.correoFactura}</p>
                    <p className="mb-1 text-light"><strong>Régimen:</strong> {item.regimenFiscal}</p>
                    <p className="mb-1 text-light"><strong>C.P. Fiscal:</strong> {item.cpFiscal}</p>
                    <p className="mb-1 text-light"><strong>Uso CFDI:</strong> {item.usoCfdi}</p>
                    <p className="mb-1 text-light"><strong>Forma de pago:</strong> {item.formaPago}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal solo con datos fiscales */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="address-modal">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>{editingIndex !== null ? "Editar Datos de Facturación" : "Agregar Datos de Facturación"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formRazonSocial">
                <Form.Label>Razón social o nombre *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Razón social o nombre"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  isInvalid={!!validationErrors.razonSocial}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.razonSocial}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCorreoFactura">
                <Form.Label>Correo de facturación *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correoFactura}
                  onChange={(e) => setCorreoFactura(e.target.value)}
                  isInvalid={!!validationErrors.correoFactura}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.correoFactura}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formRFC">
                <Form.Label>RFC *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="RFC (12 o 13 caracteres)"
                  value={rfc}
                  onChange={handleRfcChange}
                  name="rfc"
                  maxLength={13}
                  isInvalid={!!validationErrors.rfc}
                  className="profile-rfc-input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.rfc}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCpFiscal">
                <Form.Label>Código Postal Domicilio Fiscal *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Código Postal (5 dígitos)"
                  value={cpFiscal}
                  onChange={handleCpChange}
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
                <Form.Label>Régimen fiscal *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Régimen fiscal"
                  value={regimenFiscal}
                  onChange={(e) => setRegimenFiscal(e.target.value)}
                  isInvalid={!!validationErrors.regimenFiscal}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.regimenFiscal}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formFormaPago">
                <Form.Label>Forma de pago *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Forma de pago"
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  isInvalid={!!validationErrors.formaPago}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.formaPago}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formUsoCfdi">
                <Form.Label>Uso de CFDI *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Uso de CFDI"
                  value={usoCfdi}
                  onChange={(e) => setUsoCfdi(e.target.value)}
                  isInvalid={!!validationErrors.usoCfdi}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.usoCfdi}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button className="hub-btn-gamer" onClick={handleSaveFiscal} disabled={isLoading}>
            {editingIndex !== null ? "Guardar cambios" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BillingData;