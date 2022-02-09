import React, { useState } from "react";
import { makeStyles, withStyles } from "@mui/styles";
import Pagination from "@mui/material/Pagination";
import { Container, createTheme, TableCell, LinearProgress, ThemeProvider, Typography, TextField, TableBody, TableRow, TableHead, TableContainer, Table, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convert(labelValue: number, currency: string) {
  if (currency === "INR")
    return Math.abs(Number(labelValue)) >= 1.0e12
      ? (Math.abs(Number(labelValue)) / 1.0e12).toFixed(2) + "T"
      : Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
      : Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
      : Math.abs(Number(labelValue));
  else
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
      : Math.abs(Number(labelValue)) >= 1.0e6
      ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
      : Math.abs(Number(labelValue)) >= 1.0e3
      ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
      : Math.abs(Number(labelValue));
}

const useStyles = makeStyles({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    color: "white",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
    "& .MuiTableCell-root": {
      color: "white",
    },
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "crimson",
    },
  },
});

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
        borderColor: "white",
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

export default function CoinsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { symbol, coins, loading, currency } = CryptoState();

  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
    },
  });

  const handleSearch = () => {
    return coins.filter((coin) => coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <CustomTextField
          label="Search for your favorite coin..."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "crimson" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "crimson" }}>
                <TableRow>
                  {["Coin", "Price", "24h %", "Market Cap", "24h %", "High", "Low"].map((head, idx) => (
                    <TableCell
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={idx}
                      align={head === "Coin" ? "left" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit24h_price = row.price_change_percentage_24h > 0;
                    const profit24h_market_cap = row.market_cap_change_percentage_24h > 0;
                    return (
                      <TableRow onClick={() => navigate(`/coins/${row.id}`)} className={classes.row} key={row.name}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                                fontWeight: 600,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>{row.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell align="center">
                          <span
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              marginLeft: "auto",
                              width: "min-content",
                              background: profit24h_price ? "rgb(14, 203, 129)" : "crimson",
                              fontWeight: 800,
                              fontSize: "12px",
                              borderRadius: "5px",
                              padding: "2px 5px 2px 3px",
                              color: "white",
                            }}
                          >
                            {profit24h_price ? <AiFillCaretUp style={{ position: "relative", top: 2, marginRight: 1 }} /> : <AiFillCaretDown style={{ position: "relative", top: 3 }} />}
                            {Math.abs(row?.price_change_percentage_24h?.toFixed(2))}%
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}
                          {convert(row.market_cap, currency)}
                        </TableCell>
                        <TableCell align="center">
                          <span
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              marginLeft: "auto",
                              width: "min-content",
                              background: profit24h_market_cap ? "rgb(14, 203, 129)" : "crimson",
                              fontWeight: 800,
                              fontSize: "12px",
                              borderRadius: "5px",
                              padding: "2px 5px 2px 3px",
                              color: "white",
                            }}
                          >
                            {profit24h_market_cap ? <AiFillCaretUp style={{ position: "relative", top: 2, marginRight: 1 }} /> : <AiFillCaretDown style={{ position: "relative", top: 3 }} />}
                            {Math.abs(row?.market_cap_change_percentage_24h?.toFixed(2))}%
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}
                          {numberWithCommas(row.high_24h.toFixed(2))}
                        </TableCell>
                        <TableCell align="right">
                          {symbol}
                          {numberWithCommas(row.low_24h.toFixed(2))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}
