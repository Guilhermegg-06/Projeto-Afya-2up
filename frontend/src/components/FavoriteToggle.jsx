export default function FavoriteToggle({ checked, onChange, label = "Favorito" }) {
    return (
        <label className="favorite-toggle" title={checked ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <span className="favorite-toggle__text">{checked ? "Favorito" : label}</span>
            <div className="toggle-container">
                <input
                    className="toggle-input"
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    aria-label={checked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                />
                <div className="toggle-handle-wrapper">
                    <div className="toggle-handle">
                        <div className="toggle-handle-knob" />
                        <div className="toggle-handle-bar-wrapper">
                            <div className="toggle-handle-bar" />
                        </div>
                    </div>
                </div>
                <div className="toggle-base">
                    <div className="toggle-base-inside" />
                </div>
            </div>
        </label>
    );
}
