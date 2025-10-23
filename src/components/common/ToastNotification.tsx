import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

interface ToastNotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  header?: string;
  bg?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  delay?: number;
  position?: "top-start" | "top-center" | "top-end" | "middle-start" | "middle-center" | "middle-end" | "bottom-start" | "bottom-center" | "bottom-end";
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  onClose,
  message,
  header = "Notificación",
  bg = "success",
  delay = 3000,
  position = "top-end"
}) => {
  return (
    <ToastContainer position={position} className="p-3" style={{ zIndex: 9999 }}>
      <Toast 
        show={show} 
        onClose={onClose}
        delay={delay}
        autohide
        bg={bg}
      >
        <Toast.Header>
          <strong className="me-auto">{header}</strong>
        </Toast.Header>
        <Toast.Body className={bg === "light" ? "text-dark" : "text-white"}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;