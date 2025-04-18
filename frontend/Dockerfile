FROM node:18-alpine

WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy all files to the container
COPY . .

EXPOSE 5173

# Start the HTTP server
CMD ["http-server", ".", "-p", "5173", "--cors", "-a", "0.0.0.0"]