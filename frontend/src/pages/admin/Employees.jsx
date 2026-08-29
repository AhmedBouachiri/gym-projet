import { useState, useEffect } from "react";
import api, { getErrorMessage } from "../../api";
import EmployeeFormModal from "../../components/EmployeeFormModal";
import "./Employees.css";

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const roleLabels = {
        coach: "Coach",
        reception: "Accueil",
        manager: "Manager",
        maintenance: "Entretien",
    };

    const statusLabels = {
        active: "Actif",
        on_leave: "En congé",
        inactive: "Inactif",
    };

    const statusColors = {
        active: "#6ee7a0",
        on_leave: "#ffd93d",
        inactive: "#ff6b6b",
    };

    useEffect(() => {
        fetchEmployees();
    }, [searchQuery, statusFilter]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError("");
            let url = "employees/";
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (statusFilter) params.append("status", statusFilter);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await api.get(url);
            setEmployees(response.data.results || response.data);
        } catch (err) {
            if (err.response?.status === 403) {
                setError("Réservé aux administrateurs.");
                return;
            }
            setError(getErrorMessage(err, "Impossible de charger les employés."));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(id);
            await api.delete(`employees/${id}/`);
            setEmployees(employees.filter((e) => e.id !== id));
        } catch (err) {
            setError(getErrorMessage(err, "Impossible de supprimer l'employé."));
        } finally {
            setDeleting(null);
        }
    };

    const handleOpenModal = (employee = null) => {
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
    };

    const handleSaveEmployee = (employee) => {
        if (editingEmployee) {
            setEmployees(
                employees.map((e) => (e.id === employee.id ? employee : e))
            );
        } else {
            setEmployees([employee, ...employees]);
        }
        handleCloseModal();
    };

    if (loading) return <div className="employees-page"><p>Chargement…</p></div>;

    return (
        <div className="employees-page">
            <div className="employees-header">
                <h1 className="employees-title">Gestion des Employés</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Ajouter un employé
                </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="employees-filters">
                <input
                    type="text"
                    placeholder="Rechercher par nom, email ou téléphone…"
                    className="employees-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="employees-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="on_leave">En congé</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

            {employees.length === 0 ? (
                <p className="employees-empty">Aucun employé trouvé.</p>
            ) : (
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Nom complet</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Date d'embauche</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="cell-name">{emp.full_name}</td>
                                <td className="cell-email">{emp.email}</td>
                                <td className="cell-phone">{emp.phone || "-"}</td>
                                <td className="cell-role">{roleLabels[emp.role]}</td>
                                <td className="cell-status">
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: statusColors[emp.status] }}
                                    >
                                        {statusLabels[emp.status]}
                                    </span>
                                </td>
                                <td className="cell-date">
                                    {new Date(emp.hire_date).toLocaleDateString("fr-FR")}
                                </td>
                                <td className="cell-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleOpenModal(emp)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(emp.id)}
                                        disabled={deleting === emp.id}
                                    >
                                        {deleting === emp.id ? "Suppression…" : "Supprimer"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <EmployeeFormModal
                    employee={editingEmployee}
                    onSave={handleSaveEmployee}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default Employees;
