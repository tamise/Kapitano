// Shell — Sidebar avec sous-navigation à deux niveaux + Topbar

const { useState: useStateSh } = React;

const NAV = [
  { key: "accueil",      label: "Accueil",       icon: "home",       subs: [] },
  { key: "utilisateurs", label: "Utilisateurs",  icon: "group",      subs: [
    { key: "liste",  label: "Liste utilisateurs" },
    { key: "logs",   label: "Logs d'activité" },
  ]},
  { key: "referentiel",  label: "Référentiel",   icon: "menu_book",  subs: [
    { key: "revendeurs", label: "Revendeurs" },
    { key: "clients",    label: "Clients" },
    { key: "sites",      label: "Sites" },
    { key: "services",   label: "Services" },
    { key: "catalogues", label: "Catalogues" },
  ]},
  { key: "mobiles",      label: "Mobiles",       icon: "smartphone", subs: [
    { key: "abonnements", label: "Abonnements" },
    { key: "commandes",   label: "Commandes mobile data" },
  ]},
  { key: "liens",        label: "Liens d'accès", icon: "wifi",       subs: [
    { key: "abonnements", label: "Abonnements" },
    { key: "commandes",   label: "Commandes" },
  ]},
  { key: "voix",         label: "Voix fixe",     icon: "phone_in_talk", subs: [
    { key: "espaces",     label: "Espaces voix" },
    { key: "trunk",       label: "Trunk SIP" },
    { key: "trunk-cmd",   label: "Commandes Trunk SIP" },
    { key: "portabilite", label: "Portabilité" },
    { key: "numeros",     label: "Numéros clients" },
    { key: "numeros-rev", label: "Numéros revendeurs" },
  ]},
  { key: "commandes",    label: "Commandes",     icon: "receipt_long", subs: [
    { key: "suivi",     label: "Suivi de commandes" },
    { key: "reporting", label: "Reporting" },
  ]},
  { key: "technique",    label: "Technique",     icon: "build",       subs: [
    { key: "tickets",        label: "Tickets" },
    { key: "configurations", label: "Configurations" },
    { key: "supervision",    label: "Supervision" },
  ]},
  { key: "eligibilite",  label: "Eligibilité",   icon: "place",       subs: [] },
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

function Sidebar({ activeScreen, activeSub, onNavigate, collapsed, onToggle }) {
  return (
    <aside className={"kap-sidebar" + (collapsed ? " is-collapsed" : "")}>
      <div className="kap-side-logo" onClick={() => onNavigate("accueil")} style={{ cursor: "pointer" }}>
        <img src="../assets/kapitano-logo-k.png" alt="Kapitano" />
      </div>

      <div className="kap-side-items">
        {NAV.map(n => {
          const isActive = activeScreen === n.key;
          const hasSubs = n.subs.length > 0;
          return (
            <div key={n.key}>
              {/* Parent item */}
              <div
                className={"kap-side-item" + (isActive && !hasSubs ? " is-active" : "") + (isActive && hasSubs ? " is-open" : "")}
                onClick={() => onNavigate(n.key, hasSubs ? (DEFAULT_SUB[n.key] || n.subs[0].key) : null)}
                data-label={n.label}
              >
                <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>{n.icon}</span>
                <span className="kap-side-label" style={{ flex: 1 }}>{n.label}</span>
                {hasSubs && !collapsed && (
                  <span className="kap-icon material-symbols-outlined" style={{ fontSize: 16, width: 16, height: 16, color: "inherit", opacity: 0.6 }}>
                    {isActive ? "expand_less" : "expand_more"}
                  </span>
                )}
              </div>

              {/* Sub-items — visible when parent is active and sidebar is expanded */}
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
          data-label="Profil"
        >
          <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>person</span>
          <span className="kap-side-label">Profil</span>
        </div>
        <div className="kap-side-item" onClick={onToggle} data-label={collapsed ? "Étendre" : "Réduire"}>
          <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
          <span className="kap-side-label">Réduire</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ trail, onNavigate }) {
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
      <div style={{ flex: 1 }} />
      <span className="kap-input-wrap" style={{ width: 280, height: 36 }}>
        <span className="kap-icon material-symbols-outlined" style={{ fontSize: 18, width: 18, height: 18 }}>search</span>
        <input placeholder="Rechercher dans Kapitano…" />
      </span>
      <button className="kap-icon-btn" aria-label="Notifications">
        <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>notifications</span>
        <span className="kap-badge-dot" />
      </button>
      <button className="kap-icon-btn" aria-label="Aide">
        <span className="kap-icon material-symbols-outlined" style={{ fontSize: 20, width: 20, height: 20 }}>help</span>
      </button>
      <div className="kap-avatar" title="Mathis Bourgoin">MB</div>
    </nav>
  );
}

function Shell({ active, activeSub, onNavigate, breadcrumb, collapsed, onToggleCollapse, children }) {
  return (
    <div className="kap-shell">
      <Sidebar
        activeScreen={active}
        activeSub={activeSub}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggle={onToggleCollapse}
      />
      <main className="kap-main">
        <Topbar trail={breadcrumb} onNavigate={(key) => onNavigate(key)} />
        <div className="kap-canvas">{children}</div>
      </main>
    </div>
  );
}

Object.assign(window, { Shell, Sidebar, Topbar, SCREEN_CRUMBS, NAV, DEFAULT_SUB });
