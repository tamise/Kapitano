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
  const [page, setPage] = useStateCt(1);
  const totalPages = Math.max(1, Math.ceil(ORDERS.length / 15));
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par numéro de commande, client…" width={360} />
        <Select placeholder="Type" options={["Mobile Data","Trunk SIP","Lien d'accès","Voix fixe","Numéro SDA"]} width={170} icon="layers" />
        <Select placeholder="Statut" options={["Brouillon","En attente","En cours","Livrée","Annulée"]} width={150} icon="circle" />
        <Select placeholder="Revendeur" options={REVENDEURS.map(r => r.nom)} width={200} icon="briefcase" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        <Button variant="primary" icon="plus">Nouvelle commande</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th>N° commande</th>
              <th>Client</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Qté</th>
              <th>Revendeur</th>
              <th><SortHeader active>Date</SortHeader></th>
              <th style={{ textAlign: "right" }}>Montant</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "order", data: o })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td>
                  <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F0E6F9", "--fg": "var(--kap-primary)" }}>{o.type}</span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{o.quantite}</td>
                <td className="muted">{o.revendeur}</td>
                <td className="muted">{o.dateCreation}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{o.montant}</td>
                <td><DotStatus color={o.statut.color} label={o.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={ORDERS.length} perPage={15} />
    </>
  );
}

function ReportingTab() {
  const VOLUME_DATA = [
    { mois: "Jun", val: 248 }, { mois: "Juil", val: 281 }, { mois: "Août", val: 199 },
    { mois: "Sept", val: 312 }, { mois: "Oct", val: 305 }, { mois: "Nov", val: 342 },
  ];
  const REPARTITION = [
    { type: "Mobile Data",   pct: 38, color: "#7E41A3" },
    { type: "Trunk SIP",     pct: 24, color: "#9C5BC8" },
    { type: "Lien d'accès",  pct: 22, color: "#0288D1" },
    { type: "Voix fixe",     pct: 11, color: "#2E7D32" },
    { type: "Numéro SDA",    pct: 5,  color: "#ED6C02" },
  ];
  const maxVal = Math.max(...VOLUME_DATA.map(d => d.val));
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18, background: "#FAFBFD" }}>
      <div className="kap-kpi-grid">
        {REPORTING_KPIS.map(k => <Kpi key={k.label} {...k} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <div className="kap-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, flex: 1 }}>Volume mensuel de commandes</div>
            <Select width={140} value="6mois" onChange={() => {}} options={[{ value: "6mois", label: "6 derniers mois" }, { value: "12mois", label: "12 mois" }]} icon="calendar" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 220, paddingTop: 16 }}>
            {VOLUME_DATA.map(d => (
              <div key={d.mois} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{
                    height: `${(d.val / maxVal) * 100}%`,
                    background: "linear-gradient(180deg, var(--kap-primary) 0%, #9C5BC8 100%)",
                    borderRadius: "4px 4px 0 0",
                    position: "relative",
                  }}>
                    <span style={{ position: "absolute", top: -22, left: 0, right: 0, textAlign: "center", fontFamily: "var(--kap-font-display)", fontSize: 12, fontWeight: 700, color: "var(--kap-fg-1)" }}>{d.val}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--kap-font-ui)", fontSize: 12, color: "var(--kap-fg-3)" }}>{d.mois}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="kap-card" style={{ padding: 20 }}>
          <div style={{ fontFamily: "var(--kap-font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Répartition par type</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {REPARTITION.map(r => (
              <div key={r.type}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--kap-font-ui)", fontSize: 13, marginBottom: 4 }}>
                  <span>{r.type}</span>
                  <strong>{r.pct} %</strong>
                </div>
                <div style={{ height: 6, background: "#EEF0F7", borderRadius: 999 }}>
                  <div style={{ width: r.pct + "%", height: "100%", background: r.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
        {initialSub === "tickets"        && <TicketsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "configurations" && <ConfigurationsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "supervision"    && <SupervisionTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

function TicketsTab({ onOpenDetail }) {
  const [page, setPage] = useStateCt(1);
  const totalPages = Math.max(1, Math.ceil(TICKETS.length / 15));
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par sujet, client, ID…" width={360} />
        <Select placeholder="Sévérité" options={["Critique","Majeure","Mineure","Information"]} width={140} icon="alert-triangle" />
        <Select placeholder="Statut" options={["Ouvert","En cours","En attente","Résolu","Fermé"]} width={150} icon="circle" />
        <Select placeholder="Affecté à" options={["Non affecté","M. Lambert","Mme Caron","M. Renaud"]} width={170} icon="user" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        <Button variant="primary" icon="plus">Nouveau ticket</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th>ID</th>
              <th><SortHeader active>Sujet</SortHeader></th>
              <th>Client</th>
              <th>Sévérité</th>
              <th>Affecté à</th>
              <th>SLA</th>
              <th>Créé le</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.slice((page - 1) * 15, page * 15).map(t => (
              <tr key={t.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "ticket", data: t })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono" style={{ fontWeight: 600 }}>{t.id}</td>
                <td>{t.sujet}</td>
                <td className="muted">{t.client}</td>
                <td><DotStatus color={t.severiteColor} label={t.severite} /></td>
                <td className="muted">{t.affecte}</td>
                <td className="mono">{t.sla}</td>
                <td className="muted">{t.dateCreation}</td>
                <td><DotStatus color={t.statut.color} label={t.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={TICKETS.length} perPage={15} />
    </>
  );
}

function ConfigurationsTab({ onOpenDetail }) {
  const [page, setPage] = useStateCt(1);
  const totalPages = Math.max(1, Math.ceil(EQUIPMENTS.length / 15));
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par équipement, IP, firmware…" width={360} />
        <Select placeholder="Type d'équipement" options={["Routeur","Switch","Borne wifi","Firewall","ONT","IPBX"]} width={180} icon="hard-drive" />
        <div className="grow" />
        <Button variant="tertiary" icon="git-commit">Historique</Button>
        <Button variant="primary" icon="plus">Nouvelle configuration</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Équipement</SortHeader></th>
              <th>Client</th>
              <th>Site</th>
              <th>IP</th>
              <th>Firmware</th>
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
                <td className="mono muted">{e.firmware}</td>
                <td><DotStatus color={e.etat.color} label={e.etat.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={EQUIPMENTS.length} perPage={15} />
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
function EligibiliteScreen() {
  const [country, setCountry] = useStateCt("fr");
  const [searched, setSearched] = useStateCt(true);
  return (
    <>
      <PageHead
        icon="map-pin"
        title="Eligibilité"
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

Object.assign(window, { CommandesScreen, TechniqueScreen, TicketDrawer, EquipmentDrawer, EligibiliteScreen, ProfilScreen });
