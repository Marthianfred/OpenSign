# Docker (Railway deployment)

Railway builds one Dockerfile per service and does not support `docker-compose.yml` directly. This folder holds a per-service Dockerfile so the same source of truth can be used for local `docker compose up` (via the root `docker-compose.yml`, which now builds from these files) and for Railway.

All Dockerfiles assume **repo root as the build context** (COPY paths are relative to the repo root, e.g. `apps/OpenSign/...`). When creating a Railway service, set:
- **Root Directory / build context:** repo root (leave default, do not scope to a subfolder)
- **Dockerfile Path:** the path below, relative to repo root

## client.Dockerfile — WaveSign client (React/Vite)

- Dockerfile Path: `docker/client.Dockerfile`
- Exposed port: `3000`
- Required env vars (see `.env.example` / `.env.local_dev`):
  - `PUBLIC_URL`
  - `REACT_APP_SERVERURL`
  - `REACT_APP_APPID` (must match the server's `APP_ID` — leave as `opensign` unless you also change it on the server)
  - `GENERATE_SOURCEMAP` (optional, defaults to `false`)
  - `REACT_APP_GTM` (optional)

## server.Dockerfile — WaveSign server (Node/Parse)

- Dockerfile Path: `docker/server.Dockerfile`
- Exposed port: `8080`
- Includes a LibreOffice install step (needed for DOCX to PDF conversion).
- Required env vars (see `.env.example` / `.env.local_dev`):
  - `APP_ID` (must match the client's `REACT_APP_APPID`)
  - `appName`
  - `MASTER_KEY`
  - `MONGODB_URI`
  - `PARSE_MOUNT`
  - `SERVER_URL`
  - `PUBLIC_URL`
  - Storage (S3 / DigitalOcean Spaces compatible): `DO_SPACE`, `DO_ENDPOINT`, `DO_BASEURL`, `DO_ACCESS_KEY_ID`, `DO_SECRET_ACCESS_KEY`, `DO_REGION` — or set `USE_LOCAL=true` to use local disk storage instead
  - Email (the app will not initialize unless one path is fully set): either `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_SENDER`, or `SMTP_ENABLE=true` with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER_EMAIL`, `SMTP_PASS`
  - `PFX_BASE64` and `PASS_PHRASE` (document signing certificate, optional but needed for PDF signing certificates)

## mongo.Dockerfile — MongoDB

- Dockerfile Path: `docker/mongo.Dockerfile`
- Exposed port: `27017` (MongoDB default)
- This is a straight port of `apps/mongo/Dockerfile` (just `FROM mongo:latest`) for Railway parity. **On Railway, prefer provisioning a Railway-managed MongoDB plugin instead** — it's simpler than running your own container and gives you a ready-made `MONGODB_URI`.

## Caddyfile

Copied from the repo root `Caddyfile` for parity with `docker-compose.yml`. **Optional on Railway** — Railway provides its own per-service public domains and HTTPS termination, so you generally don't need a reverse proxy in front of the client/server services. Only use this if you specifically want a single external hostname routing to both `client` and `server` yourself.

## Notes

- `docker-compose.yml` at the repo root now builds `server` and `client` from `docker/server.Dockerfile` and `docker/client.Dockerfile` (context: repo root), so local dev and Railway build from the same Dockerfiles.
- `mongo` in `docker-compose.yml` still uses the public `mongo:latest` image directly (the Dockerfile has no meaningful customization over it); `docker/mongo.Dockerfile` exists only for Railway parity.
