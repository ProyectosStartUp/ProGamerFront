import React, { useState, useEffect, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import type { IAddressData, ValidationErrors,IColoniaData } from "../../../../interfaces/address";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import axi from "../../../../services/apiClient";

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

  const [colonias, setColonias] = useState<IColoniaData[]>([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoadingColonias, setIsLoadingColonias] = useState<boolean>(false);

  useEffect(() => {
    setAddressData(prev => ({ ...prev, usuarioId }));
  }, [usuarioId]);

  const fetchColonias = async (cp: string) => {
    if (cp.length !== 5) return;

    setIsLoadingColonias(true);
    try {
      const response = await axi.get<IRespuesta<IColoniaData[]>>(`Direcciones/GetColonias/${cp}`);
      
      if (response.data.exito && response.data.data) {
        let coloniasArray: IColoniaData[] = [];
        
        // Verificar si response.data.data es un array
        if (Array.isArray(response.data.data)) {
          // Verificar si el primer elemento es un array (array de arrays)
          if (response.data.data.length > 0 && Array.isArray(response.data.data[0])) {
            coloniasArray = (response.data.data as any).flat() as IColoniaData[];
          } else {
            // Es un array simple de IColoniaData
            coloniasArray = response.data.data as IColoniaData[];
          }
        }
        
        if (coloniasArray.length > 0) {
          setColonias(coloniasArray);
          
          // Auto-seleccionar el municipio (todos tienen el mismo municipio)
          const primerColonia = coloniasArray[0];
          setMunicipioSeleccionado(primerColonia.municipio);
          
          setAddressData(prev => ({ 
            ...prev, 
            municipioId: primerColonia.idMunicipio.toString(),
            coloniaId: "" // Reset colonia para que el usuario seleccione
          }));
        } else {
          setColonias([]);
          setMunicipioSeleccionado("");
          setAddressData(prev => ({ 
            ...prev, 
            coloniaId: "",
            municipioId: ""
          }));
        }
      } else {
        setColonias([]);
        setMunicipioSeleccionado("");
        setAddressData(prev => ({ 
          ...prev, 
          coloniaId: "",
          municipioId: ""
        }));
      }
    } catch (error) {
      console.error('Error al obtener colonias:', error);
      setColonias([]);
      setMunicipioSeleccionado("");
      setAddressData(prev => ({ 
        ...prev, 
        coloniaId: "",
        municipioId: ""
      }));
    } finally {
      setIsLoadingColonias(false);
    }
  };

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
      // Buscar colonias cuando el CP tenga 5 dígitos
      await fetchColonias(cp);
    } else {
      setColonias([]);
      setMunicipioSeleccionado("");
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
            {isLoadingColonias && (
              <Form.Text className="text-light profile-form-text">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Buscando colonias...
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formColonia${tipoDireccion}`}>
            <Form.Label>Colonia *</Form.Label>
            <Form.Select
              value={addressData.coloniaId}
              onChange={handleInputChange}
              name="coloniaId"
              disabled={colonias.length === 0 || isLoadingColonias}
              isInvalid={!!validationErrors.coloniaId}
            >
              <option value="">Selecciona una colonia</option>
              {colonias.map((colonia) => (
                <option key={colonia.idColonia} value={colonia.idColonia}>
                  {colonia.colonia}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.coloniaId}
            </Form.Control.Feedback>
            {addressData.codigoPostal.length === 5 && colonias.length === 0 && !isLoadingColonias && (
              <Form.Text className="text-light profile-form-text">
                No se encontraron colonias para este código postal
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId={`formMunicipio${tipoDireccion}`}>
        <Form.Label>Municipio *</Form.Label>
        <Form.Control
          type="text"
          value={municipioSeleccionado}
          readOnly
          disabled
          placeholder="Se auto-completará con el código postal"
          isInvalid={!!validationErrors.municipioId}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.municipioId}
        </Form.Control.Feedback>
        <Form.Text className="text-light profile-form-text">
          El municipio se selecciona automáticamente al ingresar el código postal
        </Form.Text>
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