# ==============================================================================
# YAWSCENT INDONESIA - WEB FRONTEND & UNIFIED SERVER DOCKERFILE
# ==============================================================================
FROM node:20-alpine

LABEL maintainer="yawscent indonesia <dev@yawscent.id>"
LABEL description="Web Storefront, Scent Finder, VIP Loyalty & Omnichannel Admin"

WORKDIR /app

# Install curl / wget for healthcheck if needed (wget is built-in in alpine)
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    echo "Asia/Jakarta" > /etc/timezone

# Copy dependency definition
COPY package*.json ./

# Install production dependencies
RUN if [ -f package.json ]; then npm install --omit=dev --silent; fi

# Copy source code and assets
COPY . .

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Expose web port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Launch application
CMD ["node", "server.js"]
