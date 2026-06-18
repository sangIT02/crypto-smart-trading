# Stage 1: Build file .jar bằng Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies trước để cache layer này (tăng tốc độ build các lần sau)
RUN mvn dependency:go-offline

COPY src ./src
# Build project, bỏ qua test để tiết kiệm tài nguyên trên Render
RUN mvn clean package -DskipTests

# Stage 2: Chạy application bằng JRE (nhẹ hơn JDK)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file .jar từ Stage 1 sang Stage 2
COPY --from=build /app/target/*.jar app.jar

# EXPOSE port mặc định
EXPOSE 8080

# Chạy app với các cờ tối ưu RAM cho Render Free Tier (512MB Limit)
ENTRYPOINT ["java", "-Xmx300m", "-Xss512k", "-XX:CICompilerCount=2", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]