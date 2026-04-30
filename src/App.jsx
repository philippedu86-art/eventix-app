import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, FileText, BarChart3, 
  Plus, TrendingUp, Trash2, Edit2, Download
} from 'lucide-react';

// ===== IMPORT DONNÉES EXCEL (152 clients - premiers 10 pour démo)
const CLIENTS_EXCEL = [
  { nom: "4Célébrations", prenom: "", nomFamille: "", email: "info@4celebrations.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-07-16", notes: "" },
  { nom: "Acme Decors", prenom: "Jean-Michel", nomFamille: "Junior Pellemans", email: "jm@acmedecors.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-24", notes: "" },
  { nom: "Actions Interculturelles Canada", prenom: "Fadela", nomFamille: "Hamou", email: "fadela.hamou@aide.org", telephone: "819 923-4633", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-03-08", notes: "" },
  { nom: "Alexandra et Sasha", prenom: "", nomFamille: "", email: "alexe.morrison@hotmail.ca", telephone: "514-970-9074", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-12-06", notes: "" },
  { nom: "Angélique Michaud", prenom: "", nomFamille: "", email: "angelique.32m@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-08-04", notes: "" },
  { nom: "Anissa Bouffard", prenom: "", nomFamille: "", email: "Rhap-120@hotmail.com", telephone: "819-582-2653", mobile: "", adresse1: "1280 Rue Principale", adresse2: "", ville: "Marston", province: "Quebec", codePostal: "G0Y 1G0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-17", notes: "" },
  { nom: "Annie-Joële et Jean-Michaël", prenom: "Annie-Joële", nomFamille: "Boulanger", email: "annie_jo13@hotmail.com", telephone: "819 679-9090", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-10-09", notes: "" },
  { nom: "Arianne et Korina", prenom: "Ari", nomFamille: "Charette", email: "arianne12@live.ca", telephone: "514-953-0813", mobile: "", adresse1: "1388 Rue Mansourati", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1L 2K7", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2023-03-17", notes: "" },
  { nom: "Arjo Magog", prenom: "Mélanie", nomFamille: "Cleroux", email: "melanie.cleroux@arjo.com", telephone: "", mobile: "", adresse1: "2001 Rue Tanguay", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-04-19", notes: "" },
  { nom: "Ateliers BG", prenom: "Andreanne", nomFamille: "Arbour", email: "andreannearbour@ateliersbg.com", telephone: "", mobile: "", adresse1: "2980 rue King Est", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-09-12", notes: "" },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' ou 'edit'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedClientForDocs, setSelectedClientForDocs] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nomFamille: '',
    email: '',
    telephone: '',
    mobile: '',
    adresse1: '',
    adresse2: '',
    ville: '',
    province: '',
    codePostal: '',
    pays: '',
    website: '',
    devise: 'CAD',
    type: 'Entreprise', // Nouveau: type client
    montant: 0,
    stage: 'client',
    notes: ''
  });

  const [docForm, setDocForm] = useState({
    nom: '',
    type: 'offre',
    contenu: ''
  });

  // ===== INITIALISATION
  useEffect(() => {
    const stored = localStorage.getItem('eventix_data');
    if (stored) {
      const data = JSON.parse(stored);
      setClients(data.clients || []);
      setDocuments(data.documents || []);
    } else {
      const clientsWithIds = CLIENTS_EXCEL.map((c, idx) => ({
        ...c,
        id: `client-${idx + 1}`,
        type: c.prenom || c.nomFamille ? 'Particulier' : 'Entreprise'
      }));
      setClients(clientsWithIds);
      localStorage.setItem('eventix_data', JSON.stringify({ clients: clientsWithIds, documents: [] }));
    }
  }, []);

  // ===== AUTO-SAVE
  useEffect(() => {
    localStorage.setItem('eventix_data', JSON.stringify({ clients, documents }));
  }, [clients, documents]);

  const resetFormData = () => {
    setFormData({
      nom: '', prenom: '', nomFamille: '', email: '', telephone: '', mobile: '',
      adresse1: '', adresse2: '', ville: '', province: '', codePostal: '', pays: '',
      website: '', devise: 'CAD', type: 'Entreprise', montant: 0, stage: 'client', notes: ''
    });
  };

  const handleOpenAddForm = () => {
    resetFormData();
    setFormMode('add');
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleOpenEditForm = (client) => {
    setEditingClient(client);
    setFormData(client);
    setFormMode('edit');
    setShowClientForm(true);
  };

  const handleAddClient = () => {
    if (!formData.nom.trim()) {
      alert('Entrez au moins le nom du client');
      return;
    }
    const newClient = {
      id: Date.now().toString(),
      ...formData,
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setClients([...clients, newClient]);
    resetFormData();
    setShowClientForm(false);
    setFormMode('add');
  };

  const handleEditClient = () => {
    if (!formData.nom.trim()) {
      alert('Entrez au moins le nom du client');
      return;
    }
    const updatedClient = {
      ...editingClient,
      ...formData
    };
    setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
    resetFormData();
    setEditingClient(null);
    setShowClientForm(false);
    setFormMode('add');
  };

  const handleDeleteClient = (id) => {
    setDeleteTarget(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setClients(clients.filter(c => c.id !== deleteTarget));
    setDocuments(documents.filter(d => d.clientId !== deleteTarget));
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const handleAddDocument = () => {
    if (!docForm.nom.trim() || !selectedClientForDocs) {
      alert('Entrez le nom du document et sélectionnez un client');
      return;
    }
    const newDoc = {
      id: Date.now().toString(),
      clientId: selectedClientForDocs,
      nom: docForm.nom,
      type: docForm.type,
      contenu: docForm.contenu,
      dateCreation: new Date().toISOString().split('T')[0]
    };
    setDocuments([...documents, newDoc]);
    setDocForm({ nom: '', type: 'offre', contenu: '' });
    setShowDocForm(false);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleDownloadDocument = (doc) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc.contenu || doc.nom));
    element.setAttribute('download', `${doc.nom}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // ===== MODAL POPUP POUR ÉDITION/AJOUT
  const ClientFormModal = () => (
    showClientForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {formMode === 'add' ? '➕ Nouveau Client' : '✏️ Modifier Client'}
            </h3>
            <button
              onClick={() => { setShowClientForm(false); setFormMode('add'); resetFormData(); }}
              className="text-2xl leading-none hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de famille</label>
                <input type="text" placeholder="Nom de famille" value={formData.nomFamille} onChange={(e) => setFormData({...formData, nomFamille: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type Client *</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Entreprise">🏢 Entreprise</option>
                  <option value="Particulier">👤 Particulier</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" placeholder="Téléphone" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input type="tel" placeholder="Mobile" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse 1</label>
                <input type="text" placeholder="Adresse 1" value={formData.adresse1} onChange={(e) => setFormData({...formData, adresse1: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse 2</label>
                <input type="text" placeholder="Adresse 2" value={formData.adresse2} onChange={(e) => setFormData({...formData, adresse2: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input type="text" placeholder="Province" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
                <input type="text" placeholder="Code Postal" value={formData.codePostal} onChange={(e) => setFormData({...formData, codePostal: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                <input type="text" placeholder="Pays" value={formData.pays} onChange={(e) => setFormData({...formData, pays: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" placeholder="Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <select value={formData.devise} onChange={(e) => setFormData({...formData, devise: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="client">Client</option>
                  <option value="devis">Devis</option>
                  <option value="contrat">Contrat</option>
                  <option value="facture">Facturé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                <input type="number" placeholder="Montant" value={formData.montant} onChange={(e) => setFormData({...formData, montant: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-100 p-4 flex gap-3 justify-end border-t">
            <button
              onClick={() => { setShowClientForm(false); setFormMode('add'); resetFormData(); }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium transition"
            >
              ❌ Annuler
            </button>
            <button
              onClick={formMode === 'add' ? handleAddClient : handleEditClient}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition"
            >
              {formMode === 'add' ? '✅ Ajouter' : '✅ Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    )
  );

  // ===== CONFIRMATION MODAL
  const ConfirmModal = () => (
    showConfirmModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
          <p className="text-gray-600 mb-6">Cette action est irréversible. Les documents associés seront également supprimés.</p>
          <div className="flex gap-3">
            <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition">
              🗑️ Supprimer
            </button>
            <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium transition">
              ❌ Annuler
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clients</p>
              <p className="text-4xl font-bold mt-2">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Facturés</p>
              <p className="text-4xl font-bold mt-2">{clients.filter(c => c.stage === 'facture').length}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Documents</p>
              <p className="text-4xl font-bold mt-2">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm font-medium">Entreprises</p>
              <p className="text-4xl font-bold mt-2">{clients.filter(c => c.type === 'Entreprise').length}</p>
            </div>
            <BarChart3 className="w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
          <div className="space-y-3">
            {clients.slice(0, 5).map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{c.nom}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${c.type === 'Entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                  {c.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition par Étape</h3>
          <div className="space-y-3">
            {['client', 'devis', 'contrat', 'facture'].map(stage => {
              const count = clients.filter(c => c.stage === stage).length;
              const percent = clients.length > 0 ? (count / clients.length * 100).toFixed(0) : 0;
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{stage}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-4">
      <button
        onClick={handleOpenAddForm}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        <Plus className="w-5 h-5" /> Ajouter Client
      </button>

      <input
        type="text"
        placeholder="Rechercher par nom, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-2">
        {clients
          .filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(client => (
            <div key={client.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg">{client.nom}</p>
                {client.prenom && <p className="text-sm text-gray-600">{client.prenom} {client.nomFamille}</p>}
                <p className="text-sm text-gray-500">{client.email}</p>
                {client.telephone && <p className="text-sm text-gray-500">📞 {client.telephone}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${client.type === 'Entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                    {client.type === 'Entreprise' ? '🏢' : '👤'} {client.type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    {client.stage}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                    📄 {documents.filter(d => d.clientId === client.id).length} docs
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleOpenEditForm(client)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                >
                  <Edit2 className="w-4 h-4" /> Modifier
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      {showDocForm && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold">Ajouter Document</h3>
          <select
            value={selectedClientForDocs}
            onChange={(e) => setSelectedClientForDocs(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Sélectionnez un client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
          <input type="text" placeholder="Nom du document" value={docForm.nom} onChange={(e) => setDocForm({...docForm, nom: e.target.value})} className="w-full px-3 py-2 border rounded" />
          <select value={docForm.type} onChange={(e) => setDocForm({...docForm, type: e.target.value})} className="w-full px-3 py-2 border rounded">
            <option value="offre">Offre de Service</option>
            <option value="facture">Facture</option>
            <option value="autre">Autre</option>
          </select>
          <textarea placeholder="Contenu" value={docForm.contenu} onChange={(e) => setDocForm({...docForm, contenu: e.target.value})} className="w-full px-3 py-2 border rounded" rows="5" />
          <div className="flex gap-2">
            <button onClick={handleAddDocument} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition">
              Ajouter
            </button>
            <button onClick={() => setShowDocForm(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium transition">
              Annuler
            </button>
          </div>
        </div>
      )}

      {!showDocForm && (
        <button
          onClick={() => setShowDocForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" /> Ajouter Document
        </button>
      )}

      <div className="space-y-2">
        {documents.map(doc => {
          const client = clients.find(c => c.id === doc.clientId);
          return (
            <div key={doc.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{doc.nom}</p>
                  <p className="text-sm text-gray-600">{client?.nom}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      doc.type === 'offre' ? 'bg-blue-100 text-blue-700' :
                      doc.type === 'facture' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {doc.type === 'offre' ? 'Offre de Service' : doc.type === 'facture' ? 'Facture' : 'Autre'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDownloadDocument(doc)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                  >
                    <Download className="w-4 h-4" /> Télécharger
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPipeline = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {['client', 'devis', 'contrat', 'facture'].map(stage => (
        <div key={stage} className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 capitalize">{stage}</h3>
          <div className="space-y-2">
            {clients.filter(c => c.stage === stage).map(c => (
              <div key={c.id} className="bg-white rounded p-3 cursor-pointer hover:shadow-md transition">
                <p className="font-medium text-sm">{c.nom}</p>
                <p className="text-xs text-gray-500">{c.email}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendar = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="px-4 py-2 bg-gray-300 rounded">
            ◀ Précédent
          </button>
          <h3 className="text-xl font-semibold">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="px-4 py-2 bg-gray-300 rounded">
            Suivant ▶
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
            <div key={d} className="text-center font-semibold text-gray-600 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center rounded ${
                day ? 'bg-blue-100 text-blue-900 font-medium' : 'bg-gray-50'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderData = () => (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <button
        onClick={() => {
          const data = JSON.stringify({ clients, documents }, null, 2);
          const element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
          element.setAttribute('download', `eventix_data_${new Date().toISOString().split('T')[0]}.json`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        <Download className="w-5 h-5" /> Exporter JSON
      </button>
      <button
        onClick={() => {
          if (window.confirm('Êtes-vous sûr? Cette action est irréversible.')) {
            setClients([]);
            setDocuments([]);
            localStorage.removeItem('eventix_data');
          }
        }}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        <Trash2 className="w-5 h-5" /> Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">📊 Eventix CRM V7</h1>
          <p className="text-sm text-blue-100">Avec Modal Popup & Type Client</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'pipeline', label: 'Pipeline CRM', icon: TrendingUp },
            { id: 'calendar', label: 'Calendrier', icon: Calendar },
            { id: 'data', label: 'Données', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'pipeline' && renderPipeline()}
          {activeTab === 'calendar' && renderCalendar()}
          {activeTab === 'data' && renderData()}
        </div>
      </div>

      <ClientFormModal />
      <ConfirmModal />
    </div>
  );
};

export default App;