-- Initialize ARIOT IoT Database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schema for ARIOT
CREATE SCHEMA IF NOT EXISTS ariot;

-- Set default schema
SET search_path TO ariot, public;

-- Create initial tables (example)
-- The actual schema will be created by Spring Boot/JPA migrations

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA ariot TO ariot_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ariot TO ariot_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ariot TO ariot_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA ariot GRANT ALL ON TABLES TO ariot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA ariot GRANT ALL ON SEQUENCES TO ariot_user;
