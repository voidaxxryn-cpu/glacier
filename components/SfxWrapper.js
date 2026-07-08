'use client';
import { useEffect } from 'react';

function getAudioCtx() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function play(type) {
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g).connect(ctx.destination);

    if (type === 'click') {
      o.type = 'sine'; o.frequency.value = 900;
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      o.start(); o.stop(ctx.currentTime + 0.04);
    } else if (type === 'hover') {
      o.type = 'sine'; o.frequency.value = 600;
      g.gain.setValueAtTime(0.03, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      o.start(); o.stop(ctx.currentTime + 0.06);
    } else if (type === 'success') {
      [523, 659, 784].forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sine'; o2.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        g2.gain.setValueAtTime(0.1, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o2.connect(g2).connect(ctx.destination);
        o2.start(t); o2.stop(t + 0.3);
      });
    } else if (type === 'toggle') {
      o.type = 'sine';
      o.frequency.setValueAtTime(500, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      o.start(); o.stop(ctx.currentTime + 0.06);
    } else if (type === 'error') {
      o.type = 'sawtooth'; o.frequency.value = 200;
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.start(); o.stop(ctx.currentTime + 0.15);
    }
  } catch {}
}

export default function SfxWrapper() {
  useEffect(() => {
    const click = (e) => {
      if (e.target.closest('a, .btn, .filter-btn, button')) play('click');
    };
    const hover = (e) => {
      if (e.target.closest('nav a, .btn, .card, .team-card, .module-item, .timeline-item')) play('hover');
    };

    document.addEventListener('click', click);
    document.addEventListener('mouseenter', hover, true);

    const msg = document.querySelector('.msg-success');
    if (msg) play('success');
    const err = document.querySelector('.msg-error');
    if (err) play('error');

    return () => {
      document.removeEventListener('click', click);
      document.removeEventListener('mouseenter', hover, true);
    };
  }, []);

  return null;
}
