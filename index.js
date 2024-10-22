#!/usr/bin/env node

import chalk from "chalk";
import { glob } from "glob";
import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cleanerConfigFile = await glob(".cleanerconfig.json", {
  cwd: process.cwd(),
}).then((files) => files.length);

if (cleanerConfigFile.length === 0 || cleanerConfigFile === 0) {
  rl.question(
    chalk.yellowBright(
      "No .cleanerconfig.json file was found, do you want to make one? (Y/n)"
    ),
    async (answer) => {
      if (answer.toLowerCase() === "y" || answer === "") {
        console.log(
          chalk.greenBright(
            "Creating a .cleanerconfig.json file with default settings...\n(Rerun the command)"
          )
        );
        const defaultConfig = {
          verbose: false,
          ignore: [],
        };
        await fs.writeFileSync(
          ".cleanerconfig.json",
          JSON.stringify(defaultConfig, null, 2)
        );
        process.exit(0);
      }
    }
  );
} else {
  const rawConfig = await fs.readFileSync(".cleanerconfig.json", "utf-8");
  const config = JSON.parse(rawConfig);

  if (config.verbose) {
    console.log(chalk.greenBright("Verbose mode enabled"));
    if (config.ignore && config.ignore.length > 0) {
      console.log(
        chalk.yellowBright(
          `Ignoring the following files/patterns: ${chalk.whiteBright(
            `"${config.ignore.join('", "')}"`
          )}`
        )
      );
      const files = await glob("**/*.{ts,js}", {
        cwd: process.cwd(),
        ignore: ["node_modules", "node_modules/**", ...config.ignore],
      }).then((files) => files);

      if (files.length === 0) {
        console.log(
          chalk.redBright(
            "Error: Detected no files to modify. Check your .cleanerconfig.json file and try again."
          )
        );
        process.exit(0);
      }

      console.log(
        chalk.cyanBright(
          `Files to be modified:\n\t${chalk.whiteBright(
            "\u2022"
          )} ${chalk.magentaBright(
            files.join("\n\t" + chalk.whiteBright("\u2022") + " ")
          )}\n`
        )
      );

      const promises = files.map(async (file) => {
        try {
          const rawFile = await fs.promises.readFile(file, "utf-8");

          const regex = /console\.log\s*\(\s*[\s\S]*?\);\s*/g; // Improved regex
          const modifiedFile = rawFile.replace(regex, ""); // Remove console.log

          const matches = rawFile.match(regex);
          const count = matches
            ? matches.length + " Statement(s) removed"
            : "Nothing removed";

          await fs.promises.writeFile(file, modifiedFile);

          if (config.verbose) {
            console.log(
              chalk.greenBright(`Successfully modified ${file} (${count})`)
            );
          }
        } catch (error) {
          console.log(chalk.redBright(`Error: ${error.message}`));
          process.exit(0);
        }
      });

      await Promise.all(promises);
      console.log(chalk.blueBright("\nSuccessfully modified all files"));
      process.exit(0);
    } else {
      console.log(
        chalk.yellowBright(
          `Modifying every file except those in the node_modules directory...`
        )
      );
      const files = await glob("**/*.{ts,js}", {
        cwd: process.cwd(),
        ignore: ["node_modules", "node_modules/**"],
      }).then((files) => files);

      if (files.length === 0) {
        console.log(
          chalk.redBright(
            "Error: Detected no files to modify. Check your .cleanerconfig.josn file and try again."
          )
        );
        process.exit(0);
      }

      console.log(
        chalk.cyanBright(
          `Files to be modified:\n\t${chalk.whiteBright(
            "\u2022"
          )} ${chalk.magentaBright(
            files.join("\n\t" + chalk.whiteBright("\u2022") + " ")
          )}\n`
        )
      );

      const promises = files.map(async (file) => {
        try {
          const rawFile = await fs.promises.readFile(file, "utf-8");

          const regex = /console\.log\s*\(\s*[\s\S]*?\);\s*/g; // Improved regex
          const modifiedFile = rawFile.replace(regex, ""); // Remove console.log

          const matches = rawFile.match(regex);
          const count = matches
            ? matches.length + " Statement(s) removed"
            : "Nothing removed";

          await fs.promises.writeFile(file, modifiedFile);

          if (config.verbose) {
            console.log(
              chalk.greenBright(`Successfully modified ${file} (${count})`)
            );
          }
        } catch (error) {
          console.log(chalk.redBright(`Error: ${error.message}`));
          process.exit(0);
        }
      });

      await Promise.all(promises);
      console.log(chalk.blueBright("\nSuccessfully modified all files"));
      process.exit(0);
    }
  } else {
    if (config.ignore && config.ignore.length > 0) {
      const files = await glob("**/*.{ts,js}", {
        cwd: process.cwd(),
        ignore: ["node_modules", "node_modules/**", ...config.ignore],
      }).then((files) => files);
      if (files.length === 0) {
        console.log(
          chalk.redBright(
            "Error: Detected no files to modify. Check your .cleanerconfig.json file and try again."
          )
        );
        process.exit(0);
      }
      const promises = files.map(async (file) => {
        try {
          const rawFile = await fs.promises.readFile(file, "utf-8");
          const modifiedFile = rawFile.replace(/console\.log\(.*?\);?/g, "");
          await fs.promises.writeFile(file, modifiedFile);
        } catch (error) {
          process.exit(0);
        }
      });
      console.log(chalk.blueBright("\nSuccessfully modified all files!"));
      await Promise.all(promises);
      process.exit(0);
    } else {
      const files = await glob("**/*.{ts,js}", {
        cwd: process.cwd(),
        ignore: ["node_modules", "node_modules/**"],
      }).then((files) => files);
      if (files.length === 0) {
        console.log(
          chalk.redBright(
            "Error: Detected no files to modify. Check your .cleanerconfig.json file and try again."
          )
        );
        process.exit(0);
      }
      const promises = files.map(async (file) => {
        try {
          const rawFile = await fs.promises.readFile(file, "utf-8");
          const modifiedFile = rawFile.replace(/console\.log\(.*?\);?/g, "");
          await fs.promises.writeFile(file, modifiedFile);
        } catch (error) {
          process.exit(0);
        }
      });
      console.log(chalk.blueBright("\nSuccessfully modified all files!"));
      await Promise.all(promises);
      process.exit(0);
    }
  }
}
