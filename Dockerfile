FROM node:18-alpine
WORKDIR /app

# Install Backend Dependencies
COPY api/package*.json ./api/
RUN npm install --prefix api

# Install Frontend Dependencies
COPY client/package*.json ./client/
RUN npm install --prefix client

# Install Root Dependencies
COPY package*.json ./
RUN npm install

# Copy all code
COPY . .

EXPOSE 5173 3001
CMD ["npx", "concurrently", "npm:dev --prefix client", "npm:dev --prefix api"]
