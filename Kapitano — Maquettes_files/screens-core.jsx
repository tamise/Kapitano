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
          <img src="../assets/kapitano-logo-k.png" alt="Kapitano" />
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
          { key: "referentiel", sub: "catalogues", label: "Catalogues",       desc: "Consultez les articles du catalogue" },
        ]} />
        <SectionCard icon="smartphone" title="Mobiles" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "mobiles", sub: "abonnements", label: "Abonnements",          desc: "Consultez et gérez les abonnements mobiles" },
          { key: "mobiles", sub: "commandes",   label: "Commandes mobile data", desc: "Suivez et gérez les commandes mobiles data" },
        ]} />
        <SectionCard icon="wifi" title="Liens d'accès" count={2} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "liens", sub: "abonnements", label: "Abonnements", desc: "Consultez et gérez les abonnements mobile data" },
          { key: "liens", sub: "commandes",   label: "Commandes",   desc: "Suivez et gérez les commandes mobiles data" },
        ]} />
        <SectionCard icon="phone-call" title="Voix fixe" count={6} onSelect={(it) => onNavigate(it.key, it.sub)} items={[
          { key: "voix", sub: "espaces",     label: "Espaces voix",        desc: "Consultez et gérez les espaces voix" },
          { key: "voix", sub: "trunk",       label: "Trunk SIP",           desc: "Consultez et gérez les abonnements Trunk SIP" },
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
  const perPage = 10;

  const filtered = useMemoScA(() => {
    const n = q.trim().toLowerCase();
    return n ? USERS.filter(u => (u.prenom + " " + u.nom + " " + u.email).toLowerCase().includes(n)) : USERS;
  }, [q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  const isLogs = initialTab === "logs";

  return (
    <>
      <PageHead
        icon="group"
        title={isLogs ? "Logs d'activité" : "Liste utilisateurs"}
        subtitle={isLogs ? "Consultez et analysez les journaux d'activité des utilisateurs." : "Consultez et gérez la liste des utilisateurs et leurs accès au portail."}
        actions={isLogs ? <Button variant="tertiary" icon="filter">Filtres avancés</Button> : <>
          <Button variant="tertiary" icon="download">Exporter</Button>
          <Button variant="primary" icon="plus">Créer un utilisateur</Button>
        </>}
      />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {!isLogs && (
          <>
            <Toolbar>
              <Input placeholder="Recherche par nom, prénom, e-mail" value={q} onChange={(v) => { setQ(v); setPage(1); }} width={360} />
              <Select placeholder="Type d'utilisateur" options={["INTERNE","EXTERNE","REVENDEUR"]} width={180} icon="filter" />
              <Select placeholder="Filiale" options={["Koesio Aquitaine","Koesio Île-de-France","Koesio Bretagne"]} width={200} icon="building-2" />
              <Select placeholder="Statut" options={["Actif","Désactivé","Bloqué","En attente"]} width={140} icon="circle" />
              <div className="grow" />
              <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)" }}>{filtered.length} résultats</span>
            </Toolbar>
            <TableBox>
              <table className="kap-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}><Checkbox /></th>
                    <th><SortHeader active dir="asc">Prénom</SortHeader></th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Type</th>
                    <th>Filiale</th>
                    <th>Statut</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {view.map(u => (
                    <tr key={u.id} className="is-clickable" onClick={() => onOpenUser && onOpenUser(u)}>
                      <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                      <td>{u.prenom}</td>
                      <td style={{ fontWeight: 600 }}>{u.nom}</td>
                      <td className="muted">{u.email}</td>
                      <td>{u.role}</td>
                      <td><span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>{u.type}</span></td>
                      <td className="muted">{u.filiale}</td>
                      <td><DotStatus color={u.statut.color} label={u.statut.label} /></td>
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
              <Input icon="search" placeholder="Recherche par URI, méthode, code…" width={360} />
              <Select placeholder="Méthode" options={["GET","POST","PATCH","DELETE","PUT"]} width={140} icon="code" />
              <Select placeholder="Statut" options={["2xx Succès","3xx Redirect","4xx Erreur client","5xx Erreur serveur"]} width={200} icon="activity" />
              <Select placeholder="Type de ressource" options={["subscriber","order","ticket","reseller","client","site","eligibility"]} width={200} icon="layers" />
              <div className="grow" />
              <Button variant="tertiary" icon="filter" size="sm">Filtres avancés</Button>
            </Toolbar>
            <TableBox>
              <table className="kap-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th><SortHeader active>Date de création</SortHeader></th>
                    <th>Méthode</th>
                    <th>URI</th>
                    <th>Type de ressource</th>
                    <th>Statut</th>
                    <th>Durée</th>
                    <th>Utilisateur</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {LOGS.slice(0, 12).map(l => (
                    <tr key={l.id} className="is-clickable" onClick={() => onOpenLog(l)}>
                      <td className="mono">#{l.id}</td>
                      <td className="muted">{l.dateCreation}</td>
                      <td><MethodTag method={l.methode} /></td>
                      <td className="mono">{l.uri}</td>
                      <td>{l.type}</td>
                      <td><HttpCode code={l.statut.code} kind={l.statut.kind} /></td>
                      <td className="muted">{l.duree}</td>
                      <td>{l.user.prenom} {l.user.nom}</td>
                      <td><Icon name="chevron-right" size={18} style={{ color: "var(--kap-fg-3)" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <Pagination page={1} totalPages={4} onChange={() => {}} totalItems={LOGS.length} perPage={12} />
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
  const payload = JSON.stringify(SAMPLE_PAYLOAD, null, 2);
  return (
    <Drawer
      title={<>Requête <span className="kap-mono" style={{ color: "var(--kap-fg-3)" }}>#{log.id}</span></>}
      subtitle={`${log.methode} ${log.uri}`}
      onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="copy">Copier le payload</Button>
        <Button variant="primary" icon="external-link" onClick={onClose}>Voir l'utilisateur</Button>
      </>}
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
            <DetailRow label="Durée"><span className="kap-mono">{log.duree}</span></DetailRow>
            <DetailRow label="Description"><span style={{ color: "var(--kap-fg-1)" }}>{log.description}</span></DetailRow>
          </DetailSection>
          <DetailSection title="Contenu de la requête">
            <div style={{ padding: "0 16px 16px" }}>
              <CodeBlock value={payload} />
            </div>
          </DetailSection>
        </>
      ) : (
        <>
          <DetailSection title="Utilisateur">
            <DetailRow label="Prénom">{log.user.prenom}</DetailRow>
            <DetailRow label="Nom">{log.user.nom}</DetailRow>
            <DetailRow label="Email"><a className="kap-link">{log.user.email}</a></DetailRow>
            <DetailRow label="Type d'utilisateur">{log.user.type}</DetailRow>
            <DetailRow label="Rôle">{log.user.role}</DetailRow>
            <DetailRow label="Filiale">{log.user.filiale}</DetailRow>
            <DetailRow label="Date de création">{log.user.dateCreation}</DetailRow>
          </DetailSection>
        </>
      )}
    </Drawer>
  );
}

Object.assign(window, { LoginScreen, HomeScreen, UsersScreen, UserDrawer, LogDrawer });
