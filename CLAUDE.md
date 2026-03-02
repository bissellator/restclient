# REST Client

A simple REST client available as both a web app and standalone Windows desktop application.

## Running

**Web version (no dependencies):**
```bash
node server.js
```
Open http://localhost:8010

**Desktop app (Electron):**
```bash
npm install
npm start
```

**Build Windows installer:**
```bash
npm run build
```
The installer will be in `dist/` folder.

## Project Structure

```
restclient/
├── CLAUDE.md          # Project instructions
├── package.json       # Electron dependencies and build config
├── main.js            # Electron entry point
├── server.js          # HTTP server + proxy endpoint
└── public/
    ├── index.html     # Main UI with embedded CSS/JS
    └── logo.png       # App icon
```

---

## Southern Cross: Technical Principles

The Southern Cross is our collection of technical directives that shape code design decisions. All architectural choices and engineering execution decisions are viewed through this lens:

- **Make Keys Predictable**: Data objects such as cache keys, log file names, and rules should be reproducible through simple rules (such as combining userId, tenantId, and Statement into a hash)

- **Don't Add Unnecessary Dependencies**: We don't want to include libraries where a few lines of code will do. We want to avoid worrying about exploits and vulnerabilities from inherited code

- **Make it as Portable as Possible**: We don't want to be tied to a single vendor or platform. The code should be able to run locally, on AWS, on Azure, in Docker, etc.

- **Keep it Inexpensive**: Avoid requiring expensive resources like GPU powered tools or large EC2 instances where a microservice would serve just as well

- **Make it Scalable**: We should be able to handle hundreds of thousands of transactions, but we should be able to scale down when we have no traffic at all

- **Keep the Code Tight**: Don't create overly complex code. For example, a simple regex might work better than a complex series of transformations

- **Keep it Stateless**: Idempotency is king, our running instances are cattle, not pets and can be swapped out with no impact on the system

- **Minimize Chatter to Other Services**: If we're going to use an object from another system (e.g., tenant list from the API), try to avoid going back over and over if we use that same data multiple times in the code

- **Make Functions as Reusable as Possible and Then Reuse Them**: Prioritize building reusable components and leverage them throughout the codebase

- **Keep Security in Mind Always**: Never expose keys in tickets or anything to be checked into git. Keep HIPAA, GDPR and SOX compliance in mind

- **Don't Obscure Errors in Dev Mode**: Dev needs to know what's going on, prod needs to give support enough detail without exposing exploits
