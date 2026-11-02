#!/usr/bin/env node
/**
 * Project Natural Earth 50m vectors to SVG path data.
 *
 * Source: Natural Earth 1:50m cultural/physical vectors (public domain).
 * https://www.naturalearthdata.com/
 * GeoJSON mirror, tag v5.1.2:
 * https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson
 *
 * d3-geo clips at the antimeridian and draws the Natural Earth projection,
 * which matches lib/world-atlas-project.ts.
 */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "lib/world-atlas.ts");
const TAG = "v5.1.2";
const BASE = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${TAG}/geojson`;

const WIDTH = 1200;
const PAD = 18;

async function load(name) {
  const url = `${BASE}/${name}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return response.json();
}

function rawProject(lambda, phi) {
  const phi2 = phi * phi;
  const phi4 = phi2 * phi2;
  return [
    lambda *
      (0.8707 -
        0.131979 * phi2 +
        phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi *
      (1.007226 +
        phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))),
  ];
}

function manualPoint(projection, lng, lat) {
  const [px, py] = rawProject((lng * Math.PI) / 180, (lat * Math.PI) / 180);
  const [tx, ty] = projection.translate();
  const k = projection.scale();
  return [tx + k * px, ty - k * py];
}

function jsString(value) {
  return JSON.stringify(value);
}

/** Drop projected points that do not change the silhouette at atlas scale. */
function simplifyPath(d, epsilon = 0.75) {
  if (!d) return d;
  const tokens = d.match(/[MLZ]|-?\d*\.?\d+/g);
  if (!tokens) return d;
  const subpaths = [];
  let current = null;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token === "M" || token === "L") {
      const x = Number(tokens[i + 1]);
      const y = Number(tokens[i + 2]);
      i += 2;
      if (token === "M") {
        if (current) subpaths.push(current);
        current = { points: [[x, y]], closed: false };
      } else if (current) {
        current.points.push([x, y]);
      }
    } else if (token === "Z" && current) {
      current.closed = true;
    }
  }
  if (current) subpaths.push(current);

  function rdp(points) {
    if (points.length < 3) return points;
    const [ax, ay] = points[0];
    const [bx, by] = points[points.length - 1];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let maxDist = 0;
    let index = 0;
    for (let i = 1; i < points.length - 1; i += 1) {
      const [px, py] = points[i];
      const dist = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    if (maxDist > epsilon) {
      const left = rdp(points.slice(0, index + 1));
      const right = rdp(points.slice(index));
      return left.slice(0, -1).concat(right);
    }
    return [points[0], points[points.length - 1]];
  }

  const parts = [];
  for (const subpath of subpaths) {
    const points = subpath.closed ? subpath.points.slice(0, -1) : subpath.points;
    const simplified = rdp(points);
    if (simplified.length < 2) continue;
    const body = simplified
      .map(([x, y], index) => {
        const nx = Math.round(x * 10) / 10;
        const ny = Math.round(y * 10) / 10;
        return `${index === 0 ? "M" : "L"}${nx},${ny}`;
      })
      .join("");
    parts.push(subpath.closed ? `${body}Z` : body);
  }
  return parts.join("");
}

const [land, countries, lakes] = await Promise.all([
  load("ne_50m_land.geojson"),
  load("ne_50m_admin_0_countries.geojson"),
  load("ne_50m_lakes.geojson"),
]);

const projection = geoNaturalEarth1().precision(0.6);
const path = geoPath(projection).digits(1);
const inner = WIDTH - PAD * 2;
projection.fitWidth(inner, { type: "Sphere" });
const [tx, ty] = projection.translate();
projection.translate([tx + PAD, ty + PAD]);

const sphere = simplifyPath(path({ type: "Sphere" }), 0.4);
const [, y1] = path.bounds({ type: "Sphere" })[1];
const height = Math.round((y1 + PAD) * 100) / 100;
const graticule = simplifyPath(path(geoGraticule().step([30, 30])()), 0.8);
const landPath = simplifyPath(path(land), 0.7);
const lakePath = simplifyPath(path(lakes), 0.85);

const countryPaths = [];
for (const feature of countries.features) {
  const d = simplifyPath(path(feature), 0.7);
  if (!d) continue;
  const name =
    feature.properties?.NAME ||
    feature.properties?.ADMIN ||
    "Unknown";
  countryPaths.push({ name, d });
}

const [scale] = [projection.scale()];
const [translateX, translateY] = projection.translate();

for (const [lng, lat] of [
  [0, 0],
  [106.7, 26.6],
  [-99.1, 19.4],
  [135.8, 35],
  [139.7, 35.7],
]) {
  const [ax, ay] = projection([lng, lat]);
  const [bx, by] = manualPoint(projection, lng, lat);
  const drift = Math.hypot(ax - bx, ay - by);
  if (drift > 0.01) {
    throw new Error(`Projection mismatch at ${lng},${lat}: ${drift}`);
  }
}

const lines = [
  "/* Generated from Natural Earth 50m. Do not edit by hand. */",
  "/* Source: Natural Earth, public domain. https://www.naturalearthdata.com/ */",
  "/* GeoJSON: natural-earth-vector v5.1.2 ne_50m_land, ne_50m_admin_0_countries, ne_50m_lakes */",
  "/* Projection: Natural Earth, via d3-geo. Regenerate with scripts/build-world-atlas.mjs */",
  "",
  'export const WORLD_ATLAS_RESOLUTION = "50m";',
  "",
  `export const WORLD_ATLAS_WIDTH = ${WIDTH};`,
  `export const WORLD_ATLAS_HEIGHT = ${height};`,
  `export const WORLD_ATLAS_SCALE = ${scale};`,
  `export const WORLD_ATLAS_TRANSLATE_X = ${translateX};`,
  `export const WORLD_ATLAS_TRANSLATE_Y = ${translateY};`,
  "",
  `export const WORLD_ATLAS_SPHERE = ${jsString(sphere)};`,
  "",
  `export const WORLD_ATLAS_GRATICULE = ${jsString(graticule)};`,
  "",
  `export const WORLD_ATLAS_LAND = ${jsString(landPath)};`,
  "",
  `export const WORLD_ATLAS_LAKES = ${jsString(lakePath ?? "")};`,
  "",
  "export const WORLD_ATLAS_COUNTRIES: { name: string; d: string }[] = [",
  ...countryPaths.map(
    (country) => `  { name: ${jsString(country.name)}, d: ${jsString(country.d)} },`,
  ),
  "];",
  "",
];

writeFileSync(OUT, lines.join("\n"));
console.log(
  `wrote ${OUT} (${(lines.join("\n").length / 1024).toFixed(1)} KB, ${countryPaths.length} countries, ${WIDTH}x${height})`,
);
