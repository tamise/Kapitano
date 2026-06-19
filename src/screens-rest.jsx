// Screens — Commandes, Technique, Eligibilité, Profil

const { useState: useStateCt } = React;

// ════════════════════════════════════════════════════════════════
// COMMANDES — Suivi + Reporting
// ════════════════════════════════════════════════════════════════
function CommandesScreen({ initialSub = "suivi", onOpenDetail }) {
  const isReporting = initialSub === "reporting";
  return (
    <>
      <PageHead
        icon="receipt_long"
        title={isReporting ? "Reporting commandes" : "Suivi de commandes"}
        subtitle={isReporting ? "Accédez aux indicateurs et rapports liés aux commandes." : "Suivez toutes les commandes en cours et passées."}
      />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {!isReporting && <OrdersTab onOpenDetail={onOpenDetail} />}
        {isReporting && <ReportingTab />}
      </div>
    </>
  );
}

function OrdersTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [sourceFilter, setSourceFilter] = useStateCt([]);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);

  const ordersFieldMap = { "Date": "dap", "Numéro d'affaire": "numeroAffaire", "Source": "source", "Revendeur": "revendeur", "Client": "client", "Qté articles": "quantite", "État commande": "etatCommande" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setSourceFilter([]);
    setRevendeurFilter(null);
    setClientFilter(null);
    setEtatFilter([]);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date");
  }

  const sorted = React.useMemo(() => {
    const lc = s => (s || '').toLowerCase();
    let data = ORDERS;
    if (sourceFilter && sourceFilter.length) data = data.filter(o => sourceFilter.some(f => lc(f) === lc(o.source)));
    if (revendeurFilter) data = data.filter(o => lc(o.revendeur) === lc(revendeurFilter));
    if (clientFilter) data = data.filter(o => lc(o.client) === lc(clientFilter));
    if (etatFilter && etatFilter.length) data = data.filter(o => etatFilter.some(f => lc(f) === lc(o.etatCommande)));
    const key = ordersFieldMap[sortBy || "Date"];
    if (!key) return data;
    const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    return [...data].sort((a, b) => {
      if (key === "quantite") {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const isDateField = ["dap"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, sourceFilter, revendeurFilter, clientFilter, etatFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date","Numéro d'affaire","Source","Revendeur","Client","État commande"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par numéro d'affaire ou client" width={360} />
        <RadioDropdown placeholder="Source" options={["Cristal","Hub commandes"]} value={sourceFilter} onChange={setSourceFilter} width={160} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État commande" options={["Créée","Distribution en cours","Envoyée","Reçue par le client","À activer","En cours d'activation","En production","Incident en cours","Annulée"]} value={etatFilter} onChange={setEtatFilter} width={170} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Date")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date")} dir={sortDir}>Date</SortHeader></th>
              <th onClick={() => handleColSort("Numéro d'affaire")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro d'affaire")} dir={sortDir}>N° d'affaire</SortHeader></th>
              <th onClick={() => handleColSort("Source")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Source")} dir={sortDir}>Source</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Qté articles")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Qté articles")} dir={sortDir}>Qté articles</SortHeader></th>
              <th onClick={() => handleColSort("État commande")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État commande")} dir={sortDir}>État commande</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "order", data: o })}>
                <td className="muted">{o.dap}</td>
                <td className="mono" style={{ fontWeight: 600 }}>{o.numeroAffaire}</td>
                <td className="muted">{o.source}</td>
                <td className="muted">{o.revendeur}</td>
                <td>{o.client}</td>
                <td style={{ textAlign: "right" }}>{o.quantite}</td>
                <td className="muted">{o.etatCommande}</td>
                <td><Tooltip text="Détail de la commande" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

const TYPE_PROD_ICON = {
  "abo-mobile":      <Tooltip text="Abonnement mobile"><Icon name="smartphone" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>,
  "abo-mobile-data": <Tooltip text="Abonnement mobile data"><Icon name="sim_card" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>,
  "trunk":           <Tooltip text="Trunk SIP"><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--kap-fg-3)", borderRadius: 4, padding: "0 4px", height: 18, fontSize: 10, fontWeight: 700, fontFamily: "var(--kap-font-ui)", color: "var(--kap-fg-3)", lineHeight: 1, letterSpacing: "0.05em" }}>SIP</span></Tooltip>,
  "centrex":         <Tooltip text="Centrex"><span style={{ fontWeight: 700, fontSize: 16, color: "var(--kap-fg-3)" }}>?</span></Tooltip>,
};

function ReportingTab() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [dateFilter, setDateFilter] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [typeProdFilter, setTypeProdFilter] = useStateCt(null);
  const [typeActionFilter, setTypeActionFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const TOTAL = 4190;
  const perPage = 15;

  const reportingFieldMap = { "Date de l'action": "dateAction", "Numéro d'affaire": "numeroAffaire", "Revendeur": "revendeur", "Client": "client", "Nom de l'utilisateur": "utilisateur", "Téléphone": "telephone", "Nom de l'article": "article", "Quantité": "quantite", "Type de prod.": "typeProd", "Type d'action": "typeAction" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setRevendeurFilter(null);
    setClientFilter(null);
    setTypeProdFilter(null);
    setTypeActionFilter([]);
    setDateFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de l'action")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de l'action");
  }

  const TYPE_PROD_MAP = { "Abonnement mobile": "abo-mobile", "Abonnement mobile data": "abo-mobile-data", "Trunk SIP": "trunk" };
  const sorted = React.useMemo(() => {
    const lc = s => (s || '').toLowerCase();
    let data = REPORTING_LOGS;
    if (revendeurFilter) data = data.filter(r => lc(r.revendeur) === lc(revendeurFilter));
    if (clientFilter) data = data.filter(r => lc(r.client) === lc(clientFilter));
    if (typeProdFilter) { const k = TYPE_PROD_MAP[typeProdFilter]; if (k) data = data.filter(r => r.typeProd === k); }
    if (typeActionFilter && typeActionFilter.length) data = data.filter(r => typeActionFilter.some(f => lc(f) === lc(r.typeAction)));
    if (dateFilter && (dateFilter.debut || dateFilter.fin)) {
      const parseDateNum = (s) => { const parts = String(s).split("/"); if (parts.length < 3) return NaN; const d = parseInt(parts[0],10), m = parseInt(parts[1],10), y = parseInt(parts[2].split(" ")[0],10); if (isNaN(d)||isNaN(m)||isNaN(y)) return NaN; return y*10000+m*100+d; };
      const debNum = dateFilter.debut ? parseDateNum(dateFilter.debut) : NaN;
      const finNum = dateFilter.fin ? parseDateNum(dateFilter.fin) : NaN;
      data = data.filter(r => { const d = parseDateNum(r.dateAction||""); if(isNaN(d)) return true; if(!isNaN(debNum)&&d<debNum) return false; if(!isNaN(finNum)&&d>finNum) return false; return true; });
    }
    const key = reportingFieldMap[sortBy || "Date de l'action"];
    if (!key) return data;
    const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    return [...data].sort((a, b) => {
      if (key === "quantite") { const va = Number(a[key])||0, vb = Number(b[key])||0; return sortDir === "asc" ? va-vb : vb-va; }
      const isDateField = ["dateAction"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, dateFilter, revendeurFilter, clientFilter, typeProdFilter, typeActionFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const view = sorted.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="download">Exporter des données</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de l'action","Numéro d'affaire","Revendeur","Client","Nom de l'article","Quantité"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par numéro d'affaire, client ou article" width={380} />
        <DateRangeDropdown placeholder="Date de l'action" value={dateFilter} onChange={setDateFilter} width={180} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type de production" options={["Abonnement mobile","Abonnement mobile data","Trunk SIP"]} value={typeProdFilter} onChange={setTypeProdFilter} width={180} showSearch={false} />
        <RadioDropdown placeholder="Type d'action" options={["Création","Modification","Résiliation"]} value={typeActionFilter} onChange={setTypeActionFilter} width={160} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Numéro d'affaire")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro d'affaire")} dir={sortDir}>Numéro d'affaire</SortHeader></th>
              <th onClick={() => handleColSort("Date de l'action")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de l'action")} dir={sortDir}>Date de l'action</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Nom de l'utilisateur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nom de l'utilisateur")} dir={sortDir}>Nom de l'utilisateur</SortHeader></th>
              <th onClick={() => handleColSort("Téléphone")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Téléphone")} dir={sortDir}>Téléphone</SortHeader></th>
              <th onClick={() => handleColSort("Nom de l'article")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nom de l'article")} dir={sortDir}>Nom de l'article</SortHeader></th>
              <th onClick={() => handleColSort("Quantité")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Quantité")} dir={sortDir}>Quantité</SortHeader></th>
              <th onClick={() => handleColSort("Type de prod.")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type de prod.")} dir={sortDir}>Type de prod.</SortHeader></th>
              <th onClick={() => handleColSort("Type d'action")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type d'action")} dir={sortDir}>Type d'action</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={i} className="is-clickable">
                <td className="mono muted">{r.numeroAffaire}</td>
                <td className="muted">{r.dateAction}</td>
                <td className="muted">{r.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{r.client}</td>
                <td className="muted">{r.utilisateur}</td>
                <td className="mono muted">{r.telephone}</td>
                <td className="muted" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{r.article}</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{r.quantite}</td>
                <td>{TYPE_PROD_ICON[r.typeProd]}</td>
                <td>{{
                  "Création":    <Tooltip text="Création"><Icon name="add_circle" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Modification":<Tooltip text="Modification"><Icon name="pencil" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "Résiliation": <Tooltip text="Résiliation"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>,
                }[r.typeAction]}</td>
                <td><Tooltip text="Détail de la commande" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={perPage} />
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// TECHNIQUE — Tickets, Configurations, Supervision
// ════════════════════════════════════════════════════════════════
const TECH_TITLES = { tickets: "Tickets", configurations: "Configurations", supervision: "Supervision" };
const TECH_SUBS   = { tickets: "Gérez les tickets de support et les problèmes techniques.", configurations: "Gérez la configuration des équipements réseau.", supervision: "Supervisez les équipements réseau de vos clients." };

function TechniqueScreen({ initialSub = "tickets", onOpenDetail }) {
  return (
    <>
      <PageHead icon="build" title={TECH_TITLES[initialSub] || "Technique"} subtitle={TECH_SUBS[initialSub]} />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "tickets"          && <TicketsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "tickets-archives" && <TicketsArchivesTab />}
        {initialSub === "configurations"   && <ConfigurationsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "supervision"    && <SupervisionTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

const CRITICITE_CHIP = {
  "Bloquant": <span className="kap-pill kap-pill--soft" style={{ "--bg":"#FFEBEE","--fg":"#C62828" }}><Icon name="ban" size={13}/>Bloquant</span>,
  "Critique": <span className="kap-pill kap-pill--soft" style={{ "--bg":"#F5F5F5","--fg":"#616161" }}><Icon name="skull" size={13}/>Critique</span>,
  "Mineur":   <span className="kap-pill kap-pill--soft" style={{ "--bg":"#E1F5FE","--fg":"#0277BD" }}><Icon name="info" size={13}/>Mineur</span>,
  "Majeur":   <span className="kap-pill kap-pill--soft" style={{ "--bg":"#FFF3E0","--fg":"#E65100" }}><Icon name="alert-triangle" size={13}/>Majeur</span>,
};
const NATURE_CHIP = {
  "Incident": <span className="kap-pill kap-pill--soft" style={{ "--bg":"#FFEBEE","--fg":"#C62828" }}><Icon name="alert-triangle" size={13}/>Incident</span>,
  "Demande":  <span className="kap-pill kap-pill--soft" style={{ "--bg":"#E3F2FD","--fg":"#1565C0" }}><Icon name="help-circle" size={13}/>Demande</span>,
};

function TicketsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [criticiteFilter, setCriticiteFilter] = useStateCt([]);
  const [natureFilter, setNatureFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const TOTAL_TKT = 720;

  const ticketFieldMap = { "Date de création": "dateCreation", "Référence": "reference", "Sujet": "sujet", "État": "etat", "Criticité": "criticite", "Nature": "nature", "Origine": "origineAuto", "Revendeur": "revendeur", "Client": "client", "Site": "site" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setRevendeurFilter(null);
    setClientFilter(null);
    setEtatFilter([]);
    setCriticiteFilter([]);
    setNatureFilter([]);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de création")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de création");
  }

  const sorted = React.useMemo(() => {
    const lc = s => (s || '').toLowerCase();
    let data = TICKETS;
    if (revendeurFilter) data = data.filter(t => lc(t.revendeur) === lc(revendeurFilter));
    if (clientFilter) data = data.filter(t => lc(t.client) === lc(clientFilter));
    if (etatFilter && etatFilter.length) data = data.filter(t => etatFilter.some(f => lc(f) === lc(t.etat)));
    if (criticiteFilter && criticiteFilter.length) data = data.filter(t => criticiteFilter.some(f => lc(f) === lc(t.criticite)));
    if (natureFilter && natureFilter.length) data = data.filter(t => natureFilter.some(f => lc(f) === lc(t.nature)));
    const key = ticketFieldMap[sortBy || "Date de création"];
    if (!key) return data;
    const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    return [...data].sort((a, b) => {
      if (key === "origineAuto") {
        const va = a.origineAuto ? 1 : 0; const vb = b.origineAuto ? 1 : 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const isDateField = ["dateCreation"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, clientFilter, etatFilter, criticiteFilter, natureFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  const view = sorted.slice((page - 1) * 15, page * 15);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="plus">Créer un ticket</Button>
      <Button variant="primary" icon="download">Exporter des tickets</Button>
    </>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Référence","Sujet","État","Criticité","Nature"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par Référence, Sujet ou Client" width={380} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État" options={["Nouveau","Pris en compte","Assigné","En cours","En attente d'informations","Résolu","En attente de validation","Clôturé - résolu","Clôturé - non résolu"]} value={etatFilter} onChange={setEtatFilter} width={140} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Criticité" options={["Critique","Bloquant","Majeur","Mineur"]} value={criticiteFilter} onChange={setCriticiteFilter} width={140} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Nature" options={["Incident","Demande","Assistance","Production","Avant-vente","Administratif"]} value={natureFilter} onChange={setNatureFilter} width={130} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Référence")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Référence")} dir={sortDir}>Référence</SortHeader></th>
              <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>
              <th onClick={() => handleColSort("Sujet")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Sujet")} dir={sortDir}>Sujet</SortHeader></th>
              <th onClick={() => handleColSort("État")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État")} dir={sortDir}>État</SortHeader></th>
              <th onClick={() => handleColSort("Criticité")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Criticité")} dir={sortDir}>Criticité</SortHeader></th>
              <th onClick={() => handleColSort("Nature")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nature")} dir={sortDir}>Nature</SortHeader></th>
              <th onClick={() => handleColSort("Origine")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Origine")} dir={sortDir}>Origine</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Site")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Site")} dir={sortDir}>Site</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map(t => (
              <tr key={t.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "ticket", data: t })}>
                <td className="mono muted">{t.reference}</td>
                <td className="muted">{t.dateCreation}</td>
                <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.sujet}</td>
                <td className="muted">{t.etat}</td>
                <td>{CRITICITE_CHIP[t.criticite]}</td>
                <td>{NATURE_CHIP[t.nature]}</td>
                <td>{t.origineAuto
                  ? <Tooltip text="Proactivité"><Icon name="factory" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>
                  : <Tooltip text="Kapitano"><Icon name="user" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>}
                </td>
                <td className="muted">{t.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{t.client}</td>
                <td className="muted">{t.site}</td>
                <td><Tooltip text="Voir le ticket" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

function TicketsArchivesTab() {
  const [activeView, setActiveView] = useStateCt("liste");
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [symptomeFilter, setSymptomeFilter] = useStateCt(null);
  const [typeDITFilter, setTypeDITFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL_ARCH = 7592;

  const ticketsArchFieldMap = { "Date de création": "dateCreation", "Numéro": "numero", "Symptôme": "symptome", "Type DIT": "typeDIT", "État": "etat", "Revendeur": "revendeur", "Client": "client", "Code Artis": "codeArtis", "Site": "site" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setRevendeurFilter(null);
    setClientFilter(null);
    setEtatFilter([]);
    setSymptomeFilter(null);
    setTypeDITFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de création")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de création");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sortedArchives = React.useMemo(() => {
    const lc = s => (s || '').toLowerCase();
    let data = TICKETS_ARCHIVES;
    if (revendeurFilter) data = data.filter(t => lc(t.revendeur) === lc(revendeurFilter));
    if (clientFilter) data = data.filter(t => lc(t.client) === lc(clientFilter));
    if (etatFilter && etatFilter.length) data = data.filter(t => etatFilter.some(f => lc(f) === lc(t.etat)));
    if (symptomeFilter) data = data.filter(t => lc(t.symptome) === lc(symptomeFilter));
    if (typeDITFilter) data = data.filter(t => lc(t.typeDIT) === lc(typeDITFilter));
    const key = ticketsArchFieldMap[sortBy || "Date de création"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["dateCreation"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, revendeurFilter, clientFilter, etatFilter, symptomeFilter, typeDITFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedArchives.length / 15));
  const view = sortedArchives.slice((page - 1) * 15, page * 15);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="download">Exporter des tickets</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Numéro","Symptôme","Type DIT"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par Numéro ou Code Artis" width={340} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État" options={["Saisie externe","En cours","Travail non terminé","Travail terminé","Clôturé","Annulé"]} value={etatFilter} onChange={setEtatFilter} width={130} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Symptôme" options={["LIEN coupure totale","TEL appels entrants","LIEN Configuration Routeur","Autre"]} value={symptomeFilter} onChange={setSymptomeFilter} width={170} showSearch={false} />
        <RadioDropdown placeholder="Type DIT" options={["Sollicitation Portail client","Sollicitation mail","Proactivité","Autre"]} value={typeDITFilter} onChange={setTypeDITFilter} width={160} showSearch={false} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Numéro")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro")} dir={sortDir}>Numéro</SortHeader></th>
              <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>
              <th onClick={() => handleColSort("Symptôme")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Symptôme")} dir={sortDir}>Symptôme</SortHeader></th>
              <th onClick={() => handleColSort("État")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État")} dir={sortDir}>État</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Code Artis")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Code Artis")} dir={sortDir}>Code Artis</SortHeader></th>
              <th onClick={() => handleColSort("Site")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Site")} dir={sortDir}>Site</SortHeader></th>
              <th onClick={() => handleColSort("Type DIT")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type DIT")} dir={sortDir}>Type DIT</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((t, i) => (
              <tr key={i} className="is-clickable">
                <td style={{ fontWeight: 600 }}>{t.numero}</td>
                <td className="muted">{t.dateCreation}</td>
                <td className="muted">{t.symptome || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td className="muted">{t.etat}</td>
                <td className="muted">{t.revendeur}</td>
                <td className="muted">{t.client || "—"}</td>
                <td className="muted">{t.codeArtis || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td className="muted">{t.site || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td className="muted">{t.typeDIT}</td>
                <td><Tooltip text="Voir le ticket" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sortedArchives.length} perPage={15} />
    </>
  );
}

function ConfigurationsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [statutFilter, setStatutFilter] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [siteFilter, setSiteFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL_CFG = 320;

  const cfgFieldMap = { "Date de création": "dateCreation", "Version": "version", "Lien": "lien", "Options": "options", "Numéro de série": "numeroSerie", "Statut": "statut", "Date d'archivage": "dateArchivage", "Revendeur": "revendeur", "Client": "client", "Site": "site", "Service": "service" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setStatutFilter(null);
    setRevendeurFilter(null);
    setClientFilter(null);
    setSiteFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de création")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de création");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sortedCfg = React.useMemo(() => {
    const lc = s => (s || '').toLowerCase();
    let data = CONFIGURATIONS;
    if (statutFilter) data = data.filter(c => lc(c.statut) === lc(statutFilter));
    if (revendeurFilter) data = data.filter(c => lc(c.revendeur) === lc(revendeurFilter));
    if (clientFilter) data = data.filter(c => lc(c.client) === lc(clientFilter));
    if (siteFilter) data = data.filter(c => lc(c.site) === lc(siteFilter));
    const key = cfgFieldMap[sortBy || "Date de création"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["dateCreation","dateArchivage"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, statutFilter, revendeurFilter, clientFilter, siteFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedCfg.length / 15));
  const view = sortedCfg.slice((page - 1) * 15, page * 15);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Nouvelle configuration</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Version","Statut","Date d'archivage","Revendeur","Client","Site","Service"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par N° de série, Revendeur, Client, Site, Se..." width={380} />
        <RadioDropdown placeholder="Statut" options={["Active","Archivée"]} value={statutFilter} onChange={setStatutFilter} width={130} showSearch={false} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Site" options={SITES.map(s => s.label)} value={siteFilter} onChange={setSiteFilter} width={150} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>
              <th onClick={() => handleColSort("Version")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Version")} dir={sortDir}>Version</SortHeader></th>
              <th onClick={() => handleColSort("Lien")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Lien")} dir={sortDir}>Lien</SortHeader></th>
              <th onClick={() => handleColSort("Options")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Options")} dir={sortDir}>Options</SortHeader></th>
              <th onClick={() => handleColSort("Numéro de série")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro de série")} dir={sortDir}>Numéro de série</SortHeader></th>
              <th onClick={() => handleColSort("Statut")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Statut")} dir={sortDir}>Statut</SortHeader></th>
              <th onClick={() => handleColSort("Date d'archivage")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date d'archivage")} dir={sortDir}>Date d'archivage</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Site")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Site")} dir={sortDir}>Site</SortHeader></th>
              <th onClick={() => handleColSort("Service")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Service")} dir={sortDir}>Service</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((c, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">{c.dateCreation}</td>
                <td className="muted">{c.version}</td>
                <td className="muted">{c.lien}</td>
                <td className="muted">{c.options}</td>
                <td className="mono muted">{c.numeroSerie || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td>{c.statut === "Active"
                  ? <Tooltip text="Active"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>
                  : <Tooltip text="Archivée"><Icon name="archive" size={18} style={{ color: "#ED6C02" }} /></Tooltip>}
                </td>
                <td className="muted">{c.dateArchivage || <span style={{ color: "var(--kap-fg-3)" }}>—</span>}</td>
                <td className="muted">{c.revendeur}</td>
                <td className="muted">{c.client}</td>
                <td className="muted">{c.site}</td>
                <td className="muted">{c.service === "—" ? <span style={{ color: "var(--kap-fg-3)" }}>—</span> : c.service}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sortedCfg.length} perPage={15} />
    </>
  );
}

const SUPERV_ETAT_CFG = {
  "En ligne":   { icon: "check-circle-2",  fg: "#2E7D32", bg: "#E8F5E9" },
  "Alerte":     { icon: "alert-triangle",  fg: "#E65100", bg: "#FFF3E0" },
  "Hors ligne": { icon: "x-circle",        fg: "#C62828", bg: "#FFEBEE" },
};

function SupervisionTab({ onOpenDetail }) {
  const [page, setPage] = useStateCt(1);
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");

  const supFieldMap = { "ID": "id", "Équipement": "nom", "Client": "client", "Site": "site", "IP": "ip", "Uptime": "uptime", "État": "etat.label" };

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Équipement")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Équipement");
  }

  const sorted = React.useMemo(() => {
    const key = supFieldMap[sortBy || "Équipement"];
    if (!key) return EQUIPMENTS;
    return [...EQUIPMENTS].sort((a, b) => {
      let va, vb;
      if (key === "etat.label") { va = a.etat ? a.etat.label || "" : ""; vb = b.etat ? b.etat.label || "" : ""; }
      else { va = a[key] || ""; vb = b[key] || ""; }
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  const KPIS_SUP = [
    { label: "Équipements supervisés", value: "1 247", trend: "+18", up: true, desc: "ce mois" },
    { label: "Taux de disponibilité",  value: "99,6 %", trend: "+0,2 pt", up: true, desc: "SLA 99,5 %" },
    { label: "Alertes ouvertes",       value: "23",     trend: "+5",  up: false,desc: "dont 4 critiques" },
    { label: "Incidents (24 h)",       value: "8",      trend: "–2",  up: true, desc: "vs. veille" },
  ];
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18, background: "#FAFBFD" }}>
      <div className="kap-kpi-grid">
        {KPIS_SUP.map(k => <Kpi key={k.label} {...k} />)}
      </div>
      <div className="kap-card">
        <div style={{ display: "flex", padding: "14px 20px", borderBottom: "1px solid var(--kap-divider)", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, flex: 1 }}>État des équipements</div>
          <ChipRow chips={[{ key: "all", label: "Tous" }, { key: "alert", label: "Alertes" }, { key: "off", label: "Hors ligne" }]} active="all" onChange={() => {}} />
        </div>
        <TableBox>
          <table className="kap-table">
            <thead>
              <tr>
                <th onClick={() => handleColSort("ID")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("ID")} dir={sortDir}>ID</SortHeader></th>
                <th onClick={() => handleColSort("Équipement")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Équipement")} dir={sortDir}>Équipement</SortHeader></th>
                <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
                <th onClick={() => handleColSort("Site")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Site")} dir={sortDir}>Site</SortHeader></th>
                <th onClick={() => handleColSort("IP")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("IP")} dir={sortDir}>IP</SortHeader></th>
                <th onClick={() => handleColSort("Uptime")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Uptime")} dir={sortDir}>Uptime</SortHeader></th>
                <th onClick={() => handleColSort("État")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État")} dir={sortDir}>État</SortHeader></th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice((page - 1) * 15, page * 15).map(e => (
                <tr key={e.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "equipment", data: e })}>
                  <td className="mono">{e.id}</td>
                  <td style={{ fontWeight: 600 }}>{e.nom}</td>
                  <td className="muted">{e.client}</td>
                  <td className="muted">{e.site}</td>
                  <td className="mono">{e.ip}</td>
                  <td className="mono">{e.uptime}</td>
                  <td>{(() => { const cfg = SUPERV_ETAT_CFG[e.etat.label] || { icon: "circle", fg: "#616161", bg: "#F5F5F5" }; return <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px 2px 6px", borderRadius:9999, background:cfg.bg, color:cfg.fg, fontSize:11, fontFamily:"var(--kap-font-display)", fontWeight:600, lineHeight:1.6 }}><Icon name={cfg.icon} size={12} style={{ color:cfg.fg }} />{e.etat.label}</span>; })()}</td>
                  <td><IconButton icon="more-vertical" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
      </div>
    </div>
  );
}

function TicketDrawer({ t, onClose }) {
  return (
    <Drawer title={t.sujet} subtitle={`${t.id} · ${t.client}`} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="user-plus">Réaffecter</Button>
        <Button variant="primary" icon="check">Résoudre</Button>
      </>}>
      <DetailSection title="Ticket">
        <DetailRow label="ID"><span className="kap-mono">{t.id}</span></DetailRow>
        <DetailRow label="Sujet"><strong>{t.sujet}</strong></DetailRow>
        <DetailRow label="Client">{t.client}</DetailRow>
        <DetailRow label="Sévérité"><DotStatus color={t.severiteColor} label={t.severite} /></DetailRow>
        <DetailRow label="Affecté à">{t.affecte}</DetailRow>
        <DetailRow label="SLA contractuel"><span className="kap-mono">{t.sla}</span></DetailRow>
        <DetailRow label="Statut"><DotStatus color={t.statut.color} label={t.statut.label} /></DetailRow>
        <DetailRow label="Créé le">{t.dateCreation}</DetailRow>
      </DetailSection>
      <DetailSection title="Description">
        <div style={{ padding: 16, fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-1)", lineHeight: 1.6 }}>
          Le client signale une coupure totale de service depuis ce matin 08:42. Tous les postes IP sont en perte de registration SIP.
          Un redémarrage de l'IPBX et du routeur a été effectué côté client sans succès. Demande d'intervention prioritaire.
        </div>
      </DetailSection>
      <DetailSection title="Historique">
        <DetailRow label="13/11 14:22">Ticket créé par Mme Caron</DetailRow>
        <DetailRow label="13/11 14:38">Affecté à M. Lambert (Support N2)</DetailRow>
        <DetailRow label="13/11 15:10">Diagnostic distant en cours…</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function EquipmentDrawer({ e, onClose }) {
  return (
    <Drawer title={e.nom} subtitle={`${e.client} · ${e.site}`} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="terminal">Ouvrir CLI</Button>
        <Button variant="primary" icon="refresh-cw">Redémarrer</Button>
      </>}>
      <DetailSection title="Équipement">
        <DetailRow label="ID"><span className="kap-mono">{e.id}</span></DetailRow>
        <DetailRow label="Nom">{e.nom}</DetailRow>
        <DetailRow label="Client">{e.client}</DetailRow>
        <DetailRow label="Site">{e.site}</DetailRow>
        <DetailRow label="Adresse IP"><span className="kap-mono">{e.ip}</span></DetailRow>
        <DetailRow label="Firmware"><span className="kap-mono">{e.firmware}</span></DetailRow>
        <DetailRow label="État"><DotStatus color={e.etat.color} label={e.etat.label} /></DetailRow>
        <DetailRow label="Uptime"><span className="kap-mono">{e.uptime}</span></DetailRow>
      </DetailSection>
    </Drawer>
  );
}

// ════════════════════════════════════════════════════════════════
// ELIGIBILITÉ
// ════════════════════════════════════════════════════════════════
function EligPlaceholder({ titre }) {
  return (
    <>
      <PageHead icon="map-pin" title={titre} subtitle="Page en cours de construction." />
      <div className="kap-card kap-card--padded" style={{ display:"flex", alignItems:"center", justifyContent:"center", color:"var(--kap-fg-3)", fontFamily:"var(--kap-font-ui)", fontSize:14, padding:48 }}>
        <Icon name="map-pin" size={32} style={{ marginRight:12, opacity:.4 }} />
        Le contenu de cette page sera disponible prochainement.
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉLIGIBILITÉ — DEMANDES
// ════════════════════════════════════════════════════════════════
const DEMANDES_USERS = ["Marie-Gabrielle Jendrian","Alexandre LUIS","Baptiste PFEFFERKORN","Geoffrey LAVIALLE","Isabelle MOREAU","Nicolas DUPONT","Sophie GARNIER"];
const DEMANDES_ADRESSES = ["12 RUE DE BELFORT, 69004 LYON","61 rue Pierre et Marie Curie 87000 Limoges","35 Rue Pasteur 69300 Caluire-et-Cuire","30 Rue Pasteur 69300 Caluire-et-Cuire","53 Avenue des Langories 26000 Valence","22 Boulevard des Brotteaux 69006 Lyon","8 Impasse des Acacias 38000 Grenoble","14 Rue de la Paix 75002 Paris"];
const DEMANDES_TYPES = ["Adresse","Adresse","NDI","Adresse","Code immeuble"];

const DEMANDES = Array.from({ length: 80 }).map((_, i) => {
  const d = new Date(2026, 5, 8 - Math.floor(i/9), 16 - (i % 9) * 0.5);
  const fmt = (n) => String(n).padStart(2,"0");
  const dateStr = (dt) => `${fmt(dt.getDate())}/0${dt.getMonth()+1}/${dt.getFullYear()} - ${fmt(dt.getHours())}:${fmt(dt.getMinutes())}:${fmt(dt.getSeconds())}`;
  const creee = new Date(d.getTime() - i * 3600000);
  const traitee = new Date(creee.getTime() + Math.floor(15 + i % 45) * 1000);
  return {
    id: i + 1,
    utilisateur: DEMANDES_USERS[i % DEMANDES_USERS.length],
    creeLe: dateStr(creee),
    libelle: DEMANDES_ADRESSES[i % DEMANDES_ADRESSES.length],
    statut: "1/1",
    traiteLe: dateStr(traitee),
    type: DEMANDES_TYPES[i % DEMANDES_TYPES.length],
  };
});

function EligDemandesScreen() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [utilisateurFilter, setUtilisateurFilter] = useStateCt(false);
  const [utilisateurOpen, setUtilisateurOpen] = useStateCt(false);
  const utilisateurRef = React.useRef(null);
  React.useEffect(() => {
    if (!utilisateurOpen) return;
    function h(e) { if (utilisateurRef.current && !utilisateurRef.current.contains(e.target)) setUtilisateurOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [utilisateurOpen]);
  const [dateFilter, setDateFilter] = useStateCt(null);
  const [typeFilter, setTypeFilter] = useStateCt(null);
  const [statutFilter, setStatutFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL = 1553;
  const perPage = 15;

  const eligDemFieldMap = { "Créée le": "creeLe", "Libellé": "libelle", "Statut": "statut", "Traitée le": "traiteLe", "Utilisateur": "utilisateur" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setRevendeurFilter(null);
    setUtilisateurFilter(false);
    setDateFilter(null);
    setTypeFilter(null);
    setStatutFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Créée le")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Créée le");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sortedDemandes = React.useMemo(() => {
    let data = DEMANDES;
    if (revendeurFilter) data = data.filter(d => d.utilisateur === revendeurFilter);
    if (utilisateurFilter) data = data.filter(d => d.utilisateur === "Marie-Gabrielle Jendrian");
    if (typeFilter) data = data.filter(d => d.type === typeFilter);
    if (statutFilter) data = data.filter(d => d.statut === statutFilter);
    if (dateFilter) {
      const pdn = (s) => { const p = String(s).split("/"); if (p.length < 3) return NaN; return parseInt(p[2].split(" ")[0],10)*10000+parseInt(p[1],10)*100+parseInt(p[0],10); };
      const deb = dateFilter.debut ? pdn(dateFilter.debut) : NaN;
      const fin = dateFilter.fin ? pdn(dateFilter.fin) : NaN;
      data = data.filter(d => { const n = pdn(d.creeLe||""); if(isNaN(n)) return true; if(!isNaN(deb)&&n<deb) return false; if(!isNaN(fin)&&n>fin) return false; return true; });
    }
    const key = eligDemFieldMap[sortBy || "Créée le"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["creeLe","traiteLe"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, utilisateurFilter, typeFilter, statutFilter, dateFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedDemandes.length / perPage));
  const view = sortedDemandes.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Demande d'éligibilité en masse</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden" }}>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Créée le","Libellé","Statut","Traitée le"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher un libellé" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <div ref={utilisateurRef} style={{ position:"relative", display:"inline-block" }}
          onMouseEnter={() => setUtilisateurOpen(true)}
          onMouseLeave={() => setUtilisateurOpen(false)}>
          <span className="kap-input-wrap" style={{ cursor:"pointer", userSelect:"none" }} onClick={() => setUtilisateurOpen(o => !o)}>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontFamily:"var(--kap-font-ui)", color:"var(--kap-fg-3)" }}>
              Utilisateur
              {utilisateurFilter && <span style={{ background:"var(--kap-primary)", color:"#fff", borderRadius:99, fontSize:11, fontWeight:700, minWidth:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>1</span>}
            </span>
            <Icon name="chevron-down" size={16} style={{ marginRight:-4 }} />
          </span>
          {utilisateurOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, minWidth:220, background:"#fff", border:"1px solid var(--kap-border-2)", borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:200, padding:"14px 16px" }}>
              <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
                <span>Mes recherches uniquement</span>
                <span onClick={() => setUtilisateurFilter(v => !v)} style={{ display:"inline-block", width:36, height:20, borderRadius:99, background:utilisateurFilter ? "var(--kap-primary)" : "#ccc", cursor:"pointer", position:"relative", transition:"background 200ms", flexShrink:0 }}>
                  <span style={{ position:"absolute", top:2, left:utilisateurFilter ? 18 : 2, width:16, height:16, borderRadius:99, background:"#fff", transition:"left 200ms", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </span>
              </label>
            </div>
          )}
        </div>
        <DateRangeDropdown placeholder="Créée le" value={dateFilter} onChange={setDateFilter} width={150} />
        <RadioDropdown placeholder="Type de demande" options={["Unitaire","En masse"]} value={typeFilter} onChange={setTypeFilter} width={170} showSearch={false} />
        <RadioDropdown placeholder="Statut" options={["Créée","En cours","Terminée","En erreur","Annulée"]} value={statutFilter} onChange={setStatutFilter} width={130} showSearch={false} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Utilisateur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Utilisateur")} dir={sortDir}>Utilisateur</SortHeader></th>
              <th onClick={() => handleColSort("Créée le")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Créée le")} dir={sortDir}>Créée le</SortHeader></th>
              <th onClick={() => handleColSort("Libellé")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Libellé")} dir={sortDir}>Libellé</SortHeader></th>
              <th onClick={() => handleColSort("Statut")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Statut")} dir={sortDir}>Statut</SortHeader></th>
              <th onClick={() => handleColSort("Traitée le")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Traitée le")} dir={sortDir}>Traitée le</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map(d => (
              <tr key={d.id} className="is-clickable">
                <td style={{ fontWeight:500 }}>{d.utilisateur}</td>
                <td className="muted">{d.creeLe}</td>
                <td>{d.libelle}</td>
                <td>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
                    <Icon name="check-circle-2" size={18} style={{ color:"#2E7D32" }} />
                    {d.statut}
                  </span>
                </td>
                <td className="muted">{d.traiteLe}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL} perPage={perPage} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ÉLIGIBILITÉ — ADRESSES
// ════════════════════════════════════════════════════════════════
const ADDR_TYPES = ["NDI","NDI","Code immeuble","Code immeuble","Adresse","GPS"];
const ADDR_DONNEES = ["0472800336","0472800336","IMB/87085/C/06KB","IMB/69034/S/FI51","IMB/69034/C/FI3Q","IMB/26362/C/059T","45.7640,4.8357","0478398676"];
const ADDR_LIBELLES = ["12 RUE DE BELFORT, 69004 LYON","61 rue Pierre et Marie Curie 87000 Limoges","35 Rue Pasteur 69300 Caluire-et-Cuire","30 Rue Pasteur 69300 Caluire-et-Cuire","53 Avenue des Langories 26000 Valence","22 Boulevard des Brotteaux 69006 Lyon"];

const ADRESSES_ELIG = Array.from({ length: 80 }).map((_, i) => {
  const fmt = (n) => String(n).padStart(2,"0");
  const h = 16 - Math.floor(i / 9), m = (i * 7) % 60, s = (i * 13) % 60;
  const day = i < 9 ? 8 : i < 18 ? 8 : 13;
  const month = i < 27 ? "06" : "03";
  const year = 2026;
  const creee = `${fmt(day)}/${month}/${year} - ${fmt(h)}:${fmt(m)}:${fmt(s)}`;
  const testee = `${fmt(day)}/${month}/${year} - ${fmt(h)}:${fmt((m+1)%60)}:${fmt((s+15)%60)}`;
  return {
    id: i + 1,
    utilisateur: DEMANDES_USERS[i % DEMANDES_USERS.length],
    creeLe: creee,
    type: ADDR_TYPES[i % ADDR_TYPES.length],
    donnees: ADDR_DONNEES[i % ADDR_DONNEES.length],
    libelle: ADDR_LIBELLES[i % ADDR_LIBELLES.length],
    testeeLe: testee,
  };
});

function EligAdressesScreen() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [utilisateurFilter2, setUtilisateurFilter2] = useStateCt(false);
  const [utilisateurOpen2, setUtilisateurOpen2] = useStateCt(false);
  const utilisateurRef2 = React.useRef(null);
  React.useEffect(() => {
    if (!utilisateurOpen2) return;
    function h(e) { if (utilisateurRef2.current && !utilisateurRef2.current.contains(e.target)) setUtilisateurOpen2(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [utilisateurOpen2]);
  const [dateFilter, setDateFilter] = useStateCt(null);
  const [typeFilter, setTypeFilter] = useStateCt(null);
  const [statutFilter, setStatutFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL = 1589;
  const perPage = 15;

  const eligAddrFieldMap = { "Créée le": "creeLe", "Type de recherche": "type", "Données de la recherche": "donnees", "Libellé": "libelle", "Statut": "statut", "Testée le": "testeeLe", "Utilisateur": "utilisateur" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setRevendeurFilter(null);
    setUtilisateurFilter2(false);
    setDateFilter(null);
    setTypeFilter(null);
    setStatutFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Créée le")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Créée le");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sortedAdresses = React.useMemo(() => {
    let data = ADRESSES_ELIG;
    if (revendeurFilter) data = data.filter(d => d.revendeur === revendeurFilter);
    if (utilisateurFilter2) data = data.filter(d => d.utilisateur === "Marie-Gabrielle Jendrian");
    if (typeFilter) data = data.filter(d => d.type === typeFilter);
    if (statutFilter) data = data.filter(d => d.statut === statutFilter);
    if (dateFilter) {
      const pdn = (s) => { const p = String(s).split("/"); if (p.length < 3) return NaN; return parseInt(p[2].split(" ")[0],10)*10000+parseInt(p[1],10)*100+parseInt(p[0],10); };
      const deb = dateFilter.debut ? pdn(dateFilter.debut) : NaN;
      const fin = dateFilter.fin ? pdn(dateFilter.fin) : NaN;
      data = data.filter(d => { const n = pdn(d.creeLe||""); if(isNaN(n)) return true; if(!isNaN(deb)&&n<deb) return false; if(!isNaN(fin)&&n>fin) return false; return true; });
    }
    const key = eligAddrFieldMap[sortBy || "Créée le"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["creeLe","testeeLe"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, utilisateurFilter2, typeFilter, statutFilter, dateFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedAdresses.length / perPage));
  const view = sortedAdresses.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden" }}>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Créée le","Type de recherche","Données de la recherche","Libellé","Statut","Testée le"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher une adresse ou un libellé" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <div ref={utilisateurRef2} style={{ position:"relative", display:"inline-block" }}
          onMouseEnter={() => setUtilisateurOpen2(true)}
          onMouseLeave={() => setUtilisateurOpen2(false)}>
          <span className="kap-input-wrap" style={{ cursor:"pointer", userSelect:"none" }} onClick={() => setUtilisateurOpen2(o => !o)}>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontFamily:"var(--kap-font-ui)", color:"var(--kap-fg-3)" }}>
              Utilisateur
              {utilisateurFilter2 && <span style={{ background:"var(--kap-primary)", color:"#fff", borderRadius:99, fontSize:11, fontWeight:700, minWidth:18, height:18, display:"inline-flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>1</span>}
            </span>
            <Icon name="chevron-down" size={16} style={{ marginRight:-4 }} />
          </span>
          {utilisateurOpen2 && (
            <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, minWidth:220, background:"#fff", border:"1px solid var(--kap-border-2)", borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", zIndex:200, padding:"14px 16px" }}>
              <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
                <span>Mes recherches uniquement</span>
                <span onClick={() => setUtilisateurFilter2(v => !v)} style={{ display:"inline-block", width:36, height:20, borderRadius:99, background:utilisateurFilter2 ? "var(--kap-primary)" : "#ccc", cursor:"pointer", position:"relative", transition:"background 200ms", flexShrink:0 }}>
                  <span style={{ position:"absolute", top:2, left:utilisateurFilter2 ? 18 : 2, width:16, height:16, borderRadius:99, background:"#fff", transition:"left 200ms", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </span>
              </label>
            </div>
          )}
        </div>
        <DateRangeDropdown placeholder="Créée le" value={dateFilter} onChange={setDateFilter} width={140} />
        <RadioDropdown placeholder="Type de recherche" options={["NDI","Code immeuble","Adresse","GPS"]} value={typeFilter} onChange={setTypeFilter} width={180} showSearch={false} />
        <RadioDropdown placeholder="Statut" options={["Créée","En cours","Terminée","En erreur","Annulée"]} value={statutFilter} onChange={setStatutFilter} width={130} showSearch={false} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Utilisateur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Utilisateur")} dir={sortDir}>Utilisateur</SortHeader></th>
              <th onClick={() => handleColSort("Créée le")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Créée le")} dir={sortDir}>Créée le</SortHeader></th>
              <th onClick={() => handleColSort("Type de recherche")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type de recherche")} dir={sortDir}>Type de recherche</SortHeader></th>
              <th onClick={() => handleColSort("Données de la recherche")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Données de la recherche")} dir={sortDir}>Données de la recherche</SortHeader></th>
              <th onClick={() => handleColSort("Libellé")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Libellé")} dir={sortDir}>Libellé</SortHeader></th>
              <th onClick={() => handleColSort("Statut")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Statut")} dir={sortDir}>Statut</SortHeader></th>
              <th onClick={() => handleColSort("Testée le")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Testée le")} dir={sortDir}>Testée le</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map(d => (
              <tr key={d.id} className="is-clickable">
                <td style={{ fontWeight:500 }}>{d.utilisateur}</td>
                <td className="muted">{d.creeLe}</td>
                <td className="muted">{d.type}</td>
                <td className="mono muted">{d.donnees}</td>
                <td>{d.libelle}</td>
                <td><Icon name="check-circle-2" size={18} style={{ color:"#2E7D32" }} /></td>
                <td className="muted">{d.testeeLe}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL} perPage={perPage} />
      </div>
    </>
  );
}

const ELIG_SUGGESTIONS = [
  { label: "Test Fontenils métrique 41600 Nouan-le-Fuzelier", hasData: true },
  { label: "teste 97615 Dzaoudzi", hasData: true },
  { label: "Teste du Gros de Mageau 83340 Le Thoronet", hasData: true },
  { label: "Teste Rouge 32350 Biran", hasData: false },
  { label: "Testes 09700 Saint-Quirc", hasData: false },
  { label: "Teste Essute 07310 Saint-Martial", hasData: false },
  { label: "Test-Milon 89560 Lain", hasData: false },
  { label: "Test-Milon 89560 Sementron", hasData: false },
];

const SEARCH_MODES = [
  { key: "adresse",   icon: "home",      label: "Adresse",         placeholder: "Adresse (ex: Impasse de la Croix, 69270)" },
  { key: "gps",       icon: "map-pin",   label: "Coordonnées GPS", placeholder: "Coordonnées GPS (ex: 45.7640, 4.8357)" },
  { key: "immeuble",  icon: "building-2",label: "Code immeuble",   placeholder: "Code immeuble (ex: IMM123456)" },
  { key: "ndi",       icon: "phone",     label: "NDI",             placeholder: "NDI (ex: 0033123456789)" },
];

const LEGENDE_FTTH = [
  { color: "#2E7D32", label: "Déployé (raccordable)" },
  { color: "#1a1a2e", label: "En cours de déploiement" },
  { color: "#1976D2", label: "Raccordable sur demande" },
  { color: "#F9A825", label: "Programmé" },
  { color: "#9E9E9E", label: "Études réalisées" },
  { color: "#D32F2F", label: "Non raccordable" },
];

function EligCarteScreen() {
  const [mode, setMode] = useStateCt("adresse");
  const [query, setQuery] = useStateCt("");
  const [showModes, setShowModes] = useStateCt(false);
  const [showSugg, setShowSugg] = useStateCt(false);
  const [hoveredMode, setHoveredMode] = useStateCt(null);
  const [hoveredCell, setHoveredCell] = useStateCt(null);
  const [showLegende, setShowLegende] = useStateCt(false);
  const [showModal, setShowModal] = useStateCt(false);
  const [modalStep, setModalStep] = useStateCt(1);
  const [codePostal, setCodePostal] = useStateCt("");
  const [ville, setVille] = useStateCt("");
  const [nomVoie, setNomVoie] = useStateCt("");
  const [numVoie, setNumVoie] = useStateCt("");
  const [selectedNDI, setSelectedNDI] = useStateCt(null);
  const [showEligModal, setShowEligModal] = useStateCt(false);
  const [progress, setProgress] = useStateCt(0);
  const [selectedCells, setSelectedCells] = useStateCt([]);
  const [expandedOffer, setExpandedOffer] = useStateCt(null);

  const MOCK_LIGNES = [
    { ndi: "0472077649", resident: "LINKSIP",                  statut: "INACTIVE" },
    { ndi: "0472800336", resident: "KOESIO ASSET MANAGEMENT",  statut: "ACTIVE" },
    { ndi: "0478398676", resident: "JENDRIAN MARTIN LINKSIP",  statut: "INACTIVE" },
  ];

  function resetModal() { setModalStep(1); setCodePostal(""); setVille(""); setNomVoie(""); setNumVoie(""); setSelectedNDI(null); setShowModal(false); }

  const TECHS = ["XDSL","SDSL","FTTE","FTTO","FTTH"];
  const OPERATEURS = [
    { key:"koesio",   color:"#7E41A3", logo: <span style={{ fontFamily:"var(--kap-font-display)", fontWeight:700, fontSize:15, color:"#7E41A3", letterSpacing:"-0.5px" }}>koesio</span> },
    { key:"axione",   color:"#E64A19", logo: <span style={{ fontFamily:"Georgia, serif", fontWeight:700, fontSize:14, color:"#E64A19", fontStyle:"italic" }}>axione</span> },
    { key:"bouygues", color:"#1565C0", logo: <span style={{ fontFamily:"Arial, sans-serif", fontWeight:700, fontSize:12, color:"#1565C0", display:"inline-flex", alignItems:"center", gap:3 }}><span style={{ background:"#1565C0", color:"#fff", borderRadius:3, padding:"1px 5px", fontSize:11 }}>b</span>ouygues</span> },
    { key:"covage",   color:"#37474F", logo: <span style={{ fontFamily:"Arial, sans-serif", fontWeight:800, fontSize:12, color:"#37474F", letterSpacing:"1px" }}>COVAGE</span> },
    { key:"ielo",     color:"#546E7A", logo: <span style={{ fontFamily:"Georgia, serif", fontWeight:400, fontSize:15, color:"#546E7A", letterSpacing:"2px" }}>ielo.</span> },
    { key:"orange",   color:"#FF6D00", logo: <span style={{ fontFamily:"Arial, sans-serif", fontWeight:700, fontSize:14, color:"#FF6D00" }}>orange</span> },
    { key:"sfr",      color:"#D32F2F", logo: <span style={{ background:"#D32F2F", color:"#fff", fontFamily:"Arial, sans-serif", fontWeight:900, fontSize:12, padding:"2px 7px", borderRadius:3, letterSpacing:"1px" }}>SFR</span> },
    { key:"siea",     color:"#2E7D32", logo: <span style={{ fontFamily:"Arial, sans-serif", fontWeight:700, fontSize:13, color:"#2E7D32", letterSpacing:"1px" }}>SIEA</span> },
  ];
  const ELIG_WARNINGS = {
    "covage_FTTO": "Adresse introuvable chez l'opérateur. Résultats basés sur l'adresse la plus proche (21,54 m) ; 8 RUE DE NUITS 69004 LYON",
  };

  const ELIG_GRID = {
    koesio:  { XDSL:null, SDSL:null, FTTE:null,  FTTO:8,       FTTH:null },
    axione:  { XDSL:null, SDSL:null, FTTE:0,     FTTO:0,       FTTH:0    },
    bouygues:{ XDSL:null, SDSL:null, FTTE:null,  FTTO:8,       FTTH:0    },
    covage:  { XDSL:null, SDSL:null, FTTE:0,     FTTO:10,      FTTH:"X"  },
    ielo:    { XDSL:null, SDSL:null, FTTE:null,  FTTO:10,      FTTH:null },
    orange:  { XDSL:1,    SDSL:10,   FTTE:0,     FTTO:24,      FTTH:0    },
    sfr:     { XDSL:null, SDSL:null, FTTE:0,     FTTO:21,      FTTH:"X"  },
    siea:    { XDSL:null, SDSL:null, FTTE:0,     FTTO:0,       FTTH:null },
  };
  const ELIG_OFFERS = [
    { operateur:"koesio",   gamme:"FTTO", debit:"10 Gbps",  zone:"sur devis, contacter lea.networks@koesio.com", articles:[{ ref:"1760", cat:"ABO", libelle:"FIBRE 10G - K1", pa:"-", pp:"-" }] },
    { operateur:"koesio",   gamme:"FTTO", debit:"5 Gbps",   zone:"sur devis, contacter lea.networks@koesio.com", articles:[] },
    { operateur:"koesio",   gamme:"FTTO", debit:"2 Gbps",   zone:"sur devis, contacter lea.networks@koesio.com", articles:[] },
    { operateur:"koesio",   gamme:"FTTO", debit:"1 Gbps",   zone:"sur devis, contacter lea.networks@koesio.com", articles:[] },
    { operateur:"bouygues", gamme:"FTTO", debit:"1 Gbps",   zone:"", articles:[] },
    { operateur:"koesio",   gamme:"FTTO", debit:"500 Mbps", zone:"sur devis, contacter lea.networks@koesio.com", articles:[] },
    { operateur:"bouygues", gamme:"FTTO", debit:"500 Mbps", zone:"", articles:[] },
    { operateur:"orange",   gamme:"FTTO", debit:"1 Gbps",   zone:"Zone très dense", articles:[] },
    { operateur:"orange",   gamme:"XDSL", debit:"20 Mbps",  zone:"Zone AMII", articles:[] },
    { operateur:"sfr",      gamme:"FTTO", debit:"1 Gbps",   zone:"", articles:[] },
  ];

  function getCellStyle(val) {
    if (val === null || val === undefined) return { background:"#fff", color:"transparent" };
    if (val === "X") return { background:"#FFCDD2", color:"#D32F2F" };
    if (val === "warn") return { background:"#FFE0B2", color:"#E65100" };
    if (val === 0) return { background:"#FFE0B2", color:"#E65100" };
    return { background:"#C8E6C9", color:"#1B5E20" };
  }

  function getCellContent(val) {
    if (val === null || val === undefined) return "";
    if (val === "X") return "✕";
    return val;
  }

  function toggleCell(opKey, tech) {
    const id = `${opKey}_${tech}`;
    setSelectedCells(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  const filteredOffers = selectedCells.length === 0 ? [] : ELIG_OFFERS.filter(o =>
    selectedCells.some(c => { const [op, tech] = c.split("_"); return o.operateur === op && o.gamme === tech; })
  );

  function openEligModal() {
    setShowModal(false); setShowEligModal(true); setProgress(0); setSelectedCells([]); setExpandedOffer(null);
    let p = 0;
    const iv = setInterval(() => { p += 8; setProgress(Math.min(p, 100)); if (p >= 100) clearInterval(iv); }, 80);
  }
  const [zoom, setZoom] = useStateCt(0); // 0 = vue France complète
  const currentMode = SEARCH_MODES.find(m => m.key === mode);
  const suggestions = query.length > 1 ? ELIG_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase())) : [];

  // Centre France : lat 46.5, lon 2.5 — on réduit/agrandit la bbox selon le zoom
  const BASE = 7.75; // demi-étendue initiale
  const factor = Math.pow(0.6, zoom);
  const cx = 2.5, cy = 46.5;
  const bboxStr = [
    (cx - BASE * factor).toFixed(4),
    (cy - BASE * 0.65 * factor).toFixed(4),
    (cx + BASE * factor).toFixed(4),
    (cy + BASE * 0.65 * factor).toFixed(4),
  ].map(encodeURIComponent).join('%2C');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxStr}&layer=mapnik`;

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* Carte OpenStreetMap centrée sur la France */}
      <iframe
        key={mapSrc}
        src={mapSrc}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
        title="Carte France"
      />

      {/* Bouton mode — EN DEHORS du bloc blanc */}
      <div style={{ position:"absolute", top:16, left:16, zIndex:20 }}
        onMouseEnter={() => setShowModes(true)}
        onMouseLeave={() => setShowModes(false)}
      >
        <button style={{ width:48, height:48, background:"var(--kap-primary)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px 0 0 8px" }}>
          <Icon name={currentMode.icon} size={20} style={{ color:"#fff" }} />
        </button>
        {showModes && (
          <div style={{ display:"flex", flexDirection:"column", borderRadius:"0 0 6px 6px", boxShadow:"0 4px 12px rgba(0,0,0,0.25)" }}>
            {[
              { key:"adresse",  icon:"home",       label:"Adresse" },
              { key:"gps",      icon:"map-pin",    label:"Coordonnées GPS" },
              { key:"immeuble", icon:"building-2", label:"Code immeuble" },
              { key:"ndi",      icon:"phone",      label:"NDI" },
            ].filter(m => m.key !== mode).map((m, idx, arr) => (
              <Tooltip key={m.key} text={m.label} placement="top-start">
                <button
                  onClick={() => { setMode(m.key); setShowModes(false); setQuery(""); }}
                  onMouseEnter={() => setHoveredMode(m.key)}
                  onMouseLeave={() => setHoveredMode(null)}
                  style={{ width:48, height:44, background: mode === m.key ? "var(--kap-primary)" : hoveredMode === m.key ? "#f5f5f5" : "#fff", border:"none", borderBottom: idx < arr.length-1 ? "1px solid var(--kap-border-1)" : "none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", borderRadius: idx === arr.length-1 ? "0 0 6px 6px" : 0, transition:"background 120ms" }}>
                  <Icon name={m.icon} size={18} style={{ color: mode === m.key ? "#fff" : "var(--kap-fg-3)" }} />
                </button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {/* Barre de recherche — décalée à droite du bouton */}
      <div style={{ position:"absolute", top:16, left:64, zIndex:10, width:332 }}>
        <div style={{ display:"flex", background:"#fff", borderRadius:"0 8px 8px 0", boxShadow:"0 2px 12px rgba(0,0,0,0.18)", overflow: showSugg && suggestions.length > 0 ? "visible" : "hidden", height:48 }}>
          {/* Input */}
          <input
            type="text"
            placeholder={currentMode.placeholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
            onFocus={() => setShowSugg(true)}
            style={{ flex:1, border:"none", outline:"none", padding:"0 12px", fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-dark)" }}
          />
          <button onClick={() => setShowSugg(v => !v)} style={{ width:36, background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name={showSugg ? "chevron-up" : "chevron-down"} size={16} style={{ color:"var(--kap-fg-3)" }} />
          </button>
        </div>

        {/* Suggestions */}
        {showSugg && (
          <div style={{ background:"#fff", borderRadius:"0 0 8px 8px", boxShadow:"0 4px 16px rgba(0,0,0,0.15)", marginTop:2 }}>
            {suggestions.length === 0
              ? <div style={{ padding:"12px 14px", fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-3)" }}>Aucun résultat</div>
              : <div style={{ maxHeight:240, overflowY:"auto" }}>
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => { setQuery(s.label); setShowSugg(false); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid var(--kap-border-1)", fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-dark)" }}>
                      {s.hasData && <Icon name="bar-chart-2" size={16} style={{ color:"var(--kap-primary)", flexShrink:0 }} />}
                      {!s.hasData && <span style={{ width:16 }} />}
                      {s.label}
                    </div>
                  ))}
                </div>
            }
            <div style={{ padding:"10px 14px" }}>
              <button onClick={() => { setShowSugg(false); setShowModal(true); }} style={{ width:"100%", background:"var(--kap-primary)", color:"#fff", border:"none", borderRadius:6, padding:"9px 0", fontFamily:"var(--kap-font-ui)", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                Vous ne trouvez pas votre adresse ?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bouton légende bas gauche */}
      <div style={{ position:"absolute", bottom:16, left:16, zIndex:10, display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8 }}>
        {showLegende && (
          <div style={{ background:"#fff", borderRadius:8, boxShadow:"0 2px 12px rgba(0,0,0,0.15)", padding:"14px 18px", minWidth:220 }}>
            <div style={{ fontFamily:"var(--kap-font-display)", fontWeight:700, fontSize:14, marginBottom:10 }}>État des immeubles (FTTH)</div>
            {LEGENDE_FTTH.map(l => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
                <span style={{ width:10, height:10, borderRadius:99, background:l.color, flexShrink:0 }} />
                {l.label}
              </div>
            ))}
          </div>
        )}
        <Tooltip text="État des immeubles (FTTH)" placement="top-start">
          <button onClick={() => setShowLegende(v => !v)}
            style={{ width:40, height:40, background: showLegende ? "var(--kap-primary)" : "#fff", border:"1px solid var(--kap-border-2)", borderRadius:99, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
            <Icon name="map" size={20} style={{ color: showLegende ? "#fff" : "var(--kap-fg-3)" }} />
          </button>
        </Tooltip>
      </div>

      {/* Contrôles de zoom */}
      <div style={{ position:"absolute", bottom:16, right:16, zIndex:10, display:"flex", flexDirection:"column", gap:2 }}>
        <button onClick={() => setZoom(z => z + 1)} style={{ width:32, height:32, background:"#fff", border:"1px solid var(--kap-border-2)", borderRadius:"4px 4px 0 0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:300, lineHeight:1 }}>+</button>
        <button onClick={() => setZoom(z => Math.max(0, z - 1))} style={{ width:32, height:32, background:"#fff", border:"1px solid var(--kap-border-2)", borderBottom:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:300, lineHeight:1 }}>−</button>
        <button style={{ width:32, height:32, background:"#fff", border:"1px solid var(--kap-border-2)", borderRadius:"0 0 4px 4px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="layers" size={16} style={{ color:"var(--kap-fg-3)" }}/></button>
      </div>

      {/* Crédits */}
      <div style={{ position:"absolute", bottom:4, right:56, zIndex:10, fontFamily:"var(--kap-font-ui)", fontSize:10, color:"var(--kap-fg-3)" }}>
        Leaflet | © CARTO, © OpenStreetMap contributors
      </div>

      {showEligModal ? (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, width:1200, maxWidth:"98%", maxHeight:"92vh", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid var(--kap-border-1)", flexShrink:0 }}>
              <span style={{ fontFamily:"var(--kap-font-ui)", fontWeight:700, fontSize:14 }}>{numVoie} {nomVoie.toUpperCase()} {codePostal} {ville.toUpperCase()} - RECHERCHE PAR NDI ({selectedNDI})</span>
              <button onClick={() => setShowEligModal(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><Icon name="x" size={20} style={{ color:"var(--kap-fg-3)" }} /></button>
            </div>
            <div style={{ display:"flex", flex:1, minHeight:0, overflow:"hidden" }}>
              <div style={{ width:420, flexShrink:0, borderRight:"1px solid var(--kap-border-1)", display:"flex", flexDirection:"column", padding:"16px 12px", overflow:"visible" }}>
                <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:3, fontSize:12, fontFamily:"var(--kap-font-ui)", border:"1px solid var(--kap-border-2)", borderRadius:6 }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"4px 8px", textAlign:"left" }}></th>
                      {TECHS.map(t => <th key={t} style={{ padding:"4px 8px", textAlign:"center", fontWeight:700, fontSize:11, color:"var(--kap-fg-3)" }}>{t}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {OPERATEURS.map(op => (
                      <tr key={op.key}>
                        <td style={{ padding:"4px 8px", whiteSpace:"nowrap", border:"1px solid var(--kap-border-2)", borderRadius:4 }}>{op.logo}</td>
                        {TECHS.map(tech => {
                          const val = ELIG_GRID[op.key]?.[tech];
                          const cs = getCellStyle(val);
                          const id = op.key + "_" + tech;
                          const isSel = selectedCells.includes(id);
                          const isClick = typeof val === "number" && val > 0;
                          const isEmpty = val === null || val === undefined;
                          const tooltipText = isEmpty && progress < 100 ? "En cours"
                            : val === "X" ? "Opérateur indisponible"
                            : val === 0 ? "Aucune offre"
                            : null;
                          const cellId = id;
                          const warningMsg = ELIG_WARNINGS[cellId] || null;
                          const activeTooltip = warningMsg || tooltipText;
                          return (
                            <td key={tech}
                              onClick={() => isClick && toggleCell(op.key, tech)}
                              onMouseEnter={() => activeTooltip && setHoveredCell(cellId)}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={isEmpty && progress < 100 ? "elig-cell-loading" : ""}
                              style={{ ...(!isEmpty ? cs : { background: progress >= 100 ? "#eeeeee" : "transparent" }), padding:"8px 16px", textAlign:"center", cursor:isClick ? "pointer" : "default", fontWeight:700, fontSize:13, borderRadius:4, outline: isSel ? "2px solid #1B5E20" : "none", outlineOffset:"-2px", position:"relative" }}>
                              {!isEmpty ? getCellContent(val) : ""}
                              {warningMsg && (
                                <span style={{ position:"absolute", top:2, right:2, pointerEvents:"none" }}>
                                  <Icon name="alert-triangle" size={12} style={{ color:"#ED6C02" }} />
                                </span>
                              )}
                              {hoveredCell === cellId && activeTooltip && (
                                <span style={{ position:"absolute", bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)", background:"#1a1a2e", color:"#fff", padding:"8px 12px", borderRadius:6, fontSize:12, fontFamily:"var(--kap-font-ui)", whiteSpace:"normal", width:"max-content", maxWidth:400, textAlign:"left", pointerEvents:"none", zIndex:9999, boxShadow:"0 4px 16px rgba(0,0,0,0.3)", lineHeight:"1.5" }}>
                                  {activeTooltip}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding:"10px 0 4px" }}>
                  <div style={{ height:4, background:"var(--kap-border-1)", borderRadius:99 }}>
                    <div style={{ height:"100%", width:progress + "%", background:"var(--kap-primary)", borderRadius:99, transition:"width 80ms linear" }} />
                  </div>
                  <div style={{ textAlign:"right", fontSize:11, color:"var(--kap-fg-3)", fontFamily:"var(--kap-font-ui)", marginTop:2 }}>{progress}%</div>
                </div>
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
                {filteredOffers.length === 0 ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-3)", textAlign:"center", padding:20 }}>
                    Veuillez sélectionner une ou plusieurs cases du tableau d'éligibilité afin d'afficher les offres disponibles
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"var(--kap-font-ui)", border:"1px solid var(--kap-border-2)", borderRadius:6 }}>
                    <thead>
                      <tr>
                        {["Opérateur","Gamme","Débit ↓","Zone","Articles"].map(h => (
                          <th key={h} style={{ padding:"8px 10px", fontSize:12, fontWeight:700, color:"var(--kap-primary)", border:"1px solid var(--kap-border-2)", background:"#fafafa", textAlign:"left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                    {filteredOffers.map((o, idx) => {
                      const opColor = OPERATEURS.find(x => x.key === o.operateur)?.color || "#333";
                      const isExp = expandedOffer === idx;
                      const cellStyle = { padding:"8px 10px", border:"1px solid var(--kap-border-2)", fontSize:13, verticalAlign:"middle" };
                      return (
                        <React.Fragment key={idx}>
                          <tr style={{ cursor:"pointer" }} onClick={() => setExpandedOffer(isExp ? null : idx)}>
                            <td style={{ ...cellStyle, fontWeight:700, color:opColor }}>{o.operateur}</td>
                            <td style={{ ...cellStyle, color:"var(--kap-fg-3)" }}>{o.gamme}</td>
                            <td style={cellStyle}>{o.debit}</td>
                            <td style={{ ...cellStyle, color:"var(--kap-fg-3)" }}>{o.zone}</td>
                            <td style={{ ...cellStyle, textAlign:"center" }}><Icon name={isExp ? "chevron-up" : "chevron-down"} size={16} style={{ color:"var(--kap-fg-3)" }} /></td>
                          </tr>
                          {isExp && (
                            <tr>
                              <td colSpan={5} style={{ padding:"12px 16px", background:"#f8f9fb", borderTop:"1px solid #e8eaf0", borderBottom:"1px solid #e8eaf0" }}>
                                {o.articles.length === 0 && <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, color:"var(--kap-fg-3)" }}>Aucun article disponible pour cette offre.</span>}
                                {o.articles.length > 0 && (
                                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                                    <thead>
                                      <tr>
                                        {["Référence","Catégorie","Libellé","Prix d'achat","Prix public"].map(h => (
                                          <th key={h} style={{ padding:"6px 8px", fontSize:11, fontWeight:700, color:"var(--kap-primary)", borderBottom:"1px solid #e8eaf0", textAlign:"left" }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {o.articles.map((a, ai) => (
                                        <tr key={ai}>
                                          <td style={{ padding:"6px 8px", fontFamily:"var(--kap-font-mono)", fontSize:12 }}>{a.ref}</td>
                                          <td style={{ padding:"6px 8px", fontSize:12, color:"var(--kap-fg-3)" }}>{a.cat}</td>
                                          <td style={{ padding:"6px 8px", fontSize:12 }}>{a.libelle}</td>
                                          <td style={{ padding:"6px 8px", fontSize:12, color:"var(--kap-fg-3)" }}>{a.pa}</td>
                                          <td style={{ padding:"6px 8px", fontSize:12, color:"var(--kap-fg-3)" }}>{a.pp}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modale "Vous ne trouvez pas votre adresse" */}
      {showModal && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, width:700, maxWidth:"90%", boxShadow:"0 8px 32px rgba(0,0,0,0.2)", overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 0" }}>
              <span style={{ fontFamily:"var(--kap-font-display)", fontWeight:700, fontSize:17, color:"var(--kap-primary)" }}>Entrez votre adresse pour trouver votre numéro de ligne</span>
              <button onClick={resetModal} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}><Icon name="x" size={20} style={{ color:"var(--kap-fg-3)" }} /></button>
            </div>

            {/* Stepper */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, padding:"20px 24px 0" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ width:28, height:28, borderRadius:99, background:"var(--kap-primary)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>
                  {modalStep === 1 ? "1" : <Icon name="check" size={16} />}
                </span>
                <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, fontWeight:600, color:"var(--kap-primary)" }}>Rechercher une ligne</span>
              </div>
              <div style={{ flex:1, height:2, background: modalStep === 2 ? "var(--kap-primary)" : "var(--kap-border-2)", margin:"0 12px", marginBottom:18 }} />
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ width:28, height:28, borderRadius:99, background: modalStep === 2 ? "var(--kap-primary)" : "var(--kap-border-2)", color: modalStep === 2 ? "#fff" : "var(--kap-fg-3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>2</span>
                <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, color: modalStep === 2 ? "var(--kap-primary)" : "var(--kap-fg-3)" }}>Choisir un numéro de ligne</span>
              </div>
            </div>

            {/* Contenu étape 1 */}
            {modalStep === 1 && (
              <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Code postal" value={codePostal} onChange={e => setCodePostal(e.target.value)} style={{ width:"100%" }} /></span>
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Ville" value={ville} onChange={e => setVille(e.target.value)} style={{ width:"100%" }} /></span>
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Nom de la voie" value={nomVoie} onChange={e => setNomVoie(e.target.value)} autoComplete="address-line1" style={{ width:"100%" }} /></span>
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Numéro de la voie" value={numVoie} onChange={e => setNumVoie(e.target.value)} autoComplete="address-line2" style={{ width:"100%" }} /></span>
                </div>
                <div style={{ display:"flex", justifyContent:"center", paddingTop:4 }}>
                  <Button variant="primary" disabled={!codePostal || !ville || !nomVoie} onClick={() => setModalStep(2)}>Rechercher une ligne</Button>
                </div>
              </div>
            )}

            {/* Contenu étape 2 */}
            {modalStep === 2 && (
              <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:"#E3F2FD", borderRadius:8, padding:"10px 14px", display:"flex", alignItems:"flex-start", gap:10 }}>
                  <Icon name="info" size={18} style={{ color:"#1976D2", flexShrink:0, marginTop:1 }} />
                  <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:13, color:"#1565C0", lineHeight:"1.5" }}>
                    <strong>Vous ne trouvez pas votre adresse ?</strong> Vous pouvez en sélectionner une de cette liste située dans le même immeuble pour valider votre éligibilité.
                  </span>
                </div>
                <table className="kap-table" style={{ borderRadius:8, overflow:"hidden", border:"1px solid var(--kap-border-1)" }}>
                  <thead>
                    <tr>
                      <th>NDI</th>
                      <th>Nom du résidant</th>
                      <th style={{ textAlign:"center" }}>Statut de la ligne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_LIGNES.map(l => (
                      <tr key={l.ndi} className="is-clickable" onClick={() => setSelectedNDI(l.ndi)} style={{ background: selectedNDI === l.ndi ? "var(--kap-primary-soft)" : "transparent" }}>
                        <td className="mono">{l.ndi}</td>
                        <td>{l.resident}</td>
                        <td style={{ textAlign:"center" }}>
                          <span className="kap-pill kap-pill--soft" style={{ "--bg": l.statut === "ACTIVE" ? "#E6F2E7" : "#FDECEA", "--fg": l.statut === "ACTIVE" ? "var(--kap-success)" : "var(--kap-error)" }}>
                            {l.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <Button variant="primary" onClick={() => setModalStep(1)}>Retour à l'étape précédente</Button>
                  <Button variant="primary" disabled={!selectedNDI} onClick={openEligModal}>Tester l'éligibilité à l'adresse</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EligibiliteScreen({ initialSub = "carte" }) {
  if (initialSub === "demande") return <EligDemandesScreen />;
  if (initialSub === "adresse") return <EligAdressesScreen />;
  if (initialSub === "carte") return <EligCarteScreen />;
  const [country, setCountry] = useStateCt("fr");
  const [searched, setSearched] = useStateCt(true);
  return (
    <>
      <PageHead
        icon="map-pin"
        title="Carte"
        subtitle="Vérifiez l'éligibilité d'une adresse aux services Kapitano par pays."
      />
      <div className="kap-card kap-card--padded">
        <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: "1px solid var(--kap-divider)" }}>
          {[
            { key: "fr", label: "France",   flag: "fr" },
            { key: "ch", label: "Suisse",   flag: "ch" },
            { key: "ad", label: "Andorre",  flag: "ad" },
            { key: "ca", label: "Canada",   flag: "ca" },
            { key: "us", label: "USA",      flag: "us" },
          ].map(c => (
            <div key={c.key}
              onClick={() => setCountry(c.key)}
              style={{
                padding: "10px 16px",
                display: "flex", alignItems: "center", gap: 8,
                cursor: "pointer",
                borderBottom: "2px solid " + (country === c.key ? "var(--kap-primary)" : "transparent"),
                marginBottom: -1,
                fontFamily: "var(--kap-font-display)",
                fontWeight: country === c.key ? 700 : 500,
                fontSize: 13,
                color: country === c.key ? "var(--kap-primary)" : "var(--kap-fg-3)",
              }}>
              <Flag country={c.flag} />
              {c.label}
            </div>
          ))}
        </div>

        <div className="kap-eligibility-form">
          <div className="kap-field">
            <label className="kap-field-label">Adresse</label>
            <Input icon="search" placeholder="22 avenue Saint-Jean-d'Angely, Saint-Hilaire" value="22 avenue Saint-Jean-d'Angely" onChange={() => {}} width="100%" />
          </div>
          <div className="kap-field">
            <label className="kap-field-label">Code postal</label>
            <Input icon="hash" placeholder="17770" value="17770" onChange={() => {}} width="100%" />
          </div>
          <div className="kap-field">
            <label className="kap-field-label">Ville</label>
            <Input icon="map-pin" placeholder="Saint-Hilaire-de-Villefranche" value="Saint-Hilaire-de-Villefranche" onChange={() => {}} width="100%" />
          </div>
          <div className="kap-field">
            <label className="kap-field-label">N° voie</label>
            <Input icon="hash" placeholder="22" value="22" onChange={() => {}} width="100%" />
          </div>
          <Button variant="primary" icon="search" size="lg" onClick={() => setSearched(true)}>Vérifier</Button>
        </div>
        <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)", marginTop: 8 }}>
          <Icon name="info" size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
          L'éligibilité est consolidée auprès de tous nos partenaires d'infrastructure.
        </div>
      </div>

      {searched && (
        <div className="kap-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: 18, display: "flex", alignItems: "center", gap: 12, background: "#F8F4FC", borderBottom: "1px solid var(--kap-divider)" }}>
            <IconTile icon="check-circle-2" size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16 }}>6 technologies éligibles</div>
              <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)" }}>22 avenue Saint-Jean-d'Angely · 17770 Saint-Hilaire-de-Villefranche · ID 17344_0063_00022</div>
            </div>
            <Button variant="tertiary" icon="map">Voir sur la carte</Button>
            <Button variant="tertiary" icon="printer">Imprimer</Button>
          </div>
          <TableBox>
            <table className="kap-table">
              <thead>
                <tr>
                  <th>Technologie</th>
                  <th>Opérateur d'infrastructure</th>
                  <th>Débit maximum</th>
                  <th>Délai de raccordement</th>
                  <th style={{ textAlign: "right" }}>Prix indicatif HT</th>
                  <th>Eligible</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {ELIGIBILITY_RESULTS.map((r, i) => (
                  <tr key={r.tech + i}>
                    <td style={{ fontWeight: 600 }}>{r.tech}</td>
                    <td>{r.operateur}</td>
                    <td>{r.debitMax}</td>
                    <td className="muted">{r.delai}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{r.prixIndic}</td>
                    <td>{r.eligible
                      ? <span className="kap-pill kap-pill--success"><Icon name="check" size={12} />Oui</span>
                      : <span className="kap-pill kap-pill--neutral"><Icon name="minus" size={12} />Non</span>}
                    </td>
                    <td>{r.eligible && <Button variant="secondary" size="sm" icon="plus">Commander</Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableBox>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// PROFIL
// ════════════════════════════════════════════════════════════════
function ProfilScreen() {
  const [changePwd, setChangePwd] = useStateCt(false);
  const [pwd, setPwd] = useStateCt("");
  const [pwd2, setPwd2] = useStateCt("");

  function closeChangePwd() { setChangePwd(false); setPwd(""); setPwd2(""); }

  return (
    <>
      <PageHead icon="user" title="Profil & paramètres" subtitle="Gérez votre compte, vos préférences et vos accès." />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div className="kap-card kap-card--padded" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 96, height: 96, borderRadius: 9999, background: "var(--kap-primary)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--kap-font-display-lg)", fontWeight: 700, fontSize: 32 }}>
            MB
          </div>
          <div style={{ fontFamily: "var(--kap-font-display-lg)", fontWeight: 700, fontSize: 20 }}>Mathis Bourgoin</div>
          <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)" }}>mathis.bourgoin@koesio.com</div>
          <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>Administrateur · Koesio Aquitaine</span>
          <div style={{ width: "100%", borderTop: "1px solid var(--kap-divider)", marginTop: 8, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)", textAlign: "left" }}>
            <div><strong style={{ color: "var(--kap-fg-1)" }}>Dernière connexion</strong><br />12/11/2025 - 09:48</div>
            <div><strong style={{ color: "var(--kap-fg-1)" }}>Tickets ouverts</strong> 4</div>
            <div><strong style={{ color: "var(--kap-fg-1)" }}>Commandes ce mois</strong> 27</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="kap-card kap-card--padded">
            <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Sécurité</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Row label="Mot de passe" sub="Dernière modification le 14/09/2025">
                <Button variant="tertiary" icon="lock" onClick={() => setChangePwd(true)}>Modifier</Button>
              </Row>

              <Row label="Sessions actives" sub="3 appareils connectés">
                <Button variant="danger" icon="log-out">Tout déconnecter</Button>
              </Row>
            </div>
          </div>

          <div className="kap-card kap-card--padded">
            <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Notifications</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <NotifRow label="Nouveaux tickets" desc="Recevoir un e-mail quand un ticket est créé sur votre périmètre" on />
              <NotifRow label="Commandes livrées" desc="Notification quand une commande passe au statut Livrée" on />
              <NotifRow label="Alertes supervision" desc="Alertes critiques sur les équipements supervisés" on />
              <NotifRow label="Lettre d'informations" desc="Actualités produit Kapitano" />
            </div>
          </div>
        </div>
      </div>
      {changePwd && (
        <Modal
          title="Modifier le mot de passe"
          onClose={closeChangePwd}
          footer={<>
            <Button variant="tertiary" onClick={closeChangePwd}>Annuler</Button>
            <Button variant="primary" icon="check" onClick={closeChangePwd}>Enregistrer</Button>
          </>}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "4px 0" }}>
            <div className="kap-field">
              <label className="kap-field-label">Nouveau mot de passe</label>
              <Input icon="lock" type="password" value={pwd} onChange={setPwd} width="100%" placeholder="Nouveau mot de passe" />
            </div>
            <div className="kap-field">
              <label className="kap-field-label">Confirmer le mot de passe</label>
              <Input icon="lock" type="password" value={pwd2} onChange={setPwd2} width="100%" placeholder="Confirmation du mot de passe" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Row({ label, sub, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--kap-divider)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 14, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)", marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function NotifRow({ label, desc, on }) {
  const [v, setV] = useStateCt(!!on);
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--kap-divider)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 14, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)", marginTop: 2 }}>{desc}</div>
      </div>
      <span className={"kap-tweaks-switch " + (v ? "is-on" : "")}
            onClick={() => setV(!v)}
            style={{
              width: 36, height: 20, background: v ? "var(--kap-primary)" : "#d8d8d8",
              borderRadius: 999, position: "relative", cursor: "pointer", transition: "background 120ms",
            }}>
        <span style={{
          content: "''", position: "absolute", top: 2, left: 2,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transform: v ? "translateX(16px)" : "none",
          transition: "transform 160ms var(--kap-ease-standard)",
          boxShadow: "0 1px 2px rgba(0,0,0,.2)",
          display: "block",
        }} />
      </span>
    </div>
  );
}

const QUESTIONNAIRES = [
  { libelle: "Q-NET-001", nbQuestions: 5,  symptomes: "Coupure tunnel",                                                       matrices: 3, matricesIds: ["APP-KAPITANO","APP-KALI","APP-KARGO"] },
  { libelle: "Q-NET-002", nbQuestions: 5,  symptomes: "Coupure totale",                                                       matrices: 5  },
  { libelle: "Q-NET-003", nbQuestions: 5,  symptomes: "Lenteur VPN",                                                          matrices: 2  },
  { libelle: "Q-NET-004", nbQuestions: 5,  symptomes: "Lenteur Internet",                                                     matrices: 4  },
  { libelle: "Q-NET-005", nbQuestions: 5,  symptomes: "Lenteur serv. distant",                                                matrices: 1  },
  { libelle: "Q-NET-006", nbQuestions: 5,  symptomes: "Difficulté web",                                                       matrices: 2  },
  { libelle: "Q-VOI-001", nbQuestions: 7,  symptomes: "Coupure voip",                                                         matrices: 6  },
  { libelle: "Q-VOI-002", nbQuestions: 7,  symptomes: "VGA HS",                                                               matrices: 3  },
  { libelle: "Q-VOI-003", nbQuestions: 7,  symptomes: "Qualité VOIP",                                                         matrices: 4  },
  { libelle: "Q-VOI-004", nbQuestions: 7,  symptomes: "Joignabilité voix",                                                    matrices: 2  },
  { libelle: "Q-VOI-005", nbQuestions: 7,  symptomes: "Poste isolé",                                                          matrices: 1  },
  { libelle: "Q-VOI-006", nbQuestions: 7,  symptomes: "Fax",                                                                  matrices: 3  },
  { libelle: "Q-MOB-001", nbQuestions: 7,  symptomes: "Autre problème mobile, Qualité voix / pas de débit, Pas de...",        matrices: 7  },
  { libelle: "Q-HEB-001", nbQuestions: 2,  symptomes: "Dysfonctionnement FW",                                                 matrices: 1  },
  { libelle: "Q-HEB-002", nbQuestions: 3,  symptomes: "Perte de connectivité",                                                matrices: 2  },
  { libelle: "Q-HEB-003", nbQuestions: 4,  symptomes: "Lenteur applicative",                                                  matrices: 3  },
  { libelle: "Q-LIA-001", nbQuestions: 5,  symptomes: "Coupure totale lien",                                                  matrices: 4  },
  { libelle: "Q-LIA-002", nbQuestions: 6,  symptomes: "Dégradation débit",                                                    matrices: 2  },
];
const Q_DATE = "02/04/2026 - 17:32:56";

// ── Affichage par rôle ────────────────────────────────────────────
const APR_ROLES = ["Administrateur", "Manager", "Opérateur", "Support N2", "Lecture seule"];

const APR_PAGES = [
  {
    key: "utilisateurs",
    label: "Liste des utilisateurs",
    columns: ["Actif", "Nom", "Prénom", "Email", "Type", "Rôle", "Revendeur associé", "Date de création"],
  },
  {
    key: "logs",
    label: "Logs d'activité",
    columns: ["ID", "Date", "Nom de l'utilisateur", "Revendeur de l'utilisateur", "Statut", "Ressource", "Description", "Durée"],
  },
  {
    key: "commandes-suivi",
    label: "Suivi de commandes",
    columns: ["Date", "N° d'affaire", "Source", "Revendeur", "Client", "Qté articles", "État commande"],
  },
  {
    key: "commandes-reporting",
    label: "Reporting commandes",
    columns: ["Numéro d'affaire", "Date de l'action", "Revendeur", "Client", "Nom de l'utilisateur", "Téléphone", "Nom de l'article", "Quantité", "Type de prod.", "Type d'action"],
  },
  {
    key: "tickets",
    label: "Tickets",
    columns: ["Référence", "Date de création", "Sujet", "État", "Criticité", "Nature", "Origine", "Revendeur", "Client", "Site"],
  },
  {
    key: "tickets-archives",
    label: "Tickets archivés",
    columns: ["Numéro", "Date de création", "Symptôme", "État", "Revendeur", "Client", "Code Artis", "Site", "Type DIT"],
  },
  {
    key: "configurations",
    label: "Configurations",
    columns: ["Version", "Lien", "Options", "Numéro de série", "Statut", "Date d'archivage", "Revendeur", "Client", "Site", "Service"],
  },
  {
    key: "espaces-voix",
    label: "Espaces voix",
    columns: ["Date de création", "Revendeur", "Client", "Nom client Enove", "ID production", "État de l'espace voix"],
  },
  {
    key: "trunk-sip",
    label: "Trunk SIP & Centrex",
    columns: ["Revendeur", "Client", "Site", "N° de charge", "Offre", "Canaux", "Etat factu.", "Etat prod."],
  },
  {
    key: "trunk-commandes",
    label: "Commandes Trunk SIP",
    columns: ["Réf", "Date", "Revendeur", "Client", "Type d'offre", "Type commande", "N° de charge", "État commande"],
  },
  {
    key: "portabilite",
    label: "Portabilité",
    columns: ["Réf", "Créée le", "Revendeur", "Client", "Type commande", "Numéro", "Date de portabilité", "État commande", "Pilotée", "Statut portabilité", "Note"],
  },
  {
    key: "numeros-revendeurs",
    label: "Numéros revendeurs",
    columns: ["Revendeur", "Début de plage", "Fin de plage", "Taille de la plage", "Taux d'occupation", "Date de création"],
  },
  {
    key: "numeros-clients",
    label: "Numéros clients",
    columns: ["Revendeur", "Client", "Début de plage", "Fin de plage", "Taille de la plage", "Taux d'occupation"],
  },
  {
    key: "abonnements-mobiles",
    label: "Abonnements mobiles",
    columns: ["Revendeur", "Client", "Numéro mobile", "Type", "ICCID", "Utilisateur", "Forfait", "Etat abo.", "Etat prod."],
  },
  {
    key: "commandes-mobiles",
    label: "Commandes mobiles",
    columns: ["Réf", "Date", "Revendeur", "Client", "Type commande", "Forfait", "Numéro", "Type", "ICCID", "Portabilité", "Etat commande"],
  },
  {
    key: "dispatcher",
    label: "Dispatcher",
    columns: ["Numéro d'affaire", "Date de création", "Date étape", "Revendeur", "Client", "Lignes"],
  },
  {
    key: "cartes-sim",
    label: "Cartes SIM",
    columns: ["Revendeur", "Opérateur", "Type", "ICCID", "État", "Date du statut", "Localisation"],
  },
  {
    key: "gestionnaires-flottes",
    label: "Gestionnaires de flottes",
    columns: ["Actif", "Nom", "Prénom", "Email", "Revendeur associé", "Date de création"],
  },
  {
    key: "liens-abonnements",
    label: "Liens — Abonnements",
    columns: ["Revendeur", "Client", "Site", "Numéro mobile", "ICCID", "Nom du lien", "Offre", "Etat abo.", "Etat prod."],
  },
  {
    key: "liens-commandes",
    label: "Liens — Commandes",
    columns: ["Réf", "Date", "Revendeur", "Client", "Type commande", "Forfait", "ICCID", "Numéro", "Etat commande"],
  },
];

// Chargement immédiat depuis localStorage pour que les tables l'aient dès leur premier mount
(function() {
  try {
    const s = localStorage.getItem("kap_apr_config");
    if (s) window.APR_SAVED_CONFIG = JSON.parse(s);
  } catch(e) {}
})();

function initAprConfig() {
  if (window.APR_SAVED_CONFIG) return JSON.parse(JSON.stringify(window.APR_SAVED_CONFIG));
  const cfg = {};
  APR_PAGES.forEach(p => {
    cfg[p.key] = {};
    APR_ROLES.forEach(r => { cfg[p.key][r] = []; });
  });
  // Données initiales de démonstration
  cfg.utilisateurs["Opérateur"]     = ["Date de création", "Type"];
  cfg.utilisateurs["Support N2"]    = ["Date de création", "Type", "Prénom"];
  cfg.utilisateurs["Lecture seule"] = ["Date de création", "Type", "Prénom", "Revendeur associé"];
  cfg.logs["Opérateur"]     = ["ID", "Description"];
  cfg.logs["Support N2"]    = ["ID", "Description", "Durée"];
  cfg.logs["Lecture seule"] = ["ID", "Description", "Durée", "Revendeur de l'utilisateur"];
  return cfg;
}

function AffichageParRoleTab() {
  const [activePage, setActivePage] = useStateCt(APR_PAGES[0].key);
  const [config, setConfig] = useStateCt(initAprConfig);
  const [saved, setSaved] = useStateCt(false);
  const [pageMenuOpen, setPageMenuOpen] = useStateCt(false);
  const [pageMenuPos, setPageMenuPos] = useStateCt(null);
  const pageMenuBtnRef = React.useRef(null);
  const pageMenuDropRef = React.useRef(null);

  React.useEffect(() => {
    if (!pageMenuOpen) return;
    function handleClick(e) {
      if (pageMenuBtnRef.current && pageMenuBtnRef.current.contains(e.target)) return;
      if (pageMenuDropRef.current && pageMenuDropRef.current.contains(e.target)) return;
      setPageMenuOpen(false);
    }
    function handleScroll(e) {
      if (pageMenuDropRef.current && pageMenuDropRef.current.contains(e.target)) return;
      setPageMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [pageMenuOpen]);

  function togglePageMenu() {
    if (!pageMenuOpen && pageMenuBtnRef.current) {
      const r = pageMenuBtnRef.current.getBoundingClientRect();
      setPageMenuPos({ top: r.bottom + 4, left: r.left });
    }
    setPageMenuOpen(o => !o);
  }

  const page = APR_PAGES.find(p => p.key === activePage);

  function getPriority(col, role) {
    const list = config[activePage][role];
    const idx = list.indexOf(col);
    return idx === -1 ? null : idx + 1;
  }

  function toggleCol(col, role) {
    setConfig(prev => {
      const list = [...prev[activePage][role]];
      const idx = list.indexOf(col);
      if (idx === -1) list.push(col);
      else list.splice(idx, 1);
      return { ...prev, [activePage]: { ...prev[activePage], [role]: list } };
    });
    setSaved(false);
  }

  function movePriority(col, role, dir) {
    setConfig(prev => {
      const list = [...prev[activePage][role]];
      const idx = list.indexOf(col);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= list.length) return prev;
      list.splice(idx, 1);
      list.splice(newIdx, 0, col);
      return { ...prev, [activePage]: { ...prev[activePage], [role]: list } };
    });
    setSaved(false);
  }

  const cellStyle = (priority) => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
    padding: "6px 8px", borderRadius: 6, cursor: "pointer",
    background: priority !== null ? "rgba(126,65,163,.08)" : "transparent",
    border: priority !== null ? "1px solid rgba(126,65,163,.25)" : "1px solid transparent",
    minWidth: 80,
  });

  const maxHideable = page ? page.columns.length - 1 : 0;

  return (
    <div className="kap-canvas">
      <PageHead icon="layout" title="Affichage par rôle"
        subtitle="Définissez quelles colonnes masquer en priorité selon le rôle, quand la largeur du tableau est insuffisante." />

      <div className="kap-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)", whiteSpace: "nowrap" }}>Page :</span>
          <button ref={pageMenuBtnRef} type="button" onClick={togglePageMenu} style={{
            all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 8, border: "1px solid var(--kap-border-2)",
            background: "#fff", fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", width: 260, boxSizing: "border-box",
            justifyContent: "space-between",
          }}>
            {APR_PAGES.find(p => p.key === activePage)?.label}
            <Icon name="chevron-down" size={15} style={{ color: "var(--kap-fg-3)", marginLeft: 2 }} />
          </button>
          {pageMenuOpen && pageMenuPos && ReactDOM.createPortal(
            <div ref={pageMenuDropRef} style={{
              position: "fixed", top: pageMenuPos.top, left: pageMenuPos.left,
              background: "#fff", border: "1px solid var(--kap-border-2)",
              borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 9999, minWidth: 260, overflow: "hidden",
            }}>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {APR_PAGES.map(p => (
                <button key={p.key} type="button"
                  onClick={() => { setActivePage(p.key); setPageMenuOpen(false); setSaved(false); }}
                  onMouseEnter={e => { e.currentTarget.style.background = p.key === activePage ? "var(--kap-primary-soft, #F0E6F9)" : "var(--kap-bg-hover, #F5F5F5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = p.key === activePage ? "var(--kap-primary-soft, #F0E6F9)" : "transparent"; }}
                  style={{
                    all: "unset", display: "flex", alignItems: "center", width: "100%",
                    padding: "9px 14px", cursor: "pointer", boxSizing: "border-box",
                    fontFamily: "var(--kap-font-ui)", fontSize: 13,
                    color: p.key === activePage ? "var(--kap-primary)" : "var(--kap-fg-1)",
                    fontWeight: p.key === activePage ? 600 : 400,
                    background: p.key === activePage ? "var(--kap-primary-soft, #F0E6F9)" : "transparent",
                  }}>
                  {p.label}
                </button>
              ))}
              </div>
            </div>,
            document.body
          )}
        </div>

        <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderRadius: 8, background: "rgba(126,65,163,.05)", border: "1px solid rgba(126,65,163,.15)" }}>
          <Icon name="info" size={16} style={{ color: "var(--kap-primary)", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-2)" }}>
            Cliquez sur une cellule pour rendre une colonne masquable. Le chiffre indique l'ordre de masquage : <strong>1</strong> = masquée en premier. Utilisez les flèches pour ajuster la priorité.
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--kap-font-ui)", fontSize: 12, fontWeight: 700, color: "var(--kap-fg-3)", background: "var(--kap-bg-2)", borderBottom: "2px solid var(--kap-divider)", whiteSpace: "nowrap" }}>
                  Colonne
                </th>
                {APR_ROLES.map(role => (
                  <th key={role} style={{ padding: "10px 16px", textAlign: "center", fontFamily: "var(--kap-font-ui)", fontSize: 12, fontWeight: 700, color: "var(--kap-fg-3)", background: "var(--kap-bg-2)", borderBottom: "2px solid var(--kap-divider)", whiteSpace: "nowrap" }}>
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page && page.columns.map((col, ci) => (
                <tr key={col} style={{ background: ci % 2 === 0 ? "#fff" : "var(--kap-bg-2)" }}>
                  <td style={{ padding: "10px 16px", fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-1)", borderBottom: "1px solid var(--kap-divider)", whiteSpace: "nowrap", fontWeight: 500 }}>
                    {col}
                  </td>
                  {APR_ROLES.map(role => {
                    const priority = getPriority(col, role);
                    const list = config[activePage][role];
                    const idx = list.indexOf(col);
                    return (
                      <td key={role} style={{ padding: "8px 12px", borderBottom: "1px solid var(--kap-divider)", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                          {priority !== null && (
                            <button type="button"
                              onClick={() => movePriority(col, role, -1)}
                              disabled={idx === 0}
                              style={{ all: "unset", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "var(--kap-fg-4)" : "var(--kap-fg-3)", padding: 2, borderRadius: 3, lineHeight: 1 }}>
                              <Icon name="chevron-up" size={14} />
                            </button>
                          )}
                          <button type="button"
                            onClick={() => toggleCol(col, role)}
                            style={cellStyle(priority)}
                            title={priority !== null ? "Cliquer pour retirer" : "Cliquer pour rendre masquable"}>
                            {priority !== null
                              ? <React.Fragment>
                                  <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, fontWeight: 700, color: "var(--kap-primary)" }}>{priority}</span>
                                  <Icon name="eye-off" size={13} style={{ color: "var(--kap-primary)" }} />
                                </React.Fragment>
                              : <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-4)" }}>—</span>
                            }
                          </button>
                          {priority !== null && (
                            <button type="button"
                              onClick={() => movePriority(col, role, 1)}
                              disabled={idx === list.length - 1}
                              style={{ all: "unset", cursor: idx === list.length - 1 ? "default" : "pointer", color: idx === list.length - 1 ? "var(--kap-fg-4)" : "var(--kap-fg-3)", padding: 2, borderRadius: 3, lineHeight: 1 }}>
                              <Icon name="chevron-down" size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4, borderTop: "1px solid var(--kap-divider)" }}>
          {saved && (
            <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-success)", display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
              <Icon name="check-circle-2" size={15} /> Enregistré
            </span>
          )}
          <Button variant="primary" icon="save" onClick={() => {
            const snap = JSON.parse(JSON.stringify(config));
            window.APR_SAVED_CONFIG = snap;
            try { localStorage.setItem("kap_apr_config", JSON.stringify(snap)); } catch(e) {}
            setSaved(true);
          }}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

function AdminScreen({ initialSub = "questionnaire" }) {
  const [activeSub, setActiveSub] = useStateCt(initialSub);
  const [questFilter, setQuestFilter] = useStateCt(null);

  React.useEffect(() => {
    setActiveSub(initialSub);
    if (initialSub !== "matrices-decision") setQuestFilter(null);
  }, [initialSub]);

  function goToMatrices(filter, count) {
    setQuestFilter({ libelle: filter, count });
    setActiveSub("matrices-decision");
  }

  if (activeSub === "questionnaire") return <QuestionnaireTab onGoToMatrices={goToMatrices} />;
  if (activeSub === "regles-service") return <ReglesServiceTab />;
  if (activeSub === "matrices-decision") return <MatricesDecisionTab questFilter={questFilter} onClearFilter={() => setQuestFilter(null)} />;
  if (activeSub === "affichage-par-role") return <AffichageParRoleTab />;
  return null;
}

const MATRICES = [
  { nature:"Demande",  sujet:"Outil", cible:"Kapitano",   perimetre:"Technique",                    symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Demande",  sujet:"Outil", cible:"Kapitano",   perimetre:"Référentiel",                  symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Demande",  sujet:"Outil", cible:"Kapitano",   perimetre:"Mobile",                       symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Demande",  sujet:"Outil", cible:"Kapitano",   perimetre:"Voix fixe",                    symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Demande",  sujet:"Outil", cible:"Kapitano",   perimetre:"Administration - Droits accès",symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Demande",  sujet:"Outil", cible:"Kali",       perimetre:"Demande générique",            symptome:"", codeKali:"APP-KALI",       queue:7 },
  { nature:"Incident", sujet:"Outil", cible:"Kargo",      perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-KARGO",      queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"Yoshipam",   perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-YOSHI",      queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"Ninjaconf",  perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-NINJA",      queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"APPIAN",     perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-APPIAN",     queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"Cfast",      perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-CFAST",      queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"NSM",        perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-NSM",        queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"Mon Mobile", perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-MONMOBILE",  queue:6 },
  { nature:"Incident", sujet:"Outil", cible:"Kapitano",   perimetre:"Incident applicatif",          symptome:"", codeKali:"APP-KAPITANO",   queue:6 },
  { nature:"Demande",  sujet:"Outil",    cible:"Kapitano",   perimetre:"Liens d'accès",                symptome:"", codeKali:"APP-KAPITANO",   queue:7 },
  { nature:"Incident", sujet:"Commande", cible:"Kapitano",   perimetre:"Mobile",                       symptome:"", codeKali:"APP-KAPITANO",   queue:5 },
  { nature:"Demande",  sujet:"Service",  cible:"Kargo",      perimetre:"Technique",                    symptome:"", codeKali:"APP-KARGO",      queue:4 },
];

const NATURE_ICON = {
  "Demande":  { icon:"chat_bubble", color:"#1976D2" },
  "Incident": { icon:"alert-triangle", color:"#ED6C02" },
};

function MatricesDecisionTab({ questFilter, onClearFilter }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [natureFilter, setNatureFilter] = useStateCt(null);
  const [sujetFilter, setSujetFilter] = useStateCt(null);
  const [questionnaireFilter, setQuestionnaireFilter] = useStateCt(questFilter || null);
  const [page, setPage] = useStateCt(1);

  React.useEffect(() => { setQuestionnaireFilter(questFilter || null); setPage(1); }, [questFilter]);
  const perPage = 15;
  const questLibelle = questionnaireFilter?.libelle || null;
  const questCount = questionnaireFilter?.count || null;
  const filtered = questLibelle && questCount !== null
    ? MATRICES.slice(0, questCount)
    : MATRICES;

  const matricesFieldMap = { "Nature": "nature", "Sujet": "sujet", "Type de cible": "cible", "Code catégorie Kali": "codeKali", "Dernière modification": "dateModif", "Mapping périmètre": "perimetre", "Mapping symptôme": "symptome", "Kali Queue": "queue" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setNatureFilter(null);
    setSujetFilter(null);
    setQuestionnaireFilter(null);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label;
  }

  const sortedFiltered = React.useMemo(() => {
    const lc = s => (s || "").toLowerCase();
    let data = filtered;
    if (natureFilter) data = data.filter(m => lc(m.nature) === lc(natureFilter));
    if (sujetFilter) data = data.filter(m => lc(m.sujet) === lc(sujetFilter));
    if (questionnaireFilter && typeof questionnaireFilter === "string") {
      const q = QUESTIONNAIRES.find(q => q.libelle === questionnaireFilter);
      if (q) data = data.slice(0, q.matrices);
    }
    const key = matricesFieldMap[sortBy];
    if (!key) return data;
    return [...data].sort((a, b) => {
      if (key === "queue") {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [filtered, natureFilter, sujetFilter, questionnaireFilter, sortBy, sortDir]);

  const TOTAL = questLibelle ? filtered.length : 56;
  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / perPage));
  const view = sortedFiltered.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer une matrice</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden" }}>
      {questLibelle && (
        <div style={{ padding:"8px 16px", background:"var(--kap-primary-soft)", borderBottom:"1px solid var(--kap-border-1)", display:"flex", alignItems:"center", gap:10, flexShrink:0, fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
          <Icon name="filter" size={16} style={{ color:"var(--kap-primary)" }} />
          <span style={{ color:"var(--kap-primary)" }}>Filtré par questionnaire : <strong>{questLibelle}</strong> — {filtered.length} matrice{filtered.length > 1 ? "s" : ""} affectée{filtered.length > 1 ? "s" : ""}</span>
          <button onClick={() => { setQuestionnaireFilter(null); if (onClearFilter) onClearFilter(); }} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"var(--kap-primary)", fontFamily:"var(--kap-font-ui)", fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
            <Icon name="x" size={14} />Effacer le filtre
          </button>
        </div>
      )}
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Dernière modification","Nature","Sujet","Type de cible","Code catégorie Kali"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par type de cible, code catégorie..." width={380} />
        <RadioDropdown placeholder="Nature" options={["Demande","Incident"]} value={natureFilter} onChange={setNatureFilter} width={140} showSearch={false} />
        <RadioDropdown placeholder="Sujet" options={["Outil","Service","Commande"]} value={sujetFilter} onChange={setSujetFilter} width={130} showSearch={false} />
        <RadioDropdown placeholder="Questionnaire" options={QUESTIONNAIRES.map(q => q.libelle)} value={questionnaireFilter} onChange={setQuestionnaireFilter} width={170} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Dernière modification")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Dernière modification")} dir={sortDir}>Dernière modification</SortHeader></th>
              <th onClick={() => handleColSort("Nature")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nature")} dir={sortDir}>Nature</SortHeader></th>
              <th onClick={() => handleColSort("Sujet")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Sujet")} dir={sortDir}>Sujet</SortHeader></th>
              <th onClick={() => handleColSort("Type de cible")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type de cible")} dir={sortDir}>Type de cible</SortHeader></th>
              <th onClick={() => handleColSort("Mapping périmètre")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Mapping périmètre")} dir={sortDir}>Mapping périmètre</SortHeader></th>
              <th onClick={() => handleColSort("Mapping symptôme")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Mapping symptôme")} dir={sortDir}>Mapping symptôme</SortHeader></th>
              <th onClick={() => handleColSort("Code catégorie Kali")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Code catégorie Kali")} dir={sortDir}>Code catégorie Kali</SortHeader></th>
              <th onClick={() => handleColSort("Kali Queue")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Kali Queue")} dir={sortDir}>Kali Queue</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((m, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">05/06/2026 - 13:35:38</td>
                <td>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--kap-font-ui)", fontSize:13 }}>
                    <Icon name={NATURE_ICON[m.nature].icon} size={16} style={{ color: NATURE_ICON[m.nature].color }} />
                    {m.nature}
                  </span>
                </td>
                <td>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-3)" }}>
                    {m.sujet === "Outil"    && <Icon name="wrench"          size={16} style={{ color:"var(--kap-fg-3)" }} />}
                    {m.sujet === "Commande" && <Icon name="shopping_cart"    size={16} style={{ color:"var(--kap-fg-3)" }} />}
                    {m.sujet === "Service"  && <Icon name="settings"         size={16} style={{ color:"var(--kap-fg-3)" }} />}
                    {m.sujet}
                  </span>
                </td>
                <td style={{ color: m.cible === "Kapitano" || m.cible === "APPIAN" ? "var(--kap-primary)" : "inherit", fontWeight: m.cible === "Kapitano" || m.cible === "APPIAN" ? 500 : 400 }}>{m.cible}</td>
                <td className="muted">{m.perimetre}</td>
                <td className="muted">{m.symptome || "—"}</td>
                <td className="mono muted">{m.codeKali}</td>
                <td>{m.queue}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL} perPage={perPage} />
      </div>
    </>
  );
}

function QuestionnaireTab({ onGoToMatrices }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [page, setPage] = useStateCt(1);
  const perPage = 15;

  const questFieldMap = { "Libellé": "libelle", "Dernière modification": "dateModif", "Nombre de questions": "nbQuestions", "Symptômes liés": "symptomes", "Matrices affectées": "matrices" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label;
  }

  const sorted = React.useMemo(() => {
    const key = questFieldMap[sortBy];
    if (!key) return QUESTIONNAIRES;
    return [...QUESTIONNAIRES].sort((a, b) => {
      if (key === "nbQuestions" || key === "matrices") {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const view = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="kap-card" style={{ overflow: "hidden" }}>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Dernière modification","Libellé"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par libellé" width={360} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Dernière modification")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Dernière modification")} dir={sortDir}>Dernière modification</SortHeader></th>
              <th onClick={() => handleColSort("Libellé")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Libellé")} dir={sortDir}>Libellé</SortHeader></th>
              <th onClick={() => handleColSort("Nombre de questions")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Nombre de questions")} dir={sortDir}>Nombre de questions</SortHeader></th>
              <th onClick={() => handleColSort("Symptômes liés")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Symptômes liés")} dir={sortDir}>Symptômes liés</SortHeader></th>
              <th onClick={() => handleColSort("Matrices affectées")} style={{ cursor: "pointer", userSelect: "none", textAlign: "center" }}><SortHeader active={colActive("Matrices affectées")} dir={sortDir}>Matrices affectées</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((q, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">{Q_DATE}</td>
                <td style={{ fontWeight: 600 }}>{q.libelle}</td>
                <td style={{ textAlign: "right" }}>{q.nbQuestions}</td>
                <td className="muted">{q.symptomes}</td>
                <td style={{ textAlign: "center" }}>
                  {q.matrices > 0 && onGoToMatrices
                    ? <span onClick={() => onGoToMatrices(q.libelle, q.matrices)} style={{ fontWeight:600, cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 }}>{q.matrices}</span>
                    : q.matrices
                  }
                </td>
                <td><Tooltip text="Voir le questionnaire" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={perPage} />
    </div>
  );
}

const REGLES_SERVICE = [
  { nom: "2 - Cinet",            action: "Exclure",     type: "Famille" },
  { nom: "3 - Cvoice",           action: "Exclure",     type: "Famille" },
  { nom: "43 - Colocation",      action: "Dédupliquer", type: "Sous-famille" },
  { nom: "44 - Connectivité",    action: "Dédupliquer", type: "Famille" },
  { nom: "10 - Option Centrex",  action: "Exclure",     type: "Article" },
  { nom: "11 - Option Cinet",    action: "Exclure",     type: "Article" },
  { nom: "23 - Option Cvoice",   action: "Dédupliquer", type: "Article" },
  { nom: "12 - Option Lien",     action: "Exclure",     type: "Sous-famille" },
  { nom: "21 - Option routeur",  action: "Dédupliquer", type: "Article" },
  { nom: "30 - Option VM",       action: "Exclure",     type: "Article" },
  { nom: "8 - SDA IP",           action: "Exclure",     type: "Famille" },
  { nom: "9 - SDA RNIS",         action: "Dédupliquer", type: "Famille" },
  { nom: "98 - Services SAAS",   action: "Exclure",     type: "Sous-famille" },
  { nom: "45 - Stockage",        action: "Dédupliquer", type: "Sous-famille" },
  { nom: "7 - Voix fixe",        action: "Exclure",     type: "Famille" },
  { nom: "5 - Mobile",           action: "Dédupliquer", type: "Famille" },
  { nom: "6 - Hébergement",      action: "Exclure",     type: "Sous-famille" },
  { nom: "13 - Option VM Pro",   action: "Dédupliquer", type: "Article" },
  { nom: "14 - Option Cloud",    action: "Exclure",     type: "Article" },
  { nom: "15 - Trunk SIP",       action: "Exclure",     type: "Famille" },
  { nom: "16 - Centrex",         action: "Dédupliquer", type: "Famille" },
];
const REGLE_DATE = "14/04/2026 - 14:02:47";

function ReglesServiceTab() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [sortDir, setSortDir] = useStateCt("asc");
  const [actionFilter, setActionFilter] = useStateCt([]);
  const [typeFilter, setTypeFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const perPage = 15;

  const reglesFieldMap = { "Dernière modification": "nom", "Action": "action", "Type": "type", "Nom": "nom" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() {
    setActionFilter([]);
    setTypeFilter([]);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Nom")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Nom");
  }
  const sortedRegles = React.useMemo(() => {
    let data = REGLES_SERVICE;
    if (actionFilter && actionFilter.length > 0) data = data.filter(r => actionFilter.includes(r.action));
    if (typeFilter && typeFilter.length > 0) data = data.filter(r => typeFilter.includes(r.type));
    const resolvedField = { "Dernière modification": "nom", "Action": "action", "Type": "type", "Nom": "nom" };
    const key = resolvedField[sortBy || "Nom"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [actionFilter, typeFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRegles.length / perPage));
  const view = sortedRegles.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer une règle</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden" }}>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Dernière modification","Action","Type","Nom"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par nom ou id de famille/article" width={380} />
        <RadioDropdown placeholder="Action" options={["Exclure","Dédupliquer"]} value={actionFilter} onChange={setActionFilter} width={130} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Type" options={["Famille","Sous-famille","Article"]} value={typeFilter} onChange={setTypeFilter} width={120} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Dernière modification")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Dernière modification")} dir={sortDir}>Dernière modification</SortHeader></th>
              <th onClick={() => handleColSort("Action")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Action")} dir={sortDir}>Action</SortHeader></th>
              <th onClick={() => handleColSort("Type")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type")} dir={sortDir}>Type</SortHeader></th>
              <th onClick={() => handleColSort("Nom")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nom")} dir={sortDir}>Nom</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">{REGLE_DATE}</td>
                <td className="muted">{r.action}</td>
                <td className="muted">{r.type}</td>
                <td>{r.nom}</td>
                <td><Tooltip text="Supprimer la règle" placement="top-end"><IconButton icon="x" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sortedRegles.length} perPage={perPage} />
      </div>
    </>
  );
}

Object.assign(window, { CommandesScreen, TechniqueScreen, AdminScreen, TicketDrawer, EquipmentDrawer, EligibiliteScreen, ProfilScreen });
