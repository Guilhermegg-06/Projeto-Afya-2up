import { Search } from "lucide-react";

export default function SearchInput({
    value,
    onChange,
    placeholder = "What do you want to search?",
    name = "search",
    type = "text",
    inputMode,
    min,
    ariaLabel,
    buttonType = "submit",
    onButtonClick,
}) {
    return (
        <div className="input__container">
            <div className="shadow__input" />
            <button
                className="input__button__shadow"
                type={buttonType}
                aria-label={ariaLabel ?? placeholder}
                onClick={onButtonClick}
            >
                <Search size={20} strokeWidth={2.4} />
            </button>
            <input
                className="input__search"
                type={type}
                inputMode={inputMode}
                min={min}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}
