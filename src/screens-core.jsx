// Screens core — Login, Accueil, Utilisateurs (Liste + Logs + drawer)

const { useState: useStateScA, useMemo: useMemoScA } = React;

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
function UsersScreen({ initialTab = "liste", onOpenLog, onOpenUser }) {
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

  const userFieldMap = {
    "Date de création": "dateCreation",
    "Actif": "statut.label",
    "Nom": "nom",
    "Prénom": "prenom",
    "Email": "email",
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

  const filtered = useMemoScA(() => {
    const n = q.trim().toLowerCase();
    let data = n ? USERS.filter(u => (u.prenom + " " + u.nom + " " + u.email).toLowerCase().includes(n)) : USERS;
    if (revendeurFilter) data = data.filter(u => u.revendeur === revendeurFilter);
    if (statutFilter) data = data.filter(u => u.statut && u.statut.label === statutFilter);
    if (typeFilter && typeFilter.length) data = data.filter(u => typeFilter.includes(u.type));
    if (roleFilter && roleFilter.length) data = data.filter(u => roleFilter.includes(u.role));
    return data;
  }, [q, revendeurFilter, statutFilter, typeFilter, roleFilter]);

  const sortedFiltered = useMemoScA(() => {
    const sortField = sortBy || "Date de création";
    const key = userFieldMap[sortField];
    if (!key) return filtered;
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (key === "statut.label") { va = a.statut ? a.statut.label || "" : ""; vb = b.statut ? b.statut.label || "" : ""; }
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
      if (key === "statut.code") {
        va = a.statut ? Number(a.statut.code) : 0;
        vb = b.statut ? Number(b.statut.code) : 0;
        return logSortDir === "asc" ? va - vb : vb - va;
      }
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
      : <><Button variant="primary" icon="plus">Ajouter un utilisateur</Button></>
    );
    return () => setTopbarActions(null);
  }, [isLogs]);

  return (
    <>
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {!isLogs && (
          <>
            <Toolbar>
              <RadioDropdown placeholder="Trier" options={["Date de création","Actif","Nom","Prénom","Email","Revendeur associé"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
              <Input placeholder="Recherche par nom, prénom, e-mail" value={q} onChange={(v) => { setQ(v); setPage(1); }} width={360} />
              <RadioDropdown
                placeholder="Revendeur"
                options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]}
                value={revendeurFilter}
                onChange={setRevendeurFilter}
                width={190}
              />
              <RadioDropdown placeholder="Statut" options={["Actif","Inactif"]} value={statutFilter} onChange={setStatutFilter} width={140} showSearch={false} />
              <RadioDropdown placeholder="Type" options={["AUTH0","OKTA"]} value={typeFilter} onChange={setTypeFilter} width={140} showSearch={false} multiSelect={true} />
              <RadioDropdown placeholder="Rôle" options={["Administrateur","Manager","Support N1","Lecture seule","Support N2","Opérateur"]} value={roleFilter} onChange={setRoleFilter} width={150} showSearch={false} multiSelect={true} />
              <div className="grow" />
              <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
            </Toolbar>
            <TableBox>
              <table className="kap-table">
                <thead>
                  <tr>
                    <th>Actif</th>
                    <th><SortHeader active dir="asc">Nom</SortHeader></th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Rôle</th>
                    <th>Revendeur associé</th>
                    <th>Date de création</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {view.map(u => (
                    <tr key={u.id} className="is-clickable" onClick={() => onOpenUser && onOpenUser(u)}>
                      <td>{u.statut.label === "Actif" ? <Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /> : <Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} />}</td>
                      <td style={{ fontWeight: 600 }}>{u.nom}</td>
                      <td>{u.prenom}</td>
                      <td className="muted">{u.email}</td>
                      <td><span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>{u.type}</span></td>
                      <td>{u.role}</td>
                      <td className="muted">{u.revendeur}</td>
                      <td className="muted">{u.dateCreation}</td>
                      <td><IconButton icon="more-vertical" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={filtered.length} perPage={perPage} />
          </>
        )}
        {isLogs && (
          <>
            <Toolbar>
              <RadioDropdown placeholder="Trier" options={["Date de création","Nom de l'utilisateur","Revendeur de l'utilisateur","Statut","Ressources","Durée"]} value={logSortBy} onChange={setLogSortBy} onSortChange={handleLogSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
              <Input icon="search" placeholder="Statut, Email, Nom et Prénom" width={360} />
              <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={logRevendeur} onChange={setLogRevendeur} width={170} />
              <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={logClient} onChange={setLogClient} width={160} />
              <DateRangeDropdown placeholder="Date" value={logDate} onChange={setLogDate} width={160} />
              <RadioDropdown placeholder="Statut" options={["200","201","400","403","404","409","422","500","501","502"]} value={logStatut} onChange={setLogStatut} width={160} showSearch={false} multiSelect={true} />
              <RadioDropdown placeholder="Ressources" options={["configuration_ninja_conf","data_reference_client","dispatcher","eligibility","mobile","order","portability","ticket","unidentified resource","user"]} value={logRessources} onChange={setLogRessources} width={160} showSearch={false} multiSelect={true} />
              <div className="grow" />
              <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
            </Toolbar>
            <TableBox>
              <table className="kap-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th><SortHeader active>Date</SortHeader></th>
                    <th>Nom de l'utilisateur</th>
                    <th>Revendeur de l'utilisateur</th>
                    <th>Statut</th>
                    <th>Ressource</th>
                    <th>Description</th>
                    <th>Durée</th>
                    <th style={{ width: 48 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {logView.map(l => (
                    <tr key={l.id}>
                      <td className="mono muted">{l.id}</td>
                      <td className="muted">{l.dateCreation}</td>
                      <td>{l.nomUtilisateur}</td>
                      <td className="muted">{l.user.revendeur}</td>
                      <td><Tooltip text={({ 200:"OK — Requête traitée avec succès", 201:"Created — Ressource créée avec succès", 400:"Bad Request — Requête invalide", 403:"Forbidden — Accès refusé", 404:"Not Found — Ressource introuvable", 409:"Conflict — Conflit avec l'état actuel", 422:"Unprocessable Entity — Données non traitables", 500:"Internal Server Error — Erreur serveur interne", 501:"Not Implemented — Fonctionnalité non implémentée", 502:"Bad Gateway — Passerelle invalide" })[l.statut.code]}><HttpCode code={l.statut.code} kind={l.statut.kind} /></Tooltip></td>
                      <td className="mono muted">{l.type}</td>
                      <td className="muted" style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.description}</td>
                      <td className="muted">{l.duree}</td>
                      <td><IconButton icon="eye" onClick={() => onOpenLog(l)} ariaLabel="Voir le détail" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <Pagination page={logPage} totalPages={logTotalPages} onChange={setLogPage} totalItems={LOGS.length} perPage={15} />
          </>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// DRAWERS — User detail + Request log detail
// ════════════════════════════════════════════════════════════════
function UserDrawer({ user, onClose }) {
  return (
    <Drawer
      title={`${user.prenom} ${user.nom}`}
      subtitle={user.email}
      onClose={onClose}
      footer={<>
        <Button variant="tertiary" onClick={onClose}>Annuler</Button>
        <Button variant="secondary" icon="key">Réinitialiser le mot de passe</Button>
        <Button variant="danger" icon="ban">Désactiver</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}
    >
      <div style={{ padding: "14px 24px 0", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 9999, background: "var(--kap-primary)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 20 }}>
          {user.prenom[0]}{user.nom[0]}
        </div>
        <div>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 18 }}>{user.prenom} {user.nom}</div>
          <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)" }}>{user.role} · {user.filiale}</div>
          <div style={{ marginTop: 6 }}><DotStatus color={user.statut.color} label={user.statut.label} /></div>
        </div>
      </div>
      <DetailSection title="Informations">
        <DetailRow label="Identifiant"><span className="kap-mono">#{user.id}</span></DetailRow>
        <DetailRow label="Prénom">{user.prenom}</DetailRow>
        <DetailRow label="Nom">{user.nom}</DetailRow>
        <DetailRow label="Adresse e-mail"><a className="kap-link">{user.email}</a></DetailRow>
        <DetailRow label="Type d'utilisateur">{user.type}</DetailRow>
        <DetailRow label="Rôle">{user.role}</DetailRow>
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
    </Drawer>
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

Object.assign(window, { LoginScreen, HomeScreen, UsersScreen, UserDrawer, LogDrawer });
