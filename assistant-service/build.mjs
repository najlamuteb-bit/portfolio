import fs from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(root, "../assets/js/content.js");
const code = await fs.readFile(contentPath, "utf8");
const content = vm.runInNewContext(`${code}\nJSON.stringify(CONTENT)`, Object.create(null), { timeout: 1000 });
const c = JSON.parse(content);
const text = value => JSON.stringify(value).replace(/<[^>]*>/g, "");
const docs = [
  { id: "profile", title: "Professional profile", text: text({ name:c.identity.name, role:c.identity.role, profile:c.about.paras, focus:c.about.focus, figures:c.stats }) },
  { id: "experience", title: "Professional experience", text: text(c.experience.jobs) },
  { id: "achievements", title: "Recorded achievements", text: text(c.wins.items) },
  { id: "skills", title: "Skills and languages", text: text({groups:c.skills.groups, languages:c.skills.langs}) },
  { id: "credentials", title: "Education and credentials", text: text(c.credentials.groups) },
  { id: "contact", title: "Published professional contact", text: text({email:c.identity.email, phone:c.identity.phone, phoneDisplay:c.identity.phoneDisplay, linkedin:c.identity.linkedin, location:c.identity.location}) },
  { id: "cv", title: "CV download", text: "The published CV is available through the Download CV link. No additional CV facts have been independently extracted." },
  ...c.projects.items.map(p => ({ id:p.id, title:p.title, text:text({summary:p.sum, problem:p.goal, role:p.role, features:p.feats, documentedResult:p.proven, expectedBenefitOnly:p.expected, disclosure:"Demo with fictional data. Demonstration numbers are not actual business results."}) }))
];
const worker = await fs.readFile(path.join(root,"worker.mjs"), "utf8");
const generated = worker.replace('import { DOCUMENTS } from "./knowledge.mjs";',`const DOCUMENTS = ${JSON.stringify(docs, null, 2)};`);
await fs.mkdir(path.join(root,"dist/server"), {recursive:true});
await fs.writeFile(path.join(root,"knowledge.mjs"), `// Generated from the published portfolio. Run node build.mjs after content changes.\nexport const DOCUMENTS = ${JSON.stringify(docs, null, 2)};\n`);
await fs.writeFile(path.join(root,"dist/server/index.js"),generated);
console.log(`Built assistant with ${docs.length} source documents from the existing portfolio.`);
