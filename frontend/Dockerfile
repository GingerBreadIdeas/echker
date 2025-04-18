FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy application files
COPY . .

EXPOSE 5173

# Start the HTTP server
CMD ["http-server", "-p", "5173", "--cors"]