import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api';
import FormField from './FormField';
import './SubscriptionFormModal.css';

const SUBSCRIPTION_TYPES = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'annual', label: 'Annuel' },
  { value: 'day_pass', label: 'Accès jour' },
];

export default function SubscriptionFormModal({ subscription, onClose, onSaveSuccess }) {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    member: '',
    subscription_type: 'monthly',
    status: 'active',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    price: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    fetchMembers();
    if (subscription) {
      setFormData({
        member: subscription.member || '',
        subscription_type: subscription.subscription_type || 'monthly',
        status: subscription.status || 'active',
        start_date: subscription.start_date || '',
        end_date: subscription.end_date || '',
        price: subscription.price || '',
        notes: subscription.notes || '',
      });
    }
  }, [subscription]);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await api.get('members/');
      setMembers(response.data.filter(m => m.is_active));
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const calculateEndDate = () => {
    const start = new Date(formData.start_date);
    const type = formData.subscription_type;
    
    let daysToAdd = 0;
    switch(type) {
      case 'monthly':
        daysToAdd = 30;
        break;
      case 'quarterly':
        daysToAdd = 90;
        break;
      case 'annual':
        daysToAdd = 365;
        break;
      case 'day_pass':
        daysToAdd = 1;
        break;
      default:
        daysToAdd = 30;
    }
    
    const end = new Date(start);
    end.setDate(end.getDate() + daysToAdd);
    return end.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.member) {
      newErrors.member = 'Le membre est requis';
    }

    if (!formData.subscription_type) {
      newErrors.subscription_type = 'Le type d\'abonnement est requis';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La date de début est requise';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La date de fin est requise';
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start >= end) {
        newErrors.end_date = 'La date de fin doit être après la date de début';
      }
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubscriptionTypeChange = (e) => {
    const type = e.target.value;
    setFormData({
      ...formData,
      subscription_type: type,
      end_date: calculateEndDate(),
    });
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    const endDate = calculateEndDate();
    setFormData({
      ...formData,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        member: formData.member,
        subscription_type: formData.subscription_type,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        price: parseFloat(formData.price),
        notes: formData.notes || '',
      };

      if (subscription) {
        await api.put(`subscriptions/${subscription.id}/`, payload);
      } else {
        await api.post('subscriptions/', payload);
      }
      onSaveSuccess();
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Erreur lors de l\'enregistrement'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{subscription ? 'Modifier l\'abonnement' : 'Créer un nouvel abonnement'}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="member" className="form-label">Membre *</label>
              <select
                id="member"
                name="member"
                value={formData.member}
                onChange={handleChange}
                disabled={loadingMembers || subscription}
                className={`form-input ${errors.member ? 'error' : ''}`}
              >
                <option value="">Sélectionner un membre</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
              {errors.member && <span className="error-text">{errors.member}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subscription_type" className="form-label">Type d'abonnement *</label>
              <select
                id="subscription_type"
                name="subscription_type"
                value={formData.subscription_type}
                onChange={handleSubscriptionTypeChange}
                className={`form-input ${errors.subscription_type ? 'error' : ''}`}
              >
                {SUBSCRIPTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.subscription_type && <span className="error-text">{errors.subscription_type}</span>}
            </div>

            <FormField
              label="Date de début"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleStartDateChange}
              error={errors.start_date}
              required
            />

            <FormField
              label="Date de fin"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              error={errors.end_date}
              required
              
            />

            <FormField
              label="Prix (TND)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="Ex: 49.99"
              step="0.01"
              required
            />

            <div className="form-group">
              <label htmlFor="status" className="form-label">Statut</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="active">Actif</option>
                <option value="expiring_soon">Expire bientôt</option>
                <option value="expired">Expiré</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Notes supplémentaires..."
              rows="3"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : subscription ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
