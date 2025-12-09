import React from "react";
import "./styles/Profile.css";
import AddressManager from "./AddressManager";

interface ShippingDataTabProps {
  idCliente: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ShippingDataTab: React.FC<ShippingDataTabProps> = ({ 
  idCliente,
  onSuccess, 
  onError 
}) => {
  return (
    <div style={{ marginTop: '15px' }}>
      <AddressManager 
        usuarioId={idCliente}
        tipoDireccion={1}  // 1 para envío
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};

export default ShippingDataTab;