import { useState, useEffect, useRef } from "react";

const API = "https://mds-novatech.onrender.com";

const injectAssets = () => {
  if (!document.getElementById("fa-cdn")) {
    const l = document.createElement("link");
    l.id = "fa-cdn"; l.rel = "stylesheet";
    l.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(l);
  }
  if (!document.getElementById("gfonts")) {
    const l = document.createElement("link");
    l.id = "gfonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(l);
  }
};

const LIGHT = {
  "--bg":"#f5f7ff","--bg2":"#eef1fb","--bg3":"#e6eaf8",
  "--card":"#ffffff","--border":"#dde2f0",
  "--text":"#1a2540","--text2":"#4a5578","--gray":"#64748b",
};
const DARK = {
  "--bg":"#070d1a","--bg2":"#0d1829","--bg3":"#111f35",
  "--card":"#0d1829","--border":"#1e3a5f",
  "--text":"#f0f4ff","--text2":"#8a9bc0","--gray":"#8a9bc0",
};

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
*, *::before, *::after { -webkit-user-select: none; user-select: none; }
input, textarea { -webkit-user-select: text !important; user-select: text !important; }
:root {
  --blue: #1a3a8f; --blue-l: #2a52c9; --blue-g: #3a6fff;
  --green: #2ea312; --green-l: #3ecb18;
  --bg: #f5f7ff; --bg2: #eef1fb; --bg3: #e6eaf8;
  --card: #ffffff; --border: #dde2f0;
  --gray: #64748b; --dark: #0f1e3d;
  --text: #1a2540; --text2: #4a5578;
}
html, body { height: 100%; overflow: hidden; background: var(--bg); }
body { color: var(--text); font-family: 'DM Sans', sans-serif; transition: background 0.3s; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--blue-l); border-radius: 2px; }

.nav {
  position: fixed; top: 14px; left: 14px; right: 14px; z-index: 100;
  height: 60px; padding: 0 20px;
  display: flex; align-items: center; justify-content: space-between;
  background: var(--card); backdrop-filter: blur(20px);
  border: 1px solid var(--border); border-radius: 100px;
  box-shadow: 0 4px 24px rgba(26,58,143,0.1);
  transition: background 0.3s, border-color 0.3s;
}
.logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-l), var(--green));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #fff; font-size: 1rem;
  overflow: hidden; flex-shrink: 0;
}
.logo-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--text); transition: color 0.3s; }
.logo-name span { color: var(--green); }
.nav-links { display: flex; gap: 2px; list-style: none; align-items: center; }
.nav-links button {
  background: none; border: none; cursor: pointer;
  color: var(--gray); font-family: 'DM Sans', sans-serif; font-size: 0.86rem; font-weight: 500;
  padding: 8px 13px; border-radius: 100px;
  display: flex; align-items: center; gap: 6px; transition: all 0.2s;
}
.nav-links button:hover { color: var(--text); background: var(--bg3); }
.nav-links button.active { color: var(--blue-l); background: rgba(42,82,201,0.08); font-weight: 600; }
.nav-links button.cta { background: linear-gradient(135deg, var(--blue-l), var(--blue-g)); color: #fff; margin-left: 6px; box-shadow: 0 4px 14px rgba(42,82,201,0.25); }
.nav-links button.cta:hover { opacity: 0.9; transform: translateY(-1px); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.theme-toggle { display: flex; align-items: center; gap: 7px; }
.t-icon { font-size: 0.82rem; color: var(--gray); transition: color 0.3s; }
.t-icon.active { color: var(--blue-l); }
.toggle-track {
  width: 42px; height: 23px; border-radius: 100px;
  background: var(--bg3); border: 1.5px solid var(--border);
  position: relative; cursor: pointer;
  transition: background 0.35s, border-color 0.35s; flex-shrink: 0;
}
.toggle-track.dark { background: #1a3a8f; border-color: rgba(58,111,255,0.5); }
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 17px; height: 17px; border-radius: 50%;
  background: white; box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s;
}
.toggle-track.dark .toggle-thumb { transform: translateX(19px); background: var(--blue-g); }
.hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; flex-direction: column; gap: 5px; }
.hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }
.mob-menu {
  display: none; position: fixed; top: 84px; left: 14px; right: 14px; z-index: 99;
  background: var(--card); backdrop-filter: blur(20px);
  padding: 16px; border: 1px solid var(--border);
  border-radius: 24px; flex-direction: column; gap: 4px;
  box-shadow: 0 8px 32px rgba(26,58,143,0.12); transition: background 0.3s;
}
.mob-menu.open { display: flex; }
.mob-menu button {
  background: none; border: none; cursor: pointer;
  color: var(--gray); font-family: 'DM Sans', sans-serif; font-size: 0.97rem;
  padding: 12px 14px; border-radius: 12px; text-align: left;
  display: flex; align-items: center; gap: 10px; transition: all 0.2s;
}
.mob-menu button:hover, .mob-menu button.active { color: var(--text); background: var(--bg3); }
.mob-menu-divider { height: 1px; background: var(--border); margin: 6px 0; }

.pages { position: fixed; top: 88px; left: 0; right: 0; bottom: 0; overflow: hidden; }
.page {
  position: absolute; inset: 0; overflow-y: auto;
  padding: 0 56px 60px;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.32s ease, transform 0.32s ease;
  pointer-events: none; background: var(--bg);
}
.page.active { opacity: 1; transform: translateY(0); pointer-events: all; }

.home-hero { min-height: calc(100vh - 88px); display: flex; align-items: center; position: relative; overflow: hidden; }
.hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 70% 60% at 75% 50%, rgba(42,82,201,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 10% 80%, rgba(46,163,18,0.06) 0%, transparent 50%);
}
.hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 56px 56px; opacity: 0.5;
}
.hero-body { position: relative; z-index: 1; max-width: 640px; }
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(46,163,18,0.08); border: 1px solid rgba(46,163,18,0.25);
  border-radius: 100px; padding: 5px 15px;
  font-size: 0.76rem; font-weight: 600; color: var(--green); margin-bottom: 26px;
  animation: up 0.5s ease both;
}
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
.hero-body h1 {
  font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;
  font-size: clamp(2.4rem, 4.5vw, 3.8rem); line-height: 1.1; margin-bottom: 20px;
  color: var(--text); animation: up 0.5s 0.08s ease both; transition: color 0.3s;
}
.hero-body h1 .b { color: var(--blue-l); }
.hero-body h1 .g { color: var(--green); }
.hero-desc { color: var(--text2); font-size: 1rem; line-height: 1.7; max-width: 490px; margin-bottom: 34px; animation: up 0.5s 0.16s ease both; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; animation: up 0.5s 0.24s ease both; }
.hero-stats { position: absolute; right: 0; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 14px; animation: up 0.5s 0.32s ease both; }
.stat { background: var(--card); border: 1px solid var(--border); border-radius: 15px; padding: 20px 24px; text-align: center; min-width: 144px; box-shadow: 0 4px 20px rgba(26,58,143,0.07); transition: transform 0.3s, background 0.3s; }
.stat:hover { transform: translateX(-5px); }
.stat-n { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.9rem; font-weight: 800; background: linear-gradient(135deg, var(--blue-l), var(--green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-l { font-size: 0.73rem; color: var(--gray); margin-top: 3px; }

.home-sections { padding-top: 20px; }
.home-about { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding: 80px 0; border-top: 1px solid var(--border); }
.about-text h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2rem; font-weight: 800; color: var(--text); margin-bottom: 14px; }
.about-text p { color: var(--text2); line-height: 1.75; font-size: 0.95rem; margin-bottom: 12px; }
.about-cards { display: flex; flex-direction: column; gap: 13px; }
.about-card { display: flex; align-items: center; gap: 14px; background: var(--card); border-radius: 14px; padding: 17px 19px; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(26,58,143,0.05); transition: all 0.2s; }
.about-card:hover { border-color: rgba(42,82,201,0.3); box-shadow: 0 4px 18px rgba(42,82,201,0.1); transform: translateY(-2px); }
.about-card-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.about-card h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.about-card p { font-size: 0.8rem; color: var(--gray); }

.page-hero { padding: 52px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 40px; position: relative; overflow: hidden; }
.page-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 100% at 85% 50%, rgba(42,82,201,0.05) 0%, transparent 70%); pointer-events: none; }
.page-hero-inner { position: relative; z-index: 1; }
.page-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); margin-bottom: 12px; }
.page-tag::before { content: ''; width: 16px; height: 2px; background: var(--green); border-radius: 1px; }
.page-hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 800; color: var(--text); margin-bottom: 10px; }
.page-hero p { color: var(--text2); font-size: 0.96rem; line-height: 1.7; max-width: 520px; }

.btn { border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; border-radius: 100px; padding: 12px 24px; display: inline-flex; align-items: center; gap: 7px; transition: all 0.25s; }
.btn-blue { background: linear-gradient(135deg, var(--blue-l), var(--blue-g)); color: #fff; box-shadow: 0 5px 20px rgba(42,82,201,0.22); }
.btn-blue:hover { transform: translateY(-2px); box-shadow: 0 9px 28px rgba(42,82,201,0.32); }
.btn-blue:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-outline { background: var(--card); border: 1px solid var(--border); color: var(--text); box-shadow: 0 2px 8px rgba(26,58,143,0.06); }
.btn-outline:hover { background: var(--bg2); border-color: rgba(42,82,201,0.3); }
.btn-green { background: linear-gradient(135deg, var(--green), var(--green-l)); color: #fff; box-shadow: 0 5px 20px rgba(46,163,18,0.2); }
.btn-green:hover { transform: translateY(-2px); }
.btn-green:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-full { width: 100%; justify-content: center; }

/* Alert messages */
.alert { padding: 12px 16px; border-radius: 10px; font-size: 0.88rem; margin-top: 12px; display: flex; align-items: center; gap: 8px; }
.alert-success { background: rgba(46,163,18,0.1); border: 1px solid rgba(46,163,18,0.25); color: var(--green); }
.alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; }

.svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.svc-panel { border-radius: 20px; padding: 36px; border: 1px solid var(--border); background: var(--card); box-shadow: 0 4px 20px rgba(26,58,143,0.06); transition: transform 0.3s, box-shadow 0.3s, background 0.3s; }
.svc-panel:hover { transform: translateY(-4px); box-shadow: 0 10px 36px rgba(26,58,143,0.12); }
.svc-panel.tech { border-top: 3px solid var(--blue-l); }
.svc-panel.agri { border-top: 3px solid var(--green); }
.svc-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin-bottom: 20px; }
.tech .svc-icon { background: rgba(42,82,201,0.1); color: var(--blue-l); }
.agri .svc-icon { background: rgba(46,163,18,0.1); color: var(--green); }
.svc-panel h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--text); margin-bottom: 10px; }
.svc-panel p { color: var(--text2); font-size: 0.88rem; line-height: 1.7; margin-bottom: 20px; }
.svc-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.svc-list li { display: flex; align-items: center; gap: 9px; font-size: 0.86rem; color: var(--text); }
.tech .svc-list li i { color: var(--blue-l); font-size: 0.72rem; }
.agri .svc-list li i { color: var(--green); font-size: 0.72rem; }

.news-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; flex-wrap: wrap; gap: 12px; }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.news-card { background: var(--card); border-radius: 16px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; box-shadow: 0 2px 12px rgba(26,58,143,0.05); transition: transform 0.3s, box-shadow 0.3s, background 0.3s; }
.news-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(42,82,201,0.12); }
.news-thumb { height: 150px; display: flex; align-items: center; justify-content: center; font-size: 2.6rem; }
.news-thumb.t { background: linear-gradient(135deg, rgba(42,82,201,0.12), rgba(58,111,255,0.06)); }
.news-thumb.a { background: linear-gradient(135deg, rgba(46,163,18,0.12), rgba(62,203,24,0.06)); }
.news-thumb.c { background: linear-gradient(135deg, rgba(42,82,201,0.08), rgba(46,163,18,0.08)); }
.news-body { padding: 20px; }
.cat { display: inline-flex; align-items: center; gap: 5px; font-size: 0.69rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; padding: 3px 9px; border-radius: 5px; margin-bottom: 8px; }
.cat.tc { color: var(--blue-l); background: rgba(42,82,201,0.08); }
.cat.ag { color: var(--green); background: rgba(46,163,18,0.08); }
.cat.co { color: #d97706; background: rgba(217,119,6,0.08); }
.news-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 8px; line-height: 1.4; }
.news-excerpt { color: var(--text2); font-size: 0.82rem; line-height: 1.6; }
.news-date { color: var(--gray); font-size: 0.75rem; margin-top: 12px; display: flex; align-items: center; gap: 5px; }

/* Newsletter modal */
.newsletter-modal { background: var(--card); border-radius: 20px; padding: 32px; max-width: 420px; width: 100%; border: 1px solid var(--border); position: relative; box-shadow: 0 20px 60px rgba(26,58,143,0.18); }
.newsletter-modal h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.newsletter-modal p { color: var(--text2); font-size: 0.86rem; margin-bottom: 20px; }

.jobs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px; }
.job-card { background: var(--card); border-radius: 15px; padding: 24px; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(26,58,143,0.05); display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; transition: all 0.3s; }
.job-card:hover { border-color: rgba(42,82,201,0.3); box-shadow: 0 6px 24px rgba(42,82,201,0.1); transform: translateY(-2px); }
.job-dept { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue-l); margin-bottom: 6px; display: flex; align-items: center; gap: 5px; }
.job-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 9px; }
.job-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.jtag { font-size: 0.7rem; padding: 3px 8px; border-radius: 5px; background: var(--bg2); color: var(--gray); border: 1px solid var(--border); }

.form-box { background: var(--card); border-radius: 20px; padding: 38px; border: 1px solid var(--border); max-width: 680px; box-shadow: 0 4px 20px rgba(26,58,143,0.06); transition: background 0.3s; }
.form-box h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.35rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.form-box .sub { color: var(--text2); font-size: 0.88rem; margin-bottom: 26px; }
.frow { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-bottom: 13px; }
.fg { display: flex; flex-direction: column; gap: 6px; margin-bottom: 13px; }
.fg label { font-size: 0.81rem; color: var(--gray); font-weight: 500; display: flex; align-items: center; gap: 6px; }
.fg input, .fg textarea { background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; }
.fg input:focus, .fg textarea:focus { border-color: var(--blue-l); box-shadow: 0 0 0 3px rgba(42,82,201,0.1); }
.fg textarea { resize: vertical; min-height: 110px; }
.upload { border: 2px dashed var(--border); border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 13px; background: var(--bg); }
.upload:hover { border-color: var(--blue-l); background: rgba(42,82,201,0.03); }
.upload i { font-size: 1.7rem; color: var(--gray); display: block; margin-bottom: 7px; }
.upload p { color: var(--gray); font-size: 0.83rem; }
.upload span { color: var(--blue-l); font-weight: 600; }

.custom-select-wrap { position: relative; }
.custom-select-trigger { background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: border-color 0.2s, box-shadow 0.2s; user-select: none; }
.custom-select-trigger:hover { border-color: rgba(42,82,201,0.4); }
.custom-select-trigger.open { border-color: var(--blue-l); box-shadow: 0 0 0 3px rgba(42,82,201,0.1); border-radius: 10px 10px 0 0; }
.custom-select-trigger i { color: var(--gray); font-size: 0.8rem; transition: transform 0.2s; }
.custom-select-trigger.open i { transform: rotate(180deg); }
.custom-select-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 50; background: var(--card); border: 1.5px solid var(--blue-l); border-top: none; border-radius: 0 0 10px 10px; box-shadow: 0 8px 24px rgba(42,82,201,0.15); overflow: hidden; }
.custom-select-option { padding: 10px 14px; font-size: 0.88rem; color: var(--text); cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
.custom-select-option:hover { background: var(--bg2); }
.custom-select-option.selected { background: rgba(42,82,201,0.07); color: var(--blue-l); font-weight: 600; }
.custom-select-option i { color: var(--gray); font-size: 0.82rem; width: 14px; }
.custom-select-option.selected i { color: var(--blue-l); }

.partner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
.benefits { display: flex; flex-direction: column; gap: 13px; margin-top: 26px; }
.benefit { display: flex; gap: 13px; align-items: flex-start; background: var(--card); border-radius: 14px; padding: 17px; border: 1px solid var(--border); box-shadow: 0 2px 10px rgba(26,58,143,0.05); transition: all 0.3s; }
.benefit:hover { border-color: rgba(46,163,18,0.3); box-shadow: 0 5px 18px rgba(46,163,18,0.1); transform: translateY(-2px); }
.ben-icon { width: 40px; height: 40px; border-radius: 11px; background: rgba(46,163,18,0.1); color: var(--green); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.ben-text h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.ben-text p { color: var(--text2); font-size: 0.81rem; line-height: 1.5; }

.contact-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: 50px; align-items: start; }
.contact-cards { display: flex; flex-direction: column; gap: 14px; margin-top: 26px; }
.ccard { display: flex; gap: 13px; align-items: center; }
.ccard-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(42,82,201,0.08); border: 1px solid rgba(42,82,201,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.05rem; color: var(--blue-l); flex-shrink: 0; }
.ccard-lbl { font-size: 0.79rem; color: var(--gray); }
.ccard-val { font-size: 0.91rem; font-weight: 500; color: var(--text); }

.promo-layout { display: grid; grid-template-columns: 340px 1fr; gap: 56px; align-items: start; }
.promo-card { background: var(--card); border-radius: 24px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(26,58,143,0.1); position: sticky; top: 20px; }
.promo-photo-wrap { position: relative; width: 100%; height: 320px; overflow: hidden; }
.promo-photo-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.promo-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(15,30,61,0.85) 100%); }
.promo-photo-name { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; }
.promo-photo-name h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.promo-photo-name span { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.12); border-radius: 100px; padding: 4px 12px; }
.promo-card-body { padding: 20px; }
.promo-quote { background: linear-gradient(135deg, rgba(42,82,201,0.06), rgba(46,163,18,0.06)); border-left: 3px solid var(--blue-l); border-radius: 0 12px 12px 0; padding: 14px 16px; margin-bottom: 16px; }
.promo-quote p { font-style: italic; font-size: 0.88rem; color: var(--text2); line-height: 1.6; }
.promo-quote cite { display: block; margin-top: 8px; font-size: 0.75rem; color: var(--blue-l); font-weight: 600; font-style: normal; }
.promo-socials { display: flex; gap: 8px; }
.promo-soc { width: 36px; height: 36px; border-radius: 10px; background: var(--bg2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: var(--gray); cursor: pointer; transition: all 0.2s; text-decoration: none; }
.promo-soc:hover { background: rgba(42,82,201,0.1); border-color: rgba(42,82,201,0.3); color: var(--blue-l); }
.promo-content { display: flex; flex-direction: column; gap: 28px; }
.promo-section { background: var(--card); border-radius: 20px; padding: 28px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(26,58,143,0.05); }
.promo-section-title { display: flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 800; color: var(--text); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.promo-section-title i { color: var(--blue-l); font-size: 0.95rem; }
.promo-bio { color: var(--text2); font-size: 0.92rem; line-height: 1.85; }
.promo-bio p { margin-bottom: 12px; }
.promo-bio p:last-child { margin-bottom: 0; }
.promo-mots { background: linear-gradient(135deg, rgba(42,82,201,0.04), rgba(46,163,18,0.04)); border-radius: 16px; padding: 28px; border: 1px solid var(--border); position: relative; overflow: hidden; }
.promo-mots::before { content: '"'; position: absolute; top: -10px; left: 16px; font-size: 8rem; color: rgba(42,82,201,0.07); font-family: Georgia, serif; line-height: 1; pointer-events: none; }
.promo-mots p { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--text); line-height: 1.6; font-style: italic; position: relative; z-index: 1; }
.promo-mots cite { display: flex; align-items: center; gap: 8px; margin-top: 14px; font-size: 0.82rem; color: var(--blue-l); font-weight: 600; font-style: normal; position: relative; z-index: 1; }
.promo-mots cite::before { content: ''; width: 24px; height: 2px; background: var(--blue-l); border-radius: 1px; }
.promo-timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 16px; position: relative; }
.timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 19px; top: 40px; bottom: -8px; width: 2px; background: var(--border); }
.timeline-dot { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; border: 2px solid var(--border); background: var(--card); color: var(--blue-l); z-index: 1; }
.timeline-body { padding-bottom: 24px; flex: 1; }
.timeline-year { font-size: 0.72rem; font-weight: 700; color: var(--blue-l); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px; }
.timeline-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.92rem; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.timeline-desc { font-size: 0.82rem; color: var(--text2); line-height: 1.5; }

.legal-content { max-width: 760px; }
.legal-section { margin-bottom: 36px; }
.legal-section h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.legal-section h3 i { color: var(--blue-l); font-size: 0.95rem; }
.legal-section p { color: var(--text2); font-size: 0.9rem; line-height: 1.8; margin-bottom: 8px; }
.legal-section ul { list-style: none; display: flex; flex-direction: column; gap: 7px; padding-left: 4px; }
.legal-section ul li { color: var(--text2); font-size: 0.9rem; display: flex; align-items: flex-start; gap: 8px; }
.legal-section ul li i { color: var(--blue-l); font-size: 0.72rem; margin-top: 4px; flex-shrink: 0; }
.legal-alert { background: rgba(42,82,201,0.06); border: 1px solid rgba(42,82,201,0.18); border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: flex-start; gap: 12px; color: var(--text2); font-size: 0.88rem; line-height: 1.6; }
.legal-alert i { color: var(--blue-l); font-size: 1rem; margin-top: 2px; flex-shrink: 0; }

.footer { background: #070d1a; border-top: 1px solid rgba(255,255,255,0.07); padding: 48px 56px 26px; }
.footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 38px; }
.footer-desc { color: rgba(255,255,255,0.45); font-size: 0.84rem; line-height: 1.7; max-width: 250px; margin-top: 13px; }
.footer-logo-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; color: #fff; }
.footer-logo-name span { color: var(--green-l); }
.footer-col h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.86rem; font-weight: 700; margin-bottom: 13px; color: rgba(255,255,255,0.9); }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.footer-col ul button { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 0.84rem; display: flex; align-items: center; gap: 7px; padding: 0; transition: color 0.2s; }
.footer-col ul button:hover { color: #fff; }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.3); font-size: 0.79rem; flex-wrap: wrap; gap: 12px; }
.socials { display: flex; gap: 9px; }
.soc { width: 33px; height: 33px; border-radius: 8px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.2s; text-decoration: none; }
.soc:hover { background: rgba(42,82,201,0.4); border-color: rgba(42,82,201,0.5); color: #fff; }

.overlay { position: fixed; inset: 0; z-index: 200; background: rgba(15,30,61,0.55); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--card); border-radius: 20px; padding: 36px; max-width: 460px; width: 100%; border: 1px solid var(--border); position: relative; box-shadow: 0 20px 60px rgba(26,58,143,0.18); }
.modal h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--text); margin-bottom: 5px; }
.modal .sub { color: var(--text2); font-size: 0.86rem; margin-bottom: 20px; }
.modal-x { position: absolute; top: 13px; right: 13px; background: var(--bg2); border: 1px solid var(--border); color: var(--gray); width: 28px; height: 28px; border-radius: 7px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-x:hover { background: var(--bg3); color: var(--text); }
.success { text-align: center; padding: 16px 0; color: var(--green); }
.success i { font-size: 2.8rem; margin-bottom: 10px; display: block; }
.success strong { color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; }

@keyframes up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) {
  .hero-stats { display: none; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .promo-layout { grid-template-columns: 1fr; }
  .promo-card { position: static; }
}
@media (max-width: 768px) {
  .nav { top: 10px; left: 10px; right: 10px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .pages { top: 84px; }
  .page { padding: 0 20px 50px; }
  .footer { padding: 40px 20px 22px; }
  .svc-grid, .news-grid, .partner-grid, .contact-layout, .home-about { grid-template-columns: 1fr; }
  .jobs-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .hero-btns { flex-direction: column; }
  .hero-btns .btn { justify-content: center; }
  .frow { grid-template-columns: 1fr; }
  .form-box { padding: 22px 16px; }
  .job-card { flex-direction: column; }
  .modal { padding: 24px 16px; }
}
@media (max-width: 480px) {
  .footer-top { grid-template-columns: 1fr; }
  .news-grid { grid-template-columns: 1fr; }
}
`;

const PAGES_LIST = ["accueil","services","actualites","recrutement","partenariats","contact","promoteur","mentions","confidentialite","cgu"];

const NAV = [
  { id:"accueil",       icon:"fa-house",      label:"Accueil" },
  { id:"services",      icon:"fa-briefcase",  label:"Services" },
  { id:"actualites",    icon:"fa-newspaper",  label:"Actualités" },
  { id:"recrutement",   icon:"fa-users",      label:"Recrutement" },
  { id:"partenariats",  icon:"fa-handshake",  label:"Partenariats" },
];

const JOBS = [
  { dept:"Informatique", icon:"fa-code",          title:"Développeur Full Stack",       type:"CDI", mode:"Présentiel", skills:"React · Node.js" },
  { dept:"Informatique", icon:"fa-network-wired", title:"Technicien Réseau & Sécurité", type:"CDI", mode:"Terrain",    skills:"Cisco · Linux" },
  { dept:"Agriculture",  icon:"fa-seedling",       title:"Ingénieur Agronome",            type:"CDI", mode:"Terrain",    skills:"Prod. végétale" },
  { dept:"Commercial",   icon:"fa-chart-line",     title:"Chargé(e) de Clientèle",       type:"CDI", mode:"Hybride",    skills:"B2B · Vente" },
];

const NEWS_DATA = [
  { t:"t", cat:"tc", cl:"Informatique", ic:"fa-microchip", em:"🚀", title:"Lancement de notre plateforme cloud nouvelle génération",   ex:"MDS NovaTech dévoile une solution cloud innovante pour les PME.", date:"2 Juin 2026" },
  { t:"a", cat:"ag", cl:"Agriculture",  ic:"fa-leaf",      em:"🌿", title:"Saison des pluies : optimisez vos cultures dès maintenant", ex:"Les meilleures pratiques agricoles pour maximiser vos rendements.", date:"28 Mai 2026" },
  { t:"c", cat:"co", cl:"Entreprise",   ic:"fa-trophy",    em:"🏆", title:"MDS NovaTech remporte le Prix de l'Innovation 2026",        ex:"Distingués au palmarès national des entreprises innovantes.", date:"15 Mai 2026" },
];

const PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face";

function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const current = options.find(o => o.value === value) || options[0];
  return (
    <div className="custom-select-wrap" ref={ref}>
      <div className={`custom-select-trigger${open?" open":""}`} onClick={() => setOpen(!open)}>
        <span style={{display:"flex",alignItems:"center",gap:8}}>
          <i className={`fa-solid ${current.icon}`} style={{color:"var(--gray)",fontSize:"0.82rem",width:14}}/>
          {current.label}
        </span>
        <i className="fa-solid fa-chevron-down"/>
      </div>
      {open && (
        <div className="custom-select-dropdown">
          {options.map(o => (
            <div key={o.value} className={`custom-select-option${value===o.value?" selected":""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <i className={`fa-solid ${o.icon}`}/>{o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FG({ label, icon, children }) {
  return (
    <div className="fg">
      <label><i className={`fa-solid ${icon}`}/> {label}</label>
      {children}
    </div>
  );
}

function PH({ tag, ticon, title, sub }) {
  return (
    <div className="page-hero">
      <div className="page-hero-inner">
        <div className="page-tag"><i className={`fa-solid ${ticon}`}/> {tag}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

function Alert({ type, msg }) {
  if (!msg) return null;
  return (
    <div className={`alert alert-${type}`}>
      <i className={`fa-solid ${type==="success"?"fa-circle-check":"fa-circle-exclamation"}`}/>
      {msg}
    </div>
  );
}

function HomePage({ nav }) {
  return (
    <div>
      <div className="home-hero">
        <div className="hero-bg"/><div className="hero-grid"/>
        <div className="hero-body">
          <div className="badge"><span className="dot"/> Innovation · Technologie · Agriculture</div>
          <h1>Solutions <span className="b">Digitales</span> &<br/>Excellence <span className="g">Agricole</span></h1>
          <p className="hero-desc">MDS NovaTech propulse votre entreprise avec des solutions informatiques de pointe et des services agricoles performants. Deux expertises, une vision : votre réussite.</p>
          <div className="hero-btns">
            <button className="btn btn-blue" onClick={()=>nav("services")}><i className="fa-solid fa-rocket"/> Nos services</button>
            <button className="btn btn-outline" onClick={()=>nav("contact")}><i className="fa-solid fa-envelope"/> Nous contacter</button>
          </div>
        </div>
        <div className="hero-stats">
          {[["150+","Clients satisfaits"],["8","Années d'expérience"],["2","Secteurs expertise"]].map(([n,l])=>(
            <div className="stat" key={l}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="home-sections">
        <div className="home-about">
          <div className="about-text">
            <div className="page-tag" style={{marginBottom:12}}><i className="fa-solid fa-circle-info"/> À propos</div>
            <h2>Qui sommes-nous ?</h2>
            <p>MDS NovaTech est une entreprise dynamique spécialisée dans deux secteurs complémentaires : l'informatique & digital et l'agriculture.</p>
            <p>Notre équipe pluridisciplinaire combine expertise technique et connaissance du terrain pour offrir des solutions concrètes et durables.</p>
            <button className="btn btn-blue" style={{marginTop:18}} onClick={()=>nav("services")}><i className="fa-solid fa-arrow-right"/> Voir nos services</button>
          </div>
          <div className="about-cards">
            {[
              {icon:"fa-laptop-code",   bg:"rgba(42,82,201,0.1)",  col:"var(--blue-l)", title:"Expertise Tech",   desc:"Solutions numériques complètes pour votre entreprise"},
              {icon:"fa-wheat-awn",     bg:"rgba(46,163,18,0.1)",  col:"var(--green)",  title:"Savoir Agricole",  desc:"Accompagnement terrain et conseil en production"},
              {icon:"fa-users",         bg:"rgba(217,119,6,0.1)",  col:"#d97706",       title:"Équipe Dédiée",    desc:"Des professionnels passionnés à votre service"},
              {icon:"fa-shield-halved", bg:"rgba(42,82,201,0.08)", col:"var(--blue-l)", title:"Fiabilité",        desc:"Partenaire de confiance depuis plus de 8 ans"},
            ].map(c=>(
              <div className="about-card" key={c.title}>
                <div className="about-card-icon" style={{background:c.bg,color:c.col}}><i className={`fa-solid ${c.icon}`}/></div>
                <div><h4>{c.title}</h4><p>{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesPage() {
  const tech = ["Développement web & applications mobiles","Infrastructure réseau & cloud","Cybersécurité & protection des données","Maintenance et support technique","Conseil et audit informatique"];
  const agri = ["Conseil en production végétale","Gestion et suivi d'exploitations","Fourniture d'intrants agricoles","Formation et encadrement terrain","Études de sol et fertilisation"];
  return (
    <div>
      <PH tag="Ce que nous faisons" ticon="fa-briefcase" title="Nos Domaines d'Expertise" sub="Des solutions adaptées à vos besoins, que vous soyez dans le numérique ou l'agriculture."/>
      <div className="svc-grid">
        <div className="svc-panel tech">
          <div className="svc-icon"><i className="fa-solid fa-laptop-code"/></div>
          <h3>Informatique & Digital</h3>
          <p>Solutions technologiques complètes pour moderniser votre activité et accélérer votre transformation numérique.</p>
          <ul className="svc-list">{tech.map(s=><li key={s}><i className="fa-solid fa-circle-check"/>{s}</li>)}</ul>
        </div>
        <div className="svc-panel agri">
          <div className="svc-icon"><i className="fa-solid fa-wheat-awn"/></div>
          <h3>Agriculture & Élevage</h3>
          <p>Accompagnement expert pour optimiser vos rendements et développer une activité agricole durable et rentable.</p>
          <ul className="svc-list">{agri.map(s=><li key={s}><i className="fa-solid fa-circle-check"/>{s}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function ActualitesPage() {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const handleAbonner = async () => {
    if (!email) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/api/abonner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMsg(data.message);
      setMsgType(data.success ? "success" : "error");
      if (data.success) setEmail("");
    } catch {
      setMsg("Erreur — réessayez plus tard.");
      setMsgType("error");
    }
    setSending(false);
  };

  return (
    <div>
      <PH tag="Notre blog" ticon="fa-newspaper" title="Actualités & Informations" sub="Restez informé des dernières nouvelles de MDS NovaTech."/>
      <div className="news-bar">
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Tout","Informatique","Agriculture","Entreprise"].map(f=>(
            <button key={f} className="btn btn-outline" style={{padding:"7px 14px",fontSize:"0.81rem"}}>{f}</button>
          ))}
        </div>
        <button className="btn btn-blue" style={{fontSize:"0.81rem"}} onClick={()=>setShowNewsletter(true)}>
          <i className="fa-solid fa-rss"/> S'abonner
        </button>
      </div>
      <div className="news-grid">
        {NEWS_DATA.map(n=>(
          <div className="news-card" key={n.title}>
            <div className={`news-thumb ${n.t}`}>{n.em}</div>
            <div className="news-body">
              <span className={`cat ${n.cat}`}><i className={`fa-solid ${n.ic}`}/>{n.cl}</span>
              <h3 className="news-title">{n.title}</h3>
              <p className="news-excerpt">{n.ex}</p>
              <p className="news-date"><i className="fa-regular fa-calendar"/>{n.date}</p>
            </div>
          </div>
        ))}
      </div>

      {showNewsletter && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowNewsletter(false)}>
          <div className="newsletter-modal">
            <button className="modal-x" onClick={()=>setShowNewsletter(false)}><i className="fa-solid fa-xmark"/></button>
            <h3><i className="fa-solid fa-rss" style={{color:"var(--blue-l)",marginRight:8}}/>Newsletter MDS NovaTech</h3>
            <p>Recevez nos dernières actualités directement dans votre boîte mail.</p>
            <FG label="Votre email" icon="fa-envelope">
              <input type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </FG>
            <button className="btn btn-blue btn-full" onClick={handleAbonner} disabled={sending}>
              <i className="fa-solid fa-paper-plane"/>{sending ? "Envoi..." : "S'abonner"}
            </button>
            <Alert type={msgType} msg={msg}/>
          </div>
        </div>
      )}
    </div>
  );
}

function RecrutementPage({ openModal }) {
  const [domaine, setDomaine] = useState("info");
  const [form, setForm] = useState({ nom:"", prenom:"", email:"", telephone:"", motivation:"" });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const domaineOpts = [
    {value:"info",  icon:"fa-laptop-code", label:"Informatique & Digital"},
    {value:"agri",  icon:"fa-wheat-awn",   label:"Agriculture"},
    {value:"comm",  icon:"fa-chart-line",  label:"Commercial"},
    {value:"admin", icon:"fa-building",    label:"Administration"},
  ];

  const handleCandidature = async () => {
    if (!form.nom || !form.prenom || !form.email) {
      setMsg("Veuillez remplir les champs obligatoires."); setMsgType("error"); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/api/candidature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, poste: "Candidature spontanée", domaine })
      });
      const data = await res.json();
      setMsg(data.message);
      setMsgType(data.success ? "success" : "error");
      if (data.success) setForm({ nom:"", prenom:"", email:"", telephone:"", motivation:"" });
    } catch {
      setMsg("Erreur — réessayez plus tard."); setMsgType("error");
    }
    setSending(false);
  };

  return (
    <div>
      <PH tag="Rejoignez-nous" ticon="fa-users" title="Recrutement" sub="Nous recherchons des talents passionnés pour renforcer nos équipes."/>
      <div className="jobs-grid">
        {JOBS.map(j=>(
          <div className="job-card" key={j.title}>
            <div style={{flex:1}}>
              <div className="job-dept"><i className={`fa-solid ${j.icon}`}/>{j.dept}</div>
              <div className="job-title">{j.title}</div>
              <div className="job-tags">
                <span className="jtag"><i className="fa-solid fa-file-contract" style={{fontSize:"0.62rem"}}/>{j.type}</span>
                <span className="jtag"><i className="fa-solid fa-location-dot" style={{fontSize:"0.62rem"}}/>{j.mode}</span>
                <span className="jtag">{j.skills}</span>
              </div>
            </div>
            <button className="btn btn-blue" style={{flexShrink:0,padding:"9px 16px",fontSize:"0.82rem"}} onClick={()=>openModal(j.title)}>
              <i className="fa-solid fa-paper-plane"/>Postuler
            </button>
          </div>
        ))}
      </div>
      <div className="form-box">
        <h3><i className="fa-solid fa-envelope-open-text" style={{color:"var(--blue-l)",marginRight:9}}/>Candidature Spontanée</h3>
        <p className="sub">Vous ne trouvez pas votre poste ? Envoyez-nous votre dossier.</p>
        <div className="frow">
          <FG label="Prénom *" icon="fa-user"><input type="text" placeholder="Votre prénom" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})}/></FG>
          <FG label="Nom *" icon="fa-user"><input type="text" placeholder="Votre nom" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/></FG>
        </div>
        <div className="frow">
          <FG label="Email *" icon="fa-envelope"><input type="email" placeholder="votre@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FG>
          <FG label="Téléphone" icon="fa-phone"><input type="tel" placeholder="+XXX XX XX XX XX" value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})}/></FG>
        </div>
        <FG label="Domaine souhaité" icon="fa-briefcase">
          <CustomSelect options={domaineOpts} value={domaine} onChange={setDomaine}/>
        </FG>
        <FG label="Lettre de motivation" icon="fa-pen">
          <textarea placeholder="Parlez-nous de vous..." value={form.motivation} onChange={e=>setForm({...form,motivation:e.target.value})}/>
        </FG>
        <div className="upload"><i className="fa-solid fa-cloud-arrow-up"/><p><span>Cliquez pour joindre votre CV</span></p></div>
        <button className="btn btn-blue btn-full" onClick={handleCandidature} disabled={sending}>
          <i className="fa-solid fa-paper-plane"/>{sending ? "Envoi en cours..." : "Envoyer ma candidature"}
        </button>
        <Alert type={msgType} msg={msg}/>
      </div>
    </div>
  );
}

function PartenariatsPage() {
  const [type, setType] = useState("comm");
  const [form, setForm] = useState({ organisation:"", contact:"", email:"", proposition:"" });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const typeOpts = [
    {value:"comm",  icon:"fa-store",            label:"Partenariat commercial"},
    {value:"tech",  icon:"fa-microchip",        label:"Partenariat technologique"},
    {value:"inst",  icon:"fa-building-columns", label:"Partenariat institutionnel"},
    {value:"inv",   icon:"fa-chart-line",       label:"Investissement"},
    {value:"autre", icon:"fa-ellipsis",         label:"Autre"},
  ];

  const handlePartner = async () => {
    if (!form.organisation || !form.email) {
      setMsg("Veuillez remplir les champs obligatoires."); setMsgType("error"); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.contact,
          email: form.email,
          service: `Partenariat — ${typeOpts.find(t=>t.value===type)?.label}`,
          message: `Organisation: ${form.organisation}\n\n${form.proposition}`
        })
      });
      const data = await res.json();
      setMsg(data.success ? "Proposition envoyée ! Nous vous contacterons sous 48h." : data.message);
      setMsgType(data.success ? "success" : "error");
      if (data.success) setForm({ organisation:"", contact:"", email:"", proposition:"" });
    } catch {
      setMsg("Erreur — réessayez plus tard."); setMsgType("error");
    }
    setSending(false);
  };

  return (
    <div>
      <PH tag="Collaborons" ticon="fa-handshake" title="Partenariats Stratégiques" sub="Que vous soyez une institution, ONG, entreprise ou investisseur — construisons l'avenir ensemble."/>
      <div className="partner-grid">
        <div>
          <p style={{color:"var(--text2)",fontSize:"0.93rem",lineHeight:1.75,marginBottom:8}}>Nous croyons en la force des alliances stratégiques pour créer de la valeur durable.</p>
          <div className="benefits">
            {[
              {icon:"fa-store",            title:"Partenariat Commercial",     desc:"Développez votre réseau et accédez à notre base de clients."},
              {icon:"fa-microchip",        title:"Partenariat Technologique",  desc:"Intégrez vos solutions ou co-développez des produits innovants."},
              {icon:"fa-building-columns", title:"Partenariat Institutionnel", desc:"Rejoignez nos projets à fort impact social."},
              {icon:"fa-chart-line",       title:"Investissement",             desc:"Participez à notre croissance et expansion régionale."},
            ].map(b=>(
              <div className="benefit" key={b.title}>
                <div className="ben-icon"><i className={`fa-solid ${b.icon}`}/></div>
                <div className="ben-text"><h4>{b.title}</h4><p>{b.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-box" style={{margin:0}}>
          <h3><i className="fa-solid fa-handshake" style={{color:"var(--green)",marginRight:9}}/>Proposer un Partenariat</h3>
          <p className="sub">Notre équipe vous contactera sous 48h.</p>
          <FG label="Nom de l'organisation *" icon="fa-building"><input type="text" placeholder="Votre entreprise" value={form.organisation} onChange={e=>setForm({...form,organisation:e.target.value})}/></FG>
          <div className="frow">
            <FG label="Contact" icon="fa-user"><input type="text" placeholder="Nom & prénom" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/></FG>
            <FG label="Email *" icon="fa-envelope"><input type="email" placeholder="contact@org.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FG>
          </div>
          <FG label="Type de partenariat" icon="fa-tags">
            <CustomSelect options={typeOpts} value={type} onChange={setType}/>
          </FG>
          <FG label="Votre proposition" icon="fa-pen-to-square">
            <textarea placeholder="Présentez votre organisation et votre proposition..." value={form.proposition} onChange={e=>setForm({...form,proposition:e.target.value})}/>
          </FG>
          <button className="btn btn-green btn-full" onClick={handlePartner} disabled={sending}>
            <i className="fa-solid fa-paper-plane"/>{sending ? "Envoi en cours..." : "Envoyer la proposition"}
          </button>
          <Alert type={msgType} msg={msg}/>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [service, setService] = useState("info");
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", message:"" });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const serviceOpts = [
    {value:"info",  icon:"fa-laptop-code", label:"Informatique & Digital"},
    {value:"agri",  icon:"fa-wheat-awn",   label:"Agriculture"},
    {value:"recr",  icon:"fa-users",       label:"Recrutement"},
    {value:"part",  icon:"fa-handshake",   label:"Partenariat"},
    {value:"autre", icon:"fa-ellipsis",    label:"Autre"},
  ];

  const handleContact = async () => {
    if (!form.nom || !form.email || !form.message) {
      setMsg("Veuillez remplir les champs obligatoires."); setMsgType("error"); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: `${form.prenom} ${form.nom}`,
          email: form.email,
          service: serviceOpts.find(s=>s.value===service)?.label,
          message: form.message
        })
      });
      const data = await res.json();
      setMsg(data.message);
      setMsgType(data.success ? "success" : "error");
      if (data.success) setForm({ prenom:"", nom:"", email:"", message:"" });
    } catch {
      setMsg("Erreur — réessayez plus tard."); setMsgType("error");
    }
    setSending(false);
  };

  return (
    <div>
      <PH tag="Parlons-nous" ticon="fa-headset" title="Contactez-Nous" sub="Notre équipe est disponible pour répondre à toutes vos questions."/>
      <div className="contact-layout">
        <div>
          <p style={{color:"var(--text2)",fontSize:"0.93rem",lineHeight:1.75,marginBottom:4}}>Vous avez un projet ou une question ? N'hésitez pas à nous écrire.</p>
          <div className="contact-cards">
            {[
              {icon:"fa-location-dot", lbl:"Adresse",   val:"Siège social MDS NovaTech"},
              {icon:"fa-phone",        lbl:"Téléphone", val:"+XXX XX XX XX XX"},
              {icon:"fa-envelope",     lbl:"Email",     val:"contact@mds-novatech.com"},
              {icon:"fa-clock",        lbl:"Horaires",  val:"Lun – Ven : 08h00 – 17h00"},
            ].map(c=>(
              <div className="ccard" key={c.lbl}>
                <div className="ccard-icon"><i className={`fa-solid ${c.icon}`}/></div>
                <div><div className="ccard-lbl">{c.lbl}</div><div className="ccard-val">{c.val}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-box" style={{margin:0}}>
          <h3><i className="fa-solid fa-comment-dots" style={{color:"var(--blue-l)",marginRight:9}}/>Envoyer un message</h3>
          <p className="sub"> </p>
          <div className="frow">
            <FG label="Prénom" icon="fa-user"><input type="text" placeholder="Jean" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})}/></FG>
            <FG label="Nom *" icon="fa-user"><input type="text" placeholder="Dupont" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/></FG>
          </div>
          <FG label="Email *" icon="fa-envelope"><input type="email" placeholder="jean@exemple.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FG>
          <FG label="Service concerné" icon="fa-tags">
            <CustomSelect options={serviceOpts} value={service} onChange={setService}/>
          </FG>
          <FG label="Message *" icon="fa-pen">
            <textarea placeholder="Décrivez votre besoin..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
          </FG>
          <button className="btn btn-blue btn-full" onClick={handleContact} disabled={sending}>
            <i className="fa-solid fa-paper-plane"/>{sending ? "Envoi en cours..." : "Envoyer le message"}
          </button>
          <Alert type={msgType} msg={msg}/>
        </div>
      </div>
    </div>
  );
}

function PromoteurPage() {
  return (
    <div>
      <PH tag="Notre fondateur" ticon="fa-user-tie" title="Le Promoteur" sub="Découvrez l'homme derrière la vision de MDS NovaTech."/>
      <div className="promo-layout">
        <div className="promo-card">
          <div className="promo-photo-wrap">
            <img src={PHOTO} alt="YOLOU ATEKEYOLLO MATHIEU PATIENT"/>
            <div className="promo-photo-overlay"/>
            <div className="promo-photo-name">
              <h3>YOLOU A. MATHIEU PATIENT</h3>
              <span><i className="fa-solid fa-briefcase"/>Promoteur & Fondateur</span>
            </div>
          </div>
          <div className="promo-card-body">
            <div className="promo-quote">
              <p>« Recherche, innovation et développement pour une Afrique forte. »</p>
              <cite>— YOLOU MATHIEU PATIENT</cite>
            </div>
            <div className="promo-socials">
              {[["fa-linkedin-in"],["fa-x-twitter"],["fa-facebook-f"]].map(([ic])=>(
                <a key={ic} href="#" className="promo-soc"><i className={`fa-brands ${ic}`}/></a>
              ))}
            </div>
          </div>
        </div>
        <div className="promo-content">
          <div className="promo-mots">
            <p>« Recherche, innovation et développement pour une Afrique forte. »</p>
            <cite>YOLOU ATEKEYOLLO MATHIEU PATIENT — Promoteur & Fondateur, MDS NovaTech</cite>
          </div>
          <div className="promo-section">
            <div className="promo-section-title"><i className="fa-solid fa-id-card"/>Biographie</div>
            <div className="promo-bio">
              <p>YOLOU ATEKEYOLLO MATHIEU PATIENT est un jeune entrepreneur africain visionnaire, fondateur et promoteur de MDS NovaTech. Né en Afrique centrale, il grandit avec une passion profonde pour les technologies et le développement agricole de son continent.</p>
              <p>Très tôt, il comprend que l'Afrique a besoin de solutions locales adaptées à ses réalités. C'est cette conviction qui le pousse, dès ses études, à s'orienter vers l'informatique et les sciences agronomiques.</p>
              <p>Fort de cette double expertise, il fonde MDS NovaTech avec une vision claire : créer une entreprise africaine capable de répondre aux défis technologiques et agricoles de demain.</p>
              <p>Animé par des valeurs de rigueur, d'intégrité et de service, MATHIEU PATIENT reste convaincu que la jeunesse africaine est la clé du développement du continent.</p>
            </div>
          </div>
          <div className="promo-section">
            <div className="promo-section-title"><i className="fa-solid fa-timeline"/>Parcours</div>
            <div className="promo-timeline">
              {[
                {icon:"fa-graduation-cap", year:"Formation",   title:"Études en Informatique & Agronomie",  desc:"Double formation qui forge sa vision unique."},
                {icon:"fa-lightbulb",      year:"Idée",        title:"Naissance du concept MDS NovaTech",   desc:"Une vision : créer une entreprise africaine à double expertise."},
                {icon:"fa-rocket",         year:"Lancement",   title:"Création de MDS NovaTech",            desc:"Fondation officielle avec une équipe passionnée."},
                {icon:"fa-trophy",         year:"Aujourd'hui", title:"Reconnaissance & Expansion",          desc:"Prix de l'Innovation 2026 et développement continu."},
              ].map(t=>(
                <div className="timeline-item" key={t.title}>
                  <div className="timeline-dot"><i className={`fa-solid ${t.icon}`}/></div>
                  <div className="timeline-body">
                    <div className="timeline-year">{t.year}</div>
                    <div className="timeline-title">{t.title}</div>
                    <div className="timeline-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="promo-section">
            <div className="promo-section-title"><i className="fa-solid fa-star"/>Valeurs & Vision</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {icon:"fa-magnifying-glass", col:"var(--blue-l)", bg:"rgba(42,82,201,0.08)", title:"Recherche",     desc:"Toujours chercher des solutions innovantes."},
                {icon:"fa-lightbulb",        col:"#d97706",        bg:"rgba(217,119,6,0.08)", title:"Innovation",    desc:"Transformer les idées en solutions concrètes."},
                {icon:"fa-chart-line",       col:"var(--green)",   bg:"rgba(46,163,18,0.08)", title:"Développement", desc:"Contribuer au progrès du continent africain."},
                {icon:"fa-shield-halved",    col:"var(--blue-l)", bg:"rgba(42,82,201,0.08)", title:"Intégrité",     desc:"Agir avec honnêteté en toutes circonstances."},
              ].map(v=>(
                <div key={v.title} style={{background:v.bg,borderRadius:14,padding:"16px"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"white",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
                    <i className={`fa-solid ${v.icon}`} style={{color:v.col,fontSize:"0.9rem"}}/>
                  </div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",color:"var(--text)",marginBottom:3}}>{v.title}</div>
                  <div style={{fontSize:"0.78rem",color:"var(--text2)",lineHeight:1.5}}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MentionsPage() {
  return (
    <div>
      <PH tag="Légal" ticon="fa-scale-balanced" title="Mentions Légales" sub="Informations légales relatives à MDS NovaTech."/>
      <div className="legal-content">
        <div className="legal-alert"><i className="fa-solid fa-circle-info"/>Conformément aux dispositions légales, voici les mentions obligatoires du site MDS NovaTech.</div>
        {[
          {icon:"fa-building",  title:"Éditeur du site",          content:<><p><strong>Raison sociale :</strong> MDS NovaTech</p><p><strong>Email :</strong> contact@mds-novatech.com</p><p><strong>Siège social :</strong> À compléter</p></>},
          {icon:"fa-server",    title:"Hébergement",              content:<><p>Ce site est hébergé par un prestataire tiers. Les coordonnées seront communiquées sur demande.</p></>},
          {icon:"fa-copyright", title:"Propriété intellectuelle", content:<><p>L'ensemble du contenu est la propriété exclusive de MDS NovaTech. Toute reproduction est interdite sans autorisation.</p></>},
          {icon:"fa-gavel",     title:"Droit applicable",         content:<><p>Les présentes mentions sont soumises au droit applicable dans le pays d'établissement de MDS NovaTech.</p></>},
        ].map(s=>(
          <div className="legal-section" key={s.title}>
            <h3><i className={`fa-solid ${s.icon}`}/>{s.title}</h3>
            {s.content}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidentialitePage() {
  return (
    <div>
      <PH tag="Légal" ticon="fa-shield-halved" title="Politique de Confidentialité" sub="Comment MDS NovaTech protège vos données personnelles."/>
      <div className="legal-content">
        <div className="legal-alert"><i className="fa-solid fa-lock"/>Vos données personnelles sont traitées avec le plus grand soin.</div>
        {[
          {icon:"fa-database",           title:"Données collectées",      items:["Nom, prénom, email, téléphone","Données de navigation","Informations des formulaires"]},
          {icon:"fa-bullseye",           title:"Finalités du traitement",  items:["Traitement des candidatures","Réponse aux demandes","Amélioration de nos services"]},
          {icon:"fa-user-shield",        title:"Vos droits",              items:["Droit d'accès","Droit de rectification","Droit à l'effacement","Droit d'opposition"]},
          {icon:"fa-envelope-open-text", title:"Contact DPO",             items:["privacy@mds-novatech.com","Délai de réponse : 30 jours maximum"]},
        ].map(s=>(
          <div className="legal-section" key={s.title}>
            <h3><i className={`fa-solid ${s.icon}`}/>{s.title}</h3>
            <ul>{s.items.map(i=><li key={i}><i className="fa-solid fa-circle-check"/>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CguPage() {
  return (
    <div>
      <PH tag="Légal" ticon="fa-file-lines" title="Conditions Générales d'Utilisation" sub="Règles régissant l'utilisation du site MDS NovaTech."/>
      <div className="legal-content">
        <div className="legal-alert"><i className="fa-solid fa-circle-exclamation"/>En utilisant ce site, vous acceptez les présentes CGU.</div>
        {[
          {icon:"fa-globe",        title:"1. Objet",                   content:<p>Les présentes CGU définissent les conditions d'utilisation du site web de MDS NovaTech.</p>},
          {icon:"fa-check-circle", title:"2. Accès au site",           content:<p>MDS NovaTech s'efforce de maintenir le site accessible 24h/24, 7j/7.</p>},
          {icon:"fa-ban",          title:"3. Utilisations interdites", items:["Utilisation frauduleuse","Diffusion de contenus illégaux","Tentative de piratage","Reproduction non autorisée"]},
          {icon:"fa-pen-to-square",title:"4. Modifications",           content:<p>MDS NovaTech se réserve le droit de modifier les présentes CGU à tout moment.</p>},
        ].map(s=>(
          <div className="legal-section" key={s.title}>
            <h3><i className={`fa-solid ${s.icon}`}/>{s.title}</h3>
            {s.content||null}
            {s.items&&<ul>{s.items.map(i=><li key={i}><i className="fa-solid fa-xmark" style={{color:"#ef4444"}}/>{i}</li>)}</ul>}
          </div>
        ))}
        <p style={{color:"var(--gray)",fontSize:"0.8rem",marginTop:20}}><i className="fa-regular fa-calendar" style={{marginRight:6}}/>Dernière mise à jour : Juin 2026</p>
      </div>
    </div>
  );
}

function Footer({ nav }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="logo" onClick={()=>nav("accueil")} style={{gap:10,cursor:"pointer",display:"flex",alignItems:"center"}}>
            <div className="logo-box">M</div>
            <div className="footer-logo-name">MDS <span>NovaTech</span></div>
          </div>
          <p className="footer-desc">Solutions informatiques et agricoles pour bâtir un avenir connecté et prospère.</p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><button onClick={()=>nav("services")}><i className="fa-solid fa-laptop-code"/>Informatique</button></li>
            <li><button onClick={()=>nav("services")}><i className="fa-solid fa-wheat-awn"/>Agriculture</button></li>
            <li><button onClick={()=>nav("actualites")}><i className="fa-solid fa-newspaper"/>Actualités</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Entreprise</h4>
          <ul>
            <li><button onClick={()=>nav("accueil")}><i className="fa-solid fa-circle-info"/>À propos</button></li>
            <li><button onClick={()=>nav("recrutement")}><i className="fa-solid fa-users"/>Recrutement</button></li>
            <li><button onClick={()=>nav("partenariats")}><i className="fa-solid fa-handshake"/>Partenariats</button></li>
            <li><button onClick={()=>nav("promoteur")}><i className="fa-solid fa-user-tie"/>Le Promoteur</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Légal</h4>
          <ul>
            <li><button onClick={()=>nav("mentions")}><i className="fa-solid fa-scale-balanced"/>Mentions légales</button></li>
            <li><button onClick={()=>nav("confidentialite")}><i className="fa-solid fa-shield-halved"/>Confidentialité</button></li>
            <li><button onClick={()=>nav("cgu")}><i className="fa-solid fa-file-lines"/>CGU</button></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MDS NovaTech. Tous droits réservés.</span>
        <div className="socials">
          {["fa-linkedin-in","fa-facebook-f","fa-x-twitter","fa-youtube"].map(ic=>(
            <a key={ic} href="#" className="soc"><i className={`fa-brands ${ic}`}/></a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Modal({ title, onClose }) {
  const [done, setDone] = useState(false);
  const [poste, setPoste] = useState("info");
  const [form, setForm] = useState({ prenom:"", nom:"", email:"", telephone:"" });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const posteOpts = [
    {value:"info", icon:"fa-laptop-code", label:"Informatique & Digital"},
    {value:"agri", icon:"fa-wheat-awn",   label:"Agriculture"},
    {value:"comm", icon:"fa-chart-line",  label:"Commercial"},
  ];

  const handleApply = async () => {
    if (!form.prenom || !form.email) {
      setMsg("Veuillez remplir les champs obligatoires."); setMsgType("error"); return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API}/api/candidature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, poste: title, domaine: posteOpts.find(p=>p.value===poste)?.label, motivation: "" })
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else { setMsg(data.message); setMsgType("error"); }
    } catch {
      setMsg("Erreur — réessayez plus tard."); setMsgType("error");
    }
    setSending(false);
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}><i className="fa-solid fa-xmark"/></button>
        {!done ? <>
          <h3><i className="fa-solid fa-paper-plane" style={{color:"var(--blue-l)",marginRight:8}}/>Postuler</h3>
          <p className="sub">{title}</p>
          <div className="frow">
            <FG label="Prénom *" icon="fa-user"><input type="text" placeholder="Prénom" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})}/></FG>
            <FG label="Nom" icon="fa-user"><input type="text" placeholder="Nom" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})}/></FG>
          </div>
          <FG label="Email *" icon="fa-envelope"><input type="email" placeholder="votre@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></FG>
          <FG label="Téléphone" icon="fa-phone"><input type="tel" placeholder="+XXX XX XX XX XX" value={form.telephone} onChange={e=>setForm({...form,telephone:e.target.value})}/></FG>
          <FG label="Poste visé" icon="fa-briefcase">
            <CustomSelect options={posteOpts} value={poste} onChange={setPoste}/>
          </FG>
          <div className="upload" style={{marginBottom:13}}>
            <i className="fa-solid fa-cloud-arrow-up"/>
            <p><span>Joindre votre CV</span> (PDF, DOC)</p>
          </div>
          <button className="btn btn-blue btn-full" onClick={handleApply} disabled={sending}>
            <i className="fa-solid fa-paper-plane"/>{sending ? "Envoi en cours..." : "Envoyer"}
          </button>
          <Alert type={msgType} msg={msg}/>
        </> : (
          <div className="success">
            <i className="fa-solid fa-circle-check"/>
            <strong>Candidature envoyée !</strong>
            <p style={{color:"var(--gray)",marginTop:7,fontSize:"0.88rem"}}>Nous vous contacterons sous 72h.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => { injectAssets(); }, []);

  useEffect(() => {
    const theme = dark ? DARK : LIGHT;
    Object.entries(theme).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
  }, [dark]);

  useEffect(() => {
    const handle = (e) => {
      if (menuOpen && !e.target.closest('.mob-menu') && !e.target.closest('.hamburger')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('touchstart', handle); };
  }, [menuOpen]);

  const nav = (p) => { setPage(p); setMenuOpen(false); };

  const renderPage = (p) => {
    switch(p) {
      case "accueil":         return <><HomePage nav={nav}/><Footer nav={nav}/></>;
      case "services":        return <><ServicesPage/><Footer nav={nav}/></>;
      case "actualites":      return <><ActualitesPage/><Footer nav={nav}/></>;
      case "recrutement":     return <><RecrutementPage openModal={t=>setModal(t)}/><Footer nav={nav}/></>;
      case "partenariats":    return <><PartenariatsPage/><Footer nav={nav}/></>;
      case "contact":         return <><ContactPage/><Footer nav={nav}/></>;
      case "promoteur":       return <><PromoteurPage/><Footer nav={nav}/></>;
      case "mentions":        return <><MentionsPage/><Footer nav={nav}/></>;
      case "confidentialite": return <><ConfidentialitePage/><Footer nav={nav}/></>;
      case "cgu":             return <><CguPage/><Footer nav={nav}/></>;
      default: return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="logo" onClick={()=>nav("accueil")}>
          <div className="logo-box">M</div>
          <div className="logo-name">MDS <span>NovaTech</span></div>
        </div>
        <ul className="nav-links">
          {NAV.map(n=>(
            <li key={n.id}>
              <button className={page===n.id?"active":""} onClick={()=>nav(n.id)}>
                <i className={`fa-solid ${n.icon}`}/> {n.label}
              </button>
            </li>
          ))}
          <li><button className="cta" onClick={()=>nav("contact")}><i className="fa-solid fa-envelope"/>Contact</button></li>
        </ul>
        <div className="nav-right">
          <div className="theme-toggle">
            <i className={`fa-solid fa-sun t-icon${!dark?" active":""}`}/>
            <div className={`toggle-track${dark?" dark":""}`} onClick={()=>setDark(!dark)}>
              <div className="toggle-thumb"/>
            </div>
            <i className={`fa-solid fa-moon t-icon${dark?" active":""}`}/>
          </div>
          <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mob-menu${menuOpen?" open":""}`}>
        {NAV.map(n=>(
          <button key={n.id} className={page===n.id?"active":""} onClick={()=>nav(n.id)}>
            <i className={`fa-solid ${n.icon}`}/>{n.label}
          </button>
        ))}
        <button onClick={()=>nav("contact")}><i className="fa-solid fa-envelope"/>Contact</button>
        <div className="mob-menu-divider"/>
        <button onClick={()=>nav("promoteur")}><i className="fa-solid fa-user-tie"/>Le Promoteur</button>
      </div>
      <div className="pages">
        {PAGES_LIST.map(p=>(
          <div key={p} className={`page${page===p?" active":""}`}>
            {page===p && renderPage(p)}
          </div>
        ))}
      </div>
      {modal && <Modal title={modal} onClose={()=>setModal(null)}/>}
    </>
  );
}