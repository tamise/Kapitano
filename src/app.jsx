// App principale Kapitano — clickable prototype

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "sidebarCollapsed": false,
  "showTweaks": true
}/*EDITMODE-END*/;

function App() {
  const [loggedIn, setLoggedIn] = useStateApp(false);
  const [screen, setScreen] = useStateApp("accueil");
  const [sub, setSub] = useStateApp(null);
  const [detail, setDetail] = useStateApp(null);
  const [openLog, setOpenLog] = useStateApp(null);
  const [openUser, setOpenUser] = useStateApp(null);

  // Tweaks
  const [collapsed, setCollapsed] = useStateApp(TWEAK_DEFAULTS.sidebarCollapsed);
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);

  // Edit-mode protocol
  useEffectApp(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  function setTweak(key, val) {
    if (key === "sidebarCollapsed") setCollapsed(val);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  }

  if (!loggedIn) return (
    <>
      <LoginScreen onLogin={() => setLoggedIn(true)} />
      {tweaksOpen && <TweaksPanel collapsed={collapsed} setCollapsed={(v) => setTweak("sidebarCollapsed", v)} onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }} />}
    </>
  );

  // Breadcrumb: add sub-label as last segment when there's a sub-page
  const baseCrumb = SCREEN_CRUMBS[screen] || SCREEN_CRUMBS.accueil;
  let subCrumb = baseCrumb;
  if (sub) {
    const navItem = NAV.find(n => n.key === screen);
    const subItem = navItem && navItem.subs.find(s => s.key === sub);
    if (subItem) {
      subCrumb = [...baseCrumb.slice(0, -1),
        { label: baseCrumb[baseCrumb.length - 1].label, key: screen },
        { label: subItem.label }
      ];
    }
  }

  function navigate(s, subKey) {
    setScreen(s);
    // If no subKey provided, default to first sub
    const navItem = NAV.find(n => n.key === s);
    const defaultSub = subKey || (navItem && navItem.subs.length > 0 ? navItem.subs[0].key : null);
    setSub(defaultSub);
    setDetail(null);
    setOpenLog(null);
    setOpenUser(null);
  }

  let body;
  switch (screen) {
    case "accueil":      body = <HomeScreen onNavigate={navigate} />; break;
    case "utilisateurs": body = <UsersScreen initialTab={sub || "liste"} onOpenLog={setOpenLog} onOpenUser={setOpenUser} />; break;
    case "referentiel":  body = <ReferentielScreen initialSub={sub || "revendeurs"} onOpenDetail={setDetail} />; break;
    case "mobiles":      body = <MobilesScreen   initialSub={sub || "abonnements"} onOpenDetail={setDetail} />; break;
    case "liens":        body = <LinksScreen     initialSub={sub || "abonnements"} onOpenDetail={setDetail} />; break;
    case "voix":         body = <VoixScreen      initialSub={sub || "espaces"}     onOpenDetail={setDetail} />; break;
    case "commandes":    body = <CommandesScreen initialSub={sub || "suivi"}       onOpenDetail={setDetail} />; break;
    case "technique":    body = <TechniqueScreen initialSub={sub || "tickets"}     onOpenDetail={setDetail} />; break;
    case "eligibilite":  body = <EligibiliteScreen />; break;
    case "profil":       body = <ProfilScreen />; break;
    default:             body = <HomeScreen onNavigate={navigate} />;
  }

  return (
    <>
      <Shell
        active={screen}
        activeSub={sub}
        onNavigate={navigate}
        breadcrumb={subCrumb}
        collapsed={collapsed}
        onToggleCollapse={() => setTweak("sidebarCollapsed", !collapsed)}
      >
        {body}
      </Shell>
      {detail && <GenericDetailDrawer payload={detail} onClose={() => setDetail(null)} />}
      {openLog && <LogDrawer log={openLog} onClose={() => setOpenLog(null)} />}
      {openUser && <UserDrawer user={openUser} onClose={() => setOpenUser(null)} />}
      {tweaksOpen && <TweaksPanel collapsed={collapsed} setCollapsed={(v) => setTweak("sidebarCollapsed", v)} onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }} />}
    </>
  );
}

function subLabel(screen, sub) {
  const map = {
    utilisateurs: { liste: "Liste", logs: "Logs d'activité" },
    referentiel:  { revendeurs: "Revendeurs", clients: "Clients", sites: "Sites", services: "Services", hebergements: "Hébergements", catalogues: "Catalogue" },
    mobiles:      { abonnements: "Abonnements", commandes: "Commande mobile", dispatcher: "Dispatcher", "cartes-sim": "Cartes SIM", "gestionnaires-flottes": "Gestionnaires de flottes" },
    liens:        { abonnements: "Abonnements mobile data", commandes: "Commandes mobile data", seuils: "Seuils de consommation" },
    voix:         { espaces: "Espaces voix", trunk: "Trunk SIP", "trunk-cmd": "Commandes Trunk SIP", portabilite: "Portabilité", numeros: "Numéros clients", "numeros-rev": "Numéros revendeurs" },
    commandes:    { suivi: "Suivi de commandes", reporting: "Reporting" },
    technique:    { tickets: "Tickets", configurations: "Configurations", supervision: "Supervision" },
  };
  return (map[screen] && map[screen][sub]) || sub;
}

function TweaksPanel({ collapsed, setCollapsed, onClose }) {
  return (
    <div className="kap-tweaks">
      <div className="tw-title" style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1 }}>Tweaks</span>
        <button style={{ all: "unset", cursor: "pointer", color: "var(--kap-fg-3)" }} aria-label="Fermer" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className="tw-row">
        <span>Sidebar réduite</span>
        <span className={"tw-switch" + (collapsed ? " is-on" : "")} onClick={() => setCollapsed(!collapsed)} />
      </div>
      <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 11, color: "var(--kap-fg-3)" }}>
        L'icône <Icon name="chevron-left" size={12} style={{ verticalAlign: -1 }} /> en bas de la sidebar bascule aussi cet état.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
