import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import { CircularProgress, Stack, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: 5,
    position: "relative",
    top: 3,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
}));

const CoinInfo = ({ coin }: { coin: any }) => {
  const classes = useStyles();
  const [historicData, setHistoricData] = useState<any[]>([]);
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchHistoricData = async () => {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricData(data.prices);
    };
    fetchHistoricData();
  }, [days, currency]);

  return (
    <div className={"container"}>
      {!historicData?.length || flag === false ? (
        <CircularProgress style={{ color: "crimson" }} size={250} thickness={1} />
      ) : (
        <>
          <Stack className="row" direction="row" spacing={2} justifyContent="space-between">
            <div className={classes.item}>
              <div>7d</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  background: coin.market_data.price_change_percentage_24h >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "12px",
                  borderRadius: "5px",
                  padding: "2px 5px 2px 3px",
                  marginTop: "5px",
                  color: "white",
                }}
              >
                {coin.market_data.price_change_percentage_24h >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
            <div className={classes.item}>
              <div>1w</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  background: coin.market_data.price_change_percentage_7d >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "12px",
                  borderRadius: "5px",
                  padding: "2px 5px 2px 3px",
                  marginTop: "5px",
                  color: "white",
                }}
              >
                {coin.market_data.price_change_percentage_7d >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.price_change_percentage_7d).toFixed(2)}%
              </div>
            </div>
            <div className={classes.item}>
              <div>1m</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  background: coin.market_data.price_change_percentage_30d >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "12px",
                  borderRadius: "5px",
                  padding: "2px 5px 2px 3px",
                  color: "white",
                  marginTop: "5px",
                }}
              >
                {coin.market_data.price_change_percentage_30d >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.price_change_percentage_30d).toFixed(2)}%
              </div>
            </div>
            <div className={classes.item}>
              <div>1y</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  background: coin.market_data.price_change_percentage_1y >= 0 ? "rgb(14, 203, 129)" : "crimson",
                  fontWeight: 800,
                  fontSize: "12px",
                  borderRadius: "5px",
                  color: "white",
                  padding: "2px 5px 2px 3px",
                  marginTop: "5px",
                }}
              >
                {coin.market_data.price_change_percentage_1y >= 0 ? <AiFillCaretUp className={classes.icon} /> : <AiFillCaretDown className={classes.icon} />}
                {Math.abs(coin.market_data.price_change_percentage_1y).toFixed(2)}%
              </div>
            </div>
          </Stack>
          <Line
            data={{
              labels: historicData?.map((coin) => {
                let date = new Date(coin[0]);
                let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),

              datasets: [
                {
                  data: historicData?.map((coin) => coin[1]),
                  label: `Price ( Past ${days} Days ) in ${currency}`,
                  borderColor: "crimson",
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                },
              },
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: 20,
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {chartDays.map((day) => (
              <SelectButton
                key={day.value}
                onClick={() => {
                  setDays(day.value);
                  setFlag(false);
                }}
                selected={day.value === days}
              >
                {day.label}
              </SelectButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoinInfo;
