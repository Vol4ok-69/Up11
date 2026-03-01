FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Up11.Api/Up11.Api.csproj Up11.Api/
RUN dotnet restore Up11.Api/Up11.Api.csproj

COPY Up11.Api/ Up11.Api/

WORKDIR /src/Up11.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Up11.Api.dll"]
