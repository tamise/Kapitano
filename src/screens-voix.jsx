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
  const [sortDir, setSortDir] = useStateVx("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [page, setPage] = useStateVx(1);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<Button variant="primary" icon="plus">Créer un espace voix</Button>);
    return () => setTopbarActions(null);
  }, []);

  const espacesFieldMap = { "Date de création": "dateCreation", "ID": "id", "Revendeur": "revendeur", "Client": "client", "Nom client Enove": "nomClientEnove", "ID production": "idProduction", "État de l'espace voix": "statut.label" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() { setSortBy(null); setSortDir("asc"); setRevendeurFilter(null); }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de création")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de création");
  }

  const sorted = React.useMemo(() => {
    let data = VOICE_SPACES;
    if (revendeurFilter) data = data.filter(v => v.revendeur === revendeurFilter);
    const key = espacesFieldMap[sortBy || "Date de création"];
    if (!key) return data;
    const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
    return [...data].sort((a, b) => {
      const isDateField = ["dateCreation"].includes(key);
      let va, vb;
      if (key === "statut.label") { va = a.statut ? a.statut.label || "" : ""; vb = b.statut ? b.statut.label || "" : ""; }
      else { va = isDateField ? toSortableDate(a[key] || "") : (a[key] || ""); vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || ""); }
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, revendeurFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date de création","ID","Revendeur","Client","Nom client Enove"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par client ou id de production" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={190} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Nom client Enove")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Nom client Enove")} dir={sortDir}>Nom client Enove</SortHeader></th>
              <th onClick={() => handleColSort("ID production")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("ID production")} dir={sortDir}>ID production</SortHeader></th>
              <th onClick={() => handleColSort("État de l'espace voix")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État de l'espace voix")} dir={sortDir}>État de l'espace voix</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(v => (
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

function TrunkTab({ onOpenDetail }) {
  const [sortBy, setSortBy] = useStateVx(null);
  const [sortDir, setSortDir] = useStateVx("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [offreFilter, setOffreFilter] = useStateVx(null);
  const [etatFactuFilter, setEtatFactuFilter] = useStateVx(null);
  const [etatProdFilter, setEtatProdFilter] = useStateVx([]);
  const [page, setPage] = useStateVx(1);

  const trunkFieldMap = { "Revendeur": "revendeur", "Client": "client", "Site": "site", "Numéro de charge": "numeroDeCharge", "Offre": "offre", "Canaux": "canaux", "État prod.": "etatProd", "État facturation": "etatFactu" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() { setSortBy(null); setSortDir("asc"); setRevendeurFilter(null); setClientFilter(null); setOffreFilter(null); setEtatFactuFilter(null); setEtatProdFilter([]); }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Revendeur")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Revendeur");
  }

  const sorted = React.useMemo(() => {
    let data = TRUNK_SIP;
    if (revendeurFilter) data = data.filter(t => t.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(t => t.client === clientFilter);
    if (offreFilter) data = data.filter(t => t.offre === offreFilter);
    if (etatFactuFilter) data = data.filter(t => t.etatFactu === etatFactuFilter);
    if (etatProdFilter && etatProdFilter.length) data = data.filter(t => etatProdFilter.includes(t.etatProd));
    const key = trunkFieldMap[sortBy || "Revendeur"];
    if (!key) return data;
    if (sortBy === "Canaux") {
      return [...data].sort((a, b) => {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }
    return [...data].sort((a, b) => {
      const va = a[key] || ""; const vb = b[key] || "";
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [revendeurFilter, clientFilter, offreFilter, etatFactuFilter, etatProdFilter, sortBy, sortDir]);
  const setTopbarActions = React.useContext(TopbarActionsContext);
  React.useEffect(() => {
    setTopbarActions(<>
      <Button variant="primary" icon="plus">Créer un trunk SIP</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enove</Button>
      <Button variant="primary" icon="plus">Créer un centrex Enreach</Button>
    </>);
    return () => setTopbarActions(null);
  }, []);
  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["État facturation","Revendeur","Client","Site","Numéro de charge","Offre","Canaux","État prod."]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par numéro de charge, client ou offre" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type d'offre" options={["Trunk SIP","Centrex Enove","Centrex Enreach"]} value={offreFilter} onChange={setOffreFilter} width={160} showSearch={false} />
        <RadioDropdown placeholder="Etat factu." options={["Actif","Inactif","En cours d'activation","En cours de désactivation"]} value={etatFactuFilter} onChange={setEtatFactuFilter} width={140} showSearch={false} />
        <RadioDropdown placeholder="État prod." options={["Commandé","Création en cours","Actif","Résilié"]} value={etatProdFilter} onChange={setEtatProdFilter} width={150} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Site")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Site")} dir={sortDir}>Site</SortHeader></th>
              <th onClick={() => handleColSort("Numéro de charge")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro de charge")} dir={sortDir}>N° de charge</SortHeader></th>
              <th onClick={() => handleColSort("Offre")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Offre")} dir={sortDir}>Offre</SortHeader></th>
              <th onClick={() => handleColSort("Canaux")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Canaux")} dir={sortDir}>Canaux</SortHeader></th>
              <th onClick={() => handleColSort("État facturation")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État facturation")} dir={sortDir}>Etat factu.</SortHeader></th>
              <th onClick={() => handleColSort("État prod.")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État prod.")} dir={sortDir}>Etat prod.</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(t => (
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

const TRUNK_ETAT_CFG = {
  "En brouillon":         { icon: "edit_note",      fg: "#616161", bg: "#F5F5F5" },
  "Programmée":           { icon: "schedule",        fg: "#0277BD", bg: "#E1F5FE" },
  "Crée":                 { icon: "add_circle",      fg: "#1565C0", bg: "#E3F2FD" },
  "Annulation en cours":  { icon: "ban",             fg: "#E65100", bg: "#FFF3E0" },
  "Annulée":              { icon: "x-circle",        fg: "#C62828", bg: "#FFEBEE" },
  "En cours":             { icon: "hourglass_full",  fg: "#1565C0", bg: "#E3F2FD" },
  "En cours (erreur)":    { icon: "hourglass_empty", fg: "#E65100", bg: "#FFF3E0" },
  "Incident en cours":    { icon: "alert-triangle",  fg: "#E65100", bg: "#FFF3E0" },
  "En attente":           { icon: "pause_circle",    fg: "#0277BD", bg: "#E1F5FE" },
  "Terminée avec succès": { icon: "check-circle-2",  fg: "#2E7D32", bg: "#E8F5E9" },
  "Terminée avec erreur": { icon: "x-circle",        fg: "#C62828", bg: "#FFEBEE" },
};

function TrunkOrdersTab({ onOpenDetail }) {
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
  const [sortBy, setSortBy] = useStateVx(null);
  const [sortDir, setSortDir] = useStateVx("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [offreFilter, setOffreFilter] = useStateVx(null);
  const [typeFilter, setTypeFilter] = useStateVx([]);
  const [etatFilter, setEtatFilter] = useStateVx([]);

  const trunkOrderFieldMap = { "Date": "dateCommande", "Réf": "ref", "Revendeur": "revendeur", "Client": "client", "Type commande": "typeCommande", "Numéro de charge": "numeroDeCharge", "État commande": "etatCommande" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() { setSortBy(null); setSortDir("asc"); setRevendeurFilter(null); setClientFilter(null); setOffreFilter(null); setTypeFilter([]); setEtatFilter([]); }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sorted = React.useMemo(() => {
    let data = TRUNK_ORDERS;
    if (revendeurFilter) data = data.filter(o => o.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(o => o.client === clientFilter);
    if (offreFilter) data = data.filter(o => o.typeOffre === offreFilter);
    if (typeFilter && typeFilter.length) data = data.filter(o => typeFilter.includes(o.typeCommande));
    if (etatFilter && etatFilter.length) data = data.filter(o => etatFilter.includes(o.etatCommande));
    const key = trunkOrderFieldMap[sortBy || "Date"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["dateCommande"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, revendeurFilter, clientFilter, offreFilter, typeFilter, etatFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Date","Réf","Revendeur","Client","Type commande","Numéro de charge","État commande"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par Réf, client, N° de charge" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />
        <RadioDropdown placeholder="Type d'offre" options={["Trunk SIP","Centrex Enove","Centrex Enreach"]} value={offreFilter} onChange={setOffreFilter} width={160} showSearch={false} />
        <RadioDropdown placeholder="Type commande" options={["Création","Modification","Résiliation"]} value={typeFilter} onChange={setTypeFilter} width={170} showSearch={false} multiSelect={true} />
        <RadioDropdown placeholder="État commande" options={["En brouillon","Programmée","Crée","Annulation en cours","Annulée","En cours","En cours (erreur)","Incident en cours","En attente","Terminée avec succès","Terminée avec erreur"]} value={etatFilter} onChange={setEtatFilter} width={170} showSearch={false} multiSelect={true} />
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th onClick={() => handleColSort("Réf")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Réf")} dir={sortDir}>Réf</SortHeader></th>
              <th onClick={() => handleColSort("Date")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date")} dir={sortDir}>Date</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th>Type d'offre</th>
              <th onClick={() => handleColSort("Type commande")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type commande")} dir={sortDir}>Type commande</SortHeader></th>
              <th onClick={() => handleColSort("Numéro de charge")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro de charge")} dir={sortDir}>N° de charge</SortHeader></th>
              <th onClick={() => handleColSort("État commande")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État commande")} dir={sortDir}>État commande</SortHeader></th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(o => (
              <tr key={o.id} className="is-clickable" onClick={() => onOpenDetail({ kind: "trunk-order", data: o })}>
                <td className="mono muted">{o.ref}</td>
                <td className="muted">{o.dateCommande}</td>
                <td className="muted">{o.revendeur}</td>
                <td style={{ fontWeight: 600 }}>{o.client}</td>
                <td className="muted">{o.typeOffre}</td>
                <td className="muted">{o.typeCommande}</td>
                <td className="mono muted">{o.numeroDeCharge}</td>
                <td>{(() => { const cfg = TRUNK_ETAT_CFG[o.etatCommande]; return cfg ? <span className="kap-pill kap-pill--soft" style={{ "--bg": cfg.bg, "--fg": cfg.fg, display:"inline-flex", alignItems:"center", gap:4 }}><Icon name={cfg.icon} size={13} style={{ color: cfg.fg }} />{o.etatCommande}</span> : o.etatCommande; })()}</td>
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
  const [sortDir, setSortDir] = useStateVx("asc");
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

  const portFieldMap = { "Créée le": "dateCreation", "Réf": "ref", "Revendeur": "revendeur", "Client": "client", "Type commande": "typeCommande", "Numéro": "numero", "Date de portabilité": "datePortabilite", "État commande": "etatCommande", "Pilotée": "hasPortType", "Statut de la portabilité": "statutPortabilite", "Note": "note" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() { setSortBy(null); setSortDir("asc"); setDateFilter(null); setRevendeurFilter(null); setClientFilter(null); setFiabilisationOn(false); setUtilisateurFilter(null); }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Créée le")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Créée le");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const parseDateNum = (s) => {
    const parts = String(s).split("/");
    if (parts.length < 3) return NaN;
    const d = parseInt(parts[0], 10), m = parseInt(parts[1], 10), y = parseInt(parts[2].split(" ")[0], 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return NaN;
    return y * 10000 + m * 100 + d;
  };

  const filteredAll = React.useMemo(() => {
    let data = PORTABILITES;
    if (revendeurFilter) data = data.filter(p => p.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(p => p.client === clientFilter);
    if (utilisateurFilter) data = data.filter(p => p.initiales === utilisateurFilter);
    if (dateFilter && (dateFilter.debut || dateFilter.fin)) {
      const debNum = dateFilter.debut ? parseDateNum(dateFilter.debut) : NaN;
      const finNum = dateFilter.fin ? parseDateNum(dateFilter.fin) : NaN;
      data = data.filter(p => {
        const d = parseDateNum(p.datePortabilite || "");
        if (isNaN(d)) return true;
        if (!isNaN(debNum) && d < debNum) return false;
        if (!isNaN(finNum) && d > finNum) return false;
        return true;
      });
    }
    return data;
  }, [revendeurFilter, clientFilter, utilisateurFilter, dateFilter]);

  const sorted = React.useMemo(() => {
    let data = filteredAll.filter(p => p.etatCommande === activeTab);
    const key = portFieldMap[sortBy || "Créée le"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      if (key === "hasPortType") {
        const va = a.hasPortType ? 1 : 0; const vb = b.hasPortType ? 1 : 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      if (key === "note") {
        const va = (a.note && a.note !== "—") ? 1 : 0; const vb = (b.note && b.note !== "—") ? 1 : 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const isDateField = ["dateCreation","datePortabilite"].includes(key);
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [filteredAll, activeTab, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
  const view = sorted.slice((page - 1) * 15, page * 15);

  return (
    <>
      <Toolbar>
        <RadioDropdown placeholder="Trier" options={["Créée le","Réf","Revendeur","Client","Type commande","Date de portabilité","État commande"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
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
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
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
              {filteredAll.filter(p => p.etatCommande === t.label).length}
            </span>
          </div>
        ))}
      </div>

      <TableBox>
        <table className="kap-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th onClick={() => handleColSort("Réf")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Réf")} dir={sortDir}>Réf</SortHeader></th>
              <th onClick={() => handleColSort("Créée le")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Créée le")} dir={sortDir}>Créée le</SortHeader></th>
              <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
              <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
              <th onClick={() => handleColSort("Type commande")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Type commande")} dir={sortDir}>Type commande</SortHeader></th>
              <th onClick={() => handleColSort("Numéro")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Numéro")} dir={sortDir}>Numéro</SortHeader></th>
              <th onClick={() => handleColSort("Date de portabilité")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de portabilité")} dir={sortDir}>Date de portabilité</SortHeader></th>
              <th onClick={() => handleColSort("État commande")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("État commande")} dir={sortDir}>État commande</SortHeader></th>
              <th onClick={() => handleColSort("Pilotée")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Pilotée")} dir={sortDir}>Pilotée</SortHeader></th>
              <th onClick={() => handleColSort("Statut de la portabilité")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Statut de la portabilité")} dir={sortDir}>Statut de la portabilité</SortHeader></th>
              <th onClick={() => handleColSort("Note")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Note")} dir={sortDir}>Note</SortHeader></th>
              <th style={{ width: 60 }}></th>
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
    </>
  );
}

function NumbersTab({ onOpenDetail, variant }) {
  const [sortBy, setSortBy] = useStateVx(null);
  const [sortDir, setSortDir] = useStateVx("asc");
  const [revendeurFilter, setRevendeurFilter] = useStateVx(null);
  const [clientFilter, setClientFilter] = useStateVx(null);
  const [page, setPage] = useStateVx(1);

  const numbersFieldMap = { "Date de création": "dateCreation", "Revendeur": "revendeur", "Client": "client", "Début de plage": "debutPlage", "Fin de plage": "finPlage", "Taille de la plage": "taillePlage", "Taux d'occupation": "tauxOccupation" };
  function handleSortChange(field, dir) { setSortBy(field); setSortDir(dir); }
  function handleReset() { setSortBy(null); setSortDir("asc"); setRevendeurFilter(null); setClientFilter(null); }

  function handleColSort(label) {
    if (sortBy === label || (sortBy === null && label === "Date de création")) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(label);
      setSortDir("asc");
    }
  }

  function colActive(label) {
    return sortBy === label || (sortBy === null && label === "Date de création");
  }
  const toSortableDate = (s) => { const p = String(s).split("/"); if (p.length < 3) return String(s); const y = p[2].split(" ")[0]; return `${y}/${p[1]}/${p[0]}`; };
  const sorted = React.useMemo(() => {
    let data = NUMBERS;
    if (revendeurFilter) data = data.filter(n => n.revendeur === revendeurFilter);
    if (clientFilter) data = data.filter(n => n.client === clientFilter);
    const key = numbersFieldMap[sortBy || "Date de création"];
    if (!key) return data;
    return [...data].sort((a, b) => {
      const isDateField = ["dateCreation"].includes(key);
      if (key === "taillePlage") {
        const va = Number(a[key]) || 0; const vb = Number(b[key]) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      if (key === "tauxOccupation") {
        const va = parseFloat(String(a[key] || "0").replace(/\s*%/, "")) || 0;
        const vb = parseFloat(String(b[key] || "0").replace(/\s*%/, "")) || 0;
        return sortDir === "asc" ? va - vb : vb - va;
      }
      const va = isDateField ? toSortableDate(a[key] || "") : (a[key] || "");
      const vb = isDateField ? toSortableDate(b[key] || "") : (b[key] || "");
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [sortBy, sortDir, revendeurFilter, clientFilter]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / 15));
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
        <RadioDropdown placeholder="Trier" options={["Date de création","Taille de la plage"]} value={sortBy} onChange={setSortBy} onSortChange={handleSortChange} width={100} showSearch={false} showRadio={false} sortMode={true} />
        <Input placeholder="Rechercher par début de plage" width={360} />
        <RadioDropdown placeholder="Revendeur" options={["2IT SOLUTIONS","ABC TELECOMS","ADV","AXIUM SOLUTIONS","CIS VALLEY","GROUPE TELECOMS DE L'OUEST GTO","IPNEOS","KOESIO AQUITAINE","KOESIO AURA INFO (VD)","KOESIO AURA INFO (VDI)","KOESIO AURA TELECOM","KOESIO AUSTRALIA","KOESIO CENTRE EST","KOESIO CORPORATE IT","KOESIO EST","KOESIO GRAND EST","KOESIO IDF","KOESIO MANAGED SERVICES","KOESIO MEDITERRANNEE","KOESIO NETWORKS","KOESIO NORD OUEST","KOESIO OCCITANIE","KOESIO OCCITANIE BPA","KOESIO OUEST","KOESIO PACA","KOESIO PACA TELECOMS","KOESIO SUD ALLIANCE","KOESIO SUISSE","ONE OPERATEUR","Production","S-WAN IP"]} value={revendeurFilter} onChange={setRevendeurFilter} width={180} />
        {variant === "clients" && <RadioDropdown placeholder="Client" options={CLIENT_NAMES} value={clientFilter} onChange={setClientFilter} width={160} />}
        <div className="grow" />
        <Button variant="tertiary" icon="refresh-cw" onClick={handleReset}>Réinitialiser</Button>
      </Toolbar>
      <TableBox>
        <table className="kap-table">
          <thead>
            {variant === "revendeurs" ? (
              <tr>
                <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
                <th onClick={() => handleColSort("Début de plage")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Début de plage")} dir={sortDir}>Début de plage</SortHeader></th>
                <th onClick={() => handleColSort("Fin de plage")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Fin de plage")} dir={sortDir}>Fin de plage</SortHeader></th>
                <th onClick={() => handleColSort("Taille de la plage")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Taille de la plage")} dir={sortDir}>Taille de la plage</SortHeader></th>
                <th onClick={() => handleColSort("Taux d'occupation")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Taux d'occupation")} dir={sortDir}>Taux d'occupation</SortHeader></th>
                <th onClick={() => handleColSort("Date de création")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Date de création")} dir={sortDir}>Date de création</SortHeader></th>
                <th style={{ width: 60 }}></th>
              </tr>
            ) : (
              <tr>
                <th onClick={() => handleColSort("Revendeur")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Revendeur")} dir={sortDir}>Revendeur</SortHeader></th>
                <th onClick={() => handleColSort("Client")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Client")} dir={sortDir}>Client</SortHeader></th>
                <th onClick={() => handleColSort("Début de plage")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Début de plage")} dir={sortDir}>Début de plage</SortHeader></th>
                <th onClick={() => handleColSort("Fin de plage")} style={{ cursor: "pointer", userSelect: "none" }}><SortHeader active={colActive("Fin de plage")} dir={sortDir}>Fin de plage</SortHeader></th>
                <th onClick={() => handleColSort("Taille de la plage")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Taille de la plage")} dir={sortDir}>Taille de la plage</SortHeader></th>
                <th onClick={() => handleColSort("Taux d'occupation")} style={{ cursor: "pointer", userSelect: "none", textAlign: "right" }}><SortHeader active={colActive("Taux d'occupation")} dir={sortDir}>Taux d'occupation</SortHeader></th>
                <th style={{ width: 60 }}></th>
              </tr>
            )}
          </thead>
          <tbody>
            {sorted.slice((page - 1) * 15, page * 15).map(n => (
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
      <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={15} />
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
