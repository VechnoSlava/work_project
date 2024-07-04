import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import { SlArrowDown } from "react-icons/sl"
import styles from "./fieldFilters.module.css"
import { InputFilterForm } from "../../../shared/inputs/inputFilterForm"

interface IFieldFilters {
  name: string
}

export const FieldFilters = (props: IFieldFilters) => {
  const { name } = props
  return (
    <div className={styles.accordion}>
      <Accordion
        sx={{
          backgroundColor: "#091e2f",
          color: "white",
          width: "100%",
        }}
      >
        <AccordionSummary
          expandIcon={<SlArrowDown />}
          sx={{
            "& .MuiAccordionSummary-expandIconWrapper": {
              color: "white",
            },
          }}
        >
          <Typography sx={{ fontSize: 16 }}>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.filterProps}>
            <InputFilterForm
              id="baseInputField"
              label="Начало"
              variant="filled"
              size="small"
            />
            <InputFilterForm label="Начало" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

// <StyledAccordion>
//   <StyledAccordionSummary expandIcon={<SlArrowDown />}>
//     <StyledTypography>{name}</StyledTypography>
//   </StyledAccordionSummary>
//   <StyledAccordionDetails>
//     <FilterContent>
//       <StyledInput type="text" placeholder="начало" />
//       <StyledInput type="text" placeholder="конец" />
//       <StyledSelect>
//         <option>ГГц</option>
//         <option>МГц</option>
//         <option>КГц</option>
//       </StyledSelect>
//       <StyledButtonP>P</StyledButtonP>
//       <StyledButtonD>D</StyledButtonD>
//       <AddButton>Добавить</AddButton>
//     </FilterContent>
//   </StyledAccordionDetails>
// </StyledAccordion>
