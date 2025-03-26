# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port Gunicorn will run on
EXPOSE 8010

# Set environment variables (optional defaults)
ENV GUNICORN_WORKERS=4
ENV GUNICORN_TIMEOUT=30

# Command to run Gunicorn
CMD ["sh", "-c", "gunicorn --workers $GUNICORN_WORKERS --timeout $GUNICORN_TIMEOUT --bind 0.0.0.0:8010 app:app"]