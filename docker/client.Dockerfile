# Meant to be built with the repo root as build context; pass this path via Railway's "Dockerfile Path" setting (docker/client.Dockerfile)

# Use an official Node runtime as the base image
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY apps/OpenSign/package*.json ./

# Install application dependencies
RUN npm install

# Copy the current directory contents into the container
COPY apps/OpenSign/ .
COPY apps/OpenSign/.husky .
COPY apps/OpenSign/entrypoint.sh .

# make the entrypoint.sh file executable
RUN chmod +x entrypoint.sh

# React/Vite bakes REACT_APP_* vars into the bundle at build time, but Railway
# only injects service variables at container runtime, not into `docker build`.
# Accept them as build args (set as service Variables in Railway; they are
# forwarded automatically as build args of the same name) so the built bundle
# actually matches this deployment's server APP_ID/URL instead of silently
# falling back to defaults that won't match the server.
ARG REACT_APP_APPID
ARG REACT_APP_SERVERURL
ARG REACT_APP_GTM
ENV REACT_APP_APPID=${REACT_APP_APPID}
ENV REACT_APP_SERVERURL=${REACT_APP_SERVERURL}
ENV REACT_APP_GTM=${REACT_APP_GTM}

# Define environment variables if needed
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
# build
RUN npm run build

# Inject env.js loader into index.html
RUN sed -i '/<head>/a\<script src="/env.js"></script>' build/index.html

# Make port 3000 available to the world outside this container
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

# Run the application
CMD ["npm", "start"]
