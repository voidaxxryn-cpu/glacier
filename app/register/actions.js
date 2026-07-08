'use server';
import { getTeamCount, getAvailableRoles, addMember } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export async function registerMember(formData) {
  const mc = formData.get('minecraft_username')?.trim();
  const discord = formData.get('discord_tag')?.trim();

  if (!mc || !discord) return { error: 'All fields required.' };

  const count = await getTeamCount();
  if (count >= 6) return { error: 'Team is already full.' };

  const roleIds = [];
  for (let i = 0; i < 6; i++) {
    const val = formData.get(`role_${i}`);
    if (val) roleIds.push(parseInt(val));
  }

  if (roleIds.length !== 6) return { error: 'Select exactly 6 distinct roles.' };

  const available = await getAvailableRoles();
  const availableIds = new Set(available.map((r) => r.id));
  for (const id of roleIds) {
    if (!availableIds.has(id)) return { error: 'Some roles were already taken.' };
  }

  await addMember(mc, discord, roleIds);
  revalidatePath('/');
  revalidatePath('/team');
  revalidatePath('/register');
  revalidatePath('/modules');

  const newCount = await getTeamCount();
  if (newCount >= 6) return { redirect: '/team' };
  return { success: 'Registered! Welcome to Glacier.' };
}
