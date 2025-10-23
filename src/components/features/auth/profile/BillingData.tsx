import React, { useState, type ChangeEvent } from "react";
import { Form, } from "react-bootstrap";
import { useAuthStore } from "../../../../store/useAuthStore";
import AddressForm, { type IAddressData } from "./AddressForm";
import "./styles/Profile.css";

export interface IBillingData {
  usuarioId: string;
  rfc: string;
  direccion: IAddressData;
}

interface ValidationErrors {
  rfc?: string;
}

interface BillingDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const BillingData: React.FC<BillingDataTabProps> = ({ onSuccess, onError }) => {
  const { nombreUsuario } = useAuthStore();

  const [rfc, setRfc] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRfcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rfcValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (rfcValue.length <= 13) {
      setRfc(rfcValue);
    }

    if (validationErrors.rfc) {
      setValidationErrors({});
    }
  };

  const validarRFC = (rfc: string): boolean => {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfc);
  };

  const handleSaveAddress = async (addressData: IAddressData) => {
    // Validar RFC primero
    if (!rfc.trim()) {
      setValidationErrors({ rfc: "El RFC es requerido" });
      onError("Por favor completa el RFC");
      return;
    }

    if (!validarRFC(rfc)) {
      setValidationErrors({ rfc: "El RFC no tiene un formato válido" });
      onError("El RFC no tiene un formato válido");
      return;
    }

    setIsLoading(true);

    try {
      const billingData: IBillingData = {
        usuarioId: nombreUsuario || "",
        rfc,
        direccion: addressData
      };

      // TODO: Llamar al API con usuarioId como llave
      console.log("Guardando datos de facturación:", billingData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess();
    } catch (error) {
      console.error("Error al guardar datos de facturación:", error);
      onError("Error al guardar los datos de facturación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {/* <h5 className="text-white profile-section-title">Información Fiscal</h5> */}

      <Form.Group className="mb-3" controlId="formRFC">
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
        <Form.Text className="text-light profile-form-text">
          {/* Formato: AAAA######XXX (persona física) o AAA######XXX (persona moral) */}
        </Form.Text>
      </Form.Group>

      <hr className="profile-divider" />

      <AddressForm
        tipoDireccion={2}
        usuarioId={nombreUsuario || ""}
        onSave={handleSaveAddress}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BillingData;