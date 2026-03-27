#!/usr/bin/env node
/**
 * build.js — Content update script for tuhinmohanta.com
 *
 * Usage:
 *   node build.js
 *
 * Reads data/talks.json and data/articles.json and regenerates
 * the corresponding HTML blocks in index.html.
 *
 * To add a new talk:  edit data/talks.json, run node build.js
 * To add an article:  edit data/articles.json, run node build.js
 */

const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');
const talks = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/talks.json'), 'utf8'));
const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/articles.json'), 'utf8'));

let html = fs.readFileSync(INDEX, 'utf8');

// ── Talks ──────────────────────────────────────────────────────────────────
function buildTalkCard(talk) {
  const ytUrl = `https://www.youtube.com/watch?v=${talk.id}`;
  const thumb = `https://i.ytimg.com/vi/${talk.id}/maxresdefault.jpg`;
  const playSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.75)" stroke-width="1.2"/><polygon points="10,8 17,12 10,16" fill="white"/></svg>`;

  const extraMeta = talk.extraLink
    ? `<span><a href="${talk.extraLink.url}" target="_blank" style="color:var(--accent)">${talk.extraLink.label}</a></span>`
    : `<span><a href="${ytUrl}" data-video-id="${talk.id}" class="js-video-trigger" style="color:var(--accent)">Watch →</a></span>`;

  return `
      <div class="talk-card">
        <a href="${ytUrl}" data-video-id="${talk.id}" class="talk-thumb-wrap js-video-trigger" aria-label="Watch ${talk.title.replace(/&/g,'&amp;')}">
          <img src="${thumb}" alt="${talk.title.replace(/&/g,'&amp;')}" loading="lazy" width="1280" height="720">
          <div class="talk-play">${playSvg}</div>
        </a>
        <div class="talk-body">
          <div class="article-type blue">${talk.event}</div>
          <h3><a href="${ytUrl}" data-video-id="${talk.id}" class="js-video-trigger">${talk.title.replace(/&/g,'&amp;')}</a></h3>
          <p>${talk.description}</p>
          <div class="talk-meta"><span>${talk.date}</span>${extraMeta}</div>
        </div>
      </div>`;
}

const talksHtml = talks.map(buildTalkCard).join('\n');
html = html.replace(
  /(<div class="talks-grid fade-in">)([\s\S]*?)(<\/div>\s*\n\s*<div style="text-align:center)/,
  (_, open, _content, seeAll) => `${open}\n${talksHtml}\n\n    ${seeAll}`
);

// ── Articles ───────────────────────────────────────────────────────────────
function buildArticleCard(a) {
  return `      <div class="article-card"><div class="article-type ${a.type}">${a.label}</div><h3><a href="${a.url}" target="_blank">${a.title}</a></h3><p>${a.description}</p><div class="article-meta"><span>${a.meta[0]}</span><span>${a.meta[1]}</span></div></div>`;
}

const articlesHtml = articles.map(buildArticleCard).join('\n');
html = html.replace(
  /(<div class="articles-grid fade-in">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>\s*<!-- TALKS)/,
  (_, open, _content, close) => `${open}\n${articlesHtml}\n    </div>\n  </div>\n</section>\n<!-- TALKS`
);

fs.writeFileSync(INDEX, html);
console.log(`✓ index.html updated — ${talks.length} talks, ${articles.length} articles`);
