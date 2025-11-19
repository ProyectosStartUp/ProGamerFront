import React, { useState, useEffect, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Edit2 } from "lucide-react";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { IPersonalData, ISendDataPersonal } from "../../../../interfaces/clientes";
import "./styles/Profile.css";

interface ValidationErrors {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

interface PersonalDataTabProps {
  initialData: IPersonalData;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ 
  initialData,
  onSuccess, 
  onError 
}) => {
  const [personalData, setPersonalData] = useState<IPersonalData>(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);

  // Hook para guardar datos personales
  const { postData, isLoading, error } = usePostGenericHook<ISendDataPersonal, IRespuesta<any>>(
    "Clientes/Actualizar"
  );

  // Actualizar el estado cuando cambien los datos iniciales
  useEffect(() => {
    console.log('initialData',initialData);
    
    setPersonalData(initialData);
    
    // Verificar si ya existen datos personales (si al menos el nombre tiene valor)
    const dataExists = !!(
      initialData.nombres?.trim() || 
      initialData.apellidoPaterno?.trim() || 
      initialData.apellidoMaterno?.trim() || 
      initialData.telefono?.trim()
    );
    
    setHasExistingData(dataExists);
    setIsEditMode(!dataExists); // Si no hay datos, activar modo edición
  }, [initialData]);

  // Manejar errores del hook
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setPersonalData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setPersonalData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateData = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!personalData.nombres.trim()) {
      errors.nombres = "El nombre es requerido";
      isValid = false;
    }

    if (!personalData.apellidoPaterno.trim()) {
      errors.apellidoPaterno = "El apellido paterno es requerido";
      isValid = false;
    }

    if (!personalData.apellidoMaterno.trim()) {
      errors.apellidoMaterno = "El apellido materno es requerido";
      isValid = false;
    }

    if (!personalData.telefono) {
      errors.telefono = "El teléfono es requerido";
      isValid = false;
    } else if (personalData.telefono.length !== 10) {
      errors.telefono = "El teléfono debe tener 10 dígitos";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    setPersonalData(initialData);
    setValidationErrors({});
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!validateData()) {
      onError("Por favor, completa todos los campos correctamente");
      return;
    }

    try {
      // Mapear los datos al formato que espera el API
      const dataToSend: ISendDataPersonal = {
        idUsuario: personalData.idUsuario,
        idCliente: personalData.id,
        nombre: personalData.nombres,
        apellidoP: personalData.apellidoPaterno,
        apellidoM: personalData.apellidoMaterno,
        telefono: personalData.telefono,
        pathFoto:personalData.pathFoto,
        
      };

      const response = await postData(dataToSend);

      if (response && response.exito) {
        setHasExistingData(true);
        setIsEditMode(false);
        onSuccess();
      } else {
        onError(response?.mensaje || "Error al guardar los datos personales");
      }
    } catch (error) {
      onError("Error al guardar los datos personales");
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-white profile-section-title mb-0">Datos Personales</h5>
        {hasExistingData && !isEditMode && (
          <Button
            id="btnEditarPersonalData"
            variant="outline-light"
            size="sm"
            onClick={handleEditClick}
            className="d-flex align-items-center gap-2"
          >
            <Edit2 size={16} />
            Editar
          </Button>
        )}
      </div>

      <Form.Group className="mb-3" controlId="formNombres">
        <Form.Label>Nombres *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu(s) nombre(s)"
          value={personalData.nombres}
          onChange={handleInputChange}
          name="nombres"
          isInvalid={!!validationErrors.nombres}
          disabled={isLoading || !isEditMode}
          readOnly={!isEditMode}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.nombres}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formApellidoPaterno">
            <Form.Label>Apellido Paterno *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Apellido paterno"
              value={personalData.apellidoPaterno}
              onChange={handleInputChange}
              name="apellidoPaterno"
              isInvalid={!!validationErrors.apellidoPaterno}
              disabled={isLoading || !isEditMode}
              readOnly={!isEditMode}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.apellidoPaterno}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="formApellidoMaterno">
            <Form.Label>Apellido Materno *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Apellido materno"
              value={personalData.apellidoMaterno}
              onChange={handleInputChange}
              name="apellidoMaterno"
              isInvalid={!!validationErrors.apellidoMaterno}
              disabled={isLoading || !isEditMode}
              readOnly={!isEditMode}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.apellidoMaterno}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4" controlId="formTelefono">
        <Form.Label>Teléfono *</Form.Label>
        <Form.Control
          type="tel"
          placeholder="10 dígitos"
          value={personalData.telefono}
          onChange={handleInputChange}
          name="telefono"
          maxLength={10}
          isInvalid={!!validationErrors.telefono}
          disabled={isLoading || !isEditMode}
          readOnly={!isEditMode}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.telefono}
        </Form.Control.Feedback>
      </Form.Group>

      {isEditMode && (
        <Row>
          <Col md={6}>
            {hasExistingData && (
              <Button
                id="btnCancelaEditarPersonalData"
                variant="outline-secondary"
                className="w-100 mb-2 mb-md-0"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </Col>
          <Col md={hasExistingData ? 6 : 12}>
            <Button
              id="btnGuardaEditarPersonalData"
              type="submit"
              className="w-100 hub-btn-gamer"
              disabled={isLoading}
              onClick={handleSave}
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
                "Guardar Datos Personales"
              )}
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PersonalDataTab;