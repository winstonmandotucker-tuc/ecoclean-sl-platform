# GIS Deployment Report

Leaflet and environment-controlled tile URLs remain vendor-neutral. MariaDB contains the Country → Province/Region → District → Municipality → Ward → Community schema plus layers, markers, and boundary APIs.

Phase 5 database evidence: `gis_layers=0`, `gis_boundaries=0`, and `communities=0`. No GeoJSON, Shapefile, or KML boundary source exists in the repository, and an authoritative source with confirmed licensing and administrative codes was not available for validated import during this run. Therefore no synthetic or unverified geometry was inserted.

GIS deployment rubric: **3/10** — schema/API/Leaflet ownership controls pass; authoritative data import, geometry validation, layer population, spatial performance, and municipal acceptance are unverified. Production GIS certification is blocked until the Sierra Leone authority or approved humanitarian data custodian supplies a versioned dataset and ECOCLEAN records its source, license, checksum, administrative level, feature count, invalid geometry count, and import transaction.

