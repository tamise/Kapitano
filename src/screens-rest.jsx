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
  const [sourceFilter, setSourceFilter] = useStateCt([]);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const totalPages = Math.max(1, Math.ceil(ORDERS.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date","Numéro d'affaire","Source","Revendeur","Client","État commande"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par numéro d'affaire ou client" width={360} />
        <RadioDropdown placeholder="Source" options={["Cristal","Hub commandes"]} value={sourceFilter} onChange={setSourceFilter} width={160} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État commande" options={["Créée","Distribution en cours","Envoyée","Reçue par le client","À activer","En cours d'activation","En production","Incident en cours","Annulée"]} value={etatFilter} onChange={setEtatFilter} width={170} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Date</th>
              <th><SortHeader active>N° d'affaire</SortHeader></th>
              <th>Source</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th style={{ textAlign: "right" }}>Qté articles</th>
              <th>État commande</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.slice((page - 1) * 15, page * 15).map(o => (
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={ORDERS.length} perPage={15} />
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
  const [dateFilter, setDateFilter] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [typeProdFilter, setTypeProdFilter] = useStateCt(null);
  const [typeActionFilter, setTypeActionFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const TOTAL = 4190;
  const perPage = 15;
  const totalPages = Math.ceil(TOTAL / perPage);
  const view = REPORTING_LOGS.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="download">Exporter des données</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de l'action","Numéro d'affaire","Revendeur","Client","Nom de l'article","Quantité"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par numéro d'affaire, client ou article" width={380} />
        <DateRangeDropdown placeholder="Date de l'action" value={dateFilter} onChange={setDateFilter} width={180} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type de production" options={["Abonnement mobile","Abonnement mobile data","Trunk SIP"]} value={typeProdFilter} onChange={setTypeProdFilter} width={180} showSearch={false} />
        <RadioDropdown placeholder="Type d'action" options={["Création","Modification","Résiliation"]} value={typeActionFilter} onChange={setTypeActionFilter} width={160} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Numéro d'affaire</th>
              <th><SortHeader active dir="desc">Date de l'action</SortHeader></th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Nom de l'utilisateur</th>
              <th>Téléphone</th>
              <th>Nom de l'article</th>
              <th style={{ textAlign: "right" }}>Quantité</th>
              <th>Type de prod.</th>
              <th>Type d'action</th>
              <th style={{ width: 48 }}></th>
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
                <td style={{ textAlign: "right", color: "var(--kap-primary)", fontWeight: 700 }}>{r.quantite}</td>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL} perPage={perPage} />
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
  "Bloqué":  <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #D32F2F",color:"#D32F2F",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="ban" size={13}/>Bloqué</span>,
  "Critique": <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #616161",color:"#616161",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="skull" size={13}/>Critique</span>,
  "Mineur":   <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #0288D1",color:"#0288D1",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="info" size={13}/>Mineur</span>,
  "Majeur":   <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #ED6C02",color:"#ED6C02",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="alert-triangle" size={13}/>Majeur</span>,
};
const NATURE_CHIP = {
  "Incident": <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #D32F2F",color:"#D32F2F",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="alert-triangle" size={13}/>Incident</span>,
  "Demande":  <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,border:"1px solid #1976D2",color:"#1976D2",fontSize:12,fontFamily:"var(--kap-font-ui)",fontWeight:600,whiteSpace:"nowrap" }}><Icon name="help-circle" size={13}/>Demande</span>,
};

function TicketsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [criticiteFilter, setCriticiteFilter] = useStateCt([]);
  const [natureFilter, setNatureFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const TOTAL_TKT = 720;
  const totalPages = Math.ceil(TOTAL_TKT / 15);
  const view = TICKETS.slice((page - 1) * 15, page * 15);

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
        <RadioDropdown placeholder="Trier" options={["Date de création","Référence","Sujet","État","Criticité","Nature"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par Référence, Sujet ou Client" width={380} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État" options={["Nouveau","Pris en compte","Assigné","En cours","En attente d'informations","Résolu","En attente de validation","Clôturé - résolu","Clôturé - non résolu"]} value={etatFilter} onChange={setEtatFilter} width={140} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Criticité" options={["Critique","Bloquant","Majeur","Mineur"]} value={criticiteFilter} onChange={setCriticiteFilter} width={140} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Nature" options={["Incident","Demande","Assistance","Production","Avant-vente","Administratif"]} value={natureFilter} onChange={setNatureFilter} width={130} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Référence</SortHeader></th>
              <th>Date de création</th>
              <th>Sujet</th>
              <th>État</th>
              <th>Criticité</th>
              <th>Nature</th>
              <th>Origine</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Site</th>
              <th style={{ width: 48 }}></th>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL_TKT} perPage={15} />
    </>
  );
}

function TicketsArchivesTab() {
  const [activeView, setActiveView] = useStateCt("liste");
  const [sortBy, setSortBy] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [etatFilter, setEtatFilter] = useStateCt([]);
  const [symptomeFilter, setSymptomeFilter] = useStateCt(null);
  const [typeDITFilter, setTypeDITFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL_ARCH = 7592;
  const totalPages = Math.ceil(TOTAL_ARCH / 15);
  const view = TICKETS_ARCHIVES.slice((page - 1) * 15, page * 15);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="download">Exporter des tickets</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Numéro","Symptôme","Type DIT"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par Numéro ou Code Artis" width={340} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="État" options={["Saisie externe","En cours","Travail non terminé","Travail terminé","Clôturé","Annulé"]} value={etatFilter} onChange={setEtatFilter} width={130} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Symptôme" options={["LIEN coupure totale","TEL appels entrants","LIEN Configuration Routeur","Autre"]} value={symptomeFilter} onChange={setSymptomeFilter} width={170} showSearch={false} />
        <RadioDropdown placeholder="Type DIT" options={["Sollicitation Portail client","Sollicitation mail","Proactivité","Autre"]} value={typeDITFilter} onChange={setTypeDITFilter} width={160} showSearch={false} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Numéro</SortHeader></th>
              <th>Date de création</th>
              <th>Symptôme</th>
              <th>État</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Code Artis</th>
              <th>Site</th>
              <th>Type DIT</th>
              <th style={{ width: 48 }}></th>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL_ARCH} perPage={15} />
    </>
  );
}

function ConfigurationsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateCt(null);
  const [statutFilter, setStatutFilter] = useStateCt(null);
  const [revendeurFilter, setRevendeurFilter] = useStateCt(null);
  const [clientFilter, setClientFilter] = useStateCt(null);
  const [siteFilter, setSiteFilter] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const TOTAL_CFG = 320;
  const totalPages = Math.ceil(TOTAL_CFG / 15);
  const view = CONFIGURATIONS.slice((page - 1) * 15, page * 15);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Nouvelle configuration</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","Version","Statut","Date d'archivage","Revendeur","Client","Site","Service"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par N° de série, Revendeur, Client, Site, Se..." width={380} />
        <RadioDropdown placeholder="Statut" options={["Active","Archivée"]} value={statutFilter} onChange={setStatutFilter} width={130} showSearch={false} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Site" options={SITES.map(s => s.label)} value={siteFilter} onChange={setSiteFilter} width={150} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Date de création</SortHeader></th>
              <th>Version</th>
              <th>Lien</th>
              <th>Options</th>
              <th>Numéro de série</th>
              <th>Statut</th>
              <th>Date d'archivage</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Site</th>
              <th>Service</th>
              <th style={{ width: 48 }}></th>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TOTAL_CFG} perPage={15} />
    </>
  );
}

function SupervisionTab({ onOpenDetail }) {
  const [page, setPage] = useStateCt(1);
  const totalPages = Math.max(1, Math.ceil(EQUIPMENTS.length / 15));
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
                <th>ID</th>
                <th><SortHeader active>Équipement</SortHeader></th>
                <th>Client</th>
                <th>Site</th>
                <th>IP</th>
                <th>Uptime</th>
                <th>État</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {EQUIPMENTS.slice((page - 1) * 15, page * 15).map(e => (
                <tr key={e.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "equipment", data: e })}>
                  <td className="mono">{e.id}</td>
                  <td style={{ fontWeight: 600 }}>{e.nom}</td>
                  <td className="muted">{e.client}</td>
                  <td className="muted">{e.site}</td>
                  <td className="mono">{e.ip}</td>
                  <td className="mono">{e.uptime}</td>
                  <td><DotStatus color={e.etat.color} label={e.etat.label} /></td>
                  <td><IconButton icon="more-vertical" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={EQUIPMENTS.length} perPage={15} />
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
  { key: "ndi",       icon: "hash",      label: "NDI",             placeholder: "NDI (ex: 0033123456789)" },
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
              { key:"gps",      icon:"map-pin",    label:"Coordonnées GPS" },
              { key:"immeuble", icon:"building-2", label:"Code immeuble" },
              { key:"ndi",      icon:"phone",      label:"NDI" },
            ].map((m, idx, arr) => (
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
              <div style={{ width:420, flexShrink:0, borderRight:"1px solid var(--kap-border-1)", borderRight:"1px solid var(--kap-border-1)", display:"flex", flexDirection:"column", padding:"16px 12px" }}>
                <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:3, fontSize:12, fontFamily:"var(--kap-font-ui)", border:"none" }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"4px 8px", textAlign:"left" }}></th>
                      {TECHS.map(t => <th key={t} style={{ padding:"4px 8px", textAlign:"center", fontWeight:700, fontSize:11, color:"var(--kap-fg-3)" }}>{t}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {OPERATEURS.map(op => (
                      <tr key={op.key}>
                        <td style={{ padding:"4px 8px", whiteSpace:"nowrap" }}>{op.logo}</td>
                        {TECHS.map(tech => {
                          const val = ELIG_GRID[op.key]?.[tech];
                          const cs = getCellStyle(val);
                          const id = op.key + "_" + tech;
                          const isSel = selectedCells.includes(id);
                          const isClick = typeof val === "number" && val > 0;
                          const isEmpty = val === null || val === undefined;
                          return (
                            <td key={tech} onClick={() => isClick && toggleCell(op.key, tech)}
                              className={isEmpty && progress < 100 ? "elig-cell-loading" : ""}
                              style={{ ...(!isEmpty ? cs : { background: progress >= 100 ? "#eeeeee" : "transparent" }), padding:"8px 16px", textAlign:"center", cursor:isClick ? "pointer" : "default", fontWeight:700, fontSize:13, borderRadius:4, outline:isSel ? "2px solid #1B5E20" : "none", outlineOffset:"-2px" }}>
                              {!isEmpty ? getCellContent(val) : ""}
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
              <div style={{ flex:1, overflowY:"auto", padding:"16px", border:"1px solid var(--kap-border-2)", borderLeft:"none" }}>
                {filteredOffers.length === 0 ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", fontFamily:"var(--kap-font-ui)", fontSize:13, color:"var(--kap-fg-3)", textAlign:"center", padding:20 }}>
                    Veuillez sélectionner une ou plusieurs cases du tableau d'éligibilité afin d'afficher les offres disponibles
                  </div>
                ) : (
                  <div>
                    <div style={{ display:"grid", gridTemplateColumns:"130px 80px 110px 1fr 80px", borderBottom:"1px solid var(--kap-border-1)", paddingBottom:6, marginBottom:4 }}>
                      {["Opérateur","Gamme","Débit ↓","Zone","Articles"].map(h => (
                        <span key={h} style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, fontWeight:700, color:"var(--kap-primary)", padding:"0 6px" }}>{h}</span>
                      ))}
                    </div>
                    {filteredOffers.map((o, idx) => {
                      const opColor = OPERATEURS.find(x => x.key === o.operateur)?.color || "#333";
                      const isExp = expandedOffer === idx;
                      return (
                        <div key={idx} style={{ borderBottom:"1px solid var(--kap-border-1)" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"130px 80px 110px 1fr 80px", alignItems:"center", padding:"10px 0", cursor:"pointer" }} onClick={() => setExpandedOffer(isExp ? null : idx)}>
                            <span style={{ fontWeight:700, color:opColor, fontFamily:"var(--kap-font-ui)", fontSize:13, padding:"0 6px" }}>{o.operateur}</span>
                            <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:13, padding:"0 6px", color:"var(--kap-fg-3)" }}>{o.gamme}</span>
                            <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:13, padding:"0 6px" }}>{o.debit}</span>
                            <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, padding:"0 6px", color:"var(--kap-fg-3)" }}>{o.zone}</span>
                            <span style={{ padding:"0 6px", textAlign:"center" }}><Icon name={isExp ? "chevron-up" : "chevron-down"} size={16} style={{ color:"var(--kap-fg-3)" }} /></span>
                          </div>
                          {isExp && o.articles.length > 0 && (
                            <div style={{ background:"#FAFBFD", borderTop:"1px solid var(--kap-border-1)", padding:"8px 12px" }}>
                              <div style={{ display:"grid", gridTemplateColumns:"80px 80px 1fr 120px 100px", marginBottom:4 }}>
                                {["Référence","Catégorie","Libellé","Prix d'achat","Prix public"].map(h => (
                                  <span key={h} style={{ fontFamily:"var(--kap-font-ui)", fontSize:11, fontWeight:700, color:"var(--kap-primary)", padding:"0 6px" }}>{h}</span>
                                ))}
                              </div>
                              {o.articles.map((a, ai) => (
                                <div key={ai} style={{ display:"grid", gridTemplateColumns:"80px 80px 1fr 120px 100px", padding:"4px 0" }}>
                                  <span style={{ fontFamily:"var(--kap-font-mono)", fontSize:12, padding:"0 6px" }}>{a.ref}</span>
                                  <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, padding:"0 6px", color:"var(--kap-fg-3)" }}>{a.cat}</span>
                                  <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, padding:"0 6px" }}>{a.libelle}</span>
                                  <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, padding:"0 6px", color:"var(--kap-fg-3)" }}>{a.pa}</span>
                                  <span style={{ fontFamily:"var(--kap-font-ui)", fontSize:12, padding:"0 6px", color:"var(--kap-fg-3)" }}>{a.pp}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Nom de la voie" value={nomVoie} onChange={e => setNomVoie(e.target.value)} style={{ width:"100%" }} /></span>
                  <span className="kap-input-wrap" style={{ width:"100%" }}><input placeholder="Numéro de la voie" value={numVoie} onChange={e => setNumVoie(e.target.value)} style={{ width:"100%" }} /></span>
                </div>
                <div style={{ display:"flex", justifyContent:"center", paddingTop:4 }}>
                  <Button variant="primary" disabled={!codePostal || !ville || !nomVoie} onClick={() => setModalStep(2)}>Rechercher une ligne</Button>
                </div>
              </div>
            )}

            {/* Contenu étape 2 */}
            {modalStep === 2 && (
              <div style={{ padding:"20px 24px 24px", display:"flex", flexDirection:"column", gap:16 }}>
                <table className="kap-table" style={{ borderRadius:8, overflow:"hidden", border:"1px solid var(--kap-border-1)" }}>
                  <thead>
                    <tr>
                      <th>NDI</th>
                      <th>Nom du résidant</th>
                      <th>Statut de la ligne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_LIGNES.map(l => (
                      <tr key={l.ndi} className="is-clickable" onClick={() => setSelectedNDI(l.ndi)} style={{ background: selectedNDI === l.ndi ? "var(--kap-primary-soft)" : "transparent" }}>
                        <td className="mono">{l.ndi}</td>
                        <td>{l.resident}</td>
                        <td><span style={{ background: l.statut === "ACTIVE" ? "#2E7D32" : "#D32F2F", color:"#fff", borderRadius:99, padding:2, fontSize:11, fontWeight:700, fontFamily:"var(--kap-font-ui)" }}>{l.statut}</span></td>
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
  if (initialSub === "demande") return <EligPlaceholder titre="Demande d'éligibilité" />;
  if (initialSub === "adresse") return <EligPlaceholder titre="Adresse" />;
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
            <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Informations personnelles</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="kap-field"><label className="kap-field-label">Prénom</label><Input icon={null} value="Mathis" onChange={() => {}} width="100%" /></div>
              <div className="kap-field"><label className="kap-field-label">Nom</label><Input icon={null} value="Bourgoin" onChange={() => {}} width="100%" /></div>
              <div className="kap-field"><label className="kap-field-label">E-mail</label><Input icon="mail" value="mathis.bourgoin@koesio.com" onChange={() => {}} width="100%" /></div>
              <div className="kap-field"><label className="kap-field-label">Téléphone</label><Input icon="phone" value="+33 6 12 34 56 78" onChange={() => {}} width="100%" /></div>
              <div className="kap-field"><label className="kap-field-label">Filiale</label><Select width="100%" value="Koesio Aquitaine" onChange={() => {}} options={["Koesio Aquitaine","Koesio Île-de-France","Koesio Bretagne"]} icon="building-2" /></div>
              <div className="kap-field"><label className="kap-field-label">Rôle</label><Select width="100%" value="Administrateur" onChange={() => {}} options={["Administrateur","Manager","Opérateur","Lecture seule"]} icon="shield" /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button variant="tertiary">Annuler</Button>
              <Button variant="primary" icon="check">Enregistrer</Button>
            </div>
          </div>

          <div className="kap-card kap-card--padded">
            <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Sécurité</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Row label="Mot de passe" sub="Dernière modification le 14/09/2025">
                <Button variant="tertiary" icon="lock">Modifier</Button>
              </Row>
              <Row label="Authentification à deux facteurs" sub="Application Authenticator">
                <span className="kap-pill kap-pill--soft" style={{ "--bg": "#E6F2E7", "--fg": "var(--kap-success)" }}>Activée</span>
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
  { libelle: "Q-NET-001", nbQuestions: 5,  symptomes: "Coupure tunnel" },
  { libelle: "Q-NET-002", nbQuestions: 5,  symptomes: "Coupure totale" },
  { libelle: "Q-NET-003", nbQuestions: 5,  symptomes: "Lenteur VPN" },
  { libelle: "Q-NET-004", nbQuestions: 5,  symptomes: "Lenteur Internet" },
  { libelle: "Q-NET-005", nbQuestions: 5,  symptomes: "Lenteur serv. distant" },
  { libelle: "Q-NET-006", nbQuestions: 5,  symptomes: "Difficulté web" },
  { libelle: "Q-VOI-001", nbQuestions: 7,  symptomes: "Coupure voip" },
  { libelle: "Q-VOI-002", nbQuestions: 7,  symptomes: "VGA HS" },
  { libelle: "Q-VOI-003", nbQuestions: 7,  symptomes: "Qualité VOIP" },
  { libelle: "Q-VOI-004", nbQuestions: 7,  symptomes: "Joignabilité voix" },
  { libelle: "Q-VOI-005", nbQuestions: 7,  symptomes: "Poste isolé" },
  { libelle: "Q-VOI-006", nbQuestions: 7,  symptomes: "Fax" },
  { libelle: "Q-MOB-001", nbQuestions: 7,  symptomes: "Autre problème mobile, Qualité voix / pas de débit, Pas de..." },
  { libelle: "Q-HEB-001", nbQuestions: 2,  symptomes: "Dysfonctionnement FW" },
  { libelle: "Q-HEB-002", nbQuestions: 3,  symptomes: "Perte de connectivité" },
  { libelle: "Q-HEB-003", nbQuestions: 4,  symptomes: "Lenteur applicative" },
  { libelle: "Q-LIA-001", nbQuestions: 5,  symptomes: "Coupure totale lien" },
  { libelle: "Q-LIA-002", nbQuestions: 6,  symptomes: "Dégradation débit" },
];
const Q_DATE = "02/04/2026 - 17:32:56";

function AdminScreen({ initialSub = "questionnaire" }) {
  if (initialSub === "questionnaire") return <QuestionnaireTab />;
  if (initialSub === "regles-service") return <ReglesServiceTab />;
  return null;
}

function QuestionnaireTab() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [page, setPage] = useStateCt(1);
  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(QUESTIONNAIRES.length / perPage));
  const view = QUESTIONNAIRES.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Dernière modification","Libellé"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par libellé" width={360} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Dernière modification</SortHeader></th>
              <th>Libellé</th>
              <th style={{ textAlign: "right" }}>Nombre de questions</th>
              <th>Symptômes liés</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((q, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">{Q_DATE}</td>
                <td style={{ fontWeight: 600 }}>{q.libelle}</td>
                <td style={{ textAlign: "right" }}>{q.nbQuestions}</td>
                <td className="muted">{q.symptomes}</td>
                <td><Tooltip text="Voir le questionnaire" placement="top-end"><IconButton icon="eye" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={QUESTIONNAIRES.length} perPage={perPage} />
    </>
  );
}

const REGLES_SERVICE = [
  { nom: "2 - Cinet" },      { nom: "3 - Cvoice" },       { nom: "43 - Colocation" },
  { nom: "44 - Connectivité" }, { nom: "10 - Option Centrex" }, { nom: "11 - Option Cinet" },
  { nom: "23 - Option Cvoice" }, { nom: "12 - Option Lien" },  { nom: "21 - Option routeur" },
  { nom: "30 - Option VM" }, { nom: "8 - SDA IP" },        { nom: "9 - SDA RNIS" },
  { nom: "98 - Services SAAS" }, { nom: "45 - Stockage" },  { nom: "7 - Voix fixe" },
  { nom: "5 - Mobile" },    { nom: "6 - Hébergement" },    { nom: "13 - Option VM Pro" },
  { nom: "14 - Option Cloud" }, { nom: "15 - Trunk SIP" },  { nom: "16 - Centrex" },
];
const REGLE_DATE = "14/04/2026 - 14:02:47";

function ReglesServiceTab() {
  const [sortBy, setSortBy] = useStateCt(null);
  const [actionFilter, setActionFilter] = useStateCt([]);
  const [typeFilter, setTypeFilter] = useStateCt([]);
  const [page, setPage] = useStateCt(1);
  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(REGLES_SERVICE.length / perPage));
  const view = REGLES_SERVICE.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer une règle</Button>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Dernière modification","Action","Type","Nom"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} />
        <Input placeholder="Rechercher par nom ou id de famille/article" width={380} />
        <RadioDropdown placeholder="Action" options={["Exclure","Dédupliquer"]} value={actionFilter} onChange={setActionFilter} width={130} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Type" options={["Famille","Sous-famille","Article"]} value={typeFilter} onChange={setTypeFilter} width={120} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="desc">Dernière modification</SortHeader></th>
              <th>Action</th>
              <th>Type</th>
              <th>Nom</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={i} className="is-clickable">
                <td className="muted">{REGLE_DATE}</td>
                <td className="muted">Exclure</td>
                <td className="muted">Famille</td>
                <td>{r.nom}</td>
                <td><Tooltip text="Supprimer la règle" placement="top-end"><IconButton icon="x" /></Tooltip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={REGLES_SERVICE.length} perPage={perPage} />
    </>
  );
}

Object.assign(window, { CommandesScreen, TechniqueScreen, AdminScreen, TicketDrawer, EquipmentDrawer, EligibiliteScreen, ProfilScreen });
