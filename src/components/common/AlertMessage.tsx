import { Alert } from "react-bootstrap";
import type { AlertColor } from "../../utils/enums/types";




interface IPropertiesAlert {
  color: AlertColor;
  message: string;
}

// type  colorFont = {
//   "warning" : "#f7b011",
//   "danger" : "#dc3545",
//   "info" : "#0dcaf0",
//   "success" : "#32e956"
// }
const AlertMessage: React.FC<IPropertiesAlert> = ({ color, message }) => {
  return (
    <>
      <Alert
        variant={color} 
        className="px-2 py-1 m-0"
        style={{
          fontSize: "13px",
          border: "1px solid #212529",
          borderRadius: "0px",
          backgroundColor: "transparent",
        }}
      >
        {message}
      </Alert>
    </>
  );
};

export default AlertMessage;