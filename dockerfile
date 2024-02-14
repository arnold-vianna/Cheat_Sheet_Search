# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Copy the Flask app code into the container
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable for the virtual environment
ENV VIRTUAL_ENV /app/venv
ENV PATH "$VIRTUAL_ENV/bin:$PATH"

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Use Gunicorn as the WSGI server
CMD ["gunicorn", "-w", "4", "app:app", "-b", "0.0.0.0:5000"]

