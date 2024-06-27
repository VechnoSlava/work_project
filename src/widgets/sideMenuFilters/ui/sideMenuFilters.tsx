import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"
import { selectSideMenuOpened, toggleSideMenu } from "../model/sideMenuSlice"
import { RiListSettingsFill } from "react-icons/ri"

export const SideMenuFilters = () => {
  const dispatch = useAppDispatch()
  const sideMenuOpened = useAppSelector(selectSideMenuOpened)
  const handlerToggleSideMenu = () => {
    dispatch(toggleSideMenu())
  }

  const DrawerList = (
    <Box
      sx={{ width: 500, backgroundColor: "#112d49", color: "#fff" }}
      role="presentation"
      onClick={handlerToggleSideMenu}
    >
      <List>
        <ListItem key={1} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <RiListSettingsFill size={50} />
            </ListItemIcon>
            <ListItemText primary={"Фильтр 1"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <div>
      <Drawer
        anchor={"right"}
        open={sideMenuOpened}
        onClose={handlerToggleSideMenu}
      >
        {DrawerList}
      </Drawer>
    </div>
  )
}
