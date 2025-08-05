# Use Java 21 base image
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy all files into the container
COPY . .

# Build the project with Maven Wrapper (skip tests for speed)
RUN ./mvnw clean install -DskipTests

# Run the Spring Boot app
CMD ["java", "-jar", "target/airline-management-0.0.1-SNAPSHOT.jar"]
