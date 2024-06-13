;<List component="nav" aria-label="Nav bar">
  <ListItemButton
    id="lock-button"
    aria-haspopup="listbox"
    aria-controls="lock-menu"
    aria-expanded={openedMenu}
    onClick={handleMenuOpen}
  >
    <ListItemText
      primary={getCurrentPageLabel()}
      secondary={getSecondaryPageLabel()}
      primaryTypographyProps={{
        fontSize: "1.25rem",
        fontWeight: "bold",
      }}
      secondaryTypographyProps={{
        color: "gray",
      }}
    />
  </ListItemButton>
</List>
