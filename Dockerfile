# Use an appropriate base image (node)
FROM node:14

# Set the working directory (working dir, app)
WORKDIR /app

# Copy package.json and package-lock.json and install node dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Python dependencies
COPY /requirements.txt /app/
RUN pip3 install -r /app/requirements.txt

# Create files directory
RUN mkdir -p /app/pictures
RUN chmod -R 777 /app/pictures

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]
