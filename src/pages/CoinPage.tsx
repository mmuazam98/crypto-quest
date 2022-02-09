import { useEffect, useState } from "react";
import { Button, LinearProgress, Typography, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas, convert } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const useStyles = makeStyles({
  mainHeading: {
    fontWeight: "900 !important",
    marginBottom: "20px !important",
  },
  heading: {
    fontWeight: "600 !important",
    marginBottom: "20px !important",
    fontSize: "17px !important",
    opacity: 0.8,
  },
  value: {
    fontSize: "17px !important",
    display: "flex",
    flexWrap: "wrap",
  },
  icon: {
    marginRight: 5,
    position: "relative",
    top: 2,
  },
});

const CoinPage = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<any>();

  const { currency, symbol, user, setAlert, watchlist } = CryptoState();

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user?.uid || "");
    try {
      await setDoc(coinRef, { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] }, { merge: true });

      setAlert({
        open: true,
        message: `${coin?.name} Added to the Watchlist !`,
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

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user?.uid || "");
    try {
      await setDoc(coinRef, { coins: watchlist.filter((wish) => wish !== coin?.id) }, { merge: true });

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

  useEffect(() => {
    const fetchCoin = async () => {
      const { data } = await axios.get(SingleCoin(id || ""));

      setCoin(data);
    };

    fetchCoin();
  }, []);

  const classes = useStyles();

  if (!coin) return <LinearProgress color="error" />;
  return (
    <div className={"main"}>
      <div className={"sidebar"}>
        <img src={coin?.image.large} alt={coin?.name} height="100" style={{ marginBottom: 20 }} />
        <Typography variant="h3" className={`${classes.mainHeading} mainHeading`}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={"desc"}>
          {parse(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className={"marketData"}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={classes.value}>
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={classes.value}>
              {symbol}
              {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
              <span
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  height: "min-content",
                  width: "min-content",
                  background: coin.market_data.price_change_percentage_24h >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "10px",
                  borderRadius: "5px",
                  color: "white",
                  padding: "2px 5px 2px 3px",
                  margin: "5px 8px",
                }}
              >
                {coin.market_data.price_change_percentage_24h >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
              </span>
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={classes.value}>
              {symbol}
              {convert(coin?.market_data.market_cap[currency.toLowerCase()], currency)}
              <span
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  width: "min-content",
                  height: "min-content",
                  background: coin.market_data.market_cap_change_percentage_24h >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "10px",
                  borderRadius: "5px",
                  color: "white",
                  padding: "2px 5px 2px 3px",
                  margin: "5px 8px",
                }}
              >
                {coin.market_data.market_cap_change_percentage_24h >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.market_cap_change_percentage_24h).toFixed(2)}%
              </span>
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Total Supply:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={classes.value}>
              {coin?.market_data?.total_supply ? `${symbol}${numberWithCommas(coin?.market_data?.total_supply?.toString().slice(0, -6))}M` : "NA"}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Circulating Supply:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={classes.value}>
              {convert(coin?.market_data.circulating_supply, currency)} {coin?.symbol.toUpperCase()}
            </Typography>
          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "grey" : "crimson",
                color: "white",
                border: "none",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
