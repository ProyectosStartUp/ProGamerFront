import React, { useState, useEffect, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export interface IAddressData {
  usuarioId: string;
  tipoDireccion: 1 | 2; // 1 = Envío, 2 = Facturación
  calle: string;
  numExt: string;
  numInt: string;
  codigoPostal: string;
  colonia: string;
  municipio: string;
  referencias?: string; // Solo para direcciones de envío
}

interface ValidationErrors {
  calle?: string;
  numExt?: string;
  codigoPostal?: string;
  colonia?: string;
  municipio?: string;
}

interface AddressFormProps {
  tipoDireccion: 1 | 2;
  usuarioId: string;
  initialData?: Partial<IAddressData>;
  onSave: (data: IAddressData) => Promise<void>;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  tipoDireccion,
  usuarioId,
  initialData,
  onSave,
  isLoading
}) => {
  const [addressData, setAddressData] = useState<IAddressData>({
    usuarioId,
    tipoDireccion,
    calle: initialData?.calle || "",
    numExt: initialData?.numExt || "",
    numInt: initialData?.numInt || "",
    codigoPostal: initialData?.codigoPostal || "",
    colonia: initialData?.colonia || "",
    municipio: initialData?.municipio || "",
    referencias: initialData?.referencias || ""
  });

  const [colonias, setColonias] = useState<string[]>([]);
  const [municipios] = useState<string[]>([
    "Pachuca de Soto",
    "Mineral de la Reforma",
    "Tulancingo",
    "Tizayuca",
    "Huejutla de Reyes"
  ]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setAddressData(prev => ({ ...prev, usuarioId }));
  }, [usuarioId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "codigoPostal") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 5) {
        setAddressData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setAddressData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCPChange = async (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    const cp = e.target.value;

    if (cp.length === 5) {
      // TODO: Llamar al API para obtener colonias
      setColonias([
        "Centro",
        "Revolución",
        "Periodistas",
        "Electricistas",
        "Venta Prieta"
      ]);
    } else {
      setColonias([]);
      setAddressData(prev => ({ ...prev, colonia: "" }));
    }
  };

  const validateData = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!addressData.calle.trim()) {
      errors.calle = "La calle es requerida";
      isValid = false;
    }

    if (!addressData.numExt.trim()) {
      errors.numExt = "El número exterior es requerido";
      isValid = false;
    }

    if (!addressData.codigoPostal) {
      errors.codigoPostal = "El código postal es requerido";
      isValid = false;
    } else if (addressData.codigoPostal.length !== 5) {
      errors.codigoPostal = "El código postal debe tener 5 dígitos";
      isValid = false;
    }

    if (!addressData.colonia) {
      errors.colonia = "La colonia es requerida";
      isValid = false;
    }

    if (!addressData.municipio) {
      errors.municipio = "El municipio es requerido";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateData()) {
      return;
    }

    await onSave(addressData);
  };

  const isShippingAddress = tipoDireccion === 1;
  // const titleText = isShippingAddress ? "Datos de Envío" : "Dirección Fiscal";
  const buttonText = isShippingAddress ? "Guardar Datos de Envío" : "Guardar Dirección Fiscal";

  return (
    <div className="mt-4">
      {/* <h5 className="text-white profile-section-title">{titleText}</h5> */}

      <Form.Group className="mb-3" controlId={`formCalle${tipoDireccion}`}>
        <Form.Label>Calle *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre de la calle"
          value={addressData.calle}
          onChange={handleInputChange}
          name="calle"
          isInvalid={!!validationErrors.calle}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.calle}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formNumExt${tipoDireccion}`}>
            <Form.Label>Número Exterior *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Núm. Ext."
              value={addressData.numExt}
              onChange={handleInputChange}
              name="numExt"
              isInvalid={!!validationErrors.numExt}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.numExt}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formNumInt${tipoDireccion}`}>
            <Form.Label>Número Interior</Form.Label>
            <Form.Control
              type="text"
              placeholder="Núm. Int. (opcional)"
              value={addressData.numInt}
              onChange={handleInputChange}
              name="numInt"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formCodigoPostal${tipoDireccion}`}>
            <Form.Label>Código Postal *</Form.Label>
            <Form.Control
              type="text"
              placeholder="5 dígitos"
              value={addressData.codigoPostal}
              onChange={handleCPChange}
              name="codigoPostal"
              maxLength={5}
              isInvalid={!!validationErrors.codigoPostal}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.codigoPostal}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formColonia${tipoDireccion}`}>
            <Form.Label>Colonia *</Form.Label>
            <Form.Select
              value={addressData.colonia}
              onChange={handleInputChange}
              name="colonia"
              disabled={colonias.length === 0}
              isInvalid={!!validationErrors.colonia}
            >
              <option value="">Selecciona una colonia</option>
              {colonias.map((colonia, index) => (
                <option key={index} value={colonia}>
                  {colonia}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.colonia}
            </Form.Control.Feedback>
            {addressData.codigoPostal.length === 5 && colonias.length === 0 && (
              <Form.Text className="text-light profile-form-text">
                Buscando colonias...
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId={`formMunicipio${tipoDireccion}`}>
        <Form.Label>Municipio *</Form.Label>
        <Form.Select
          value={addressData.municipio}
          onChange={handleInputChange}
          name="municipio"
          isInvalid={!!validationErrors.municipio}
        >
          <option value="">Selecciona un municipio</option>
          {municipios.map((municipio, index) => (
            <option key={index} value={municipio}>
              {municipio}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {validationErrors.municipio}
        </Form.Control.Feedback>
      </Form.Group>

      {isShippingAddress && (
        <Form.Group className="mb-4" controlId={`formReferencias${tipoDireccion}`}>
          <Form.Label>Referencias</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Escribe referencias para encontrar tu domicilio (opcional)"
            value={addressData.referencias}
            onChange={handleInputChange}
            name="referencias"
            className="profile-textarea"
          />
          <Form.Text className="text-light profile-form-text">
            Ejemplo: Entre las calles X y Y, cerca del parque...
          </Form.Text>
        </Form.Group>
      )}

      <Button
        type="submit"
        className="w-100 hub-btn-gamer"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-grow spinner-grow-sm profile-spinner"
              role="status"
              aria-hidden="true"
            ></span>
            Guardando...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
};

export default AddressForm;