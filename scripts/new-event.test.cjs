const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "talks-new-event-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ["scripts", "_events", "_slides"]) fs.mkdirSync(path.join(root, dir));
  const script = path.join(root, "scripts/new-event");
  fs.copyFileSync(path.join(__dirname, "new-event"), script);
  for (const [id, title] of [["intro", "Introduction"], ["practice", "Practice"]]) {
    fs.writeFileSync(path.join(root, "_slides", `${id}.md`), `---\ntitle: "${title}"\nexternal_url: "https://example.com/${id}/"\n---\n`);
  }
  return {
    root,
    run: (args = []) => spawnSync(process.execPath, [script, "--date", "2026-10-28", "--title", "Data Analysis", "--event", "Example Event", ...args], { encoding: "utf8" }),
    read: (slug = "data-analysis") => fs.readFileSync(path.join(root, "_events", `2026-10-28-${slug}.md`), "utf8"),
  };
}

for (const { name, args, expected } of [
  {
    name: "links the activity and labels the original slide URL separately",
    args: ["--event-url", "https://example.com/event", "--slide", "intro"],
    expected: "[Example Event](https://example.com/event) : Data Analysis [簡報連結](https://example.com/intro/)",
  },
  {
    name: "keeps the activity plain when no official URL is provided",
    args: ["--slide", "intro"],
    expected: "Example Event : Data Analysis [簡報連結](https://example.com/intro/)",
  },
  {
    name: "omits unavailable slide resources",
    args: [],
    expected: "Example Event : Data Analysis",
  },
  {
    name: "distinguishes multiple decks while preserving the slide-link label",
    args: ["--slide", "intro,practice"],
    expected: "Example Event : Data Analysis Introduction [簡報連結](https://example.com/intro/) Practice [簡報連結](https://example.com/practice/)",
  },
  {
    name: "omits an empty activity prefix and separator",
    args: ["--event", "", "--slide", "intro"],
    expected: "Data Analysis [簡報連結](https://example.com/intro/)",
  },
]) {
  test(name, (t) => {
    const f = fixture(t);
    const result = f.run(args);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(f.read().split("---\n")[2].trim(), expected);
  });
}

test("keeps same-day ordering and slide references when appending a record", (t) => {
  const f = fixture(t);
  assert.equal(f.run(["--slide", "intro"]).status, 0);
  const result = f.run(["--title", "Follow Up", "--slide", "practice"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(f.read(), /^sequence: 1$/m);
  assert.match(f.read("follow-up"), /^sequence: 2$/m);
  assert.match(f.read("follow-up"), /slides:\s*\n  - "practice"/);
  assert.match(f.read("follow-up"), /\[簡報連結\]\(https:\/\/example\.com\/practice\/\)/);
});
