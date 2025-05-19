-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create children table
CREATE TABLE children (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create characters table
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    model_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    character_id INTEGER REFERENCES characters(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_session_id INTEGER REFERENCES chat_sessions(id),
    message_text TEXT NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'bot')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_analytics table
CREATE TABLE chat_analytics (
    id SERIAL PRIMARY KEY,
    chat_session_id INTEGER REFERENCES chat_sessions(id),
    word_count INTEGER,
    sentiment_score FLOAT,
    topic_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default characters
INSERT INTO characters (name, description, model_name, image_url) VALUES
    ('Luna', 'The Star Fairy', 'luna:latest', '/images/Luna.png'),
    ('Gogo', 'The Adventure Guide', 'gogo:latest', '/images/Gogo.png'),
    ('Dodo', 'The Wise Owl', 'dodo:latest', '/images/Dodo.png'),
    ('Captain Leo', 'The Brave Explorer', 'leo:latest', '/images/captain_leo.png');

-- Create indexes
CREATE INDEX idx_chat_sessions_child_id ON chat_sessions(child_id);
CREATE INDEX idx_chat_sessions_character_id ON chat_sessions(character_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX idx_chat_analytics_session_id ON chat_analytics(chat_session_id); 