import { makeStyles } from "@mui/styles";

const SelectButton = ({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) => {
  const useStyles = makeStyles({
    selectButton: {
      border: "1px solid crimson",
      borderRadius: 5,
      padding: 10,
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "crimson" : "",
      color: selected ? "white" : "",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        backgroundColor: "crimson",
        color: "white",
      },
      width: "23%",
      textAlign: "center",
    },
  });

  const classes = useStyles();

  return (
    <span onClick={onClick} className={`${classes.selectButton} selectButton`}>
      {children}
    </span>
  );
};

export default SelectButton;
