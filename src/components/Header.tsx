import { AppBar, Container, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { makeStyles, ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import Auth from "./Auth/AuthModal";
import Sidebar from "./Auth/Sidebar";

const useStyles = makeStyles({
  title: {
    flex: 1,
    color: "crimson",
    fontFamily: "Montserrat",
    fontWeight: "900 !important",
    cursor: "pointer",
  },
  select: {
    "& fieldset, & legend, & .MuiSelect-outlined, & fieldset:focus, & svg": {
      borderColor: "crimson !important",
      color: "crimson",
    },
    "& fieldset:hover": {
      borderColor: "white",
    },
  },
  icon: {
    fill: "white",
  },
  root: {
    color: "white",
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    // type: "dark",
  },
});

function Header() {
  const classes = useStyles();
  const { currency, setCurrency, user } = CryptoState();

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography onClick={() => navigate(`/`)} variant="h6" className={classes.title}>
              Crypto Quest
            </Typography>
            <Select variant="outlined" className={classes.select} value={currency} style={{ width: 85, height: 40 }} type="text" onChange={(e: any) => setCurrency(e.target.value)}>
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>

            {user ? <Sidebar /> : <Auth />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
