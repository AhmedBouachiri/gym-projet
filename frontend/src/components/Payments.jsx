import React, { useState, useEffect } from "react";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        member: "",
        amount: "",
        payment_method: "CASH",
        status: "COMPLETED",
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("access");
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        };
    };

    const fetchPayments = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/api/payments/", {
            headers: getAuthHeaders(),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized or server error");
                return res.json();
            })
            .then((data) => {
                setPayments(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch payments:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/payments/", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to create payment");
                return res.json();
            })
            .then(() => {
                setShowForm(false);
                setFormData({ member: "", amount: "", payment_method: "CASH", status: "COMPLETED" });
                fetchPayments(); 
            })
            .catch((err) => alert("Error adding payment: " + err.message));
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Gestion des Paiements 💳</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: "10px 16px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    {showForm ? "Fermer" : "+ Nouveau Paiement"}
                </button>
            </div>

            {/* NEW PAYMENT FORM */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#f8fafc",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <h3>Enregistrer un Paiement</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "15px 0" }}>
                        <div>
                            <label>ID Membre:</label>
                            <input
                                type="number"
                                required
                                value={formData.member}
                                onChange={(e) => setFormData({ ...formData, member: e.target.value })}
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>
                        <div>
                            <label>Montant ($):</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            />
                        </div>
                        <div>
                            <label>Méthode:</label>
                            <select
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            >
                                <option value="CASH">Espèces (Cash)</option>
                                <option value="CARD">Carte Bancaire (Card)</option>
                                <option value="TRANSFER">Virement (Transfer)</option>
                            </select>
                        </div>
                        <div>
                            <label>Statut:</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                            >
                                <option value="COMPLETED">Payé (Completed)</option>
                                <option value="PENDING">En attente (Pending)</option>
                                <option value="FAILED">Échoué (Failed)</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Valider
                    </button>
                </form>
            )}

            {/* TABLE DISPLAY */}
            {loading ? (
                <p>Chargement des paiements...</p>
            ) : payments.length === 0 ? (
                <p>Aucun paiement enregistré pour le moment.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f1f5f9" }}>
                            <th>ID</th>
                            <th>Membre</th>
                            <th>Montant</th>
                            <th>Méthode</th>
                            <th>Statut</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.member_name || p.member}</td>
                                <td>${p.amount}</td>
                                <td>{p.payment_method}</td>
                                <td>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontSize: "0.85rem",
                                            backgroundColor: p.status === "COMPLETED" ? "#dcfce7" : "#fef3c7",
                                            color: p.status === "COMPLETED" ? "#166534" : "#92400e",
                                        }}
                                    >
                                        {p.status}
                                    </span>
                                </td>
                                <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Payments;