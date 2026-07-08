import { SEED_ROLES, SEED_MODULES, SEED_TIMELINE, LEAD_ROLES, LEAD_MC, LEAD_DISCORD } from './seed';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'glacier.json');
const useKv = !!process.env.KV_URL;

let kv;
if (useKv) {
  kv = require('@vercel/kv').kv;
}

function getDefaultState() {
  return {
    members: [
      {
        id: 1,
        minecraft_username: LEAD_MC,
        discord_tag: LEAD_DISCORD,
        roles_completed: [],
        roles: LEAD_ROLES,
      },
    ],
    roles: SEED_ROLES.map((r, i) => ({ ...r, id: i + 1, assigned_to: LEAD_ROLES.includes(r.name) ? 1 : null })),
    modules: SEED_MODULES.map((m, i) => ({ ...m, id: i + 1, status: 'Planned', keybind: 'None', assigned_to: null })),
    timeline: SEED_TIMELINE.map((t, i) => ({ ...t, id: i + 1 })),
    next_member_id: 2,
  };
}

// === JSON FILE STORE ===
function readJson() {
  if (!fs.existsSync(DATA_FILE)) {
    const state = getDefaultState();
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
    return state;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeJson(state) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

// === KV STORE ===
const KV_KEY = 'glacier';

async function readKv() {
  const data = await kv.get(KV_KEY);
  if (!data) {
    const state = getDefaultState();
    await kv.set(KV_KEY, state);
    return state;
  }
  return data;
}

async function writeKv(state) {
  await kv.set(KV_KEY, state);
}

// === PUBLIC API ===
export async function getState() {
  if (useKv) return readKv();
  return readJson();
}

async function saveState(state) {
  if (useKv) await writeKv(state);
  else writeJson(state);
}

export async function getTeam() {
  const state = await getState();
  return state.members.map((m) => ({
    ...m,
    is_done: m.roles_completed.length >= 6,
    helping: m.roles_completed.length >= 6,
    remaining: m.roles.filter((r) => !m.roles_completed.includes(r)),
  }));
}

export async function getTeamCount() {
  const state = await getState();
  return state.members.length;
}

export async function getRoles() {
  const state = await getState();
  return state.roles.map((r) => ({
    ...r,
    assigned_name: r.assigned_to
      ? state.members.find((m) => m.id === r.assigned_to)?.minecraft_username || null
      : null,
  }));
}

export async function getAvailableRoles() {
  const state = await getState();
  return state.roles.filter((r) => r.assigned_to === null);
}

export async function addMember(mc, discord, roleIds) {
  const state = await getState();
  const id = state.next_member_id;

  const roleNames = state.roles
    .filter((r) => roleIds.includes(r.id))
    .map((r) => r.name);

  state.members.push({
    id,
    minecraft_username: mc,
    discord_tag: discord,
    roles: roleNames,
    roles_completed: [],
  });

  state.roles.forEach((r) => {
    if (roleIds.includes(r.id)) r.assigned_to = id;
  });

  state.next_member_id = id + 1;
  await saveState(state);
  return id;
}

export async function markRoleComplete(memberId, roleName) {
  const state = await getState();
  const member = state.members.find((m) => m.id === memberId);
  if (member && !member.roles_completed.includes(roleName)) {
    member.roles_completed.push(roleName);
  }
  await saveState(state);
}

export async function getModules() {
  const state = await getState();
  return state.modules.map((m) => ({
    ...m,
    assigned_name: m.assigned_to
      ? state.members.find((mem) => mem.id === m.assigned_to)?.minecraft_username || null
      : null,
  }));
}

export async function getTimeline() {
  const state = await getState();
  const grouped = { 1: [], 2: [], 3: [], 4: [] };
  state.timeline.forEach((t) => {
    if (grouped[t.phase]) grouped[t.phase].push(t);
  });
  return grouped;
}

export async function getNeedsHelp() {
  const state = await getState();
  const allRoles = state.roles;
  const unfinished = allRoles.filter((r) => !r.assigned_to);
  return {
    open_roles: unfinished.length,
    members_helping: state.members.filter((m) => m.roles_completed.length >= 6),
    open_role_names: unfinished.map((r) => r.name),
  };
}
