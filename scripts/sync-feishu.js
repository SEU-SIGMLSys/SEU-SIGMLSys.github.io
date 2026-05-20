#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT_DIR = path.resolve(__dirname, "..");
const LOCAL_ENV_PATH = path.join(ROOT_DIR, ".env.local");

loadLocalEnv(LOCAL_ENV_PATH);

const DEFAULT_CONFIG = {
    appToken: "RXITbTzFMaBblzsdETXcuqkNnTb",
    tableId: "tblrVI06ls9biJoA",
    viewId: "vew63l2LQh",
    outputPath: "schedules.js",
    defaultTime: "9:30 a.m.",
    defaultLocation: "Room ARTS1021 @ SEU & Online",
    defaultDblpSource: "website",
    fieldAliases: {
        title: ["title", "paper title", "topic", "name", "论文标题", "论文题目", "题目", "标题", "名称"],
        conf: ["conf", "conference", "venue", "会议", "会议名称", "发表会议", "来源会议"],
        presenter: ["presenter", "speaker", "reporter", "汇报人", "主讲人", "分享人", "报告人"],
        facilitator: ["facilitator", "host", "主持人", "协助人", "负责人"],
        date: ["date", "presentation date", "schedule date", "日期", "组会日期", "汇报日期", "时间"],
        time: ["time", "start time", "presentation time", "具体时间", "开始时间", "汇报时间"],
        location: ["location", "place", "room", "地点", "会议地点", "教室"],
        tencentMeetingUrl: ["tencentmeeting", "tencent meeting", "meeting", "meeting url", "腾讯会议", "腾讯会议链接", "会议链接"],
        slidesUrl: ["slides", "slides url", "pdf", "pdf url", "ppt", "pptx", "slides链接", "课件", "幻灯片", "pdf链接"],
        videoUrl: ["videos", "video", "video url", "recording", "录像", "视频", "回放", "视频链接"],
        paperUrl: ["dblp", "doi", "paper url", "url", "pdf link", "论文链接", "原文链接", "doi链接", "dblp链接"],
        paperSource: ["source", "paper source", "来源", "论文来源"],
        section: ["section", "status", "state", "type", "分组", "状态", "类型"],
        hidden: ["hidden", "hide", "skip", "disabled", "隐藏", "跳过", "不展示"]
    }
};

Object.assign(DEFAULT_CONFIG.fieldAliases, {
    title: [
        ...DEFAULT_CONFIG.fieldAliases.title,
        "\u8bba\u6587\u6807\u9898",
        "\u8bba\u6587\u9898\u76ee",
        "\u9898\u76ee",
        "\u6807\u9898",
        "\u540d\u79f0"
    ],
    conf: [
        ...DEFAULT_CONFIG.fieldAliases.conf,
        "\u4f1a\u8bae",
        "\u671f\u520a",
        "\u4f1a\u8bae/\u671f\u520a",
        "\u4f1a\u8bae\u540d\u79f0",
        "\u53d1\u8868\u4f1a\u8bae",
        "\u6765\u6e90\u4f1a\u8bae"
    ],
    presenter: [
        ...DEFAULT_CONFIG.fieldAliases.presenter,
        "\u6c47\u62a5\u4eba",
        "\u4e3b\u8bb2\u4eba",
        "\u5206\u4eab\u4eba",
        "\u62a5\u544a\u4eba"
    ],
    facilitator: [
        ...DEFAULT_CONFIG.fieldAliases.facilitator,
        "\u4e3b\u6301\u4eba",
        "\u534f\u52a9\u4eba",
        "\u8d1f\u8d23\u4eba"
    ],
    date: [
        ...DEFAULT_CONFIG.fieldAliases.date,
        "\u65e5\u671f",
        "\u7ec4\u4f1a\u65e5\u671f",
        "\u6c47\u62a5\u65e5\u671f",
        "\u7ec4\u4f1a\u6c47\u62a5\u65f6\u95f4",
        "\u7ec4\u4f1a\u65f6\u95f4",
        "\u6c47\u62a5\u65f6\u95f4",
        "\u65f6\u95f4"
    ],
    time: [
        ...DEFAULT_CONFIG.fieldAliases.time,
        "\u65f6\u95f4",
        "\u7ec4\u4f1a\u6c47\u62a5\u65f6\u95f4",
        "\u7ec4\u4f1a\u65f6\u95f4",
        "\u5177\u4f53\u65f6\u95f4",
        "\u5f00\u59cb\u65f6\u95f4",
        "\u6c47\u62a5\u65f6\u95f4"
    ],
    location: [
        ...DEFAULT_CONFIG.fieldAliases.location,
        "\u5730\u70b9",
        "\u4f1a\u8bae\u5730\u70b9",
        "\u6559\u5ba4"
    ],
    tencentMeetingUrl: [
        ...DEFAULT_CONFIG.fieldAliases.tencentMeetingUrl,
        "\u817e\u8baf\u4f1a\u8bae",
        "\u817e\u8baf\u4f1a\u8bae\u94fe\u63a5",
        "\u4f1a\u8bae\u94fe\u63a5"
    ],
    slidesUrl: [
        ...DEFAULT_CONFIG.fieldAliases.slidesUrl,
        "\u8bfe\u4ef6",
        "\u5e7b\u706f\u7247",
        "ppt\u94fe\u63a5",
        "pdf\u94fe\u63a5",
        "\u8bfe\u4ef6\u94fe\u63a5",
        "\u5e7b\u706f\u7247\u94fe\u63a5",
        "pdf\u94fe\u63a5"
    ],
    videoUrl: [
        ...DEFAULT_CONFIG.fieldAliases.videoUrl,
        "\u5f55\u5c4f",
        "\u5f55\u50cf",
        "\u89c6\u9891",
        "\u56de\u653e",
        "\u89c6\u9891\u94fe\u63a5"
    ],
    paperUrl: [
        ...DEFAULT_CONFIG.fieldAliases.paperUrl,
        "\u8bba\u6587\u94fe\u63a5",
        "\u539f\u6587\u94fe\u63a5",
        "doi\u94fe\u63a5",
        "dblp\u94fe\u63a5"
    ],
    paperSource: [
        ...DEFAULT_CONFIG.fieldAliases.paperSource,
        "\u6765\u6e90",
        "\u8bba\u6587\u6765\u6e90"
    ],
    section: [
        ...DEFAULT_CONFIG.fieldAliases.section,
        "\u5206\u7ec4",
        "\u72b6\u6001",
        "\u7c7b\u578b"
    ],
    hidden: [
        ...DEFAULT_CONFIG.fieldAliases.hidden,
        "\u9690\u85cf",
        "\u8df3\u8fc7",
        "\u4e0d\u5c55\u793a"
    ]
});

const args = new Set(process.argv.slice(2));

if (args.has("--help") || args.has("-h")) {
    printHelp();
    process.exit(0);
}

main().catch((error) => {
    console.error(`\n[feishu-sync] ${error.message}`);
    process.exit(1);
});

async function main() {
    if (typeof fetch !== "function") {
        throw new Error("This script needs Node.js 18 or newer because it uses the built-in fetch API.");
    }

    const appId = process.env.FEISHU_APP_ID;
    const appSecret = process.env.FEISHU_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error(
            "Missing FEISHU_APP_ID or FEISHU_APP_SECRET. Copy .env.local.example to .env.local and fill them in."
        );
    }

    const config = loadConfig();
    const token = await getTenantAccessToken(appId, appSecret);
    const records = await listBitableRecords(token, config);
    const schedules = records
        .map((record, index) => toSchedule(record, config, index))
        .filter(Boolean);

    const { upcoming, history } = splitSchedules(schedules);
    const outputPath = path.resolve(ROOT_DIR, config.outputPath);
    const oldOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
    const existingData = readExistingSchedules(oldOutput);
    const replaceAll = args.has("--replace-all");
    const nextUpcoming = upcoming;
    const nextHistory = replaceAll ? history : mergeSchedules(existingData.schedules, history, nextUpcoming);
    const output = renderSchedulesJs(nextUpcoming, nextHistory);
    const nextTotal = nextUpcoming.length + nextHistory.length;
    const existingTotal = existingData.upcoming.length + existingData.schedules.length;

    if (args.has("--dry-run")) {
        console.log(`[feishu-sync] fetched ${records.length} records`);
        console.log(`[feishu-sync] from Feishu: upcoming ${upcoming.length}, schedules ${history.length}`);
        console.log(
            `[feishu-sync] output: upcoming ${nextUpcoming.length}, schedules ${nextHistory.length}` +
                (replaceAll ? " (replace-all)" : " (merged with existing schedules)")
        );
        if (replaceAll && existingTotal > nextTotal) {
            console.warn(
                `[feishu-sync] warning: generated ${nextTotal} records, but existing schedules.js has ${existingTotal}.`
            );
        }
        console.log(`[feishu-sync] dry run: ${outputPath} was not changed`);
        return;
    }

    if (replaceAll && !args.has("--allow-shrink") && existingTotal > nextTotal) {
        throw new Error(
            `Refusing to replace ${existingTotal} existing records with ${nextTotal} Feishu records. ` +
                "If the Feishu table is now the full source of truth, rerun with -- --allow-shrink."
        );
    }

    if (normalizeNewlines(oldOutput) === normalizeNewlines(output)) {
        console.log(`[feishu-sync] no changes. upcoming: ${upcoming.length}, schedules: ${history.length}`);
        return;
    }

    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`[feishu-sync] updated ${path.relative(ROOT_DIR, outputPath)}`);
    console.log(`[feishu-sync] upcoming: ${upcoming.length}, schedules: ${history.length}`);
}

function loadLocalEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!match) {
            continue;
        }

        const [, key, rawValue] = match;
        if (process.env[key] !== undefined) {
            continue;
        }

        process.env[key] = unquoteEnvValue(rawValue.trim());
    }
}

function unquoteEnvValue(value) {
    if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }
    return value;
}

function loadConfig() {
    const configPath = process.env.FEISHU_SYNC_CONFIG
        ? path.resolve(ROOT_DIR, process.env.FEISHU_SYNC_CONFIG)
        : path.join(ROOT_DIR, "scripts", "feishu-sync.config.json");

    if (!fs.existsSync(configPath)) {
        return applyEnvOverrides({
            ...DEFAULT_CONFIG,
            fieldAliases: { ...DEFAULT_CONFIG.fieldAliases }
        });
    }

    const userConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return applyEnvOverrides({
        ...DEFAULT_CONFIG,
        ...userConfig,
        fieldAliases: {
            ...DEFAULT_CONFIG.fieldAliases,
            ...(userConfig.fieldAliases || {})
        }
    });
}

function applyEnvOverrides(config) {
    return {
        ...config,
        appToken: process.env.FEISHU_APP_TOKEN || config.appToken,
        tableId: process.env.FEISHU_TABLE_ID || config.tableId,
        viewId: process.env.FEISHU_VIEW_ID || config.viewId
    };
}

async function getTenantAccessToken(appId, appSecret) {
    const response = await fetchJson("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            app_id: appId,
            app_secret: appSecret
        })
    });

    if (!response.tenant_access_token) {
        throw new Error(`Feishu did not return tenant_access_token: ${JSON.stringify(response)}`);
    }

    return response.tenant_access_token;
}

async function listBitableRecords(token, config) {
    const records = [];
    let pageToken = "";

    do {
        const url = new URL(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.appToken}/tables/${config.tableId}/records`
        );
        url.searchParams.set("page_size", "500");
        if (config.viewId) {
            url.searchParams.set("view_id", config.viewId);
        }
        if (pageToken) {
            url.searchParams.set("page_token", pageToken);
        }

        const response = await fetchJson(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = response.data || {};
        records.push(...(data.items || []));
        pageToken = data.has_more ? data.page_token : "";
    } while (pageToken);

    return records;
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch (error) {
        throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 300)}`);
    }

    if (!response.ok || (data.code !== undefined && data.code !== 0)) {
        const message = data.msg || data.message || response.statusText;
        throw new Error(`Request failed for ${url}: ${message}`);
    }

    return data;
}

function toSchedule(record, config, sourceIndex) {
    const fields = record.fields || {};
    const hidden = readField(fields, config.fieldAliases.hidden);

    if (isTruthyHidden(hidden)) {
        return null;
    }

    const title = readField(fields, config.fieldAliases.title);
    const conf = readField(fields, config.fieldAliases.conf);
    const presenter = readField(fields, config.fieldAliases.presenter);

    if (!title || !conf || !presenter) {
        const availableFields = Object.keys(fields).join(", ");
        console.warn(
            `[feishu-sync] skipped record ${record.record_id || ""}: missing title/conf/presenter. Fields: ${availableFields}`
        );
        return null;
    }

    const dateValue = rawField(fields, config.fieldAliases.date);
    const timeValue = rawField(fields, config.fieldAliases.time);
    const section = readField(fields, config.fieldAliases.section).toLowerCase();
    const tencentMeetingUrl = readField(fields, config.fieldAliases.tencentMeetingUrl, { preferUrl: true });
    const slidesUrl = readField(fields, config.fieldAliases.slidesUrl, { preferUrl: true });
    const videoUrl = readField(fields, config.fieldAliases.videoUrl, { preferUrl: true });
    const paperUrl = readField(fields, config.fieldAliases.paperUrl, { preferUrl: true });
    const paperSource = readField(fields, config.fieldAliases.paperSource) || config.defaultDblpSource;
    const sortDate = parseScheduleDateTime(dateValue, timeValue);

    const links = [];
    if (tencentMeetingUrl) {
        links.push({ title: "TencentMeeting", url: tencentMeetingUrl });
    }
    if (slidesUrl) {
        links.push({ title: "Slides", url: slidesUrl });
    }
    if (videoUrl) {
        links.push({ title: "Videos", url: videoUrl });
    }

    const schedule = {
        title,
        conf,
        presenter,
        facilitator: readField(fields, config.fieldAliases.facilitator),
        date: formatDateValue(dateValue),
        time: formatTimeValue(timeValue) || config.defaultTime,
        location: readField(fields, config.fieldAliases.location) || config.defaultLocation,
        links
    };

    if (paperUrl) {
        schedule.dblp = {
            source: paperSource,
            url: paperUrl
        };
    }

    Object.defineProperties(schedule, {
        _sortTime: {
            value: sortDate ? sortDate.getTime() : 0,
            enumerable: false
        },
        _section: {
            value: section,
            enumerable: false
        },
        _sourceIndex: {
            value: sourceIndex,
            enumerable: false
        }
    });

    return schedule;
}

function rawField(fields, aliases) {
    const key = resolveFieldKey(fields, aliases);
    return key ? fields[key] : "";
}

function readField(fields, aliases, options = {}) {
    return normalizeFieldValue(rawField(fields, aliases), options);
}

function resolveFieldKey(fields, aliases = []) {
    const normalizedAliases = new Set(aliases.map(normalizeKey));
    return Object.keys(fields).find((fieldName) => normalizedAliases.has(normalizeKey(fieldName)));
}

function normalizeKey(value) {
    return String(value || "")
        .trim()
        .replace(/[\s_\-:/\\|]+/g, "")
        .toLowerCase();
}

function normalizeFieldValue(value, options = {}) {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeFieldValue(item, options))
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "object") {
        if (options.preferUrl) {
            const directUrl = value.url || value.link || value.href;
            if (directUrl) {
                return String(directUrl).trim();
            }
        }

        if (value.text !== undefined) {
            return normalizeFieldValue(value.text, options);
        }
        if (value.name !== undefined) {
            return normalizeFieldValue(value.name, options);
        }
        if (value.value !== undefined) {
            return normalizeFieldValue(value.value, options);
        }
        if (value.link !== undefined) {
            return normalizeFieldValue(value.link, options);
        }
        if (value.url !== undefined) {
            return normalizeFieldValue(value.url, options);
        }
        if (value.en_us !== undefined) {
            return normalizeFieldValue(value.en_us, options);
        }
        if (value.zh_cn !== undefined) {
            return normalizeFieldValue(value.zh_cn, options);
        }
    }

    return "";
}

function isTruthyHidden(value) {
    return ["1", "true", "yes", "y", "hidden", "hide", "skip", "disabled", "是", "隐藏", "跳过", "不展示"].includes(
        String(value || "").trim().toLowerCase()
    );
}

function splitSchedules(schedules) {
    const ordered = schedules.slice().sort(compareScheduleDesc);
    const latest = ordered[0];
    const upcoming = latest ? [latest] : [];
    const latestKey = latest ? scheduleKey(latest) : "";
    const history = ordered.filter((schedule) => scheduleKey(schedule) !== latestKey);

    return { upcoming, history };
}

function compareScheduleDesc(a, b) {
    return (b._sortTime || 0) - (a._sortTime || 0) || (b._sourceIndex || 0) - (a._sourceIndex || 0);
}

function formatDateValue(value) {
    const date = parseDateValue(value);
    if (date) {
        return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}.`;
    }

    const normalized = normalizeFieldValue(value);
    if (!normalized) {
        return "";
    }

    return normalized.endsWith(".") ? normalized : `${normalized}.`;
}

function formatTimeValue(value) {
    const raw = normalizeFieldValue(value);
    if (!raw) {
        return "";
    }

    if (/^\d{10,13}$/.test(raw)) {
        const timestamp = Number(raw.length === 10 ? `${raw}000` : raw);
        return formatTime(new Date(timestamp));
    }

    const match = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
        const hours = Number(match[1]);
        const minutes = match[2];
        return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "a.m." : "p.m."}`;
    }

    return raw;
}

function parseDateValue(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    if (typeof value === "number") {
        return new Date(value);
    }

    const raw = normalizeFieldValue(value);
    if (!raw) {
        return null;
    }

    if (/^\d{10,13}$/.test(raw)) {
        const timestamp = Number(raw.length === 10 ? `${raw}000` : raw);
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(raw.replace(/\.$/, ""));
    return Number.isNaN(date.getTime()) ? null : date;
}

function parseScheduleDateTime(dateValue, timeValue) {
    const date = parseDateValue(dateValue);
    if (!date) {
        return null;
    }

    const time = parseTimeParts(timeValue);
    if (time) {
        date.setHours(time.hours, time.minutes, 0, 0);
    }

    return date;
}

function parseTimeParts(value) {
    const raw = normalizeFieldValue(value).trim().toLowerCase();
    if (!raw) {
        return null;
    }

    const match = raw.match(/(\d{1,2})[:：](\d{2})/);
    if (!match) {
        return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }

    if ((raw.includes("p.m") || raw.includes("pm") || raw.includes("下午") || raw.includes("晚上")) && hours < 12) {
        hours += 12;
    }
    if ((raw.includes("a.m") || raw.includes("am") || raw.includes("上午")) && hours === 12) {
        hours = 0;
    }

    return { hours, minutes };
}

function formatTime(date) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "a.m." : "p.m."}`;
}

function renderSchedulesJs(upcoming, schedules) {
    return [
        `var upcoming_schedules = ${JSON.stringify(upcoming, null, 4)}`,
        "",
        `var schedules = ${JSON.stringify(schedules, null, 4)}`,
        ""
    ].join("\n");
}

function normalizeNewlines(value) {
    return value.replace(/\r\n/g, "\n");
}

function readExistingSchedules(source) {
    if (!source.trim()) {
        return { upcoming: [], schedules: [] };
    }

    const context = {};
    try {
        vm.runInNewContext(source, context, { timeout: 1000 });
    } catch (error) {
        console.warn(`[feishu-sync] warning: could not read existing schedules.js: ${error.message}`);
        return { upcoming: [], schedules: [] };
    }

    return {
        upcoming: Array.isArray(context.upcoming_schedules) ? context.upcoming_schedules : [],
        schedules: Array.isArray(context.schedules) ? context.schedules : []
    };
}

function mergeSchedules(existingHistory, incomingHistory, incomingUpcoming) {
    const upcomingKeys = new Set(incomingUpcoming.map(scheduleKey));
    const byKey = new Map();

    for (const schedule of existingHistory) {
        if (!upcomingKeys.has(scheduleKey(schedule))) {
            byKey.set(scheduleKey(schedule), schedule);
        }
    }
    for (const schedule of incomingHistory) {
        byKey.set(scheduleKey(schedule), schedule);
    }

    return Array.from(byKey.values()).sort((a, b) => {
        const aTime = parseDateValue(a.date)?.getTime() || 0;
        const bTime = parseDateValue(b.date)?.getTime() || 0;
        return bTime - aTime;
    });
}

function scheduleKey(schedule) {
    return [schedule.title, schedule.conf, schedule.date, schedule.presenter].map(normalizeKey).join("|");
}

function printHelp() {
    console.log(`Usage: npm run sync:feishu [-- --dry-run]

Reads the Feishu Base view and regenerates schedules.js.

Required local secrets:
  FEISHU_APP_ID
  FEISHU_APP_SECRET

Optional:
  FEISHU_SYNC_CONFIG=scripts/feishu-sync.config.json
  FEISHU_APP_TOKEN, FEISHU_TABLE_ID, FEISHU_VIEW_ID
  --replace-all to treat Feishu as the complete source of truth
  --allow-shrink to allow replace-all with fewer records
`);
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
