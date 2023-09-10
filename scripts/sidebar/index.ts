import {resolve} from 'node:path'
import fs from 'fs-extra'
import {generateSidebar} from './generateSidebar'

const sidebar = await generateSidebar()

await fs.outputJson(
  resolve(process.cwd(), './.vitepress/sidebar.json'),
  sidebar,
  {
    spaces: 2,
    replacer: (key: any, value: any) => {
      if (typeof value === 'string' && value.includes("\\")) {
        return value.replace(/\\/g, "/");
      }
      return value;
    }
  }
)