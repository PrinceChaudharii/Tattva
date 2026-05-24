-- Tattva — Database initialization script
-- Runs on first PostgreSQL container start via docker-entrypoint-initdb.d

-- Create application databases for different environments
CREATE DATABASE tattva_test;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tattva_test TO tattva;

-- Enable useful extensions
\c tattva;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent";    -- For accent-insensitive search

\c tattva_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
