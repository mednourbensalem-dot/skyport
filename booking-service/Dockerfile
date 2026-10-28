FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY booking-service/pom.xml .
COPY booking-service/src ./src
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
