import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../CoinsTable";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
}));

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency));

      setTrending(data);
    };
    fetchTrendingCoins();
  }, [currency]);

  const classes = useStyles();

  const items = trending.map((coin: any) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img src={coin?.image} alt={coin.name} height="80" style={{ marginBottom: 10 }} />
        <span style={{ fontWeight: 600 }}>{coin?.symbol}</span>
        <span
          style={{
            background: profit ? "rgb(14, 203, 129)" : "crimson",
            fontWeight: 800,
            fontSize: "12px",
            borderRadius: "5px",
            padding: "2px 5px 2px 3px",
            margin: "4px 0",
          }}
        >
          {profit ? <AiFillCaretUp style={{ position: "relative", top: 2, marginRight: 1 }} /> : <AiFillCaretDown style={{ position: "relative", top: 3 }} />}
          {Math.abs(coin?.price_change_percentage_24h?.toFixed(2))}%
        </span>
        <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.8 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
    990: {
      items: 5,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel mouseTracking infinite autoPlayInterval={2000} animationDuration={1500} disableDotsControls disableButtonsControls responsive={responsive} items={items} autoPlay />
    </div>
  );
};

export default Carousel;
