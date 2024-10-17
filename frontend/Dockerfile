FROM node:22.9.0-slim AS frontend-builder

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the dev server
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]