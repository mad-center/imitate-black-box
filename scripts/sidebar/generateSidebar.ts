import {fetchBook} from '../common/fetchBook'
import path from "path";
import fs from "fs-extra"

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

function extractRelativePath(fullPath: string, splitPoint: string): string {
  const startIndex = fullPath.indexOf(splitPoint);
  if (startIndex !== -1) {
    return fullPath.substring(startIndex + splitPoint.length);
  } else {
    return "";
  }
}

function getTitle(content: string): string {
  // multiline /m is required
  return <string>content.match(/^#(?!#)(.+)/m)?.[1].trim()
}

function extractSubFolder(relativePath: string): string {
  // example:
  //   '\\mainmatter\\15.md' => 'mainmatter'
  //   /mainmatter/15.md' => 'mainmatter'
  return relativePath.split(path.sep)[1]
}

export async function generateSidebar() {
  const markdownList = await fetchBook()

  // 1. get title from every md file => use map<link,text>

  //   'D:\\Code\\mad-center\\vitepress-demo\\manuscript\\mainmatter\\01.md',
  //   'D:\\Code\\mad-center\\vitepress-demo\\manuscript\\mainmatter\\02.md',
  // =>
  // linkToTextMap sample:
  //   '\\mainmatter\\15.md' => '15',
  //   '\\mainmatter\\16.md' => '16',
  //   '\\appendix\\a-1-music-cut.md' => 'BGM标记',
  //   '\\appendix\\a-2-text.md' => '《青空》部分文案'

  const linkToTextMap: Map<string, string> = new Map();
  for (let i = 0; i < markdownList.length; i++) {
    let content = await fs.readFile(markdownList[i], 'utf-8')
    const title = getTitle(content)!
    const relativePath = extractRelativePath(markdownList[i], "manuscript");
    linkToTextMap.set(relativePath, title)
  }
  // 2. generate tree structure

  // use data structure: map<folder,fileSet>
  // e.g.
  //   (mainmatter,[\\mainmatter\\15.md,\\mainmatter\\16.md])
  //   (appendix,[\\appendix\\a-1-music-cut.md',\\appendix\\a-2-text.md])
  const folderToFileSetMap: Map<string, Set<string>> = new Map();
  for (const [link, text] of linkToTextMap.entries()) {
    const subFolder = extractSubFolder(link);

    if (!folderToFileSetMap.has(subFolder)) {
      const newSet = new Set<string>();
      newSet.add(link)
      folderToFileSetMap.set(subFolder, newSet)
    } else {
      const existedSet = folderToFileSetMap.get(subFolder)!;
      existedSet.add(link)
      folderToFileSetMap.set(subFolder, existedSet)
    }
  }

  // 3. convert folderToFileSetMap to VO(sidebar)
  const sidebar: SidebarItem[] = []
  for (const [folder, fileSet] of folderToFileSetMap) {
    // handle items firstly
    const items: SidebarItem[] = []
    if (fileSet) {
      fileSet.forEach((filePath, index, set) => {
        items.push({
          "text": linkToTextMap.get(filePath) || "",
          "link": filePath
        })
      })
    }

    const partialItem = {
      "text": folder,
      "collapsed": false,
      // only create property `link` when its value is not empty.
      // Warning: if you want to set link to subFolder.
      // For example "mainmatter" => /mainmatter/mainmatter.md or /mainmatter/index.md
      // Currently this case has not been considered.
      ...(linkToTextMap.get(folder) && {link: linkToTextMap.get(folder)}),
    }

    sidebar.push(
      items.length > 0 ?
        {
          ...partialItem,
          items: items
        } :
        {
          ...partialItem
        }
    )
  }

  console.log("The sidebar json data has been exported.")

  return sidebar
}
