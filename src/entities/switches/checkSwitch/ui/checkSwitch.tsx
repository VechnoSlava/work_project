import { FormControlLabel } from "@mui/material"
import { CustomSwitch } from "../../../../shared/buttons"
import { grey } from "@mui/material/colors"
interface ToggleSwitchProps {
  nameSwitch: string
  checked: boolean
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  inputProps?: { "aria-label": string }
}
export const CheckSwitch: React.FC<ToggleSwitchProps> = ({
  disabled,
  nameSwitch,
  checked,
  onChange,
  inputProps,
}) => (
  <FormControlLabel
    control={
      <CustomSwitch
        checked={checked}
        onChange={onChange}
        inputProps={inputProps}
      />
    }
    label={nameSwitch}
    disabled={disabled}
    sx={{
      "& .MuiTypography-root": {
        "&.Mui-disabled": {
          color: grey[400],
        },
      },
    }}
  />
)
