import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { CryptoState } from "../CryptoContext";

const Alert = () => {
  const { alert, setAlert } = CryptoState();

  return (
    <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ open: false, type: "success", message: "" })}>
      <MuiAlert onClose={() => setAlert({ open: false, type: "success", message: "" })} elevation={10} variant="filled" severity={alert?.type}>
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
