# build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/AlvaresWeb.API/AlvaresWeb.API.csproj src/AlvaresWeb.API/
RUN dotnet restore "src/AlvaresWeb.API/AlvaresWeb.API.csproj"

COPY src/ ./src/
WORKDIR /src/src/AlvaresWeb.API
RUN dotnet publish -c Release -o /app/publish

# runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AlvaresWeb.API.dll"]
