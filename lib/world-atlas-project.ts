import {
  WORLD_ATLAS_HEIGHT,
  WORLD_ATLAS_SCALE,
  WORLD_ATLAS_TRANSLATE_X,
  WORLD_ATLAS_TRANSLATE_Y,
  WORLD_ATLAS_WIDTH,
} from "@/lib/world-atlas";

/** Natural Earth raw projection, matching d3-geo's naturalEarth1. */
function projectNaturalEarth(lng: number, lat: number) {
  const lambda = (lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const phi2 = phi * phi;
  const phi4 = phi2 * phi2;
  const x =
    lambda *
    (0.8707 -
      0.131979 * phi2 +
      phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4)));
  const y =
    phi *
    (1.007226 +
      phi2 *
        (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)));
  return {
    x: WORLD_ATLAS_TRANSLATE_X + WORLD_ATLAS_SCALE * x,
    y: WORLD_ATLAS_TRANSLATE_Y - WORLD_ATLAS_SCALE * y,
  };
}

export function projectAtlasPoint(lat: number, lng: number) {
  const { x, y } = projectNaturalEarth(lng, lat);
  return {
    x,
    y,
    left: (x / WORLD_ATLAS_WIDTH) * 100,
    top: (y / WORLD_ATLAS_HEIGHT) * 100,
  };
}
