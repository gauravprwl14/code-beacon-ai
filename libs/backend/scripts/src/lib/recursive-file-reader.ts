
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as babel from '@babel/core';
import { minify } from 'terser';
import * as UglifyJS from 'uglify-js';

interface ReadDirectoryConfig {
  dirPath: string;
  excludeFilePaths?: string[];
  excludeFolderPaths?: string[];
  fileCallback: (filePath: string, content: string) => void;
  folderCallback?: (folderPath: string) => Promise<void>;
  errorCallback?: (error: Error) => Promise<void>;
  outputDir?: string;
}

export const readDirectoryExcluding = async (config: ReadDirectoryConfig) => {
  const {
    dirPath,
    excludeFilePaths = [],
    excludeFolderPaths = [],
    fileCallback = logFolder,
    folderCallback = defaultFolderCallBack,
    errorCallback = handleError,
    outputDir,
  } = config;

  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory does not exist: ${dirPath}`);
  }

  if (outputDir && !fs.existsSync(outputDir)) {
    console.log('output dir => ', outputDir);
    fs.mkdirSync(outputDir);
  }

  await readDirectory(
    dirPath,
    excludeFilePaths,
    excludeFolderPaths,
    async (filePath, content) => {
      if (outputDir) {
        await writeToFile(outputDir, filePath, content, errorCallback);
      }
      fileCallback(filePath, content);
    },
    folderCallback,
    errorCallback
  );
};

const readDirectory = async (
  dirPath: string,
  excludeFilePaths: string[],
  excludeFolderPaths: string[],
  fileCallback: (filePath: string, content: string) => Promise<void>,
  folderCallback?: (folderPath: string) => Promise<void>,
  errorCallback?: (error: Error) => Promise<void>
) => {
  try {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.promises.stat(filePath);

      if (stats.isDirectory()) {
        if (!excludeFolderPaths.includes(filePath)) {
          if (folderCallback) {
            await folderCallback(filePath);
          }
          await readDirectory(
            filePath,
            excludeFilePaths,
            excludeFolderPaths,
            fileCallback,
            folderCallback,
            errorCallback
          );
        }
      } else if (stats.isFile()) {
        if (!excludeFilePaths.includes(filePath)) {
          const content = await fs.promises.readFile(filePath, 'utf8');
          await fileCallback(filePath, content);
        }
      }
    }
  } catch (error) {
    if (errorCallback) {
      await errorCallback(error);
    }
  }
};

const writeToFile = async (
  outputDir: string,
  filePath: string,
  content: string,
  errorCallback?: (error: Error) => Promise<void>
) => {
  const outputFilePath = path.join(outputDir);

  console.log('outputFilePath====', { outputFilePath, filePath })

  const fileExt = path.extname(filePath);
  // if (!['.tsx', '.ts', '.js', '.jsx', 'json'].includes(fileExt)) {
  //   return;
  // }


  const separator = `\n\n// ${filePath}\n`;
  const now = new Date().toISOString();
  const newContent = `// Start Date: ${now}\n${content}\n`;

  const transformedContent = newContent

  // console.log("content ==>", { newContent })

  // if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
  //   const res = await babel.transformAsync(newContent, {
  //     filename: filePath,
  //     presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react', '@babel/preset-typescript']
  //   });

  //   transformedContent = res?.code || ""
  // }

  // console.log('transformedContent => ', { transformedContent })



  // const uglifiedContent = UglifyJS.minify(transformedContent);
  // if (uglifiedContent.error) throw uglifiedContent.error;




  // const minifiedContent = await minify(uglifiedContent.code);

  // Compress the uglified JSON data
  // const compressedContent = zlib.gzipSync(minifiedContent.code);
  const compressedContent = zlib.gzipSync(transformedContent);

  // const options = {
  //   compress: true,
  //   mangle: true,
  //   output: {
  //     comments: false
  //   }
  // };
  // const uglifiedContent = UglifyJS.minify({ [filePath]: newContent }, options);


  // const minifiedContent = (await minify(minifiedContent)).code;

  try {
    await fs.promises.appendFile(outputFilePath, compressedContent);
  } catch (error) {
    console.error('filePath => ', { filePath })
    if (errorCallback) {
      await errorCallback(error);
    }
  }
};

const logFolder = async (folderPath: string, ...args: any[]) => {
  console.log(`Scanning folder: ${folderPath}`);
  console.log(args);
};

const handleError = async (error: Error) => {
  console.error(`An error occurred: ${error.message}`);
};
const defaultFolderCallBack = async (folderPath: string) => {
  console.log(`folder path: ${folderPath}`);
};
