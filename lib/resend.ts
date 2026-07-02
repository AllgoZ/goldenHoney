import https from 'node:https'

const RESEND_API_KEY = process.env.RESEND_API_KEY!
export const FROM     = 'Golden Honey <onboarding@resend.dev>'
export const ADMIN_TO = process.env.ADMIN_EMAIL ?? 'kodaigoldenhoney@gmail.com'

// Force IPv4 — Node 17+ prefers IPv6 by default; on Windows machines without
// a proper IPv6 route all connections to dual-stack hosts like api.resend.com
// time out with ETIMEDOUT / AggregateError.
const agent = new https.Agent({ family: 4 })

export interface SendEmailOptions {
  to:      string | string[]
  subject: string
  html:    string
}

export function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const body = JSON.stringify({
    from:    FROM,
    to:      Array.isArray(to) ? to : [to],
    subject,
    html,
  })

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.resend.com',
        port:     443,
        path:     '/emails',
        method:   'POST',
        agent,
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type':  'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 10_000,
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve()
          } else {
            reject(new Error(`Resend ${res.statusCode}: ${data}`))
          }
        })
      }
    )

    req.on('timeout', () => { req.destroy(); reject(new Error('Resend request timed out')) })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}
