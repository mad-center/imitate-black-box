import {resolve} from 'node:path'
import fs from 'fs-extra'
import os from 'node:os'

export const fetchBook = async () => {

  const bookInfo = await fs.readFile(
    resolve(process.cwd(), './manuscript/book.txt'),
    'utf-8'
  )

  return bookInfo
    .split(os.EOL)
    .filter((item) => item.endsWith('.md'))
    .map((item) => resolve(process.cwd(), `./manuscript/${item}`))
}