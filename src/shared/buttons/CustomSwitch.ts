import { Switch, styled } from "@mui/material"
import { grey } from "@mui/material/colors"

export const CustomSwitch = styled(Switch)({
  margin: 0,
  padding: 6,
  "& .MuiSwitch-switchBase": {
    padding: 7,
    transitionDuration: "250ms",
    "&.Mui-checked": {
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#1f8c44",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: grey[400],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    height: 24,
    width: 24,
    "& .MuiSwitch:hover": {
      backgroundColor: "#fff",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 24 / 2,
    opacity: 0.5,
    backgroundColor: "#c5c5c7",
  },
})
