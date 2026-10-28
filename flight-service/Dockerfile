FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY flight-service/pom.xml .
COPY flight-service/src ./src
COPY proto ./src/main/proto
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
