import { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";
import FormField from "./FormField";
import "./EmployeeFormModal.css";

function EmployeeFormModal({ employee, onSave, onClose }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        role: "coach",
        status: "active",
        hire_date: "",
        salary: "",
        address: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.full_name.trim()) newErrors.full_name = "Le nom complet est requis.";
        if (!formData.email.trim()) newErrors.email = "L'email est requis.";
        if (!formData.email.includes("@")) newErrors.email = "Email invalide.";
        if (!formData.role) newErrors.role = "Le rôle est requis.";
        if (!formData.status) newErrors.status = "Le statut est requis.";
        if (!formData.hire_date) newErrors.hire_date = "La date d'embauche est requise.";
        if (formData.salary && parseFloat(formData.salary) < 0) {
            newErrors.salary = "Le salaire ne peut pas être négatif.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setServerError("");
            const data = { ...formData };
            if (!data.phone) data.phone = null;
            if (!data.salary) data.salary = null;
            if (!data.address) data.address = null;
            if (!data.notes) data.notes = null;

            let response;
            if (employee) {
                response = await api.put(`employees/${employee.id}/`, data);
            } else {
                response = await api.post("employees/", data);
            }

            onSave(response.data);
        } catch (err) {
            const errMsg = getErrorMessage(err, "Erreur lors de l'enregistrement.");
            setServerError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {employee ? "Modifier l'employé" : "Ajouter un employé"}
                    </h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {serverError && <div className="form-error">{serverError}</div>}

                    <div className="form-grid">
                        <FormField
                            label="Nom complet"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            error={errors.full_name}
                        />
                        <FormField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <FormField
                            label="Téléphone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                        />
                        <div className="form-field-group">
                            <label className="field__label">Rôle</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="coach">Coach</option>
                                <option value="reception">Accueil</option>
                                <option value="manager">Manager</option>
                                <option value="maintenance">Entretien</option>
                            </select>
                        </div>
                        <div className="form-field-group">
                            <label className="field__label">Statut</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="active">Actif</option>
                                <option value="on_leave">En congé</option>
                                <option value="inactive">Inactif</option>
                            </select>
                        </div>
                        <FormField
                            label="Date d'embauche"
                            name="hire_date"
                            type="date"
                            value={formData.hire_date}
                            onChange={handleChange}
                            error={errors.hire_date}
                        />
                        <FormField
                            label="Salaire"
                            name="salary"
                            type="number"
                            step="0.01"
                            value={formData.salary}
                            onChange={handleChange}
                            error={errors.salary}
                        />
                        <FormField
                            label="Adresse"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            error={errors.address}
                        />
                    </div>

                    <div className="form-field-group form-field-full">
                        <label className="field__label">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="form-textarea"
                            rows="4"
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeFormModal;
