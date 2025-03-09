import { minimatch } from "minimatch"
import * as path from "path"
import * as vscode from "vscode"

let hiddenValueDecoration: vscode.TextEditorDecorationType

let activeEditor: vscode.TextEditor | undefined

export function activate(context: vscode.ExtensionContext) {
  console.log("EnvGuard extension is now active")

  hiddenValueDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: "var(--vscode-editor-background)",
    color: "var(--vscode-editor-background)",
    after: {
      color: "var(--vscode-editor-foreground)",
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  })

  const toggleCommand = vscode.commands.registerCommand(
    "envguard.toggleVisibility",
    () => {
      const config = vscode.workspace.getConfiguration("envguard")
      const currentValue = config.get<boolean>("hideValues")

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

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("envguard")) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

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

  const config = vscode.workspace.getConfiguration("envguard")
  const filePatterns = config.get<string[]>("filePatterns") || [
    ".env",
    ".env.*",
  ]
  const shouldHideValues = config.get<boolean>("hideValues") ?? true

  const isEnvFile = filePatterns.some((pattern) => minimatch(fileName, pattern))

  if (!isEnvFile || !shouldHideValues) {
    activeEditor.setDecorations(hiddenValueDecoration, [])
    return
  }

  const hiddenRanges: vscode.DecorationOptions[] = []

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i)
    const text = line.text

    if (text.trim() === "" || text.trim().startsWith("#")) {
      continue
    }

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

export function deactivate() {
  if (hiddenValueDecoration) {
    hiddenValueDecoration.dispose()
  }
}
