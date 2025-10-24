import React from "react";
import AddressManager from "./Addressmanager";
import "./styles/Profile.css";

interface ShippingDataTabProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ShippingDataTab: React.FC<ShippingDataTabProps> = () => {
  return (
    <div style={{ marginTop: '15px' }}>
      <AddressManager 
        usuarioId="user123" 
        tipoDireccion={1}  // 1 para envío, 2 para facturación
      />
    </div>
  );
};

export default ShippingDataTab;