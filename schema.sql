CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    minecraft_username TEXT NOT NULL,
    discord_tag TEXT NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    FOREIGN KEY (assigned_to) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Planned',
    keybind TEXT DEFAULT 'None',
    assigned_to INTEGER,
    FOREIGN KEY (assigned_to) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER
);
