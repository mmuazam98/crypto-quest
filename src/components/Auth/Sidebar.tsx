import React from "react";
import { makeStyles } from "@mui/styles";
import { Avatar, Button, Drawer } from "@mui/material";
import { CryptoState } from "../../CryptoContext";
import { AiFillDelete } from "react-icons/ai";
import { numberWithCommas } from "../CoinsTable";

import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#424242",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "crimson",
    color: "white",
    marginTop: 20,
  },
  picture: {
    width: 80,
    height: 80,
    cursor: "pointer",
    backgroundColor: "#EEBC1D",
    objectFit: "contain",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
    scrollbarWidth: "thin",
    marginBottom: 20,
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "crimson",
    color: "white",
    boxShadow: "1px 1px 5px rgba(0,0,0,0.3)",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor: string, open: boolean) => (event?: any) => {
    if (event?.type === "keydown" && (event?.key === "Tab" || event?.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });

    toggleDrawer("right", false)();
  };

  const removeFromWatchlist = async (coin: any) => {
    try {
      await setDoc(doc(db, "cities", user?.uid || ""), { coins: watchlist.filter((wish: any) => wish !== coin?.id) }, { merge: true });

      setAlert({
        open: true,
        message: `${coin.name} removed from the Watchlist!`,
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <React.Fragment>
        <Avatar
          onClick={(e: any) => toggleDrawer("right", true)(e)}
          style={{
            height: 38,
            width: 38,
            marginLeft: 15,
            cursor: "pointer",
            backgroundColor: "crimson",
          }}
          src={user?.photoURL || ""}
          alt={user?.displayName || user?.email || ""}
        />

        <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
          <div className={classes.container}>
            <div className={classes.profile}>
              <Avatar
                className={classes.picture}
                src={user?.photoURL || ""}
                alt={user?.displayName || user?.email || ""}
                style={{
                  height: 80,
                  width: 80,
                }}
              />
              <span
                style={{
                  width: "100%",
                  fontSize: 25,
                  textAlign: "center",
                  fontWeight: "bolder",
                  wordWrap: "break-word",
                  color: "white",
                }}
              >
                {user?.displayName || user?.email}
              </span>
              <div className={classes.watchlist}>
                <span style={{ fontSize: 15, color: "white" }}>Your Watchlist</span>
                {coins.map((coin) => {
                  if (watchlist.includes(coin.id))
                    return (
                      <div className={classes.coin}>
                        <span>{coin.name}</span>
                        <span style={{ display: "flex", gap: 8 }}>
                          {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                          <AiFillDelete style={{ cursor: "pointer", position: "relative", top: 3 }} fontSize="16" onClick={() => removeFromWatchlist(coin)} />
                        </span>
                      </div>
                    );
                  else return <></>;
                })}
              </div>
            </div>
            <Button
              style={{
                width: "100%",
                height: 40,
                backgroundColor: "crimson",
                color: "white",
                border: "none",
              }}
              className={classes.logout}
              onClick={logOut}
            >
              Sign Out
            </Button>
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
