// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { minimatch } from "minimatch"
import * as path from "path"
import * as vscode from "vscode"

// Define decoration types
let hiddenValueDecoration: vscode.TextEditorDecorationType

// Track active editors
let activeEditor: vscode.TextEditor | undefined

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("EnvGuard extension is now active")

  // Initialize decorations
  hiddenValueDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: "var(--vscode-editor-background)",
    color: "var(--vscode-editor-background)",
    after: {
      // The actual asterisks will be dynamically set based on value length
      color: "var(--vscode-editor-foreground)",
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  })

  // Register the toggle command
  const toggleCommand = vscode.commands.registerCommand(
    "envguard.toggleVisibility",
    () => {
      const config = vscode.workspace.getConfiguration("envguard")
      const currentValue = config.get<boolean>("hideValues")

      // Toggle the value
      config
        .update("hideValues", !currentValue, vscode.ConfigurationTarget.Global)
        .then(() => {
          vscode.window.showInformationMessage(
            `EnvGuard: Values are now ${!currentValue ? "hidden" : "visible"}`
          )
          updateDecorations()
        })
    }
  )

  // Update decorations when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor
      if (editor) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  // Update decorations when the document changes
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  // Update decorations when configuration changes
  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("envguard")) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  // Set initial active editor
  activeEditor = vscode.window.activeTextEditor
  if (activeEditor) {
    updateDecorations()
  }

  context.subscriptions.push(toggleCommand)
}

function updateDecorations() {
  if (!activeEditor) {
    return
  }

  const document = activeEditor.document
  const fileName = path.basename(document.fileName)

  // Check if the current file matches any of the configured patterns
  const config = vscode.workspace.getConfiguration("envguard")
  const filePatterns = config.get<string[]>("filePatterns") || [
    ".env",
    ".env.*",
  ]
  const shouldHideValues = config.get<boolean>("hideValues") ?? true

  const isEnvFile = filePatterns.some((pattern) => minimatch(fileName, pattern))

  if (!isEnvFile || !shouldHideValues) {
    // Clear decorations if not an env file or if values should be visible
    activeEditor.setDecorations(hiddenValueDecoration, [])
    return
  }

  const hiddenRanges: vscode.DecorationOptions[] = []

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i)
    const text = line.text

    // Skip empty lines or comment lines
    if (text.trim() === "" || text.trim().startsWith("#")) {
      continue
    }

    // Find the equals sign to separate key and value
    const equalsIndex = text.indexOf("=")
    if (equalsIndex === -1) {
      continue
    }

    const valueStartIndex = equalsIndex + 1
    const valueRange = new vscode.Range(
      new vscode.Position(i, valueStartIndex),
      line.range.end
    )

    const valueText = text.substring(valueStartIndex).trim()
    const asterisks = "*".repeat(valueText.length || 1) // At least one asterisk

    // Hide value
    hiddenRanges.push({
      range: valueRange,
      renderOptions: {
        after: {
          contentText: asterisks,
          margin: `0 0 0 -${valueText.length}ch`,
        },
      },
    })
  }

  activeEditor.setDecorations(hiddenValueDecoration, hiddenRanges)
}

// This method is called when your extension is deactivated
export function deactivate() {
  // Clean up decorations
  if (hiddenValueDecoration) {
    hiddenValueDecoration.dispose()
  }
}
