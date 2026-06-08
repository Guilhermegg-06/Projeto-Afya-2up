export default function Loader({ label = "loading" }) {
    return (
        <div className="loader-wrapper" role="status" aria-live="polite" aria-label={label}>
            <div className="loader">
                <span className="loader-text">{label}</span>
                <span className="load" />
            </div>
        </div>
    );
}
