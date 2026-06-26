#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const readmePath = path.join(root, "README.md");
const source = fs.readFileSync(readmePath, "utf8");

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const topicRules = [
  ["git", /git|版本控制|version control/i],
  ["open-source", /開源|open source|oss|自由軟體/i],
  ["community", /社群|community|sitcon|coscup|mopcon|gdg|g0v|hitcon/i],
  ["web-network", /http|restful|網路|network|web/i],
  ["cloud-ai", /cloud|ai|gemini|bigquery|firebase|google cloud|資料驅動|生成式/i],
  ["software-engineering", /軟體工程|software engineering|sdlc|devsecops|ci\/cd|harness|專案/i],
  ["security", /資安|security|駭客|cyber|hitcon|ais3/i],
  ["education", /教育|教學|課程|學生|學習|高中|大學|camp|workshop|資訊社/i],
  ["career", /職涯|career|人才|工程師|就業/i],
  ["civic-tech", /公民|政府|治理|moda|twnic|open data|校務/i],
];

const topicMeta = {
  git: {
    title: "Git and version control",
    summary: "Git、版本控制、協作流程與軟體開發基礎相關演講。",
    aliases: ["版本控制"],
  },
  "open-source": {
    title: "Open source",
    summary: "開源文化、自由軟體、開源策略與社群協作相關演講。",
    aliases: ["OSS", "自由軟體", "開源"],
  },
  community: {
    title: "Community",
    summary: "技術社群、學生社群、活動籌辦與社群經營相關紀錄。",
    aliases: ["社群經營"],
  },
  "web-network": {
    title: "Web and networking",
    summary: "網路、HTTP、RESTful、Web 技術與相關基礎課程。",
    aliases: ["HTTP", "RESTful"],
  },
  "cloud-ai": {
    title: "Cloud and AI",
    summary: "Google Cloud、BigQuery、Gemini、生成式 AI 與資料分析相關演講。",
    aliases: ["Google Cloud", "AI"],
  },
  "software-engineering": {
    title: "Software engineering",
    summary: "軟體工程、SDLC、CI/CD、DevSecOps、專案協作與交付流程相關演講。",
    aliases: ["SDLC", "CI/CD"],
  },
  security: {
    title: "Security",
    summary: "資訊安全、駭客社群、資安教育與安全治理相關紀錄。",
    aliases: ["資安"],
  },
  education: {
    title: "Education",
    summary: "資訊教育、課程設計、學生培力、工作坊與教學實踐相關紀錄。",
    aliases: ["教學", "資訊教育"],
  },
  career: {
    title: "Career",
    summary: "職涯、生涯選擇、資訊人才培育與工程師成長相關紀錄。",
    aliases: ["職涯"],
  },
  "civic-tech": {
    title: "Civic tech and governance",
    summary: "公民科技、網路治理、開放資料、政府與公共議題相關紀錄。",
    aliases: ["公民科技", "治理"],
  },
};

function ensureDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeUrl(url) {
  return url.replace(/^http:\/\/denny\.one\//, "https://denny.one/");
}

function slugify(input, fallback) {
  const ascii = input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (ascii) return ascii.slice(0, 70).replace(/-$/g, "");
  return fallback;
}

function slideSlugFromUrl(url) {
  const normalized = normalizeUrl(url).replace(/\/$/, "");
  try {
    const parsed = new URL(normalized);
    if (parsed.hostname === "denny.one") {
      return slugify(parsed.pathname.split("/").filter(Boolean).pop() || "slide", "slide");
    }
    if (parsed.hostname === "denny0223.github.io") {
      return slugify(parsed.pathname.split("/").filter(Boolean).pop() || parsed.hostname, "slide");
    }
    if (parsed.hostname === "docs.google.com") {
      const idMatch = parsed.pathname.match(/\/presentation\/d\/(?:e\/)?([^/]+)/);
      return `google-slides-${(idMatch ? idMatch[1] : hash(url)).slice(0, 12).toLowerCase()}`;
    }
    if (parsed.hostname === "gist.github.com") {
      return `gist-${parsed.pathname.split("/").filter(Boolean).pop() || hash(url)}`;
    }
    return slugify(`${parsed.hostname}-${parsed.pathname}`, `slide-${hash(url)}`);
  } catch {
    return `slide-${hash(url)}`;
  }
}

function hash(text) {
  return crypto.createHash("sha1").update(text).digest("hex").slice(0, 8);
}

function yamlString(value) {
  if (value === null || value === undefined || value === "") return '""';
  return JSON.stringify(String(value));
}

function yamlArray(values, indent = "") {
  if (!values || values.length === 0) return "[]";
  return `\n${values.map((value) => `${indent}- ${yamlString(value)}`).join("\n")}`;
}

function yamlLinkArray(values, indent = "") {
  if (!values || values.length === 0) return "[]";
  return `\n${values
    .map((value) => `${indent}- label: ${yamlString(value.label)}\n${indent}  url: ${yamlString(value.url)}`)
    .join("\n")}`;
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/<del>(.*?)<\/del>/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSummary(markdown) {
  return stripMarkdown(markdown)
    .replace(/\s*(簡報連結|投影片連結|課程錄影|活動錄影|議程錄影|直播存檔|完整 Podcast @YouTube|Day \d 錄影|總統府新聞|總統府 Flickr|活動紀錄|開幕錄影|Infrastructure Review 錄影|Day \d 活動紀錄|專訪文章|總決賽評審團講評)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLinks(markdown) {
  const links = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(markdown))) {
    links.push({
      label: match[1].replace(/<[^>]+>/g, ""),
      url: normalizeUrl(match[2].trim()),
    });
  }
  return links;
}

function titleFromRest(rest) {
  const cleaned = stripMarkdown(rest)
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
  const withoutTrailingLinks = cleaned
    .replace(/\s*(簡報連結|投影片連結|課程錄影|活動錄影|議程錄影|直播存檔|完整 Podcast @YouTube|Day \d 錄影|總統府新聞|總統府 Flickr|活動紀錄|開幕錄影|Infrastructure Review 錄影|Day \d 活動紀錄|專訪文章|總決賽評審團講評).*/i, "")
    .trim();
  const separators = [" : ", " - ", " / "];
  for (const separator of separators) {
    if (withoutTrailingLinks.includes(separator)) {
      const parts = withoutTrailingLinks.split(separator).map((part) => part.trim()).filter(Boolean);
      const candidate = parts[parts.length - 1];
      if (candidate) return candidate;
    }
  }
  return withoutTrailingLinks || cleaned;
}

function eventNameFromRest(rest) {
  const noLinks = stripMarkdown(rest);
  const separators = [" : ", " - ", " / "];
  for (const separator of separators) {
    if (noLinks.includes(separator)) {
      return noLinks.split(separator)[0].trim();
    }
  }
  return "";
}

function roleFromText(text) {
  if (/評審/.test(text)) return "judge";
  if (/主持人|主持/.test(text)) return "host";
  if (/Panel|座談|論壇|與談/.test(text)) return "panelist";
  if (/訪談|Podcast|專訪/.test(text)) return "interviewee";
  if (/開幕|閉幕|Lightning Talk|LT/.test(text)) return "speaker";
  return "speaker";
}

function topicsFor(text) {
  const topics = [];
  for (const [topic, regex] of topicRules) {
    if (regex.test(text)) topics.push(topic);
  }
  return topics.length > 0 ? topics : ["community"];
}

function parseDate(year, dateText) {
  const first = dateText.match(/([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (!first) return `${year}-01-01`;
  const month = monthMap[first[1]] || "01";
  const day = String(first[2]).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseEndDate(year, dateText) {
  const range = dateText.match(/([A-Z][a-z]{2})\s+\d{1,2}\s+-\s+([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (range) {
    const month = monthMap[range[2]] || "01";
    const day = String(range[3]).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const sameMonthRange = dateText.match(/([A-Z][a-z]{2})\s+\d{1,2}\s+-\s+(\d{1,2})/);
  if (sameMonthRange) {
    const month = monthMap[sameMonthRange[1]] || "01";
    const day = String(sameMonthRange[2]).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const comma = dateText.match(/([A-Z][a-z]{2})\s+\d{1,2},\s*(\d{1,2})/);
  if (comma) {
    const month = monthMap[comma[1]] || "01";
    const day = String(comma[2]).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
}

const eventDir = path.join(root, "_events");
const slideDir = path.join(root, "_slides");
const topicDir = path.join(root, "_topics");
ensureDir(eventDir);
ensureDir(slideDir);
ensureDir(topicDir);

const lines = source.split(/\r?\n/);
let year = null;
const events = [];
const slides = new Map();

for (const line of lines) {
  const heading = line.match(/^#\s+(\d{4})\s*$/);
  if (heading) {
    year = heading[1];
    continue;
  }
  if (!year || !line.startsWith("* ")) continue;

  const item = line.slice(2).trim();
  const parts = item.match(/^([^/]+?)\s*\/\s*(.+)$/);
  if (!parts) continue;

  const displayDate = parts[1].trim();
  const rest = parts[2].trim().replace(/GDG Taiepi/g, "GDG Taipei").replace(/https:\/\/denny\.one\/the-net(?!\/)/g, "https://denny.one/the-net/");
  const date = parseDate(year, displayDate);
  const links = extractLinks(rest);
  const title = titleFromRest(rest);
  const endDate = parseEndDate(year, displayDate);
  const event = eventNameFromRest(rest);
  const textForTopics = `${title} ${event} ${stripMarkdown(rest)}`;
  const topics = topicsFor(textForTopics);
  const videos = links.filter((link) => /錄影|直播|video|youtube|youtu\.be|Podcast/i.test(`${link.label} ${link.url}`));
  const slideLinks = links.filter((link) =>
    /簡報|投影片|slide/i.test(link.label) ||
    /denny\.one|docs\.google\.com\/presentation|denny0223\.github\.io|speakerdeck\.com|gist\.github\.com|slides\.com/i.test(link.url)
  ).filter((link) => !/youtube|youtu\.be|facebook\.com\/.*videos/i.test(link.url));
  const slideIds = [];

  for (const link of slideLinks) {
    const id = slideSlugFromUrl(link.url);
    slideIds.push(id);
    if (!slides.has(id)) {
      slides.set(id, {
        id,
        title: stripMarkdown(link.label).replace(/^(簡報|投影片)連結$/, title),
        external_url: normalizeUrl(link.url),
        summary: `${title} 相關投影片。`,
        topics,
        language: /[A-Za-z]/.test(title) && !/[一-龥]/.test(title) ? "en" : "zh-TW",
        first_presented: date,
      });
    } else {
      const slide = slides.get(id);
      slide.topics = [...new Set([...slide.topics, ...topics])];
      if (date < slide.first_presented) slide.first_presented = date;
    }
  }

  const slugBase = slugify(title, `event-${hash(item)}`);
  const slug = `${date}-${slugBase}`.slice(0, 95).replace(/-$/g, "");
  events.push({
    slug,
    title,
    date,
    end_date: endDate,
    event,
    event_url: links[0]?.url || "",
    role: roleFromText(rest),
    language: /[A-Za-z]/.test(title) && !/[一-龥]/.test(title) ? "en" : "zh-TW",
    summary: cleanSummary(rest),
    topics,
    slides: [...new Set(slideIds)],
    videos,
    links: links.filter((link) => !videos.some((video) => video.url === link.url) && !slideLinks.some((slide) => slide.url === link.url)),
    original_markdown: rest,
  });
}

const eventsByDate = new Map();
for (const event of events) {
  if (!eventsByDate.has(event.date)) eventsByDate.set(event.date, []);
  eventsByDate.get(event.date).push(event);
}
for (const dateEvents of eventsByDate.values()) {
  if (dateEvents.length > 1) {
    dateEvents.forEach((event, index) => {
      event.sequence = index + 1;
    });
  }
}

const usedSlugs = new Map();
for (const event of events) {
  const count = usedSlugs.get(event.slug) || 0;
  usedSlugs.set(event.slug, count + 1);
  const finalSlug = count === 0 ? event.slug : `${event.slug}-${count + 1}`;
  const body = `---\ntitle: ${yamlString(event.title)}\ndate: ${event.date}\n${event.end_date ? `end_date: ${event.end_date}\n` : ""}${event.sequence ? `sequence: ${event.sequence}\n` : ""}event: ${yamlString(event.event)}\nevent_url: ${yamlString(event.event_url)}\nrole: ${yamlString(event.role)}\nlanguage: ${yamlString(event.language)}\nsummary: ${yamlString(event.summary)}\ntopics: ${yamlArray(event.topics, "  ")}\nslides: ${yamlArray(event.slides, "  ")}\nvideos: ${yamlLinkArray(event.videos, "  ")}\nlinks: ${yamlLinkArray(event.links, "  ")}\n---\n\n${event.original_markdown}\n`;
  fs.writeFileSync(path.join(eventDir, `${finalSlug}.md`), body);
}

for (const slide of [...slides.values()].sort((a, b) => a.id.localeCompare(b.id))) {
  const body = `---\ntitle: ${yamlString(slide.title)}\nexternal_url: ${yamlString(slide.external_url)}\nsummary: ${yamlString(slide.summary)}\ntopics: ${yamlArray([...new Set(slide.topics)].sort(), "  ")}\nlanguage: ${yamlString(slide.language)}\nfirst_presented: ${slide.first_presented}\naliases: []\n---\n\n${slide.summary}\n`;
  fs.writeFileSync(path.join(slideDir, `${slide.id}.md`), body);
}

for (const [id, meta] of Object.entries(topicMeta)) {
  const body = `---\ntitle: ${yamlString(meta.title)}\nsummary: ${yamlString(meta.summary)}\naliases: ${yamlArray(meta.aliases || [], "  ")}\n---\n\n${meta.summary}\n`;
  fs.writeFileSync(path.join(topicDir, `${id}.md`), body);
}

console.log(`Generated ${events.length} events, ${slides.size} slides, ${Object.keys(topicMeta).length} topics.`);
