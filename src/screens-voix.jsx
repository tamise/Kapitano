// Screens — Voix fixe (Espaces voix, Trunk SIP, Commandes Trunk SIP, Portabilité, Numéros)

const { useState: useStateVx } = React;

const VOIX_TITLES = { espaces: "Espaces voix", trunk: "Trunk SIP & Centrex", "trunk-cmd": "Commandes Trunk SIP", portabilite: "Portabilité", "info-numero": "Informations de numéro", numeros: "Numéros clients", "numeros-rev": "Numéros revendeurs" };
const VOIX_SUBS   = { espaces: "Consultez et gérez les espaces voix.", trunk: "Consultez et gérez les abonnements Trunk SIP.", "trunk-cmd": "Suivez et gérez les commandes Trunk SIP.", portabilite: "Consultez et gérez la portabilité des numéros.", "info-numero": "Consultez les informations détaillées d'un numéro.", numeros: "Consultez la liste des numéros fixes du client.", "numeros-rev": "Consultez la liste des numéros fixes des revendeurs." };

function VoixScreen({ initialSub = "espaces", onOpenDetail }) {
  return (
    <>
      <PageHead icon="phone_in_talk" title={VOIX_TITLES[initialSub] || "Voix fixe"} subtitle={VOIX_SUBS[initialSub]} />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "espaces"     && <EspacesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "trunk"       && <TrunkTab onOpenDetail={onOpenDetail} />}
        {initialSub === "trunk-cmd"   && <TrunkOrdersTab onOpenDetail={onOpenDetail} />}
        {initialSub === "portabilite"  && <PortabiliteTab onOpenDetail={onOpenDetail} />}
        {initialSub === "info-numero"  && <InfoNumeroTab />}
        {initialSub === "numeros-rev"  && <NumbersTab onOpenDetail={onOpenDetail} variant="revendeurs" />}
        {initialSub === "numeros"      && <NumbersTab onOpenDetail={onOpenDetail} variant="clients" />}
      </div>
    </>
  );
}

function EspacesTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateVx(null);
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [page, setPage] = useStateVx(1);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer un espace voix</Button>);
    return () => setTopbarActions(null);
  }, []);
  const totalPages = Math.max(1, Math.ceil(VOICE_SPACES.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","ID","Revendeur","Client","Nom client Enove"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par client ou id de production" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={190} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Date de création</SortHeader></th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Nom client Enove</th>
              <th>ID production</th>
              <th>État de l'espace voix</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {VOICE_SPACES.slice((page - 1) * 15, page * 15).map(v => (
              <tr key={v.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "voice-space", data: v })}>
                <td className="muted">{v.dateCreation}</td>
                <td className="muted">{v.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{v.client}</td>
                <td className="muted">{v.nomClientEnove}</td>
                <td className="mono muted">{v.idProduction}</td>
                <td>{{
                  "Actif":     <Tooltip text="Actif"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Migration": <Tooltip text="Migration"><Icon name="swap_horiz" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                }[v.statut.label]}</td>
                <td><Tooltip text="Voir le détail" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={VOICE_SPACES.length} perPage={15} />
    </>
  );
}

function TrunkTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateVx(null);
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [offreFilter, setOffreFilter] = useStateVx(null);
  const [etatFactuFilter, setEtatFactuFilter] = useStateVx(null);
  const [etatProdFilter, setEtatProdFilter] = useStateVx([]);
  const [page, setPage] = useStateVx(1);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="plus">Créer un trunk SIP</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enove</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enreach</Button>
    </>);
    return () => setTopbarActions(null);
  }, []);
  const totalPages = Math.max(1, Math.ceil(TRUNK_SIP.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["État facturation","Revendeur","Client","Site","Numéro de charge","Offre","Canaux","État prod."]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par numéro de charge, client ou offre" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type d'offre" options={["Trunk SIP","Centrex Enove","Centrex Enreach"]} value={offreFilter} onChange={setOffreFilter} width={160} showSearch={false} />
        <RadioDropdown placeholder="Etat factu." options={["Actif","Inactif","En cours d'activation","En cours de désactivation"]} value={etatFactuFilter} onChange={setEtatFactuFilter} width={140} showSearch={false} />
        <RadioDropdown placeholder="État prod." options={["Commandé","Création en cours","Actif","Résilié"]} value={etatProdFilter} onChange={setEtatProdFilter} width={150} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Revendeur</th>
              <th><SortHeader active dir="asc">Client</SortHeader></th>
              <th>Site</th>
              <th>N° de charge</th>
              <th>Offre</th>
              <th style={{ textAlign: "right" }}>Canaux</th>
              <th>Etat factu.</th>
              <th>Etat prod.</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {TRUNK_SIP.slice((page - 1) * 15, page * 15).map(t => (
              <tr key={t.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "trunk", data: t })}>
                <td className="muted">{t.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{t.client}</td>
                <td className="muted">{t.site}</td>
                <td className="mono muted">{t.numeroDeCharge}</td>
                <td className="muted">{t.offre}</td>
                <td style={{ textAlign: "right" }}>{t.canaux}</td>
                <td>{{
                  "Actif":                    <Tooltip text="Actif"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Inactif":                  <Tooltip text="Inactif"><Icon name="x-circle" size={18} style={{ color: "#616161" }} /></Tooltip>,
                  "En cours d'activation":    <Tooltip text="En cours d'activation"><Icon name="hourglass_full" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "En cours de désactivation":<Tooltip text="En cours de désactivation"><Icon name="power_off" size={18} style={{ color: "#9C27B0" }} /></Tooltip>,
                }[t.etatFactu]}</td>
                <td>{{
                  "Commandé":        <Tooltip text="Commandé"><Icon name="schedule" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                  "Création en cours":<Tooltip text="Création en cours"><Icon name="hourglass_empty" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "Actif":           <Tooltip text="Actif"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Résilié":         <Tooltip text="Résilié"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>,
                }[t.etatProd]}</td>
                <td><Tooltip text="Voir l'abonnement" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TRUNK_SIP.length} perPage={15} />
    </>
  );
}

function TrunkOrdersTab({ onOpenDetail }) {
  const [page, setPage] = useStateVx(1);
  const totalPages = Math.max(1, Math.ceil(TRUNK_ORDERS.length / 15));
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="plus">Créer un trunk SIP</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enove</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enreach</Button>
    </>);
    return () => setTopbarActions(null);
  }, []);
  const [sortBy, setSortBy] = useStateVx(null);
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [offreFilter, setOffreFilter] = useStateVx(null);
  const [typeFilter, setTypeFilter] = useStateVx([]);
  const [etatFilter, setEtatFilter] = useStateVx([]);
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date","Réf","Revendeur","Client","Type commande","Numéro de charge","État commande"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par Réf, client, N° de charge" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type d'offre" options={["Trunk SIP","Centrex Enove","Centrex Enreach"]} value={offreFilter} onChange={setOffreFilter} width={160} showSearch={false} />
        <RadioDropdown placeholder="Type commande" options={["Création","Modification","Résiliation"]} value={typeFilter} onChange={setTypeFilter} width={170} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="État commande" options={["En brouillon","Programmée","Crée","Annulation en cours","Annulée","En cours","En cours (erreur)","Incident en cours","En attente","Terminée avec succès","Terminée avec erreur"]} value={etatFilter} onChange={setEtatFilter} width={170} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Réf</th>
              <th>Date</th>
              <th>Revendeur</th>
              <th><SortHeader active dir="asc">Client</SortHeader></th>
              <th>Type d'offre</th>
              <th>Type commande</th>
              <th>N° de charge</th>
              <th>État commande</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {TRUNK_ORDERS.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "trunk-order", data: o })}>
                <td className="mono muted">{o.ref}</td>
                <td className="muted">{o.dateCommande}</td>
                <td className="muted">{o.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{o.client}</td>
                <td className="muted">{o.typeOffre}</td>
                <td className="muted">{o.typeCommande}</td>
                <td className="mono muted">{o.numeroDeCharge}</td>
                <td>{{
                  "En brouillon":         <Tooltip text="En brouillon"><Icon name="edit_note" size={18} style={{ color: "#616161" }} /></Tooltip>,
                  "Programmée":           <Tooltip text="Programmée"><Icon name="schedule" size={18} style={{ color: "#0288D1" }} /></Tooltip>,
                  "Crée":                 <Tooltip text="Crée"><Icon name="add_circle" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "Annulation en cours":  <Tooltip text="Annulation en cours"><Icon name="ban" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                  "Annulée":              <Tooltip text="Annulée"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>,
                  "En cours":             <Tooltip text="En cours"><Icon name="hourglass_full" size={18} style={{ color: "#1976D2" }} /></Tooltip>,
                  "En cours (erreur)":    <Tooltip text="En cours (erreur)"><Icon name="hourglass_empty" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                  "Incident en cours":    <Tooltip text="Incident en cours"><Icon name="alert-triangle" size={18} style={{ color: "#ED6C02" }} /></Tooltip>,
                  "En attente":           <Tooltip text="En attente"><Icon name="pause_circle" size={18} style={{ color: "#0288D1" }} /></Tooltip>,
                  "Terminée avec succès": <Tooltip text="Terminée avec succès"><Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} /></Tooltip>,
                  "Terminée avec erreur": <Tooltip text="Terminée avec erreur"><Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} /></Tooltip>,
                }[o.etatCommande]}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TRUNK_ORDERS.length} perPage={15} />
    </>
  );
}

const ETAT_ICON_PORT = {
  "En brouillon": <Icon name="edit_note" size={18} style={{ color: "#616161" }} />,
  "En cours":     <Icon name="hourglass_full" size={18} style={{ color: "#1976D2" }} />,
  "Incident":     <Icon name="alert-triangle" size={18} style={{ color: "#ED6C02" }} />,
  "Terminée":     <Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} />,
  "Annulée":      <Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} />,
};
const TABS_PORT = [
  { label: "En brouillon", icon: "edit_note" },
  { label: "En cours",     icon: "hourglass_empty" },
  { label: "Incident",     icon: "alert-triangle" },
  { label: "Terminée",     icon: "check-circle-2" },
  { label: "Annulée",      icon: "x-circle" },
];

function PortabiliteTab({ onOpenDetail }) {
  const [activeTab, setActiveTab] = useStateVx("En brouillon");
  const [sortBy, setSortBy] = useStateVx(null);
  const [dateFilter, setDateFilter] = useStateVx(null);
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [fiabilisationOn, setFiabilisationOn] = useStateVx(false);
  const [fiabilisationOpen, setFiabilisationOpen] = useStateVx(false);
  const fiabilisationRef = React.useRef(null);
  React.useEffect(() => {
    if (!fiabilisationOpen) return;
    function h(e) { if (fiabilisationRef.current && !fiabilisationRef.current.contains(e.target)) setFiabilisationOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [fiabilisationOpen]);
  const [utilisateurFilter, setUtilisateurFilter] = useStateVx(null);
  const [page, setPage] = useStateVx(1);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="search">Informations de numéro</Button>
      <Button variant="primary" icon="calendar">Planning</Button>
      <Button variant="primary" icon="plus">Nouvelle demande</Button>
      <a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/Doc.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a>
    </>);
    return () => setTopbarActions(null);
  }, []);

  const filtered = PORTABILITES.filter(p => p.etatCommande === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 15));
  const view = filtered.slice((page - 1) * 15, page * 15);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Créée le","Réf","Revendeur","Client","Type commande","Date de portabilité","État commande"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par Réf, Client ou Numéro" width={360} />
        <DateRangeDropdown placeholder="Date de portabilité" value={dateFilter} onChange={setDateFilter} width={180} showQuickFilters={true} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <div ref={fiabilisationRef} style={{ position: "relative", display: "inline-block" }}>
          <span className="kap-input-wrap" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setFiabilisationOpen(o => !o)}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--kap-font-ui)", color: fiabilisationOn ? "var(--kap-fg-dark)" : "var(--kap-fg-3)" }}>
              Fiabilisation
              {fiabilisationOn && <span style={{ background: "var(--kap-primary)", color: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 700, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>1</span>}
            </span>
            <Icon name="chevron-down" size={16} style={{ marginRight: -4 }} />
          </span>
          {fiabilisationOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: 220, background: "#fff", border: "1px solid var(--kap-border-2)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, padding: "14px 16px" }}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "var(--kap-font-ui)", fontSize: 13 }}>
                <span>Fiabilisé uniquement</span>
                <span onClick={() => setFiabilisationOn(v => !v)} style={{ display: "inline-block", width: 36, height: 20, borderRadius: 99, background: fiabilisationOn ? "var(--kap-primary)" : "#ccc", cursor: "pointer", position: "relative", transition: "background 200ms", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: 2, left: fiabilisationOn ? 18 : 2, width: 16, height: 16, borderRadius: 99, background: "#fff", transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </span>
              </label>
            </div>
          )}
        </div>
        <RadioDropdown placeholder="Utilisateur" options={["BP","DH","MC","AL","RP"]} value={utilisateurFilter} onChange={setUtilisateurFilter} width={140} showSearch={false} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>

      {/* Onglets */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--kap-divider)", background: "#fff", padding: "0 16px", flexShrink: 0 }}>
        {TABS_PORT.map(t => (
          <div key={t.label} onClick={() => { setActiveTab(t.label); setPage(1); }}
            style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)", display: "flex", alignItems: "center", gap: 6, borderBottom: activeTab === t.label ? "2px solid var(--kap-primary)" : "2px solid transparent", color: activeTab === t.label ? "var(--kap-primary)" : "var(--kap-fg-2)", fontWeight: activeTab === t.label ? 600 : 400, whiteSpace: "nowrap" }}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
            <span style={{ background: "var(--kap-primary)", color: "#fff", borderRadius: 99, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>
              {PORTABILITES.filter(p => p.etatCommande === t.label).length}
            </span>
          </div>
        ))}
      </div>

      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th><SortHeader active dir="desc">Réf</SortHeader></th>
              <th>Créée le</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Type commande</th>
              <th>Numéro</th>
              <th>Date de portabilité</th>
              <th>État commande</th>
              <th>Pilotée</th>
              <th>Statut de la portabilité</th>
              <th>Note</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map(p => (
              <tr key={p.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "portabilite", data: p })}>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 99, background: p.couleurAvatar, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "var(--kap-font-ui)" }}>{p.initiales}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{p.ref}</td>
                <td className="muted">{p.dateCreation}</td>
                <td className="muted">{p.revendeur}</td>
                <td>{p.client}</td>
                <td className="muted">{p.typeCommande}</td>
                <td className="mono">{p.numero}</td>
                <td className="muted">{p.datePortabilite}</td>
                <td><Tooltip text={p.etatCommande}>{ETAT_ICON_PORT[p.etatCommande]}</Tooltip></td>
                <td>{p.hasPortType ? <Tooltip text="Portabilité pilotée"><Icon name="phone_forwarded" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip> : <span className="muted">—</span>}</td>
                <td className="muted">{p.statutPortabilite}</td>
                <td>{p.note && p.note !== "—"
                  ? <Tooltip text={p.note} light><Icon name="description" size={18} style={{ color: "var(--kap-primary)" }} /></Tooltip>
                  : <span className="muted">—</span>}
                </td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={filtered.length} perPage={15} />
    </>
  );
}

function NumbersTab({ onOpenDetail, variant }) {
  const [sortBy, setSortBy] = useStateVx(null);
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [page, setPage] = useStateVx(1);
  const totalPages = Math.max(1, Math.ceil(NUMBERS.length / 15));
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    if (variant === "clients") {
      setTopbarActions(<Button variant="primary" icon="plus">Commander des numéros</Button>);
      return () => setTopbarActions(null);
    }
  }, [variant]);
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Taille de la plage"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par début de plage" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        {variant === "clients" && <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />}
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            {variant === "revendeurs" ? (
              <tr>
                <th>Revendeur</th>
                <th><SortHeader active dir="asc">Début de plage</SortHeader></th>
                <th>Fin de plage</th>
                <th style={{ textAlign: "right" }}>Taille de la plage</th>
                <th style={{ textAlign: "right" }}>Taux d'occupation</th>
                <th>Date de création</th>
                <th style={{ width: 60 }}></th>
              </tr>
            ) : (
              <tr>
                <th>Revendeur</th>
                <th>Client</th>
                <th><SortHeader active dir="asc">Début de plage</SortHeader></th>
                <th>Fin de plage</th>
                <th style={{ textAlign: "right" }}>Taille de la plage</th>
                <th style={{ textAlign: "right" }}>Taux d'occupation</th>
                <th style={{ width: 60 }}></th>
              </tr>
            )}
          </thead>
          <tbody>
            {NUMBERS.slice((page - 1) * 15, page * 15).map(n => (
              <tr key={n.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "number", data: n })}>
                <td className="muted">{n.revendeur}</td>
                {variant === "clients" && <td style={{ fontWeight: 600 }}>{n.client}</td>}
                <td className="mono">{n.debutPlage}</td>
                <td className="mono muted">{n.finPlage}</td>
                <td style={{ textAlign: "right" }}>{n.taillePlage}</td>
                <td style={{ textAlign: "right" }}>{n.tauxOccupation}</td>
                {variant === "revendeurs" && <td className="muted">{n.dateCreation}</td>}
                <td>{variant === "revendeurs"
                  ? <Tooltip text="Commander des numéros" placement="top-end"><IconButton icon="add_call" /></Tooltip>
                  : <Tooltip text="Désaffecter des numéros de la plage" placement="top-end"><IconButton icon="link_off" /></Tooltip>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={NUMBERS.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// Drawers
// ────────────────────────────────────────────────────────────────
function VoiceSpaceDrawer({ v, onClose }) {
  return (
    <Drawer title={v.nom} subtitle={v.client} onClose={onClose}
      footer={<><Button variant="tertiary" icon="settings">Configurer</Button><Button variant="primary" icon="pencil">Modifier</Button></>}>
      <DetailSection title="Espace voix">
        <DetailRow label="ID"><span className="kap-mono">{v.id}</span></DetailRow>
        <DetailRow label="Nom">{v.nom}</DetailRow>
        <DetailRow label="Client">{v.client}</DetailRow>
        <DetailRow label="Canaux"><strong>{v.canaux}</strong></DetailRow>
        <DetailRow label="Nombre de SDA"><strong>{v.sda}</strong></DetailRow>
        <DetailRow label="Plage"><span className="kap-mono">{v.plage}</span></DetailRow>
        <DetailRow label="Statut"><DotStatus color={v.statut.color} label={v.statut.label} /></DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function TrunkDrawer({ t, onClose }) {
  return (
    <Drawer title={`Trunk SIP ${t.id}`} subtitle={t.client} onClose={onClose}
      footer={<><Button variant="tertiary" icon="activity">Tester</Button><Button variant="primary" icon="pencil">Modifier</Button></>}>
      <DetailSection title="Trunk SIP">
        <DetailRow label="ID"><span className="kap-mono">{t.id}</span></DetailRow>
        <DetailRow label="Client">{t.client}</DetailRow>
        <DetailRow label="Canaux"><strong>{t.canaux}</strong></DetailRow>
        <DetailRow label="Realm SIP"><span className="kap-mono">{t.realm}</span></DetailRow>
        <DetailRow label="Nombre de SDA">{t.sda}</DetailRow>
        <DetailRow label="Activation">{t.activation}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={t.statut.color} label={t.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Paramètres techniques">
        <DetailRow label="Codec préféré"><span className="kap-mono">G.711 / G.722</span></DetailRow>
        <DetailRow label="DTMF"><span className="kap-mono">RFC 2833</span></DetailRow>
        <DetailRow label="Authentification"><span className="kap-mono">Digest MD5</span></DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function PortabiliteDrawer({ p, onClose }) {
  return (
    <Drawer title={p.numero} subtitle={`Portabilité ${p.id}`} onClose={onClose}
      footer={<><Button variant="danger" icon="x">Annuler la portabilité</Button><Button variant="primary" icon="pencil">Modifier</Button></>}>
      <DetailSection title="Portabilité">
        <DetailRow label="ID"><span className="kap-mono">{p.id}</span></DetailRow>
        <DetailRow label="Numéro"><span className="kap-mono" style={{ fontWeight: 600 }}>{p.numero}</span></DetailRow>
        <DetailRow label="Client">{p.client}</DetailRow>
        <DetailRow label="Opérateur source">{p.operateurSource}</DetailRow>
        <DetailRow label="Code RIO"><span className="kap-mono">{p.rio}</span></DetailRow>
        <DetailRow label="Date de portage">{p.datePortage}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={p.statut.color} label={p.statut.label} /></DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function NumberDrawer({ n, onClose }) {
  return (
    <Drawer title={n.numero} subtitle={n.client} onClose={onClose}
      footer={<><Button variant="tertiary" icon="link">Réaffecter</Button><Button variant="primary" icon="pencil">Modifier</Button></>}>
      <DetailSection title="Numéro">
        <DetailRow label="ID"><span className="kap-mono">{n.id}</span></DetailRow>
        <DetailRow label="Numéro"><span className="kap-mono" style={{ fontWeight: 600 }}>{n.numero}</span></DetailRow>
        <DetailRow label="Type">{n.type}</DetailRow>
        <DetailRow label="Affectation">{n.affectation}</DetailRow>
        <DetailRow label="Opérateur">{n.operateur}</DetailRow>
        <DetailRow label="Client">{n.client}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={n.statut.color} label={n.statut.label} /></DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function InfoNumeroTab() {
  const [activeTab, setActiveTab] = useStateVx("numero");
  const [query, setQuery] = useStateVx("");
  const [plageDebut, setPlageDebut] = useStateVx("");
  const [plageFin, setPlageFin] = useStateVx("");
  const [historiqueNumero, setHistoriqueNumero] = useStateVx([]);
  const [historiquePlage, setHistoriquePlage] = useStateVx([]);

  function handleSearchNumero() {
    if (!query.trim()) return;
    setHistoriqueNumero(prev => [query.trim(), ...prev.filter(h => h !== query.trim())].slice(0, 10));
  }

  function handleSearchPlage() {
    if (!plageDebut.trim()) return;
    const entry = plageDebut.trim() + (plageFin.trim() ? ` → ${plageFin.trim()}` : "");
    setHistoriquePlage(prev => [entry, ...prev.filter(h => h !== entry)].slice(0, 10));
  }

  const fieldStyle = { fontFamily: "var(--kap-font-ui)", fontSize: 13, fontWeight: 600, color: "var(--kap-fg-dark)" };

  return (
    <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Onglets */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--kap-divider)", marginBottom: 8 }}>
        {[{ key: "numero", label: "Numéro" }, { key: "plage", label: "Plage" }].map(t => (
          <div key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, fontFamily: "var(--kap-font-ui)", borderBottom: activeTab === t.key ? "2px solid var(--kap-primary)" : "2px solid transparent", color: activeTab === t.key ? "var(--kap-primary)" : "var(--kap-fg-2)", fontWeight: activeTab === t.key ? 600 : 400 }}
          >{t.label}</div>
        ))}
      </div>

      {/* Description */}
      <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-2)" }}>
        {activeTab === "numero"
          ? <>Rechercher les informations liées à un <span style={{ color: "var(--kap-primary)" }}>numéro de téléphone</span>.</>
          : <>Rechercher les informations liées à une <span style={{ color: "var(--kap-primary)" }}>plage de numéros</span>.</>}
      </div>

      {/* Champs */}
      {activeTab === "numero" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={fieldStyle}>Numéro</label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="kap-input-wrap" style={{ flex: 1 }}>
              <input type="text" placeholder="04 10 20 30 40" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearchNumero()} style={{ width: "100%" }} />
            </span>
            <Button variant="primary" onClick={handleSearchNumero} disabled={!query.trim()}>Rechercher</Button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <label style={fieldStyle}>Début</label>
            <span className="kap-input-wrap" style={{ width: "100%" }}>
              <input type="text" placeholder="04 10 20 30 40" value={plageDebut} onChange={e => setPlageDebut(e.target.value)} style={{ width: "100%" }} />
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <label style={fieldStyle}>Fin</label>
            <span className="kap-input-wrap" style={{ width: "100%" }}>
              <input type="text" placeholder="04 10 20 30 40" value={plageFin} onChange={e => setPlageFin(e.target.value)} style={{ width: "100%" }} />
            </span>
          </div>
          <Button variant="primary" onClick={handleSearchPlage} disabled={!plageDebut.trim()}>Rechercher</Button>
        </div>
      )}

      {/* Historique éphémère */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={fieldStyle}>Historique éphémère</div>
        {(activeTab === "numero" ? historiqueNumero : historiquePlage).length === 0
          ? <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)" }}>
              {activeTab === "numero"
                ? "Aucune donnée pour le moment, les numéros recherchés s'afficheront ici."
                : "Aucune donnée pour le moment, les plages recherchées s'afficheront ici."}
            </div>
          : (activeTab === "numero" ? historiqueNumero : historiquePlage).map((h, i) => (
            <div key={i} onClick={() => activeTab === "numero" ? setQuery(h) : setPlageDebut(h.split(" → ")[0])}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--kap-primary-soft)", borderRadius: 6, fontFamily: "var(--kap-font-mono)", fontSize: 13, color: "var(--kap-fg-dark)", cursor: "pointer" }}>
              <Icon name="search" size={16} style={{ color: "var(--kap-fg-3)" }} />{h}
            </div>
          ))
        }
      </div>
    </div>
  );
}

Object.assign(window, { VoixScreen, VoiceSpaceDrawer, TrunkDrawer, PortabiliteDrawer, NumberDrawer });
