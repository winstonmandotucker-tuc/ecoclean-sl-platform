# GIS Expansion Plan

The normalized hierarchy supports Country → Province/Region → District → Municipality → Ward → Community. Boundaries, layers, and markers remain in ECOCLEAN MariaDB and are exposed by authenticated APIs. Leaflet remains the rendering layer, and tile URLs are environment-configured for a future ECOCLEAN-owned server.

Before national rollout, import authoritative Sierra Leone administrative boundaries, validate every geometry and code against the issuing authority, add spatial indexing appropriate to the production MariaDB version, and measure marker/heatmap performance at pilot volume. Future African countries must use the same hierarchy and must not hardcode Sierra Leone assumptions into GIS services.

