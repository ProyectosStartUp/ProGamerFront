import React, { useState, type ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAuthStore } from "../../../../store/useAuthStore";
import "./styles/Profile.css";

export interface IPersonalData {
  usuarioId: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
}

interface ValidationErrors {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

interface PersonalDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PersonalDataTab: React.FC<PersonalDataTabProps> = ({ onSuccess, onError }) => {
  const { nombreUsuario } = useAuthStore();

  const [personalData, setPersonalData] = useState<IPersonalData>({
    usuarioId: nombreUsuario || "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: ""
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!validateData()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Llamar al API con usuarioId como llave
      console.log("Guardando datos personales:", personalData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess();
    } catch (error) {
      console.error("Error al guardar datos personales:", error);
      onError("Error al guardar los datos personales");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h5 className="text-white profile-section-title">Datos Personales</h5>

      <Form.Group className="mb-3" controlId="formNombres">
        <Form.Label>Nombres *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu(s) nombre(s)"
          value={personalData.nombres}
          onChange={handleInputChange}
          name="nombres"
          isInvalid={!!validationErrors.nombres}
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
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.telefono}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
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
    </div>
  );
};

export default PersonalDataTab;