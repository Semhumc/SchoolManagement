FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# csproj'u kopyala ve restore et
COPY school_management.csproj ./
RUN dotnet restore "school_management.csproj"

# tüm kodları kopyala
COPY . .

# build et
RUN dotnet build "school_management.csproj" -c Release -o /app/build

# publish
FROM build AS publish
RUN dotnet publish "school_management.csproj" -c Release -o /app/publish /p:UseAppHost=false

# runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "school_management.dll"]
