import React, { useState } from 'react';
import { 
  Calendar, Users, FileText, Package, BarChart3, 
  ChevronDown, Plus, TrendingUp, Eye
} from 'lucide-react';

const EventixApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'clients' && <ClientsView />}
        {activeTab === 'contracts' && <ContractsView />}
        {activeTab === 'materials' && <MaterialsView />}
      </main>
    </div>
  );
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
    { id: 'pipeline', label: 'Pipeline CRM', icon: TrendingUp },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'contracts', label: 'Contrats', icon: FileText },
    { id: 'materials', label: 'Matériel', icon: Package },
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

const DashboardView = () => {
  const stats = [
    { label: 'Prospects', value: '12', change: '+3', color: 'blue' },
    { label: 'Devis En Attente', value: '5', change: '+1', color: 'amber' },
    { label: 'Contrats Signés', value: '8', change: '+2', color: 'green' },
    { label: 'Revenus Mois', value: '$18.5K', change: '+15%', color: 'emerald' },
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
            <div key={idx} className={`${colorClass} border rounded-xl p-6 backdrop-blur-sm`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}></div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Prospects Chauds 🔥</h3>
          <div className="space-y-3">
            {[
              { nom: 'TechCorp Inc.', montant: '$8500', etape: 'Devis' },
              { nom: 'Finance Global', montant: '$12000', etape: 'Contrat' },
              { nom: 'StartUp XYZ', montant: '$5500', etape: 'Prospect' },
            ].map((prospect, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div>
                  <div className="font-semibold text-slate-900">{prospect.nom}</div>
                  <div className="text-xs text-slate-500">{prospect.montant}</div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {prospect.etape}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Activités Récentes</h3>
          <div className="space-y-3">
            {[
              { action: 'Contrat signé', client: 'Acme Corp', time: '2h' },
              { action: 'Devis envoyé', client: 'Tech Solutions', time: '5h' },
              { action: 'Prospect qualifié', client: 'Finance Inc', time: '1j' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{activity.action}</div>
                  <div className="text-xs text-slate-500">{activity.client}</div>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Prochains Événements</h3>
          <div className="space-y-3">
            {[
              { nom: 'Gala Annuel', date: '22 Mai', status: 'Confirmé' },
              { nom: 'Conf. Tech', date: '28 Mai', status: 'En Attente' },
              { nom: 'Réunion Team', date: '31 Mai', status: 'Réalisé' },
            ].map((event, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900">{event.nom}</div>
                  <div className="text-xs text-slate-500">{event.date}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  event.status === 'Confirmé' ? 'bg-green-100 text-green-700' :
                  event.status === 'En Attente' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PipelineView = () => {
  const stages = [
    { id: 'prospect', title: 'Prospects', color: 'blue', count: 12 },
    { id: 'devis', title: 'Devis En Attente', color: 'amber', count: 5 },
    { id: 'contrat', title: 'Contrats Signés', color: 'green', count: 8 },
    { id: 'facture', title: 'Facturés', color: 'emerald', count: 6 },
    { id: 'realise', title: 'Réalisés', color: 'slate', count: 15 },
  ];

  const deals = {
    prospect: [
      { id: 1, nom: 'Acme Corp', montant: '$8500', contact: 'Jean Martin' },
      { id: 2, nom: 'Tech Solutions', montant: '$5200', contact: 'Marie Dupont' },
    ],
    devis: [
      { id: 3, nom: 'Finance Global', montant: '$12000', contact: 'Pierre Blanc' },
      { id: 4, nom: 'StartUp XYZ', montant: '$6500', contact: 'Sophie Leclerc' },
    ],
    contrat: [
      { id: 5, nom: 'BigCorp Inc', montant: '$15000', contact: 'Marc Rousseau' },
    ],
    facture: [
      { id: 6, nom: 'Global Enterprises', montant: '$9800', contact: 'Lisa Martin' },
    ],
    realise: [
      { id: 7, nom: 'Event Masters', montant: '$7200', contact: 'Thomas Dupuis' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Pipeline de Vente CRM</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} />
          Ajouter Prospect
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-5 gap-4" style={{ minWidth: 'min-content' }}>
          {stages.map(stage => (
            <div key={stage.id} className={`min-w-72 border rounded-xl p-4 ${
              stage.color === 'blue' ? 'border-blue-200 bg-blue-50' :
              stage.color === 'amber' ? 'border-amber-200 bg-amber-50' :
              stage.color === 'green' ? 'border-green-200 bg-green-50' :
              stage.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' :
              'border-slate-200 bg-slate-50'
            }`}>
              <div className={`${
                stage.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                stage.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                stage.color === 'green' ? 'bg-green-100 text-green-700' :
                stage.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              } rounded-lg px-3 py-2 mb-4 flex items-center justify-between`}>
                <h3 className="font-bold">{stage.title}</h3>
                <span className="text-xs font-bold">{stage.count}</span>
              </div>

              <div className="space-y-3">
                {deals[stage.id]?.map(deal => (
                  <div key={deal.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition cursor-grab">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{deal.nom}</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">{deal.montant}</span>
                      <Eye size={14} className="text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Users size={12} />
                      {deal.contact}
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-slate-400 hover:text-slate-600 transition">
                  <Plus size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const events = {
    15: [
      { type: 'prospect', title: 'Prospect: Acme Corp', time: '10:00' },
      { type: 'contract', title: 'Contrat: Finance Inc', time: '14:30' },
    ],
    22: [
      { type: 'contract', title: 'Gala Annuel - Contrat Signé', time: '09:00' },
      { type: 'event', title: 'Réalisation Événement', time: 'Journée' },
    ],
    28: [
      { type: 'prospect', title: 'Prospect: Tech Solutions', time: '11:00' },
    ],
  };

  const days = [];
  for (let i = 0; i < firstDay(currentDate); i++) days.push(null);
  for (let i = 1; i <= daysInMonth(currentDate); i++) days.push(i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Calendrier CRM</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronDown size={20} className="transform rotate-90" />
          </button>
          <span className="font-bold text-slate-900 min-w-48 text-center">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronDown size={20} className="transform -rotate-90" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="font-bold text-slate-600 text-center text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-28 border rounded-lg p-2 ${
                day === null
                  ? 'bg-slate-50 border-slate-100'
                  : 'border-slate-200 bg-white hover:bg-slate-50 transition'
              }`}
            >
              {day && (
                <>
                  <div className="font-bold text-slate-900 mb-2">{day}</div>
                  <div className="space-y-1">
                    {events[day]?.map((event, i) => (
                      <div key={i} className={`${
                        event.type === 'prospect' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'contract' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      } text-xs rounded px-2 py-1 truncate cursor-pointer`}>
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs opacity-70">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Prospect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Contrat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>Événement</span>
        </div>
      </div>
    </div>
  );
};

const ClientsView = () => {
  const [clients] = useState([
    { id: 1, nom: 'Acme Corporation', email: 'contact@acme.com', phone: '01 23 45 67 89', type: 'Prospect', value: '$8500' },
    { id: 2, nom: 'Finance Global', email: 'hello@finance.fr', phone: '01 34 56 78 90', type: 'Contrat', value: '$12000' },
    { id: 3, nom: 'Tech Solutions', email: 'info@tech.fr', phone: '02 45 67 89 01', type: 'Prospect', value: '$5200' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Clients</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} />
          Ajouter Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Nom</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Téléphone</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{client.nom}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{client.email}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{client.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      client.type === 'Prospect' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-600">{client.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ContractsView = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Gestion des Contrats</h2>
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <p className="text-slate-600">Onglet Contrats disponible prochainement</p>
    </div>
  </div>
);

const MaterialsView = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Gestion du Matériel</h2>
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <p className="text-slate-600">Onglet Matériel disponible prochainement</p>
    </div>
  </div>
);

export default EventixApp;