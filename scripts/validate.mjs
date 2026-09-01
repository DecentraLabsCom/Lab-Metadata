import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const examplesDirectory = path.join(repositoryRoot, 'examples');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const allFiles = walk(repositoryRoot);
const jsonFiles = allFiles.filter((file) => file.startsWith(`${examplesDirectory}${path.sep}`)
  && file.endsWith('.json'));
const markdownFiles = allFiles.filter((file) => file.endsWith('.md'));
const errors = [];
const parsedJson = new Map();

function relative(file) {
  return path.relative(repositoryRoot, file) || '.';
}

function report(message) {
  errors.push(message);
}

for (const file of jsonFiles) {
  try {
    const document = JSON.parse(fs.readFileSync(file, 'utf8'));
    parsedJson.set(file, document);

    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      report(`${relative(file)} must contain a JSON object`);
      continue;
    }
    if (typeof document.name !== 'string' || !document.name.trim()) {
      report(`${relative(file)} must contain a non-empty name`);
    }
    if (typeof document.description !== 'string' || !document.description.trim()) {
      report(`${relative(file)} must contain a non-empty description`);
    }
    if (!Array.isArray(document.attributes)) {
      report(`${relative(file)} must contain an attributes array`);
      continue;
    }

    for (const attribute of document.attributes) {
      if (!attribute || typeof attribute !== 'object' || typeof attribute.trait_type !== 'string') {
        report(`${relative(file)} contains an invalid attribute entry`);
        continue;
      }
      if (attribute.trait_type !== 'termsOfUse') continue;
      const terms = attribute.value;
      if (!terms || typeof terms !== 'object' || Array.isArray(terms)) {
        report(`${relative(file)} termsOfUse must be an object`);
        continue;
      }
      if (terms.effectiveDate !== undefined
        && (!Number.isSafeInteger(terms.effectiveDate) || terms.effectiveDate <= 0)) {
        report(`${relative(file)} termsOfUse.effectiveDate must be positive Unix seconds`);
      }
      if (terms.url && (!Number.isSafeInteger(terms.effectiveDate) || terms.effectiveDate <= 0)) {
        report(`${relative(file)} termsOfUse with a URL must include effectiveDate Unix seconds`);
      }
    }
  } catch (error) {
    report(`${relative(file)} is not valid JSON: ${error.message}`);
  }
}

const fixtureFiles = markdownFiles.filter((file) => file.endsWith('-json-fixture.md'));
const matchedJsonFiles = new Set();
for (const file of fixtureFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/```json\s*\r?\n([\s\S]*?)\r?\n```/i);
  if (!match) {
    report(`${relative(file)} must contain a fenced JSON document`);
    continue;
  }

  let fixtureDocument;
  try {
    fixtureDocument = JSON.parse(match[1]);
  } catch (error) {
    report(`${relative(file)} contains invalid fenced JSON: ${error.message}`);
    continue;
  }

  const matchingJson = [...parsedJson.entries()].find(([, document]) => {
    try {
      assert.deepEqual(document, fixtureDocument);
      return true;
    } catch {
      return false;
    }
  });
  if (!matchingJson) {
    report(`${relative(file)} does not match any examples/*.json fixture`);
  } else {
    matchedJsonFiles.add(matchingJson[0]);
  }
}

for (const file of jsonFiles) {
  if (!matchedJsonFiles.has(file)) {
    report(`${relative(file)} has no matching *-json-fixture.md page`);
  }
}

const markdownLinkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(markdownLinkPattern)) {
    let target = match[1].trim();
    if (target.startsWith('<') && target.includes('>')) {
      target = target.slice(1, target.indexOf('>'));
    } else {
      target = target.split(/\s+/)[0];
    }
    if (!target || /^(?:[a-z][a-z\d+.-]*:|#)/i.test(target)) continue;

    const withoutQueryOrFragment = target.split(/[?#]/, 1)[0];
    const resolved = path.resolve(path.dirname(file), withoutQueryOrFragment);
    const insideRepository = resolved === repositoryRoot
      || resolved.startsWith(`${repositoryRoot}${path.sep}`);
    if (!insideRepository || !fs.existsSync(resolved)) {
      report(`${relative(file)} links to missing path ${target}`);
    }
  }
}

if (errors.length) {
  console.error('Metadata validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Metadata validation passed (${jsonFiles.length} JSON fixtures, ${markdownFiles.length} Markdown files).`);
}
