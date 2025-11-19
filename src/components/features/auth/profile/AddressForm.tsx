import React, { useState, useEffect, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IAddressData, ValidationErrors, IColoniaData, ISendDataAddress } from "../../../../interfaces/address";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import axi from "../../../../services/apiClient";

interface AddressFormProps {
  tipoDireccion: 1 | 2;
  usuarioId: string;
  initialData?: Partial<IAddressData>;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  tipoDireccion,
  usuarioId,
  initialData,
  onSuccess,
  onError
}) => {
  const [addressData, setAddressData] = useState<IAddressData>({
    idCliente: initialData?.idCliente || usuarioId || "",
    idDireccion: initialData?.idDireccion || "",
    aliasDireccion: initialData?.aliasDireccion || "",
    calle: initialData?.calle || "",
    numExt: initialData?.numExt || "",
    numInt: initialData?.numInt || "",
    codigoPostal: initialData?.codigoPostal || "",
    idCp: initialData?.idCp || "",
    municipioId: initialData?.municipioId || "",
    referencias: initialData?.referencias || "",
    esFiscal: tipoDireccion === 2,
  });

  const [colonias, setColonias] = useState<IColoniaData[]>([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>(initialData?.municipio || "");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>(initialData?.entidadFva || "");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoadingColonias, setIsLoadingColonias] = useState<boolean>(false);

  // Determinar el endpoint según si es edición o creación
  const endpoint = initialData?.idDireccion ? "Direcciones/Actualizar" : "Direcciones/Agregar";

  // Hook para guardar/actualizar dirección
  const { postData, isLoading, error } = usePostGenericHook<ISendDataAddress, IRespuesta<any>>(
    endpoint
  );

  useEffect(() => {
    setAddressData(prev => ({ ...prev, idCliente: usuarioId }));
  }, [usuarioId]);

  // Cargar colonias si hay código postal inicial (modo edición)
  useEffect(() => {
    if (initialData?.codigoPostal && initialData.codigoPostal.length === 5) {
      fetchColonias(initialData.codigoPostal);
    }
  }, [initialData?.codigoPostal]);

  // Manejar errores del hook
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const fetchColonias = async (cp: string) => {
    if (cp.length !== 5) return;

    setIsLoadingColonias(true);
    try {
      const response = await axi.get<IRespuesta<IColoniaData[]>>(`Direcciones/GetColonias/${cp}`);
      
      if (response.data.exito && response.data.data) {
        let coloniasArray: IColoniaData[] = [];
        
        if (Array.isArray(response.data.data)) {
          if (response.data.data.length > 0 && Array.isArray(response.data.data[0])) {
            coloniasArray = (response.data.data as any).flat() as IColoniaData[];
          } else {
            coloniasArray = response.data.data as IColoniaData[];
          }
        }
        
        if (coloniasArray.length > 0) {
          setColonias(coloniasArray);
          
          const primerColonia = coloniasArray[0];
          setMunicipioSeleccionado(primerColonia.municipio);
          setEstadoSeleccionado(primerColonia.entidad);
          
          // Si es modo edición y ya tiene idCp, mantenerlo
          if (!initialData?.idCp) {
            setAddressData(prev => ({ 
              ...prev, 
              municipioId: primerColonia.idMunicipio.toString(),
              idCp: ""
            }));
          } else {
            setAddressData(prev => ({ 
              ...prev, 
              municipioId: primerColonia.idMunicipio.toString()
            }));
          }
        } else {
          setColonias([]);
          setMunicipioSeleccionado("");
          setEstadoSeleccionado("");
          setAddressData(prev => ({ 
            ...prev, 
            idCp: "",
            municipioId: ""
          }));
        }
      } else {
        setColonias([]);
        setMunicipioSeleccionado("");
        setEstadoSeleccionado("");
        setAddressData(prev => ({ 
          ...prev, 
          idCp: "",
          municipioId: ""
        }));
      }
    } catch (error) {
      console.error('Error al obtener colonias:', error);
      setColonias([]);
      setMunicipioSeleccionado("");
      setEstadoSeleccionado("");
      setAddressData(prev => ({ 
        ...prev, 
        idCp: "",
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
      await fetchColonias(cp);
    } else {
      setColonias([]);
      setMunicipioSeleccionado("");
      setEstadoSeleccionado("");
      setAddressData(prev => ({ 
        ...prev, 
        idCp: "",
        municipioId: ""
      }));
    }
  };

  const validateData = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!addressData.aliasDireccion.trim()) {
      errors.aliasDireccion = "El alias de la dirección es requerido";
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

    if (!addressData.idCp) {
      errors.idCp = "La colonia es requerida";
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
      onError("Por favor, completa todos los campos correctamente");
      return;
    }

    try {
      const dataToSend: ISendDataAddress = {
        idCliente: addressData.idCliente,
        idDireccion: addressData.idDireccion || "",
        aliasDireccion: addressData.aliasDireccion,
        calle: addressData.calle,
        numExt: addressData.numExt,
        numInt: addressData.numInt,
        idCp: parseInt(addressData.idCp.toString()),
        referencias: addressData.referencias || "",
        esFiscal: false
      };

      const response = await postData(dataToSend);

      if (response && response.exito) {
        onSuccess();
      } else {
        onError(response?.mensaje || "Error al guardar la dirección");
      }
    } catch (error) {
      onError("Error al guardar la dirección");
    }
  };

  const isShippingAddress = tipoDireccion === 1;
  const buttonText = initialData?.idDireccion 
    ? (isShippingAddress ? "Actualizar Datos de Envío" : "Actualizar Dirección Fiscal")
    : (isShippingAddress ? "Guardar Datos de Envío" : "Guardar Dirección Fiscal");

  return (
    <div className="mt-4">
      <Form.Group className="mb-3" controlId={`formAlias${tipoDireccion}`}>
        <Form.Label>Alias de Dirección *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej: Casa, Oficina, Casa de mamá..."
          value={addressData.aliasDireccion}
          onChange={handleInputChange}
          name="aliasDireccion"
          isInvalid={!!validationErrors.aliasDireccion}
          disabled={isLoading}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.aliasDireccion}
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
          disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              value={addressData.idCp}
              onChange={handleInputChange}
              name="idCp"
              disabled={colonias.length === 0 || isLoadingColonias || isLoading}
              isInvalid={!!validationErrors.idCp}
            >
              <option value="">Selecciona una colonia</option>
              {colonias.map((colonia) => (
                <option key={colonia.idColonia} value={colonia.idColonia}>
                  {colonia.colonia}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.idCp}
            </Form.Control.Feedback>
            {addressData.codigoPostal.length === 5 && colonias.length === 0 && !isLoadingColonias && (
              <Form.Text className="text-light profile-form-text">
                No se encontraron colonias para este código postal
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formMunicipio${tipoDireccion}`}>
            <Form.Label>Municipio</Form.Label>
            <Form.Control
              type="text"
              value={municipioSeleccionado}
              readOnly
              disabled
              placeholder="Se auto-completará con el código postal"
            />
            <Form.Text className="text-light profile-form-text">
              Se selecciona automáticamente con el código postal
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId={`formEstado${tipoDireccion}`}>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              value={estadoSeleccionado}
              readOnly
              disabled
              placeholder="Se auto-completará con el código postal"
            />
            <Form.Text className="text-light profile-form-text">
              Se selecciona automáticamente con el código postal
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

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
            disabled={isLoading}
          />
          <Form.Text className="text-light profile-form-text">
            Ejemplo: Entre las calles X y Y, cerca del parque...
          </Form.Text>
        </Form.Group>
      )}

      <Button
        id="btnGuardaDireccion"
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