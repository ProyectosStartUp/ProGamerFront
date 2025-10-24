import React, { useState, useEffect, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import type { IAddressData, IColonia, IMunicipio, ValidationErrors } from "../../../../interfaces/address";
import { MUNICIPIOS_DUMMY, getColoniasByCP, getMunicipioByCP } from "../../../../utils/address.data";


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
    alias: initialData?.alias || "",
    calle: initialData?.calle || "",
    numExt: initialData?.numExt || "",
    numInt: initialData?.numInt || "",
    codigoPostal: initialData?.codigoPostal || "",
    coloniaId: initialData?.coloniaId || "",
    municipioId: initialData?.municipioId || "",
    referencias: initialData?.referencias || ""
  });

  const [colonias, setColonias] = useState<IColonia[]>([]);
  const [municipios] = useState<IMunicipio[]>(MUNICIPIOS_DUMMY);

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
      // Obtener colonias por código postal
      const coloniasEncontradas = getColoniasByCP(cp);
      setColonias(coloniasEncontradas);
      
      // Auto-seleccionar municipio basado en el código postal
      const municipioId = getMunicipioByCP(cp);
      setAddressData(prev => ({ 
        ...prev, 
        municipioId,
        coloniaId: "" // Reset colonia cuando cambia el CP
      }));
    } else {
      setColonias([]);
      setAddressData(prev => ({ 
        ...prev, 
        coloniaId: "",
        municipioId: ""
      }));
    }
  };

  const validateData = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!addressData.alias.trim()) {
      errors.alias = "El alias de la dirección es requerido";
      isValid = false;
    }

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

    if (!addressData.coloniaId) {
      errors.coloniaId = "La colonia es requerida";
      isValid = false;
    }

    if (!addressData.municipioId) {
      errors.municipioId = "El municipio es requerido";
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
  const buttonText = isShippingAddress ? "Guardar Datos de Envío" : "Guardar Dirección Fiscal";

  return (
    <div className="mt-4">
      <Form.Group className="mb-3" controlId={`formAlias${tipoDireccion}`}>
        <Form.Label>Alias de Dirección *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej: Casa, Oficina, Casa de mamá..."
          value={addressData.alias}
          onChange={handleInputChange}
          name="alias"
          isInvalid={!!validationErrors.alias}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.alias}
        </Form.Control.Feedback>
        <Form.Text className="text-light profile-form-text">
          Agrega un nombre para identificar fácilmente esta dirección
        </Form.Text>
      </Form.Group>

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
              value={addressData.coloniaId}
              onChange={handleInputChange}
              name="coloniaId"
              disabled={colonias.length === 0}
              isInvalid={!!validationErrors.coloniaId}
            >
              <option value="">Selecciona una colonia</option>
              {colonias.map((colonia) => (
                <option key={colonia.id} value={colonia.id}>
                  {colonia.descripcion}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.coloniaId}
            </Form.Control.Feedback>
            {addressData.codigoPostal.length === 5 && colonias.length === 0 && (
              <Form.Text className="text-light profile-form-text">
                No se encontraron colonias para este código postal
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId={`formMunicipio${tipoDireccion}`}>
        <Form.Label>Municipio *</Form.Label>
        <Form.Select
          value={addressData.municipioId}
          onChange={handleInputChange}
          name="municipioId"
          isInvalid={!!validationErrors.municipioId}
        >
          <option value="">Selecciona un municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.id} value={municipio.id}>
              {municipio.descripcion}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {validationErrors.municipioId}
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