import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import axios from "axios";
import { CoinList } from "./config/api";
import { onSnapshot, doc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { AlertColor } from "@mui/material";

type CryptoContextType = {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  coins: any[];
  loading: boolean;
  symbol: string;
  alert: {
    open: boolean;
    message: string;
    type: AlertColor;
  };
  setAlert: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      type: AlertColor;
    }>
  >;
  watchlist: any[];
  user: FirebaseUser | null;
};

const AppContext = createContext<CryptoContextType>({
  currency: "INR",
  setCurrency: () => {},
  symbol: "₹",
  alert: {
    open: false,
    message: "",
    type: "success",
  },
  setAlert: () => {},
  user: null,
  coins: [],
  loading: false,
  watchlist: [],
});

const CryptoContext = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [alert, setAlert] = useState<{ open: boolean; message: string; type: AlertColor }>({
    open: false,
    message: "",
    type: "success",
  });
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      if (currency === "INR") setSymbol("₹");
      else if (currency === "USD") setSymbol("$");
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      setLoading(false);
    };
    fetchCoins();
  }, [currency]);

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        alert,
        setAlert,
        user,
        coins,
        loading,
        watchlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(AppContext);
};
