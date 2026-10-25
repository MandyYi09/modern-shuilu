import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'

const regions = JSON.parse(readFileSync(new URL('../apps/web/src/lib/detail-regions.json', import.meta.url)))
const asset = path => new URL(`../apps/web/public/paintings/${path}`, import.meta.url)

test('every painting has bounded display, thumbnail, and clue assets', () => {
  for (const id of Object.keys(regions)) {
    for (const [path, budget] of [
      [`display/${id}.webp`, 260 * 1024],
      [`character-thumb/${id}.webp`, 20 * 1024],
      ...['head', 'hands', 'robe'].map(clue => [`detail/${id}-${clue}.webp`, 110 * 1024]),
    ]) {
      const bytes = statSync(asset(path)).size
      assert.ok(bytes > 0 && bytes <= budget, `${path} exceeds its web delivery budget; regenerate with scripts/build_web_images.py`)
    }
  }
})
