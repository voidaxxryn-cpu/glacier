import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'glacier.db')

roles_data = [
    # GUI (6) — User's domain
    ("GUI Designer", "GUI", "Visual design of clickgui panels, layout, spacing, animations"),
    ("GUI Developer", "GUI", "Implement clickgui in C++/JNI, panel rendering, component system"),
    ("HUD Designer", "GUI", "Watermark, array list, potion HUD, keystrokes, CPS display"),
    ("HUD Developer", "GUI", "Render HUD components, scaling, position saving"),
    ("Theme Manager", "GUI", "Tan color scheme, config presets, color editor, theme files"),
    ("Font / Text Renderer", "GUI", "Custom font rendering, glyph caching, text alignment"),
    # Combat (6)
    ("AimAssist Developer", "Combat", "Aim curve, smoothing, randomization, hitbox targeting"),
    ("AutoClicker Developer", "Combat", "CPS patterns, randomization, inventory click detection"),
    ("Reach / Velocity Engineer", "Combat", "Reach manipulation & velocity/horizontal reduction"),
    ("Killaura / SilentAura Developer", "Combat", "Legit aura, target switching, swing timing"),
    ("WTap / BlockHit / Sprint Developer", "Combat", "Movement combat mechanics, sprint reset timing"),
    ("Right Clicker / KeepSprint Developer", "Combat", "Right click automation, sprint retention logic"),
    # Movement (6)
    ("Fly Developer", "Movement", "Glide, motion-based fly, hypixel-compatible modes"),
    ("Timer / NoSlowdown Engineer", "Movement", "Timer manipulation, block/use slowdown removal"),
    ("SafeWalk / Parkour Engineer", "Movement", "Edge detection, shift automation, parkour assist"),
    ("Scaffold Developer", "Movement", "Legit scaffold, tower, sprint scaffold, rotation smoothing"),
    ("Clutch / MLG / Blink Developer", "Movement", "Water clutch, MLG water bucket, blink packet log"),
    ("BackTrack / FakeLag / Freecam Developer", "Movement", "Position backtracking, fake lag, freecam"),
    # Render (6)
    ("ESP Developer", "Render", "Player ESP, item/storage ESP, tracers, box/2D rendering"),
    ("Chams Developer", "Render", "Chams rendering, wall glow, color modes"),
    ("NameTags / Indicators Developer", "Render", "Nametag scaling, target indicators, hurt time"),
    ("HitSelect / Health / Arrows Developer", "Render", "Hit color selection, health bar, arrow trajectory"),
    ("AntiDebuff / Explosions Developer", "Render", "Debuff effect removal visuals, explosion ESP"),
    ("Projectiles / Target Info Developer", "Render", "Projectile trajectory prediction, target info HUD"),
    # Utility (6)
    ("AntiBot Developer", "Utility", "Bot detection, NPC filtering, tab list checking"),
    ("Inventory Manager", "Utility", "ArmorSwitch, ChestSteal, Refill, InvCleaner, AutoHotbar, InvWalk"),
    ("AutoPot / Throw Manager", "Utility", "ThrowDebuff, Throwpot, AutoPearl, AutoFish"),
    ("Xray / Search / HitBoxes Developer", "Utility", "Ore highlighting, block search, hitbox expansion"),
    ("AutoArmor / AutoTool / FastPlace Developer", "Utility", "Auto armor equipping, best tool selection, fast place"),
    ("Macros / Alt Manager / Profiles Developer", "Utility", "Macro system, alt account manager, profile switching"),
    # Core/Misc (6)
    ("Injection Specialist", "Core", "DLL injection, JNI bridge setup, classloader hooks"),
    ("Packet / Network Engineer", "Core", "Packet intercept & modification, event system"),
    ("Anti-Detection Engineer", "Core", "Randomization, bypass testing, signature obfuscation"),
    ("Command System Developer", "Core", "In-game command framework, argument parsing"),
    ("Config / Save System Developer", "Core", "Config save/load, file management, settings serialization"),
    ("Testing & Release Engineer", "Core", "QA, bypass verification, release builds, versioning"),
]

modules_data = [
    # Combat
    ("AimAssist", "Combat", "Smooth aim toward nearest target with configurable speed, distance, and hitbox targeting", "None"),
    ("AutoClicker", "Combat", "Automated left-click with configurable CPS min/max, randomization, and inventory check", "None"),
    ("BlockHit", "Combat", "Auto-block on hit for damage reduction, configurable block chance and timing", "None"),
    ("KeepSprint", "Combat", "Maintain sprint after hitting entity, prevents sprint reset on attack", "None"),
    ("Killaura", "Combat", "Automated attack targeting nearest entity with range, speed, and rotation settings", "None"),
    ("Reach", "Combat", "Extend attack reach distance with configurable values", "None"),
    ("Right Clicker", "Combat", "Automated right-click with configurable CPS for rods, pots, and blocks", "None"),
    ("SilentAura", "Combat", "Legitimate aura with silent rotations, delayed targeting, and natural swing timing", "None"),
    ("Sprint", "Combat", "Auto-sprint and sprint direction management", "None"),
    ("Velocity", "Combat", "Modify horizontal/vertical knockback taken with chance-based reduction", "None"),
    ("WTap", "Combat", "Auto W-tap mechanics for combo advantage, sprint reset on hit", "None"),
    # Render
    ("AntiDebuff", "Render", "Visual removal or reduction of potion debuff effects on screen", "None"),
    ("Arrows", "Render", "Render incoming arrow trajectory predictions on screen", "None"),
    ("Chams", "Render", "Render entities through walls with custom colors and textures", "None"),
    ("ESP", "Render", "Entity highlighting with boxes, 2D, and outline modes", "None"),
    ("Explosions", "Render", "Render explosion radius, TNT/creeper blast range indicators", "None"),
    ("Fullbright", "Render", "Maximum brightness gamma override for dark areas", "None"),
    ("Health", "Render", "Display target health as bar, number, or absorption indicator", "None"),
    ("HitSelect", "Render", "Visual selection color and effect when landing hits on entities", "None"),
    ("Indicators", "Render", "Display target direction, distance, and hurt time indicators on HUD", "None"),
    ("ItemESP", "Render", "Highlight dropped items, experience orbs, and valuable loot through walls", "None"),
    ("NameTags", "Render", "Scale and style player nametags with distance-based sizing", "None"),
    ("Projectiles", "Render", "Predict and render projectile trajectory paths for bows and pots", "None"),
    ("StorageESP", "Render", "Highlight chests, furnaces, hoppers, and storage containers through walls", "None"),
    ("Target Info", "Render", "HUD display of current target's name, health, distance, and equipment", "None"),
    # Utility
    ("Alt Manager", "Utility", "Alt account login and session management with account storage", "None"),
    ("AntiBot", "Utility", "Detect and filter NPCs, bots, and ghost entities from targeting", "None"),
    ("AntiFireball", "Utility", "Detect and evade fireball explosions with automatic movement", "None"),
    ("AutoArmor", "Utility", "Auto equip best armor pieces from inventory based on protection value", "None"),
    ("AutoFish", "Utility", "Automated fishing with bite detection and reel timing", "None"),
    ("AutoHotbar", "Utility", "Auto swap tools, blocks, and items in hotbar slots", "None"),
    ("AutoPearl", "Utility", "Auto throw ender pearl at target location or nearest enemy", "None"),
    ("BackTrack", "Movement", "Record and interpolate player positions for backtrack hits", "None"),
    ("Blink", "Movement", "Queue outgoing packets and send on toggle for lag-like movement", "None"),
    ("ChestSteal", "Utility", "Auto-steal chest contents with customizable steal delay and sorting", "None"),
    ("Clutch", "Movement", "Auto-place blocks below player when falling near ground", "None"),
    ("FakeLag", "Movement", "Artificial packet delay with configurable latency simulation", "None"),
    ("FastPlace", "Utility", "Remove block placement delay for faster building", "None"),
    ("Fly", "Movement", "Creative-like flight with glide, motion, and hypixel modes", "None"),
    ("Freecam", "Movement", "Detach camera from player position for free movement view", "None"),
    ("Friends", "Utility", "Friend list management with color-coded friendly targeting", "None"),
    ("HitBoxes", "Utility", "Expand entity hitbox for easier targeting and hit registration", "None"),
    ("InvCleaner", "Utility", "Auto-clean inventory by dropping trash items based on filter rules", "None"),
    ("InventoryManager", "Utility", "Inventory sorting, organizing, and quick movement", "None"),
    ("InvWalk", "Utility", "Allow walking while inventory is open", "None"),
    ("MLG", "Movement", "Auto place water bucket when falling to negate fall damage", "None"),
    ("Macros", "Utility", "Custom macro binding system for complex key sequences", "None"),
    ("MurdererFinder", "Utility", "Highlight murderer in Murder Mystery with weapon detection", "None"),
    ("NoFall", "Utility", "Negate fall damage via packet manipulation or ground spoof", "None"),
    ("Panic", "Utility", "Disable all modules instantly with a single keybind", "None"),
    ("Parkour", "Movement", "Auto jump at block edges for efficient parkour movement", "None"),
    ("Profiles", "Utility", "Multiple config profiles with quick switching and import/export", "None"),
    ("PropHunt", "Utility", "Highlight hiders and props in Prop Hunt minigame", "None"),
    ("Refill", "Utility", "Auto refill hotbar from inventory when items run low", "None"),
    ("SafeWalk", "Movement", "Auto sneak at block edges to prevent falling", "None"),
    ("Scaffold", "Movement", "Auto place blocks beneath player while walking", "None"),
    ("Search", "Utility", "Search and highlight specific blocks in the world", "None"),
    ("ThrowDebuff", "Utility", "Auto throw splash debuff potions at nearby targets", "None"),
    ("Throwpot", "Utility", "Auto throw buff potions when needed", "None"),
    ("Timer", "Movement", "Modify game tick speed for faster movement and actions", "None"),
    ("Xray", "Utility", "Render only specified ores and valuables through walls", "None"),
    # World
    ("Anti-AFK", "World", "Anti-afk movement and action simulation to prevent kick", "None"),
    ("AutoTool", "World", "Auto switch to best tool for breaking current block", "None"),
    ("Block-In", "World", "Auto enclose player in blocks for protection in bedwars", "None"),
    ("BedBreaker", "World", "Auto break beds in BedWars with efficient tool switching", "None"),
    ("BedPlates", "World", "Place pressure plates on broken bed locations to prevent replacement", "None"),
    # Inventory
    ("ArmorSwitch", "Inventory", "Auto switch armor pieces for best protection values", "None"),
]

timeline_data = [
    (1, "Phase 1 — Injection Foundation", 1, "DLL injection, JNI bridge, classloader hooks, packet interceptors, event system, command framework. Core infrastructure that everything runs on."),
    (1, "ClickGUI Foundation", 2, "Basic panel system, component rendering, window dragging, button and slider elements. First testable UI."),
    (1, "Phase 1 Complete", 3, "Injection working, basic GUI functional, packet system live, command framework ready. Milestone: internal demo."),
    (2, "Phase 2 — Core Modules", 1, "Killaura, AimAssist, AutoClicker, Reach, Velocity, Scaffold, ESP, Chams, NameTags. The modules that define Glacier's daily-driver experience."),
    (2, "HUD & Theme System", 2, "Watermark, array list, keystrokes, CPS display, potion HUD. Theme presets and color editor."),
    (2, "Phase 2 Complete", 3, "All core combat + render modules functional. HUD live with theme support. Milestone: alpha release candidate."),
    (3, "Phase 3 — Expansion", 1, "Movement modules (Fly, Timer, SafeWalk, Blink, Freecam), Utility modules (AntiBot, Inventory, Macros), World modules (BedBreaker, AutoTool). Broadening Glacier's capability."),
    (3, "Config & Profiles", 2, "Save/load system, profile switching, import/export. Alt manager, friends list."),
    (3, "Phase 3 Complete", 3, "Full feature suite implemented. Config system stable. 60+ modules operational. Milestone: beta release."),
    (4, "Phase 4 — Anti-Detection & Release", 1, "Bypass testing across servers (Hypixel, Minemen, etc.). Randomization passes, signature obfuscation, packet normalization."),
    (4, "Testing & Bug Fixes", 2, "Full QA pass, edge case handling, crash fixes, performance optimization. Release build preparation."),
    (4, "Glacier Launch", 3, "Public release. Version 1.0. Documentation, distribution, community setup."),
]

def seed():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r') as f:
        c.executescript(f.read())

    c.execute("DELETE FROM roles")
    c.execute("DELETE FROM modules")
    c.execute("DELETE FROM timeline_events")

    for name, category, desc in roles_data:
        c.execute("INSERT INTO roles (name, category, description) VALUES (?, ?, ?)", (name, category, desc))

    for name, category, desc, keybind in modules_data:
        c.execute("INSERT INTO modules (name, category, description, keybind) VALUES (?, ?, ?, ?)", (name, category, desc, keybind))

    for phase, title, order_idx, desc in timeline_data:
        c.execute("INSERT INTO timeline_events (phase, title, order_index, description) VALUES (?, ?, ?, ?)", (phase, title, order_idx, desc))

    conn.commit()
    conn.close()
    print(f"Seeded {len(roles_data)} roles, {len(modules_data)} modules, {len(timeline_data)} timeline events")

if __name__ == "__main__":
    seed()
