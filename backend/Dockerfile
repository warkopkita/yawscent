# ==============================================================================
# YAWSCENT INDONESIA - BACKEND API ENGINE DOCKERFILE
# ==============================================================================
FROM node:20-alpine

LABEL maintainer="yawscent indonesia <dev@yawscent.id>"
LABEL description="Omnichannel Perfume REST API Engine"

WORKDIR /app

# Set timezone Asia/Jakarta
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    echo "Asia/Jakarta" > /etc/timezone

# Copy package definitions
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev --silent

# Copy source code and Prisma schema
COPY . .

# Environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Expose API port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

# Launch backend API engine
CMD ["node", "src/server.js"]
