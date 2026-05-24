#!/usr/bin/env node

"use strict";

const { Command } = require("commander");
const path = require("node:path");
const fs = require("node:fs");

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
const PKG = require("./package.json");

const program = new Command();

program
  .name("tattva-gen")
  .description("Tattva monorepo code generator — scaffold packages, content, and components")
  .version(PKG.version, "-v, --version", "Print the current version")
  .helpOption("-h, --help", "Display help for a command");

// ---------------------------------------------------------------------------
// `package` sub-command — scaffold a new package
// ---------------------------------------------------------------------------
program
  .command("package")
  .description("Scaffold a new package under packages/<name>")
  .argument("<name>", "Package name (e.g. analytics)")
  .option("-d, --description <desc>", "Short description of the package")
  .option("--private", "Mark the package as private", true)
  .action(async (name, opts) => {
    const targetDir = path.resolve(process.cwd(), "packages", name);
    const pkgDir = path.resolve(process.cwd(), "tooling", "generators", "templates", "package");

    if (fs.existsSync(targetDir)) {
      console.error(`❌  Directory already exists: ${targetDir}`);
      process.exit(1);
    }

    console.log(`📦  Creating package @tattva/${name} …`);

    // Create directory structure
    fs.mkdirSync(path.join(targetDir, "src"), { recursive: true });

    // Write package.json
    const pkgJson = {
      name: `@tattva/${name}`,
      version: "0.0.0",
      private: opts.private,
      description: opts.description || `Tattva ${name} package`,
      license: "MIT",
      main: "./src/index.ts",
      types: "./src/index.ts",
      scripts: {
        build: "tsc --project tsconfig.json",
        dev: "tsc --project tsconfig.json --watch",
        lint: "eslint src/",
        typecheck: "tsc --noEmit",
        clean: "rimraf dist .turbo",
      },
      devDependencies: {
        "@tattva/eslint-config": "workspace:*",
        "@tattva/prettier-config": "workspace:*",
        "@tattva/typescript-config": "workspace:*",
        rimraf: "^6.0.1",
        typescript: "^5.8.2",
      },
    };

    fs.writeFileSync(
      path.join(targetDir, "package.json"),
      JSON.stringify(pkgJson, null, 2) + "\n",
    );

    // Write tsconfig.json
    const tsconfig = {
      extends: "@tattva/typescript-config/react-library.json",
      compilerOptions: { outDir: "./dist" },
      include: ["src"],
      exclude: ["node_modules", "dist"],
    };

    fs.writeFileSync(
      path.join(targetDir, "tsconfig.json"),
      JSON.stringify(tsconfig, null, 2) + "\n",
    );

    // Write src/index.ts
    fs.writeFileSync(
      path.join(targetDir, "src", "index.ts"),
      `/**\n * @tattva/${name}\n *\n * ${opts.description || `Tattva ${name} package`}\n */\n\nexport {};\n`,
    );

    console.log(`✅  Package created at packages/${name}`);
    console.log(`   Run "pnpm install" to link the new package.`);
  });

// ---------------------------------------------------------------------------
// `content` sub-command — scaffold a new MDX content file
// ---------------------------------------------------------------------------
program
  .command("content")
  .description("Scaffold a new MDX content file (lesson, guide, etc.)")
  .argument("<type>", "Content type (lesson | guide | concept | exercise)")
  .argument("<slug>", "URL-safe slug (e.g. quadratic-equations)")
  .option("-c, --class <cls>", "NCERT class (1-12)", "10")
  .option("-s, --subject <subject>", "Subject (mathematics, physics, …)", "mathematics")
  .action(async (type, slug, opts) => {
    const validTypes = ["lesson", "guide", "concept", "exercise"];

    if (!validTypes.includes(type)) {
      console.error(`❌  Invalid content type "${type}". Must be one of: ${validTypes.join(", ")}`);
      process.exit(1);
    }

    const contentDir = path.resolve(
      process.cwd(),
      "content",
      opts.subject,
      `class-${opts.class}`,
      `${type}s`,
    );
    const filePath = path.join(contentDir, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      console.error(`❌  File already exists: ${filePath}`);
      process.exit(1);
    }

    fs.mkdirSync(contentDir, { recursive: true });

    const frontmatter = [
      "---",
      `title: ""`,
      `description: ""`,
      `subject: ${opts.subject}`,
      `class: ${opts.class}`,
      `type: ${type}`,
      `slug: ${slug}`,
      `chapter: ""`,
      `tags: []`,
      `difficulty: beginner`,
      `status: draft`,
      `lastUpdated: "${new Date().toISOString().split("T")[0]}"`,
      "---",
    ].join("\n");

    const body = [
      "",
      `# Title`,
      "",
      `> Brief introduction goes here.`,
      "",
      "## Overview",
      "",
      "Content goes here.",
      "",
      "## Key Concepts",
      "",
      "- Point one",
      "- Point two",
      "",
      "## Practice Questions",
      "",
      "1. Question one",
      "",
      "---",
      "",
      `*This ${type} is part of the Tattva open education project.*`,
      "",
    ].join("\n");

    fs.writeFileSync(filePath, frontmatter + body);

    console.log(`📝  Content file created: ${path.relative(process.cwd(), filePath)}`);
  });

// ---------------------------------------------------------------------------
// `component` sub-command — scaffold a new UI component
// ---------------------------------------------------------------------------
program
  .command("component")
  .description("Scaffold a new UI component under packages/ui/src")
  .argument("<name>", "Component name in PascalCase (e.g. Card, DataTable)")
  .option("-e, --export", "Re-export from packages/ui/src/index.ts", true)
  .action(async (name, opts) => {
    const componentDir = path.resolve(process.cwd(), "packages", "ui", "src", name);
    const filePath = path.join(componentDir, `${name}.tsx`);
    const storyPath = path.join(componentDir, `${name}.stories.tsx`);
    const indexPath = path.join(componentDir, "index.ts");

    if (fs.existsSync(componentDir)) {
      console.error(`❌  Component directory already exists: ${componentDir}`);
      process.exit(1);
    }

    fs.mkdirSync(componentDir, { recursive: true });

    // Component file
    const componentCode = [
      `import type { HTMLAttributes } from "react";`,
      ``,
      `export interface ${name}Props extends HTMLAttributes<HTMLDivElement> {`,
      `  /** Visual variant */`,
      `  variant?: "default" | "outlined" | "filled";`,
      `}`,
      ``,
      `/**`,
      ` * ${name} component`,
      ` *`,
      ` * @example`,
      ` * \`\`\`tsx`,
      ` * <${name} variant="default">Content</${name}>`,
      ` * \`\`\``,
      ` */`,
      `export function ${name}({ variant = "default", className, children, ...props }: ${name}Props) {`,
      `  return (`,
      `    <div className={className} data-variant={variant} {...props}>`,
      `      {children}`,
      `    </div>`,
      `  );`,
      `}`,
      ``,
    ].join("\n");

    fs.writeFileSync(filePath, componentCode);

    // Index barrel export
    fs.writeFileSync(indexPath, `export { ${name} } from "./${name}";\nexport type { ${name}Props } from "./${name}";\n`);

    // Storybook stub
    const storyCode = [
      `import type { Meta, StoryObj } from "@storybook/react";`,
      `import { ${name} } from "./${name}";`,
      ``,
      `const meta: Meta<typeof ${name}> = {`,
      `  title: "Components/${name}",`,
      `  component: ${name},`,
      `  argTypes: { variant: { control: "select", options: ["default", "outlined", "filled"] } },`,
      `};`,
      ``,
      `export default meta;`,
      `type Story = StoryObj<typeof ${name}>;`,
      ``,
      `export const Default: Story = {`,
      `  args: { children: "${name} content", variant: "default" },`,
      `};`,
      ``,
    ].join("\n");

    fs.writeFileSync(storyPath, storyCode);

    // Re-export from packages/ui/src/index.ts
    if (opts.export) {
      const uiIndexPath = path.resolve(process.cwd(), "packages", "ui", "src", "index.ts");
      if (fs.existsSync(uiIndexPath)) {
        const existing = fs.readFileSync(uiIndexPath, "utf-8");
        const exportLine = `export { ${name}, type ${name}Props } from "./${name}";\n`;
        if (!existing.includes(`"./${name}"`)) {
          fs.writeFileSync(uiIndexPath, existing + exportLine);
        }
      } else {
        fs.writeFileSync(uiIndexPath, `export { ${name}, type ${name}Props } from "./${name}";\n`);
      }
    }

    console.log(`🧩  Component ${name} created at packages/ui/src/${name}/`);
    if (opts.export) {
      console.log(`   Re-exported from packages/ui/src/index.ts`);
    }
  });

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------
program.parse(process.argv);

// Show help if no sub-command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
