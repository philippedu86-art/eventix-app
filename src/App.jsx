import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, FileText, BarChart3, 
  Plus, TrendingUp, Trash2, Edit2, Download
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedClientForDocs, setSelectedClientForDocs] = useState(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Formulaire client avec tous les champs Excel
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
    montant: 0,
    stage: 'client',
    notes: ''
  });

  const [docForm, setDocForm] = useState({
    nom: '',
    type: 'offre',
    contenu: ''
  });

  // ===== INITIALISATION: Charger clients + docs depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('eventix_data');
    if (stored) {
      const data = JSON.parse(stored);
      setClients(data.clients || []);
      setDocuments(data.documents || []);
    } else {
      // Première fois: importer les 152 clients Excel
      const clientsFromExcel = [
        { nom: "4Célébrations", prenom: "", nomFamille: "", email: "info@4celebrations.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-07-16", notes: "" },
        { nom: "Acme Decors", prenom: "Jean-Michel", nomFamille: "Junior Pellemans", email: "jm@acmedecors.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-24", notes: "" },
        { nom: "Actions Interculturelles Canada", prenom: "Fadela", nomFamille: "Hamou", email: "fadela.hamou@aide.org", telephone: "819 923-4633", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-03-08", notes: "" },
        { nom: "Alexandra et Sasha", prenom: "", nomFamille: "", email: "alexe.morrison@hotmail.ca", telephone: "514-970-9074", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-12-06", notes: "" },
        { nom: "Angélique Michaud", prenom: "", nomFamille: "", email: "angelique.32m@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-08-04", notes: "" },
        { nom: "Anissa Bouffard", prenom: "", nomFamille: "", email: "Rhap-120@hotmail.com", telephone: "819-582-2653", mobile: "", adresse1: "1280 Rue Principale", adresse2: "", ville: "Marston", province: "Quebec", codePostal: "G0Y 1G0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-17", notes: "" },
        { nom: "Annie-Joële et Jean-Michaël", prenom: "Annie-Joële", nomFamille: "Boulanger", email: "annie_jo13@hotmail.com", telephone: "819 679-9090", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-10-09", notes: "" },
        { nom: "Arianne et Korina", prenom: "Ari", nomFamille: "Charette", email: "arianne12@live.ca", telephone: "514-953-0813", mobile: "", adresse1: "1388 Rue Mansourati", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1L 2K7", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2023-03-17", notes: "" },
        { nom: "Arjo Magog", prenom: "Mélanie", nomFamille: "Cleroux", email: "melanie.cleroux@arjo.com", telephone: "", mobile: "", adresse1: "2001 Rue Tanguay", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-04-19", notes: "" },
        { nom: "Association du personnel administratif et professionnel de l'UdeS (apapus)", prenom: "Chantale", nomFamille: "Tremblay", email: "apapus@usherbrooke.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2025-10-10", notes: "" },
        { nom: "Ateliers BG", prenom: "Andreanne", nomFamille: "Arbour", email: "andreannearbour@ateliersbg.com", telephone: "", mobile: "", adresse1: "2980 rue King Est", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-09-12", notes: "" },
        { nom: "Atelier Sima", prenom: "Mélanie", nomFamille: "Brouillard", email: "melanie@ateliersima.ca", telephone: "(819) 878-3987", mobile: "", adresse1: "158 5e Rang O", adresse2: "", ville: "Stoke", province: "Quebec", codePostal: "J0B 3G0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-01-16", notes: "" },
        { nom: "Atelier Versatyl", prenom: "Oriane", nomFamille: "Concina-Giammertini", email: "admin@versatylatelier.com", telephone: "819 574-7557", mobile: "", adresse1: "3005 Chemin Milletta", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 0R4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-05-27", notes: "" },
        { nom: "Aurélie et Marc-André", prenom: "Aurélie", nomFamille: "Guénette", email: "aurelie.guenette13@hotmail.com", telephone: "450-521-7744", mobile: "", adresse1: "1097 Rue de la Roche", adresse2: "", ville: "Granby", province: "Quebec", codePostal: "J2J 3A1", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-09-26", notes: "" },
        { nom: "Bianca Boivin", prenom: "", nomFamille: "", email: "bianca.boivin@hotmail.com", telephone: "819-239-6139", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-04-16", notes: "" },
        { nom: "Brasserie la Seigneurie", prenom: "David", nomFamille: "Fontaine", email: "dave_font@hotmail.com", telephone: "819 993-5833", mobile: "", adresse1: "14 Rue Léger", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1L 1W1", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-11-04", notes: "" },
        { nom: "Caisse Desjardins Haut St-Françcois", prenom: "Jonathan", nomFamille: "Proulx-Salvas", email: "jonathan.s.proulx-salvas@desjardins.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-06-03", notes: "" },
        { nom: "Caisse Populaire Memphrémagog", prenom: "Pascale", nomFamille: "Forand", email: "pascale.forand@desjardins.com", telephone: "(819) 843-3328", mobile: "", adresse1: "230 Rue Principale Ouest", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 2A5", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-06-16", notes: "" },
        { nom: "Camille Chagot", prenom: "Camille", nomFamille: "Chagot", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-02-24", notes: "" },
        { nom: "Caroline Charest et J-P Bélanger", prenom: "Caroline", nomFamille: "Charest", email: "charest.caroline@outlook.com", telephone: "(514)880-0986", mobile: "", adresse1: "1998 Rue Honoré-Mercier", adresse2: "", ville: "Sainte-Julie", province: "Quebec", codePostal: "J3E 2K1", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2023-03-27", notes: "" },
        { nom: "Caroline et Mathieu", prenom: "Caroline", nomFamille: "Tremblay", email: "us4ever_05@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-10", notes: "" },
        { nom: "Caroline Savoie", prenom: "", nomFamille: "", email: "Caro.savoie@hotmail.com", telephone: "819-678-5802", mobile: "", adresse1: "48 Rue De La Héronnière", adresse2: "", ville: "Memphrémagog", province: "Quebec", codePostal: "J0B 1W0", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2022-11-01", notes: "" },
        { nom: "Carolyne Hétu", prenom: "", nomFamille: "", email: "Carolyne.hetu@live.ca", telephone: "819 919-5308", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-02-02", notes: "" },
        { nom: "Catherine Beauregard", prenom: "Catherine", nomFamille: "Beauregard", email: "cath_lover@hotmail.com", telephone: "", mobile: "", adresse1: "3395 Rue College", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1M 2J8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-10-10", notes: "" },
        { nom: "Catherine et Olivier", prenom: "Catherine", nomFamille: "Gardner-Fortier", email: "c.gardnerfortier@gmail.com", telephone: "819 943-3246", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-01-05", notes: "" },
        { nom: "Catherine Gélinas", prenom: "", nomFamille: "", email: "catherine.gelinas@hec.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-01-05", notes: "" },
        { nom: "Cegep de Drummondville", prenom: "Julien", nomFamille: "Masson-Lefebvre", email: "julien.massonlefebvre@cegepdrummond.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-05-22", notes: "" },
        { nom: "Centre de recherche interuniversitaire en didactique", prenom: "Patricia", nomFamille: "Dionne", email: "patricia.dionne@usherbrooke.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-01-31", notes: "" },
        { nom: "Centre de santé du sommet", prenom: "Chantal", nomFamille: "Goyette", email: "cgoyette.dusommet@gmail.com", telephone: "819 943-9730", mobile: "", adresse1: "1280 rue King Est", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-25", notes: "" },
        { nom: "Centre d'intégration au marché de l'emploi", prenom: "Krystina", nomFamille: "Branders", email: "krystinab@cime-emploi.com", telephone: "819 564-0202", mobile: "", adresse1: "309 Rue Marquette", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1H 1M2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-10-31", notes: "" },
        { nom: "Chez Praxède", prenom: "Simon", nomFamille: "Gauthier-Brulotte", email: "chezpraxede2023@gmail.com", telephone: "", mobile: "", adresse1: "35 Rue du Curé-LaRocque", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1C 0T2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-02-12", notes: "" },
        { nom: "Chico Bois des Filions", prenom: "Vivian", nomFamille: "Fugere", email: "Vivian.fugere@lapattechampetre.ca", telephone: "", mobile: "514-945-6802", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2021-12-05", notes: "" },
        { nom: "Cindy Gagné", prenom: "Cindy", nomFamille: "Gagné", email: "wyzzy_7@hotmail.com", telephone: "819 434-1128", mobile: "", adresse1: "51 Rue du Docteur-Allard", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1C 0S4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-02-11", notes: "" },
        { nom: "Club Holstein des Bois Francs", prenom: "Marianne", nomFamille: "Desrochers", email: "marianne-desrochers@hotmail.com", telephone: "819-350-1666", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-12-23", notes: "" },
        { nom: "Club Holstein de Sherbrooke", prenom: "Bianka", nomFamille: "Labrecque", email: "Bianka.labrecque@outlook.com", telephone: "819-679-3995", mobile: "", adresse1: "180 Rue du Hameau", adresse2: "", ville: "Compton", province: "Quebec", codePostal: "J0B 1L0", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2022-11-01", notes: "" },
        { nom: "Collège du Mont St-Anne", prenom: "Karel", nomFamille: "St-Laurent", email: "red@collegemsa.net", telephone: "819 823-3003", mobile: "", adresse1: "2100 Chemin de Sainte-Catherine", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1N 3V5", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-04-19", notes: "" },
        { nom: "Comité de loisirs de St-Denis de Brompton", prenom: "", nomFamille: "", email: "loisirssddb@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-22", notes: "" },
        { nom: "Comité des loisirs des employés de Hershey Granby", prenom: "Jade", nomFamille: "Denis", email: "jade_denis@outlook.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-04-10", notes: "" },
        { nom: "Comme chez Soi", prenom: "Marilyne", nomFamille: "Beauchemin", email: "info@commechezsoi.ca", telephone: "", mobile: "", adresse1: "871 Rue Shefford", adresse2: "", ville: "Bromont", province: "Quebec", codePostal: "J2L 1C4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-04-27", notes: "" },
        { nom: "Conceptions Desrosiers", prenom: "Charline", nomFamille: "Durand", email: "Charline.durand@conceptionsdesrosiers.com", telephone: "", mobile: "", adresse1: "4208 Rue Sherbrooke", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 5R2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-11-04", notes: "" },
        { nom: "Conteneurs Experts", prenom: "Karine", nomFamille: "Fournelle", email: "karine@conteneursexperts.com", telephone: "450-455-7288", mobile: "", adresse1: "1201 Montée Labossière", adresse2: "", ville: "Vaudreuil-Dorion", province: "Quebec", codePostal: "J7V 4J8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-03-10", notes: "" },
        { nom: "Cuisines Beauregard", prenom: "Jocelyne", nomFamille: "Giguère", email: "gouletp@commgo.com", telephone: "", mobile: "", adresse1: "655 Rue Simonds Sud", adresse2: "", ville: "Granby", province: "Quebec", codePostal: "J2J 1C2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-04", notes: "" },
        { nom: "Danielle et Philippe", prenom: "Danielle", nomFamille: "Loranger", email: "danielle_loranger@hotmail.com", telephone: "819-820-6289", mobile: "", adresse1: "1566 Rue Major", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1N 1P8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-04-04", notes: "" },
        { nom: "Dena M. Broussard", prenom: "", nomFamille: "", email: "denab@videotron.ca", telephone: "819 346-2466", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-08-05", notes: "" },
        { nom: "DG Photobooths", prenom: "Daniel", nomFamille: "Gaudette", email: "info@dgphotobooths.com", telephone: "450 359-9795", mobile: "", adresse1: "950 Boulevard du Séminaire Nord", adresse2: "Local A-7", ville: "Saint-Jean-sur-Richelieu", province: "Quebec", codePostal: "J3A 1L2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-10-01", notes: "" },
        { nom: "Domaine Ruisseau Chateau", prenom: "Céline", nomFamille: "Létourneau", email: "celineletourneau@b2b2c.ca", telephone: "450-531-7293", mobile: "", adresse1: "40 Chemin du Château-Landing", adresse2: "", ville: "Potton", province: "Quebec", codePostal: "J0E 1X0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2021-07-03", notes: "" },
        { nom: "Dual ADE", prenom: "Daniel", nomFamille: "Larocque", email: "daniellarocquevente@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-14", notes: "" },
        { nom: "École secondaire de la montée", prenom: "Nicolas", nomFamille: "Tremblay", email: "tremblayn@csrs.qc.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-06-04", notes: "" },
        { nom: "Entreprendre Sherbrooke", prenom: "Éric", nomFamille: "Gauthier", email: "egauthier@entreprendresherbrooke.com", telephone: "(819) 563-1144", mobile: "", adresse1: "80 Rue Wellington Sud", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1H 5Y8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-01-14", notes: "" },
        { nom: "Etienne Tardif-Lievens", prenom: "", nomFamille: "", email: "thefunkt@outlook.fr", telephone: "819-432-0593", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-10-26", notes: "" },
        { nom: "Excavation GG Laroche", prenom: "Karine", nomFamille: "Audet", email: "fournisseurs@gglaroche.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-14", notes: "" },
        { nom: "Fabrique Saint-Alphonse de Stornoway", prenom: "", nomFamille: "", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-08-26", notes: "" },
        { nom: "Factulté éducation", prenom: "Caroline", nomFamille: "Duchesne", email: "caroline.duchesne@usherbrooke.ca", telephone: "", mobile: "", adresse1: "Université de Sherbrooke", adresse2: "Local : A2-1008", ville: "Sherbrooke", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-09-13", notes: "" },
        { nom: "Fédération des Communautés Culturelles de l'Estrie", prenom: "", nomFamille: "", email: "projets.fccestrie@gmail.com", telephone: "819 823-0841", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-04-08", notes: "" },
        { nom: "Fédération des pourvoiries du Québec", prenom: "Chantal", nomFamille: "Beauchesne", email: "cbeauchesne@pourvoiries.com", telephone: "418 877-5191", mobile: "", adresse1: "3137 Rue Laberge", adresse2: "", ville: "Québec", province: "Quebec", codePostal: "G1X 4B5", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-07-04", notes: "" },
        { nom: "Ferme Lussier Belgians", prenom: "Jenny", nomFamille: "Henchoz", email: "fermelussierbelgians@hotmail.com", telephone: "819 993-0630", mobile: "", adresse1: "442 Québec 243", adresse2: "", ville: "Richmond", province: "Quebec", codePostal: "J0B 2B0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-03-10", notes: "" },
        { nom: "Fondation de l'Université de Sherbrooke", prenom: "Charline", nomFamille: "Durand-Lafrance", email: "Charline.durand@usherbrooke.ca", telephone: "", mobile: "", adresse1: "1950 Rue Galt Ouest", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1K 1H8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-02-28", notes: "" },
        { nom: "Fondation des Amis de l'école Notre-Dame-des-Champs", prenom: "Caroline", nomFamille: "Rivest", email: "fondationndcstoke@gmail.com", telephone: "819-993-4090", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-04-14", notes: "" },
        { nom: "Fondation du CHUS - Val St-François", prenom: "Véronique", nomFamille: "Morissette", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-07-03", notes: "" },
        { nom: "Fontaine Lumber", prenom: "Sara", nomFamille: "Laflamme", email: "slaflamme@fontainelumber.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-09-28", notes: "" },
        { nom: "Francis et Maude", prenom: "", nomFamille: "", email: "frank_houde06@hotmail.com", telephone: "819 269-2670", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-11-16", notes: "" },
        { nom: "Françis et Patricia", prenom: "Françis", nomFamille: "Desautels", email: "Smalltown7378@gmail.com", telephone: "514-266-0614", mobile: "", adresse1: "75 Rue des Pruches", adresse2: "", ville: "Austin", province: "Quebec", codePostal: "J0B 1B0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-01-09", notes: "" },
        { nom: "Francis et Sabrina", prenom: "", nomFamille: "", email: "va2hon@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-12-01", notes: "" },
        { nom: "Garlock", prenom: "Jacques", nomFamille: "Grégoire", email: "jacques.gregoire@garlock.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-09-21", notes: "" },
        { nom: "Groupe DeVimy inc", prenom: "Dominic", nomFamille: "Lapointe", email: "dlapointe@groupedevimy.com", telephone: "819 564-8893", mobile: "", adresse1: "3425 Rue King Ouest", adresse2: "Suite 240", ville: "Sherbrooke", province: "Quebec", codePostal: "J1L 1P8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-03-30", notes: "" },
        { nom: "Groupe Lapalme", prenom: "Oriane", nomFamille: "Concina", email: "oriane.concina@groupelapalme.com", telephone: "819.843.2367", mobile: "", adresse1: "2972 Chemin Milletta", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 0W6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-11-07", notes: "" },
        { nom: "Guylaine et Jean", prenom: "", nomFamille: "", email: "guylainebaulne@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-11-30", notes: "" },
        { nom: "Happening", prenom: "Emilie", nomFamille: "Pellier", email: "emilie.pellier@happening.ca", telephone: "514-884-9714", mobile: "", adresse1: "3760 Boulevard Crémazie Est", adresse2: "", ville: "Montréal", province: "Quebec", codePostal: "H2A 1B7", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-08-30", notes: "" },
        { nom: "Hélène Tremblay", prenom: "Hélène", nomFamille: "Tremblay", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-18", notes: "" },
        { nom: "Holstein Québec", prenom: "Jenny", nomFamille: "Henchoz", email: "henchoz@holsteinquebec.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-14", notes: "" },
        { nom: "Hopital Vétérinaire de l'Estrie", prenom: "Lola", nomFamille: "Darrien", email: "lola.darrien@hvestrie.com", telephone: "819 678-8941", mobile: "", adresse1: "2736 Rue Galt Ouest", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1K 2V8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-11-05", notes: "" },
        { nom: "InterFonction Ltée", prenom: "Ian", nomFamille: "Tardif", email: "comptabilite@interfonction.com", telephone: "819 821-3888", mobile: "", adresse1: "175 Rue Oleg-Stanek", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1L 2V4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-12-19", notes: "" },
        { nom: "Jean-Christophe Gaulin et Roxanne Thibodeau", prenom: "Jean-Christophe", nomFamille: "Gaulin", email: "jc.gaulin1@gmail.com", telephone: "819-349-4139", mobile: "", adresse1: "176 Rue Dufresne", adresse2: "", ville: "East Angus", province: "Quebec", codePostal: "J0B 1R0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-02-06", notes: "" },
        { nom: "Jean-François Boutin", prenom: "Jean-François", nomFamille: "Boutin", email: "jean-francois.boutin@sherbrooke.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-01-29", notes: "" },
        { nom: "Jennifer et Marc", prenom: "Jennifer", nomFamille: "Craig", email: "youhou2000@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-09-28", notes: "" },
        { nom: "Jenny Fortier", prenom: "", nomFamille: "", email: "fortier.jenny@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-07-25", notes: "" },
        { nom: "Joanie Roy", prenom: "Joanie", nomFamille: "Roy", email: "joanie.roy26@gmail.com", telephone: "438-884-7306", mobile: "", adresse1: "1535 rue principale", adresse2: "", ville: "St-Julie", province: "Quebec", codePostal: "J3E 2P8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-06-07", notes: "" },
        { nom: "Josiane Prince et Vincent Blondin", prenom: "", nomFamille: "", email: "josiane.prince@outlook.com", telephone: "514 710-9238", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-11-09", notes: "" },
        { nom: "Journal Communautaire Ici Brompton", prenom: "Anne-Marie", nomFamille: "Auclair", email: "ibinfographie@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-03-11", notes: "" },
        { nom: "JP Cadrin", prenom: "Marcel", nomFamille: "Fontaine", email: "mfontaine@jpcadrin.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-08-24", notes: "" },
        { nom: "Julie et Nicolas", prenom: "Julie", nomFamille: "Sauvageau", email: "julie_sauvageau374@hotmail.com", telephone: "", mobile: "", adresse1: "532, rue de périgueux #3, Laval, QC", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-02-04", notes: "" },
        { nom: "Julie Lafontaine", prenom: "", nomFamille: "", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-21", notes: "" },
        { nom: "Kaleido", prenom: "Julie", nomFamille: "St-Cyr", email: "julie.st-cyr@kaleido.ca", telephone: "418-651-8977", mobile: "", adresse1: "1035 Avenue Wilfrid-Pelletier", adresse2: "bureau 500", ville: "Québec", province: "Quebec", codePostal: "G1W0C5", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-04-02", notes: "" },
        { nom: "Karine Boyer", prenom: "", nomFamille: "", email: "kasylaro2014@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2022-11-01", notes: "" },
        { nom: "Karine Ross", prenom: "", nomFamille: "", email: "karineross74@outlook.com", telephone: "514-713-6160", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-04-06", notes: "" },
        { nom: "Kloe Therrien et Yohan Dumoulin", prenom: "Kloé", nomFamille: "Therrien", email: "kloetherrien@hotmail.com", telephone: "514-716-6094", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-03-01", notes: "" },
        { nom: "Lacroix Sport Nautique", prenom: "Isabelle", nomFamille: "Morin", email: "comptabilite@lsnautique.com", telephone: "418-486-2466", mobile: "", adresse1: "324 Rue Principale", adresse2: "", ville: "Lambton", province: "Quebec", codePostal: "G0M 1H0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-02-22", notes: "" },
        { nom: "La Grande Coulée", prenom: "Pascale", nomFamille: "Forand", email: "info@grandecoulee.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2022-08-02", notes: "" },
        { nom: "Le blé d'or - Cuisine Collective", prenom: "Isabelle", nomFamille: "Prud'homme", email: "direction@lebledor.org", telephone: "(514) 980-0290", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-10-17", notes: "" },
        { nom: "Lefko", prenom: "Ginette", nomFamille: "Laflamme", email: "ginette.laflamme@lefko.ca", telephone: "819 843-9237", mobile: "", adresse1: "1700 Boulevard Industriel", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 4V9", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-10-16", notes: "" },
        { nom: "Lemay Choinière Consultants", prenom: "Nathalie Filion", nomFamille: "", email: "nfilion@lemaychoiniere.com", telephone: "450 293-8960", mobile: "", adresse1: "95a Québec 235", adresse2: "", ville: "Ange-Gardien", province: "Quebec", codePostal: "J0E 1E0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-09-26", notes: "" },
        { nom: "Les Entreprises Denis Robert Inc", prenom: "Pascal", nomFamille: "Robert", email: "pascal3robert@gmail.com", telephone: "819-572-9874", mobile: "", adresse1: "140 Rue Brassard", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 1P9", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-10-10", notes: "" },
        { nom: "LP Royer", prenom: "Jocelyne", nomFamille: "Poulin", email: "jpoulin@royer.com", telephone: "819-549-2100", mobile: "", adresse1: "712 Rue Principale", adresse2: "", ville: "Lac-Drolet", province: "Quebec", codePostal: "G0Y 1C0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-10-23", notes: "" },
        { nom: "Lussier Evenementielle", prenom: "Jenny", nomFamille: "Henchoz", email: "jenhenchoz@hotmail.com", telephone: "819-993-0630", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2022-08-18", notes: "" },
        { nom: "Lyssa et Serge", prenom: "Lyssa", nomFamille: "Lajoie", email: "lyssa1968@icloud.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-24", notes: "" },
        { nom: "Marie-Claude Pagé", prenom: "Marie-Claude", nomFamille: "Pagé", email: "mcpage560@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-08-16", notes: "" },
        { nom: "Marie et Francis", prenom: "", nomFamille: "", email: "mariericher11@gmail.com", telephone: "514-775-6382", mobile: "", adresse1: "150 rue Coulonge", adresse2: "App #7", ville: "Longueuil", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-02-18", notes: "" },
        { nom: "Marie-Ève Charest Belisle", prenom: "Marie-Ève", nomFamille: "Charest Belisle", email: "sowhat_99@hotmail.com", telephone: "613 295-0138", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-09-21", notes: "" },
        { nom: "Megane Bedard-paradis", prenom: "", nomFamille: "", email: "Meganebedardparadis@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-04-30", notes: "" },
        { nom: "Mégane Prince", prenom: "Mégane", nomFamille: "Prince", email: "megane_prince@hotmail.com", telephone: "819-592-7791", mobile: "", adresse1: "5 Rue Warren", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1M 2C1", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-12-12", notes: "" },
        { nom: "Mélanie Drouin", prenom: "Mélanie", nomFamille: "Drouin", email: "melanie_jean-rene@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-09-07", notes: "" },
        { nom: "Melissa Meunier", prenom: "Mélissa", nomFamille: "Meunier", email: "", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2025-10-09", notes: "" },
        { nom: "Mélodie et Victor", prenom: "Mélodie", nomFamille: "Durand", email: "melodiedurand95@outlook.com", telephone: "819 352-8054", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-06-12", notes: "" },
        { nom: "Mexi & Co", prenom: "Yannick", nomFamille: "Pellerin", email: "ypellerin5@gmail.com", telephone: "819 861-2061", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-12-12", notes: "" },
        { nom: "Ministère du Transport - St-Jérôme", prenom: "Marie-France", nomFamille: "Roy-Panneton", email: "marie-france.roy-panneton@transports.gouv.qc.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-09-07", notes: "" },
        { nom: "Mont Orford", prenom: "Noah", nomFamille: "Hogg", email: "nhogg@orford.com", telephone: "", mobile: "", adresse1: "4380 Chemin du Parc", adresse2: "", ville: "Orford", province: "Quebec", codePostal: "J1X 0J6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-01-08", notes: "" },
        { nom: "MPAV", prenom: "Alain", nomFamille: "Préfontaine", email: "aprefontaine@mpav.ca", telephone: "819-565-0375", mobile: "", adresse1: "2938 Rue des Onyx", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1G 4K7", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-11-25", notes: "" },
        { nom: "Municipalité de St-Denis de Brompton", prenom: "Martine", nomFamille: "Deschêsnes", email: "mdeschenes@sddb.ca", telephone: "819-846-2744", mobile: "", adresse1: "1485 Québec 222", adresse2: "", ville: "Saint-Denis-de-Brompton", province: "Quebec", codePostal: "J0B 2P0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-09-15", notes: "" },
        { nom: "Municipalité de Stornoway", prenom: "", nomFamille: "", email: "administration@munstornoway.qc.ca", telephone: "(819) 652-2800", mobile: "", adresse1: "507 Québec 108", adresse2: "", ville: "Stornoway", province: "Quebec", codePostal: "G0Y 1N0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-09-27", notes: "" },
        { nom: "Municipalité du canton de Orford", prenom: "Catherine", nomFamille: "Roy", email: "adj.executive@canton.orford.qc.ca", telephone: "819-437-1710", mobile: "", adresse1: "2530 Chemin du Parc", adresse2: "", ville: "Orford", province: "Quebec", codePostal: "J1X 8R8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2022-09-27", notes: "" },
        { nom: "Myriam Poliquin", prenom: "", nomFamille: "", email: "Myriampo@hotmail.com", telephone: "819-979-0450", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-04-30", notes: "" },
        { nom: "Nathalie Robidas", prenom: "", nomFamille: "", email: "nathalierobidas@hotmail.com", telephone: "819-679-6904", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-22", notes: "" },
        { nom: "Noémie et Shayne", prenom: "Noémie", nomFamille: "Guilbault", email: "noemie94@msn.com", telephone: "514 882-5965", mobile: "", adresse1: "1531 rue Pollender", adresse2: "", ville: "Farnham", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-07-21", notes: "" },
        { nom: "Orientation Travail", prenom: "Caroline", nomFamille: "Cournoyer", email: "ccournoyer@orientationtravail.org", telephone: "819 239-1008", mobile: "", adresse1: "124 Rue Wellington Nord", adresse2: "bureau 50", ville: "Sherbrooke", province: "Quebec", codePostal: "J1H 5C5", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2023-10-19", notes: "" },
        { nom: "Pharmacie Marie-Noel Dupont", prenom: "", nomFamille: "", email: "gestionproxim3655@gmail.com", telephone: "819 846-2713", mobile: "", adresse1: "103 Rue Saint-Lambert", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1C 0N8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-11-13", notes: "" },
        { nom: "Polyvalente la Frontalière", prenom: "David", nomFamille: "Fournier", email: "david.fournier@csshc.gouv.qc.ca", telephone: "", mobile: "", adresse1: "311 Rue Saint-Paul Est", adresse2: "", ville: "Coaticook", province: "Quebec", codePostal: "J1A 1G1", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-10-01", notes: "" },
        { nom: "Production Imagine", prenom: "Michel", nomFamille: "", email: "info@productionimagine.com", telephone: "450 775-0124", mobile: "", adresse1: "1031 Rue Miguel", adresse2: "", ville: "Granby", province: "Quebec", codePostal: "J2J 0L8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-11-05", notes: "" },
        { nom: "Rachida Ferradji", prenom: "Rachida", nomFamille: "Ferradji", email: "rachidaferradji@hotmail.com", telephone: "514-347-7429", mobile: "", adresse1: "260 rue Jubinville", adresse2: "", ville: "Laval", province: "Quebec", codePostal: "H7G 3E2", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-06-26", notes: "" },
        { nom: "RCGT Administration", prenom: "Laurianne", nomFamille: "Roudeau", email: "roudeau.laurianne@rcgt.com", telephone: "514 878-2692", mobile: "", adresse1: "600 Rue De la Gauchetière Ouest", adresse2: "Bureau 2000", ville: "Montréal", province: "Quebec", codePostal: "H3B 4L8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-05-06", notes: "" },
        { nom: "Rebecca Dupuis", prenom: "Rebecca", nomFamille: "Dupuis", email: "sweetbec1@hotmail.com", telephone: "819-347-8178", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-22", notes: "" },
        { nom: "René St-Pierre", prenom: "Noémie", nomFamille: "Ducharme", email: "nducharme@renestpierre.ca", telephone: "", mobile: "", adresse1: "800 Rue de l'Ardoise", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1C 0J6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-06-03", notes: "" },
        { nom: "Saint-Augustin-de-Desmaures", prenom: "Sarah", nomFamille: "Vachon-Bellavance", email: "sarah.vachon-bellavance@vsad.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2020-07-28", notes: "" },
        { nom: "Service des sports, de la culture et de la vie communautaire", prenom: "Yan", nomFamille: "Fortier", email: "Yan.Fortier@sherbrooke.ca", telephone: "819 823-8000", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-05-02", notes: "" },
        { nom: "Services financiers Consilium", prenom: "MARIANE", nomFamille: "GARCIA", email: "mgarcia@groupeconsilium.ca", telephone: "438-476-9968", mobile: "", adresse1: "261 Rue Saint-Jacques", adresse2: "suite 100", ville: "Montréal", province: "Quebec", codePostal: "H2Y 1M6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2026-02-04", notes: "" },
        { nom: "SIGNÉ AR", prenom: "Marjorie", nomFamille: "Audet Turmel", email: "maudet@signe-ar.com", telephone: "1 (418) 389-4553", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-04-21", notes: "" },
        { nom: "Sindy Hamel", prenom: "", nomFamille: "", email: "Denisgelinas@outlook.com", telephone: "819-552-9013", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-21", notes: "" },
        { nom: "Société canadienne de la sclérose en plaques - Région de Québec", prenom: "Jérémi", nomFamille: "Harvey", email: "jeremi.harvey@scleroseenplaques.ca", telephone: "418-529-9742", mobile: "", adresse1: "245 rue Soumande", adresse2: "bureau 202", ville: "Quebec", province: "Quebec", codePostal: "G1M 3H6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-01-25", notes: "" },
        { nom: "Société Québécoise de Néphrologie", prenom: "Joanie", nomFamille: "Deschênes", email: "equipe@sindytremblay.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-01-25", notes: "" },
        { nom: "Soucy Techno", prenom: "Jenny", nomFamille: "Fortier", email: "jenny.fortier@soucy-group.com", telephone: "(819) 864-4284", mobile: "", adresse1: "2550 Chemin Saint-Roch Sud", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1N 2S8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2025-10-08", notes: "" },
        { nom: "Stanstead College", prenom: "Magalie", nomFamille: "Gagnon", email: "mgagnon@stansteadcollege.com", telephone: "819 876-7891", mobile: "", adresse1: "", adresse2: "450, rue Dufferin", ville: "Stanstead", province: "Quebec", codePostal: "J0B 3E0", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-01-29", notes: "" },
        { nom: "Stéphane Perreault", prenom: "", nomFamille: "", email: "Stephaneperreault@outlook.com", telephone: "819-566-5589", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-21", notes: "" },
        { nom: "Stéphanie et Sylvain", prenom: "Stéphanie", nomFamille: "Major", email: "stephanie.major74@gmail.com", telephone: "819-588-8107", mobile: "", adresse1: "185 rue lasalle", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X1L4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-17", notes: "" },
        { nom: "Stéphanie Lachance Trudeau", prenom: "Stéphanie", nomFamille: "Lachance Trudeau", email: "kelly_angel_love_7@hotmail.com", telephone: "514-566-9148", mobile: "", adresse1: "169 Chemin Pelletier Sud", adresse2: "", ville: "Saint-Armand", province: "Quebec", codePostal: "J0J 1T0", pays: "Canada", website: "", devise: "", stage: "client", dateCreation: "2022-10-24", notes: "" },
        { nom: "Steve Desindes", prenom: "", nomFamille: "", email: "steve_desindes@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2024-02-06", notes: "" },
        { nom: "Suzanne Bernier et Denis Bélisle", prenom: "", nomFamille: "", email: "suzannebernier153@videotron.ca", telephone: "819-570-7081", mobile: "", adresse1: "153 rue Viger", adresse2: "", ville: "Stoke", province: "Quebec", codePostal: "", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-03-06", notes: "" },
        { nom: "Syndicat des employées et employés de soutien de l'Université de Sherbrooke", prenom: "Melisa", nomFamille: "Medina", email: "activites.sociales.seesus@USherbrooke.ca", telephone: "819 821-8000, poste 67646", mobile: "", adresse1: "2500 Boulevard de l'Université", adresse2: "Pavillon John-S.-Bourque, local 2042", ville: "Sherbrooke", province: "Quebec", codePostal: "J1K 0A5", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-01-16", notes: "" },
        { nom: "Syndicat des fonctionnaires municipaux et professionnels de la Ville de Sherbrooke", prenom: "Valérie", nomFamille: "Desmarais", email: "valerie.desmarais@sherbrooke.ca", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-01-31", notes: "" },
        { nom: "The Photo Bus Booth", prenom: "Mitch", nomFamille: "Brown", email: "thephotobusbooth@gmail.com", telephone: "416-720-3270", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2024-09-30", notes: "" },
        { nom: "Thermo2000", prenom: "Marie-Claude", nomFamille: "Rivard", email: "mcrivard_design@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-08-30", notes: "" },
        { nom: "Tim Horton Estrie", prenom: "Stéfanie", nomFamille: "Plante", email: "stefanie.plante@outlook.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-11-15", notes: "" },
        { nom: "Tournoi hockey Desjardins 2025", prenom: "Jonathan", nomFamille: "Proulx-Salvas", email: "jonathan.s.proulx-salvas@desjardins.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-02-05", notes: "" },
        { nom: "Toyota Magog", prenom: "", nomFamille: "", email: "jpgaudreau@toyotamagog.com", telephone: "819 345-5421", mobile: "", adresse1: "2500 Rue Sherbrooke", adresse2: "", ville: "Magog", province: "Quebec", codePostal: "J1X 4E8", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-11-07", notes: "" },
        { nom: "TPMJF", prenom: "Bianca", nomFamille: "Turcotte", email: "B.turcotte06@hotmail.com", telephone: "", mobile: "", adresse1: "2959 Boulevard de l'Université", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1K 2X6", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2023-11-07", notes: "" },
        { nom: "Université de Sherbrooke | Réseau québécois de recherche sur la douleur", prenom: "Pr Louis", nomFamille: "Gendron", email: "DRF-CAP@usherbrooke.ca", telephone: "(819) 821-8000 #73456", mobile: "", adresse1: "3001 12e Avenue Nord", adresse2: "", ville: "Sherbrooke", province: "Quebec", codePostal: "J1H 5N4", pays: "Canada", website: "", devise: "CAD", stage: "client", dateCreation: "2024-01-16", notes: "" },
        { nom: "UPA de Coaticook", prenom: "Katia", nomFamille: "Gagné", email: "Katiagagned@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-01-16", notes: "" },
        { nom: "Valérie Godard", prenom: "", nomFamille: "", email: "valego_23@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2023-12-01", notes: "" },
        { nom: "ValEstrie Ford - Chantal", prenom: "Chantal", nomFamille: "Cloutier", email: "chantal.cloutier@valestrie.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-03", notes: "" },
        { nom: "Véronique Lafond", prenom: "Véronique", nomFamille: "Lafond", email: "veroniquelafond98@gmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-07-28", notes: "" },
        { nom: "Vicky et Jean-Philippe", prenom: "Vicky", nomFamille: "Chabot", email: "vickychabot@hotmail.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2023-07-19", notes: "" },
        { nom: "Virginia et Carl", prenom: "", nomFamille: "", email: "Vaillaca@gmail.com", telephone: "819-640-4443", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2026-03-21", notes: "" },
        { nom: "Volkswagen de l'Estrie", prenom: "Maggie", nomFamille: "Boislard", email: "mboislard@vwestrie.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "CAD", stage: "client", dateCreation: "2022-10-03", notes: "" },
        { nom: "W8banaki", prenom: "Nikita", nomFamille: "Zewski", email: "nzewski@gcnwa.com", telephone: "", mobile: "", adresse1: "", adresse2: "", ville: "", province: "", codePostal: "", pays: "", website: "", devise: "", stage: "client", dateCreation: "2025-07-21", notes: "" }
      ];

      // Ajouter les IDs et détecter le type
      const clientsWithIds = clientsFromExcel.map((c, idx) => ({
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

  // ===== RESET FORM
  const resetFormData = () => {
    setFormData({
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
      montant: 0,
      stage: 'client',
      notes: ''
    });
  };

  // ===== CLIENT CRUD
  const handleAddClient = () => {
    if (!formData.nom.trim()) {
      alert('Entrez au moins le nom du client');
      return;
    }

    const newClient = {
      id: Date.now().toString(),
      ...formData,
      type: formData.prenom || formData.nomFamille ? 'Particulier' : 'Entreprise',
      dateCreation: new Date().toISOString().split('T')[0]
    };

    setClients([...clients, newClient]);
    resetFormData();
    setShowClientForm(false);
  };

  const handleEditClient = () => {
    setClients(clients.map(c => c.id === editingClient.id ? { ...editingClient, ...formData } : c));
    resetFormData();
    setEditingClient(null);
    setShowClientForm(false);
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

  // ===== DOCUMENT CRUD
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

  // ===== RENDER SECTIONS
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
        onClick={() => { resetFormData(); setEditingClient(null); setShowClientForm(!showClientForm); }}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        <Plus className="w-5 h-5" /> Ajouter Client
      </button>

      {showClientForm && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingClient ? 'Modifier Client' : 'Nouveau Client'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Nom de famille" value={formData.nomFamille} onChange={(e) => setFormData({...formData, nomFamille: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="tel" placeholder="Téléphone" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="tel" placeholder="Mobile" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Adresse 1" value={formData.adresse1} onChange={(e) => setFormData({...formData, adresse1: e.target.value})} className="px-3 py-2 border rounded md:col-span-2" />
            <input type="text" placeholder="Adresse 2" value={formData.adresse2} onChange={(e) => setFormData({...formData, adresse2: e.target.value})} className="px-3 py-2 border rounded md:col-span-2" />
            <input type="text" placeholder="Ville" value={formData.ville} onChange={(e) => setFormData({...formData, ville: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Province" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Code Postal" value={formData.codePostal} onChange={(e) => setFormData({...formData, codePostal: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Pays" value={formData.pays} onChange={(e) => setFormData({...formData, pays: e.target.value})} className="px-3 py-2 border rounded" />
            <input type="url" placeholder="Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="px-3 py-2 border rounded" />
            <select value={formData.devise} onChange={(e) => setFormData({...formData, devise: e.target.value})} className="px-3 py-2 border rounded">
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="px-3 py-2 border rounded">
              <option value="client">Client</option>
              <option value="devis">Devis</option>
              <option value="contrat">Contrat</option>
              <option value="facture">Facturé</option>
            </select>
            <input type="number" placeholder="Montant" value={formData.montant} onChange={(e) => setFormData({...formData, montant: parseFloat(e.target.value) || 0})} className="px-3 py-2 border rounded" />
          </div>

          <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border rounded" rows="3"></textarea>

          <div className="flex gap-2">
            <button onClick={editingClient ? handleEditClient : handleAddClient} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition">
              {editingClient ? 'Modifier' : 'Ajouter'}
            </button>
            <button onClick={() => { setShowClientForm(false); setEditingClient(null); resetFormData(); }} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium transition">
              Annuler
            </button>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Rechercher par nom, email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <div className="space-y-2">
        {clients
          .filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(client => (
            <div key={client.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold">{client.nom}</p>
                {client.prenom && <p className="text-sm text-gray-600">{client.prenom} {client.nomFamille}</p>}
                <p className="text-sm text-gray-500">{client.email}</p>
                {client.telephone && <p className="text-sm text-gray-500">{client.telephone}</p>}
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${client.type === 'Entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                    {client.type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                    {client.stage}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                    {documents.filter(d => d.clientId === client.id).length} docs
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setEditingClient(client);
                    setFormData(client);
                    setShowClientForm(true);
                  }}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                >
                  <Edit2 className="w-4 h-4" /> Modifier
                </button>
                <button
                  onClick={() => {
                    setSelectedClientForDocs(client.id);
                    setShowDocForm(true);
                  }}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition"
                >
                  <FileText className="w-4 h-4" /> Documents
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
          <textarea placeholder="Contenu" value={docForm.contenu} onChange={(e) => setDocForm({...docForm, contenu: e.target.value})} className="w-full px-3 py-2 border rounded" rows="5"></textarea>
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
            Précédent
          </button>
          <h3 className="text-xl font-semibold">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="px-4 py-2 bg-gray-300 rounded">
            Suivant
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

  // ===== MODAL CONFIRMATION
  const ConfirmModal = () => (
    showConfirmModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
          <p className="text-gray-600 mb-6">Cette action est irréversible. Les documents associés seront également supprimés.</p>
          <div className="flex gap-3">
            <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition">
              Supprimer
            </button>
            <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium transition">
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">📊 Eventix CRM</h1>
          <p className="text-sm text-blue-100">Gestion clients et documents</p>
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

      <ConfirmModal />
    </div>
  );
};

export default App;