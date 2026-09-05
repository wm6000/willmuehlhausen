import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MAX_FILES_PER_DIR = 7;
const STYLE_DIR = join("src", "styles");
const PRIMITIVE_DIR = join("src", "ui");
const SCAN_ROOTS = ["src", "scripts", "config"];

// Raw DOM tags are legal only inside src/ui. Matching against an explicit tag list
// rather than /<[a-z]/ keeps TypeScript generics (useState<string>) from tripping it.
const HTML_TAGS = [
  "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body",
  "br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del",
  "details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer",
  "form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img",
  "input","ins","kbd","label","legend","li","link","main","map","mark","menu","meta","meter","nav",
  "noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q",
  "rp","rt","ruby","s","samp","script","search","section","select","slot","small","source","span",
  "strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th",
  "thead","time","title","tr","track","u","ul","var","video","wbr","svg","path","circle","rect",
  "line","polyline","polygon","g","defs","use","text","tspan",
];
const RAW_TAG = new RegExp(`<(${HTML_TAGS.join("|")})(?=[\\s/>])`, "g");

const problems = [];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile());
  const rel = relative(ROOT, dir) || ".";

  if (files.length > MAX_FILES_PER_DIR) {
    problems.push(
      `${rel}${sep} holds ${files.length} files (limit ${MAX_FILES_PER_DIR}). Split it into subfolders.`
    );
  }

  for (const file of files) {
    const full = join(dir, file.name);
    const relFile = relative(ROOT, full);

    if (file.name.endsWith(".css") && !relFile.startsWith(STYLE_DIR)) {
      problems.push(`${relFile} — stylesheets belong in ${STYLE_DIR}${sep}, imported once from src/main.tsx.`);
    }

    if (file.name.endsWith(".tsx") && !relFile.startsWith(PRIMITIVE_DIR)) {
      const source = readFileSync(full, "utf8");
      const found = [...source.matchAll(RAW_TAG)].map((m) => m[1]);
      if (found.length > 0) {
        const unique = [...new Set(found)].join(", ");
        problems.push(`${relFile} — raw DOM tags (${unique}). Compose from @/ui, or add a primitive to ${PRIMITIVE_DIR}${sep}.`);
      }
    }
  }

  for (const entry of entries.filter((e) => e.isDirectory())) walk(join(dir, entry.name));
}

for (const root of SCAN_ROOTS) {
  const full = join(ROOT, root);
  try {
    if (statSync(full).isDirectory()) walk(full);
  } catch {
    // root not present yet
  }
}

if (problems.length > 0) {
  console.error(`\nStructure check failed (${problems.length}):\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  process.exit(1);
}
console.log("Structure check passed.");
