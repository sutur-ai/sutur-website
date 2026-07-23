import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  dependencies: Record<string, string>;
};
const booking = readFileSync(new URL('../src/components/booking/Booking.tsx', import.meta.url), 'utf8');
const header = readFileSync(new URL('../src/components/sections/Header.tsx', import.meta.url), 'utf8');

function collectTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTsxFiles(path);
    return extname(entry.name) === '.tsx' ? [path] : [];
  });
}

describe('website icon system', () => {
  it('centralizes interface icons on lucide-react', () => {
    expect(packageJson.dependencies['lucide-react']).toBeDefined();
    expect(existsSync(new URL('../src/components/ui/icons.tsx', import.meta.url))).toBe(true);

    const icons = readFileSync(new URL('../src/components/ui/icons.tsx', import.meta.url), 'utf8');
    expect(icons).toContain("from 'lucide-react'");
    expect(icons).toContain('export function ArrowIcon');
    expect(icons).toContain('export function MenuIcon');
    expect(icons).toContain('export function ExpandIcon');
  });

  it('uses real icons instead of text arrows in interactive controls', () => {
    const sourceRoot = new URL('../src', import.meta.url).pathname;
    const textArrowFiles = collectTsxFiles(sourceRoot).filter((path) => /[→←↗]/.test(readFileSync(path, 'utf8')));

    expect(textArrowFiles).toEqual([]);
    expect(booking.match(/<ArrowIcon \/>/g)).toHaveLength(1);
    expect(booking).not.toContain('<CloseIcon />');
    expect(header).toContain('<MenuIcon open={open} />');
    expect(header).toContain('<ArrowIcon />');
  });
});
