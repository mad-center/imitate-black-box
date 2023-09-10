import fs from 'fs-extra'
import readingTime from 'reading-time'
// https://github.com/jonschlinkert/gray-matter
import matter from 'gray-matter'
import {fetchBook} from "../common/fetchBook";

// 获取所有的 Markdown 文件路径
const markdownFiles = await fetchBook();

function removeBetween(markdownContent: string, startFlag: string, endFlag: string) {
  const lines = markdownContent.split('\n');
  const startIndex = lines.findIndex(line => line.includes(startFlag.trim()));
  const endIndex = lines.findIndex(line => line.includes(endFlag.trim()));
  if (startIndex !== -1 && endIndex !== -1) {
    lines.splice(startIndex, endIndex - startIndex + 1);
  }
  return lines.join("\n");
}

// 遍历每个 Markdown 文件
markdownFiles.forEach(filePath => {
  const markdownContent = fs.readFileSync(filePath, 'utf-8');
  // MUST remove previous readingTime block before calculate stats
  const startFlag = '<!-- READING-TIME:START -->';
  const endFlag = '<!-- READING-TIME:END -->';
  const finalMarkdownContent = removeBetween(markdownContent,startFlag,endFlag);

  const stats = readingTime(finalMarkdownContent);
  // console.log(filePath, stats)
  // \18.md { text: '3 min read', minutes: 2.37, time: 142200, words: 474 }

  const parsed = matter(finalMarkdownContent);
  const frontmatter = parsed.data;

  // merge readingTime to frontmatter
  const newFrontMatter = {
    ...frontmatter,
    ...{
      readingTime: stats.text,
      words: stats.words
    }
  }

  const mainContent = parsed.content;
  // injected readingTime block
  const readingTimeBlock = `${startFlag}
>  🕛 reading time: ${stats.text} | 🔖 words: ${stats.words}
${endFlag}`

  const regex = /^#(?!#)(.+)$/gm;
  const newMarkdownContent = mainContent.replaceAll(regex, (match, args) => {
    return `${match}\n${readingTimeBlock}`;
  });

  // write back
  const updatedMarkdownContent = matter.stringify(newMarkdownContent, newFrontMatter);
  fs.writeFileSync(filePath, updatedMarkdownContent);
});

console.log('Reading time calculation completed.');
