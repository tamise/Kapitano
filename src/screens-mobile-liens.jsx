// Screens — Mobiles (Abonnements + Commandes) + Liens d'accès

const { useState: useStateMb } = React;

// ════════════════════════════════════════════════════════════════
// MOBILES
// ════════════════════════════════════════════════════════════════
function MobilesScreen({ initialSub = "abonnements", onOpenDetail }) {
  const titles = { abonnements: "Abonnements mobiles", commandes: "Commande mobile" };
  const subs = { abonnements: "Consultez et gérez les abonnements mobiles data.", commandes: "Suivez et gérez les commandes mobiles data." };
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
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [etatAboFilter, setEtatAboFilter] = useStateMb([]);
  const [etatProdFilter, setEtatProdFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);
  const totalPages = Math.max(1, Math.ceil(SUBSCRIBERS.length / 15));
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
          width={130}
          showSearch={false}
          showRadio={false}
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
            {SUBSCRIBERS.slice((page - 1) * 15, page * 15).map(s => (
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={SUBSCRIBERS.length} perPage={15} />
    </>
  );
}

function MobileOrdersTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateMb(null);
  const [revendeurFilter, setRevendeurFilter] = useStateMb(null);
  const [clientFilter, setClientFilter] = useStateMb(null);
  const [typeFilter, setTypeFilter] = useStateMb([]);
  const [portabiliteFilter, setPortabiliteFilter] = useStateMb(null);
  const [etatFilter, setEtatFilter] = useStateMb([]);
  const [page, setPage] = useStateMb(1);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<><Button variant="primary" icon="plus">Nouvelle commande</Button><Button variant="primary" icon="cloud-upload">Import en masse</Button><a href="https://xenomcloud.sharepoint.com/:p:/r/sites/NET_Networks-Dokumentation/_layouts/15/doc2.aspx?sourcedoc=%7B622B2A6B-3281-4C99-BFF6-73DF287B0C9D%7D&file=KAPITANO%20-%20Mobile%20-%20Gestion%20des%20commandes%20et%20abonnements.pptx&action=edit&mobileredirect=true" target="_blank" rel="noreferrer" className="kap-btn kap-btn--primary" style={{ color: "#fff" }}>?</a></>);
    return () => setTopbarActions(null);
  }, []);
  const totalPages = Math.max(1, Math.ceil(MOBILE_ORDERS.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown
          placeholder="Trier"
          options={["Date","Réf","Revendeur","Client","Type de commande","Forfait","Type de SIM","ICCID","Date de portabilité","Etat commande"]}
          value={sortBy}
          onChange={setSortBy}
          width={130}
          showSearch={false}
          showRadio={false}
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
            {MOBILE_ORDERS.slice((page - 1) * 15, page * 15).map(o => (
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
                <td><DotStatus color={o.etatCommande === "Terminée avec succès" ? "#2E7D32" : o.etatCommande === "Annulée" || o.etatCommande === "Terminée avec erreur" || o.etatCommande === "En cours (erreur)" ? "#D32F2F" : o.etatCommande === "En cours" || o.etatCommande === "Crée" ? "#ED6C02" : o.etatCommande === "En attente" ? "#0288D1" : "#616161"} label={o.etatCommande} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={MOBILE_ORDERS.length} perPage={15} />
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
// LIENS D'ACCÈS
// ════════════════════════════════════════════════════════════════
function LinksScreen({ initialSub = "abonnements", onOpenDetail }) {
  const titles = { abonnements: "Abonnements mobile data", commandes: "Commande mobile" };
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
  const [page, setPage] = useStateMb(1);
  const totalPages = Math.max(1, Math.ceil(ACCESS_LINKS.length / 15));
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par référence, client, site…" width={360} />
        <Select placeholder="Technologie" options={["FTTH","FTTO","SDSL","ADSL","4G FWA","5G FWA"]} width={150} icon="zap" />
        <Select placeholder="Opérateur" options={["Orange","SFR","Free Pro","Bouygues","Covage","Axione"]} width={160} icon="antenna" />
        <Select placeholder="Statut" options={["En service","Provisioning","En coupure"]} width={160} icon="circle" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        <Button variant="primary" icon="plus">Nouveau lien</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th><SortHeader active dir="asc">Référence</SortHeader></th>
              <th>ID</th>
              <th>Client</th>
              <th>Site</th>
              <th>Technologie</th>
              <th>Débit</th>
              <th>Opérateur</th>
              <th>Activation</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_LINKS.slice((page - 1) * 15, page * 15).map(l => (
              <tr key={l.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "access", data: l })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono" style={{ fontWeight: 600 }}>{l.reference}</td>
                <td className="mono muted">{l.id}</td>
                <td className="muted">{l.client}</td>
                <td className="muted">{l.site}</td>
                <td>
                  <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>{l.technologie}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{l.debit}</td>
                <td>{l.operateur}</td>
                <td className="muted">{l.activation}</td>
                <td><DotStatus color={l.statut.color} label={l.statut.label} /></td>
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
  const [page, setPage] = useStateMb(1);
  const totalPages = Math.max(1, Math.ceil(ACCESS_ORDERS.length / 15));
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par n° commande, client, site…" width={360} />
        <Select placeholder="Statut" options={["Étude","Production","Livrée","Bloquée"]} width={140} icon="circle" />
        <Select placeholder="Technologie" options={["FTTH","FTTO","SDSL","4G FWA"]} width={150} icon="zap" />
        <div className="grow" />
        <Button variant="primary" icon="plus">Nouvelle commande</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>N° commande</th>
              <th>Client</th>
              <th>Site</th>
              <th>Technologie</th>
              <th>Commandée le</th>
              <th>RDV</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_ORDERS.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "access-order", data: o })}>
                <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td className="muted">{o.site}</td>
                <td>
                  <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>{o.technologie}</span>
                </td>
                <td className="muted">{o.dateCommande}</td>
                <td>{o.rdv}</td>
                <td><DotStatus color={o.statut.color} label={o.statut.label} /></td>
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

Object.assign(window, { MobilesScreen, LinksScreen, SubscriberDrawer, OrderDrawer, AccessDrawer });
