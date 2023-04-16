import * as path from 'path';
import { readDirectoryExcluding } from './recursive-file-reader';



export function backendScripts() {
  // const dir = "/Users/gauravporwal/gaurav/Sites/projects/side-projects/code-beacon-ai/apps/web-app/pages"
  const dir = "/Users/gauravporwal/gaurav/Sites/projects/side-projects/code-beacon-ai/dist/myfojo"

  console.log('__dirname', __dirname)
  console.log('process.cwd()', process.cwd())

  return readDirectoryExcluding({
    dirPath: dir,
    excludeFilePaths: [`${dir}/selector.js`, `${dir}/auth.js`, `${dir}/user.js`, `${dir}/account.js`],
    excludeFolderPaths: [`${dir}/`],
    fileCallback: (filePath, content) => { console.log(filePath, content) },
    outputDir: path.join(process.cwd(), './dist/myfojo.txt')
  });


  // return readDirectoryExcluding({
  //   dir

  // })

  // return 'backend-scripts';
}
