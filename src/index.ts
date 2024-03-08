import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { serveStatic } from '@hono/node-server/serve-static'

import { readFile,writeFile } from 'fs/promises'

import config from '../config.json'

console.log(config)

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/leases',async (c) => {
  try {
    const leases = await readFile(config.dhcpleases,'utf8')
    return c.text(leases)
  } catch (error) {
    return c.json(error)
  }
})

const port = 3000

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
