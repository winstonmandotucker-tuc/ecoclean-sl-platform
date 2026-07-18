# Upload Validation Report

Allowed signatures: JPEG, PNG, WebP and PDF; maximum size: 8 MB. Profile photos require images and allow one current image. Upload ownership, report assignment, supervisor jurisdiction, quarantine state and privileged roles are enforced server-side.

Actual results: valid profile/report/task images accepted; corrupt PNG rejected 422; executable rejected 422; unassigned Staff and cross-user retrieval denied; replaced/deleted photo inaccessible; report deletion blocked after assignment; nine upload records and zero orphan upload owners were observed after validation.

Malware scanning uses the existing replaceable scanner adapter. Production requires ClamAV installation and a clean end-to-end scan drill.
