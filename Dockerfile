# Dev-friendly image
FROM node:20-alpine AS base
WORKDIR /app

# install deps first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm ci

# copy source
COPY . .

FROM base AS build
RUN npm run build

