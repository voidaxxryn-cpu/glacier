import sqlite3
import os
from flask import Flask, g, render_template, request, redirect, url_for

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(16).hex())

# On Vercel the filesystem is read-only except /tmp
if os.environ.get('VERCEL'):
    DB_PATH = '/tmp/glacier.db'
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), 'glacier.db')

LEAD_MC = "xynvordat"
LEAD_DISCORD = "nyvordat"
LEAD_ROLES = [
    "GUI Designer", "GUI Developer", "HUD Designer",
    "HUD Developer", "Theme Manager", "Font / Text Renderer"
]

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
        g.db.execute("PRAGMA foreign_keys=ON")
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r') as f:
        c.executescript(f.read())

    from seed_data import roles_data, modules_data, timeline_data

    for name, category, desc in roles_data:
        c.execute("INSERT INTO roles (name, category, description) VALUES (?, ?, ?)", (name, category, desc))

    for name, category, desc, keybind in modules_data:
        c.execute("INSERT INTO modules (name, category, description, keybind) VALUES (?, ?, ?, ?)", (name, category, desc, keybind))

    for phase, title, order_idx, desc in timeline_data:
        c.execute("INSERT INTO timeline_events (phase, title, order_index, description) VALUES (?, ?, ?, ?)", (phase, title, order_idx, desc))

    c.execute("INSERT INTO team_members (minecraft_username, discord_tag) VALUES (?, ?)", (LEAD_MC, LEAD_DISCORD))
    lead_id = c.lastrowid
    for role_name in LEAD_ROLES:
        c.execute("UPDATE roles SET assigned_to = ? WHERE name = ? AND assigned_to IS NULL", (lead_id, role_name))

    conn.commit()
    conn.close()

@app.before_request
def ensure_db():
    if not os.path.exists(DB_PATH):
        init_db()

@app.context_processor
def inject_globals():
    db = get_db()
    count = db.execute("SELECT COUNT(*) FROM team_members").fetchone()[0]
    return dict(team_count=count)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    db = get_db()
    count = db.execute("SELECT COUNT(*) FROM team_members").fetchone()[0]

    if count >= 6:
        return render_template("register.html", error=None, success=None)

    available = db.execute(
        "SELECT id, name, category FROM roles WHERE assigned_to IS NULL ORDER BY category, name"
    ).fetchall()

    if request.method == "POST":
        mc = request.form.get("minecraft_username", "").strip()
        discord = request.form.get("discord_tag", "").strip()

        if not mc or not discord:
            return render_template("register.html", error="All fields required.", success=None, available_roles=available)

        existing = db.execute(
            "SELECT COUNT(*) FROM team_members WHERE minecraft_username = ? OR discord_tag = ?",
            (mc, discord)
        ).fetchone()[0]
        if existing:
            return render_template("register.html", error="Username or Discord already registered.", success=None, available_roles=available)

        selected = set()
        for i in range(6):
            rid = request.form.get(f"role_{i}")
            if rid:
                selected.add(int(rid))

        if len(selected) != 6:
            return render_template("register.html", error="You must select exactly 6 distinct roles.", success=None, available_roles=available)

        placeholders = ",".join("?" for _ in selected)
        taken = db.execute(
            f"SELECT id FROM roles WHERE id IN ({placeholders}) AND assigned_to IS NOT NULL",
            list(selected)
        ).fetchall()
        if taken:
            return render_template("register.html", error="Some roles were already taken. Please pick again.", success=None, available_roles=available)

        cur = db.execute("INSERT INTO team_members (minecraft_username, discord_tag) VALUES (?, ?)", (mc, discord))
        member_id = cur.lastrowid
        for rid in selected:
            db.execute("UPDATE roles SET assigned_to = ? WHERE id = ?", (member_id, rid))
        db.commit()

        new_count = db.execute("SELECT COUNT(*) FROM team_members").fetchone()[0]
        if new_count >= 6:
            return redirect(url_for("team"))
        return render_template("register.html", success="Registered! Welcome to Glacier.", available_roles=available)

    return render_template("register.html", available_roles=available, error=None, success=None)

@app.route("/team")
def team():
    db = get_db()
    members = db.execute("SELECT * FROM team_members ORDER BY id").fetchall()
    team_data = []
    for m in members:
        roles = db.execute(
            "SELECT name, category FROM roles WHERE assigned_to = ? ORDER BY category, name", (m["id"],)
        ).fetchall()
        team_data.append({
            "minecraft_username": m["minecraft_username"],
            "discord_tag": m["discord_tag"],
            "roles": [dict(r) for r in roles]
        })
    return render_template("team.html", team=team_data)

@app.route("/modules")
def modules():
    db = get_db()
    rows = db.execute("""
        SELECT m.*, t.minecraft_username AS assignee_name
        FROM modules m
        LEFT JOIN team_members t ON m.assigned_to = t.id
        ORDER BY m.category, m.name
    """).fetchall()

    cats = db.execute("SELECT DISTINCT category FROM modules ORDER BY category").fetchall()

    module_list = []
    for r in rows:
        d = dict(r)
        d["status_class"] = {"Planned": "planned", "In Progress": "progress", "Complete": "complete"}.get(d["status"], "planned")
        d["assigned_to"] = d["assignee_name"] or ""
        module_list.append(d)

    return render_template("modules.html", modules=module_list, categories=[c["category"] for c in cats])

@app.route("/roadmap")
def roadmap():
    db = get_db()
    events = db.execute("SELECT * FROM timeline_events ORDER BY phase, order_index").fetchall()
    tl = {1: [], 2: [], 3: [], 4: []}
    for e in events:
        tl[e["phase"]].append(dict(e))
    return render_template("roadmap.html", timeline=tl)

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        init_db()
    app.run(debug=True, port=5000)
