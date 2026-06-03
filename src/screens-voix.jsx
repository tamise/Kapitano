// Screens — Voix fixe (Espaces voix, Trunk SIP, Commandes Trunk SIP, Portabilité, Numéros)

const { useState: useStateVx } = React;

const VOIX_TITLES = { espaces: "Espaces voix", trunk: "Trunk SIP", "trunk-cmd": "Commandes Trunk SIP", portabilite: "Portabilité", numeros: "Numéros clients", "numeros-rev": "Numéros revendeurs" };
const VOIX_SUBS   = { espaces: "Consultez et gérez les espaces voix.", trunk: "Consultez et gérez les abonnements Trunk SIP.", "trunk-cmd": "Suivez et gérez les commandes Trunk SIP.", portabilite: "Consultez et gérez la portabilité des numéros.", numeros: "Consultez la liste des numéros fixes du client.", "numeros-rev": "Consultez la liste des numéros fixes des revendeurs." };

function VoixScreen({ initialSub = "espaces", onOpenDetail }) {
  return (
    <>
      <PageHead icon="phone_in_talk" title={VOIX_TITLES[initialSub] || "Voix fixe"} subtitle={VOIX_SUBS[initialSub]} />
      <div className="kap-card" style={{ overflow: "hidden" }}>
        {initialSub === "espaces"     && <EspacesTab onOpenDetail={onOpenDetail} />}
        {initialSub === "trunk"       && <TrunkTab onOpenDetail={onOpenDetail} />}
        {initialSub === "trunk-cmd"   && <TrunkOrdersTab onOpenDetail={onOpenDetail} />}
        {initialSub === "portabilite" && <PortabiliteTab onOpenDetail={onOpenDetail} />}
        {initialSub === "numeros"     && <NumbersTab onOpenDetail={onOpenDetail} variant="clients" />}
        {initialSub === "numeros-rev" && <NumbersTab onOpenDetail={onOpenDetail} variant="revendeurs" />}
      </div>
    </>
  );
}

function EspacesTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par nom, client…" width={360} />
        <Select placeholder="Statut" options={["Actif","Migration"]} width={140} icon="circle" />
        <div className="grow" />
        <Button variant="primary" icon="plus">Créer un espace voix</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Nom</SortHeader></th>
              <th>Client</th>
              <th style={{ textAlign: "right" }}>Canaux</th>
              <th style={{ textAlign: "right" }}>SDA</th>
              <th>Plage</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {VOICE_SPACES.map(v => (
              <tr key={v.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "voice-space", data: v })}>
                <td className="mono">{v.id}</td>
                <td style={{ fontWeight: 600 }}>{v.nom}</td>
                <td className="muted">{v.client}</td>
                <td style={{ textAlign: "right" }}>{v.canaux}</td>
                <td style={{ textAlign: "right" }}>{v.sda}</td>
                <td className="mono muted">{v.plage}</td>
                <td><DotStatus color={v.statut.color} label={v.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </>
  );
}

function TrunkTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par client, realm…" width={360} />
        <Select placeholder="Canaux" options={["4","8","16","32"]} width={120} icon="layers" />
        <Select placeholder="Statut" options={["En service","Provisioning","Hors service"]} width={160} icon="circle" />
        <div className="grow" />
        <Button variant="primary" icon="plus">Nouveau Trunk SIP</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Client</SortHeader></th>
              <th style={{ textAlign: "right" }}>Canaux</th>
              <th>Realm SIP</th>
              <th style={{ textAlign: "right" }}>SDA</th>
              <th>Activation</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {TRUNK_SIP.map(t => (
              <tr key={t.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "trunk", data: t })}>
                <td className="mono">{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.client}</td>
                <td style={{ textAlign: "right" }}>{t.canaux}</td>
                <td className="mono muted">{t.realm}</td>
                <td style={{ textAlign: "right" }}>{t.sda}</td>
                <td className="muted">{t.activation}</td>
                <td><DotStatus color={t.statut.color} label={t.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </>
  );
}

function TrunkOrdersTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par numéro de commande…" width={360} />
        <Select placeholder="Statut" options={["Brouillon","Étude","Production","Livrée","Annulée"]} width={160} icon="circle" />
        <div className="grow" />
        <Button variant="primary" icon="plus">Nouvelle commande</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>N° commande</th>
              <th>Client</th>
              <th style={{ textAlign: "right" }}>Canaux</th>
              <th>Commandée le</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {TRUNK_ORDERS.map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "trunk-order", data: o })}>
                <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                <td>{o.client}</td>
                <td style={{ textAlign: "right" }}>{o.canaux}</td>
                <td className="muted">{o.dateCommande}</td>
                <td><DotStatus color={o.statut.color} label={o.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </>
  );
}

function PortabiliteTab({ onOpenDetail }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par numéro, RIO…" width={360} />
        <Select placeholder="Statut" options={["Portée","Date confirmée","En cours","Rejetée"]} width={170} icon="circle" />
        <Select placeholder="Opérateur source" options={["Orange","SFR","Bouygues","Free Pro","Coriolis"]} width={180} icon="antenna" />
        <div className="grow" />
        <Button variant="tertiary" icon="upload">Importer un lot</Button>
        <Button variant="primary" icon="plus">Nouvelle portabilité</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th><SortHeader active dir="asc">Numéro</SortHeader></th>
              <th>Client</th>
              <th>Opérateur source</th>
              <th>RIO</th>
              <th>Date de portage</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {PORTABILITES.map(p => (
              <tr key={p.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "portabilite", data: p })}>
                <td className="mono">{p.id}</td>
                <td className="mono" style={{ fontWeight: 600 }}>{p.numero}</td>
                <td className="muted">{p.client}</td>
                <td>{p.operateurSource}</td>
                <td className="mono">{p.rio}</td>
                <td className="muted">{p.datePortage}</td>
                <td><DotStatus color={p.statut.color} label={p.statut.label} /></td>
                <td><IconButton icon="more-vertical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableBox>
    </>
  );
}

function NumbersTab({ onOpenDetail, variant }) {
  return (
    <>
      <Toolbar>
        <Input placeholder="Recherche par numéro, client…" width={360} />
        <Select placeholder="Type" options={["SDA","Standard","Pilote","SVI"]} width={140} icon="layers" />
        <Select placeholder="Affectation" options={["Trunk SIP","Espace voix","Mobile","Libre"]} width={160} icon="link" />
        <div className="grow" />
        <Button variant="tertiary" icon="download">Exporter</Button>
        {variant === "revendeurs" && <Button variant="primary" icon="plus">Réserver une plage</Button>}
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th><SortHeader active dir="asc">Numéro</SortHeader></th>
              <th>{variant === "revendeurs" ? "Revendeur" : "Client"}</th>
              <th>Type</th>
              <th>Affectation</th>
              <th>Opérateur</th>
              <th>Statut</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {NUMBERS.map(n => (
              <tr key={n.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "number", data: n })}>
                <td className="mono" style={{ fontWeight: 600 }}>{n.numero}</td>
                <td className="muted">{variant === "revendeurs" ? REVENDEURS[NUMBERS.indexOf(n) % REVENDEURS.length].nom : n.client}</td>
                <td>{n.type}</td>
                <td>{n.affectation}</td>
                <td className="muted">{n.operateur}</td>
                <td><DotStatus color={n.statut.color} label={n.statut.label} /></td>
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

Object.assign(window, { VoixScreen, VoiceSpaceDrawer, TrunkDrawer, PortabiliteDrawer, NumberDrawer });
