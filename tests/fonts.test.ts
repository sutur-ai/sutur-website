import { createHash } from 'node:crypto';
import { readFile, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import localFontLoader from 'next/dist/compiled/@next/font/dist/local/loader';
import postcssNextFont from 'next/dist/build/webpack/loaders/next-font-loader/postcss-next-font';
import postcss from 'postcss';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../src/app/theme.css', import.meta.url), 'utf8');

interface MetricFont {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  variationCoords: number[];
  variationAxes: Record<string, { default: number }>;
  HVAR: unknown;
  _variationProcessor: { getAdvanceAdjustment(id: number, hvar: unknown): number };
  glyphsForString(text: string): { id: number; advanceWidth: number }[];
}
const require = createRequire(import.meta.url);
const fontkit = require('next/dist/compiled/@next/font/dist/fontkit').default;
const fontFromBuffer: (bytes: Buffer) => MetricFont = fontkit.default || fontkit;

function regularMetrics(family: string) {
  const bytes = readFileSync(new URL(`../src/app/fonts/${family}-latin.woff2`, import.meta.url));
  const base = fontFromBuffer(bytes);
  const regular = fontFromBuffer(bytes);
  regular.variationCoords = Object.keys(regular.variationAxes).map(axis =>
    axis === 'wght' ? 400 : regular.variationAxes[axis].default);
  // Read base advances and HVAR deltas separately: bundled fontkit cannot
  // instantiate transformed WOFF2 outlines through getVariation().
  const widths = base.glyphsForString('aaabcdeeeefghiijklmnnoopqrrssttuvwxyz      ').map(glyph =>
    glyph.advanceWidth + regular._variationProcessor.getAdvanceAdjustment(glyph.id, regular.HVAR));
  // Same Arial reference and frequency-weighted sample as Next's local loader.
  const arialAverage = 934.5116279069767 / 2048;
  const sizeAdjust = widths.reduce((sum, width) => sum + width, 0) / widths.length / base.unitsPerEm / arialAverage;
  const percent = (value: number) => `${Math.abs(value * 100).toFixed(2)}%`;
  return {
    'size-adjust': percent(sizeAdjust),
    'ascent-override': percent(base.ascent / base.unitsPerEm / sizeAdjust),
    'descent-override': percent(base.descent / base.unitsPerEm / sizeAdjust),
    'line-gap-override': percent(base.lineGap / base.unitsPerEm / sizeAdjust),
  };
}

function fontOptions(family: string) {
  const source = ts.createSourceFile('layout.tsx', layout, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let options: Record<string, string | boolean | string[]> | undefined;
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === family &&
        node.initializer && ts.isCallExpression(node.initializer)) {
      const argument = node.initializer.arguments[0];
      if (!ts.isObjectLiteralExpression(argument)) throw new Error('Expected literal font options');
      options = {};
      for (const property of argument.properties) {
        if (!ts.isPropertyAssignment(property)) throw new Error('Expected font property');
        const value = property.initializer;
        options[property.name.getText(source)] = ts.isStringLiteral(value) ? value.text
          : value.kind === ts.SyntaxKind.FalseKeyword ? false
          : ts.isArrayLiteralExpression(value) ? value.elements.map(element => {
            if (!ts.isStringLiteral(element)) throw new Error('Expected fallback name');
            return element.text;
          }) : (() => { throw new Error('Unsupported font option'); })();
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!options) throw new Error(`Missing ${family} font options`);
  return options;
}
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
      expect(options).toContain(family === 'montserrat' ? 'adjustFontFallback: false' : "adjustFontFallback: 'Arial'");
      expect(layout).toContain(`${family}.variable`);
      expect(theme).toContain(`var(--font-${family})`);
    });

    it(`emits ${family}'s fallback CSS with metrics computed at weight 400`, async () => {
      const result = await localFontLoader({
        functionName: '', variableName: family, data: [fontOptions(family)],
        emitFontFile: () => '/font.woff2',
        resolve: path => new URL(`../src/app/${path}`, import.meta.url).pathname,
        isDev: false, isServer: true, loaderContext: { fs: { readFile } },
      });
      const emitted = await postcss([postcssNextFont({ ...result, exports: [] })]).process(result.css, { from: undefined });
      const css = postcss.parse(`${theme}\n${emitted.css}`);
      const fallbackFamily = family === 'montserrat' ? 'Montserrat Arial Fallback' : 'inter Fallback';
      let fallbackFace: postcss.AtRule | undefined;
      css.walkAtRules('font-face', face => {
        if (face.nodes?.some(node => node.type === 'decl' && node.prop === 'font-family' &&
            node.value.replace(/['"]/g, '') === fallbackFamily)) fallbackFace = face;
      });
      expect(fallbackFace).toBeDefined();
      const declarations: Record<string, string> = {};
      fallbackFace!.walkDecls(decl => { declarations[decl.prop] = decl.value; });
      expect(declarations.src.replace(/['"]/g, '')).toBe('local(Arial)');
      for (const [property, expected] of Object.entries(regularMetrics(family))) {
        expect(declarations[property]).toBe(expected);
      }
      expect(emitted.css).toContain(fallbackFamily);
      if (family === 'montserrat') expect(result.adjustFontFallback).toBeUndefined();
    });

    it(`ships the exact approved ${family} font and its adjacent OFL licence`, () => {
      for (const [file, hash] of [[`${family}-latin.woff2`, fontHash], [licence, licenceHash]]) {
        const bytes = readFileSync(new URL(`../src/app/fonts/${file}`, import.meta.url));
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(hash);
      }
    });
  }
});
