import React, { useState, useEffect, type ChangeEvent } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { IComboItem, IFiscalData, IDataBilling, IFiscalDataResponse, ValidationErrors } from "../../../../interfaces/billing";

interface BillingFormModalProps {
  show: boolean;
  onHide: () => void;
  idCliente: string;
  editingBilling: IFiscalDataResponse | null;
  formasPago: IComboItem[];
  metodosPago: IComboItem[];
  regimenesFiscales: IComboItem[];
  usosCfdi: IComboItem[];
  onSuccess: () => void;
  onError: (message: string) => void;
}

const BillingFormModal: React.FC<BillingFormModalProps> = ({
  show,
  onHide,
  idCliente,
  editingBilling,
  formasPago,
  metodosPago,
  regimenesFiscales,
  usosCfdi,
  onSuccess,
  onError,
}) => {
  const [currentEndpoint, setCurrentEndpoint] = useState("DatosFacturacionClientes/Agregar");

  const [fiscalData, setFiscalData] = useState<IFiscalData>({
    idCliente: idCliente,
    razonSocial: "",
    rfc: "",
    correoFacturacion: "",
    idRegimenFiscal: "",
    codigoPostal: "",
    idUsoCfdi: "",
    idFormaPago: "",
    idMetodoPago: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const {
    postData: saveBilling,
    isLoading: isSaving,
    error: errorSaving,
  } = usePostGenericHook<IDataBilling, IRespuesta<any>>(currentEndpoint);

  useEffect(() => {
    if (errorSaving) {
      onError(errorSaving);
    }
  }, [errorSaving, onError]);

  useEffect(() => {
    if (editingBilling) {
      setCurrentEndpoint("DatosFacturacionClientes/Actualizar");
      setFiscalData({
        id: editingBilling.idDatoFacturacion,
        idCliente: editingBilling.idCliente,
        razonSocial: editingBilling.razonSocial,
        rfc: editingBilling.rfc,
        correoFacturacion: editingBilling.correo,
        idRegimenFiscal: editingBilling.idRegimen,
        codigoPostal: editingBilling.cpFiscal,
        idUsoCfdi: editingBilling.idUsoCfdi || "",
        idFormaPago: editingBilling.idFormaPago,
        idMetodoPago: editingBilling.idMetodoPago,
      });
    } else {
      setCurrentEndpoint("DatosFacturacionClientes/Agregar");
      setFiscalData({
        idCliente: idCliente,
        razonSocial: "",
        rfc: "",
        correoFacturacion: "",
        idRegimenFiscal: "",
        codigoPostal: "",
        idUsoCfdi: "",
        idFormaPago: "",
        idMetodoPago: "",
      });
    }
    setValidationErrors({});
  }, [editingBilling, idCliente]);

  const validarRFC = (rfcValue: string): boolean => {
    if (rfcValue === "XAXX010101000") return true;
    const rfcMoralRegex = /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/;
    const rfcFisicaRegex = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcMoralRegex.test(rfcValue) || rfcFisicaRegex.test(rfcValue);
  };

  const validarCorreo = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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

    if (name === "codigoPostal") {
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

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

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

    if (!fiscalData.correoFacturacion.trim()) {
      errs.correoFacturacion = "El correo de facturación es requerido";
      isValid = false;
    } else if (!validarCorreo(fiscalData.correoFacturacion)) {
      errs.correoFacturacion = "El correo no es válido";
      isValid = false;
    }

    if (!fiscalData.idRegimenFiscal) {
      errs.idRegimenFiscal = "El régimen fiscal es requerido";
      isValid = false;
    }

    if (!fiscalData.codigoPostal.trim()) {
      errs.codigoPostal = "El código postal fiscal es requerido";
      isValid = false;
    } else if (!/^\d{5}$/.test(fiscalData.codigoPostal)) {
      errs.codigoPostal = "El código postal debe tener 5 dígitos";
      isValid = false;
    }

    if (!fiscalData.idUsoCfdi) {
      errs.idUsoCfdi = "El uso de CFDI es requerido";
      isValid = false;
    }

    if (!fiscalData.idFormaPago) {
      errs.idFormaPago = "La forma de pago es requerida";
      isValid = false;
    }

    if (!fiscalData.idMetodoPago) {
      errs.idMetodoPago = "El método de pago es requerido";
      isValid = false;
    }

    setValidationErrors(errs);
    return isValid;
  };

  const getComboText = (comboArray: IComboItem[], id: string | null): string => {
    if (!id) return "No especificado";
    const item = comboArray.find(c => c.valor === id);
    return item ? item.texto : id;
  };

  const handleSave = async () => {
    if (!validateData()) {
      onError("Por favor completa todos los campos correctamente");
      return;
    }

    try {
      const dataToSend: IDataBilling = {
        idCliente: idCliente,
        idDatoFacturacion: fiscalData.id || "",
        razonSocial: fiscalData.razonSocial,
        rfc: fiscalData.rfc,
        correo: fiscalData.correoFacturacion,
        cpFiscal: fiscalData.codigoPostal,
        idRegimen: fiscalData.idRegimenFiscal,
        regimen: getComboText(regimenesFiscales, fiscalData.idRegimenFiscal),
        idUsoCfdi: fiscalData.idUsoCfdi,
        usoCfdi: getComboText(usosCfdi, fiscalData.idUsoCfdi),
        idFormaPago: fiscalData.idFormaPago,
        formaPago: getComboText(formasPago, fiscalData.idFormaPago),
        idMetodoPago: fiscalData.idMetodoPago,
        metodoPago: getComboText(metodosPago, fiscalData.idMetodoPago),
      };

      const response = await saveBilling(dataToSend);

      if (response && response.exito) {
        onSuccess();
      } else {
        onError(response?.mensaje || "Error al guardar los datos de facturación");
      }
    } catch (error) {
      console.error("Error al guardar datos de facturación:", error);
      onError("Error al guardar los datos de facturación");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="address-modal">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>
          {editingBilling ? "Editar Datos de Facturación" : "Agregar Datos de Facturación"}
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
                disabled={isSaving}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.razonSocial}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
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
                disabled={isSaving}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.rfc}
              </Form.Control.Feedback>
              <Form.Text className="text-light profile-form-text">
                12 caracteres para Persona Moral, 13 para Persona Física
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formCorreoFactura">
              <Form.Label>Correo de Facturación *</Form.Label>
              <Form.Control
                type="email"
                placeholder="correo@ejemplo.com"
                name="correoFacturacion"
                value={fiscalData.correoFacturacion}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.correoFacturacion}
                disabled={isSaving}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.correoFacturacion}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCpFiscal">
              <Form.Label>Código Postal Fiscal *</Form.Label>
              <Form.Control
                type="text"
                placeholder="5 dígitos"
                name="codigoPostal"
                value={fiscalData.codigoPostal}
                onChange={handleInputChange}
                maxLength={5}
                isInvalid={!!validationErrors.codigoPostal}
                disabled={isSaving}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.codigoPostal}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formRegimenFiscal">
              <Form.Label>Régimen Fiscal *</Form.Label>
              <Form.Select
                name="idRegimenFiscal"
                value={fiscalData.idRegimenFiscal}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.idRegimenFiscal}
                disabled={isSaving}
              >
                <option value="">Selecciona un régimen fiscal</option>
                {regimenesFiscales.map((regimen) => (
                  <option key={regimen.valor} value={regimen.valor}>
                    {regimen.texto}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idRegimenFiscal}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formUsoCfdi">
              <Form.Label>Uso de CFDI *</Form.Label>
              <Form.Select
                name="idUsoCfdi"
                value={fiscalData.idUsoCfdi}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.idUsoCfdi}
                disabled={isSaving}
              >
                <option value="">Selecciona un uso de CFDI</option>
                {usosCfdi.map((uso) => (
                  <option key={uso.valor} value={uso.valor}>
                    {uso.texto}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idUsoCfdi}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formFormaPago">
              <Form.Label>Forma de Pago *</Form.Label>
              <Form.Select
                name="idFormaPago"
                value={fiscalData.idFormaPago}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.idFormaPago}
                disabled={isSaving}
              >
                <option value="">Selecciona una forma de pago</option>
                {formasPago.map((forma) => (
                  <option key={forma.valor} value={forma.valor}>
                    {forma.texto}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idFormaPago}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formMetodoPago">
              <Form.Label>Método de Pago *</Form.Label>
              <Form.Select
                name="idMetodoPago"
                value={fiscalData.idMetodoPago}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.idMetodoPago}
                disabled={isSaving}
              >
                <option value="">Selecciona un método de pago</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.valor} value={metodo.valor}>
                    {metodo.texto}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idMetodoPago}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button 
          id="btnGuardarDataBilling"
          className="w-100 hub-btn-gamer" 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span
                className="spinner-grow spinner-grow-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {editingBilling ? "Actualizando..." : "Guardando..."}
            </>
          ) : (
            editingBilling ? "Actualizar Datos de Facturación" : "Guardar Datos de Facturación"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillingFormModal;