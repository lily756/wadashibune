import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { serveStatic } from '@hono/node-server/serve-static'

import { readFile, writeFile } from 'fs/promises'

import config from '../config.json'

console.log(config)

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/leases', async (c) => {
  try {
    const leases = await readFile(config.dhcpleases, 'utf8')
    const leasesLines = leases.split('\n')
    const clients = leasesLines.map(line => ({ mac: line.split(' ')[1], ip: line.split(' ')[2], name:line.split(' ')[3]}))

    return c.json(clients)
  } catch (error) {
    return c.json(error)
  }
})

const port = config.httpport

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
