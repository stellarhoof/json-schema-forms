const fs = require("node:fs")
const fsp = require("node:fs/promises")
const path = require("node:path")
const { Readable } = require("node:stream")
const { pipeline } = require("node:stream/promises")
const ts = require("typescript")
const findPackageJson = require("find-package-json")

const printDiagnostic = (diagnostic) => {
  if (diagnostic.file) {
    let { line, character } = ts.getLineAndCharacterOfPosition(
      diagnostic.file,
      diagnostic.start
    )
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    console.log(
      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    )
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
  }
}

const isTerminalNode = (node) =>
  ts.isJSDoc(node) || ts.isToken(node) || ts.isIdentifier(node)

const forEachDescendant = (node, cb) => {
  for (const child of node.getChildren()) {
    forEachDescendant(child, cb)
  }
  cb(node)
}

const splitAt = (str, i) => [str.substring(0, i), str.substring(i)]

const createProgram = (config) =>
  ts.createProgram({
    rootNames: config.fileNames,
    options: config.options,
    projectReferences: config.projectReferences,
  })

const doIt = (checker, node) => {
  const [trivia, text] = splitAt(
    node.getFullText(),
    node.getLeadingTriviaWidth()
  )
  const block = { trivia, text }
  const symbol = checker.getSymbolAtLocation(node)
  if (symbol) {
    block.type = checker.typeToString(
      checker.getTypeAtLocation(node),
      node.parent
    )
    // if (symbol.flags & ts.SymbolFlags.Alias) {
    //   block.symbol = checker.getAliasedSymbol(symbol)
    // }
  }
  return block
}

const getRootDir = (config) =>
  config.options.rootDir ?? path.dirname(config.options.configFilePath)

const getPackageJson = (ref) =>
  findPackageJson(ref.sourceFile.fileName).next().value

const getIncludedSourceFiles = (program) => {
  const fileNames = program.getRootFileNames()
  const sourceFiles = program.getSourceFiles()
  return sourceFiles.filter(
    (source) => fileNames.includes(source.fileName) && !source.isDeclarationFile
  )
}

function* bar(config) {
  const program = createProgram(config)
  for (const ref of program.getResolvedProjectReferences()) {
    const config = ref.commandLine
    const rootDir = getRootDir(config)
    const program = createProgram(config)
    const checker = program.getTypeChecker()
    const packageJson = getPackageJson(ref)
    for (const source of getIncludedSourceFiles(program)) {
      if (
        source.fileName ===
        "/Users/ah/Code/stellarhoof/json-schema-forms/packages/core/src/createForm.ts"
      ) {
        console.log("before")
        yield {
          package: packageJson.name,
          filename: path.relative(rootDir, source.fileName),
          stream: new Readable({
            objectMode: true,
            read(size) {
              console.log(size, source.fileName)
              forEachDescendant(source, (node) => {
                if (isTerminalNode(node)) {
                  this.push(doIt(checker, node))
                }
              })
            },
          }),
        }
      }
    }
  }
}

// Caveat: The project needs to have been built before this works
const run = async (root) => {
  const config = ts.getParsedCommandLineOfConfigFile(
    "/Users/ah/Code/stellarhoof/json-schema-forms/tsconfig.json",
    undefined,
    {
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
      onUnRecoverableConfigFileDiagnostic: printDiagnostic,
    }
  )

  if (config) {
    for (const item of bar(config)) {
      const pathname = path.join(root, item.package, item.filename)
      await fsp.mkdir(path.dirname(pathname), { recursive: true })
      await pipeline(item.stream, fs.createWriteStream(pathname))
      console.log("done")
    }
  }
}

run("./generated").catch((e) => console.error(e))
