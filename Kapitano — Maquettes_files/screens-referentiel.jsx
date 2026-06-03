// Screens — Référentiel (revendeurs, clients, sites, services, catalogues)

const { useMemo: useMemoRf } = React;

function ReferentielScreen({ initialSub = "revendeurs", onOpenDetail }) {
  return (
    <>
      <PageHead
        icon="menu_book"
        title={refTitle(initialSub)}
        subtitle={refSubtitle(initialSub)}
      />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "revendeurs" && <RevendeursTab onOpenDetail={onOpenDetail} />}
        {initialSub === "clients" && <ClientsTab onOpenDetail={onOpenDetail} />}
        {initialSub === "sites" && <SitesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "services" && <ServicesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "catalogues" && <CataloguesTab onOpenDetail={onOpenDetail} />}
      </div>
    </>
  );
}

function refTitle(sub) {
  const map = {
    revendeurs: "Revendeurs",
    clients:    "Clients",
    sites:      "Sites",
    services:   "Services",
    catalogues: "Catalogues",
  };
  return map[sub] || "Référentiel";
}

function refSubtitle(sub) {
  const map = {
    revendeurs: "Consultez la liste des revendeurs et leur activité.",
    clients:    "Consultez et gérez vos clients.",
    sites:      "Consultez toutes les informations liées aux sites clients.",
    services:   "Consultez la liste des services actifs.",
    catalogues: "Consultez et gérez les articles du catalogue.",
  };
  return map[sub] || "";
}

// ────────────────────────────────────────────────────────────────
function RevendeursTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par nom, SIREN, ville…" width={360} />
        <Select placeholder="Filiale" options={FILIALES_OPTS()} width={200} icon="building-2" />
        <Select placeholder="Région" options={["Aquitaine","Île-de-France","Rhône-Alpes","Méditerranée","Bretagne","Grand Est"]} width={180} icon="map-pin" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        <Button variant="primary" icon="plus">Créer un revendeur</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th>Code</th>
              <th><SortHeader active dir="asc">Raison sociale</SortHeader></th>
              <th>SIREN</th>
              <th>Filiale</th>
              <th>Ville</th>
              <th>Commercial</th>
              <th style={{ textAlign: "right" }}>Contrats</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {REVENDEURS.map(r => (
              <tr key={r.code} className="is-clickable" onClick={() => onOpenDetail({ kind: "revendeur", data: r })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono">{r.code}</td>
                <td style={{ fontWeight: 600 }}>{r.nom}</td>
                <td className="muted mono">{r.siren}</td>
                <td className="muted">{r.filiale}</td>
                <td>{r.ville}</td>
                <td>{r.commercial}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{r.contrats}</td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={1} totalPages={1} onChange={() => {}} totalItems={REVENDEURS.length} perPage={REVENDEURS.length} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function ClientsTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par raison sociale, SIRET…" width={360} />
        <Select placeholder="Revendeur" options={REVENDEURS.map(r => r.nom)} width={220} icon="briefcase" />
        <Select placeholder="Statut" options={["Actif","Suspendu"]} width={140} icon="circle" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        <Button variant="primary" icon="plus">Créer un client</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th>ID</th>
              <th><SortHeader active dir="asc">Raison sociale</SortHeader></th>
              <th>SIRET</th>
              <th>Revendeur</th>
              <th>Ville</th>
              <th style={{ textAlign: "right" }}>Sites</th>
              <th style={{ textAlign: "right" }}>Services</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.slice(0, 14).map(c => (
              <tr key={c.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "client", data: c })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono">{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.nom}</td>
                <td className="muted mono">{c.siret}</td>
                <td className="muted">{c.revendeur}</td>
                <td>{c.ville}</td>
                <td style={{ textAlign: "right" }}>{c.sites}</td>
                <td style={{ textAlign: "right" }}>{c.services}</td>
                <td><DotStatus color={c.statut.color} label={c.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={1} totalPages={2} onChange={() => {}} totalItems={CLIENTS.length} perPage={14} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function SitesTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par libellé, adresse, ville…" width={360} />
        <Select placeholder="Client" options={CLIENTS.slice(0, 10).map(c => c.nom)} width={220} icon="briefcase" />
        <Select placeholder="Statut" options={["Actif","Inactif"]} width={140} icon="circle" />
        <div className="grow" />
        <Button variant="tertiary" icon="map">Voir sur la carte</Button>
        <Button variant="primary" icon="plus">Créer un site</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><Checkbox /></th>
              <th>ID</th>
              <th><SortHeader active dir="asc">Libellé</SortHeader></th>
              <th>Client</th>
              <th>Adresse</th>
              <th>CP</th>
              <th>Ville</th>
              <th style={{ textAlign: "right" }}>Services</th>
              <th>Technicien</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {SITES.slice(0, 12).map(s => (
              <tr key={s.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "site", data: s })}>
                <td onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                <td className="mono">{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.label}</td>
                <td className="muted">{s.client}</td>
                <td>{s.adresse}</td>
                <td className="mono">{s.cp}</td>
                <td>{s.ville}</td>
                <td style={{ textAlign: "right" }}>{s.services}</td>
                <td className="muted">{s.technicien}</td>
                <td><DotStatus color={s.statut.color} label={s.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={1} totalPages={2} onChange={() => {}} totalItems={SITES.length} perPage={12} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function ServicesTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par référence, client, type…" width={360} />
        <Select placeholder="Type" options={["Mobile Data","Trunk SIP","Lien d'accès FTTH","Voix fixe","Numéro SDA","Wifi managé"]} width={180} icon="layers" />
        <Select placeholder="Statut" options={["Actif","En cours","Résilié"]} width={140} icon="circle" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Type</SortHeader></th>
              <th>Référence</th>
              <th>Client</th>
              <th>Site</th>
              <th>Débit</th>
              <th>Activation</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map(s => (
              <tr key={s.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "service", data: s })}>
                <td className="mono">{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.type}</td>
                <td className="mono">{s.reference}</td>
                <td className="muted">{s.client}</td>
                <td>{s.site}</td>
                <td>{s.debit}</td>
                <td className="muted">{s.dateActivation}</td>
                <td><DotStatus color={s.statut.color} label={s.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
      <Pagination page={1} totalPages={2} onChange={() => {}} totalItems={SERVICES.length} perPage={SERVICES.length} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function CataloguesTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par référence, désignation…" width={360} />
        <Select placeholder="Famille" options={["Mobile","Voix fixe","Lien d'accès","Services"]} width={160} icon="package" />
        <Select placeholder="Sous-famille" options={["Forfaits data","Trunk SIP","FTTH","Cloud","Numéros"]} width={180} icon="layers" />
        <Select placeholder="Statut" options={["Actif","Inactif"]} width={140} icon="circle" />
        <div className="grow" />
        <Button variant="primary" icon="plus">Ajouter un article</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Famille</th>
              <th>Sous-famille</th>
              <th><SortHeader active dir="asc">Désignation</SortHeader></th>
              <th style={{ textAlign: "right" }}>Prix HT</th>
              <th>Engagement</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {CATALOGUE.map(c => (
              <tr key={c.ref} className="is-clickable" onClick={() => onOpenDetail({ kind: "catalogue", data: c })}>
                <td className="mono" style={{ fontWeight: 600 }}>{c.ref}</td>
                <td>{c.famille}</td>
                <td className="muted">{c.sousFamille}</td>
                <td>{c.designation}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>{c.prix}</td>
                <td className="muted">{c.duree}</td>
                <td>{c.actif
                  ? <span className="kap-pill kap-pill--soft" style={{ "--bg": "#E6F2E7", "--fg": "var(--kap-success)" }}>Actif</span>
                  : <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F2F2F2", "--fg": "var(--kap-fg-3)" }}>Inactif</span>}
                </td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
function FILIALES_OPTS() {
  return ["Koesio Aquitaine","Koesio Île-de-France","Koesio Bretagne","Koesio Rhône-Alpes","Koesio Méditerranée","Koesio Grand Est","Koesio Pays de la Loire","Koesio Hauts-de-France"];
}

// ════════════════════════════════════════════════════════════════
// GENERIC DETAIL DRAWER (used across all tables that don't have a custom one)
// ════════════════════════════════════════════════════════════════
function GenericDetailDrawer({ payload, onClose }) {
  const { kind, data } = payload;

  if (kind === "revendeur") return <RevendeurDrawer r={data} onClose={onClose} />;
  if (kind === "client")    return <ClientDrawer c={data} onClose={onClose} />;
  if (kind === "site")      return <SiteDrawer s={data} onClose={onClose} />;
  if (kind === "service")   return <ServiceDrawer s={data} onClose={onClose} />;
  if (kind === "catalogue") return <CatalogueDrawer c={data} onClose={onClose} />;
  if (kind === "subscriber")return <SubscriberDrawer s={data} onClose={onClose} />;
  if (kind === "mob-order") return <OrderDrawer o={data} title="Commande mobile data" onClose={onClose} />;
  if (kind === "access")    return <AccessDrawer l={data} onClose={onClose} />;
  if (kind === "access-order")return <OrderDrawer o={data} title="Commande lien d'accès" onClose={onClose} />;
  if (kind === "voice-space")return <VoiceSpaceDrawer v={data} onClose={onClose} />;
  if (kind === "trunk")     return <TrunkDrawer t={data} onClose={onClose} />;
  if (kind === "trunk-order")return <OrderDrawer o={data} title="Commande Trunk SIP" onClose={onClose} />;
  if (kind === "portabilite")return <PortabiliteDrawer p={data} onClose={onClose} />;
  if (kind === "number")    return <NumberDrawer n={data} onClose={onClose} />;
  if (kind === "order")     return <OrderDrawer o={data} title="Commande" onClose={onClose} />;
  if (kind === "ticket")    return <TicketDrawer t={data} onClose={onClose} />;
  if (kind === "equipment") return <EquipmentDrawer e={data} onClose={onClose} />;
  return null;
}

function RevendeurDrawer({ r, onClose }) {
  return (
    <Drawer title={r.nom} subtitle={r.code + " · " + r.filiale} onClose={onClose}
      footer={<>
        <Button variant="tertiary" onClick={onClose}>Fermer</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Informations">
        <DetailRow label="Code"><span className="kap-mono">{r.code}</span></DetailRow>
        <DetailRow label="Raison sociale">{r.nom}</DetailRow>
        <DetailRow label="SIREN"><span className="kap-mono">{r.siren}</span></DetailRow>
        <DetailRow label="Filiale">{r.filiale}</DetailRow>
        <DetailRow label="Ville">{r.ville}</DetailRow>
        <DetailRow label="Commercial">{r.commercial}</DetailRow>
      </DetailSection>
      <DetailSection title="Activité">
        <DetailRow label="Contrats actifs"><strong>{r.contrats}</strong></DetailRow>
        <DetailRow label="CA annualisé"><strong>{Math.round(r.contrats * 1800).toLocaleString("fr-FR")} € HT</strong></DetailRow>
        <DetailRow label="Renouvellement">12 mois</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function ClientDrawer({ c, onClose }) {
  return (
    <Drawer title={c.nom} subtitle={c.id + " · " + c.ville} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="external-link">Ouvrir la fiche</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Informations">
        <DetailRow label="ID Kapitano"><span className="kap-mono">{c.id}</span></DetailRow>
        <DetailRow label="Raison sociale">{c.nom}</DetailRow>
        <DetailRow label="SIRET"><span className="kap-mono">{c.siret}</span></DetailRow>
        <DetailRow label="Revendeur">{c.revendeur}</DetailRow>
        <DetailRow label="Ville">{c.ville}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={c.statut.color} label={c.statut.label} /></DetailRow>
        <DetailRow label="Créé le">{c.dateCreation}</DetailRow>
      </DetailSection>
      <DetailSection title="Périmètre">
        <DetailRow label="Sites"><strong>{c.sites}</strong></DetailRow>
        <DetailRow label="Services actifs"><strong>{c.services}</strong></DetailRow>
        <DetailRow label="Tickets ouverts">2</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function SiteDrawer({ s, onClose }) {
  return (
    <Drawer title={s.label} subtitle={s.client} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="ticket">Créer un ticket</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Localisation">
        <DetailRow label="ID"><span className="kap-mono">{s.id}</span></DetailRow>
        <DetailRow label="Libellé">{s.label}</DetailRow>
        <DetailRow label="Adresse">{s.adresse}</DetailRow>
        <DetailRow label="Code postal"><span className="kap-mono">{s.cp}</span></DetailRow>
        <DetailRow label="Ville">{s.ville}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={s.statut.color} label={s.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Exploitation">
        <DetailRow label="Services">{s.services}</DetailRow>
        <DetailRow label="Technicien référent">{s.technicien}</DetailRow>
        <DetailRow label="Client">{s.client}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function ServiceDrawer({ s, onClose }) {
  return (
    <Drawer title={s.type} subtitle={s.reference} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="ticket">Créer un ticket</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Service">
        <DetailRow label="ID"><span className="kap-mono">{s.id}</span></DetailRow>
        <DetailRow label="Type">{s.type}</DetailRow>
        <DetailRow label="Référence"><span className="kap-mono">{s.reference}</span></DetailRow>
        <DetailRow label="Débit"><strong>{s.debit}</strong></DetailRow>
        <DetailRow label="Activation">{s.dateActivation}</DetailRow>
        <DetailRow label="Statut"><DotStatus color={s.statut.color} label={s.statut.label} /></DetailRow>
      </DetailSection>
      <DetailSection title="Affectation">
        <DetailRow label="Client">{s.client}</DetailRow>
        <DetailRow label="Site">{s.site}</DetailRow>
      </DetailSection>
    </Drawer>
  );
}

function CatalogueDrawer({ c, onClose }) {
  return (
    <Drawer title={c.designation} subtitle={c.ref} onClose={onClose}
      footer={<>
        <Button variant="tertiary" icon="copy">Dupliquer</Button>
        <Button variant="primary" icon="pencil">Modifier</Button>
      </>}>
      <DetailSection title="Article">
        <DetailRow label="Référence"><span className="kap-mono">{c.ref}</span></DetailRow>
        <DetailRow label="Désignation">{c.designation}</DetailRow>
        <DetailRow label="Famille">{c.famille}</DetailRow>
        <DetailRow label="Sous-famille">{c.sousFamille}</DetailRow>
        <DetailRow label="Prix HT"><strong>{c.prix}</strong></DetailRow>
        <DetailRow label="Engagement">{c.duree}</DetailRow>
        <DetailRow label="Disponibilité">{c.actif
          ? <span className="kap-pill kap-pill--soft" style={{ "--bg": "#E6F2E7", "--fg": "var(--kap-success)" }}>Actif</span>
          : <span className="kap-pill kap-pill--soft" style={{ "--bg": "#F2F2F2", "--fg": "var(--kap-fg-3)" }}>Inactif</span>}
        </DetailRow>
      </DetailSection>
    </Drawer>
  );
}

Object.assign(window, { ReferentielScreen, GenericDetailDrawer });
