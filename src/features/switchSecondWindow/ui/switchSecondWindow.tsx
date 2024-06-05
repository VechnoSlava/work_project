import { Switch } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import {
  selectWindow,
  toggleSecondaryWindow,
} from "../../../entities/navigation/model/navigationWindowSlice"

export const SwitchSecondWindow = () => {
  const dispatch = useAppDispatch()
  const checkOpenedWindow = useAppSelector(selectWindow)

  const handleToggleWindow = () => {
    dispatch(toggleSecondaryWindow())
  }

  return (
    <Switch
      checked={checkOpenedWindow}
      onChange={handleToggleWindow}
      inputProps={{ "aria-label": "controlled" }}
    />
  )
}
