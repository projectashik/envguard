import { runTests } from "@vscode/test-electron"
import * as path from "path"

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../")

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./index")

    // Path to the local VSCode executable
    const vscodeExecutablePath =
      "/Applications/Visual Studio Code.app/Contents/MacOS/Electron"

    // Use the locally installed VSCode
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ["--disable-extensions", "--disable-gpu"],
      vscodeExecutablePath,
    })
  } catch (err) {
    console.error("Failed to run tests:", err)
    process.exit(1)
  }
}

main()
