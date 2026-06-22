// Mock data for the Kapitano dashboard mockups.
// All names, emails, IDs and addresses are fabricated.
// Structure follows the production app schemas (resellers, clients, sites, services,
// catalogues, mobile data subscriptions, trunk SIP, tickets, eligibility lookups).

// ──────────────────────────────────────────────────────────────────
// SEEDS
// ──────────────────────────────────────────────────────────────────
const FIRST = ["Mathis","Anaïs","Lucas","Camille","Théo","Léa","Hugo","Manon","Nathan","Inès","Jules","Sarah","Adrien","Chloé","Quentin","Pauline","Maxime","Élise","Antoine","Margaux","Romain","Clémence","Baptiste","Juliette"];
const LAST  = ["Bourgoin","Petit","Martin","Dupont","Moreau","Roux","Blanc","Girard","Rousseau","Mercier","Bernard","Gauthier","Faure","Legrand","Noël","Colin","Lambert","Fontaine","Robin","Vidal","Lefebvre","Garnier","Renaud","Caron"];
const FILIALES = ["Koesio Aquitaine","Koesio Île-de-France","Koesio Bretagne","Koesio Rhône-Alpes","Koesio Méditerranée","Koesio Grand Est","Koesio Pays de la Loire","Koesio Hauts-de-France"];
const REVENDEURS = [
  { code: "REV-0001", nom: "2IT SOLUTIONS",                    codeRegion: "IDF", codeTelesoft: "TS-1001", email: "contact@2it-solutions.fr" },
  { code: "REV-0002", nom: "ABC TELECOMS",                     codeRegion: "RA",  codeTelesoft: "TS-1002", email: "contact@abc-telecoms.fr" },
  { code: "REV-0003", nom: "ADV",                              codeRegion: "GE",  codeTelesoft: "TS-1003", email: "contact@adv.fr" },
  { code: "REV-0004", nom: "AXIUM SOLUTIONS",                  codeRegion: "MED", codeTelesoft: "TS-1004", email: "contact@axium-solutions.fr" },
  { code: "REV-0005", nom: "CIS VALLEY",                       codeRegion: "AQ",  codeTelesoft: "TS-1005", email: "contact@cis-valley.fr" },
  { code: "REV-0006", nom: "GROUPE TELECOMS DE L'OUEST GTO",   codeRegion: "PL",  codeTelesoft: "TS-1006", email: "contact@gto.fr" },
  { code: "REV-0007", nom: "IPNEOS",                           codeRegion: "IDF", codeTelesoft: "TS-1007", email: "contact@ipneos.fr" },
  { code: "REV-0008", nom: "KOESIO AQUITAINE",                 codeRegion: "AQ",  codeTelesoft: "TS-1008", email: "contact@koesio-aquitaine.fr" },
  { code: "REV-0009", nom: "KOESIO AURA INFO (VD)",            codeRegion: "RA",  codeTelesoft: "TS-1009", email: "contact@koesio-aura-vd.fr" },
  { code: "REV-0010", nom: "KOESIO AURA INFO (VDI)",           codeRegion: "RA",  codeTelesoft: "TS-1010", email: "contact@koesio-aura-vdi.fr" },
  { code: "REV-0011", nom: "KOESIO AURA TELECOM",              codeRegion: "RA",  codeTelesoft: "TS-1011", email: "contact@koesio-aura-telecom.fr" },
  { code: "REV-0012", nom: "KOESIO AUSTRALIA",                 codeRegion: "INT", codeTelesoft: "TS-1012", email: "contact@koesio-australia.com.au" },
  { code: "REV-0013", nom: "KOESIO CENTRE EST",                codeRegion: "CE",  codeTelesoft: "TS-1013", email: "contact@koesio-centre-est.fr" },
  { code: "REV-0014", nom: "KOESIO CORPORATE IT",              codeRegion: "IDF", codeTelesoft: "TS-1014", email: "contact@koesio-corporate.fr" },
  { code: "REV-0015", nom: "KOESIO EST",                       codeRegion: "GE",  codeTelesoft: "TS-1015", email: "contact@koesio-est.fr" },
  { code: "REV-0016", nom: "KOESIO GRAND EST",                 codeRegion: "GE",  codeTelesoft: "TS-1016", email: "contact@koesio-grand-est.fr" },
  { code: "REV-0017", nom: "KOESIO IDF",                       codeRegion: "IDF", codeTelesoft: "TS-1017", email: "contact@koesio-idf.fr" },
  { code: "REV-0018", nom: "KOESIO MANAGED SERVICES",          codeRegion: "NAT", codeTelesoft: "TS-1018", email: "contact@koesio-ms.fr" },
  { code: "REV-0019", nom: "KOESIO MEDITERRANNEE",             codeRegion: "MED", codeTelesoft: "TS-1019", email: "contact@koesio-med.fr" },
  { code: "REV-0020", nom: "KOESIO NETWORKS",                  codeRegion: "NAT", codeTelesoft: "TS-1020", email: "contact@koesio-networks.fr" },
  { code: "REV-0021", nom: "KOESIO NORD OUEST",                codeRegion: "NO",  codeTelesoft: "TS-1021", email: "contact@koesio-nord-ouest.fr" },
  { code: "REV-0022", nom: "KOESIO OCCITANIE",                 codeRegion: "OCC", codeTelesoft: "TS-1022", email: "contact@koesio-occitanie.fr" },
  { code: "REV-0023", nom: "KOESIO OCCITANIE BPA",             codeRegion: "OCC", codeTelesoft: "TS-1023", email: "contact@koesio-occitanie-bpa.fr" },
  { code: "REV-0024", nom: "KOESIO OUEST",                     codeRegion: "PL",  codeTelesoft: "TS-1024", email: "contact@koesio-ouest.fr" },
  { code: "REV-0025", nom: "KOESIO PACA",                      codeRegion: "MED", codeTelesoft: "TS-1025", email: "contact@koesio-paca.fr" },
  { code: "REV-0026", nom: "KOESIO PACA TELECOMS",             codeRegion: "MED", codeTelesoft: "TS-1026", email: "contact@koesio-paca-telecoms.fr" },
  { code: "REV-0027", nom: "KOESIO SUD ALLIANCE",              codeRegion: "OCC", codeTelesoft: "TS-1027", email: "contact@koesio-sud-alliance.fr" },
  { code: "REV-0028", nom: "KOESIO SUISSE",                    codeRegion: "CH",  codeTelesoft: "TS-1028", email: "contact@koesio-suisse.ch" },
  { code: "REV-0029", nom: "ONE OPERATEUR",                    codeRegion: "IDF", codeTelesoft: "TS-1029", email: "contact@one-operateur.fr" },
  { code: "REV-0030", nom: "Production",                       codeRegion: "NAT", codeTelesoft: "TS-1030", email: "contact@production.fr" },
  { code: "REV-0031", nom: "S-WAN IP",                         codeRegion: "IDF", codeTelesoft: "TS-1031", email: "contact@swan-ip.fr" },
];

const CLIENT_NAMES = [
  "Cabinet Mercier & Associés","Boulangerie Dupuis","Logitrans Express","Pharmacie de la Gare",
  "Studio Aurore","Atelier Métal Bleu","Cuisines Vallée","ImmoConcept",
  "Garage Saint-Michel","SCI Les Pléiades","Hôtel Beauséjour","Clinique vétérinaire Lavoisier",
  "Optique Vision Plus","Boucherie Charcuterie Lemoine","Maison Verte Paysagiste","Cabinet Notarial Vasseur",
  "Domaine de Belair","SARL Briques & Bâtiments","Restaurant Le Glacier","Crèche les Lutins",
];

const CLIENT_SITE_MAP = {
  "Cabinet Mercier & Associés":     "Siège Bordeaux",
  "Boulangerie Dupuis":              "Agence Paris",
  "Logitrans Express":               "Boutique Lyon",
  "Pharmacie de la Gare":            "Entrepôt Marseille",
  "Studio Aurore":                   "Bureaux Rennes",
  "Atelier Métal Bleu":              "Showroom Strasbourg",
  "Cuisines Vallée":                 "Atelier Nantes",
  "ImmoConcept":                     "Dépôt Lille",
  "Garage Saint-Michel":             "Siège Toulouse",
  "SCI Les Pléiades":                "Agence Nice",
  "Hôtel Beauséjour":                "Boutique Montpellier",
  "Clinique vétérinaire Lavoisier":  "Entrepôt Saint-Étienne",
  "Optique Vision Plus":             "Bureaux Reims",
  "Boucherie Charcuterie Lemoine":   "Showroom Dijon",
  "Maison Verte Paysagiste":         "Atelier Angers",
  "Cabinet Notarial Vasseur":        "Dépôt Le Mans",
  "Domaine de Belair":               "Siège Tours",
  "SARL Briques & Bâtiments":        "Agence Pau",
  "Restaurant Le Glacier":           "Boutique Versailles",
  "Crèche les Lutins":               "Entrepôt Le Havre",
};

const SITES_FIXED = [
  "Siège Bordeaux","Agence Paris","Boutique Lyon","Entrepôt Marseille",
  "Bureaux Rennes","Showroom Strasbourg","Atelier Nantes","Dépôt Lille",
  "Siège Toulouse","Agence Nice","Boutique Montpellier","Entrepôt Saint-Étienne",
  "Bureaux Reims","Showroom Dijon","Atelier Angers","Dépôt Le Mans",
  "Siège Tours","Agence Pau","Boutique Versailles","Entrepôt Le Havre",
  "Bureaux Bordeaux","Showroom Paris","Atelier Lyon","Dépôt Marseille",
];

const SITES_LABELS = ["Siège","Agence","Boutique","Entrepôt","Bureaux","Showroom","Atelier","Dépôt"];
const VILLES_CP = [
  { ville: "Bordeaux",      cp: "33000" },
  { ville: "Paris",         cp: "75001" },
  { ville: "Lyon",          cp: "69001" },
  { ville: "Marseille",     cp: "13001" },
  { ville: "Rennes",        cp: "35000" },
  { ville: "Strasbourg",    cp: "67000" },
  { ville: "Nantes",        cp: "44000" },
  { ville: "Lille",         cp: "59000" },
  { ville: "Toulouse",      cp: "31000" },
  { ville: "Nice",          cp: "06000" },
  { ville: "Montpellier",   cp: "34000" },
  { ville: "Saint-Étienne", cp: "42000" },
  { ville: "Reims",         cp: "51100" },
  { ville: "Dijon",         cp: "21000" },
  { ville: "Angers",        cp: "49000" },
  { ville: "Le Mans",       cp: "72000" },
  { ville: "Tours",         cp: "37000" },
  { ville: "Pau",           cp: "64000" },
  { ville: "Versailles",    cp: "78000" },
  { ville: "Le Havre",      cp: "76600" },
];
const VILLES = VILLES_CP.map(v => v.ville);

const STATUTS_USER = [
  { label: "Actif",    color: "#2E7D32" },
  { label: "Actif",    color: "#2E7D32" },
  { label: "Inactif",  color: "#616161" },
  { label: "Actif",    color: "#2E7D32" },
  { label: "Inactif",  color: "#616161" },
];

function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff; }
const _r = rng(7);
const pick = (a) => a[Math.floor(_r() * a.length)];
const pad = (n, w = 2) => String(n).padStart(w, "0");

// ──────────────────────────────────────────────────────────────────
// UTILISATEURS
// ──────────────────────────────────────────────────────────────────
const USERS = Array.from({ length: 32 }).map((_, i) => {
  const f = pick(FIRST), l = pick(LAST);
  return {
    id: 100000 + i,
    prenom: f,
    nom: l.toUpperCase(),
    email: `${f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]/g,"")}.${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}@koesio.com`,
    type: pick(["AUTH0","AUTH0","OKTA","AUTH0","OKTA","AUTH0"]),
    filiale: pick(FILIALES),
    statut: STATUTS_USER[i % STATUTS_USER.length],
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%9))}/2025 - ${pad(8+(i%10))}:${pad(10+i*2%50)}:${pad(15+i%40)}`,
    dateModification: `${pad(1+(i%28))}/${pad(1+(i%9))}/2025 - ${pad(8+(i%10))}:${pad(10+i*2%50)}:${pad(15+i%40)}`,
    role: pick(["Administrateur","Opérateur","Lecture seule","Support N1","Support N2","Manager"]),
    revendeur: ["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"][i % 31],
  };
});

USERS.unshift({
  id: 100099,
  prenom: "Mathis",
  nom: "BOURGOIN",
  email: "mathis.bourgoin@koesio.com",
  type: "OKTA",
  filiale: "Koesio Aquitaine",
  statut: { label: "Actif", color: "#2E7D32" },
  dateCreation: "14/10/2025 - 12:13:45",
  dateModification: "14/10/2025 - 12:13:45",
  role: "Administrateur",
  revendeur: "KOESIO AQUITAINE",
});

// ──────────────────────────────────────────────────────────────────
// LOGS (request log)
// ──────────────────────────────────────────────────────────────────
const URIS = [
  { uri: "/api/v1/subscribers/mobile",       type: "subscriber"   },
  { uri: "/api/v1/orders/trunk-sip",         type: "order"        },
  { uri: "/api/v1/eligibility/lookup",       type: "eligibility"  },
  { uri: "/api/v1/resellers/list",           type: "reseller"     },
  { uri: "/api/v1/clients/create",           type: "client"       },
  { uri: "/api/v1/sites/find",               type: "site"         },
  { uri: "/api/v1/tickets/create",           type: "ticket"       },
  { uri: "/api/v1/address-improver/address", type: "address"      },
  { uri: "/api/v1/voice/spaces",             type: "voice-space"  },
  { uri: "/api/v1/portability/numbers",      type: "portability"  },
];
const METHODES = ["GET","GET","POST","POST","PATCH","DELETE"];
const STATUTS_HTTP = [
  { code: 200, kind: "success" },
  { code: 201, kind: "success" },
  { code: 400, kind: "error"   },
  { code: 403, kind: "error"   },
  { code: 404, kind: "error"   },
  { code: 409, kind: "error"   },
  { code: 422, kind: "error"   },
  { code: 500, kind: "error"   },
  { code: 501, kind: "error"   },
  { code: 502, kind: "error"   },
];
const IPS = ["::ffff:172.29.0.1","::ffff:10.0.1.42","::ffff:192.168.4.12","::ffff:172.31.0.8"];
const AGENTS = ["axios/1.12.2","axios/1.10.0","node-fetch/3.3.2","python-requests/2.31.0"];

const LOGS = Array.from({ length: 22 }).map((_, i) => {
  const u = URIS[Math.floor(_r() * URIS.length)];
  const m = METHODES[Math.floor(_r() * METHODES.length)];
  const s = STATUTS_HTTP[Math.floor(_r() * STATUTS_HTTP.length)];
  return {
    id: 22 - i,
    uri: u.uri, methode: m, statut: s, type: u.type,
    description: s.kind === "success"
      ? `La ressource ${u.uri.split("/").pop()} a été ${m === "POST" ? "créée" : m === "PATCH" ? "mise à jour" : m === "DELETE" ? "supprimée" : "récupérée"}`
      : `Une erreur est survenue lors du traitement de la requête ${m}`,
    dateCreation: `${pad(13)}/11/2025 - ${pad(10+(i%6))}:${pad(20+(i*3)%40)}:${pad(10+i%50)}`,
    duree: `${(20 + Math.floor(_r() * 800))} ms`,
    user: USERS[i % USERS.length],
    nomUtilisateur: _r() < 0.8 ? (i % 2 === 0 ? "MSM" : "KRAFTERY") : (USERS[i % USERS.length].prenom + " " + USERS[i % USERS.length].nom),
    adresseIp: IPS[i % IPS.length],
    agentUtilisateur: AGENTS[i % AGENTS.length],
  };
});

const SAMPLE_PAYLOAD = {
  productionId: 976,
  month: "2026-05",
  thresholdPercentage: 100,
  usagePercentage: "102.30",
  consumedBytes: "549228537239",
  quotaBytes: "536870912000",
  blocked: true,
};

const SAMPLE_RESPONSE = {
  headers: {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "access-control-expose-headers": "content-disposition,x-filename",
  },
  body: "No mobile data notification emails configured for reseller 5",
};

// ──────────────────────────────────────────────────────────────────
// CLIENTS / SITES / SERVICES / CATALOGUE
// ──────────────────────────────────────────────────────────────────
const CLIENTS = CLIENT_NAMES.flatMap((nom, i) => ({
  id: `CLI-${pad(1000 + i, 5)}`,
  nom,
  siret: `${pad(10000000000000 + i * 7777777, 14)}`,
  siren: `${pad(100000000 + i * 7777, 9)}`,
  codeArtis: `${pad(100000 + i * 37, 6)}`,
  codesArtisSecondaires: i % 3 === 0 ? "" : [`${pad(200000 + i * 13, 6)}`, ...(i % 3 === 2 ? [`${pad(300000 + i * 7, 6)}`] : [])].join(", "),
  revendeur: REVENDEURS[i % REVENDEURS.length].nom,
  site: CLIENT_SITE_MAP[nom],
  ville: VILLES[i % VILLES.length],
  sites: 1 + (i % 5),
  services: 2 + ((i * 3) % 18),
  statut: i % 8 === 7 ? { label: "Suspendu", color: "#D32F2F" } : { label: "Actif", color: "#2E7D32" },
  dateCreation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2024`,
}));

const SITES = Array.from({ length: 24 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const loc = VILLES_CP[i % VILLES_CP.length];
  return {
    id: `${pad(10000 + i, 5)}`,
    label: SITES_FIXED[i],
    client: c.nom,
    siret: c.siret,
    revendeur: c.revendeur,
    adresse: `${1 + i} ${pick(["rue","avenue","place","boulevard"])} ${pick(["du Général Leclerc","de la République","Victor Hugo","Pasteur","Carnot","Jean Jaurès","Gambetta","de la Liberté"])}`,
    cp: loc.cp,
    ville: loc.ville,
    services: 1 + (i % 6),
    technicien: pick(["M. Lambert","Mme Caron","M. Renaud","Mme Garnier","M. Robin"]),
    statut: i % 11 === 10 ? { label: "Inactif", color: "#616161" } : { label: "Actif", color: "#2E7D32" },
  };
});

const SERVICES = Array.from({ length: 18 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const s = SITES[i % SITES.length];
  const types = ["Mobile Data","Trunk SIP","Lien d'accès FTTH","Lien d'accès SDSL","Voix fixe","Numéro SDA","Hébergement Cloud","Wifi managé"];
  return {
    id: `SVC-${pad(3000 + i, 5)}`,
    type: types[i % types.length],
    quantite: 1 + (i % 10),
    matricule: [
      `KP${i * 37 + 1001}`,
      `MOB_${pad(100 + i * 7, 4)}-FR`,
      `SVC-${pad(i * 13 + 500, 5)}A`,
      `${pad(i * 41 + 200, 6)}`,
      `LNK_${i * 19 + 100}`,
      `TS-${pad(i * 23 + 300, 4)}_HD`,
      `FR${i * 31 + 10}-SIP`,
    ][i % 7],
    revendeur: c.revendeur,
    client: c.nom,
    site: CLIENT_SITE_MAP[c.nom],
    reference: `KP-${pad(50000 + i * 13, 6)}`,
    debit: pick(["100 Mb/s","1 Gb/s","20 Mb/s","500 Mb/s","2 Gb/s","—"]),
    statut: [
      { label: "Actif",                            color: "#2E7D32" },
      { label: "Actif",                            color: "#2E7D32" },
      { label: "Actif",                            color: "#2E7D32" },
      { label: "Inactif",                          color: "#616161" },
      { label: "En cours d'activation (à activer)",color: "#ED6C02" },
      { label: "En cours d'activation",            color: "#1976D2" },
      { label: "En cours de désactivation",        color: "#D32F2F" },
    ][i % 7],
    dateActivation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2024`,
    dateFacturation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
    finEngagement: `${pad(1+(i%28))}/${pad(1+(i%12))}/202${6 + (i % 3)}`,
  };
});

const CATALOGUE = [
  { ref: "1042",  famille: "Mobile",        sousFamille: "Forfaits data",  designation: "Forfait Mobile 50 Go",     fournisseur: "Orange",    type: "Abonnement", prixAchat: "9,90 €",   prixPublic: "12,90 €",  duree: "24 mois", actif: true  },
  { ref: "1078",  famille: "Mobile",        sousFamille: "Forfaits data",  designation: "Forfait Mobile 100 Go",    fournisseur: "SFR",       type: "Abonnement", prixAchat: "14,00 €",  prixPublic: "18,90 €",  duree: "24 mois", actif: true  },
  { ref: "1093",  famille: "Mobile",        sousFamille: "Forfaits data",  designation: "Forfait Mobile Illimité",  fournisseur: "Bouygues",  type: "Abonnement", prixAchat: "22,00 €",  prixPublic: "29,90 €",  duree: "24 mois", actif: true  },
  { ref: "2210",  famille: "Cvoice",        sousFamille: "Trunk SIP",      designation: "Trunk SIP 4 canaux",       fournisseur: "Koesio",    type: "Abonnement", prixAchat: "29,00 €",  prixPublic: "39,00 €",  duree: "36 mois", actif: true  },
  { ref: "14307", famille: "Cvoice",        sousFamille: "Trunk SIP",      designation: "Trunk SIP 8 canaux",       fournisseur: "Koesio",    type: "FAS",        prixAchat: "45,00 €",  prixPublic: "59,00 €",  duree: "36 mois", actif: true  },
  { ref: "2318",  famille: "Cvoice",        sousFamille: "Trunk SIP",      designation: "Trunk SIP 16 canaux",      fournisseur: "Koesio",    type: "Abonnement", prixAchat: "75,00 €",  prixPublic: "99,00 €",  duree: "36 mois", actif: false },
  { ref: "3041",  famille: "Lien FTTH",     sousFamille: "FTTH Orange",    designation: "Fibre FTTH 1 Gb/s",        fournisseur: "Orange",    type: "Abonnement", prixAchat: "65,00 €",  prixPublic: "89,00 €",  duree: "36 mois", actif: true  },
  { ref: "3055",  famille: "Lien FTTH",     sousFamille: "FTTH Orange",    designation: "Fibre FTTH 2 Gb/s SLA",    fournisseur: "Orange",    type: "Abonnement", prixAchat: "110,00 €", prixPublic: "149,00 €", duree: "36 mois", actif: true  },
  { ref: "30812", famille: "Lien SDSL",     sousFamille: "SDSL Orange C2E",designation: "SDSL 8 Mb/s symétrique",   fournisseur: "SFR",       type: "FAS",        prixAchat: "95,00 €",  prixPublic: "129,00 €", duree: "36 mois", actif: false },
  { ref: "4120",  famille: "Services SAAS", sousFamille: "Wifi managé",    designation: "Wifi managé (par borne)",  fournisseur: "Koesio",    type: "Abonnement", prixAchat: "7,00 €",   prixPublic: "9,90 €",   duree: "12 mois", actif: true  },
  { ref: "4253",  famille: "VM",            sousFamille: "VL PROXMOX",     designation: "VM 4 vCPU / 8 Go",         fournisseur: "Koesio",    type: "Abonnement", prixAchat: "35,00 €",  prixPublic: "49,00 €",  duree: "12 mois", actif: true  },
  { ref: "5007",  famille: "SDA IP",        sousFamille: "SDA IP",         designation: "Numéro SDA fixe national", fournisseur: "Koesio",    type: "Abonnement", prixAchat: "0,80 €",   prixPublic: "1,50 €",   duree: "—",       actif: true  },
];

// ──────────────────────────────────────────────────────────────────
// MOBILES — Abonnements + Commandes
// ──────────────────────────────────────────────────────────────────
const FORFAITS = ["Mobile 50 Go","Mobile 100 Go","Mobile Illimité","Data Pro 20 Go","Data Pro 100 Go"];
const ETAT_ABO  = ["Actif","Actif","Actif","Inactif","À activer","En cours d'activation","En cours de désactivation"];
const ETAT_PROD = ["Actif","Actif","Commandé","Création en cours","Résilié"];
const MOB_TYPES = ["SIM","SIM","SIM","eSIM","SIM"];
const SUBSCRIBERS = Array.from({ length: 18 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const consoPct = (i * 13 + 7) % 95;
  return {
    id: `ABO-${pad(8000 + i, 5)}`,
    msisdn: `+33 6 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    iccid: `8933 0123 4567 ${pad(8900 + i, 4)}`,
    client: c.nom,
    revendeur: c.revendeur,
    utilisateur: `${pick(FIRST)} ${pick(LAST).toUpperCase()}`,
    type: MOB_TYPES[i % MOB_TYPES.length],
    site: CLIENT_SITE_MAP[c.nom],
    forfait: FORFAITS[i % FORFAITS.length],
    etatAbo: ETAT_ABO[i % ETAT_ABO.length],
    etatProd: ETAT_PROD[i % ETAT_PROD.length],
    conso: `${consoPct} %`,
    consoVal: consoPct,
    activation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
    statut: i % 13 === 12 ? { label: "Suspendu", color: "#D32F2F" }
          : i % 7  === 6  ? { label: "Désactivé", color: "#616161" }
          :                  { label: "Actif",    color: "#2E7D32" },
    porteur: pick(["Orange","SFR","Bouygues","Free"]),
  };
});

const TYPE_COMMANDES = ["Création","Création","Modification","Résiliation","Portabilité sortante"];
const ETAT_COMMANDES = ["En brouillon","Programmée","Crée","En cours","En attente","Terminée avec succès","Annulée","En cours (erreur)","Terminée avec erreur"];
const MOBILE_ORDERS = Array.from({ length: 14 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const typeCmd = TYPE_COMMANDES[i % TYPE_COMMANDES.length];
  return {
    id: `CMD-MOB-${pad(2025000 + i, 7)}`,
    ref: `${pad(10000 + i * 37, 5)}`,
    client: c.nom,
    revendeur: REVENDEURS[i % REVENDEURS.length].nom,
    typeCommande: typeCmd,
    forfait: FORFAITS[i % FORFAITS.length],
    numero: `+33 6 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    type: MOB_TYPES[i % MOB_TYPES.length],
    iccid: `8933 0123 4567 ${pad(9100 + i, 4)}`,
    portabilite: typeCmd === "Portabilité sortante" ? `${pad(1+(i%28))}/${pad(1+(i%12))}/2025` : "Non",
    etatCommande: ETAT_COMMANDES[i % ETAT_COMMANDES.length],
    quantite: 1 + ((i * 3) % 15),
    statut: i % 5 === 0 ? { label: "Livrée",    color: "#2E7D32" }
          : i % 5 === 1 ? { label: "En cours",  color: "#ED6C02" }
          : i % 5 === 2 ? { label: "En attente",color: "#0288D1" }
          : i % 5 === 3 ? { label: "Annulée",   color: "#D32F2F" }
          :               { label: "Brouillon", color: "#616161" },
    dateCommande: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
    dateLivraison: i % 4 === 0 ? `${pad(2+(i%26))}/${pad(2+(i%11))}/2025` : "—",
    montant: `${(35 + (i * 17) % 800).toFixed(2)} €`.replace(".", ","),
  };
});

// ──────────────────────────────────────────────────────────────────
// LIENS D'ACCÈS
// ──────────────────────────────────────────────────────────────────
const OFFRES_LIA = ["Mobile 50 Go","Mobile 100 Go","Mobile Illimité","Data Pro 20 Go","Data Pro 100 Go"];
const NOMS_LIEN = ["Lien principal","Lien backup","Lien siège","Lien agence","Lien entrepôt","Lien boutique","VPN principal","Accès Cloud","Lien MPLS","Accès Internet"];
const ACCESS_LINKS = Array.from({ length: 16 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  return {
    id: `LIN-${pad(7000 + i, 5)}`,
    reference: `KP-LIN-${pad(50000 + i, 6)}`,
    client: c.nom,
    revendeur: c.revendeur,
    site: CLIENT_SITE_MAP[c.nom],
    numero: `+33 6 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    iccid: `8933 0123 4567 ${pad(9200 + i, 4)}`,
    nomLien: NOMS_LIEN[i % NOMS_LIEN.length],
    offre: OFFRES_LIA[i % OFFRES_LIA.length],
    etatAbo: ETAT_ABO[i % ETAT_ABO.length],
    etatProd: ETAT_PROD[i % ETAT_PROD.length],
    technologie: pick(["FTTH","FTTO","SDSL","ADSL","4G FWA","5G FWA"]),
    debit: pick(["100 Mb/s","1 Gb/s","2 Gb/s","20 Mb/s","500 Mb/s","2 Mb/s"]),
    operateur: pick(["Orange","SFR","Free Pro","Bouygues","Covage","Axione"]),
    statut: i % 11 === 10 ? { label: "En coupure", color: "#D32F2F" }
          : i % 7  === 6  ? { label: "Provisioning", color: "#ED6C02" }
          :                  { label: "En service", color: "#2E7D32" },
    activation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
  };
});

const ACCESS_ORDERS = Array.from({ length: 12 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const typeCmd = TYPE_COMMANDES[i % TYPE_COMMANDES.length];
  return {
    id: `CMD-LIN-${pad(2025100 + i, 7)}`,
    ref: `${pad(20000 + i * 41, 5)}`,
    client: c.nom,
    revendeur: c.revendeur,
    typeCommande: typeCmd,
    forfait: OFFRES_LIA[i % OFFRES_LIA.length],
    iccid: `8933 0123 4567 ${pad(9300 + i, 4)}`,
    numero: `+33 6 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    etatCommande: ETAT_COMMANDES[i % ETAT_COMMANDES.length],
    site: CLIENT_SITE_MAP[c.nom],
    technologie: pick(["FTTH","FTTO","SDSL","4G FWA"]),
    statut: i % 4 === 0 ? { label: "Livrée",     color: "#2E7D32" }
          : i % 4 === 1 ? { label: "Étude",      color: "#0288D1" }
          : i % 4 === 2 ? { label: "Production", color: "#ED6C02" }
          :               { label: "Bloquée",    color: "#D32F2F" },
    dateCommande: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
    rdv: i % 3 === 0 ? `${pad(2+(i%26))}/${pad(2+(i%11))}/2025` : "—",
  };
});

// ──────────────────────────────────────────────────────────────────
// VOIX FIXE — Espaces, Trunk SIP, Portabilité, Numéros
// ──────────────────────────────────────────────────────────────────
const NOM_CLIENT_ENOVE = ["Cabinet Mercier","Boulangerie Dupuis","Logitrans","Pharmacie Centrale","Studio Aurore","Atelier Métal","Cuisines Vallée","ImmoConcept","Garage Saint-Michel","SCI Pléiades","Hôtel Beauséjour","Clinique Lavoisier"];
const VOICE_SPACES = Array.from({ length: 12 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  return {
    id: `VOX-${pad(4000 + i, 5)}`,
    idProduction: `${pad(100 + i * 37 % 900, 3)}`,
    nom: `Espace voix ${c.nom}`,
    client: c.nom,
    revendeur: c.revendeur,
    nomClientEnove: NOM_CLIENT_ENOVE[i % NOM_CLIENT_ENOVE.length],
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025 - ${pad(8+(i%10))}:${pad(10+i*2%50)}:${pad(15+i%40)}`,
    canaux: pick([4, 4, 8, 8, 16, 32]),
    sda: 1 + ((i * 7) % 25),
    plage: `+33 ${pad(1 + i % 5)} ${pad(20 + i)} ${pad(40 + i)} 00 → ${pad(40 + i)} 99`,
    statut: i % 9 === 8 ? { label: "Migration", color: "#ED6C02" } : { label: "Actif", color: "#2E7D32" },
  };
});

const OFFRES_TRUNK = ["Trunk SIP","Trunk SIP","Centrex Enove","Centrex Enreach","Trunk SIP"];
const ETAT_FACTU = ["Actif","Actif","Actif","Inactif","En cours d'activation","En cours de désactivation"];
const TRUNK_SIP = Array.from({ length: 14 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const s = SITES[i % SITES.length];
  return {
    id: `TRK-${pad(5000 + i, 5)}`,
    client: c.nom,
    revendeur: c.revendeur,
    site: CLIENT_SITE_MAP[c.nom],
    numeroDeCharge: `09 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    offre: OFFRES_TRUNK[i % OFFRES_TRUNK.length],
    canaux: pick([4, 8, 8, 16, 32]),
    etatFactu: ETAT_FACTU[i % ETAT_FACTU.length],
    etatProd: ETAT_PROD[i % ETAT_PROD.length],
    realm: `sip-${pad(1+i)}.kapitano.koesio.network`,
    sda: 1 + ((i * 5) % 30),
    statut: i % 13 === 12 ? { label: "Hors service", color: "#D32F2F" }
          : i % 11 === 10 ? { label: "Provisioning", color: "#ED6C02" }
          :                  { label: "En service",  color: "#2E7D32" },
    activation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
  };
});

const TRUNK_ORDERS = Array.from({ length: 10 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const typeCmd = ["Création","Modification","Résiliation"][i % 3];
  return {
    id: `CMD-TRK-${pad(2025200 + i, 7)}`,
    ref: `${pad(30000 + i * 53, 5)}`,
    client: c.nom,
    revendeur: c.revendeur,
    typeOffre: OFFRES_TRUNK[i % OFFRES_TRUNK.length],
    typeCommande: typeCmd,
    numeroDeCharge: `09 ${pad(10 + (i*7) % 89)} ${pad(20 + (i*3) % 79)} ${pad(30 + (i*11) % 69)} ${pad(40 + (i*5) % 59)}`,
    etatCommande: ETAT_COMMANDES[i % ETAT_COMMANDES.length],
    canaux: pick([4, 8, 16, 32]),
    statut: i % 5 === 0 ? { label: "Livrée",     color: "#2E7D32" }
          : i % 5 === 1 ? { label: "Production", color: "#ED6C02" }
          : i % 5 === 2 ? { label: "Étude",      color: "#0288D1" }
          : i % 5 === 3 ? { label: "Annulée",    color: "#D32F2F" }
          :               { label: "Brouillon",  color: "#616161" },
    dateCommande: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
  };
});

const PORT_INITIALES = ["BP","DH","MC","AL","RP"];
const PORT_COLORS = ["#7E41A3","#009688","#1976D2","#E64A19","#388E3C"];
const PORT_ETATS = ["En brouillon","En brouillon","En cours","En cours","Incident","Incident","Terminée","Annulée"];
const PORT_STATUTS = ["En attente","En attente","—","En attente","—","En attente","Portée","Annulée"];
const PORTABILITES = Array.from({ length: 18 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const etat = PORT_ETATS[i % PORT_ETATS.length];
  return {
    id: 859 - i * 7,
    ref: `${859 - i * 7}`,
    client: c.nom,
    revendeur: c.revendeur,
    typeCommande: ["—","Partielle simple","Partielle simple","Complète","—","Partielle simple","Complète","Partielle simple"][i % 8],
    numero: `0${[4,4,2,4,4,9][i % 6]} ${pad(70 + (i*7)%20)} ${pad(78 + i%10)} ${pad(70 + i%20)} ${pad(10 + i%40)}`,
    datePortabilite: `${pad(15+(i%14))}/${pad(2+(i%10))}/2025 - 10:${pad(10+i*3%50)}`,
    etatCommande: etat,
    hasPortType: i % 3 !== 2,
    statutPortabilite: PORT_STATUTS[i % PORT_STATUTS.length],
    note: i % 4 === 0 ? "À relancer" : i % 4 === 1 ? "RIO demandé" : "—",
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
    initiales: PORT_INITIALES[i % PORT_INITIALES.length],
    couleurAvatar: PORT_COLORS[PORT_INITIALES.indexOf(PORT_INITIALES[i % PORT_INITIALES.length])],
    operateurSource: pick(["Orange","SFR","Bouygues","Free Pro","Coriolis"]),
    rio: `1A${pad(100 + i * 7, 4)}-XYZ`,
  };
});

const TAILLES_PLAGE = [10, 20, 50, 100];
const NUMBERS = Array.from({ length: 16 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  const taille = TAILLES_PLAGE[i % TAILLES_PLAGE.length];
  const prefix = [1,2,3,4,5,9][i % 6];
  const s2 = pad(10 + (i * 7) % 90, 2);
  const s3 = pad(10 + (i * 11) % 90, 2);
  const s4 = pad(10 + (i * 13) % 90, 2);
  const debut = `0${prefix} ${s2} ${s3} ${s4} 00`;
  const fin   = `0${prefix} ${s2} ${s3} ${s4} ${pad(taille - 1, 2)}`;
  const occupe = Math.round((30 + i * 7) % 100);
  return {
    id: `NUM-${pad(7000 + i, 5)}`,
    numero: debut,
    client: c.nom,
    revendeur: c.revendeur,
    debutPlage: debut,
    finPlage: fin,
    taillePlage: taille,
    tauxOccupation: `${occupe} %`,
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025 - ${pad(8+(i%10))}:${pad(10+i*2%50)}:${pad(15+i%40)}`,
    type: pick(["SDA","Standard","Pilote","SVI"]),
    affectation: pick(["Trunk SIP","Espace voix","Mobile","—"]),
    operateur: pick(["Koesio","Orange","Coriolis"]),
    statut: i % 7 === 6 ? { label: "Libre", color: "#0288D1" } : { label: "Affecté", color: "#2E7D32" },
  };
});

// ──────────────────────────────────────────────────────────────────
// COMMANDES — Suivi global + Reporting
// ──────────────────────────────────────────────────────────────────
const ETAT_CMD_ORDERS = ["Créée","Distribution en cours","Envoyée","Reçue par le client","À activer","En cours d'activation","En production","Incident en cours","Annulée"];
const ORDERS = Array.from({ length: 18 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  return {
    id: `CMD-${pad(2025000 + i, 7)}`,
    numeroAffaire: `${pad(10000 + i * 59, 5)}`,
    client: c.nom,
    revendeur: c.revendeur,
    source: i % 3 === 2 ? "Hub commandes" : "Cristal",
    type: pick(["Mobile Data","Trunk SIP","Lien d'accès","Voix fixe","Numéro SDA"]),
    quantite: 1 + ((i * 3) % 12),
    etatCommande: ETAT_CMD_ORDERS[i % ETAT_CMD_ORDERS.length],
    dap: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025 - ${pad(8+(i%10))}:${pad(10+i*2%50)}:${pad(15+i%40)}`,
    montant: `${(50 + (i * 23) % 1800).toFixed(2)} €`.replace(".", ","),
    statut: i % 6 === 0 ? { label: "Livrée",     color: "#2E7D32" }
          : i % 6 === 1 ? { label: "En cours",   color: "#ED6C02" }
          : i % 6 === 2 ? { label: "En attente", color: "#0288D1" }
          : i % 6 === 3 ? { label: "Annulée",    color: "#D32F2F" }
          : i % 6 === 4 ? { label: "Brouillon",  color: "#616161" }
          :               { label: "Livrée",     color: "#2E7D32" },
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%12))}/2025`,
  };
});

const REPORTING_KPIS = [
  { label: "Commandes ce mois",  value: "342",     trend: "+12 %", up: true,  desc: "vs. mois précédent" },
  { label: "Taux de livraison",  value: "94,3 %",  trend: "+1,8 pt", up: true,desc: "objectif 92 %" },
  { label: "Délai moyen",        value: "8,4 j",   trend: "–0,6 j", up: true, desc: "commande → livraison" },
  { label: "Annulations",        value: "21",      trend: "+4",    up: false,desc: "≈ 6 % du volume" },
];

const RPT_CLIENTS = ["SELARL DE VETALLIER (052992)","FIDIA AUTOMOTIVE ENGINEERING (014445)","XIMECA (027878)","AXXAIR (024249)","CHARLES ET ALICE SAS (023959)","JET SYSTEMS HELICOPTERES (031122)","BONNETERIE CEVENOLE (011500)","SOCIETE ALPINE FRIGORIIFIQUE (019823)"];
const RPT_REVENDEURS = ["Koesio AURA TELECOM","Koesio EST","Koesio NETWORKS","Koesio PACA","Koesio IDF"];
const RPT_ARTICLES = ["Canaux SIP (cvoice)","FORFAIT CONNECT PRO 20GO MVNO ORANGE","FORFAIT CONNECT PRO 500GO MVNO ORANGE","SERVICE CENTREX ENREACH","FORFAIT CALL CONNECT 24K USA&CANADA ORANGE","SERVICE TRUNK CVOICE KOESIO","SERVICE CENTREX ENOVE","FORFAIT DATA PRO 100GO MVNO SFR"];
const RPT_TYPES_PROD = ["abo-mobile","abo-mobile-data","centrex","trunk","centrex","trunk","abo-mobile-data","centrex"];
const RPT_ACTIONS = ["Modification","Modification","Création","Création","Résiliation","Modification","Création","Résiliation"];
const RPT_USERS = ["—","test","John Test","—","—","Marie C.","—","test"];
const RPT_TEL = ["3370000713...","09 01 01 01 01","09 01 01 01 02","09 01 01 01 03","07 87 87 06 35","06 05 05 05 20","09 87 87 88 24","09 87 87 87 92"];

const REPORTING_LOGS = Array.from({ length: 100 }).map((_, i) => ({
  numeroAffaire: i % 5 === 0 ? `${190000000 + i * 4343}` : "—",
  dateAction: `${pad(1+(i%28))}/${pad(1+(i%12))}/2026 - ${pad(2+(i*7)%22)}:${pad(i*3%60)}:${pad(10+i%50)}`,
  revendeur: RPT_REVENDEURS[i % RPT_REVENDEURS.length],
  client: CLIENT_NAMES[i % CLIENT_NAMES.length],
  utilisateur: RPT_USERS[i % RPT_USERS.length],
  telephone: RPT_TEL[i % RPT_TEL.length],
  article: RPT_ARTICLES[i % RPT_ARTICLES.length],
  quantite: i % 7 === 6 ? 2 : 1,
  typeProd: RPT_TYPES_PROD[i % RPT_TYPES_PROD.length],
  typeAction: RPT_ACTIONS[i % RPT_ACTIONS.length],
}));

// ──────────────────────────────────────────────────────────────────
// TECHNIQUE — Tickets, Configurations, Supervision
// ──────────────────────────────────────────────────────────────────
const TKT_SUJETS = [
  "Test kali user affect","Internet : Coupure totale","[Client] VPN : Coupure chez Site",
  "Test commentaire avec PJ","[PROAC] : Équipement MTK HEX en statut DOWN",
  "[PROAC] : Équipement MTK CHATEAU LTE12 en s...","[PROAC] : Équipement MTK RB4011 en statut DO...",
  "[PROAC] : Équipement MTK WAP LTE en statut D...","[PROAC] : Équipement MTK HEX 2 en statut DOWN",
  "Demande de SDA supplémentaire","Migration carte SIM","Reconfiguration VLAN","Trafic mobile bloqué",
];
const TKT_ETATS = ["Nouveau","Assigné","Pris en compte","Clôturé - résolu","En cours","En attente d'informations"];
const TKT_CRITICITES = ["Bloquant","Critique","Mineur","Majeur","Majeur","Mineur","Critique","Mineur"];
const TKT_NATURES = ["Incident","Incident","Incident","Demande","Incident","Incident","Incident","Demande"];
const TKT_REVENDEURS = ["2IT Solutions","Koesio AURA TELECOM","Koesio NETWORKS","Koesio PACA","2IT Solutions"];
const TKT_CLIENTS = ["2IT SOLUTION","1DEPENDANCE IMMOBILIER","CTC","ACTIFORGE","KOESIO NETWORKS","DEPARTEMENT DE LA DROME","DEPARTEMENT DE L ARDECHE","SDIS 07","CROIX ROUGE FRANCAISE","CE COUCOU...","CE STE EUL..."];
const TKT_SITES = ["2IT SOLUTION","1DEPENDAN...","CTC","ACTIFORGE","CPRO 4G N°1","DD CED GRI...","CPA LE BEAGE","VILLENEUVE","IRFSS GREN...","CE COUCOU...","CE STE EUL..."];

const TICKETS = Array.from({ length: 50 }).map((_, i) => ({
  id: `TKN-2605-00${pad(i+1,3)}`,
  reference: `TKN-2605-00${pad(i+1,3)}`,
  sujet: TKT_SUJETS[i % TKT_SUJETS.length],
  etat: TKT_ETATS[i % TKT_ETATS.length],
  criticite: TKT_CRITICITES[i % TKT_CRITICITES.length],
  nature: TKT_NATURES[i % TKT_NATURES.length],
  origineAuto: TKT_SUJETS[i % TKT_SUJETS.length].includes("[PROAC]") ? true : i % 3 === 1,
  revendeur: TKT_REVENDEURS[i % TKT_REVENDEURS.length],
  client: CLIENT_NAMES[i % CLIENT_NAMES.length],
  site: CLIENT_SITE_MAP[CLIENT_NAMES[i % CLIENT_NAMES.length]],
  dateCreation: `${pad(1+(i%28))}/05/2026 - ${pad(7+(i*7)%16)}:${pad(i*3%60)}:${pad(10+i%50)}`,
  sla: pick(["4 h","8 h","24 h","48 h","—"]),
}));

const EQUIPMENTS = Array.from({ length: 14 }).map((_, i) => {
  const c = CLIENTS[i % CLIENTS.length];
  return {
    id: `EQP-${pad(13000 + i, 5)}`,
    nom: pick(["Routeur Cisco ISR","Switch HP","Borne wifi","Box Pro","Firewall Fortinet","ONT","IPBX"]) + ` #${1+i}`,
    client: c.nom,
    site: CLIENT_SITE_MAP[c.nom],
    ip: `10.${pad(1+i)}.${pad(10+i*3 % 250)}.${pad(1+i*7 % 250)}`,
    firmware: `v${pad(1+i%9)}.${pad(2+i%9)}.${pad(0+i%30)}`,
    etat: i % 11 === 10 ? { label: "Hors ligne", color: "#D32F2F" }
        : i % 7  === 6  ? { label: "Alerte",     color: "#ED6C02" }
        :                  { label: "En ligne",   color: "#2E7D32" },
    uptime: `${(80 + Math.floor(_r() * 20))} j`,
  };
});

const CFG_LIENS = ["FTTH_WI","FTTH_4G","FTTO","FTTH","FTTH_4G","FTTH_WI"];
const CFG_OPTIONS = ["CINET","CVPN, CVOICE","CINET, CVOICE","CINET","CINET, CVOICE","CVPN, CVOICE"];
const CFG_SERVICES = ["100 Mbps - zone EA SE...","500 Mbps - zone EA SE...","1 Gbps - zone EA SE...","—","—","—"];
const CFG_REVENDEURS = ["2IT Solutions","Koesio NETWORKS","Koesio OCCITANIE","Koesio PACA","Koesio IDF"];
const CFG_CLIENTS = ["2IT SOLUTION - 01","1DEPENDANCE IMMOB...","KOESIO NETWORKS - 0...","2G FAC SIMILE - 029175","2BS - 046297","KOESIO NETWORKS","SOLANE ET COMPAGNIE"];
const CFG_SITES = ["2IT SOLUTIONS - DOM...","1DEPENDANCE IMMOB...","KOESIO NETWORKS - A...","2G FAC SIMILE","2BS","KOESIO NETWORKS","SOLANE ET COMPAGNIE"];

const CONFIGURATIONS = Array.from({ length: 100 }).map((_, i) => {
  const archived = i % 5 === 1 || i % 5 === 3;
  return {
    dateCreation: `${pad(1+(i%28))}/${pad(1+(i%3))}/202${5+(i%2)} - ${pad(8+(i*3)%16)}:${pad(i*4%60)}:${pad(i%60)}`,
    version: i % 7 < 2 ? "1.37" : "1.39",
    lien: CFG_LIENS[i % CFG_LIENS.length],
    options: CFG_OPTIONS[i % CFG_OPTIONS.length],
    numeroSerie: i % 3 === 2 ? "HDROFJDKLSM" : "",
    statut: archived ? "Archivée" : "Active",
    dateArchivage: archived ? `${pad(1+(i%28))}/${pad(1+(i%3))}/202${5+(i%2)} - ${pad(10+(i%6))}:${pad(i*2%60)}` : "",
    revendeur: CFG_REVENDEURS[i % CFG_REVENDEURS.length],
    client: CLIENT_NAMES[i % CLIENT_NAMES.length],
    site: CLIENT_SITE_MAP[CLIENT_NAMES[i % CLIENT_NAMES.length]],
    service: CFG_SERVICES[i % CFG_SERVICES.length],
  };
});

// ──────────────────────────────────────────────────────────────────
// TICKETS ARCHIVÉS
// ──────────────────────────────────────────────────────────────────
const ARCH_SYMPTOMES = ["LIEN coupure totale","TEL appels entrants","LIEN Configuration Routeur","","","LIEN coupure totale",""];
const ARCH_ETATS = ["En cours","En cours","En cours","En cours","Saisie externe","Travail non terminé","Clôturé","En cours"];
const ARCH_TYPES_DIT = ["Sollicitation Portail client","Sollicitation Portail client","Sollicitation mail","Proactivité","Sollicitation Portail client","Proactivité"];
const ARCH_REVENDEURS = ["2IT Solutions","Koesio OUEST","Koesio OCCITANIE","Koesio NORD OUEST","Koesio NETWORKS","Koesio PACA"];
const ARCH_CLIENTS = ["2IT SOLUTION","SERVICES INDUSTRIELS AUT...","SOLANE ET COMPAGNIE","KOESIO NORD OUEST","SDIS 07","SDIS DE LA LOIRE","DEPARTEMENT DE LA SAVOIE","L.C. COUDRE (Franchisé Grou...)","GROUPE MONDIAL TISSUS G...","PASSION GRANIT",""];
const ARCH_CODES_ARTIS = ["","AK0354","065611","016106","010933","047485","020913","060309","043822","1409",""];
const ARCH_SITES = ["2IT Solution","SERVICES INDUSTRIELS AUT...","SOLANE ET COMPAGNIE","KOESIO NORD OUEST","SATILLIEU","SDIS42 - LE CHAMBON FEUGE...","Plateforme Logistique LA RAV...","L.C. COUDRE (Franchisé Grou...)","GROUPE MONDIAL TISSUS G...","PASSION GRANIT",""];

const TICKETS_ARCHIVES = Array.from({ length: 100 }).map((_, i) => ({
  numero: `${13087213 - i * 7}`,
  dateCreation: `${pad(1+(i%28))}/0${1+(i%3)}/2025 - ${pad(8+(i*3)%16)}:${pad(i*4%60)}:00`,
  symptome: ARCH_SYMPTOMES[i % ARCH_SYMPTOMES.length],
  etat: ARCH_ETATS[i % ARCH_ETATS.length],
  revendeur: ARCH_REVENDEURS[i % ARCH_REVENDEURS.length],
  client: CLIENT_NAMES[i % CLIENT_NAMES.length],
  codeArtis: ARCH_CODES_ARTIS[i % ARCH_CODES_ARTIS.length],
  site: CLIENT_SITE_MAP[CLIENT_NAMES[i % CLIENT_NAMES.length]],
  typeDIT: ARCH_TYPES_DIT[i % ARCH_TYPES_DIT.length],
}));

// ──────────────────────────────────────────────────────────────────
// ELIGIBILITÉ
// ──────────────────────────────────────────────────────────────────
const ELIGIBILITY_RESULTS = [
  { tech: "Fibre FTTH",   operateur: "Orange",   debitMax: "1 Gb/s",  delai: "10-15 j",  prixIndic: "59,00 €",  eligible: true },
  { tech: "Fibre FTTH",   operateur: "SFR",      debitMax: "2 Gb/s",  delai: "12 j",     prixIndic: "62,00 €",  eligible: true },
  { tech: "Fibre FTTO",   operateur: "Koesio",   debitMax: "1 Gb/s SLA", delai: "30-45 j", prixIndic: "189,00 €", eligible: true },
  { tech: "SDSL",         operateur: "Orange",   debitMax: "8 Mb/s",  delai: "21 j",     prixIndic: "129,00 €", eligible: true },
  { tech: "ADSL",         operateur: "—",        debitMax: "12 Mb/s", delai: "—",        prixIndic: "—",         eligible: false },
  { tech: "4G FWA",       operateur: "Bouygues", debitMax: "200 Mb/s",delai: "5 j",      prixIndic: "49,00 €",  eligible: true },
  { tech: "5G FWA",       operateur: "Orange",   debitMax: "1 Gb/s",  delai: "7 j",      prixIndic: "69,00 €",  eligible: true },
];

Object.assign(window, {
  USERS, LOGS, SAMPLE_PAYLOAD, SAMPLE_RESPONSE,
  REVENDEURS, CLIENTS, SITES, SERVICES, CATALOGUE,
  SUBSCRIBERS, MOBILE_ORDERS,
  ACCESS_LINKS, ACCESS_ORDERS,
  VOICE_SPACES, TRUNK_SIP, TRUNK_ORDERS, PORTABILITES, NUMBERS,
  ORDERS, REPORTING_KPIS, REPORTING_LOGS,
  TICKETS, TICKETS_ARCHIVES, EQUIPMENTS,
  CONFIGURATIONS,
  ELIGIBILITY_RESULTS,
  STATUTS_HTTP,
  CLIENT_SITE_MAP,
});
