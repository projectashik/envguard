import * as os from "os"
import * as path from "path"
import * as vscode from "vscode"

/**
 * Helper function to wait for a specific condition to be true
 * @param condition Function that returns true when the condition is met
 * @param timeout Maximum time to wait in milliseconds
 * @param interval Interval between checks in milliseconds
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<boolean> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const result = await Promise.resolve(condition())
    if (result) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  return false
}

/**
 * Helper function to reset extension settings to defaults
 */
export async function resetSettings(): Promise<void> {
  const config = vscode.workspace.getConfiguration("envguard")
  await config.update(
    "filePatterns",
    [".env", ".env.*"],
    vscode.ConfigurationTarget.Global
  )
  await config.update("hideValues", true, vscode.ConfigurationTarget.Global)
}

/**
 * Helper function to create a temporary env file for testing
 * @param content The content of the env file
 * @param fileName The name of the env file
 * @returns The URI of the created file
 */
export async function createTempEnvFile(
  content: string,
  fileName: string = ".env.test"
): Promise<vscode.Uri> {
  const tempDirPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, "temp")
      : path.join(os.tmpdir(), "envguard-test")

  const tempDirUri = vscode.Uri.file(tempDirPath)

  await vscode.workspace.fs.createDirectory(tempDirUri)

  const fileUri = vscode.Uri.joinPath(tempDirUri, fileName)

  const encoder = new TextEncoder()
  await vscode.workspace.fs.writeFile(fileUri, encoder.encode(content))

  return fileUri
}

/**
 * Helper function to clean up temporary files
 */
export async function cleanupTempFiles(): Promise<void> {
  try {
    const tempDirPath =
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0
        ? path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, "temp")
        : path.join(os.tmpdir(), "envguard-test")

    const tempDirUri = vscode.Uri.file(tempDirPath)

    try {
      await vscode.workspace.fs.stat(tempDirUri)
      await vscode.workspace.fs.delete(tempDirUri, { recursive: true })
    } catch (error) {
      console.log("Temp directory does not exist, nothing to clean up")
    }
  } catch (error) {
    console.error("Failed to clean up temp directory:", error)
  }
}
