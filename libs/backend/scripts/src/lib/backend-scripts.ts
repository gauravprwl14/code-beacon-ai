import * as path from 'path';
import { readDirectoryExcluding } from './recursive-file-reader';



export function backendScripts() {
  const dir = "/Users/gauravporwal/gaurav/Sites/projects/side-projects/code-beacon-ai/apps/web-app/pages"

  console.log('__dirname', __dirname)
  console.log('process.cwd()', process.cwd())

  return readDirectoryExcluding({
    dirPath: dir,
    excludeFilePaths: [`${dir}/node_modules`],
    fileCallback: (filePath, content) => { console.log(filePath, content) },
    outputDir: path.join(process.cwd(), './dist/output.txt')
  });


  // return readDirectoryExcluding({
  //   dir

  // })

  // return 'backend-scripts';
}
