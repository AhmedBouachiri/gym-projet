import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api';
import SubscriptionFormModal from '../components/SubscriptionFormModal';
import './Subscriptions.css';

const SUBSCRIPTION_TYPES = {
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  annual: 'Annuel',
  day_pass: 'Accès jour',
};

const STATUS_COLORS = {
  active: 'success',
  expiring_soon: 'warning',
  expired: 'danger',
};

const STATUS_LABELS = {
  active: 'Actif',
  expiring_soon: 'Expire bientôt',
  expired: 'Expiré',
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('subscriptions/');
      setSubscriptions(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors du chargement des abonnements'));
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const memberName = (sub.member_name || '').toLowerCase();
    const matchesSearch = memberName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (subscription = null) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubscription(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchSubscriptions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      return;
    }

    setDeleting(id);
    try {
      await api.delete(`subscriptions/${id}/`);
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Erreur lors de la suppression'));
    } finally {
      setDeleting(null);
    }
  };

  const getDaysUntilExpiry = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="subscriptions-page">
      <div className="page-header">
        <div>
          <h1>Gestion des Abonnements</h1>
          <p className="page-subtitle">Gérez tous les abonnements des membres</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => handleOpenModal()}
        >
          + Nouvel abonnement
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
            placeholder="Rechercher par nom du membre..."
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
            <option value="expiring_soon">Expire bientôt</option>
            <option value="expired">Expirés</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des abonnements...</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="empty-state">
          <p>Aucun abonnement trouvé</p>
          <button 
            className="btn-secondary"
            onClick={() => handleOpenModal()}
          >
            Créer le premier abonnement
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="subscriptions-table">
            <thead>
              <tr>
                <th>Membre</th>
                <th>Type</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Jours restants</th>
                <th>Statut</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map(subscription => {
                const daysLeft = getDaysUntilExpiry(subscription.end_date);
                return (
                  <tr key={subscription.id}>
                    <td className="name-cell">
                      <strong>{subscription.member_name}</strong>
                    </td>
                    <td>{SUBSCRIPTION_TYPES[subscription.subscription_type] || subscription.subscription_type}</td>
                    <td>{new Date(subscription.start_date).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(subscription.end_date).toLocaleDateString('fr-FR')}</td>
                    <td className="days-cell">
                      <span className={`days-badge days-${daysLeft > 7 ? 'active' : daysLeft > 0 ? 'warning' : 'expired'}`}>
                        {daysLeft > 0 ? `${daysLeft}j` : 'Expiré'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${STATUS_COLORS[subscription.status] || 'default'}`}>
                        {STATUS_LABELS[subscription.status] || subscription.status}
                      </span>
                    </td>
                    <td className="price-cell">
                      <strong>{subscription.price}€</strong>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon edit"
                        onClick={() => handleOpenModal(subscription)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(subscription.id)}
                        disabled={deleting === subscription.id}
                        title="Supprimer"
                      >
                        {deleting === subscription.id ? '⏳' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <SubscriptionFormModal
          subscription={selectedSubscription}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
