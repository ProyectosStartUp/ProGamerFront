import React, { useState } from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import AddressForm, { type IAddressData } from "./AddressForm";
import "./styles/Profile.css";

interface ShippingDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ShippingDataTab: React.FC<ShippingDataTabProps> = ({ onSuccess, onError }) => {
  const { nombreUsuario } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (addressData: IAddressData) => {
    setIsLoading(true);

    try {
      // TODO: Llamar al API con usuarioId como llave
      console.log("Guardando datos de envío:", addressData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess();
    } catch (error) {
      console.error("Error al guardar datos de envío:", error);
      onError("Error al guardar los datos de envío");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddressForm
      tipoDireccion={1}
      usuarioId={nombreUsuario || ""}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
};

export default ShippingDataTab;