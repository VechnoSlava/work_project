import CustomSwitch from "../../../../shared/buttons/CustomSwitch"
import styles from "./toggleSwitch.module.scss"

interface IToggleSwitch {
  id?: string
  disabled?: boolean
  checked: boolean
  onChange: () => void
  nameSwitch?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> | undefined
}

export const ToggleSwitch = ({
  id,
  disabled,
  checked,
  onChange,
  nameSwitch,
  inputProps,
}: IToggleSwitch) => {
  return (
    <div className={styles.switch}>
      <div className={styles.switch__container}>
        <div className={styles.switch__label}>{nameSwitch}</div>
        <div className={styles.switch__component}>
          <CustomSwitch
            disabled={disabled}
            id={id}
            checked={checked}
            onChange={onChange}
            inputProps={inputProps}
          />
        </div>
      </div>
    </div>
  )
}
