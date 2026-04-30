import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, FileText, BarChart3, 
  Plus, TrendingUp, Trash2, Edit2, Download, ChevronLeft, ChevronRight, Check
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
  const [formMode, setFormMode] = useState('add');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedClientForDocs, setSelectedClientForDocs] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // ===== ÉTATS POUR PAGINATION ET SÉLECTION MULTIPLE
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedClients, setSelectedClients] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [bulkActionValue, setBulkActionValue] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

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
    type: 'Entreprise',
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

  // ===== GESTION SÉLECTION MULTIPLE
  const toggleClientSelection = (id) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedClients(newSelected);
  };

  const toggleSelectAll = (clientsOnPage) => {
    const pageIds = new Set(clientsOnPage.map(c => c.id));
    const newSelected = new Set(selectedClients);
    
    const allSelected = clientsOnPage.every(c => newSelected.has(c.id));
    
    if (allSelected) {
      clientsOnPage.forEach(c => newSelected.delete(c.id));
    } else {
      clientsOnPage.forEach(c => newSelected.add(c.id));
    }
    setSelectedClients(newSelected);
  };

  // ===== ACTIONS EN MASSE
  const handleBulkAction = () => {
    if (selectedClients.size === 0) {
      alert('Sélectionnez au moins un client');
      return;
    }

    if (bulkAction === 'delete') {
      setShowBulkDeleteConfirm(true);
    } else if (bulkAction === 'stage' && bulkActionValue) {
      const updatedClients = clients.map(c => 
        selectedClients.has(c.id) ? { ...c, stage: bulkActionValue } : c
      );
      setClients(updatedClients);
      setSelectedClients(new Set());
      setBulkAction('');
      setBulkActionValue('');
      alert(`${selectedClients.size} client(s) mis à jour`);
    }
  };

  const confirmBulkDelete = () => {
    setClients(clients.filter(c => !selectedClients.has(c.id)));
    setDocuments(documents.filter(d => !selectedClients.has(d.clientId)));
    setSelectedClients(new Set());
    setBulkAction('');
    setShowBulkDeleteConfirm(false);
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
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">{formMode === 'add' ? 'Ajouter Client' : 'Modifier Client'}</h2>
            <button onClick={() => { setShowClientForm(false); resetFormData(); }} className="text-2xl hover:text-blue-200">×</button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nom*" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
              <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="text" placeholder="Nom de Famille" value={formData.nomFamille} onChange={(e) => setFormData({...formData, nomFamille: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="tel" placeholder="Téléphone" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="tel" placeholder="Mobile" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="text" placeholder="Adresse 1" value={formData.adresse1} onChange={(e) => setFormData({...formData, adresse1: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
              <input type="text" placeholder="Adresse 2" value={formData.adresse2} onChange={(e) => setFormData({...formData, adresse2: e.target.value})} className="col-span-2 px-3 py-2 border rounded" />
              <input type="text" placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="text" placeholder="Province" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="text" placeholder="Code Postal" value={formData.codePostal} onChange={(e) => setFormData({...formData, codePostal: e.target.value})} className="px-3 py-2 border rounded" />
              <input type="text" placeholder="Pays" value={formData.pays} onChange={(e) => setFormData({...formData, pays: e.target.value})} className="px-3 py-2 border rounded" />
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="px-3 py-2 border rounded">
                <option value="Entreprise">Entreprise</option>
                <option value="Particulier">Particulier</option>
              </select>
              <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="px-3 py-2 border rounded">
                <option value="client">Client</option>
                <option value="devis">Devis</option>
                <option value="contrat">Contrat</option>
                <option value="facture">Facture</option>
              </select>
              <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="col-span-2 px-3 py-2 border rounded h-20" />
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 flex gap-2 justify-end sticky bottom-0">
            <button onClick={() => { setShowClientForm(false); resetFormData(); }} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-medium">Annuler</button>
            <button onClick={formMode === 'add' ? handleAddClient : handleEditClient} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium">{formMode === 'add' ? 'Ajouter' : 'Mettre à jour'}</button>
          </div>
        </div>
      </div>
    )
  );

  const ConfirmModal = () => (
    (showConfirmModal || showBulkDeleteConfirm) && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Confirmation de suppression</h3>
          <p className="text-gray-600 mb-6">
            {showBulkDeleteConfirm 
              ? `Êtes-vous sûr de vouloir supprimer ${selectedClients.size} client(s)? Cette action est irréversible.`
              : 'Êtes-vous sûr de vouloir supprimer ce client? Cette action est irréversible.'}
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowConfirmModal(false); setShowBulkDeleteConfirm(false); }} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-medium">Annuler</button>
            <button onClick={showBulkDeleteConfirm ? confirmBulkDelete : confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium">Supprimer</button>
          </div>
        </div>
      </div>
    )
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
          <p className="text-sm opacity-90">Total Clients</p>
          <p className="text-4xl font-bold">{clients.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-md">
          <p className="text-sm opacity-90">Entreprises</p>
          <p className="text-4xl font-bold">{clients.filter(c => c.type === 'Entreprise').length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-md">
          <p className="text-sm opacity-90">Particuliers</p>
          <p className="text-4xl font-bold">{clients.filter(c => c.type === 'Particulier').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-md">
          <p className="text-sm opacity-90">Documents</p>
          <p className="text-4xl font-bold">{documents.length}</p>
        </div>
      </div>
    </div>
  );

  // ===== RENDU CLIENTS AVEC PAGINATION ET TABLEAU
  const renderClients = () => {
    const filteredClients = clients.filter(c => 
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientsOnPage = filteredClients.slice(startIndex, endIndex);
    const allClientOnPageSelected = clientsOnPage.length > 0 && clientsOnPage.every(c => selectedClients.has(c.id));

    return (
      <div className="space-y-4">
        {/* BARRE DE CONTRÔLE */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="🔍 Rechercher par nom ou email..." 
                value={searchTerm} 
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleOpenAddForm}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Plus className="w-5 h-5" /> Ajouter
              </button>
            </div>
          </div>

          {/* OPTIONS PAGINATION ET SÉLECTION */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t pt-3">
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Lignes par page:</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">
                {filteredClients.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, filteredClients.length)}` : '0'} sur {filteredClients.length}
              </span>
            </div>

            {selectedClients.size > 0 && (
              <div className="flex gap-2 items-center bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium">{selectedClients.size} sélectionné(s)</span>
                <select 
                  value={bulkAction} 
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">-- Action --</option>
                  <option value="stage">Changer le statut</option>
                  <option value="delete">Supprimer</option>
                </select>
                {bulkAction === 'stage' && (
                  <select 
                    value={bulkActionValue} 
                    onChange={(e) => setBulkActionValue(e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="">-- Statut --</option>
                    <option value="client">Client</option>
                    <option value="devis">Devis</option>
                    <option value="contrat">Contrat</option>
                    <option value="facture">Facture</option>
                  </select>
                )}
                <button
                  onClick={handleBulkAction}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition"
                >
                  Appliquer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TABLEAU CLIENTS */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold w-8">
                  <input 
                    type="checkbox" 
                    checked={allClientOnPageSelected}
                    onChange={() => toggleSelectAll(clientsOnPage)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Téléphone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Docs</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientsOnPage.map(client => (
                <tr key={client.id} className={`hover:bg-blue-50 transition ${selectedClients.has(client.id) ? 'bg-blue-100' : ''}`}>
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedClients.has(client.id)}
                      onChange={() => toggleClientSelection(client.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{client.nom}</div>
                    {(client.prenom || client.nomFamille) && (
                      <div className="text-xs text-gray-500">{client.prenom} {client.nomFamille}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{client.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{client.telephone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${client.type === 'Entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {client.type === 'Entreprise' ? '🏢' : '👤'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      client.stage === 'client' ? 'bg-green-100 text-green-700' :
                      client.stage === 'devis' ? 'bg-yellow-100 text-yellow-700' :
                      client.stage === 'contrat' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {client.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {documents.filter(d => d.clientId === client.id).length}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditForm(client)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition"
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>
              
              {/* NUMÉROS DE PAGE */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                  .map((page, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== page - 1) {
                      return (
                        <span key={`dots-${idx}`} className="px-2 py-2">...</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition ${
                          currentPage === page 
                            ? 'bg-blue-500 text-white font-semibold' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg transition"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {clientsOnPage.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            {searchTerm ? '❌ Aucun client trouvé' : '📋 Aucun client pour le moment'}
          </div>
        )}
      </div>
    );
  };

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
          <textarea placeholder="Contenu du document" value={docForm.contenu} onChange={(e) => setDocForm({...docForm, contenu: e.target.value})} className="w-full px-3 py-2 border rounded h-32" />
          <div className="flex gap-2">
            <button onClick={handleAddDocument} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition">✓ Ajouter Document</button>
            <button onClick={() => setShowDocForm(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition">Annuler</button>
          </div>
        </div>
      )}

      <button onClick={() => setShowDocForm(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition">
        <Plus className="w-5 h-5" /> Nouveau Document
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <h1 className="text-2xl font-bold">📊 Eventix CRM V8</h1>
          <p className="text-sm text-blue-100">Avec Pagination, Tableau & Sélection Multiple</p>
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