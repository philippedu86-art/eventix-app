import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, FileText, BarChart3, 
  ChevronDown, Plus, TrendingUp, Trash2, Edit2, File, Download, X
} from 'lucide-react';

// ============================================================================
// DONNÉES INITIALES (JSON)
// ============================================================================

const INITIAL_DATA = {
  clients: [
    { id: 1, nom: 'TechCorp Inc.', type: 'Entreprise', email: 'contact@techcorp.com', phone: '01 23 45 67 89', montant: 8500, stage: 'client', dateCreation: '2024-05-01', notes: 'Client très intéressé' },
    { id: 2, nom: 'Finance Global', type: 'Entreprise', email: 'hello@finance.com', phone: '01 34 56 78 90', montant: 12000, stage: 'devis', dateCreation: '2024-05-05', notes: 'Devis envoyé le 05/05' },
    { id: 3, nom: 'Jean Dupont', type: 'Particulier', email: 'info@startup.com', phone: '02 45 67 89 01', montant: 5500, stage: 'client', dateCreation: '2024-05-10', notes: 'À relancer' },
    { id: 4, nom: 'BigCorp Inc', type: 'Entreprise', email: 'sales@bigcorp.com', phone: '03 56 78 90 12', montant: 15000, stage: 'contrat', dateCreation: '2024-04-15', notes: 'Contrat signé' },
    { id: 5, nom: 'Marie Martin', type: 'Particulier', email: 'contact@global.com', phone: '04 67 89 01 23', montant: 9800, stage: 'facture', dateCreation: '2024-03-20', notes: 'En cours de réalisation' },
  ],
  documents: [
    { id: 1, clientId: 1, nom: 'Offre de service Q2', type: 'offre', dateCreation: '2024-05-01', contenu: 'Offre complète pour services web' },
    { id: 2, clientId: 1, nom: 'Facture 001', type: 'facture', dateCreation: '2024-05-15', contenu: 'Facture pour prestation avril' },
    { id: 3, clientId: 2, nom: 'Offre services marketing', type: 'offre', dateCreation: '2024-05-05', contenu: 'Offre marketing digital' },
    { id: 4, clientId: 4, nom: 'Contrat prestations', type: 'autre', dateCreation: '2024-04-20', contenu: 'Document contractuel' },
  ],
  evenements: [
    { id: 1, nom: 'Gala Annuel', date: '2024-05-22', clientId: 4, description: 'Grand événement' },
    { id: 2, nom: 'Conférence Tech', date: '2024-05-28', clientId: 1, description: 'Séminaire' },
    { id: 3, nom: 'Réunion Équipe', date: '2024-05-31', clientId: 2, description: 'Meeting interne' },
  ]
};

// ============================================================================
// APPLICATION PRINCIPALE
// ============================================================================

const EventixApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [confirmModal, setConfirmModal] = useState({ show: false, onConfirm: null, message: '' });
  const [selectedClientId, setSelectedClientId] = useState(null);

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
        {activeTab === 'clients' && <ClientsView data={data} setData={setData} confirmModal={confirmModal} setConfirmModal={setConfirmModal} setSelectedClientId={setSelectedClientId} setActiveTab={setActiveTab} />}
        {activeTab === 'documents' && <DocumentsView data={data} setData={setData} confirmModal={confirmModal} setConfirmModal={setConfirmModal} selectedClientId={selectedClientId} />}
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
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
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
    { label: 'Clients', value: data.clients.filter(c => c.stage === 'client').length, color: 'blue' },
    { label: 'Devis', value: data.clients.filter(c => c.stage === 'devis').length, color: 'amber' },
    { label: 'Contrats', value: data.clients.filter(c => c.stage === 'contrat').length, color: 'green' },
    { label: 'Revenus', value: `$${data.clients.reduce((sum, c) => sum + c.montant, 0).toLocaleString()}`, color: 'emerald' },
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
          <h3 className="font-bold text-lg text-slate-900 mb-4">Clients par Étape</h3>
          <div className="space-y-3">
            {['client', 'devis', 'contrat', 'facture'].map(stage => {
              const count = data.clients.filter(c => c.stage === stage).length;
              const labels = { client: 'Client', devis: 'Devis', contrat: 'Contrat', facture: 'Facturé' };
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
          <h3 className="font-bold text-lg text-slate-900 mb-4">Top Clients 🔥</h3>
          <div className="space-y-2">
            {data.clients.sort((a, b) => b.montant - a.montant).slice(0, 5).map(client => (
              <div key={client.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <div>
                  <span className="text-sm font-semibold text-slate-900">{client.nom}</span>
                  <div className="text-xs text-slate-500">{client.type}</div>
                </div>
                <span className="text-sm font-bold text-blue-600">${client.montant.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CLIENTS VIEW - CRUD COMPLET
// ============================================================================

const ClientsView = ({ data, setData, confirmModal, setConfirmModal, setSelectedClientId, setActiveTab }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', type: 'Entreprise', email: '', phone: '', montant: '', stage: 'client', notes: ''
  });

  const handleAddEdit = () => {
    if (!formData.nom || !formData.email || !formData.montant) {
      alert('Remplissez tous les champs requis');
      return;
    }

    if (editingId) {
      setData({
        ...data,
        clients: data.clients.map(c =>
          c.id === editingId
            ? { ...c, ...formData, montant: parseInt(formData.montant) }
            : c
        )
      });
      setEditingId(null);
    } else {
      const newClient = {
        id: Math.max(...data.clients.map(c => c.id), 0) + 1,
        ...formData,
        montant: parseInt(formData.montant),
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setData({
        ...data,
        clients: [...data.clients, newClient]
      });
    }

    setFormData({ nom: '', type: 'Entreprise', email: '', phone: '', montant: '', stage: 'client', notes: '' });
    setShowForm(false);
  };

  const handleDeleteClick = (id, nom) => {
    setConfirmModal({
      show: true,
      message: `Êtes-vous sûr de vouloir supprimer le client "${nom}"?`,
      onConfirm: () => {
        setData({
          ...data,
          clients: data.clients.filter(c => c.id !== id),
          documents: data.documents.filter(d => d.clientId !== id)
        });
      }
    });
  };

  const handleEdit = (client) => {
    setFormData({
      nom: client.nom,
      type: client.type,
      email: client.email,
      phone: client.phone,
      montant: client.montant.toString(),
      stage: client.stage,
      notes: client.notes
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleViewDocuments = (clientId) => {
    setSelectedClientId(clientId);
    setActiveTab('documents');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Clients</h2>
        <button
          onClick={() => {
            setFormData({ nom: '', type: 'Entreprise', email: '', phone: '', montant: '', stage: 'client', notes: '' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Ajouter Client
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Éditer' : 'Ajouter un'} Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2"
            >
              <option value="Entreprise">Entreprise</option>
              <option value="Particulier">Particulier</option>
            </select>
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
              <option value="client">Client</option>
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
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Montant</th>
                <th className="px-6 py-4 text-left font-semibold">Étape</th>
                <th className="px-6 py-4 text-left font-semibold">Documents</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map(client => {
                const docCount = data.documents.filter(d => d.clientId === client.id).length;
                return (
                  <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold">{client.nom}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        client.type === 'Entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.email}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">${client.montant.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        client.stage === 'client' ? 'bg-blue-100 text-blue-700' :
                        client.stage === 'devis' ? 'bg-amber-100 text-amber-700' :
                        client.stage === 'contrat' ? 'bg-green-100 text-green-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {client.stage.charAt(0).toUpperCase() + client.stage.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDocuments(client.id)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300 flex items-center gap-1"
                      >
                        <FileText size={14} />
                        {docCount}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client.id, client.nom)}
                        className="p-2 hover:bg-red-100 rounded transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DOCUMENTS VIEW - GESTION DES DOCUMENTS PAR CLIENT
// ============================================================================

const DocumentsView = ({ data, setData, confirmModal, setConfirmModal, selectedClientId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', type: 'offre', contenu: ''
  });

  const clientId = selectedClientId || (data.clients.length > 0 ? data.clients[0].id : null);
  const currentClient = data.clients.find(c => c.id === clientId);
  const clientDocuments = data.documents.filter(d => d.clientId === clientId);

  const handleAddEdit = () => {
    if (!formData.nom || !formData.type) {
      alert('Remplissez tous les champs requis');
      return;
    }

    if (editingId) {
      setData({
        ...data,
        documents: data.documents.map(d =>
          d.id === editingId
            ? { ...d, ...formData }
            : d
        )
      });
      setEditingId(null);
    } else {
      const newDocument = {
        id: Math.max(...data.documents.map(d => d.id), 0) + 1,
        clientId: clientId,
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setData({
        ...data,
        documents: [...data.documents, newDocument]
      });
    }

    setFormData({ nom: '', type: 'offre', contenu: '' });
    setShowForm(false);
  };

  const handleDeleteClick = (id, nom) => {
    setConfirmModal({
      show: true,
      message: `Êtes-vous sûr de vouloir supprimer le document "${nom}"?`,
      onConfirm: () => {
        setData({
          ...data,
          documents: data.documents.filter(d => d.id !== id)
        });
      }
    });
  };

  const handleEdit = (doc) => {
    setFormData({
      nom: doc.nom,
      type: doc.type,
      contenu: doc.contenu
    });
    setEditingId(doc.id);
    setShowForm(true);
  };

  const handleDownload = (doc) => {
    const element = document.createElement('a');
    const file = new Blob([`${doc.nom}\n\n${doc.contenu}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.nom}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!currentClient) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Aucun client disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Gestion des Documents</h2>
        <p className="text-slate-600">Client sélectionné: <span className="font-bold text-blue-700">{currentClient.nom}</span></p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Documents ({clientDocuments.length})</h3>
        </div>
        <button
          onClick={() => {
            setFormData({ nom: '', type: 'offre', contenu: '' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Ajouter Document
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Éditer' : 'Ajouter un'} Document</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom du document"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            >
              <option value="offre">Offre de Service</option>
              <option value="facture">Facture</option>
              <option value="autre">Autre</option>
            </select>
            <textarea
              placeholder="Contenu ou notes du document"
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 h-32 resize-none"
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

      <div className="space-y-3">
        {clientDocuments.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600">Aucun document pour ce client</p>
          </div>
        ) : (
          clientDocuments.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <File size={18} className="text-blue-600" />
                    {doc.nom}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      doc.type === 'offre' ? 'bg-blue-100 text-blue-700' :
                      doc.type === 'facture' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.type === 'offre' ? 'Offre de Service' : doc.type === 'facture' ? 'Facture' : 'Autre'}
                    </span>
                    <span className="text-xs text-slate-500">{doc.dateCreation}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                    title="Télécharger"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 hover:bg-amber-100 rounded transition text-amber-600"
                    title="Éditer"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doc.id, doc.nom)}
                    className="p-2 hover:bg-red-100 rounded transition text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {doc.contenu && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-slate-600 text-sm">
                  {doc.contenu}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PIPELINE VIEW - KANBAN
// ============================================================================

const PipelineView = ({ data }) => {
  const stages = [
    { id: 'client', title: 'Clients', color: 'blue' },
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
            const clients = data.clients.filter(c => c.stage === stage.id);
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
                  {clients.length} client{clients.length > 1 ? 's' : ''} • ${clients.reduce((sum, c) => sum + c.montant, 0).toLocaleString()}
                </p>
                <div className="space-y-3">
                  {clients.map(client => (
                    <div key={client.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition">
                      <h4 className="font-bold text-slate-900 text-sm">{client.nom}</h4>
                      <div className="text-xs text-slate-500 mb-2">{client.type}</div>
                      <div className="text-lg font-bold text-blue-600">${client.montant.toLocaleString()}</div>
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