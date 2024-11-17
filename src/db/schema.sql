-- Create Polls Table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Options Table
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    option_name VARCHAR(255) NOT NULL,
    vote_count INTEGER DEFAULT 0
);