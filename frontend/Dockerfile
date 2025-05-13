FROM node:18-alpine

WORKDIR /app

# First copy the package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install app dependencies
RUN npm install

# Copy entrypoint script and make it executable
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Copy rest of the application
COPY . .

# Expose port
EXPOSE 5173

# The entrypoint.sh script will be executed, and CMD will be passed to it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]