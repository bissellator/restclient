const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 8010;
const publicPath = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

function serveStatic(req, res) {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(publicPath, filePath);

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function handleProxyRequest(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const debug = {
            timestamp: new Date().toISOString(),
            steps: []
        };

        const addDebug = (step, details) => {
            debug.steps.push({ step, details, time: new Date().toISOString() });
        };

        let requestData;
        try {
            requestData = JSON.parse(body);
            addDebug('Parse request', { success: true });
        } catch (e) {
            addDebug('Parse request', { success: false, error: e.message });
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON in request body', debug }));
            return;
        }

        const { method, url, headers, requestBody } = requestData;
        addDebug('Request params', { method, url, headerCount: Object.keys(headers || {}).length, hasBody: !!requestBody });

        if (!url) {
            addDebug('Validation', { error: 'URL is required' });
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'URL is required', debug }));
            return;
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url);
            addDebug('Parse URL', {
                success: true,
                protocol: parsedUrl.protocol,
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 'default',
                path: parsedUrl.pathname + parsedUrl.search
            });
        } catch (e) {
            addDebug('Parse URL', { success: false, error: e.message, urlReceived: url });
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Invalid URL: "${url}"`, debug }));
            return;
        }

        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        const startTime = Date.now();

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: method || 'GET',
            headers: headers || {}
        };

        addDebug('Outgoing request', {
            hostname: options.hostname,
            port: options.port,
            path: options.path,
            method: options.method,
            headers: options.headers
        });

        const proxyReq = protocol.request(options, (proxyRes) => {
            let responseBody = '';

            proxyRes.on('data', chunk => {
                responseBody += chunk.toString();
            });

            proxyRes.on('end', () => {
                const endTime = Date.now();

                addDebug('Response received', {
                    statusCode: proxyRes.statusCode,
                    statusMessage: proxyRes.statusMessage,
                    headerCount: Object.keys(proxyRes.headers).length,
                    bodyLength: responseBody.length,
                    timing: endTime - startTime
                });

                // Log headers separately for debugging
                addDebug('Response headers', proxyRes.headers);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: proxyRes.statusCode,
                    statusMessage: proxyRes.statusMessage,
                    headers: proxyRes.headers,
                    body: responseBody,
                    timing: endTime - startTime,
                    debug
                }));
            });
        });

        proxyReq.on('error', (e) => {
            addDebug('Request error', { error: e.message, code: e.code });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message, debug }));
        });

        if (requestBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
            addDebug('Request body sent', { length: requestBody.length });
            proxyReq.write(requestBody);
        }

        proxyReq.end();
    });
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/request') {
        handleProxyRequest(req, res);
    } else if (req.method === 'GET') {
        serveStatic(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

function startServer() {
    server.listen(PORT, () => {
        console.log(`REST Client running at http://localhost:${PORT}`);
    });
}

// If run directly, start immediately
if (require.main === module) {
    startServer();
}

module.exports = { startServer };
