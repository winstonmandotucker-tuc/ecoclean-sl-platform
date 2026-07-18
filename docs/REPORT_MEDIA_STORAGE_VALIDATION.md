# Report Media Storage Validation

Citizen report images and Staff task-completion evidence now use authenticated multipart uploads. Metadata is stored in `uploads`; bytes are stored under `storage/uploads`; SHA-256, MIME type, size and scan state are recorded.

The live test uploaded a 68-byte PNG, restarted the API, retrieved the report and upload, and matched the on-disk SHA-256 to the database value (`431ced6916a2a21a156e38701afe55bbd7f88969fbbfc56d7fe099d47f265460`). Staff access was denied before assignment and allowed afterward. Supervisor jurisdiction and administrator access passed. Downloads use authenticated endpoints rather than a public storage directory.

Known limitation: image resizing/thumbnails and video evidence are not implemented. Original validated images are stored securely.
