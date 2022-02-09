import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { withStyles } from "@mui/styles";

const CustomTextField = withStyles({
  root: {
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "crimson",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "yellow",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "crimson",
      },
      "& input": {
        color: "white",
      },
    },
  },
})(TextField);

const Signup = ({ handleClose }: { handleClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <CustomTextField variant="outlined" type="email" label="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <CustomTextField variant="outlined" label="Enter Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      <CustomTextField variant="outlined" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
      <Button variant="contained" size="large" style={{ backgroundColor: "crimson" }} onClick={handleSubmit}>
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
