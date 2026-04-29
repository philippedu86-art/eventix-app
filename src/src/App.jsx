import React, { useState, useEffect } from 'react';
import { Calendar, Users, Package, FileText, AlertCircle, Plus, Trash2, Eye, Edit2, ChevronDown, X } from 'lucide-react';

const EventixApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [conflictWarnings, setConflictWarnings] = useState([]);

  // Sample data initialization
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Check for material allocation conflicts
  useEffect(() => {
    checkConflicts();
  }, [allocations, contracts]);

  const initializeSampleData = () => {
    setClients([
      { id: 'CLI001', name: 'Groupe Acme Inc.', email: 'contact@acme.com', phone: '514-555-0001', address: '123 Rue St-Laurent, Montréal', type: 'Corporatif' },
      { id: 'CLI002', name: 'Société XYZ', email: 'hello@xyz.ca', phone: '514-555-0002', address: '456 Av. Park, Montréal', type: 'Corporatif' },
    ]);

    setMaterials([
      { id: 'MAT001', name: 'Haut-parleur PA 1000W', category: 'Sono', quantity: 2, status: 'Disponible', location: 'Entrepôt', costPerDay: 150 },
      { id: 'MAT002', name: 'Table DJ Pioneer DDJ-1000', category: 'DJ', quantity: 1, status: 'Disponible', location: 'Entrepôt', costPerDay: 200 },
      { id: 'MAT003', name: 'PhotoBooth complet', category: 'PhotoBooth', quantity: 1, status: 'Disponible', location: 'Entrepôt', costPerDay: 400 },
      { id: 'MAT004', name: 'Système d\'éclairage LED', category: 'Éclairage', quantity: 5, status: 'Disponible', location: 'Entrepôt', costPerDay: 50 },
      { id: 'MAT005', name: 'Microphone sans fil HT', category: 'DJ', quantity: 4, status: 'Disponible', location: 'Entrepôt', costPerDay: 30 },
    ]);

    setServices([
      { id: 'SVC001', name: 'DJ', priceCorporate: 600, priceWedding: 800, description: 'Service de DJ professionnel' },
      { id: 'SVC002', name: 'Animation', priceCorporate: 400, priceWedding: 600, description: 'Animation d\'événement' },
      { id: 'SVC003', name: 'Sonorisation', priceCorporate: 500, priceWedding: 800, description: 'Système complet de son' },
      { id: 'SVC004', name: 'PhotoBooth', priceCorporate: 300, priceWedding: 400, description: 'Service PhotoBooth' },
    ]);

    setContracts([
      { 
        id: 'CNT001', 
        clientId: 'CLI001', 
        eventName: 'Conférence Annuelle 2024', 
        eventDate: '2024-06-15', 
        eventTime: '09:00', 
        location: 'Centre-ville, Montréal',
        eventType: 'Corporatif',
        services: ['DJ', 'Sono'],
        status: 'Contrat signé',
        amount: 2000,
        deposit: 500
      },
      {
        id: 'CNT002',
        clientId: 'CLI002',
        eventName: 'Gala d\'entreprise',
        eventDate: '2024-06-20',
        eventTime: '18:00',
        location: 'Hôtel Renaissance',
        eventType: 'Corporatif',
        services: ['DJ', 'Animation', 'PhotoBooth'],
        status: 'Devis',
        amount: 3500,
        deposit: 0
      }
    ]);

    setAllocations([
      { id: 'ALL001', contractId: 'CNT001', materialId: 'MAT002', quantity: 1, startDate: '2024-06-15', endDate: '2024-06-15', status: 'Réservé' },
      { id: 'ALL002', contractId: 'CNT001', materialId: 'MAT001', quantity: 2, startDate: '2024-06-15', endDate: '2024-06-15', status: 'Réservé' },
    ]);
  };

  const checkConflicts = () => {
    const warnings = [];
    
    allocations.forEach((alloc1, idx1) => {
      allocations.forEach((alloc2, idx2) => {
        if (idx1 < idx2 && alloc1.materialId === alloc2.materialId) {
          const start1 = new Date(alloc1.startDate);
          const end1 = new Date(alloc1.endDate);
          const start2 = new Date(alloc2.startDate);
          const end2 = new Date(alloc2.endDate);

          if ((start1 <= end2 && end1 >= start2)) {
            const mat = materials.find(m => m.id === alloc1.materialId);
            const contract1 = contracts.find(c => c.id === alloc1.contractId);
            const contract2 = contracts.find(c => c.id === alloc2.contractId);
            
            warnings.push({
              id: `${alloc1.id}-${alloc2.id}`,
              material: mat?.name,
              contract1: contract1?.eventName,
              contract2: contract2?.eventName,
              date: alloc1.startDate
            });
          }
        }
      });
    });

    setConflictWarnings(warnings);
  };

  const addItem = (type, data) => {
    if (type === 'client') {
      const newId = `CLI${String(clients.length + 1).padStart(3, '0')}`;
      setClients([...clients, { id: newId, ...data }]);
    } else if (type === 'contract') {
      const newId = `CNT${String(contracts.length + 1).padStart(3, '0')}`;
      setContracts([...contracts, { id: newId, ...data }]);
    } else if (type === 'material') {
      const newId = `MAT${String(materials.length + 1).padStart(3, '0')}`;
      setMaterials([...materials, { id: newId, ...data }]);
    } else if (type === 'allocation') {
      const newId = `ALL${String(allocations.length + 1).padStart(3, '0')}`;
      setAllocations([...allocations, { id: newId, ...data }]);
    }
    setShowModal(false);
  };

  const deleteItem = (type, id) => {
    if (type === 'client') setClients(clients.filter(c => c.id !== id));
    else if (type === 'contract') setContracts(contracts.filter(c => c.id !== id));
    else if (type === 'material') setMaterials(materials.filter(m => m.id !== id));
    else if (type === 'allocation') setAllocations(allocations.filter(a => a.id !== id));
  };

  // Component: Dashboard
  const Dashboard = () => {
    const upcomingEvents = contracts
      .filter(c => new Date(c.eventDate) >= new Date())
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
      .slice(0, 5);

    const totalRevenue = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
    const paidRevenue = contracts.reduce((sum, c) => sum + (c.deposit || 0), 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 text-2xl font-bold">{clients.length}</div>
            <div className="text-gray-600 text-sm">Clients</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 text-2xl font-bold">{contracts.length}</div>
            <div className="text-gray-600 text-sm">Contrats</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-600 text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Revenus totaux</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-orange-600 text-2xl font-bold">${(totalRevenue - paidRevenue).toLocaleString()}</div>
            <div className="text-gray-600 text-sm">À percevoir</div>
          </div>
        </div>

        {conflictWarnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
              <AlertCircle size={20} />
              {conflictWarnings.length} Conflit(s) détecté(s)
            </div>
            {conflictWarnings.map(w => (
              <div key={w.id} className="text-sm text-red-600 ml-6">
                • {w.material}: réservé à la fois pour "{w.contract1}" et "{w.contract2}" le {w.date}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-4">📅 Événements à venir</h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                  <div>
                    <div className="font-semibold">{event.eventName}</div>
                    <div className="text-sm text-gray-600">{event.eventDate} à {event.eventTime}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">${event.amount}</div>
                    <div className="text-xs text-gray-500">{event.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun événement à venir</p>
          )}
        </div>
      </div>
    );
  };

  // Component: Clients List
  const ClientsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des Clients</h2>
          <button
            onClick={() => { setModalType('client'); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Ajouter Client
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {clients.map(client => (
            <div key={client.id} className="border border-gray-200 p-4 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-lg">{client.name}</div>
                  <div className="text-sm text-gray-600">{client.type}</div>
                </div>
                <button
                  onClick={() => deleteItem('client', client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>📧 {client.email}</div>
                <div>📞 {client.phone}</div>
                <div>📍 {client.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component: Contracts List
  const ContractsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des Contrats</h2>
          <button
            onClick={() => { setModalType('contract'); setShowModal(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Plus size={18} /> Ajouter Contrat
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {contracts.map(contract => {
            const client = clients.find(c => c.id === contract.clientId);
            return (
              <div key={contract.id} className="border border-gray-200 p-4 rounded-lg bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{contract.eventName}</div>
                    <div className="text-sm text-gray-600">{client?.name}</div>
                  </div>
                  <button
                    onClick={() => deleteItem('contract', contract.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>📅 {contract.eventDate} {contract.eventTime}</div>
                  <div>📍 {contract.location}</div>
                  <div className="font-semibold text-green-600">${contract.amount}</div>
                  <div className="text-gray-600">{contract.status}</div>
                </div>
                <div className="text-xs text-gray-600">
                  Services: {contract.services?.join(', ') || 'N/A'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component: Materials List
  const MaterialsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion du Matériel</h2>
          <button
            onClick={() => { setModalType('material'); setShowModal(true); }}
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={18} /> Ajouter Matériel
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(material => (
            <div key={material.id} className="border border-gray-200 p-4 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{material.name}</div>
                  <div className="text-sm text-gray-600">{material.category}</div>
                </div>
                <button
                  onClick={() => deleteItem('material', material.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Quantité: <span className="font-semibold">{material.quantity}</span></div>
                <div>État: <span className={material.status === 'Disponible' ? 'text-green-600' : 'text-orange-600'}>{material.status}</span></div>
                <div>Localisation: {material.location}</div>
                <div className="text-green-600 font-semibold">${material.costPerDay}/jour</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component: Allocations
  const AllocationsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Allocations Matériel</h2>
          <button
            onClick={() => { setModalType('allocation'); setShowModal(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus size={18} /> Allouer Matériel
          </button>
        </div>

        {conflictWarnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <AlertCircle size={20} />
              ⚠️ Conflits détectés!
            </div>
            <div className="mt-2 space-y-1">
              {conflictWarnings.map(w => (
                <div key={w.id} className="text-sm text-red-600">
                  • {w.material} réservé pour 2 événements le {w.date}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {allocations.map(alloc => {
            const material = materials.find(m => m.id === alloc.materialId);
            const contract = contracts.find(c => c.id === alloc.contractId);
            return (
              <div key={alloc.id} className="border border-gray-200 p-4 rounded-lg bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{material?.name}</div>
                    <div className="text-sm text-gray-600">Événement: {contract?.eventName}</div>
                    <div className="text-sm text-gray-600">{alloc.startDate} → {alloc.endDate}</div>
                    <div className="text-sm">Quantité: <span className="font-semibold">{alloc.quantity}</span></div>
                  </div>
                  <button
                    onClick={() => deleteItem('allocation', alloc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Modal Forms
  const ClientForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'Corporatif'
    });

    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nom de l'entreprise"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Adresse"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>Corporatif</option>
          <option>Mariage</option>
          <option>Fête</option>
          <option>Autre</option>
        </select>
        <button
          onClick={() => onSubmit('client', formData)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ajouter Client
        </button>
      </div>
    );
  };

  const ContractForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      clientId: clients[0]?.id || '',
      eventName: '',
      eventDate: '',
      eventTime: '18:00',
      location: '',
      eventType: 'Corporatif',
      services: [],
      status: 'Devis',
      amount: 0,
      deposit: 0
    });

    const handleServiceToggle = (service) => {
      const updated = formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service];
      setFormData({...formData, services: updated});
    };

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <select
          value={formData.clientId}
          onChange={(e) => setFormData({...formData, clientId: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nom de l'événement"
          value={formData.eventName}
          onChange={(e) => setFormData({...formData, eventName: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          value={formData.eventDate}
          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="time"
          value={formData.eventTime}
          onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Lieu"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <div>
          <label className="block text-sm font-semibold mb-2">Services</label>
          <div className="space-y-2">
            {['DJ', 'Animation', 'Sonorisation', 'PhotoBooth'].map(service => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>
        <input
          type="number"
          placeholder="Montant TTC"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Acompte payé"
          value={formData.deposit}
          onChange={(e) => setFormData({...formData, deposit: parseFloat(e.target.value)})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={() => onSubmit('contract', formData)}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Ajouter Contrat
        </button>
      </div>
    );
  };

  const MaterialForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'DJ',
      quantity: 1,
      status: 'Disponible',
      location: 'Entrepôt',
      costPerDay: 0
    });

    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nom du matériel"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option>DJ</option>
          <option>Sono</option>
          <option>PhotoBooth</option>
          <option>Éclairage</option>
          <option>Autre</option>
        </select>
        <input
          type="number"
          placeholder="Quantité"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Coût par jour ($)"
          value={formData.costPerDay}
          onChange={(e) => setFormData({...formData, costPerDay: parseFloat(e.target.value)})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={() => onSubmit('material', formData)}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Ajouter Matériel
        </button>
      </div>
    );
  };

  const AllocationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      contractId: contracts[0]?.id || '',
      materialId: materials[0]?.id || '',
      quantity: 1,
      startDate: '',
      endDate: '',
      status: 'Réservé'
    });

    return (
      <div className="space-y-4">
        <select
          value={formData.contractId}
          onChange={(e) => setFormData({...formData, contractId: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {contracts.map(c => (
            <option key={c.id} value={c.id}>{c.eventName}</option>
          ))}
        </select>
        <select
          value={formData.materialId}
          onChange={(e) => setFormData({...formData, materialId: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {materials.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantité"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={() => onSubmit('allocation', formData)}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Allouer Matériel
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold">🎉 Productions Eventix</h1>
        <p className="text-blue-100">Système de Gestion d'Événements</p>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Tableau de Bord', icon: null },
              { id: 'clients', label: '👥 Clients', icon: null },
              { id: 'contracts', label: '📋 Contrats', icon: null },
              { id: 'materials', label: '📦 Matériel', icon: null },
              { id: 'allocations', label: '🔗 Allocations', icon: null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'clients' && <ClientsList />}
        {activeTab === 'contracts' && <ContractsList />}
        {activeTab === 'materials' && <MaterialsList />}
        {activeTab === 'allocations' && <AllocationsList />}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'client' && '➕ Ajouter un Client'}
                {modalType === 'contract' && '➕ Ajouter un Contrat'}
                {modalType === 'material' && '➕ Ajouter du Matériel'}
                {modalType === 'allocation' && '➕ Allouer du Matériel'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            {modalType === 'client' && <ClientForm onSubmit={addItem} />}
            {modalType === 'contract' && <ContractForm onSubmit={addItem} />}
            {modalType === 'material' && <MaterialForm onSubmit={addItem} />}
            {modalType === 'allocation' && <AllocationForm onSubmit={addItem} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventixApp;
