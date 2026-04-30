import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, FileText, Package, BarChart3, 
  ChevronDown, Plus, TrendingUp, Eye, Trash2, Edit2, X
} from 'lucide-react';

// ============================================================================
// DONNÉES INITIALES (JSON)
// ============================================================================

const INITIAL_DATA = {
  prospects: [
    { id: 1, nom: 'TechCorp Inc.', email: 'contact@techcorp.com', phone: '01 23 45 67 89', montant: 8500, stage: 'prospect', dateCreation: '2024-05-01', notes: 'Prospect très intéressé' },
    { id: 2, nom: 'Finance Global', email: 'hello@finance.com', phone: '01 34 56 78 90', montant: 12000, stage: 'devis', dateCreation: '2024-05-05', notes: 'Devis envoyé le 05/05' },
    { id: 3, nom: 'StartUp XYZ', email: 'info@startup.com', phone: '02 45 67 89 01', montant: 5500, stage: 'prospect', dateCreation: '2024-05-10', notes: 'À relancer' },
    { id: 4, nom: 'BigCorp Inc', email: 'sales@bigcorp.com', phone: '03 56 78 90 12', montant: 15000, stage: 'contrat', dateCreation: '2024-04-15', notes: 'Contrat signé' },
    { id: 5, nom: 'Global Enterprises', email: 'contact@global.com', phone: '04 67 89 01 23', montant: 9800, stage: 'facture', dateCreation: '2024-03-20', notes: 'En cours de réalisation' },
  ],
  evenements: [
    { id: 1, nom: 'Gala Annuel', date: '2024-05-22', prospectId: 4, description: 'Grand événement' },
    { id: 2, nom: 'Conférence Tech', date: '2024-05-28', prospectId: 1, description: 'Séminaire' },
    { id: 3, nom: 'Réunion Équipe', date: '2024-05-31', prospectId: 2, description: 'Meeting interne' },
  ]
};

// ============================================================================
// APPLICATION PRINCIPALE
// ============================================================================

const EventixApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null, message: '' });

  // Charger données du localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('eventix_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (err) {
        console.log('Erreur chargement données');
      }
    }
  }, []);

  // Sauvegarder données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('eventix_data', JSON.stringify(data));
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <DashboardView data={data} />}
        {activeTab === 'prospects' && <ProspectsView data={data} setData={setData} confirmModal={confirmModal} setConfirmModal={setConfirmModal} />}
        {activeTab === 'pipeline' && <PipelineView data={data} setData={setData} />}
        {activeTab === 'calendar' && <CalendarView data={data} />}
        {activeTab === 'settings' && <SettingsView setData={setData} confirmModal={confirmModal} setConfirmModal={setConfirmModal} />}
      </main>

      {/* Modal de Confirmation */}
      {confirmModal.show && (
        <ConfirmModal 
          message={confirmModal.message}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal({ show: false, onConfirm: null, message: '' });
          }}
          onCancel={() => setConfirmModal({ show: false, onConfirm: null, message: '' })}
        />
      )}
    </div>
  );
};

// ============================================================================
// MODAL DE CONFIRMATION
// ============================================================================

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
      <p className="text-slate-900 mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Confirmer
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
);

// ============================================================================
// NAVIGATION
// ============================================================================

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'prospects', label: 'Prospects', icon: Users },
    { id: 'pipeline', label: 'Pipeline CRM', icon: TrendingUp },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'settings', label: 'Données', icon: FileText },
  ];

  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Productions Eventix</h1>
          </div>

          <div className="flex gap-1 flex-wrap">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD VIEW
// ============================================================================

const DashboardView = ({ data }) => {
  const stats = [
    { label: 'Prospects', value: data.prospects.filter(p => p.stage === 'prospect').length, color: 'blue' },
    { label: 'Devis', value: data.prospects.filter(p => p.stage === 'devis').length, color: 'amber' },
    { label: 'Contrats', value: data.prospects.filter(p => p.stage === 'contrat').length, color: 'green' },
    { label: 'Revenus', value: `$${data.prospects.reduce((sum, p) => sum + p.montant, 0).toLocaleString()}`, color: 'emerald' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const colorClass = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            amber: 'bg-amber-50 text-amber-600 border-amber-200',
            green: 'bg-green-50 text-green-600 border-green-200',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          }[stat.color];

          return (
            <div key={idx} className={`${colorClass} border rounded-xl p-6`}>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Prospects par Étape</h3>
          <div className="space-y-3">
            {['prospect', 'devis', 'contrat', 'facture'].map(stage => {
              const count = data.prospects.filter(p => p.stage === stage).length;
              const labels = { prospect: 'Prospect', devis: 'Devis', contrat: 'Contrat', facture: 'Facturé' };
              return (
                <div key={stage} className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{labels[stage]}</span>
                  <span className="text-lg font-bold text-blue-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Top Prospects 🔥</h3>
          <div className="space-y-2">
            {data.prospects.sort((a, b) => b.montant - a.montant).slice(0, 5).map(prospect => (
              <div key={prospect.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span className="text-sm font-semibold text-slate-900">{prospect.nom}</span>
                <span className="text-sm font-bold text-blue-600">${prospect.montant.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PROSPECTS VIEW - CRUD COMPLET
// ============================================================================

const ProspectsView = ({ data, setData, confirmModal, setConfirmModal }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', email: '', phone: '', montant: '', stage: 'prospect', notes: ''
  });

  const handleAddEdit = () => {
    if (!formData.nom || !formData.email || !formData.montant) {
      alert('Remplissez tous les champs requis');
      return;
    }

    if (editingId) {
      setData({
        ...data,
        prospects: data.prospects.map(p =>
          p.id === editingId
            ? { ...p, ...formData, montant: parseInt(formData.montant) }
            : p
        )
      });
      setEditingId(null);
    } else {
      const newProspect = {
        id: Math.max(...data.prospects.map(p => p.id), 0) + 1,
        ...formData,
        montant: parseInt(formData.montant),
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setData({
        ...data,
        prospects: [...data.prospects, newProspect]
      });
    }

    setFormData({ nom: '', email: '', phone: '', montant: '', stage: 'prospect', notes: '' });
    setShowForm(false);
  };

  const handleDeleteClick = (id, nom) => {
    setConfirmModal({
      show: true,
      message: `Êtes-vous sûr de vouloir supprimer "${nom}"?`,
      onConfirm: () => {
        setData({
          ...data,
          prospects: data.prospects.filter(p => p.id !== id)
        });
      }
    });
  };

  const handleEdit = (prospect) => {
    setFormData({
      nom: prospect.nom,
      email: prospect.email,
      phone: prospect.phone,
      montant: prospect.montant.toString(),
      stage: prospect.stage,
      notes: prospect.notes
    });
    setEditingId(prospect.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Prospects</h2>
        <button
          onClick={() => {
            setFormData({ nom: '', email: '', phone: '', montant: '', stage: 'prospect', notes: '' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Ajouter Prospect
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Éditer' : 'Ajouter un'} Prospect</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Montant"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            />
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            >
              <option value="prospect">Prospect</option>
              <option value="devis">Devis</option>
              <option value="contrat">Contrat</option>
              <option value="facture">Facturé</option>
            </select>
            <input
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nom</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Montant</th>
                <th className="px-6 py-4 text-left font-semibold">Étape</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.prospects.map(prospect => (
                <tr key={prospect.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold">{prospect.nom}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{prospect.email}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">${prospect.montant.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      prospect.stage === 'prospect' ? 'bg-blue-100 text-blue-700' :
                      prospect.stage === 'devis' ? 'bg-amber-100 text-amber-700' :
                      prospect.stage === 'contrat' ? 'bg-green-100 text-green-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {prospect.stage.charAt(0).toUpperCase() + prospect.stage.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(prospect)}
                      className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prospect.id, prospect.nom)}
                      className="p-2 hover:bg-red-100 rounded transition text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PIPELINE VIEW - KANBAN
// ============================================================================

const PipelineView = ({ data, setData }) => {
  const stages = [
    { id: 'prospect', title: 'Prospects', color: 'blue' },
    { id: 'devis', title: 'Devis', color: 'amber' },
    { id: 'contrat', title: 'Contrats', color: 'green' },
    { id: 'facture', title: 'Facturés', color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Pipeline de Vente</h2>
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-4 gap-4" style={{ minWidth: 'min-content' }}>
          {stages.map(stage => {
            const prospects = data.prospects.filter(p => p.stage === stage.id);
            const colorClass = {
              blue: 'border-blue-200 bg-blue-50',
              amber: 'border-amber-200 bg-amber-50',
              green: 'border-green-200 bg-green-50',
              emerald: 'border-emerald-200 bg-emerald-50',
            }[stage.color];

            return (
              <div key={stage.id} className={`min-w-80 border rounded-xl p-4 ${colorClass}`}>
                <h3 className="font-bold text-lg mb-2">{stage.title}</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {prospects.length} prospect{prospects.length > 1 ? 's' : ''} • ${prospects.reduce((sum, p) => sum + p.montant, 0).toLocaleString()}
                </p>
                <div className="space-y-3">
                  {prospects.map(prospect => (
                    <div key={prospect.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition">
                      <h4 className="font-bold text-slate-900 text-sm">{prospect.nom}</h4>
                      <div className="text-lg font-bold text-blue-600 my-2">${prospect.montant.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">{prospect.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CALENDAR VIEW
// ============================================================================

const CalendarView = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay(currentDate); i++) days.push(null);
  for (let i = 1; i <= daysInMonth(currentDate); i++) days.push(i);

  const getEventsForDay = (day) => {
    const dateStr = `2024-05-${String(day).padStart(2, '0')}`;
    return data.evenements.filter(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Calendrier</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ChevronDown size={20} className="transform rotate-90" />
          </button>
          <span className="font-bold text-slate-900 min-w-48 text-center">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ChevronDown size={20} className="transform -rotate-90" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="font-bold text-slate-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-24 border rounded-lg p-2 ${
                day === null
                  ? 'bg-slate-50 border-slate-100'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              {day && (
                <>
                  <div className="font-bold text-slate-900 text-sm mb-1">{day}</div>
                  <div className="space-y-1">
                    {getEventsForDay(day).map(event => (
                      <div key={event.id} className="bg-blue-100 text-blue-700 text-xs rounded px-1 py-0.5 truncate">
                        {event.nom}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS VIEW - GÉRER LES DONNÉES
// ============================================================================

const SettingsView = ({ setData, confirmModal, setConfirmModal }) => {
  const handleExportJSON = () => {
    const saved = localStorage.getItem('eventix_data');
    const dataStr = JSON.stringify(JSON.parse(saved), null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', 'eventix_data.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResetClick = () => {
    setConfirmModal({
      show: true,
      message: 'Êtes-vous sûr de vouloir réinitialiser toutes les données?',
      onConfirm: () => {
        setData(INITIAL_DATA);
        localStorage.setItem('eventix_data', JSON.stringify(INITIAL_DATA));
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Gestion des Données</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2">Exporter les Données</h3>
          <p className="text-slate-600 text-sm mb-3">
            Téléchargez un fichier JSON avec toutes vos données
          </p>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Télécharger JSON
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2">Réinitialiser les Données</h3>
          <p className="text-slate-600 text-sm mb-3">
            Revenir aux données d'exemple initiales
          </p>
          <button
            onClick={handleResetClick}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg text-blue-900 mb-2">📍 Stockage</h3>
        <p className="text-blue-800 text-sm">
          Les données sont sauvegardées dans le <strong>localStorage</strong> de votre navigateur. 
          Elles persistent entre les sessions. Vous pouvez exporter/importer des données à tout moment.
        </p>
      </div>
    </div>
  );
};

export default EventixApp;