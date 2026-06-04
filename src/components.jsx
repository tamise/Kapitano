// Components — Icon, Button, Input, Select, StatusPill, Pill, HTTP/Method tags,
// IconTile, SectionCard, Pagination, Tabs, Drawer, Modal, DetailRow, CodeBlock, KPI, Checkbox

const { useState: useStateC, useMemo: useMemoC, useEffect: useEffectC } = React;

// Material Symbols Outlined — loaded from Google Fonts (link in index.html).
// We map our Lucide-style icon names to Material Symbols names for a Material-coherent look.
const ICON_MAP = {
  "home": "home",
  "users": "group",
  "user": "person",
  "user-plus": "person_add",
  "book-open": "menu_book",
  "smartphone": "smartphone",
  "wifi": "wifi",
  "phone-call": "phone_in_talk",
  "phone": "phone",
  "receipt": "receipt_long",
  "wrench": "build",
  "map-pin": "place",
  "map": "map",
  "chevron-left": "chevron_left",
  "chevron-right": "chevron_right",
  "chevron-down": "expand_more",
  "chevron-up": "expand_less",
  "arrow-right": "arrow_forward",
  "arrow-left": "arrow_back",
  "search": "search",
  "bell": "notifications",
  "help-circle": "help",
  "plus": "add",
  "x": "close",
  "x-circle": "cancel",
  "check": "check",
  "check-circle-2": "check_circle",
  "alert-triangle": "warning",
  "info": "info",
  "minus": "remove",
  "copy": "content_copy",
  "more-vertical": "more_vert",
  "download": "download",
  "upload": "upload",
  "filter": "filter_list",
  "mail": "mail",
  "lock": "lock",
  "sparkles": "auto_awesome",
  "package": "inventory_2",
  "building-2": "apartment",
  "briefcase": "work",
  "layers": "layers",
  "antenna": "cell_tower",
  "hard-drive": "dns",
  "terminal": "terminal",
  "refresh-cw": "refresh",
  "calendar": "calendar_today",
  "code": "code",
  "activity": "monitor_heart",
  "settings": "settings",
  "link": "link",
  "shield": "shield",
  "log-out": "logout",
  "hash": "tag",
  "zap": "bolt",
  "ban": "block",
  "pencil": "edit",
  "external-link": "open_in_new",
  "ticket": "confirmation_number",
  "printer": "print",
  "git-commit": "history",
  "circle": "circle",
  "eye": "visibility",
  "eye-off": "visibility_off",
};

function Icon({ name, size = 24, style, ...rest }) {
  const symbol = ICON_MAP[name] || name.replace(/-/g, "_");
  const s = {
    fontSize: size + "px",
    width: size,
    height: size,
    lineHeight: 1,
    ...(style || {}),
  };
  return <span className="kap-icon material-symbols-outlined" style={s} aria-hidden="true" {...rest}>{symbol}</span>;
}

// ──────────────────────────────────────────────────────────────────
function Button({ variant = "primary", size, icon, iconRight, children, onClick, disabled, type = "button" }) {
  const cls = ["kap-btn", "kap-btn--" + variant, size && "kap-btn--" + size].filter(Boolean).join(" ");
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
}

function IconButton({ icon, onClick, ariaLabel, size = 18 }) {
  return (
    <button type="button" className="kap-icon-btn-square" onClick={onClick} aria-label={ariaLabel}>
      <Icon name={icon} size={size} />
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
function Input({ icon = "search", placeholder, value, onChange, style, width = 360, type = "text" }) {
  return (
    <span className="kap-input-wrap" style={{ width, ...(style || {}) }}>
      {icon && <Icon name={icon} size={18} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </span>
  );
}

function Select({ icon, value, onChange, options, placeholder, width = 200 }) {
  return (
    <span className="kap-input-wrap" style={{ width }}>
      {icon && <Icon name={icon} size={18} />}
      <select value={value ?? ""} onChange={(e) => onChange && onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <Icon name="chevron-down" size={16} style={{ marginRight: -4 }} />
    </span>
  );
}

function RadioDropdown({ placeholder, options, value, onChange, width = 220, showSearch = true, showRadio = true, multiSelect = false }) {
  const [open, setOpen] = useStateC(false);
  const [search, setSearch] = useStateC("");
  const ref = React.useRef(null);

  useEffectC(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = search && showSearch
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selected = multiSelect ? (value || []) : value;

  function handleCheckbox(o) {
    const cur = value || [];
    onChange(cur.includes(o) ? cur.filter(x => x !== o) : [...cur, o]);
  }

  const count = (showRadio || multiSelect) ? (multiSelect ? selected.length : (value ? 1 : 0)) : 0;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span
        className="kap-input-wrap"
        style={{ width, cursor: "pointer", userSelect: "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, color: "var(--kap-fg-3)", fontSize: 13, fontFamily: "var(--kap-font-ui)" }}>
          {placeholder}
          {count > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "var(--kap-primary)", color: "#fff",
              borderRadius: 99, fontSize: 11, fontWeight: 700,
              minWidth: 18, height: 18, padding: "0 5px",
              lineHeight: 1,
            }}>{count}</span>
          )}
        </span>
        <Icon name="chevron-down" size={16} style={{ marginRight: -4 }} />
      </span>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: Math.max(width, 200), background: "#fff",
          border: "1px solid var(--kap-border-2)", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200,
        }}>
          {showSearch && (
            <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--kap-border-1)" }}>
              <Input placeholder="Rechercher..." value={search} onChange={setSearch} width="100%" />
            </div>
          )}
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.map(o => (
              multiSelect ? (
                <label key={o} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)" }}>
                  <input type="checkbox" checked={selected.includes(o)} onChange={() => handleCheckbox(o)} style={{ accentColor: "var(--kap-primary)", cursor: "pointer" }} />
                  {o}
                </label>
              ) : showRadio ? (
                <label key={o} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)" }}>
                  <input type="radio" checked={value === o} onChange={() => { onChange(o); setOpen(false); setSearch(""); }} style={{ accentColor: "var(--kap-primary)", cursor: "pointer" }} />
                  {o}
                </label>
              ) : (
                <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "var(--kap-font-ui)", color: value === o ? "var(--kap-primary)" : "var(--kap-fg-dark)", fontWeight: value === o ? 600 : 400, background: value === o ? "var(--kap-primary-soft)" : "transparent" }}>
                  {o}
                </div>
              )
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "10px 14px", color: "var(--kap-fg-3)", fontSize: 13, fontFamily: "var(--kap-font-ui)" }}>Aucun résultat</div>
            )}
          </div>
          <div style={{ padding: "8px 10px", borderTop: "1px solid var(--kap-border-1)" }}>
            <Button variant="tertiary" disabled={multiSelect ? selected.length === 0 : !value} onClick={() => { onChange(multiSelect ? [] : null); setOpen(false); setSearch(""); }}>Effacer</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <span className="kap-checkbox">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange && onChange(e.target.checked)} />
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────
function StatusPill({ kind, code, label, soft }) {
  const map = {
    success: { cls: "kap-pill--success", icon: "check-circle-2" },
    error:   { cls: "kap-pill--error",   icon: "x-circle" },
    warning: { cls: "kap-pill--warning", icon: "alert-triangle" },
    info:    { cls: "kap-pill--info",    icon: "info" },
    neutral: { cls: "kap-pill--neutral", icon: "minus" },
  };
  const m = map[kind] || map.neutral;
  return (
    <span className={"kap-pill " + m.cls}>
      <Icon name={m.icon} size={12} />
      {label ?? code}
    </span>
  );
}

// dot + label status (Material-style row indicator)
function DotStatus({ color, label }) {
  return <span className="kap-dot-status" style={{ "--c": color }}>{label}</span>;
}

// Date range dropdown (début / fin au format JJ/MM/AAAA)
function DateRangeDropdown({ placeholder = "Date", value, onChange, width = 160 }) {
  const [open, setOpen] = useStateC(false);
  const [debut, setDebut] = useStateC(value ? value.debut : "");
  const [fin, setFin] = useStateC(value ? value.fin : "");
  const ref = React.useRef(null);

  useEffectC(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const hasValue = value && (value.debut || value.fin);

  const label = hasValue
    ? [value.debut, value.fin].filter(Boolean).join(" → ")
    : placeholder;

  function handleApply() {
    onChange({ debut, fin });
    setOpen(false);
  }

  function handleClear() {
    setDebut(""); setFin("");
    onChange(null);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span className="kap-input-wrap" style={{ width, cursor: "pointer", userSelect: "none" }} onClick={() => setOpen(o => !o)}>
        <span style={{ flex: 1, color: hasValue ? "var(--kap-fg-dark)" : "var(--kap-fg-3)", fontSize: 13, fontFamily: "var(--kap-font-ui)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
        <Icon name="chevron-down" size={16} style={{ marginRight: -4 }} />
      </span>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          width: 240, background: "#fff",
          border: "1px solid var(--kap-border-2)", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200,
          padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "var(--kap-font-ui)", color: "var(--kap-fg-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date de début</label>
            <span className="kap-input-wrap" style={{ width: "100%" }}>
              <input type="text" placeholder="JJ/MM/AAAA" value={debut} onChange={e => setDebut(e.target.value)} maxLength={10} style={{ width: "100%" }} />
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "var(--kap-font-ui)", color: "var(--kap-fg-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date de fin</label>
            <span className="kap-input-wrap" style={{ width: "100%" }}>
              <input type="text" placeholder="JJ/MM/AAAA" value={fin} onChange={e => setFin(e.target.value)} maxLength={10} style={{ width: "100%" }} />
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid var(--kap-border-1)", paddingTop: 10 }}>
            <Button variant="tertiary" disabled={!hasValue} onClick={handleClear}>Effacer</Button>
            <Button variant="primary" onClick={handleApply} disabled={!debut && !fin}>Appliquer</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tooltip au survol — placement: "top" (défaut) | "top-start" | "top-end"
function Tooltip({ text, children, placement = "top" }) {
  const [visible, setVisible] = useStateC(false);
  const posStyle = placement === "top-end"
    ? { bottom: "calc(100% + 6px)", right: 0 }
    : placement === "top-start"
    ? { bottom: "calc(100% + 6px)", left: 0 }
    : { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" };
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <span style={{
          position: "absolute", ...posStyle,
          background: "#1a1a2e", color: "#fff",
          padding: "5px 10px", borderRadius: 5,
          fontSize: 12, fontFamily: "var(--kap-font-ui)",
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 500,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

// HTTP code chip (200, 400, etc.)
function HttpCode({ code, kind }) {
  return <span className={"kap-http kap-http--" + (kind || "info")}>{code}</span>;
}

// REST method tag
function MethodTag({ method }) {
  return <span className={"kap-method kap-method--" + method}>{method}</span>;
}

// ──────────────────────────────────────────────────────────────────
function IconTile({ icon, size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <span className="kap-icon-tile" style={style}>
      <Icon name={icon} size={size ? Math.round(size * 0.6) : 22} />
    </span>
  );
}

function PageHead({ icon, title, subtitle, actions }) {
  if (!actions) return null;
  return (
    <header className="kap-page-head">
      <div className="actions">{actions}</div>
    </header>
  );
}

// ──────────────────────────────────────────────────────────────────
function SectionCard({ icon, title, count, items, onSelect }) {
  return (
    <div className="kap-card kap-section-card">
      <div className="head">
        <IconTile icon={icon} />
        <div className="title">{title}</div>
        {count != null && <div className="count">{count} {count > 1 ? "sections" : "section"}</div>}
      </div>
      <div className="items">
        {items.map((it, i) => (
          <div className="item" key={i} onClick={() => onSelect && onSelect(it)}>
            <div className="label">{it.label} <Icon name="arrow-right" size={14} /></div>
            <div className="desc">{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="kap-tabs">
      {tabs.map(t => (
        <div
          key={t.key}
          className={"tab" + (active === t.key ? " is-active" : "")}
          onClick={() => onChange && onChange(t.key)}
        >{t.label}</div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange, totalItems, perPage }) {
  if (!totalPages) totalPages = 1;
  const pages = [];
  const range = (a, b) => { for (let i = a; i <= b; i++) pages.push(i); };
  if (totalPages <= 7) range(1, totalPages);
  else {
    if (page <= 4) { range(1, 5); pages.push("…"); pages.push(totalPages); }
    else if (page >= totalPages - 3) { pages.push(1); pages.push("…"); range(totalPages - 4, totalPages); }
    else { pages.push(1); pages.push("…"); range(page - 1, page + 1); pages.push("…"); pages.push(totalPages); }
  }
  return (
    <div className="kap-pag-bar">
      {totalItems != null
        ? <div>{((page - 1) * perPage) + 1}–{Math.min(page * perPage, totalItems)} sur {totalItems} résultats</div>
        : <div />
      }
      <div className="kap-pag">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="prev">
          <Icon name="chevron-left" size={16} />
        </button>
        {pages.map((p, i) => p === "…"
          ? <span key={i} style={{ padding: "0 4px", color: "var(--kap-fg-3)" }}>…</span>
          : <button key={i} className={p === page ? "is-active" : ""} onClick={() => onChange(p)}>{p}</button>
        )}
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="next">
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function Toolbar({ children }) {
  return <div className="kap-toolbar">{children}</div>;
}

// Generic table wrapper
function TableBox({ children }) {
  return <div className="kap-table-wrap">{children}</div>;
}

function SortHeader({ children, active, dir = "desc" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {children}
      {active && <Icon name={dir === "desc" ? "chevron-down" : "chevron-up"} size={14} style={{ color: "var(--kap-primary)" }} />}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────
function Drawer({ title, subtitle, onClose, children, footer }) {
  useEffectC(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <>
      <div className="kap-drawer-backdrop" onClick={onClose} />
      <aside className="kap-drawer" role="dialog" aria-modal="true">
        <header>
          <div style={{ flex: 1 }}>
            <div className="title">{title}</div>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          <button className="x" onClick={onClose} aria-label="Fermer">
            <Icon name="x" size={22} />
          </button>
        </header>
        <div className="kap-drawer-body">{children}</div>
        {footer && <div className="kap-drawer-foot">{footer}</div>}
      </aside>
    </>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="kap-detail-section">
      {title && <div className="section-head">{title}</div>}
      {children}
    </section>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="kap-detail-row">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  );
}

function CodeBlock({ value }) {
  const [copied, setCopied] = useStateC(false);
  function highlight(text) {
    return text
      .replace(/("(?:\\.|[^"\\])*")(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="s">$1</span>')
      .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="n">$1</span>')
      .replace(/(\btrue\b|\bfalse\b|\bnull\b)/g, '<span class="n">$1</span>');
  }
  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <pre className="kap-code">
      <button className="copy" aria-label="Copier" onClick={handleCopy} title={copied ? "Copié !" : "Copier"}>
        <Icon name={copied ? "check" : "copy"} size={14} />
      </button>
      <span dangerouslySetInnerHTML={{ __html: highlight(value) }} />
    </pre>
  );
}

// ──────────────────────────────────────────────────────────────────
function Kpi({ label, value, trend, up, desc }) {
  return (
    <div className="kap-kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {(trend || desc) && (
        <div className="row">
          {trend && <span className={up ? "trend--up" : "trend--down"}>{up ? "▲" : "▼"} {trend}</span>}
          {desc && <span className="desc">{desc}</span>}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const danger = pct >= 90;
  const warn = pct >= 75 && !danger;
  return (
    <div className={"kap-progress-bar" + (danger ? " is-danger" : warn ? " is-warning" : "")}>
      <span style={{ width: pct + "%" }} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function ChipRow({ chips, active, onChange }) {
  return (
    <div className="kap-chips">
      {chips.map(c => (
        <button
          key={c.key ?? c}
          className={"kap-chip" + (active === (c.key ?? c) ? " is-active" : "")}
          onClick={() => onChange && onChange(c.key ?? c)}
        >
          {c.icon && <Icon name={c.icon} size={14} />}
          {c.label ?? c}
        </button>
      ))}
    </div>
  );
}

// Flag SVG for country tabs
function Flag({ country }) {
  const flags = {
    fr: <svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>,
    ch: <svg viewBox="0 0 32 32"><rect width="32" height="32" fill="#D52B1E"/><rect x="13" y="6" width="6" height="20" fill="#fff"/><rect x="6" y="13" width="20" height="6" fill="#fff"/></svg>,
    ad: <svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#10069F"/><rect x="1" width="1" height="2" fill="#FCDD09"/><rect x="2" width="1" height="2" fill="#D52B1E"/></svg>,
    ca: <svg viewBox="0 0 32 16"><rect width="32" height="16" fill="#fff"/><rect width="8" height="16" fill="#FF0000"/><rect x="24" width="8" height="16" fill="#FF0000"/><path d="M16 4 L17 7 L20 6 L18 8 L20 10 L17 9 L16 12 L15 9 L12 10 L14 8 L12 6 L15 7 Z" fill="#FF0000"/></svg>,
    us: <svg viewBox="0 0 19 10"><rect width="19" height="10" fill="#fff"/><rect y="0" width="19" height="0.77" fill="#B22234"/><rect y="1.54" width="19" height="0.77" fill="#B22234"/><rect y="3.08" width="19" height="0.77" fill="#B22234"/><rect y="4.62" width="19" height="0.77" fill="#B22234"/><rect y="6.15" width="19" height="0.77" fill="#B22234"/><rect y="7.69" width="19" height="0.77" fill="#B22234"/><rect y="9.23" width="19" height="0.77" fill="#B22234"/><rect width="7.6" height="5.38" fill="#3C3B6E"/></svg>,
  };
  return <span className="kap-flag">{flags[country] || null}</span>;
}

Object.assign(window, {
  Icon, Button, IconButton, Input, Select, RadioDropdown, DateRangeDropdown, Checkbox, Tooltip,
  StatusPill, DotStatus, HttpCode, MethodTag,
  IconTile, PageHead, SectionCard,
  Tabs, Pagination, Toolbar, TableBox, SortHeader,
  Drawer, DetailSection, DetailRow, CodeBlock,
  Kpi, ProgressBar, ChipRow, Flag,
});
