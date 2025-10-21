# Dev-friendly image
FROM node:20-alpine AS base
WORKDIR /app

# install deps first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm ci

# copy source
COPY . .

# build stage for production images
FROM base AS build
RUN npm run build

# minimal prod image (not used by dev compose; useful later)
FROM node:20-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
