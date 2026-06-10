// Shell — Sidebar avec sous-navigation à deux niveaux + Topbar

const { useState: useStateSh } = React;

const NAV = [
  { key: "utilisateurs", label: "Utilisateurs",  icon: "group",      subs: [
    { key: "liste",  label: "Liste utilisateurs" },
    { key: "logs",   label: "Logs d'activité" },
  ]},
  { key: "referentiel",  label: "Référentiel",   icon: "menu_book",  subs: [
    { key: "revendeurs",    label: "Revendeurs" },
    { key: "clients",       label: "Clients" },
    { key: "sites",         label: "Sites" },
    { key: "services",      label: "Services" },
    { key: "hebergements",  label: "Hébergements" },
    { key: "catalogues",    label: "Catalogue" },
  ]},
  { key: "mobiles",      label: "Mobiles",       icon: "smartphone", subs: [
    { key: "abonnements", label: "Abonnements" },
    { key: "commandes",   label: "Commande mobile" },
    { key: "dispatcher",  label: "Dispatcher" },
    { key: "cartes-sim",  label: "Cartes SIM" },
    { key: "gestionnaires-flottes", label: "Gestionnaires de flottes" },
  ]},
  { key: "liens",        label: "Liens d'accès", icon: "wifi",       subs: [
    { key: "abonnements", label: "Abonnements mobile data" },
    { key: "commandes",   label: "Commandes mobile data" },
    { key: "seuils",      label: "Seuils de consommation" },
  ]},
  { key: "voix",         label: "Voix fixe",     icon: "phone_in_talk", subs: [
    { key: "espaces",     label: "Espaces voix" },
    { key: "trunk",       label: "Trunk SIP & Centrex" },
    { key: "trunk-cmd",   label: "Commandes Trunk SIP" },
    { key: "portabilite",   label: "Portabilité" },
    { key: "info-numero",   label: "Informations de numéro" },
    { key: "numeros-rev",   label: "Numéros revendeurs" },
    { key: "numeros",       label: "Numéros clients" },
  ]},
  { key: "commandes",    label: "Commandes",     icon: "receipt_long", subs: [
    { key: "suivi",     label: "Suivi de commandes" },
    { key: "reporting", label: "Reporting" },
  ]},
  { key: "technique",    label: "Technique",     icon: "build",       subs: [
    { key: "tickets",          label: "Tickets" },
    { key: "tickets-archives", label: "Tickets archivés" },
    { key: "configurations",   label: "Configurations" },
    { key: "supervision",      label: "Supervision" },
  ]},
  { key: "eligibilite",  label: "Eligibilité",   icon: "place",       subs: [
    { key: "carte",   label: "Carte" },
    { key: "demande", label: "Demande" },
    { key: "adresse", label: "Adresse" },
  ]},
  { key: "administration", label: "Administration", icon: "settings",    subs: [
    { key: "questionnaire",       label: "Questionnaire" },
    { key: "regles-service",      label: "Règles de service" },
    { key: "matrices-decision",   label: "Matrices de décision" },
  ]},
];

const DEFAULT_SUB = {
  utilisateurs: "liste",
  referentiel:  "revendeurs",
  mobiles:      "abonnements",
  liens:        "abonnements",
  voix:         "espaces",
  commandes:    "suivi",
  technique:    "tickets",
};

const SCREEN_CRUMBS = {
  accueil:      [{ label: "Accueil" }],
  utilisateurs: [{ label: "Accueil", key: "accueil" }, { label: "Utilisateurs" }],
  referentiel:  [{ label: "Accueil", key: "accueil" }, { label: "Référentiel" }],
  mobiles:      [{ label: "Accueil", key: "accueil" }, { label: "Mobiles" }],
  liens:        [{ label: "Accueil", key: "accueil" }, { label: "Liens d'accès" }],
  voix:         [{ label: "Accueil", key: "accueil" }, { label: "Voix fixe" }],
  commandes:    [{ label: "Accueil", key: "accueil" }, { label: "Commandes" }],
  technique:    [{ label: "Accueil", key: "accueil" }, { label: "Technique" }],
  eligibilite:  [{ label: "Accueil", key: "accueil" }, { label: "Eligibilité" }],
  profil:       [{ label: "Accueil", key: "accueil" }, { label: "Profil & paramètres" }],
};

function Sidebar({ activeScreen, activeSub, onNavigate, collapsed, onToggle, onLogout }) {
  const [flyout, setFlyout] = useStateSh(null); // { item, top }
  const flyoutTimer = React.useRef(null);

  function openFlyout(e, navItem) {
    if (!collapsed) return;
    clearTimeout(flyoutTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyout({ item: navItem, top: rect.top });
  }

  function scheduleFlyoutClose() {
    flyoutTimer.current = setTimeout(() => setFlyout(null), 120);
  }

  function cancelFlyoutClose() {
    clearTimeout(flyoutTimer.current);
  }

  return (
    <aside className={"kap-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="kap-side-logo" onClick={() => onNavigate("accueil")} style={{ cursor: "pointer" }}>
        <img src="./assets/kapitano-logo-k.png" alt="Kapitano" />
      </div>

      <div className="kap-side-items">
        {NAV.map(n => {
          const isActive = activeScreen === n.key;
          const hasSubs = n.subs.length > 0;
          return (
            <div key={n.key}
              onMouseEnter={(e) => openFlyout(e, n)}
              onMouseLeave={scheduleFlyoutClose}
            >
              <div
                className={"kap-side-item" + (isActive && !hasSubs ? " is-active" : "") + (isActive && hasSubs ? " is-open" : "")}
                onClick={() => { if (!collapsed || !hasSubs) onNavigate(n.key, hasSubs ? (DEFAULT_SUB[n.key] || n.subs[0].key) : null); }}
              >
                <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>{n.icon}</span>
                <span className="kap-side-label" style={{ flex: 1 }}>{n.label}</span>
                {hasSubs && !collapsed && (
                  <span className="kap-icon material-symbols-outlined" style={{ fontSize: 16, width: 16, height: 16, color: "inherit", opacity: 0.6 }}>
                    {isActive ? "expand_less" : "expand_more"}
                  </span>
                )}
              </div>

              {isActive && hasSubs && !collapsed && (
                <div className="kap-sub-items">
                  {n.subs.map(s => (
                    <div
                      key={s.key}
                      className={"kap-sub-item" + (activeSub === s.key ? " is-active" : "")}
                      onClick={() => onNavigate(n.key, s.key)}
                    >
                      <span className="kap-sub-dot" />
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="kap-side-foot">
        <div
          className={"kap-side-item" + (activeScreen === "profil" ? " is-active" : "")}
          onClick={() => onNavigate("profil")}
        >
          <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>person</span>
          <span className="kap-side-label">Profil</span>
        </div>
        <div className="kap-side-item" onClick={onLogout}>
          <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>logout</span>
          <span className="kap-side-label">Déconnexion</span>
        </div>
        <div className="kap-side-item" onClick={onToggle}>
          <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
          <span className="kap-side-label">Réduire</span>
        </div>
      </div>

      {/* Flyout panel — mode réduit */}
      {collapsed && flyout && (
        <div
          className="kap-side-flyout"
          style={{ top: flyout.top }}
          onMouseEnter={cancelFlyoutClose}
          onMouseLeave={scheduleFlyoutClose}
        >
          <div className="kap-side-flyout-title">{flyout.item.label}</div>
          {flyout.item.subs.map(s => (
            <div
              key={s.key}
              className={"kap-side-flyout-item" + (activeSub === s.key && activeScreen === flyout.item.key ? " is-active" : "")}
              onClick={() => { onNavigate(flyout.item.key, s.key); setFlyout(null); }}
            >
              <span className="kap-sub-dot" style={{ background: activeSub === s.key && activeScreen === flyout.item.key ? "#fff" : undefined }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function Topbar({ trail, onNavigate, actions }) {
  return (
    <nav className="kap-topbar" aria-label="breadcrumb">
      <span className="kap-icon material-symbols-outlined" style={{ fontSize: 18, width: 18, height: 18, color: "var(--kap-fg-3)" }}>home</span>
      {trail.map((seg, i) => {
        const isLast = i === trail.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="kap-icon material-symbols-outlined" style={{ fontSize: 16, width: 16, height: 16, color: "var(--kap-fg-3)" }}>chevron_right</span>}
            {isLast
              ? <span style={{ color: "var(--kap-primary)", fontWeight: 600 }}>{seg.label}</span>
              : <a onClick={() => seg.key && onNavigate(seg.key)}>{seg.label}</a>}
          </React.Fragment>
        );
      })}
      {actions && <><div style={{ flex: 1 }} /><div style={{ display: "flex", gap: 8 }}>{actions}</div></>}
    </nav>
  );
}

const TopbarActionsContext = React.createContext(null);

function Shell({ active, activeSub, onNavigate, breadcrumb, collapsed, onToggleCollapse, onLogout, children }) {
  const [topbarActions, setTopbarActions] = useStateSh(null);
  return (
    <TopbarActionsContext.Provider value={setTopbarActions}>
      <div className="kap-shell">
        <Sidebar
          activeScreen={active}
          activeSub={activeSub}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggle={onToggleCollapse}
          onLogout={onLogout}
        />
        <main className="kap-main">
          <Topbar trail={breadcrumb} onNavigate={(key) => onNavigate(key)} actions={topbarActions} />
          <div className="kap-canvas">{children}</div>
        </main>
      </div>
    </TopbarActionsContext.Provider>
  );
}

Object.assign(window, { Shell, Sidebar, Topbar, TopbarActionsContext, SCREEN_CRUMBS, NAV, DEFAULT_SUB });
