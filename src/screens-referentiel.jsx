// Screens — Référentiel (revendeurs, clients, sites, services, catalogues)

const { useMemo: useMemoRf } = React;

function ReferentielScreen({ initialSub = "revendeurs", onOpenDetail }) {
  return (
    <>
      <PageHead
        icon="menu_book"
        title={refTitle(initialSub)}
        subtitle={refSubtitle(initialSub)}
      />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "revendeurs" && <RevendeursTab onOpenDetail={onOpenDetail} />}
        {initialSub === "clients" && <ClientsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "sites" && <SitesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "hebergements" && <HebergementsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "services" && <ServicesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "catalogues" && <CataloguesTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

function refTitle(sub) {
  const map = {
    revendeurs: "Revendeurs",
    clients:    "Clients",
    sites:         "Sites",
    hebergements:  "Hébergements",
    services:      "Services",
    catalogues: "Catalogue",
  };
  return map[sub] || "Référentiel";
}

function refSubtitle(sub) {
  const map = {
    revendeurs: "Consultez la liste des revendeurs et leur activité.",
    clients:    "Consultez et gérez vos clients.",
    sites:        "Consultez toutes les informations liées aux sites clients.",
    hebergements: "Consultez et gérez les hébergements associés aux sites.",
    services:     "Consultez la liste des services actifs.",
    catalogues: "Consultez et gérez les articles du catalogue.",
  };
  return map[sub] || "";
}

// ────────────────────────────────────────────────────────────────
function RevendeursTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [page, setPage] = React.useState(1);

  const revFieldMap = { "Revendeur": "nom", "Code région": "codeRegion", "Email": "email" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    const key = revFieldMap[sortBy || "Revendeur"];
    if (!key) return REVENDEURS;
    return [...REVENDEURS].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Revendeur", "Code région", "Email"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Recherche par nom, SIREN, ville…" width={360} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="asc">Revendeur</SortHeader></th>
              <th>Code région</th>
              <th>Code Telesoft</th>
              <th>Email</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(r => (
              <tr key={r.code} className="is-clickable" onClick={() => onOpenDetail({ kind: "revendeur", data: r })}>
                <td style={{ fontWeight: 600 }}>{r.nom}</td>
                <td className="muted">{r.codeRegion}</td>
                <td className="mono muted">{r.codeTelesoft}</td>
                <td className="muted">{r.email}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function ClientsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [revendeurFilter, setRevendeurFilter] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const clientFieldMap = { "Client": "nom", "Code Artis": "codeArtis", "SIREN": "siren", "Revendeur": "revendeur", "Date de création": "dateCreation" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    let data = CLIENTS;
    if (revendeurFilter) data = data.filter(c => c.revendeur === revendeurFilter);
    const key = clientFieldMap[sortBy || "Client"];
    if (!key) return data;
    const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    return [...data].sort((a, b) => {
      const isDateField = ["dateCreation"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Ajouter un client</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Client", "Code Artis", "SIREN", "Revendeur", "Date de création"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Recherche par raison sociale, SIRET…" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={200} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="asc">Client</SortHeader></th>
              <th>Code Artis</th>
              <th>Codes Artis secondaires</th>
              <th>SIREN</th>
              <th>Revendeur</th>
              <th>Date de création</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(c => (
              <tr key={c.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "client", data: c })}>
                <td style={{ fontWeight: 600 }}>{c.nom}</td>
                <td className="mono muted">{c.codeArtis}</td>
                <td className="mono muted">{c.codesArtisSecondaires || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td className="mono muted">{c.siren}</td>
                <td className="muted">{c.revendeur}</td>
                <td className="muted">{c.dateCreation}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function SitesTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [revendeurFilter, setRevendeurFilter] = React.useState(null);
  const [clientFilter, setClientFilter] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const siteFieldMap = { "Site": "label", "SIRET": "siret", "Ville": "ville", "Code postal": "cp", "Revendeur": "revendeur", "Client": "client" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    let data = SITES;
    if (revendeurFilter) data = data.filter(s => s.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(s => s.client === clientFilter);
    const key = siteFieldMap[sortBy || "Site"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, clientFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer un site</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Site", "SIRET", "Ville", "Code postal", "Revendeur", "Client"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher sur Site, SIRET, Ville ou Code postal" width={360} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={200} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={200} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Site</SortHeader></th>
              <th>SIRET</th>
              <th>Ville</th>
              <th>Code Postal</th>
              <th>Adresse</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(s => (
              <tr key={s.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "site", data: s })}>
                <td className="mono muted">{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.label}</td>
                <td className="mono muted">{s.siret}</td>
                <td>{s.ville}</td>
                <td className="mono muted">{s.cp}</td>
                <td className="muted">{s.adresse}</td>
                <td className="muted">{s.revendeur}</td>
                <td className="muted">{s.client}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function HebergementsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [revendeurFilter, setRevendeurFilter] = React.useState(null);
  const [clientFilter, setClientFilter] = React.useState(null);
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const HEB_OPTIONS = ["Loadbalancing Apache [VM000000000283__057069]","3CX [VM000000000465__063026]","3CX [PX000000001086__101029]","3CX [VM000000001205__066339]","3CX [PX000000003526__J10022]","3CX [PX000000003641__NM300256]","3CX [PX000000003644__NM300256]","3CX 16AS [PX000000000745__901457]","SRV-RDS4 [VM000000000039__006669]","VDOM [VDOM0000000141__046376]","VDOM [VDOM0000000303__102191]","VDOM [VDOM0000001087__101029]","VDOM [VDOM0000003642__NM300256]","VDOM [VDOM0000003645__NM300256]","VDOM [VDOM0000003734__032605_8]","VDOM [VDOM0000003940__KNO444]","VLAN Client 3CX [LAN00000000302__102191]","VLAN Client DC [LAN00000000139__046376]","VLAN Client DC [LAN00000000157__035414]","VLAN Client DC [LAN00000000282__057069]","VLAN Client DC [LAN00000001085__101029]","VLAN Client DC [LAN00000003640__NM300256]","VLAN Client DC [LAN00000003643__NM300256]","VLAN Client DC [LAN00000003938__KNO444]","VM-01 [VM000000000140__046376]","site internet [VM000000003939__KNO444]","100 POUR CENT NOUS - 3CX [VM000000000110__057846]","1NCENTIVA - VDOM [VDOM0000001283__066459]","22.1 CONSULTING - EVA1 [VM000000000614__045703]","22.1 CONSULTING - PFSENSE [VM000000000107__045703]","22.1 CONSULTING - SRVAPP [VM000000000597__045703]","22.1 CONSULTING - SRVDC [VM000000000615__045703]","22.1 CONSULTING - SRVRDS01 [VM000000000617__045703]","22.1 CONSULTING - SRVRDS02 [VM000000000616__045703]","22.1 CONSULTING - SRVRDS03 [VM000000001465__05006409]","22.1 CONSULTING - VLAN Client DC [LAN00000000107__045703]","2M ASSOCIES - 3CX [PX000000001255__902045]","2MG - VDOM [VDOM0000001058__14999000]","4S - VDOM [VDOM0000000056__058902]","72-74 RUE ROYALE - 3CX [PX000000003629__1004846]","98 DELMAS - 3CX [PX000000001044__55036378]","98 DELMAS - VLAN Client DC [LAN00000001043__55036378]","A D A P E I - AVAYA HEBERGEE [VM000000003704__020707]","A D A P E I - HEBERGEMENT FIREWALL [VM000000003547__020707]","A I S M T 04 - 3cx [VM000000000289__14997148]","A VOTRE SERVICE - 3CX [PX000000003910__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003911__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003922__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003924__CPO20023]","AAD 07 - Colocation Client DC [COL00000001181__011496]"];
  const HEB_REF_TECH = {
    "VM000000000465__063026": "vm-1839767",
    "PX000000001086__101029": "PX-125",
    "VM000000001205__066339": "vm-571320",
    "PX000000003526__J10022": "PX-268",
    "PX000000000745__901457": "vm-450422",
    "VM000000000039__006669": "vm-326952",
    "VM000000000110__057846": "vm-1697596",
    "VM000000000614__045703": "vm-55107",
    "VM000000000107__045703": "vm-458870",
    "VM000000000597__045703": "vm-56786",
    "VM000000000615__045703": "vm-56785",
    "VM000000000617__045703": "vm-43042",
    "VM000000000616__045703": "vm-43041",
    "VM000000001465__05006409": "vm-252568",
    "PX000000001255__902045": "PX-207",
    "PX000000003629__1004846": "PX-294",
    "PX000000001044__55036378": "px-116",
    "VM000000003704__020707": "vm-717882",
    "VM000000003547__020707": "vm-23279",
  };
  const HEBERGEMENTS = HEB_OPTIONS.map((opt, i) => {
    const match = opt.match(/^(.+?)\s*\[(.+)\]$/);
    const nom = match ? match[1].trim() : opt;
    const code = match ? match[2].trim() : "";
    const type = code.replace(/[0-9_].*/, "");
    const s = SITES[i % SITES.length];
    return {
      id: `HEB-${String(2000 + i).padStart(5, "0")}`,
      nom,
      code,
      refTechnique: HEB_REF_TECH[code] || "",
      type,
      client: s.client,
      revendeur: s.revendeur,
      statut: s.statut,
    };
  });

  const [page, setPage] = React.useState(1);
  const hebFieldMap = { "Nom": "nom", "Code": "code", "Réf. Technique": "refTechnique", "Type": "type", "Client": "client", "Revendeur": "revendeur" };
  const sortedHeb = React.useMemo(() => {
    let data = HEBERGEMENTS;
    if (revendeurFilter) data = data.filter(h => h.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(h => h.client === clientFilter);
    const key = hebFieldMap[sortBy || "Nom"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, clientFilter, sortBy, sortDir, HEBERGEMENTS]);
  const totalPages = Math.max(1, Math.ceil(sortedHeb.length / 15));

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Nom", "Code", "Réf. Technique", "Type", "Client", "Revendeur"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher par nom, Client, Code ou Réf. technique" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={170} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="asc">Nom</SortHeader></th>
              <th>Code</th>
              <th>Réf. Technique</th>
              <th>Type</th>
              <th>Client</th>
              <th>Revendeur</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedHeb.slice((page - 1) * 15, page * 15).map(h => (
              <tr key={h.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "hebergement", data: h })}>
                <td style={{ fontWeight: 600 }}>{h.nom}</td>
                <td className="mono muted">{h.code}</td>
                <td className="mono muted">{h.refTechnique}</td>
                <td className="muted">{h.type}</td>
                <td className="muted">{h.client}</td>
                <td className="muted">{h.revendeur}</td>
                <td>{h.statut.label === "Actif"
                  ? <Tooltip text="Actif"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>
                  : <Tooltip text="Inactif"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>}
                </td>
                <td><Tooltip text="Consulter les services" placement="top-end"><IconButton icon="list-alt" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sortedHeb.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function ServicesTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [statutFilter, setStatutFilter] = React.useState([]);
  const [revendeurFilter, setRevendeurFilter] = React.useState(null);
  const [clientFilter, setClientFilter] = React.useState(null);
  const [siteFilter, setSiteFilter] = React.useState(null);
  const [hebFilter, setHebFilter] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const serviceFieldMap = { "Service": "type", "Quantité": "quantite", "Matricule": "matricule", "Revendeur": "revendeur", "Client": "client", "Site": "site", "Statut": "statut.label", "Date facturation": "dateFacturation", "Fin d'engagement": "finEngagement" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    let data = SERVICES;
    if (revendeurFilter) data = data.filter(s => s.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(s => s.client === clientFilter);
    if (siteFilter) data = data.filter(s => s.site === siteFilter);
    if (statutFilter && statutFilter.length) data = data.filter(s => s.statut && statutFilter.includes(s.statut.label));
    const key = serviceFieldMap[sortBy || "Service"];
    if (!key) return data;
    if (sortBy === "Quantité") {
      return [...data].sort((a, b) => {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }
    return [...data].sort((a, b) => {
      let va, vb;
      if (key === "statut.label") { va = a.statut ? a.statut.label || "" : ""; vb = b.statut ? b.statut.label || "" : ""; }
      else { va = a[key] || ""; vb = b[key] || ""; }
      // Convertir JJ/MM/AAAA en AAAA/MM/JJ pour tri correct des dates
      const toSortable = (s) => { const p = String(s).split("/"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : String(s); };
      const sa = toSortable(va), sb = toSortable(vb);
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [revendeurFilter, clientFilter, siteFilter, statutFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Service","Quantité","Matricule","Revendeur","Client","Site","Statut","Date facturation","Fin d'engagement"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher sur Service et Matricule" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={170} />
        <RadioDropdown placeholder="Site" options={SITES.map(s => s.label)} value={siteFilter} onChange={setSiteFilter} width={160} />
        <RadioDropdown placeholder="Statut" options={["Actif","Inactif","En cours d'activation (à activer)","En cours d'activation","En cours de désactivation"]} value={statutFilter} onChange={setStatutFilter} width={160} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Hébergement" options={["Loadbalancing Apache [VM000000000283__057069]","3CX [VM000000000465__063026]","3CX [PX000000001086__101029]","3CX [VM000000001205__066339]","3CX [PX000000003526__J10022]","3CX [PX000000003641__NM300256]","3CX [PX000000003644__NM300256]","3CX 16AS [PX000000000745__901457]","SRV-RDS4 [VM000000000039__006669]","VDOM [VDOM0000000141__046376]","VDOM [VDOM0000000303__102191]","VDOM [VDOM0000001087__101029]","VDOM [VDOM0000003642__NM300256]","VDOM [VDOM0000003645__NM300256]","VDOM [VDOM0000003734__032605_8]","VDOM [VDOM0000003940__KNO444]","VLAN Client 3CX [LAN00000000302__102191]","VLAN Client DC [LAN00000000139__046376]","VLAN Client DC [LAN00000000157__035414]","VLAN Client DC [LAN00000000282__057069]","VLAN Client DC [LAN00000001085__101029]","VLAN Client DC [LAN00000003640__NM300256]","VLAN Client DC [LAN00000003643__NM300256]","VLAN Client DC [LAN00000003938__KNO444]","VM-01 [VM000000000140__046376]","site internet [VM000000003939__KNO444]","100 POUR CENT NOUS - 3CX [VM000000000110__057846]","1NCENTIVA - VDOM [VDOM0000001283__066459]","22.1 CONSULTING - EVA1 [VM000000000614__045703]","22.1 CONSULTING - PFSENSE [VM000000000107__045703]","22.1 CONSULTING - SRVAPP [VM000000000597__045703]","22.1 CONSULTING - SRVDC [VM000000000615__045703]","22.1 CONSULTING - SRVRDS01 [VM000000000617__045703]","22.1 CONSULTING - SRVRDS02 [VM000000000616__045703]","22.1 CONSULTING - SRVRDS03 [VM000000001465__05006409]","22.1 CONSULTING - VLAN Client DC [LAN00000000107__045703]","2M ASSOCIES - 3CX [PX000000001255__902045]","2MG - VDOM [VDOM0000001058__14999000]","4S - VDOM [VDOM0000000056__058902]","72-74 RUE ROYALE - 3CX [PX000000003629__1004846]","98 DELMAS - 3CX [PX000000001044__55036378]","98 DELMAS - VLAN Client DC [LAN00000001043__55036378]","A D A P E I - AVAYA HEBERGEE [VM000000003704__020707]","A D A P E I - HEBERGEMENT FIREWALL [VM000000003547__020707]","A I S M T 04 - 3cx [VM000000000289__14997148]","A VOTRE SERVICE - 3CX [PX000000003910__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003911__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003922__CPO20023]","A VOTRE SERVICE - 3CX [PX000000003924__CPO20023]","AAD 07 - Colocation Client DC [COL00000001181__011496]"]} value={hebFilter} onChange={setHebFilter} width={170} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="asc">Service</SortHeader></th>
              <th>Quantité</th>
              <th>Matricule</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Site</th>
              <th>Statut</th>
              <th>Date facturation</th>
              <th>Fin d'engagement</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(s => (
              <tr key={s.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "service", data: s })}>
                <td style={{ fontWeight: 600 }}>{s.type}</td>
                <td className="muted">{s.quantite}</td>
                <td className="mono muted">{s.matricule}</td>
                <td className="muted">{s.revendeur}</td>
                <td className="muted">{s.client}</td>
                <td className="muted">{s.site}</td>
                <td>{{
                  "Actif":                             <Tooltip text="Actif"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Inactif":                           <Tooltip text="Inactif"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>,
                  "En cours d'activation (à activer)": <Tooltip text="En cours d'activation (à activer)"><Icon name="hourglass_empty" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                  "En cours d'activation":             <Tooltip text="En cours d'activation"><Icon name="hourglass_full" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "En cours de désactivation":         <Tooltip text="En cours de désactivation"><Icon name="power_off" size={18} style={{ color: "#9C27B0" }} /></Tooltip>,
                }[s.statut.label]}</td>
                <td className="muted">{s.dateFacturation}</td>
                <td className="muted">{s.finEngagement}</td>
                <td><Tooltip text="Ouvrir un ticket" placement="top-end"><IconButton icon="ticket" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function CataloguesTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState("asc");
  const [familleFilter, setFamilleFilter] = React.useState(null);
  const [sousFamilleFilter, setSousFamilleFilter] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const catFieldMap = { "Libellé": "designation" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    let data = CATALOGUE;
    if (familleFilter) data = data.filter(c => c.famille === familleFilter);
    if (sousFamilleFilter) data = data.filter(c => c.sousFamille === sousFamilleFilter);
    const key = catFieldMap[sortBy || "Libellé"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, familleFilter, sousFamilleFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Libellé"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher par famille, sous-famille, libellé, Réf." width={360} />
        <RadioDropdown placeholder="Famille" options={["Centrex","Cinet","Colocation","Connectivité","Cvoice","Cvpn","Détail matériel centrex","Hébergement","Lien ADSL","Lien FON","Lien FTTE","Lien FTTH","Lien FTTO","Lien SDSL","Mobile","Option centrex","Option Cinet","Option Cvoice","Option lien","Option routeur","Option VM","Parefeu","Passerelle","Portabilité","Routeur","SDA IP","SDA RNIS","Service VOIP","Services SAAS","Stochage","VGA","VM"]} value={familleFilter} onChange={setFamilleFilter} width={160} />
        <RadioDropdown placeholder="Sous-famille" options={["ADSL Orange","Centrex Enove","Centrex Enreah","Centrex Unyc","Cinet","Colocation","Connectivité","CROSS-CONNECT","Cvpn","Détail matériel centrex","FON Koesio","FORTIGATE","FTTE Axione","FTTE Covage","FTTE Orange LAN","FTTE Orange O2E","FTTE SIEA","FTTH Axione","FTTH Bouygues","FTTH Covage","FTTH Orange","FTTH SFR","FTTH SIEA","FTTO Axione","FTTO Bouygues","FTTO Covage","FTTO IELO","FTTO Koesio","FTTO Orange C2E","FTTO Orange CELAN","FTTO SFR","Hébergement","Mobile Koesio","Option Centrex Enove","Option Centrex Enreach","Option Centrex Unyc","Option Cvoice","Option lien","Option routeur","Option VM","Passerelle","Portabilité Alphalink","Portabilité Koesio","Portabilité Unyc","Routeur","SDA IP","SDA RNIS","SDSL Orange C2E","SDSL Orange CELAN","Service VOIP","Services SAAS","Stockage","Trunk SIP Alphlink","Trunk SIP Cvoice","VDOM FORTINET","VGA Sewan","VL PROXMOX","VM VMWARE"]} value={sousFamilleFilter} onChange={setSousFamilleFilter} width={180} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th><SortHeader active dir="asc">Libellé</SortHeader></th>
              <th>Famille</th>
              <th>Sous-famille</th>
              <th>Fournisseur</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Prix d'achat</th>
              <th style={{ textAlign: "right" }}>Prix public</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(c => (
              <tr key={c.ref} className="is-clickable" onClick={() => onOpenDetail({ kind: "catalogue", data: c })}>
                <td className="mono muted">{c.ref}</td>
                <td style={{ fontWeight: 600 }}>{c.designation}</td>
                <td>{c.famille}</td>
                <td className="muted">{c.sousFamille}</td>
                <td className="muted">{c.fournisseur}</td>
                <td className="muted">{c.type}</td>
                <td style={{ textAlign: "right" }} className="muted">{c.prixAchat}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{c.prixPublic}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function FILIALES_OPTS() {
  return ["Koesio Aquitaine","Koesio Île-de-France","Koesio Bretagne","Koesio Rhône-Alpes","Koesio Méditerranée","Koesio Grand Est","Koesio Pays de la Loire","Koesio Hauts-de-France"];
}

// ════════════════════════════════════════════════════════════════
// GENERIC DETAIL DRAWER (used across all tables that don't have a custom one)
// ════════════════════════════════════════════════════════════════
function GenericDetailDrawer({ payload, onClose }) {
  const { kind, data } = payload;

  if (kind === "revendeur") return <RevendeurDrawer r={data} onClose={onClose} />;
  if (kind === "client")    return <ClientDrawer c={data} onClose={onClose} />;
  if (kind === "site")      return <SiteDrawer s={data} onClose={onClose} />;
  if (kind === "service")   return <ServiceDrawer s={data} onClose={onClose} />;
  if (kind === "catalogue") return <CatalogueDrawer c={data} onClose={onClose} />;
  if (kind === "subscriber")return <SubscriberDrawer s={data} onClose={onClose} />;
  if (kind === "mob-order") return <OrderDrawer o={data} title="Commande mobile data" onClose={onClose} />;
  if (kind === "access")    return <AccessDrawer l={data} onClose={onClose} />;
  if (kind === "access-order")return <OrderDrawer o={data} title="Commande lien d'accès" onClose={onClose} />;
  if (kind === "voice-space")return <VoiceSpaceDrawer v={data} onClose={onClose} />;
  if (kind === "trunk")     return <TrunkDrawer t={data} onClose={onClose} />;
  if (kind === "trunk-order")return <OrderDrawer o={data} title="Commande Trunk SIP" onClose={onClose} />;
  if (kind === "portabilite")return <PortabiliteDrawer p={data} onClose={onClose} />;
  if (kind === "number")    return <NumberDrawer n={data} onClose={onClose} />;
  if (kind === "order")     return <OrderDrawer o={data} title="Commande" onClose={onClose} />;
  if (kind === "ticket")    return <TicketDrawer t={data} onClose={onClose} />;
  if (kind === "equipment") return <EquipmentDrawer e={data} onClose={onClose} />;
  return null;
}

function RevendeurDrawer({ r, onClose }) {
  return (
    <Drawer title={r.nom} subtitle={r.code + " · " + r.filiale} onClose={onClose}
      footer={<>
        <Button variant="tertiary" onClick={onClose}>Fermer</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Informations">
        <DetailRow label="Code"><span className="kap-mono">{r.code}</span></DetailRow>
        <DetailRow label="Raison sociale">{r.nom}</DetailRow>
        <DetailRow label="SIREN"><span className="kap-mono">{r.siren}</span></DetailRow>
        <DetailRow label="Filiale">{r.filiale}</DetailRow>
        <DetailRow label="Ville">{r.ville}</DetailRow>
        <DetailRow label="Commercial">{r.commercial}</DetailRow>
      </DetailSection>
      <DetailSection title="Activité">
        <DetailRow label="Contrats actifs"><strong>{r.contrats}</strong></DetailRow>
        <DetailRow label="CA annualisé"><strong>{Math.round(r.contrats * 1800).toLocaleString("fr-FR")} € HT</strong></DetailRow>
        <DetailRow label="Renouvellement">12 mois</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function ClientDrawer({ c, onClose }) {
  return (
    <Drawer title={c.nom} subtitle={c.id + " · " + c.ville} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="external-link">Ouvrir la fiche</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Informations">
        <DetailRow label="ID Kapitano"><span className="kap-mono">{c.id}</span></DetailRow>
        <DetailRow label="Raison sociale">{c.nom}</DetailRow>
        <DetailRow label="SIRET"><span className="kap-mono">{c.siret}</span></DetailRow>
        <DetailRow label="Revendeur">{c.revendeur}</DetailRow>
        <DetailRow label="Ville">{c.ville}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={c.statut.color} label={c.statut.label} /></DetailRow>
        <DetailRow label="Créé le">{c.dateCreation}</DetailRow>
      </DetailSection>
      <DetailSection title="Périmètre">
        <DetailRow label="Sites"><strong>{c.sites}</strong></DetailRow>
        <DetailRow label="Services actifs"><strong>{c.services}</strong></DetailRow>
        <DetailRow label="Tickets ouverts">2</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function SiteDrawer({ s, onClose }) {
  return (
    <Drawer title={s.label} subtitle={s.client} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="ticket">Créer un ticket</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Localisation">
        <DetailRow label="ID"><span className="kap-mono">{s.id}</span></DetailRow>
        <DetailRow label="Libellé">{s.label}</DetailRow>
        <DetailRow label="Adresse">{s.adresse}</DetailRow>
        <DetailRow label="Code postal"><span className="kap-mono">{s.cp}</span></DetailRow>
        <DetailRow label="Ville">{s.ville}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={s.statut.color} label={s.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Exploitation">
        <DetailRow label="Services">{s.services}</DetailRow>
        <DetailRow label="Technicien référent">{s.technicien}</DetailRow>
        <DetailRow label="Client">{s.client}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function ServiceDrawer({ s, onClose }) {
  return (
    <Drawer title={s.type} subtitle={s.reference} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="ticket">Créer un ticket</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Service">
        <DetailRow label="ID"><span className="kap-mono">{s.id}</span></DetailRow>
        <DetailRow label="Type">{s.type}</DetailRow>
        <DetailRow label="Référence"><span className="kap-mono">{s.reference}</span></DetailRow>
        <DetailRow label="Débit"><strong>{s.debit}</strong></DetailRow>
        <DetailRow label="Activation">{s.dateActivation}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={s.statut.color} label={s.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Affectation">
        <DetailRow label="Client">{s.client}</DetailRow>
        <DetailRow label="Site">{s.site}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function CatalogueDrawer({ c, onClose }) {
  return (
    <Drawer title={c.designation} subtitle={c.ref} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="copy">Dupliquer</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Article">
        <DetailRow label="Référence"><span className="kap-mono">{c.ref}</span></DetailRow>
        <DetailRow label="Désignation">{c.designation}</DetailRow>
        <DetailRow label="Famille">{c.famille}</DetailRow>
        <DetailRow label="Sous-famille">{c.sousFamille}</DetailRow>
        <DetailRow label="Prix HT"><strong>{c.prix}</strong></DetailRow>
        <DetailRow label="Engagement">{c.duree}</DetailRow>
        <DetailRow label="Disponibilité">{c.actif
          ? <span className="kap-pill kap-pill--soft" style={{ "--bg": "#E6F2E7", "--fg": "var(--kap-success)" }}>Actif</span>
          : <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F2F2F2", "--fg": "var(--kap-fg-3)" }}>Inactif</span>}
        </DetailRow>
      </DetailSection>
    </Drawer>
  );
}

Object.assign(window, { ReferentielScreen, GenericDetailDrawer });
