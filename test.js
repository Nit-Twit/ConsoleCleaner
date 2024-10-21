
const files = await glob("**/*.{ts,js}", {
    cwd: process.cwd(),
    ignore: ["node_modules", "node_modules/**"],
}).then((files) => files);
if (files.length === 0) {
    process.exit(0);
}
const promises = files.map(async (file) => {
    try {
    const rawFile = await fs.promises.readFile(file, "utf-8");
    const modifiedFile = rawFile.replace(/console\.log\(.*?\);?/g, "");
    const regex = /console\.log\(.*?\);?/g;
    const matches = rawFile.match(regex);
    const count = matches ? matches.length + " Statements" : "Nothing"; // Count matches, default to 0 if none found
    await fs.promises.writeFile(file, modifiedFile);
    if (config.verbose) {
        }
    } catch (error) {
    process.exit(0);
    }
});
await Promise.all(promises);
process.exit(0);
