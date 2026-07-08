// ========== SFX ENGINE ==========
const SFX = {
    ctx: null,

    _ctx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    },

    click() {
        const ctx = this._ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 900;
        g.gain.setValueAtTime(0.08, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.04);
    },

    hover() {
        const ctx = this._ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 600;
        g.gain.setValueAtTime(0.03, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.06);
    },

    success() {
        const ctx = this._ctx();
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            const t = ctx.currentTime + i * 0.1;
            g.gain.setValueAtTime(0.1, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            o.connect(g).connect(ctx.destination);
            o.start(t);
            o.stop(t + 0.3);
        });
    },

    toggle() {
        const ctx = this._ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(500, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
        g.gain.setValueAtTime(0.06, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.06);
    },

    error() {
        const ctx = this._ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = 200;
        g.gain.setValueAtTime(0.06, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.15);
    }
};

// ========== WIRE SFX TO DOM ==========
document.addEventListener('DOMContentLoaded', () => {

    // Nav/clicks → click SFX
    document.querySelectorAll('a, .btn, .filter-btn').forEach(el => {
        el.addEventListener('click', () => SFX.click());
    });

    // Hover on nav links + cards + buttons
    document.querySelectorAll('nav a, .btn, .card, .team-card, .module-item, .timeline-item').forEach(el => {
        el.addEventListener('mouseenter', () => SFX.hover());
    });

    // Filter btn active
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            document.querySelectorAll('.module-item').forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.style.display = match ? '' : 'none';
                if (match) {
                    item.style.animation = 'none';
                    item.offsetHeight;
                    item.style.animation = 'fadeIn 0.3s ease both';
                }
            });
            SFX.toggle();
        });
    });

    // Team card stagger
    document.querySelectorAll('.team-card').forEach((card, i) => {
        card.style.animation = `fadeInUp 0.5s ease ${i * 0.08}s both`;
    });

    // Module item stagger
    document.querySelectorAll('.module-item').forEach((item, i) => {
        if (item.style.display !== 'none') {
            item.style.animation = `fadeIn 0.4s ease ${(i % 20) * 0.03}s both`;
        }
    });

    // Timeline stagger
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.style.animationDelay = `${0.1 + i * 0.06}s`;
    });

    // Form submit SFX
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            SFX.click();
        });
    });

    // Success message detection
    if (document.querySelector('.msg-success')) {
        SFX.success();
    }
    if (document.querySelector('.msg-error')) {
        SFX.error();
    }

    // Count pulse on hero
    const count = document.querySelector('.team-count');
    if (count) {
        setInterval(() => {
            count.style.animation = 'none';
            count.offsetHeight;
            count.style.animation = 'countPulse 2s ease infinite';
        }, 4000);
    }

    // Nav link active detection
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === path) {
            a.style.color = 'var(--text)';
        }
    });
});
