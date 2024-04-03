import { CSSProperties, ReactNode } from 'react'
import buttonStyle from './button.module.css'

interface ButtonPrimaryProps {
    onClick?: () => void
    isLoading?: boolean
    children: ReactNode
    style?: CSSProperties
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

const ButtonPrimary = ({
    disabled,
    onClick,
    isLoading,
    children,
    style,
    type,
}: ButtonPrimaryProps) => {
    return (
        <button
            style={style}
            disabled={disabled}
            type={type}
            className={buttonStyle.buttonPrimary}
            onClick={onClick}
        >
            {isLoading ? <div className={buttonStyle.spinner}></div> : children}
        </button>
    )
}

export default ButtonPrimary
