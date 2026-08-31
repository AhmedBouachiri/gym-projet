import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api';
import MemberFormModal from '../components/MemberFormModal';
import './Members.css';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('members/');
      setMembers(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors du chargement des membres'));
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.is_active === (statusFilter === 'active');
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (member = null) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchMembers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return;
    }

    setDeleting(id);
    try {
      await api.delete(`members/${id}/`);
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <div>
          <h1>Gestion des Membres</h1>
          <p className="page-subtitle">Gérez tous les membres du gym</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => handleOpenModal()}
        >
          + Ajouter un membre
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des membres...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="empty-state">
          <p>Aucun membre trouvé</p>
          <button 
            className="btn-secondary"
            onClick={() => handleOpenModal()}
          >
            Ajouter le premier membre
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Date d'inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td className="name-cell">
                    <strong>{member.first_name} {member.last_name}</strong>
                  </td>
                  <td>{member.email}</td>
                  <td>{new Date(member.join_date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`badge badge-${member.is_active ? 'success' : 'danger'}`}>
                      {member.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleOpenModal(member)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(member.id)}
                      disabled={deleting === member.id}
                      title="Supprimer"
                    >
                      {deleting === member.id ? '⏳' : '🗑️'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MemberFormModal
          member={selectedMember}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
