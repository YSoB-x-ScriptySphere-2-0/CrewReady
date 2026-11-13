// Verified public pages behind every "Source:" line (checked reachable, HTTP 200, Nov 2026).
// A citation like "Storm: NASA DONKI + NOAA SWPC · Radiation: NASA Human Research Program"
// is split into parts and each part links to the best matching page.

export interface SourceLink {
  label: string;
  url: string;
}

interface Rule {
  match: RegExp;
  label: string;
  url: string;
}

// Order matters: first match wins.
const RULES: Rule[] = [
  { match: /DONKI/i, label: 'NASA DONKI', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' },
  { match: /SWPC|NOAA/i, label: 'NOAA SWPC', url: 'https://www.swpc.noaa.gov/' },
  { match: /EPIC/i, label: 'NASA EPIC', url: 'https://epic.gsfc.nasa.gov/' },
  { match: /MOXIE/i, label: 'NASA MOXIE', url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/' },
  { match: /Human Research/i, label: 'NASA Human Research Program', url: 'https://www.nasa.gov/hrp/' },
  { match: /Orion/i, label: 'NASA Orion', url: 'https://www.nasa.gov/reference/orion-spacecraft/' },
  { match: /InSight/i, label: 'NASA InSight', url: 'https://science.nasa.gov/mission/insight/' },
  { match: /OSDR|Veggie|OSD-745|Plants in space/i, label: 'NASA OSDR Veggie (OSD-745)', url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-745' },
  { match: /life support|water recycling|ECLSS/i, label: 'NASA ISS life support', url: 'https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/' },
  { match: /Sample Return|Perseverance/i, label: 'NASA Mars Sample Return', url: 'https://science.nasa.gov/mission/mars-sample-return/' },
  { match: /APOD/i, label: 'NASA APOD', url: 'https://science.nasa.gov/apod/' },
  { match: /communications|signal delay/i, label: 'NASA space communications', url: 'https://www.nasa.gov/communicating-with-missions/' },
  { match: /Logistics/i, label: 'NASA Human Spaceflight', url: 'https://www.nasa.gov/humans-in-space/' },
  { match: /Mars missions|Mars Facts|Opportunity|Sunlight on Mars|Mars/i, label: 'NASA Mars', url: 'https://science.nasa.gov/mars/facts/' },
  { match: /NTRS/i, label: 'NASA Technical Reports', url: 'https://ntrs.nasa.gov/' },
  { match: /NASA/i, label: 'NASA', url: 'https://www.nasa.gov/' },
];

/** Links for a citation string; parts that match nothing are skipped. De-duplicated by URL. */
export function linksForSource(text: string): SourceLink[] {
  const out: SourceLink[] = [];
  const seen = new Set<string>();
  for (const part of text.split(/\s[·+;]\s|\s\+\s/)) {
    for (const rule of RULES) {
      if (rule.match.test(part)) {
        if (!seen.has(rule.url)) {
          seen.add(rule.url);
          out.push({ label: rule.label, url: rule.url });
        }
        break;
      }
    }
  }
  return out;
}

export const ALL_SOURCE_URLS: readonly string[] = RULES.map((r) => r.url);
