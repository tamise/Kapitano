// Screens — Mobiles (Abonnements + Commandes) + Liens d'accès

const { useState: useStateMb } = React;

// ════════════════════════════════════════════════════════════════
// MOBILES
// ════════════════════════════════════════════════════════════════
function MobilesScreen({ initialSub = "abonnements", onOpenDetail }) {
  const titles = { abonnements: "Abonnements mobiles", commandes: "Commande mobile", dispatcher: "Dispatcher" };
  const subs = { abonnements: "Consultez et gérez les abonnements mobiles data.", commandes: "Suivez et gérez les commandes mobiles data.", dispatcher: "Suivez et gérez les commandes SIM en cours de traitement." };
  if (initialSub === "dispatcher") return <DispatcherScreen />;
  if (initialSub === "cartes-sim") return <CartesSIMScreen />;
  if (initialSub === "gestionnaires-flottes") return <GestionnairesFlottesScreen />;
  return (
    <>
      <PageHead icon="smartphone" title={titles[initialSub] || "Mobiles"} subtitle={subs[initialSub]} />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "abonnements" && <MobileSubsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "commandes" && <MobileOrdersTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

function MobileSubsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateMb(null);
  const [sortDir, setSortDir] = useStateMb("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [etatAboFilter, setEtatAboFilter] = useStateMb([]);
  const [etatProdFilter, setEtatProdFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);

  const subsFieldMap = { "Revendeur": "revendeur", "Client": "client", "Numéro mobile": "msisdn", "Forfait": "forfait" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    const key = subsFieldMap[sortBy || "Revendeur"];
    if (!key) return SUBSCRIBERS;
    return [...SUBSCRIBERS].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(
      <><Button variant="primary" icon="plus">Nouvelle commande</Button><Button variant="primary" icon="download">Exporter des abonnements</Button><a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/doc2.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a></>
    );
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Revendeur", "Client", "Numéro mobile", "Forfait", "Etat abo.", "Etat prod."]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher par client, numéro, ICCID, Forfait" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={170} />
        <RadioDropdown placeholder="Etat abo." options={["Actif","Inactif","À activer","En cours d'activation","En cours de désactivation"]} value={etatAboFilter} onChange={setEtatAboFilter} width={150} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Etat prod." options={["Commandé","Création en cours","Actif","Résilié"]} value={etatProdFilter} onChange={setEtatProdFilter} width={150} showSearch={false} multiSelect={true} />
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Revendeur</th>
              <th>Client</th>
              <th><SortHeader active dir="asc">Numéro mobile</SortHeader></th>
              <th>Type</th>
              <th>ICCID</th>
              <th>Utilisateur</th>
              <th>Forfait</th>
              <th>Etat abo.</th>
              <th>Etat prod.</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(s => (
              <tr key={s.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "subscriber", data: s })}>
                <td className="muted">{s.revendeur}</td>
                <td className="muted">{s.client}</td>
                <td className="mono" style={{ fontWeight: 600 }}>{s.msisdn}</td>
                <td>{
                  s.type === "SIM"  ? <Tooltip text="SIM"><Icon name="sim_card" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip> :
                  s.type === "eSIM" ? <Tooltip text="eSIM"><Icon name="qr_code" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip> :
                  <span className="muted">{s.type}</span>
                }</td>
                <td className="mono muted">{s.iccid}</td>
                <td className="muted">{s.utilisateur}</td>
                <td>{s.forfait}</td>
                <td><DotStatus color={s.etatAbo === "Actif" ? "#2E7D32" : s.etatAbo === "Inactif" ? "#616161" : s.etatAbo === "À activer" ? "#ED6C02" : s.etatAbo === "En cours d'activation" ? "#1976D2" : "#9C27B0"} label={s.etatAbo} /></td>
                <td><DotStatus color={s.etatProd === "Actif" ? "#2E7D32" : s.etatProd === "Résilié" ? "#D32F2F" : s.etatProd === "Commandé" ? "#ED6C02" : "#1976D2"} label={s.etatProd} /></td>
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

function MobileOrdersTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateMb(null);
  const [sortDir, setSortDir] = useStateMb("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [typeFilter, setTypeFilter] = useStateMb([]);
  const [portabiliteFilter, setPortabiliteFilter] = useStateMb(null);
  const [etatFilter, setEtatFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);

  const mobOrderFieldMap = { "Date": "dateCommande", "Réf": "ref", "Revendeur": "revendeur", "Client": "client" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }

  const sorted = React.useMemo(() => {
    const key = mobOrderFieldMap[sortBy || "Date"];
    if (!key) return MOBILE_ORDERS;
    return [...MOBILE_ORDERS].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir]);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<><Button variant="primary" icon="plus">Nouvelle commande</Button><Button variant="primary" icon="cloud-upload">Import en masse</Button><a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/doc2.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a></>);
    return () => setTopbarActions(null);
  }, []);
  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Date","Réf","Revendeur","Client","Type de commande","Forfait","Type de SIM","ICCID","Date de portabilité","Etat commande"]}
          value={sortBy}
          onChange={setSortBy}
          onSortChange={handleSortChange}
          width={130}
          showSearch={false}
          showRadio={false}
          sortMode={true}
        />
        <Input placeholder="Rechercher par Réf, Client, Numéro, ICCID, Forfait" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type commande" options={["Création","Modification","Résiliation","Portabilité sortante"]} value={typeFilter} onChange={setTypeFilter} width={170} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Portabilité" options={["Oui","Non"]} value={portabiliteFilter} onChange={setPortabiliteFilter} width={140} showSearch={false} />
        <RadioDropdown placeholder="Etat commande" options={["En brouillon","Programmée","Crée","Annulation en cours","Annulée","En cours","En cours (erreur)","Incident en cours","En attente","Terminée avec succès","Terminée avec erreur"]} value={etatFilter} onChange={setEtatFilter} width={160} showSearch={false} multiSelect={true} />
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
              <th>Client</th>
              <th>Type commande</th>
              <th>Forfait</th>
              <th>Numéro</th>
              <th>Type</th>
              <th>ICCID</th>
              <th>Portabilité</th>
              <th>Etat commande</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "mob-order", data: o })}>
                <td className="mono muted">{o.ref}</td>
                <td className="muted">{o.dateCommande}</td>
                <td className="muted">{o.revendeur}</td>
                <td>{o.client}</td>
                <td className="muted">{o.typeCommande}</td>
                <td className="muted">{o.forfait}</td>
                <td className="mono muted">{o.numero}</td>
                <td>{o.type === "SIM" ? <Tooltip text="SIM"><Icon name="sim_card" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip> : <Tooltip text="eSIM"><Icon name="qr_code" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>}</td>
                <td className="mono muted">{o.iccid}</td>
                <td className="muted">{o.portabilite}</td>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function SubscriberDrawer({ s, onClose }) {
  return (
    <Drawer title={s.msisdn} subtitle={`${s.forfait} · ${s.client}`} onClose={onClose}
      footer={<>
        <Button variant="danger" icon="ban">Suspendre</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Abonnement">
        <DetailRow label="ID"><span className="kap-mono">{s.id}</span></DetailRow>
        <DetailRow label="MSISDN"><span className="kap-mono" style={{ fontWeight: 600 }}>{s.msisdn}</span></DetailRow>
        <DetailRow label="ICCID"><span className="kap-mono">{s.iccid}</span></DetailRow>
        <DetailRow label="Forfait">{s.forfait}</DetailRow>
        <DetailRow label="Porteur réseau">{s.porteur}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={s.statut.color} label={s.statut.label} /></DetailRow>
        <DetailRow label="Date d'activation">{s.activation}</DetailRow>
      </DetailSection>
      <DetailSection title="Consommation du cycle">
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: "var(--kap-font-display-lg)", fontWeight: 700, fontSize: 32, color: "var(--kap-fg-1)" }}>
              {s.conso}
            </div>
            <div style={{ fontFamily: "var(--kap-font-ui)", color: "var(--kap-fg-3)", fontSize: 13 }}>
              consommés sur {s.forfait.split(" ").pop()} {s.forfait.includes("Illimité") ? "" : "data"}
            </div>
          </div>
          <ProgressBar value={s.consoVal} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)" }}>
            <span>Cycle 01/11/2025 → 30/11/2025</span>
            <span>{30 - new Date().getDate()} jours restants</span>
          </div>
        </div>
      </DetailSection>
      <DetailSection title="Affectation">
        <DetailRow label="Client">{s.client}</DetailRow>
        <DetailRow label="Site">{s.site}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function OrderDrawer({ o, title, onClose }) {
  return (
    <Drawer title={`${title} ${o.id}`} subtitle={o.client} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="printer">Imprimer</Button>
        <Button variant="primary" icon="external-link">Suivre</Button>
      </>}>
      <DetailSection title="Commande">
        <DetailRow label="N° de commande"><span className="kap-mono">{o.id}</span></DetailRow>
        <DetailRow label="Client">{o.client}</DetailRow>
        {o.forfait && <DetailRow label="Forfait">{o.forfait}</DetailRow>}
        {o.canaux && <DetailRow label="Canaux">{o.canaux}</DetailRow>}
        {o.technologie && <DetailRow label="Technologie">{o.technologie}</DetailRow>}
        {o.site && <DetailRow label="Site">{o.site}</DetailRow>}
        {o.type && <DetailRow label="Type">{o.type}</DetailRow>}
        {o.quantite != null && <DetailRow label="Quantité">{o.quantite}</DetailRow>}
        {o.montant && <DetailRow label="Montant HT"><strong>{o.montant}</strong></DetailRow>}
        <DetailRow label="Statut"><DotStatus color={o.statut.color} label={o.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Dates">
        {o.dateCommande && <DetailRow label="Commandée le">{o.dateCommande}</DetailRow>}
        {o.dateLivraison && <DetailRow label="Livraison">{o.dateLivraison}</DetailRow>}
        {o.dateCreation && <DetailRow label="Créée le">{o.dateCreation}</DetailRow>}
        {o.rdv && <DetailRow label="RDV technicien">{o.rdv}</DetailRow>}
        {o.revendeur && <DetailRow label="Revendeur">{o.revendeur}</DetailRow>}
      </DetailSection>
      <DetailSection title="Étapes">
        <div style={{ padding: "8px 16px 16px" }}>
          <OrderTimeline statutLabel={o.statut.label} />
        </div>
      </DetailSection>
    </Drawer>
  );
}

function OrderTimeline({ statutLabel }) {
  const steps = ["Brouillon","En attente","En cours","Livrée"];
  const cancelled = statutLabel === "Annulée" || statutLabel === "Bloquée" || statutLabel === "Rejetée";
  const idx = steps.indexOf(statutLabel);
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {steps.map((s, i) => {
        const done = i <= idx && !cancelled;
        const current = i === idx && !cancelled;
        return (
          <li key={s} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--kap-font-ui)", fontSize: 13 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 9999,
              background: done ? "var(--kap-primary)" : "#EAEAEA",
              color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
              border: current ? "3px solid rgba(126,65,163,.2)" : "none",
            }}>
              {done ? "✓" : i + 1}
            </span>
            <span style={{ color: done || current ? "var(--kap-fg-1)" : "var(--kap-fg-3)", fontWeight: current ? 700 : 400 }}>{s}</span>
            {current && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--kap-primary)", fontWeight: 600 }}>EN COURS</span>}
          </li>
        );
      })}
      {cancelled && (
        <li style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--kap-font-ui)", fontSize: 13, marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--kap-divider)" }}>
          <span style={{ width: 22, height: 22, borderRadius: 9999, background: "var(--kap-error)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✕</span>
          <span style={{ color: "var(--kap-error)", fontWeight: 700 }}>{statutLabel}</span>
        </li>
      )}
    </ol>
  );
}

// ════════════════════════════════════════════════════════════════
// DISPATCHER
// ════════════════════════════════════════════════════════════════
const DISPATCHER_STATS = [
  { key: "completer",  label: "À compléter",          total: 12, alerte: 12, icon: "pencil" },
  { key: "imprimer",   label: "À imprimer",            total: 0,  alerte: 0,  icon: "printer" },
  { key: "envoi",      label: "En attente d'envoi",    total: 0,  alerte: 0,  icon: "mail" },
  { key: "livraison",  label: "En cours de livraison", total: 7,  alerte: 7,  icon: "local_shipping" },
  { key: "recues",     label: "Reçues",                total: 11, alerte: 0,  icon: "check" },
  { key: "incident",   label: "En incident",           total: 4,  alerte: 4,  icon: "alert-triangle" },
];

function DispatcherScreen() {
  const [tab, setTab] = useStateMb("dashboard");
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(
      <a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/doc2.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a>
    );
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <PageHead icon="smartphone" title="Dispatcher" subtitle="Suivez et gérez les commandes SIM en cours de traitement." />
      <div className="kap-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Toolbar>
          <RadioDropdown placeholder="Trier" options={["Date de création","Numéro d'affaire","Date étape"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} sortMode={true} />
          <Input placeholder="Rechercher par numéro d'affaire ou client" width={360} />
          <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
          <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
          <div className="grow" />
          <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
        </Toolbar>

        {/* Onglets */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--kap-divider)", background: "#fff", padding: "0 16px", flexShrink: 0 }}>
          <div
            onClick={() => setTab("dashboard")}
            style={{ padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)", display: "flex", alignItems: "center", gap: 8, borderBottom: tab === "dashboard" ? "2px solid var(--kap-primary)" : "2px solid transparent", color: tab === "dashboard" ? "var(--kap-primary)" : "var(--kap-fg-2)", fontWeight: tab === "dashboard" ? 600 : 400 }}
          >
            <Icon name="layers" size={16} />Dashboard
          </div>
          {DISPATCHER_STATS.map(s => (
            <div key={s.key} onClick={() => setTab(s.key)}
              style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)", display: "flex", alignItems: "center", gap: 6, borderBottom: tab === s.key ? "2px solid var(--kap-primary)" : "2px solid transparent", color: tab === s.key ? "var(--kap-primary)" : "var(--kap-fg-2)", fontWeight: tab === s.key ? 600 : 400, whiteSpace: "nowrap" }}
            >
              <Icon name={s.icon} size={16} />{s.label}
              <span style={{ display: "inline-flex", gap: 3, marginLeft: 2 }}>
                <span style={{ background: "var(--kap-primary)", color: "#fff", borderRadius: 99, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>{s.total}</span>
                <span style={{ background: s.alerte > 0 ? "#ED6C02" : "#E0E0E0", color: s.alerte > 0 ? "#fff" : "#9E9E9E", borderRadius: 99, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>{s.alerte}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, padding: 16, overflowY: "auto", flex: 1 }}>
            {DISPATCHER_STATS.map(s => (
              <div key={s.key} onClick={() => setTab(s.key)} style={{ background: "#fff", borderRadius: 10, boxShadow: "var(--kap-shadow-card)", cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--kap-border-1)" }}>
                <div style={{ padding: "16px 16px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ background: "var(--kap-primary)", color: "#fff", borderRadius: 8, minWidth: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 17, padding: "0 8px" }}>{s.total}</span>
                    <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, fontWeight: 600, color: "var(--kap-fg-dark)" }}>{s.label}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
                    <Icon name={s.icon} size={64} style={{ color: "#D8CFF0" }} />
                  </div>
                </div>
                <div style={{ background: s.alerte > 0 ? "#FFF3E0" : "#F5F5F5", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--kap-font-ui)", fontSize: 13, color: s.alerte > 0 ? "#ED6C02" : "#9E9E9E" }}>
                  {s.alerte > 0 && <Icon name="alert-triangle" size={14} />}
                  <span style={{ fontWeight: 700 }}>{s.alerte}</span>
                  <span>En alerte</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// CARTES SIM
// ════════════════════════════════════════════════════════════════
const ETATS_SIM = ["Disponible","Disponible","Disponible","Créée","Réservée","Utilisée","Archivée"];
const LOCALISATIONS_SIM = ["Chez le revendeur","Chez le client","Chez Koesio Networks"];
const OPERATEURS_SIM = ["ORANGE","ORANGE","SFR","BOUYGUES","FREE"];
const SIM_REVENDEURS = ["Koesio AURA TELECOM","Koesio IDF","Koesio Grand Est","Koesio PACA","Koesio Aquitaine","Koesio Nord Ouest"];

const CARTES_SIM = Array.from({ length: 36147 }).map((_, i) => ({
  iccid: `8933012277777777${String(63070 + i * 80).padStart(5,"0")}`,
  revendeur: SIM_REVENDEURS[i % SIM_REVENDEURS.length],
  operateur: OPERATEURS_SIM[i % OPERATEURS_SIM.length],
  type: i % 5 === 3 ? "eSIM" : "SIM",
  etat: ETATS_SIM[i % ETATS_SIM.length],
  dateStatut: `${pad(4)}/${pad(3)}/2026 - 18:01:${pad(i % 60)}`,
  localisation: LOCALISATIONS_SIM[i % LOCALISATIONS_SIM.length],
}));

function CartesSIMScreen() {
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [typeFilter, setTypeFilter] = useStateMb(null);
  const [etatFilter, setEtatFilter] = useStateMb(null);
  const [page, setPage] = useStateMb(1);
  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(CARTES_SIM.length / perPage));
  const view = CARTES_SIM.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(
      <a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/Doc.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a>
    );
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <PageHead icon="sim_card" title="Cartes SIM" subtitle="Consultez et gérez le stock de cartes SIM." />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        <Toolbar>
          <RadioDropdown placeholder="Trier" options={["Date du statut","Revendeur","Opérateur","ICCID","Etat"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} sortMode={true} />
          <Input placeholder="Rechercher par ICCID" width={360} />
          <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={200} />
          <RadioDropdown placeholder="Type" options={["SIM","eSIM","SIM 15D"]} value={typeFilter} onChange={setTypeFilter} width={120} showSearch={false} />
          <RadioDropdown placeholder="État" options={["Créée","Disponible","Réservée","Utilisée","Archivée"]} value={etatFilter} onChange={setEtatFilter} width={140} showSearch={false} />
          <div className="grow" />
          <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
        </Toolbar>
        <TableBox>
          <table className="kap-table">
            <thead>
              <tr>
                <th>Revendeur</th>
                <th>Opérateur</th>
                <th>Type</th>
                <th>ICCID</th>
                <th>État</th>
                <th><SortHeader active dir="desc">Date du statut</SortHeader></th>
                <th>Localisation</th>
              </tr>
            </thead>
            <tbody>
              {view.map(s => (
                <tr key={s.iccid}>
                  <td style={{ fontWeight: 600 }}>{s.revendeur}</td>
                  <td className="muted">{s.operateur}</td>
                  <td>{s.type === "SIM" ? <Tooltip text="SIM"><Icon name="sim_card" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip> : <Tooltip text="eSIM"><Icon name="qr_code" size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip>}</td>
                  <td className="mono muted">{s.iccid}</td>
                  <td className="muted">{s.etat}</td>
                  <td className="muted">{s.dateStatut}</td>
                  <td className="muted">{s.localisation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={CARTES_SIM.length} perPage={perPage} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// GESTIONNAIRES DE FLOTTES
// ════════════════════════════════════════════════════════════════
const GF_NOMS = ["CORINNE","test2","qsdfqsdf","test","bat","batbatbat","Fonseca","Sage","Textor","ttt","Mélouki","Dupont","Martin","Lemaire","Garnier","Rousseau","Bernard","Moreau","Laurent","Simon","Michel","Lefebvre","Leroy","Roux","David","Bertrand","Morel","Fournier","Girard","Bonnet","Dubois","Thomas"];
const GF_PRENOMS = ["FILIOLE","test","tb","test","bat test 2","bat","Paulo","Pierre","John","ttt","Léa","Jean","Marie","Pierre","Sophie","Lucas","Emma","Hugo","Camille","Thomas","Lucie","Marc","Alice","Paul","Julie","Nicolas","Isabelle","Antoine","Claire","François","Nathalie","Olivier"];
const GF_EMAILS = ["corinne.filiol@charlesetalice.fr","battest24@ipneos.com","bat1111111@club.fr","testtesttest@ipneos.com","bat77@libertysurf.fr","bat7@libertysurf.fr","paulo@gmail.com","pierre.sage@gmail.com","john.textor@gmail.com","test@gmail.com","lea.melouki@macosite.com","jean.dupont@gmail.com","marie.martin@outlook.fr","pierre.lemaire@yahoo.fr","sophie.garnier@gmail.com","lucas.rousseau@hotmail.fr","emma.bernard@gmail.com","hugo.moreau@outlook.fr","camille.laurent@gmail.com","thomas.simon@yahoo.fr","lucie.michel@gmail.com","marc.lefebvre@outlook.fr","alice.leroy@gmail.com","paul.roux@hotmail.fr","julie.david@gmail.com","nicolas.bertrand@outlook.fr","isabelle.morel@gmail.com","antoine.fournier@yahoo.fr","claire.girard@gmail.com","francois.bonnet@outlook.fr","nathalie.dubois@gmail.com","olivier.thomas@hotmail.fr"];
const GF_REVENDEURS = ["Koesio AURA TELECOM","Ipneos","Koesio NETWORKS","Koesio PACA","ABC TELECOMS","Koesio OCCITANIE","2IT SOLUTIONS","Koesio IDF","Koesio Grand Est","AXIUM SOLUTIONS"];
const GF_DATES = ["02/03/2026 - 16:27:31","27/02/2026 - 15:52:05","27/03/2025 - 22:31:42","21/03/2025 - 11:49:31","20/03/2025 - 00:11:53","19/03/2025 - 23:46:28","19/03/2025 - 23:45:44","11/03/2025 - 10:09:24","11/03/2025 - 08:11:09","06/03/2025 - 11:26:15","06/03/2025 - 10:37:19","06/03/2025 - 09:50:22","05/03/2025 - 16:50:10","05/03/2025 - 15:10:52","04/03/2025 - 09:22:11","03/03/2025 - 14:33:45","02/03/2025 - 11:05:30","01/03/2025 - 09:17:22","28/02/2025 - 16:44:01","27/02/2025 - 13:21:55","26/02/2025 - 10:08:44","25/02/2025 - 15:37:29","24/02/2025 - 09:52:13","23/02/2025 - 14:18:07","22/02/2025 - 11:43:52","21/02/2025 - 09:29:41","20/02/2025 - 16:55:30","19/02/2025 - 13:10:19","18/02/2025 - 10:27:08","17/02/2025 - 15:42:57","16/02/2025 - 09:08:46","15/02/2025 - 14:24:35"];

const GESTIONNAIRES_FLOTTES = GF_NOMS.map((nom, i) => ({
  id: i + 1,
  nom,
  prenom: GF_PRENOMS[i],
  email: GF_EMAILS[i],
  revendeur: GF_REVENDEURS[i % GF_REVENDEURS.length],
  dateCreation: GF_DATES[i],
  actif: i % 8 !== 7,
}));

function GestionnairesFlottesScreen() {
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [page, setPage] = useStateMb(1);
  const perPage = 15;
  const totalPages = Math.max(1, Math.ceil(GESTIONNAIRES_FLOTTES.length / perPage));
  const view = GESTIONNAIRES_FLOTTES.slice((page - 1) * perPage, page * perPage);

  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="plus">Ajouter un gestionnaire de flotte</Button>
      <a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/Doc.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a>
    </>);
    return () => setTopbarActions(null);
  }, []);

  return (
    <>
      <PageHead icon="smartphone" title="Gestionnaires de flottes" subtitle="Consultez et gérez les gestionnaires de flottes mobiles." />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        <Toolbar>
          <RadioDropdown placeholder="Trier" options={["Date de création","Actif","Nom","Prénom","Email","Revendeur associé"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} sortMode={true} />
          <Input placeholder="Rechercher par nom, prénom, e-mail" width={360} />
          <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={190} />
          <RadioDropdown placeholder="Clients" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
          <div className="grow" />
          <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
        </Toolbar>
        <TableBox>
          <table className="kap-table">
            <thead>
              <tr>
                <th>Actif</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Revendeur associé</th>
                <th><SortHeader active dir="desc">Date de création</SortHeader></th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {view.map(g => (
                <tr key={g.id} className="is-clickable">
                  <td>{g.actif
                    ? <Icon name="check-circle-2" size={18} style={{ color: "#2E7D32" }} />
                    : <Icon name="x-circle" size={18} style={{ color: "#D32F2F" }} />}
                  </td>
                  <td style={{ fontWeight: 600 }}>{g.nom}</td>
                  <td>{g.prenom}</td>
                  <td className="muted">{g.email}</td>
                  <td className="muted">{g.revendeur}</td>
                  <td className="muted">{g.dateCreation}</td>
                  <td><IconButton icon="more-vertical" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableBox>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={GESTIONNAIRES_FLOTTES.length} perPage={perPage} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// SEUILS DE CONSOMMATION
// ════════════════════════════════════════════════════════════════
function SeuilsConsommationScreen() {
  const [seuilInput, setSeuilInput] = useStateMb("");
  const [action, setAction] = useStateMb("email");
  const [seuils, setSeuils] = useStateMb([
    { id: 1, seuil: 50,  action: "log",     actif: true  },
    { id: 2, seuil: 80,  action: "email",   actif: true  },
    { id: 3, seuil: 100, action: "suspend", actif: true  },
    { id: 4, seuil: 200, action: "email",   actif: true  },
  ]);

  const ACTIONS = [
    { key: "log",     icon: "description", label: "Journalisation seule",                desc: "Enregistre uniquement le franchissement du seuil, sans envoi d'e-mail ni suspension." },
    { key: "email",   icon: "mail",       label: "Journalisation et e-mail",            desc: "Enregistre le franchissement du seuil et envoie un e-mail d'alerte." },
    { key: "suspend", icon: "pause_circle", label: "Journalisation, e-mail et suspension", desc: "Enregistre le franchissement, envoie un e-mail d'alerte et suspend les données mobiles de la ligne." },
  ];

  const ACTION_ICONS = { log: "description", email: "mail", suspend: "pause_circle" };

  function handleAjouter() {
    const val = parseInt(seuilInput);
    if (!val || val < 1) return;
    setSeuils(prev => [...prev, { id: Date.now(), seuil: val, action, actif: true }].sort((a,b) => a.seuil - b.seuil));
    setSeuilInput("");
  }

  function toggleActif(id) {
    setSeuils(prev => prev.map(s => s.id === id ? { ...s, actif: !s.actif } : s));
  }

  return (
      <div className="kap-card" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* En-tête pleine largeur */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--kap-divider)", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 18, color: "var(--kap-fg-dark)", marginBottom: 6 }}>Seuils de Consommation mobile data</div>
          <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)" }}>Indiquez un pourcentage de déclenchement, choisissez l'action lorsque la consommation l'atteint, puis ajoutez le seuil. Vous pouvez activer ou désactiver chaque règle dans le tableau.</div>
        </div>

        {/* Deux panneaux */}
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* Panneau gauche — formulaire */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, padding: "20px 24px", borderRight: "1px solid var(--kap-divider)", overflowY: "auto" }}>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16 }}>Ajouter un seuil</div>

          {/* Étape 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 99, background: "var(--kap-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, fontFamily: "var(--kap-font-ui)", flexShrink: 0 }}>1</span>
              <span style={{ fontFamily: "var(--kap-font-ui)", fontWeight: 600, fontSize: 14 }}>Seuil (%)</span>
            </div>
            <span className="kap-input-wrap" style={{ width: "100%" }}>
              <input type="number" min="1" placeholder="Seuil (%)" value={seuilInput} onChange={e => setSeuilInput(e.target.value)} style={{ width: "100%" }} />
              <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 13, color: "var(--kap-fg-3)", paddingRight: 4 }}>%</span>
            </span>
            <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)" }}>Part du forfait de données mensuel (nombre entier, minimum 1). Vous pouvez en définir plusieurs - par exemple 80&nbsp;% puis 150&nbsp;%.</span>
          </div>

          {/* Étape 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 99, background: "var(--kap-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, fontFamily: "var(--kap-font-ui)", flexShrink: 0 }}>2</span>
              <span style={{ fontFamily: "var(--kap-font-ui)", fontWeight: 600, fontSize: 14 }}>Lorsque le seuil est franchi</span>
            </div>
            {ACTIONS.map(a => (
              <div key={a.key} onClick={() => setAction(a.key)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", border: `1.5px solid ${action === a.key ? "var(--kap-primary)" : "var(--kap-border-2)"}`, borderRadius: 8, cursor: "pointer", background: action === a.key ? "var(--kap-primary-soft)" : "#fff" }}>
                <Icon name={a.icon} size={20} style={{ color: action === a.key ? "var(--kap-primary)" : "var(--kap-fg-3)", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: "var(--kap-font-ui)", fontWeight: 600, fontSize: 13, color: action === a.key ? "var(--kap-primary)" : "var(--kap-fg-dark)" }}>{a.label}</div>
                  <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)", marginTop: 3 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div style={{ background: "#E3F2FD", border: "1px solid #90CAF9", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="info" size={18} style={{ color: "#1976D2", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "#1565C0" }}>Un seuil ajouté en cours de mois s'applique aussi aux lignes qui l'ont déjà dépassé sur le mois en cours. Les actions associées seront exécutées lors de la prochaine évaluation.</span>
          </div>

          <div><Button variant="primary" onClick={handleAjouter} disabled={!seuilInput || parseInt(seuilInput) < 1}>Ajouter un seuil</Button></div>
        </div>

        {/* Panneau droit — tableau des seuils */}
        <div style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, padding: "16px 20px 8px" }}>Seuils de consommation</div>
          <table className="kap-table">
            <thead>
              <tr>
                <th>Seuil (%)</th>
                <th>Niveau d'action</th>
                <th style={{ textAlign: "right" }}>Actif</th>
              </tr>
            </thead>
            <tbody>
              {seuils.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.seuil}%</td>
                  <td><Tooltip text={{ log: "Journalisation seule", email: "Journalisation et e-mail", suspend: "Journalisation, e-mail et suspension" }[s.action]}><Icon name={ACTION_ICONS[s.action]} size={18} style={{ color: "var(--kap-fg-3)" }} /></Tooltip></td>
                  <td style={{ textAlign: "right" }}>
                    <span onClick={() => toggleActif(s.id)} style={{ display: "inline-block", width: 36, height: 20, borderRadius: 99, background: s.actif ? "var(--kap-primary)" : "#ccc", cursor: "pointer", position: "relative", transition: "background 200ms", flexShrink: 0 }}>
                      <span style={{ position: "absolute", top: 2, left: s.actif ? 18 : 2, width: 16, height: 16, borderRadius: 99, background: "#fff", transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
  );
}

// ════════════════════════════════════════════════════════════════
// LIENS D'ACCÈS
// ════════════════════════════════════════════════════════════════
function LinksScreen({ initialSub = "abonnements", onOpenDetail }) {
  if (initialSub === "seuils") return <SeuilsConsommationScreen />;
  const titles = { abonnements: "Abonnements mobile data", commandes: "Commandes mobile data" };
  const subs = { abonnements: "Consultez et gérez les abonnements de liens d'accès.", commandes: "Suivez et gérez les commandes de liens d'accès." };
  return (
    <>
      <PageHead icon="wifi" title={titles[initialSub] || "Liens d'accès"} subtitle={subs[initialSub]} />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "abonnements" && <AccessSubsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "commandes"   && <AccessOrdersTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

function AccessSubsTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [etatAboFilter, setEtatAboFilter] = useStateMb([]);
  const [etatProdFilter, setEtatProdFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);
  const totalPages = Math.max(1, Math.ceil(ACCESS_LINKS.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Etat abo.","Revendeur","Client","Site","Numéro mobile","Offre","Etat prod."]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par N° ICCID, nom du lien, client, forfait" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Etat abo." options={["Actif","Inactif","À activer","En cours d'activation","En cours de désactivation"]} value={etatAboFilter} onChange={setEtatAboFilter} width={150} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Etat prod." options={["Commandé","Création en cours","Actif","Résilié"]} value={etatProdFilter} onChange={setEtatProdFilter} width={150} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw">Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Site</th>
              <th>Numéro mobile</th>
              <th>ICCID</th>
              <th><SortHeader active dir="asc">Nom du lien</SortHeader></th>
              <th>Offre</th>
              <th>Etat abo.</th>
              <th>Etat prod.</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_LINKS.slice((page - 1) * 15, page * 15).map(l => (
              <tr key={l.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "access", data: l })}>
                <td className="muted">{l.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{l.client}</td>
                <td className="muted">{l.site}</td>
                <td className="mono muted">{l.numero}</td>
                <td className="mono muted">{l.iccid}</td>
                <td>{l.nomLien}</td>
                <td className="muted">{l.offre}</td>
                <td><DotStatus color={l.etatAbo === "Actif" ? "#2E7D32" : l.etatAbo === "Inactif" ? "#616161" : l.etatAbo === "À activer" ? "#ED6C02" : l.etatAbo === "En cours d'activation" ? "#1976D2" : "#9C27B0"} label={l.etatAbo} /></td>
                <td><DotStatus color={l.etatProd === "Actif" ? "#2E7D32" : l.etatProd === "Résilié" ? "#D32F2F" : l.etatProd === "Commandé" ? "#ED6C02" : "#1976D2"} label={l.etatProd} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={ACCESS_LINKS.length} perPage={15} />
    </>
  );
}

function AccessOrdersTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [typeFilter, setTypeFilter] = useStateMb([]);
  const [etatFilter, setEtatFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);
  const totalPages = Math.max(1, Math.ceil(ACCESS_ORDERS.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date","Réf","Revendeur","Client","Type commande","Etat commande"]} value={sortBy} onChange={setSortBy} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par Réf, Client, Numéro, ICCID, Forfait" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type commande" options={["Création","Modification","Résiliation","Portabilité sortante"]} value={typeFilter} onChange={setTypeFilter} width={170} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="Etat commande" options={["En brouillon","Programmée","Crée","Annulation en cours","Annulée","En cours","En cours (erreur)","Incident en cours","En attente","Terminée avec succès","Terminée avec erreur"]} value={etatFilter} onChange={setEtatFilter} width={170} showSearch={false} multiSelect={true} />
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
              <th>Client</th>
              <th>Type commande</th>
              <th>Forfait</th>
              <th>ICCID</th>
              <th>Numéro</th>
              <th>Etat commande</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_ORDERS.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "access-order", data: o })}>
                <td className="mono muted">{o.ref}</td>
                <td className="muted">{o.dateCommande}</td>
                <td className="muted">{o.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{o.client}</td>
                <td className="muted">{o.typeCommande}</td>
                <td className="muted">{o.forfait}</td>
                <td className="mono muted">{o.iccid}</td>
                <td className="mono muted">{o.numero}</td>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={ACCESS_ORDERS.length} perPage={15} />
    </>
  );
}

function AccessDrawer({ l, onClose }) {
  return (
    <Drawer title={l.reference} subtitle={`${l.technologie} · ${l.client}`} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="ticket">Ouvrir un ticket</Button>
        <Button variant="primary" icon="activity">Tester le lien</Button>
      </>}>
      <DetailSection title="Lien d'accès">
        <DetailRow label="Référence"><span className="kap-mono" style={{ fontWeight: 600 }}>{l.reference}</span></DetailRow>
        <DetailRow label="ID"><span className="kap-mono">{l.id}</span></DetailRow>
        <DetailRow label="Technologie">{l.technologie}</DetailRow>
        <DetailRow label="Débit nominal"><strong>{l.debit}</strong></DetailRow>
        <DetailRow label="Opérateur d'infrastructure">{l.operateur}</DetailRow>
        <DetailRow label="Activation">{l.activation}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={l.statut.color} label={l.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Affectation">
        <DetailRow label="Client">{l.client}</DetailRow>
        <DetailRow label="Site">{l.site}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

Object.assign(window, { MobilesScreen, DispatcherScreen, CartesSIMScreen, GestionnairesFlottesScreen, LinksScreen, SeuilsConsommationScreen, SubscriberDrawer, OrderDrawer, AccessDrawer });
