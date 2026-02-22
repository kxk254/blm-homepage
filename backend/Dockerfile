# Use official nginx image as base
FROM nginx:stable-alpine

# Copy your custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (optional, for documentation)
EXPOSE 80

# Start nginx in the foreground (default command in nginx image)
CMD ["nginx", "-g", "daemon off;"]