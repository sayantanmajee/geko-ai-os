-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector; -- Ready for RAG later

-- ==========================================
-- 1. USERS & IDENTITY
-- ==========================================

-- Enum to track how a user signed up (Future-proofing for OAuth)
DO $$ BEGIN
    CREATE TYPE auth_provider_enum AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Nullable for OAuth users
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    
    -- Auth Metadata
    auth_provider auth_provider_enum DEFAULT 'EMAIL' NOT NULL,
    provider_id VARCHAR(255), -- Stores Google/GitHub User ID
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. AUDIT TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();