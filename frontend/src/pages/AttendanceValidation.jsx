import { useState } from "react";

export default function AttendanceValidation() {
    const [registrationCode, setRegistrationCode] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        if (!registrationCode.trim()) {
            setMessage("Informe o código da inscrição.");
            return;
        }

        setMessage(`Presença validada para a inscrição ${registrationCode.trim()}.`);
        setRegistrationCode("");
    }

    return (
        <main className="page">
            <section className="card" style={{ maxWidth: 520, margin: "60px auto" }}>
                <h1>Validar presença</h1>
                <p>Informe o código da inscrição para simular a validação.</p>

                <form className="form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                    <input
                        className="input"
                        type="text"
                        value={registrationCode}
                        onChange={(event) => setRegistrationCode(event.target.value)}
                        placeholder="Código da inscrição"
                    />
                    <button className="btn btn-primary" type="submit">
                        Validar presença
                    </button>
                </form>

                {message && <p style={{ marginTop: 16 }}>{message}</p>}
            </section>
        </main>
    );
}
