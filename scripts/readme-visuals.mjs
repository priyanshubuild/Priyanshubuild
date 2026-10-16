import { createHash } from "node:crypto";

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const number = value => value.toLocaleString("en-US");
const font = 'font-family="Arial,sans-serif"';
const shades = ["#fafafa", "#b0b0bb", "#84848f", "#63636e", "#4c4c57", "#383843"];
const frame = (width, height) => `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="12" fill="#09090b" stroke="#303036"/>`;
const percentage = (count, total) => `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(total ? count / total * 100 : 0)}%`;

function languageBreakdown(languages) {
  const rows = Object.entries(languages.lines).sort(([a, ac], [b, bc]) => bc - ac || a.localeCompare(b));
  const total = rows.reduce((sum, [, count]) => sum + count, 0);
  const shown = rows.slice(0, 6);
  const other = rows.slice(6).reduce((sum, [, count]) => sum + count, 0);
  if (other) shown.push(["Other languages", other]);
  return { total, shown };
}

export function monthlyContributions(days) {
  const months = new Map();
  for (const day of days) {
    const month = day.date.slice(0, 7);
    months.set(month, (months.get(month) ?? 0) + day.count);
  }
  return [...months].map(([month, count]) => ({ month, count }));
}

function contributionChart(months, { x, y, width, height, compact }) {
  const maximum = Math.max(1, ...months.map(month => month.count));
  const step = Math.max(1, 5 * 10 ** (Math.floor(Math.log10(maximum)) - 1));
  const ceiling = Math.ceil(maximum / step) * step;
  const points = months.map((month, index) => [
    x + index * width / Math.max(1, months.length - 1),
    y + height - month.count / ceiling * height,
  ]);
  const line = points.map(([px, py], index) => `${index ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`).join(" ");
  const bottom = y + height;
  const area = `${line} L${x + width},${bottom} L${x},${bottom} Z`;
  const grid = [0, .5, 1].map(fraction => {
    const py = bottom - height * fraction;
    return `<path d="M${x} ${py}h${width}" stroke="#27272c" stroke-dasharray="3 5"/><text x="${x + width + 10}" y="${py + 4}" fill="#a1a1aa" font-size="11">${number(Math.round(ceiling * fraction))}</text>`;
  }).join("");
  const indices = [...new Set([0, Math.round((months.length - 1) / 3), Math.round(2 * (months.length - 1) / 3), months.length - 1])];
  const dates = indices.map(index => {
    const date = new Date(`${months[index].month}-01T00:00:00Z`);
    const label = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit", timeZone: "UTC" }).format(date).replace(" ", " ’");
    return `<text x="${points[index][0]}" y="${bottom + 24}" text-anchor="${index === 0 ? "start" : index === months.length - 1 ? "end" : "middle"}" fill="#a1a1aa" font-size="${compact ? 11 : 12}">${label}</text>`;
  }).join("");
  return `<defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22c55e" stop-opacity=".7"/><stop offset="1" stop-color="#22c55e" stop-opacity=".12"/></linearGradient></defs>
    <text x="${x}" y="${y - 16}" fill="#b0b0bb" font-size="12">Monthly contributions · past year</text>
    ${grid}<path d="${area}" fill="url(#area)"/><path d="${line}" fill="none" stroke="#4ade80" stroke-width="2" stroke-linejoin="round"/>
    ${points.map(([px, py], index) => `<circle cx="${px}" cy="${py}" r="2.5" fill="#4ade80"><title>${months[index].month}: ${number(months[index].count)} contributions</title></circle>`).join("")}
    ${dates}`;
}

export function renderActivitySVG(data, compact = false) {
  const days = data.calendar.days;
  const months = monthlyContributions(days);
  if (!months.length) throw new Error("A contribution calendar is required");
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const commits = data.repositories.repos.reduce((sum, repo) => sum + repo.count, 0);
  const active = days.filter(day => day.count > 0).length;
  const width = compact ? 440 : 880;
  const height = compact ? 318 : 232;
  const metrics = [[total, "Contributions · past year"], [commits, "Repository commits · all time"], [active, "Active days · past year"]];
  const labelX = 28 + Math.max(48, ...metrics.map(([value]) => number(value).length * 14)) + 14;
  const rows = metrics.map(([value, label], index) => compact
    ? `<text x="${24 + index * 137}" y="99" fill="#fafafa" font-size="25" font-weight="700">${number(value)}</text><text x="${24 + index * 137}" y="119" fill="#b0b0bb" font-size="10">${["Contributions · year", "Commits · all time", "Active days · year"][index]}</text>`
    : `<text x="28" y="${101 + index * 43}" fill="#fafafa" font-size="23" font-weight="700">${number(value)}</text><text x="${labelX}" y="${99 + index * 43}" fill="#b0b0bb" font-size="12">${label}</text>`).join("");
  const plot = compact ? { x: 24, y: 169, width: 355, height: 104, compact } : { x: 365, y: 72, width: 447, height: 113, compact };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">Priyanshu Gupta's GitHub Analytics</title><desc id="desc">${total} contributions and ${active} active days between ${data.calendar.from} and ${data.calendar.to}. ${commits} all-time commits by all authors on public repository default branches. Monthly contributions: ${escape(months.map(month => `${month.month}: ${month.count}`).join(", "))}. First and last months may be partial.</desc>
    ${frame(width, height)}<g ${font}><text x="${compact ? 24 : 28}" y="34" fill="#fafafa" font-size="${compact ? 21 : 22}" font-weight="700">Priyanshu Gupta</text><text x="${compact ? 24 : 28}" y="55" fill="#a1a1aa" font-size="12">@priyanshubuild</text>${rows}${contributionChart(months, plot)}</g></svg>`;
}

export function renderLanguageSVG(languages, compact = false) {
  const { total, shown } = languageBreakdown(languages);
  const width = compact ? 440 : 880;
  const columns = compact ? 2 : 3;
  const height = Math.max(compact ? 144 : 124, 76 + (Math.ceil(shown.length / columns) - 1) * 23 + (compact ? 22 : 25));
  const barWidth = width - 48;
  let left = 24;
  const bar = shown.map(([, count], index) => {
    const segment = total ? barWidth * count / total : 0;
    const rect = `<rect x="${left}" y="45" width="${segment}" height="6" fill="${shades[index] ?? "#26262c"}"/>`;
    left += segment;
    return rect;
  }).join("");
  const columnWidth = compact ? 196 : 284;
  const legend = shown.map(([name, count], index) => {
    const x = 28 + index % columns * columnWidth;
    const y = 76 + Math.floor(index / columns) * 23;
    return `<circle cx="${x}" cy="${y - 4}" r="3" fill="${shades[index] ?? "#26262c"}"/><text x="${x + 10}" y="${y}" fill="#e4e4e7" font-size="${compact ? 11 : 13}">${escape(name.slice(0, 18))}</text><text x="${x + columnWidth - 16}" y="${y}" text-anchor="end" fill="#fafafa" font-family="monospace" font-size="${compact ? 11 : 13}">${percentage(count, total)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">Public code languages by source-line percentage</title><desc id="desc">Language shares of all counted source lines combined across public non-fork repositories: ${escape(shown.map(([name, count]) => `${name}: ${percentage(count, total)}`).join(", "))}. Blank lines, comments, dependencies, generated files and notebook outputs are excluded. Percentages are rounded to one decimal place.</desc>${frame(width, height)}<g ${font}><text x="24" y="27" fill="#fafafa" font-size="13" font-weight="600">Public code · languages</text><text x="${width - 24}" y="27" text-anchor="end" fill="#a1a1aa" font-size="11">All repos · by lines</text><rect x="24" y="45" width="${barWidth}" height="6" rx="3" fill="#26262c"/>${bar}${legend}</g></svg>`;
}

export function activityAssets(data, languages) {
  return new Map([
    ["activity", renderActivitySVG(data)], ["activity-compact", renderActivitySVG(data, true)],
    ["languages", renderLanguageSVG(languages)], ["languages-compact", renderLanguageSVG(languages, true)],
  ].map(([name, contents]) => [name, { contents, file: `${name}-${createHash("sha256").update(contents).digest("hex").slice(0, 12)}.svg` }]));
}

export function activityBlock(data, languages, assets) {
  const total = data.calendar.days.reduce((sum, day) => sum + day.count, 0);
  const commits = data.repositories.repos.reduce((sum, repo) => sum + repo.count, 0);
  const active = data.calendar.days.filter(day => day.count > 0).length;
  const { total: sourceLines, shown: languageRows } = languageBreakdown(languages);
  const languageDescription = languageRows.map(([name, count]) => `${name} ${percentage(count, sourceLines)}`).join(", ");
  const picture = (name, href, description) => `<p align="center">
  <a href="${href}">
    <picture>
      <source media="(max-width: 600px)" srcset="assets/readme/${assets.get(`${name}-compact`).file}" />
      <img src="assets/readme/${assets.get(name).file}" width="880" alt="${escape(description)}" />
    </picture>
  </a>
</p>`;
  return `<!-- activity:start -->
### GitHub Analytics

${picture("activity", "https://github.com/priyanshubuild", `${total} GitHub contributions, ${active} active days in the past year, and ${commits} all-time public repository commits. Monthly contribution chart.`)}

${picture("languages", "https://github.com/priyanshubuild?tab=repositories", `Combined public repository language percentages by source lines: ${languageDescription}`)}
<!-- activity:end -->`;
}

export const snapshotImagePattern = /^(?:activity|languages)(?:-compact)?-[a-f0-9]{12}\.svg$/;
