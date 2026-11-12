"""Generate the Europe game grid from Natural Earth GeoJSON downloads.

Usage: python generateEuropeMap.py countries.geojson populated_places.geojson
Sources (public domain):
https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
ne_50m_admin_0_countries.geojson and ne_10m_populated_places.geojson.
City POP_MAX estimates determine a gameplay market index; this is not a census
population grid. Lambert azimuthal equal-area projection, 160 km hex spacing.
"""
import json
import math
import sys
from pathlib import Path

R = 6371.0
LAT0 = math.radians(54)
LON0 = math.radians(15)
WIDTH = 160.0
STEP_Y = WIDTH * math.sqrt(3) / 2
EXTRA = {"Turkey", "Cyprus", "Georgia", "Armenia", "Azerbaijan"}


def project(lon, lat):
    lon, lat = math.radians(lon), math.radians(lat)
    dl = lon - LON0
    k = math.sqrt(2 / (1 + math.sin(LAT0) * math.sin(lat) +
                       math.cos(LAT0) * math.cos(lat) * math.cos(dl)))
    return (R * k * math.cos(lat) * math.sin(dl),
            -R * k * (math.cos(LAT0) * math.sin(lat) -
                       math.sin(LAT0) * math.cos(lat) * math.cos(dl)))


def in_ring(x, y, ring):
    inside = False
    prev_x, prev_y = ring[-1]
    for next_x, next_y in ring:
        if ((next_y > y) != (prev_y > y) and
                x < (prev_x - next_x) * (y - next_y) / (prev_y - next_y) + next_x):
            inside = not inside
        prev_x, prev_y = next_x, next_y
    return inside


def country_at(x, y, polygons):
    for name, rings, bounds in polygons:
        if not (bounds[0] <= x <= bounds[2] and bounds[1] <= y <= bounds[3]):
            continue
        if in_ring(x, y, rings[0]) and not any(in_ring(x, y, hole) for hole in rings[1:]):
            return name
    return None


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    countries = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    places = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    polygons = []
    for feature in countries["features"]:
        prop = feature["properties"]
        name = prop["NAME_EN"]
        if prop["CONTINENT"] != "Europe" and name not in EXTRA:
            continue
        geo = feature["geometry"]
        shapes = [geo["coordinates"]] if geo["type"] == "Polygon" else geo["coordinates"]
        for shape in shapes:
            rings = [[project(*p[:2]) for p in ring] for ring in shape]
            xs, ys = zip(*rings[0])
            polygons.append((name.replace("\ufffdland", "Aland"), rings,
                             (min(xs), min(ys), max(xs), max(ys))))

    country_names = {name for name, _, _ in polygons}
    cities = []
    for feature in places["features"]:
        lon, lat = feature["geometry"]["coordinates"][:2]
        if not (-26 <= lon <= 45 and 34 <= lat <= 72):
            continue
        x, y = project(lon, lat)
        prop = feature["properties"]
        if prop.get("ADM0NAME") not in country_names and not country_at(x, y, polygons):
            continue
        pop = prop.get("POP_MAX") or 0
        if pop > 0:
            cities.append((x, y, pop, prop.get("NAME_EN") or prop["NAME"]))

    left, top = project(-25, 55)[0], project(15, 72)[1]
    right, bottom = project(45, 54)[0], project(15, 34)[1]
    rows = math.ceil((bottom - top) / STEP_Y)
    cols = math.ceil((right - left) / WIDTH)
    cells = []
    samples = [(0, 0), (-.28, 0), (.28, 0), (0, -.26), (0, .26)]
    for row in range(rows + 1):
        y = top + row * STEP_Y
        for col in range(cols + 1):
            x = left + (col + .5 * (row % 2)) * WIDTH
            name = next((name for dx, dy in samples
                         if (name := country_at(x + dx * WIDTH, y + dy * WIDTH, polygons))), None)
            if not name:
                continue
            nearby = [(math.hypot(x - cx, y - cy), population, city)
                      for cx, cy, population, city in cities
                      if abs(cx - x) <= 260 and abs(cy - y) <= 260]
            score = sum(pop / 1_300_000 * math.exp(-((distance / 85) ** 2))
                        for distance, pop, _ in nearby if distance <= 260)
            tier = ("destination" if score >= 3 else "urban" if score >= .6 else
                    "suburban" if score >= .12 else "rural" if score >= .018 else "barren")
            relevant = [city for city in nearby if city[0] <= 120 and city[1] >= 50000]
            strongest = max(relevant, key=lambda city: city[1] * math.exp(-((city[0] / 85) ** 2)),
                            default=None)
            label = f"{name} - {strongest[2]} area" if strongest else name
            cells.append([col, row, tier, label])

    output = Path(__file__).with_name("europeMap.js")
    output.write_text(
        "/* Generated from Natural Earth public-domain country boundaries and populated places.\n"
        "   Market tiers estimate nearby city population; they are not census counts. */\n"
        "const EUROPE_HEXES = " + json.dumps(cells, ensure_ascii=True, separators=(",", ":")) + ";\n",
        encoding="utf-8")
    from collections import Counter
    print(f"Wrote {len(cells)} tiles to {output.name}: {dict(Counter(cell[2] for cell in cells))}")


if __name__ == "__main__":
    main()
