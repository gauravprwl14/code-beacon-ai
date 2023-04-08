import * as fs from 'fs';
import * as path from 'path';



interface ReadDirectoryConfig {
  dirPath: string;
  excludeFilePaths?: string[];
  excludeFolderPaths?: string[];
  fileCallback: (filePath: string, content: string) => void;
  folderCallback?: (folderPath: string) => void;
  errorCallback?: (error: Error) => void;
  outputDir?: string;
}

const readFile = (filePath: string, fileCallback: (filePath: string, content: string) => void, errorCallback?: (error: Error) => void) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    fileCallback(filePath, content);
  } catch (error) {
    if (errorCallback) {
      errorCallback(error);
    }
  }
};

const readDirectory = (dirPath: string, excludeFilePaths: string[], excludeFolderPaths: string[], fileCallback: (filePath: string, content: string) => void, folderCallback?: (folderPath: string) => void, errorCallback?: (error: Error) => void, outputDir?: string) => {
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      logFolder(file)

      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        if (!excludeFolderPaths.includes(filePath)) {
          if (folderCallback) {
            folderCallback(filePath);
          }
          readDirectory(filePath, excludeFilePaths, excludeFolderPaths, fileCallback, folderCallback, errorCallback, outputDir);
        }
      } else if (stats.isFile()) {
        if (!excludeFilePaths.includes(filePath)) {
          readFile(filePath, fileCallback, errorCallback);
        }
      }
    }
  } catch (error) {
    if (errorCallback) {
      errorCallback(error);
    }
  }
};

const writeToFile = (outputDir: string, filePath: string, content: string, errorCallback?: (error: Error) => void) => {
  const outputFilePath = path.join(outputDir);
  const separator = `\n\n// ${filePath}\n`;
  const now = new Date().toISOString();
  const newContent = `// Start Date: ${now}\n${content}\n`;


  logFolder(outputFilePath, "odajksdajksndkja")

  try {

    fs.appendFileSync(outputFilePath, separator + newContent);
  } catch (error) {
    if (errorCallback) {
      errorCallback(error);
    }
  }
};

export const readDirectoryExcluding = (config: ReadDirectoryConfig) => {
  const {
    dirPath,
    excludeFilePaths = [],
    excludeFolderPaths = [],
    fileCallback = logFolder,
    folderCallback,
    errorCallback = handleError,
    outputDir,
  } = config;

  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory does not exist: ${dirPath}`,);
  }

  if (outputDir && !fs.existsSync(outputDir)) {
    console.log('output dir => ', outputDir)
    fs.mkdirSync(outputDir);
  }

  readDirectory(dirPath, excludeFilePaths, excludeFolderPaths, (filePath, content) => {
    if (outputDir) {
      writeToFile(outputDir, filePath, content, errorCallback);
    }
    fileCallback(filePath, content);
  }, folderCallback, errorCallback);
};

const logFolder = (folderPath: string, ...args: any[]) => {
  console.log(`Scanning folder: ${folderPath}`);
  console.log(args);
};


const handleError = (error: Error) => {
  console.error(`An error occurred: ${error.message}`);
};
