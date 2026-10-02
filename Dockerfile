# ==============================================================================
# Multi-Stage Production Dockerfile for Smart Traveler Prediction on Render
# Stage 1: Build React 3D Frontend
# Stage 2: Install Node.js Backend Production Dependencies
# Stage 3: Python 3.11 Runtime + Node.js Runner for Full-Stack Service
# ==============================================================================

# --- Stage 1: Frontend Build ---
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --no-audit

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Backend Dependencies ---
FROM node:20-bookworm-slim AS backend-deps
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev --no-audit

# --- Stage 3: Final Production Image ---
FROM python:3.11-slim-bookworm

# Install Node.js, curl, and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Setup Python AI Service & Dependencies
COPY ai-service/requirements.txt ./ai-service/
RUN pip install --no-cache-dir -r ./ai-service/requirements.txt

COPY ai-service/ ./ai-service/
COPY models/ ./models/
COPY data/ ./data/

# 2. Setup Node.js Express Backend
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# 3. Mount Built React Frontend into Backend Public Directory
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# 4. Entrypoint Startup Script
COPY start.sh ./start.sh
RUN sed -i 's/\r$//' ./start.sh && chmod +x ./start.sh

# Environment settings
ENV PORT=10000
ENV NODE_ENV=production
ENV AI_SERVICE_URL=http://127.0.0.1:8000
ENV PYTHONUNBUFFERED=1

EXPOSE 10000

CMD ["./start.sh"]
