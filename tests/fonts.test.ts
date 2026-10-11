import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../src/app/theme.css', import.meta.url), 'utf8');
const fonts = [
  {
    family: 'montserrat',
    licence: 'Montserrat-OFL.txt',
    fontHash: '06b16db7a969135d48d38c49183be7fb88d4452e2a3011957c7851941f4e4879',
    licenceHash: '8b7141c03fa4f8d44e6345d5d4931709290f0f67875e452e95ac1fd3a027802e',
  },
  {
    family: 'inter',
    licence: 'Inter-OFL.txt',
    fontHash: '3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62',
    licenceHash: '5b9321a4298cfeb6b34354164a1c3afc3db114569984c502b9b35d988fd58c57',
  },
];

describe('self-hosted design fonts', () => {
  it('loads fonts locally without a Google Fonts build dependency', () => {
    expect(layout).toMatch(/import localFont from ['"]next\/font\/local['"]/);
    expect(layout).not.toContain('next/font/google');
  });

  for (const { family, licence, fontHash, licenceHash } of fonts) {
    it(`keeps ${family}'s variable weights, CSS variable, swap and adjusted fallback`, () => {
      const options = layout.match(new RegExp(`const ${family} = localFont\\(\\{([\\s\\S]*?)\\}\\)`))?.[1];
      expect(options).toBeDefined();
      expect(options).toContain(`src: './fonts/${family}-latin.woff2'`);
      expect(options).toContain("weight: '100 900'");
      expect(options).toContain(`variable: '--font-${family}'`);
      expect(options).toContain("display: 'swap'");
      expect(options).toContain("adjustFontFallback: 'Arial'");
      expect(layout).toContain(`${family}.variable`);
      expect(theme).toContain(`var(--font-${family})`);
    });

    it(`ships the exact approved ${family} font and its adjacent OFL licence`, () => {
      for (const [file, hash] of [[`${family}-latin.woff2`, fontHash], [licence, licenceHash]]) {
        const bytes = readFileSync(new URL(`../src/app/fonts/${file}`, import.meta.url));
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(hash);
      }
    });
  }
});
