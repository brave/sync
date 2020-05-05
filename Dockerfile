FROM node:alpine

# Prepare application 
RUN mkdir -p /app

# Add source code to container
COPY ./ /app

# Change workdir to applications folder
WORKDIR /app

# Install brave-sync's dependencies
RUN yarn install \
	&& yarn run build

# Expose default port
EXPOSE 4000

# Populate config dir as volume to persist changes
VOLUME /app/server/config

# Define container command
CMD ["/usr/local/bin/yarn", "run", "start"] 

