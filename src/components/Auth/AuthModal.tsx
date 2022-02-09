import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { Button, Tab, Tabs, AppBar, Box, Modal, Fade } from "@mui/material";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

import Signup from "./Signup";
import Login from "./Login";

const useStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    backgroundColor: "#424242",
    color: "white",
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  },
  tab: {
    display: "none",
    "& .MuiSelected": {
      color: "white !important",
    },
  },
}));

export default function AuthModal() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { setAlert } = CryptoState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: "success",
        });

        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: 85,
          height: 40,
          marginLeft: 15,
          backgroundColor: "crimson",
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" className={classes.modal} open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs value={value} onChange={handleChange} variant="fullWidth" style={{ borderRadius: 10 }}>
                <Tab label="Login" className={classes.tab} />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <Box className={classes.google}>
              <span>OR</span>
              <GoogleButton style={{ width: "100%", outline: "none" }} onClick={signInWithGoogle} />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
