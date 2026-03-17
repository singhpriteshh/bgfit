# ========================
# Base stage (common deps)
# ========================
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install

# Copy all project files
COPY . .

# ========================
# Builder stage
# ========================
FROM base AS builder

# Set build-time env for Vite
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production-ready static files
RUN npm run build

# ========================
# Development stage
# ========================
FROM base AS development

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ========================
# Production stage
# ========================
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]