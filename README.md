# Bharadwaz Portfolio

Personal developer portfolio for **G Bharadwaz Naga Venkata Ramana**.
Dark terminal-style dashboard with a live system log, project popups, and a working contact form.

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Zod, Lucide
- **Backend:** Node.js, Express, MongoDB (Mongoose), Zod, Helmet, express-rate-limit, CORS

## Features

- Two-panel dashboard on desktop, single column on phones and tablets
- **Live system log**: every click, section change and form event is written to the log
- **Built-in terminal**: press `/` and type `help` (`projects`, `open 2`, `cv`, `email`, `clear` ...)
- Top 3 projects on the main page; the **All** button opens a large popup with every project (`/projects`)
- Project detail popup with its own URL (`/projects/<slug>`), arrow keys and Esc
- Contact form with validation, loading, success and error states, saved to MongoDB
- Toast notifications, copy-email button, CV download, fullscreen button, intro screen
- Keyboard friendly, reduced-motion support, SEO tags, 404 page

## 1. Run locally

You need Node.js 18.18 or newer.

```bash
# 1. install
npm run install:all

# 2. backend settings
cp server/.env.example server/.env      # then put your MongoDB URI in server/.env

# 3. start backend (terminal 1)  -> http://localhost:5000
npm run dev:server

# 4. start frontend (terminal 2) -> http://localhost:5173
npm run dev:client
```

The frontend forwards `/api` to `http://localhost:5000` in development, so `client/.env` is optional locally.

Other commands:

```bash
npm test        # backend API tests (no database needed)
npm run build   # production build of the frontend -> client/dist
```

## 2. Things you need to add

| What | Where |
| --- | --- |
| Resume PDF | Save as `client/public/Bharadwaz_Resume.pdf` |
| Your photo | Save as `client/public/profile.jpg`, then set `photo: '/profile.jpg'` in `client/src/data/portfolio.js` |
| LinkedIn URL | `client/src/data/portfolio.js` -> `links.linkedin` |
| Project GitHub / live links | `client/src/data/portfolio.js` -> each project `github` / `live` |
| More projects | `client/src/data/portfolio.js` -> copy a project block. `featured: true` shows it on the main page (first 3), all projects show in the All popup |
| Certificate link (optional) | `client/src/data/portfolio.js` -> `certifications[].url` |
| MongoDB URI | `server/.env` -> `MONGODB_URI` |

Empty links are hidden automatically, so nothing on the site is broken while they are missing.
All text content lives in **`client/src/data/portfolio.js`**.

## 3. Environment variables

**server/.env**

| Name | Required | Example | Meaning |
| --- | --- | --- | --- |
| `MONGODB_URI` | yes | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` | MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | yes | `https://your-site.vercel.app` | Allowed frontend URL(s), comma-separated, no trailing slash |
| `NODE_ENV` | production | `production` | Hides stack traces |
| `PORT` | no | `5000` | Render sets this automatically |
| `RATE_LIMIT_WINDOW_MINUTES` | no | `15` | Rate limit window |
| `RATE_LIMIT_MAX` | no | `5` | Messages allowed per window per IP |
| `TRUST_PROXY` | no | `1` | Proxy hops (defaults to 1 in production) |
| `TELEGRAM_BOT_TOKEN` | no | `1234567890:AAE...` | Telegram bot token for alerts |
| `TELEGRAM_CHAT_ID` | no | `123456789` | Your Telegram chat id |
| `WHATSAPP_PHONE` | no | `919876543210` | Your WhatsApp number for alerts (digits, with country code) |
| `WHATSAPP_APIKEY` | no | `1234567` | CallMeBot API key |

**client/.env**

| Name | Required | Example | Meaning |
| --- | --- | --- | --- |
| `VITE_API_URL` | in production | `https://bharadwaz-portfolio-api.onrender.com` | Backend URL, no trailing slash |
| `VITE_SITE_URL` | recommended | `https://your-site.vercel.app` | Used for link previews (Open Graph) |

## 4. API

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/health` | Server and database status |
| `POST` | `/api/contact` | Saves a message |

`POST /api/contact` body: `{ "name", "email", "subject", "message" }`

| Status | Meaning |
| --- | --- |
| 201 | Saved |
| 400 | Invalid data (response has `errors` per field) |
| 413 | Body too large |
| 429 | Rate limit reached |
| 503 | Database not connected |

Messages are stored in the `messages` collection. Read them in MongoDB Atlas -> Browse Collections.

## Phone alerts (optional)

Get a message on your phone each time someone uses the contact form.
Messages are always saved in MongoDB first. If an alert fails, nothing is lost.

### Telegram (recommended: free and official)

1. In Telegram, search for **@BotFather** and open it.
2. Send `/newbot`, then give the bot a name and a username ending in `bot`.
3. BotFather replies with a **token** like `1234567890:AAExampleToken`. Copy it.
4. Open your new bot's chat and send it any message, for example `hi`.
5. In a browser, open this address with your token in place of `<TOKEN>`:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Find `"chat":{"id":123456789` in the text. That number is your **chat id**.
7. Add both to `server/.env` (and to Render when you deploy):
   ```
   TELEGRAM_BOT_TOKEN=1234567890:AAExampleToken
   TELEGRAM_CHAT_ID=123456789
   ```
8. Restart the server. It prints `Telegram alerts: on`.

### WhatsApp (CallMeBot, third-party, may be unavailable)

1. Open https://www.callmebot.com, go to the WhatsApp API page and follow the activation steps.
2. Add the phone (digits with country code) and the API key to `server/.env`:
   ```
   WHATSAPP_PHONE=919876543210
   WHATSAPP_APIKEY=your-key-here
   ```
3. Restart the server. It prints `WhatsApp alerts: on`.

You can use one channel, both, or none.

## 5. Deploy

### Database: MongoDB Atlas
1. Create a free cluster.
2. Database Access -> add a user with a password.
3. Network Access -> allow `0.0.0.0/0` (Render has changing IPs).
4. Connect -> Drivers -> copy the URI and add `/portfolio` before the `?`.

### Backend: Render
1. Push this project to GitHub.
2. Render -> New -> Web Service -> pick the repo.
3. Root Directory: `server` | Build: `npm install` | Start: `npm start`
4. Add env vars: `NODE_ENV=production`, `MONGODB_URI=...`, `CLIENT_ORIGIN=https://your-site.vercel.app`
5. Deploy, then open `https://<your-api>.onrender.com/api/health` (should show `"database":"connected"`).

(Or use the included `render.yaml` with Render Blueprints.)

### Frontend: Vercel
1. Vercel -> Add New Project -> pick the repo.
2. Root Directory: `client` (framework: Vite, build `npm run build`, output `dist`).
3. Add env vars: `VITE_API_URL=https://<your-api>.onrender.com`, `VITE_SITE_URL=https://your-site.vercel.app`
4. Deploy.
5. Go back to Render and make sure `CLIENT_ORIGIN` is exactly your Vercel URL.

Note: Render's free plan sleeps when idle. The first message after a pause can take up to a minute; the form shows a "Waking the server" hint.

## 6. Project structure

```
bharadwaz-portfolio/
├── client/
│   ├── public/            favicon, og-image, (your resume PDF)
│   └── src/
│       ├── data/          portfolio.js  <- all content
│       ├── sections/      Hero, Projects, Experience, Skills, Contact ...
│       ├── components/    Header, SystemLog, ProjectModal, ContactForm ...
│       ├── context/       log, toast, boot state
│       ├── hooks/         active section, terminal commands, focus trap ...
│       ├── lib/           api, validation schema, helpers
│       └── pages/         Home, NotFound
├── server/
│   ├── config/            env, database
│   ├── controllers/  routes/  middleware/  models/  validators/  utils/
│   ├── tests/             API tests
│   ├── app.js             Express app
│   └── server.js          start-up
├── render.yaml
└── README.md
```

## 7. Add your own log messages

Any clickable element can write to the system log:

```jsx
<button data-log="Opened my new feature">Open</button>
```

Or from code: `const { log } = useLog(); log('Something happened', 'ok');`
