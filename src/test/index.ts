import { glob } from "glob"
import Mocha from "mocha"
import * as path from "path"

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    timeout: 60000, // Increased timeout for extension tests
  })

  const testsRoot = path.resolve(__dirname, ".")

  return new Promise<void>((resolve, reject) => {
    glob("**/**.test.js", { cwd: testsRoot })
      .then((files: string[]) => {
        files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)))

        try {
          mocha.run((failures: number) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`))
            } else {
              resolve()
            }
          })
        } catch (err) {
          console.error(err)
          reject(err)
        }
      })
      .catch((err: Error) => {
        reject(err)
      })
  })
}
