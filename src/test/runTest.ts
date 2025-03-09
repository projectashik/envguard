import { runTests } from "@vscode/test-electron"
import * as path from "path"

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../")

    const extensionTestsPath = path.resolve(__dirname, "./index")

    const vscodeExecutablePath =
      "/Applications/Visual Studio Code.app/Contents/MacOS/Electron"

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
