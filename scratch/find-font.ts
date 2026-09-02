import fs from "fs";
import path from "path";

function search(dir: string) {
  try {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory() && !f.name.startsWith(".")) {
        search(p);
      } else if (f.isFile() && (f.name.endsWith(".js") || f.name.endsWith(".json") || f.name.endsWith(".node") || f.name.endsWith(".ts"))) {
        const buf = fs.readFileSync(p);
        if (buf.includes(Buffer.from("open", "utf8")) && buf.includes(Buffer.from("code", "utf8"))) {
          // let's check if it mentions tiny or fonts
        }
      }
    }
  } catch (e) {}
}

// Let's inspect opentui DLL strings for font glyphs
const bunDir = "node_modules/.bun";
for (const f of fs.readdirSync(bunDir)) {
  if (f.startsWith("@opentui+core-win32-x64")) {
    const dll = path.join(bunDir, f, "node_modules/@opentui/core-win32-x64/opentui.win32-x64-msvc.node");
    if (fs.existsSync(dll)) {
      const buf = fs.readFileSync(dll);
      console.log("DLL found, size:", buf.length);
      // search for block chars █, ▀, ▄, ▌, ▐, ░, ▒, ▓
      const str = buf.toString("utf8");
      const idx = str.indexOf("tiny");
      console.log("tiny index:", idx);
      // Let's find matches of block characters
      const matches = str.match(/([█▀▄▌▐░▒▓ ]{3,}\n?){2,}/g);
      if (matches) {
        console.log("Found block patterns:", matches.length);
        matches.slice(0, 10).forEach(m => console.log("---\n" + m));
      }
    }
  }
}
