import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pagesToUpdate = [
  'CursesPage.jsx',
  'DeitiesPage.jsx',
  'GuildsPage.jsx',
  'ItemsPage.jsx',
  'MagicItemsPage.jsx',
  'MineralsPage.jsx',
  'MonstersPage.jsx',
  'OceansPage.jsx',
  'PlantsPage.jsx',
  'PotionsPage.jsx',
  'RecipesPage.jsx',
  'SectsPage.jsx',
  'CelestialBodiesPage.jsx',
  'CraftingMaterialsPage.jsx'
];

const pagesDir = join(process.cwd(), 'src', 'pages');

for (const pageFile of pagesToUpdate) {
  const filePath = join(pagesDir, pageFile);

  try {
    let content = readFileSync(filePath, 'utf8');

    const hasWorldField = content.includes('worldField') || content.includes('world_id');

    if (hasWorldField) {
      console.log(`✓ ${pageFile} - Already has worldField`);
      continue;
    }

    const importPattern = /^(import.*from '\.\.\/components\/EntityForm';)$/m;
    const importMatch = content.match(importPattern);

    if (!importMatch) {
      console.log(`⚠ ${pageFile} - No EntityForm import found, skipping`);
      continue;
    }

    content = content.replace(
      importPattern,
      `$1\nimport { worldField } from '../utils/commonFields';`
    );

    const fieldsPattern = /(const fields = \[\s*\{[^}]+\},\s*\{[^}]+\},)/;
    const fieldsMatch = content.match(fieldsPattern);

    if (!fieldsMatch) {
      console.log(`⚠ ${pageFile} - Fields pattern not found, skipping`);
      continue;
    }

    content = content.replace(
      fieldsPattern,
      `$1\n  worldField,`
    );

    writeFileSync(filePath, content, 'utf8');
    console.log(`✔ ${pageFile} - worldField added successfully`);

  } catch (error) {
    console.error(`✗ ${pageFile} - Error: ${error.message}`);
  }
}

console.log('\nDone!');
