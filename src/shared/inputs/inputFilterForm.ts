import { TextField, styled } from "@mui/material"

export const InputFilterForm = styled(TextField)({
  "& .MuiTextField-root": {
    backgroundColor: "white",
    color: "white",
  },
  "& .MuiFormLabel-root": {
    color: "#999999e7",
  },

  "& .MuiInputBase-input": {
    backgroundColor: "#05544fdd",
    "&:focused": {
      // color: "#fff",
    },
  },
  "& .MuiFilledInput-root": {
    // backgroundColor: "#08781bdd",

    color: "#fff",
    "&:hover": {
      borderBottom: "1px solid #fff",
    },
    "&:before": {
      borderBottom: "1px solid #999999e7",
      // backgroundColor: "white",
    },
    "&:after": {
      borderBottom: "2px solid #fff",
      // backgroundColor: "white",
    },
  },
})
