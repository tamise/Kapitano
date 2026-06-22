// Screens core — Login, Accueil, Utilisateurs (Liste + Logs + drawer)

const { useState: useStateScA, useMemo: useMemoScA, useEffect: useEffectScA } = React;

// ════════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useStateScA("mathis.bourgoin@koesio.com");
  const [pwd, setPwd] = useStateScA("kapitano-2025");
  const [remember, setRemember] = useStateScA(true);
  return (
    <div className="kap-login">
      <form className="kap-login-card" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="kap-login-logo">
          <img src="./assets/kapitano-logo-k.png" alt="Kapitano" />
        </div>
        <h1>Bienvenue sur Kapitano</h1>
        <div className="lead">Le portail revendeur Koesio</div>

        <div className="kap-field">
          <label className="kap-field-label" htmlFor="kap-email">Adresse e-mail</label>
          <Input icon="mail" placeholder="prenom.nom@koesio.com" value={email} onChange={setEmail} width="100%" />
        </div>
        <div className="kap-field">
          <label className="kap-field-label" htmlFor="kap-pwd">Mot de passe</label>
          <Input icon="lock" placeholder="••••••••" value={pwd} onChange={setPwd} type="password" width="100%" />
        </div>

        <div className="pwd-options">
          <label className="checkbox">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>Rester connecté</span>
          </label>
          <a>Mot de passe oublié&nbsp;?</a>
        </div>

        <Button variant="primary" size="lg" iconRight="arrow-right" onClick={onLogin}>SE CONNECTER</Button>

        <div style={{ textAlign: "center", fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)", marginTop: 4 }}>
          Pas encore de compte&nbsp;? <a className="kap-link">Contactez votre revendeur</a>
        </div>
      </form>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ACCUEIL
// ════════════════════════════════════════════════════════════════
function HomeScreen({ onNavigate }) {
  return (
    <>
      <div className="kap-card kap-welcome">
        <IconTile icon="sparkles" size={44} />
        <div className="text" style={{ flex: 1 }}>
          <div className="title">Bienvenue sur le nouveau dashboard Kapitano</div>
          <div className="sub">Retrouvez ici les derniers changements apportés à votre application.</div>
          <div className="sub sub-2">Nouvelle version 2.4 — Eligibilité multi-pays · Tickets liés aux services · Filtres avancés sur le suivi de commandes.</div>
        </div>
        <button className="close" aria-label="Fermer"><Icon name="x" size={18} /></button>
      </div>

      <div className="kap-section-grid-outer">
        <SectionCard icon="users" title="Utilisateurs" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "utilisateurs", sub: "liste",  label: "Liste",  desc: "Consultez et gérez la liste des utilisateurs" },
          { key: "utilisateurs", sub: "logs",   label: "Logs",   desc: "Consultez et analysez les journaux d'activité" },
        ]} />
        <SectionCard icon="book-open" title="Référentiel" count={5} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "referentiel", sub: "revendeurs", label: "Liste revendeurs", desc: "Consultez la liste des revendeurs" },
          { key: "referentiel", sub: "clients",    label: "Liste clients",    desc: "Consultez et gérez vos clients" },
          { key: "referentiel", sub: "sites",      label: "Liste des sites",  desc: "Consultez toutes les informations liées aux sites" },
          { key: "referentiel", sub: "services",   label: "Liste des services", desc: "Consultez la liste des services" },
          { key: "referentiel", sub: "catalogues", label: "Catalogue",        desc: "Consultez les articles du catalogue" },
        ]} />
        <SectionCard icon="smartphone" title="Mobiles" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "mobiles", sub: "abonnements", label: "Abonnements",          desc: "Consultez et gérez les abonnements mobiles" },
          { key: "mobiles", sub: "commandes",   label: "Commande mobile", desc: "Suivez et gérez les commandes mobiles" },
        ]} />
        <SectionCard icon="wifi" title="Liens d'accès" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "liens", sub: "abonnements", label: "Abonnements mobile data", desc: "Consultez et gérez les abonnements mobile data" },
          { key: "liens", sub: "commandes",   label: "Commandes",   desc: "Suivez et gérez les commandes mobiles data" },
        ]} />
        <SectionCard icon="phone-call" title="Voix fixe" count={6} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "voix", sub: "espaces",     label: "Espaces voix",        desc: "Consultez et gérez les espaces voix" },
          { key: "voix", sub: "trunk",       label: "Trunk SIP & Centrex",  desc: "Consultez et gérez les abonnements Trunk SIP & Centrex" },
          { key: "voix", sub: "trunk-cmd",   label: "Commandes Trunk SIP", desc: "Suivez et gérez les commandes Trunk SIP" },
          { key: "voix", sub: "portabilite", label: "Portabilité",         desc: "Consultez et gérez la portabilité" },
          { key: "voix", sub: "numeros",     label: "Numéros clients",     desc: "Consultez la liste des numéros fixes du client" },
          { key: "voix", sub: "numeros-rev", label: "Numéros revendeurs",  desc: "Consultez la liste des numéros fixes des revendeurs" },
        ]} />
        <SectionCard icon="receipt" title="Commandes" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "commandes", sub: "suivi",     label: "Suivi de commandes", desc: "Consultez et suivez toutes les commandes" },
          { key: "commandes", sub: "reporting", label: "Reporting",          desc: "Accédez aux rapports liés aux commandes" },
        ]} />
        <SectionCard icon="wrench" title="Technique" count={3} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "technique", sub: "tickets",        label: "Liste tickets",   desc: "Gérez les tickets de support et les problèmes techniques" },
          { key: "technique", sub: "configurations", label: "Configurations",  desc: "Gérez la configuration des équipements réseau" },
          { key: "technique", sub: "supervision",    label: "Supervision",     desc: "Supervisez les équipements réseau de vos clients" },
        ]} />
        <SectionCard icon="map-pin" title="Eligibilité" count={1} onSelect={(it) => onNavigate(it.key)} items={[
          { key: "eligibilite", label: "Recherche d'éligibilité", desc: "France · Suisse · Andorre · Canada · USA" },
        ]} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// UTILISATEURS — Liste + Logs
// ════════════════════════════════════════════════════════════════
const ROLE_COLORS = {
  "Administrateur": { bg: "#F3E5F5", color: "#6A1B9A" },
  "Manager":        { bg: "#E0F2F1", color: "#00695C" },
  "Support N1":     { bg: "#E8EAF6", color: "#283593" },
  "Support N2":     { bg: "#EDE7F6", color: "#4527A0" },
  "Opérateur":      { bg: "#F1F8E9", color: "#558B2F" },
  "Lecture seule":  { bg: "#EFEBE9", color: "#6D4C41" },
};
function RoleChip({ role }) {
  const c = ROLE_COLORS[role] || { bg: "#F5F5F5", color: "#616161" };
  return (
    <span className="kap-pill kap-pill--soft" style={{ "--bg": c.bg, "--fg": c.color }}>{role}</span>
  );
}
const REVENDEUR_OPTIONS = ["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"];

function CreateUserModal({ onClose, onCreate, initialValues, title = "Création d'un nouvel utilisateur" }) {
  const defaults = { prenom: "", nom: "", email: "", revendeur: "", role: "", type: "OKTA", actif: true };
  const [form, setForm] = useStateScA(initialValues ? { ...defaults, ...initialValues } : defaults);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  const roles = Object.keys(ROLE_COLORS);
  const isEdit = !!initialValues;

  function handleCreate() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const ts = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    onCreate({
      id: initialValues?.id || Date.now(),
      prenom: form.prenom,
      nom: form.nom.toUpperCase(),
      email: form.email,
      type: form.type,
      filiale: form.revendeur,
      statut: { label: form.actif ? "Actif" : "Inactif", color: form.actif ? "#2E7D32" : "#9E9E9E" },
      dateCreation: initialValues?.dateCreation || ts,
      dateModification: ts,
      role: form.role,
      revendeur: form.revendeur,
    });
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={<>
        <Button variant="tertiary" onClick={onClose}>Annuler</Button>
        <Button variant="primary" icon={isEdit ? "pencil" : "plus"} onClick={handleCreate}>{isEdit ? "Enregistrer" : "Créer l'utilisateur"}</Button>
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="kap-field" style={{ flex: 1 }}>
            <label className="kap-field-label">Prénom</label>
            <Input icon={null} placeholder="Prénom" value={form.prenom} onChange={v => set("prenom", v)} width="100%" />
          </div>
          <div className="kap-field" style={{ flex: 1 }}>
            <label className="kap-field-label">Nom</label>
            <Input icon={null} placeholder="Nom" value={form.nom} onChange={v => set("nom", v)} width="100%" />
          </div>
        </div>
        <div className="kap-field">
          <label className="kap-field-label">Adresse e-mail</label>
          <Input icon={null} placeholder="email@example.com" type="email" value={form.email} onChange={v => set("email", v)} width="100%" />
        </div>
        <div className="kap-field">
          <label className="kap-field-label">Revendeur associé</label>
          <RadioDropdown placeholder={form.revendeur || "Sélectionner un revendeur"} options={REVENDEUR_OPTIONS} value={form.revendeur} onChange={v => set("revendeur", v)} showRadio={false} showClear={false} block />
        </div>
        <div className="kap-field">
          <label className="kap-field-label">Rôle</label>
          <RadioDropdown placeholder={form.role || "Sélectionner un rôle"} options={roles} value={form.role} onChange={v => set("role", v)} showRadio={false} showSearch={false} showClear={false} block />
        </div>
        <div className="kap-field">
          <label className="kap-field-label">Type</label>
          <div style={{ display: "flex", gap: 24, marginTop: 2 }}>
            {["OKTA", "AUTH0"].map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-1)" }}>
                <input type="radio" name="create-user-type" checked={form.type === t} onChange={() => set("type", t)} style={{ accentColor: "var(--kap-primary)", width: 16, height: 16, cursor: "pointer" }} />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div className="kap-field">
          <label className="kap-field-label">État de l'utilisateur</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
            <Switch checked={form.actif} onChange={v => set("actif", v)} />
            <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-2)" }}>{form.actif ? "Actif" : "Inactif"}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const USERS_COL_WIDTHS = { "Actif": 80, "Nom": 72, "Prénom": 92, "Email": 82, "Type": 110, "Rôle": 76, "Revendeur associé": 158, "Date de création": 148, "_actions": 60 };
const LOGS_COL_WIDTHS  = { "ID": 60, "Date": 80, "Nom de l'utilisateur": 190, "Revendeur de l'utilisateur": 235, "Statut": 90, "Ressource": 115, "Description": 115, "Durée": 85, "_actions": 60 };

function UsersScreen({ initialTab = "liste", onOpenLog, onOpenUser, onCollapseSidebar, onExpandSidebar }) {
  const [showCreate, setShowCreate] = useStateScA(false);
  const [editUser, setEditUser] = useStateScA(null);
  const [resetUser, setResetUser] = useStateScA(null);
  const [selectedUser, setSelectedUser] = useStateScA(null);
  const [selectedLog, setSelectedLog] = useStateScA(null);

  function openDetail(u) {
    setSelectedUser(u);
    if (onCollapseSidebar) onCollapseSidebar();
  }

  function openLogDetail(l) {
    setSelectedLog(l);
    if (onCollapseSidebar) onCollapseSidebar();
  }

  useEffectScA(() => {
    setSelectedUser(null);
    setSelectedLog(null);
  }, [initialTab]);

  useEffectScA(() => {
    if (!selectedUser && !selectedLog && onExpandSidebar) onExpandSidebar();
  }, [selectedUser, selectedLog]);
  const [users, setUsers] = useStateScA(USERS);
  const [q, setQ] = useStateScA("");
  const [page, setPage] = useStateScA(1);
  const [sortBy, setSortBy] = useStateScA(null);
  const [sortDir, setSortDir] = useStateScA("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateScA(null);
  const [statutFilter, setStatutFilter] = useStateScA(null);
  const [typeFilter, setTypeFilter] = useStateScA([]);
  const [roleFilter, setRoleFilter] = useStateScA([]);
  const [logSortBy, setLogSortBy] = useStateScA(null);
  const [logSortDir, setLogSortDir] = useStateScA("asc");
  const [logRevendeur, setLogRevendeur] = useStateScA(null);
  const [logClient, setLogClient] = useStateScA(null);
  const [logDate, setLogDate] = useStateScA(null); // { debut, fin }
  const [logStatut, setLogStatut] = useStateScA([]);
  const [logRessources, setLogRessources] = useStateScA([]);
  const perPage = 15;
  const [logPage, setLogPage] = useStateScA(1);
  const { tableRef: usersTableRef, hiddenCols: uHid, revealCol: uReveal, tableMinWidth: uMinW } = useHideableColumns("utilisateurs", USERS_COL_WIDTHS);
  const { tableRef: logsTableRef,  hiddenCols: lHid, revealCol: lReveal, tableMinWidth: lMinW  } = useHideableColumns("logs", LOGS_COL_WIDTHS);

  const userFieldMap = {
    "Date de création": "dateCreation",
    "Actif": "statut.label",
    "Nom": "nom",
    "Prénom": "prenom",
    "Email": "email",
    "Type": "type",
    "Rôle": "role",
    "Revendeur associé": "revendeur",
  };

  const logFieldMap = {
    "Date de création": "dateCreation",
    "Nom de l'utilisateur": "nomUtilisateur",
    "Revendeur de l'utilisateur": "dateCreation",
    "Statut": "statut.code",
    "Ressources": "type",
    "Durée": "duree",
  };

  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleLogSortChange(field, dir) { setLogSortBy(field); setLogSortDir(dir); }

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

  function handleLogColSort(label) {
    if (logSortBy === label || (logSortBy === null && label === "Date de création")) {
      setLogSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setLogSortBy(label);
      setLogSortDir("asc");
    }
  }

  function logColActive(label) {
    return logSortBy === label || (logSortBy === null && label === "Date de création");
  }

  function handleReset() {
    setQ("");
    setRevendeurFilter(null);
    setStatutFilter(null);
    setTypeFilter([]);
    setRoleFilter([]);
    setSortBy(null);
    setSortDir("asc");
  }

  function handleLogReset() {
    setLogRevendeur(null);
    setLogClient(null);
    setLogDate(null);
    setLogStatut([]);
    setLogRessources([]);
    setLogSortBy(null);
    setLogSortDir("asc");
  }

  const filtered = useMemoScA(() => {
    const n = q.trim().toLowerCase();
    let data = n ? users.filter(u => (u.prenom + " " + u.nom + " " + u.email).toLowerCase().includes(n)) : users;
    if (revendeurFilter) data = data.filter(u => u.revendeur === revendeurFilter);
    if (statutFilter) data = data.filter(u => u.statut && u.statut.label === statutFilter);
    if (typeFilter && typeFilter.length) data = data.filter(u => typeFilter.includes(u.type));
    if (roleFilter && roleFilter.length) data = data.filter(u => roleFilter.includes(u.role));
    return data;
  }, [users, q, revendeurFilter, statutFilter, typeFilter, roleFilter]);

  const sortedFiltered = useMemoScA(() => {
    const sortField = sortBy || "Date de création";
    const key = userFieldMap[sortField];
    if (!key) return filtered;
    const pdn = s => { const p = String(s || "").split("/"); return p.length >= 3 ? parseInt(p[2].split(" ")[0],10)*10000+parseInt(p[1],10)*100+parseInt(p[0],10) : 0; };
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (key === "statut.label") { va = a.statut ? a.statut.label || "" : ""; vb = b.statut ? b.statut.label || "" : ""; }
      else if (key === "dateCreation") { va = pdn(a.dateCreation); vb = pdn(b.dateCreation); return sortDir === "asc" ? va - vb : vb - va; }
      else { va = a[key] || ""; vb = b[key] || ""; }
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / perPage));
  const view = sortedFiltered.slice((page - 1) * perPage, page * perPage);

  const sortedLogs = useMemoScA(() => {
    // Filtrage
    const toSortDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    let data = LOGS;
    if (logRevendeur) data = data.filter(l => l.user && l.user.revendeur === logRevendeur);
    if (logClient)    data = data.filter(l => l.nomUtilisateur === logClient);
    if (logDate && (logDate.debut || logDate.fin)) {
      data = data.filter(l => {
        const d = toSortDate(l.dateCreation || "");
        if (logDate.debut && d < toSortDate(logDate.debut)) return false;
        if (logDate.fin   && d > toSortDate(logDate.fin))   return false;
        return true;
      });
    }
    if (logStatut && logStatut.length)    data = data.filter(l => l.statut && logStatut.includes(String(l.statut.code)));
    if (logRessources && logRessources.length) data = data.filter(l => logRessources.includes(l.type));
    // Tri
    const sortField = logSortBy || "Date de création";
    const key = logFieldMap[sortField];
    if (!key) return data;
    return [...data].sort((a, b) => {
      let va, vb;
      const pdn = s => { const p = String(s || "").split("/"); return p.length >= 3 ? parseInt(p[2].split(" ")[0],10)*10000+parseInt(p[1],10)*100+parseInt(p[0],10) : 0; };
      if (key === "statut.code") {
        va = a.statut ? Number(a.statut.code) : 0;
        vb = b.statut ? Number(b.statut.code) : 0;
        return logSortDir === "asc" ? va - vb : vb - va;
      }
      if (key === "dateCreation") { return logSortDir === "asc" ? pdn(a.dateCreation) - pdn(b.dateCreation) : pdn(b.dateCreation) - pdn(a.dateCreation); }
      va = a[key] || ""; vb = b[key] || "";
      return logSortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [logSortBy, logSortDir, logRevendeur, logClient, logDate, logStatut, logRessources]);

  const logTotalPages = Math.max(1, Math.ceil(sortedLogs.length / 15));
  const logView = sortedLogs.slice((logPage - 1) * 15, logPage * 15);

  const isLogs = initialTab === "logs";

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(isLogs
      ? null
      : <><Button variant="primary" icon="plus" onClick={() => setShowCreate(true)}>Ajouter un utilisateur</Button></>
    );
    return () => setTopbarActions(null);
  }, [isLogs]);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden", flexDirection: (selectedUser || selectedLog) ? "row" : undefined }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, ...((selectedUser || selectedLog) ? { minWidth: 0, overflowX: "auto" } : {}) }}>
        {!isLogs &&
          <>
            <Toolbar wrap={!!selectedUser}>
              <RadioDropdown placeholder="Trier" options={["Date de création","Actif","Nom","Prénom","Email","Revendeur associé"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
              <Input placeholder="Recherche par nom, prénom, e-mail" value={q} onChange={(v) => { setQ(v); setPage(1); }} width={360} />
              {selectedUser && <div className="grow" />}
              {selectedUser && <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>}
              {selectedUser && <div style={{ flexBasis: "100%", height: 0 }} />}
              <RadioDropdown
                placeholder="Revendeur"
                options={REVENDEUR_OPTIONS}
                value={revendeurFilter}
                onChange={setRevendeurFilter}
                width={190}
              />
              <RadioDropdown placeholder="Statut" options={["Actif","Inactif"]} value={statutFilter} onChange={setStatutFilter} width={140} showSearch={false} />
              <RadioDropdown placeholder="Type" options={["AUTH0","OKTA"]} value={typeFilter} onChange={setTypeFilter} width={140} showSearch={false} multiSelect={true} />
              <RadioDropdown placeholder="Rôle" options={["Administrateur","Manager","Support N1","Lecture seule","Support N2","Opérateur"]} value={roleFilter} onChange={setRoleFilter} width={150} showSearch={false} multiSelect={true} />
              {!selectedUser && <div className="grow" />}
              {!selectedUser && <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>}
            </Toolbar>
            <TableBox>
              <table ref={usersTableRef} className="kap-table" style={{ minWidth: uMinW }}>
                <thead>
                  <tr>
                    {uHid.includes("Actif") ? <HiddenTh name="Actif" onReveal={() => uReveal("Actif")} /> : <th onClick={() => handleColSort("Actif")} style={{ cursor: "pointer", userSelect: "none", width: 80 }}><SortHeader active={colActive("Actif")} dir={sortDir}>Actif</SortHeader></th>}
                    {uHid.includes("Nom") ? <HiddenTh name="Nom" onReveal={() => uReveal("Nom")} /> : <th onClick={() => handleColSort("Nom")} style={{ cursor: "pointer", userSelect: "none", minWidth: 72 }}><SortHeader active={colActive("Nom")} dir={sortDir}>Nom</SortHeader></th>}
                    {uHid.includes("Prénom") ? <HiddenTh name="Prénom" onReveal={() => uReveal("Prénom")} /> : <th onClick={() => handleColSort("Prénom")} style={{ cursor: "pointer", userSelect: "none", minWidth: 92 }}><SortHeader active={colActive("Prénom")} dir={sortDir}>Prénom</SortHeader></th>}
                    {uHid.includes("Email") ? <HiddenTh name="Email" onReveal={() => uReveal("Email")} /> : <th onClick={() => handleColSort("Email")} style={{ cursor: "pointer", userSelect: "none", minWidth: 82 }}><SortHeader active={colActive("Email")} dir={sortDir}>Email</SortHeader></th>}
                    {uHid.includes("Type") ? <HiddenTh name="Type" onReveal={() => uReveal("Type")} /> : <th onClick={() => handleColSort("Type")} style={{ cursor: "pointer", userSelect: "none", width: 110 }}><SortHeader active={colActive("Type")} dir={sortDir}>Type</SortHeader></th>}
                    {uHid.includes("Rôle") ? <HiddenTh name="Rôle" onReveal={() => uReveal("Rôle")} /> : <th onClick={() => handleColSort("Rôle")} style={{ cursor: "pointer", userSelect: "none", minWidth: 76 }}><SortHeader active={colActive("Rôle")} dir={sortDir}>Rôle</SortHeader></th>}
                    {uHid.includes("Revendeur associé") ? <HiddenTh name="Revendeur associé" onReveal={() => uReveal("Revendeur associé")} /> : <th onClick={() => handleColSort("Revendeur associé")} style={{ cursor: "pointer", userSelect: "none", minWidth: 158 }}><SortHeader active={colActive("Revendeur associé")} dir={sortDir}>Revendeur associé</SortHeader></th>}
                    {uHid.includes("Date de création") ? <HiddenTh name="Date de création" onReveal={() => uReveal("Date de création")} /> : <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none", minWidth: 148 }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>}
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {view.map(u => (
                    <tr key={u.id}
                      className={selectedUser ? "is-clickable" + (selectedUser.id === u.id ? " is-selected" : "") : ""}
                      onClick={selectedUser ? () => setSelectedUser(u) : undefined}
                    >
                      {uHid.includes("Actif") ? <td style={{ width: 28, padding: 0 }} /> : <td>{u.statut.label === "Actif" ? <Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /> : <Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} />}</td>}
                      {uHid.includes("Nom") ? <td style={{ width: 28, padding: 0 }} /> : <td style={{ fontWeight: 600 }}>{u.nom}</td>}
                      {uHid.includes("Prénom") ? <td style={{ width: 28, padding: 0 }} /> : <td>{u.prenom}</td>}
                      {uHid.includes("Email") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{u.email}</td>}
                      {uHid.includes("Type") ? <td style={{ width: 28, padding: 0 }} /> : <td><span className="kap-pill kap-pill--soft" style={u.type === "AUTH0" ? { "--bg": "#FFF3E0", "--fg": "#E65100" } : { "--bg": "#F5F5F5", "--fg": "#212121" }}>{u.type}</span></td>}
                      {uHid.includes("Rôle") ? <td style={{ width: 28, padding: 0 }} /> : <td><RoleChip role={u.role} /></td>}
                      {uHid.includes("Revendeur associé") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{u.revendeur}</td>}
                      {uHid.includes("Date de création") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{u.dateCreation}</td>}
                      <td onClick={e => e.stopPropagation()}><RowMenu items={[
                        { label: "Consulter", icon: "eye", onClick: () => openDetail(u) },
                        { label: "Modifier", icon: "pencil", onClick: () => setEditUser(u) },
                        { label: "Réinitialiser le mot de passe", icon: "key", danger: true, disabled: u.type === "OKTA", onClick: () => setResetUser(u) },
                      ]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={filtered.length} perPage={perPage} />
          </>}
        {isLogs &&
          <>
            <Toolbar wrap={!!selectedLog}>
              <RadioDropdown placeholder="Trier" options={["Date de création","Nom de l'utilisateur","Revendeur de l'utilisateur","Statut","Ressources","Durée"]} value={logSortBy} onChange={setLogSortBy} onSortChange={handleLogSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
              <Input icon="search" placeholder="Statut, Email, Nom et Prénom" width={360} />
              {selectedLog && <div className="grow" />}
              {selectedLog && <Button variant="tertiary" icon="refresh-cw" onClick={handleLogReset}>Réinitialiser</Button>}
              {selectedLog && <div style={{ flexBasis: "100%", height: 0 }} />}
              <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={logRevendeur} onChange={setLogRevendeur} width={170} />
              <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={logClient} onChange={setLogClient} width={160} />
              <DateRangeDropdown placeholder="Date" value={logDate} onChange={setLogDate} width={160} />
              <RadioDropdown placeholder="Statut" options={["200","201","400","403","404","409","422","500","501","502"]} value={logStatut} onChange={setLogStatut} width={160} showSearch={false} multiSelect={true} />
              <RadioDropdown placeholder="Ressources" options={["configuration_ninja_conf","data_reference_client","dispatcher","eligibility","mobile","order","portability","ticket","unidentified resource","user"]} value={logRessources} onChange={setLogRessources} width={160} showSearch={false} multiSelect={true} />
              {!selectedLog && <div className="grow" />}
              {!selectedLog && <Button variant="tertiary" icon="refresh-cw" onClick={handleLogReset}>Réinitialiser</Button>}
            </Toolbar>
            <TableBox>
              <table ref={logsTableRef} className="kap-table" style={{ minWidth: lMinW }}>
                <thead>
                  <tr>
                    {lHid.includes("ID") ? <HiddenTh name="ID" onReveal={() => lReveal("ID")} /> : <th style={{ width: 60 }}>ID</th>}
                    {lHid.includes("Date") ? <HiddenTh name="Date" onReveal={() => lReveal("Date")} /> : <th onClick={() => handleLogColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none", minWidth: 80 }}><SortHeader active={logColActive("Date de création")} dir={logSortDir}>Date</SortHeader></th>}
                    {lHid.includes("Nom de l'utilisateur") ? <HiddenTh name="Nom de l'utilisateur" onReveal={() => lReveal("Nom de l'utilisateur")} /> : <th onClick={() => handleLogColSort("Nom de l'utilisateur")} style={{ cursor: "pointer", userSelect: "none", minWidth: 190 }}><SortHeader active={logColActive("Nom de l'utilisateur")} dir={logSortDir}>Nom de l'utilisateur</SortHeader></th>}
                    {lHid.includes("Revendeur de l'utilisateur") ? <HiddenTh name="Revendeur de l'utilisateur" onReveal={() => lReveal("Revendeur de l'utilisateur")} /> : <th onClick={() => handleLogColSort("Revendeur de l'utilisateur")} style={{ cursor: "pointer", userSelect: "none", minWidth: 235 }}><SortHeader active={logColActive("Revendeur de l'utilisateur")} dir={logSortDir}>Revendeur de l'utilisateur</SortHeader></th>}
                    {lHid.includes("Statut") ? <HiddenTh name="Statut" onReveal={() => lReveal("Statut")} /> : <th onClick={() => handleLogColSort("Statut")} style={{ cursor: "pointer", userSelect: "none", width: 90 }}><SortHeader active={logColActive("Statut")} dir={logSortDir}>Statut</SortHeader></th>}
                    {lHid.includes("Ressource") ? <HiddenTh name="Ressource" onReveal={() => lReveal("Ressource")} /> : <th onClick={() => handleLogColSort("Ressources")} style={{ cursor: "pointer", userSelect: "none", minWidth: 115 }}><SortHeader active={logColActive("Ressources")} dir={logSortDir}>Ressource</SortHeader></th>}
                    {lHid.includes("Description") ? <HiddenTh name="Description" onReveal={() => lReveal("Description")} /> : <th style={{ minWidth: 115 }}>Description</th>}
                    {lHid.includes("Durée") ? <HiddenTh name="Durée" onReveal={() => lReveal("Durée")} /> : <th onClick={() => handleLogColSort("Durée")} style={{ cursor: "pointer", userSelect: "none", minWidth: 85 }}><SortHeader active={logColActive("Durée")} dir={logSortDir}>Durée</SortHeader></th>}
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {logView.map(l => (
                    <tr key={l.id}
                      className={selectedLog ? "is-clickable" + (selectedLog.id === l.id ? " is-selected" : "") : ""}
                      onClick={selectedLog ? () => setSelectedLog(l) : undefined}
                    >
                      {lHid.includes("ID") ? <td style={{ width: 28, padding: 0 }} /> : <td className="mono muted">{l.id}</td>}
                      {lHid.includes("Date") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{l.dateCreation}</td>}
                      {lHid.includes("Nom de l'utilisateur") ? <td style={{ width: 28, padding: 0 }} /> : <td>{l.nomUtilisateur}</td>}
                      {lHid.includes("Revendeur de l'utilisateur") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{l.user.revendeur}</td>}
                      {lHid.includes("Statut") ? <td style={{ width: 28, padding: 0 }} /> : <td><Tooltip text={({ 200:"OK — Requête traitée avec succès", 201:"Created — Ressource créée avec succès", 400:"Bad Request — Requête invalide", 403:"Forbidden — Accès refusé", 404:"Not Found — Ressource introuvable", 409:"Conflict — Conflit avec l'état actuel", 422:"Unprocessable Entity — Données non traitables", 500:"Internal Server Error — Erreur serveur interne", 501:"Not Implemented — Fonctionnalité non implémentée", 502:"Bad Gateway — Passerelle invalide" })[l.statut.code]}><HttpCode code={l.statut.code} kind={l.statut.kind} /></Tooltip></td>}
                      {lHid.includes("Ressource") ? <td style={{ width: 28, padding: 0 }} /> : <td className="mono muted">{l.type}</td>}
                      {lHid.includes("Description") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{l.description}</td>}
                      {lHid.includes("Durée") ? <td style={{ width: 28, padding: 0 }} /> : <td className="muted">{l.duree}</td>}
                      <td onClick={e => e.stopPropagation()}><Tooltip text="Voir le détail"><IconButton icon="eye" onClick={() => openLogDetail(l)} ariaLabel="Voir le détail" /></Tooltip></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <Pagination page={logPage} totalPages={logTotalPages} onChange={setLogPage} totalItems={LOGS.length} perPage={15} />
          </>}

        </div>
        {selectedUser && (
          <div style={{ width: 600, flexShrink: 0, borderLeft: "1px solid var(--kap-divider)", display: "flex", flexDirection: "column" }}>
            <UserDetailPanel
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onEdit={u => setEditUser(u)}
              onReset={u => setResetUser(u)}
            />
          </div>
        )}
        {selectedLog && (
          <div style={{ width: 600, flexShrink: 0, borderLeft: "1px solid var(--kap-divider)", display: "flex", flexDirection: "column" }}>
            <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
          </div>
        )}
      </div>
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreate={u => { setUsers(prev => [u, ...prev]); setShowCreate(false); }} />}
      {resetUser && (
        <Modal
          title="Réinitialisation du mot de passe"
          onClose={() => setResetUser(null)}
          footer={<>
            <Button variant="tertiary" onClick={() => setResetUser(null)}>Annuler</Button>
            <Button variant="primary" onClick={() => setResetUser(null)}>Confirmer</Button>
          </>}
        >
          <p style={{ fontFamily: "var(--kap-font-ui)", fontSize: 14, color: "var(--kap-fg-1)", margin: 0, lineHeight: 1.6 }}>
            Un lien de réinitialisation du mot de passe sera envoyé à l'adresse{" "}
            <strong>{resetUser.email}</strong>.
          </p>
        </Modal>
      )}
      {editUser && <CreateUserModal
        title="Modifier un utilisateur"
        initialValues={{ id: editUser.id, prenom: editUser.prenom, nom: editUser.nom, email: editUser.email, revendeur: editUser.revendeur, role: editUser.role, type: editUser.type, actif: editUser.statut?.label === "Actif", dateCreation: editUser.dateCreation }}
        onClose={() => setEditUser(null)}
        onCreate={updated => { setUsers(prev => prev.map(u => u.id === updated.id ? updated : u)); setEditUser(null); }}
      />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// DRAWERS — User detail + Request log detail
// ════════════════════════════════════════════════════════════════
function UserDetailBody({ user }) {
  return (
    <>
      <DetailSection title="Informations">
        <DetailRow label="Adresse e-mail"><a className="kap-link">{user.email}</a></DetailRow>
        <DetailRow label="Type d'utilisateur">
          <span className="kap-pill kap-pill--soft" style={user.type === "AUTH0" ? { "--bg": "#FFF3E0", "--fg": "#E65100" } : { "--bg": "#F5F5F5", "--fg": "#212121" }}>{user.type}</span>
        </DetailRow>
        <DetailRow label="Rôle"><RoleChip role={user.role} /></DetailRow>
        <DetailRow label="Filiale">{user.filiale}</DetailRow>
      </DetailSection>
      <DetailSection title="Historique">
        <DetailRow label="Date de création">{user.dateCreation}</DetailRow>
        <DetailRow label="Date de modification">{user.dateModification}</DetailRow>
        <DetailRow label="Dernière connexion">12/11/2025 - 09:48:12</DetailRow>
      </DetailSection>
      <DetailSection title="Accès">
        <DetailRow label="Périmètre">Tous les clients de {user.filiale}</DetailRow>
        <DetailRow label="Permissions">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>Lecture</span>
            <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>Écriture</span>
            <span className="kap-pill kap-pill--soft" style={{ "--bg": "#E6F2E7", "--fg": "var(--kap-success)" }}>Commandes</span>
            <span className="kap-pill kap-pill--soft" style={{ "--bg": "#FBE9D6", "--fg": "var(--kap-warning)" }}>Tickets</span>
          </div>
        </DetailRow>
      </DetailSection>
    </>
  );
}

function UserDetailHeader({ user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 9999, background: "var(--kap-primary)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
        {user.prenom[0]}{user.nom[0]}
      </div>
      <div>
        <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16 }}>{user.prenom} {user.nom}</div>
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-2)" }}>
          {user.statut.label === "Actif"
            ? <Icon name="check-circle-2" size={16} style={{ color: "#2E7D32" }} />
            : <Icon name="x-circle" size={16} style={{ color: "#D32F2F" }} />}
          {user.statut.label}
        </div>
      </div>
    </div>
  );
}

function UserDetailPanel({ user, onClose, onEdit, onReset }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--kap-divider)", flexShrink: 0 }}>
        <UserDetailHeader user={user} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button className="kap-icon-btn-square" style={{ marginLeft: 4 }} onClick={() => onEdit && onEdit(user)} aria-label="Modifier">
            <Icon name="pencil" size={20} />
          </button>
          <button className="kap-icon-btn-square" onClick={onClose} aria-label="Fermer">
            <Icon name="x" size={20} />
          </button>
        </div>
      </div>
      <div className="kap-drawer-body" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--kap-divider)" }}>
          <Button variant="danger" icon="key" disabled={user.type === "OKTA"} onClick={() => onReset && onReset(user)}>Réinitialiser le mot de passe</Button>
        </div>
        <UserDetailBody user={user} />
      </div>
    </div>
  );
}

function UserDrawer({ user, onClose, onEdit, onReset }) {
  return (
    <Drawer
      headerContent={<UserDetailHeader user={user} />}
      onClose={onClose}
      footer={<>
        <Button variant="secondary" icon="key" disabled={user.type === "OKTA"} onClick={() => onReset && onReset(user)}>Réinitialiser le mot de passe</Button>

        <Button variant="primary" icon="pencil" onClick={() => onEdit && onEdit(user)}>Modifier</Button>
      </>}
    >
      <UserDetailBody user={user} />
    </Drawer>
  );
}

function LogDetailPanel({ log, onClose }) {
  const [tab, setTab] = useStateScA("requete");
  const payload = JSON.stringify(SAMPLE_PAYLOAD, null, 2);
  const response = JSON.stringify(SAMPLE_RESPONSE, null, 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, color: "var(--kap-fg-1)" }}>
          Requête <span className="kap-mono" style={{ color: "var(--kap-fg-3)", fontWeight: 400, fontSize: 15 }}>#{log.id}</span>
        </div>
        <button style={{ all: "unset", cursor: "pointer", padding: 6, borderRadius: 4, color: "var(--kap-fg-3)" }} onClick={onClose} aria-label="Fermer">
          <Icon name="x" size={20} />
        </button>
      </div>
      <div style={{ background: "#fff", padding: "0 16px", borderTop: "1px solid var(--kap-divider)", flexShrink: 0 }}>
        <div className="kap-tabs" style={{ padding: 0, borderRadius: 0 }}>
          <div className={"tab" + (tab === "requete" ? " is-active" : "")} onClick={() => setTab("requete")}>Requête</div>
          <div className={"tab" + (tab === "utilisateur" ? " is-active" : "")} onClick={() => setTab("utilisateur")}>Utilisateur</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {tab === "requete" ? (
          <React.Fragment>
          <DetailSection>
            <DetailRow label="Date de création">{log.dateCreation}</DetailRow>
            <DetailRow label="URI"><span className="kap-mono">{log.uri}</span></DetailRow>
            <DetailRow label="Méthode"><MethodTag method={log.methode} /></DetailRow>
            <DetailRow label="Type de ressource">{log.type}</DetailRow>
            <DetailRow label="Statut de la réponse"><HttpCode code={log.statut.code} kind={log.statut.kind} /></DetailRow>
            <DetailRow label="Description"><span style={{ color: "var(--kap-fg-1)" }}>{log.description}</span></DetailRow>
          </DetailSection>
          <div className="kap-detail-section">
            <div style={{ padding: "10px 16px", fontFamily: "var(--kap-font-ui)", fontSize: 13, fontWeight: 500, color: "var(--kap-fg-3)", borderBottom: "1px solid var(--kap-divider)" }}>Contenu de la requête</div>
            <CodeBlock value={payload} />
          </div>
          <div className="kap-detail-section">
            <div style={{ padding: "10px 16px", fontFamily: "var(--kap-font-ui)", fontSize: 13, fontWeight: 500, color: "var(--kap-fg-3)", borderBottom: "1px solid var(--kap-divider)" }}>Résultat de la requête</div>
            <CodeBlock value={response} />
          </div>
          <DetailSection>
            <DetailRow label="Adresse IP"><span className="kap-mono">{log.adresseIp}</span></DetailRow>
            <DetailRow label="Agent utilisateur"><span className="kap-mono">{log.agentUtilisateur}</span></DetailRow>
            <DetailRow label="Durée"><span className="kap-mono">{log.duree}</span></DetailRow>
          </DetailSection>
          </React.Fragment>
        ) : (
          <DetailSection title="Utilisateur">
            <DetailRow label="Nom">{log.nomUtilisateur}</DetailRow>
            {["MSM","KRAFTERY"].includes(log.nomUtilisateur)
              ? <DetailRow label="Type d'utilisateur">API</DetailRow>
              : <>
                  <DetailRow label="Email"><a className="kap-link">{log.user.email}</a></DetailRow>
                  <DetailRow label="Type d'utilisateur">{log.user.type}</DetailRow>
                  <DetailRow label="Rôle">{log.user.role}</DetailRow>
                  <DetailRow label="Filiale">{log.user.filiale}</DetailRow>
                  <DetailRow label="Date de création">{log.user.dateCreation}</DetailRow>
                </>
            }
          </DetailSection>
        )}
      </div>
    </div>
  );
}

function LogDrawer({ log, onClose }) {
  const [tab, setTab] = useStateScA("requete");
  const [copied, setCopied] = useStateScA(false);
  const payload = JSON.stringify(SAMPLE_PAYLOAD, null, 2);
  const response = JSON.stringify(SAMPLE_RESPONSE, null, 2);

  function handleCopy() {
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <Drawer
      title={<>Requête <span className="kap-mono" style={{ color: "var(--kap-fg-3)" }}>#{log.id}</span></>}
      subtitle={`${log.methode} ${log.uri}`}
      onClose={onClose}
      footer={null}
    >
      <div style={{ padding: "14px 24px", display: "flex", gap: 8, alignItems: "center", borderBottom: "1px solid var(--kap-divider)", background: "#fff" }}>
        <MethodTag method={log.methode} />
        <span className="kap-mono" style={{ fontSize: 13, color: "var(--kap-fg-1)" }}>{log.uri}</span>
        <div style={{ flex: 1 }} />
        <HttpCode code={log.statut.code} kind={log.statut.kind} />
        <span style={{ fontFamily: "var(--kap-font-mono)", fontSize: 12, color: "var(--kap-fg-3)" }}>{log.duree}</span>
      </div>
      <div style={{ background: "#fff", padding: "0 24px" }}>
        <div className="kap-tabs" style={{ padding: 0, borderRadius: 0 }}>
          <div className={"tab" + (tab === "requete" ? " is-active" : "")} onClick={() => setTab("requete")}>Requête</div>
          <div className={"tab" + (tab === "utilisateur" ? " is-active" : "")} onClick={() => setTab("utilisateur")}>Utilisateur</div>
        </div>
      </div>
      {tab === "requete" ? (
        <>
          <DetailSection title="Détail de la requête">
            <DetailRow label="Date de création">{log.dateCreation}</DetailRow>
            <DetailRow label="URI"><span className="kap-mono">{log.uri}</span></DetailRow>
            <DetailRow label="Méthode"><MethodTag method={log.methode} /></DetailRow>
            <DetailRow label="Type de ressource">{log.type}</DetailRow>
            <DetailRow label="Statut de la réponse"><HttpCode code={log.statut.code} kind={log.statut.kind} /></DetailRow>
            <DetailRow label="Description"><span style={{ color: "var(--kap-fg-1)" }}>{log.description}</span></DetailRow>
            <DetailRow label="Contenu de la requête">
              <div style={{ width: "100%", marginTop: 4 }}><CodeBlock value={payload} /></div>
            </DetailRow>
            <DetailRow label="Résultat de la requête">
              <div style={{ width: "100%", marginTop: 4 }}><CodeBlock value={response} /></div>
            </DetailRow>
            <DetailRow label="Adresse IP"><span className="kap-mono">{log.adresseIp}</span></DetailRow>
            <DetailRow label="Agent utilisateur"><span className="kap-mono">{log.agentUtilisateur}</span></DetailRow>
            <DetailRow label="Durée"><span className="kap-mono">{log.duree}</span></DetailRow>
          </DetailSection>
        </>
      ) : (
        <>
          <DetailSection title="Utilisateur">
            <DetailRow label="Nom">{log.nomUtilisateur}</DetailRow>
            {["MSM","KRAFTERY"].includes(log.nomUtilisateur)
              ? <DetailRow label="Type d'utilisateur">API</DetailRow>
              : <>
                  <DetailRow label="Email"><a className="kap-link">{log.user.email}</a></DetailRow>
                  <DetailRow label="Type d'utilisateur">{log.user.type}</DetailRow>
                  <DetailRow label="Rôle">{log.user.role}</DetailRow>
                  <DetailRow label="Filiale">{log.user.filiale}</DetailRow>
                  <DetailRow label="Date de création">{log.user.dateCreation}</DetailRow>
                </>
            }
          </DetailSection>
        </>
      )}
    </Drawer>
  );
}

Object.assign(window, { LoginScreen, HomeScreen, UsersScreen, UserDrawer, LogDrawer, CreateUserModal });
