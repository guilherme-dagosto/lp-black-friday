/**
 * Preview local do checkout da Guru com a tag do GTM injetada.
 *
 *   node gtm/preview-server.js            -> http://localhost:8080
 *   PORT=3000 CHECKOUT=/pl/black-297 node gtm/preview-server.js
 *
 * Faz proxy de https://pay.meurestart.com, injeta gtm/checkout-guru.html no
 * HTML e recarrega a página sozinho quando o arquivo da tag é salvo.
 * Uso só para desenvolvimento: não finalize compras por aqui.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const tls = require('tls');

// Se houver HTTPS_PROXY no ambiente, conecta à Guru por um túnel CONNECT.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;
class TunnelAgent extends https.Agent {
  createConnection(opts, cb) {
    const p = new URL(PROXY);
    const r = http.request({
      host: p.hostname, port: p.port || 80, method: 'CONNECT',
      path: `${opts.host}:${opts.port || 443}`,
      headers: p.username ? { 'proxy-authorization': 'Basic ' + Buffer.from(decodeURIComponent(p.username) + ':' + decodeURIComponent(p.password)).toString('base64') } : {},
    });
    r.on('connect', (res, socket) => {
      if (res.statusCode !== 200) return cb(new Error('proxy CONNECT ' + res.statusCode));
      cb(null, tls.connect({ socket, servername: opts.host }));
    });
    r.on('error', cb);
    r.end();
  }
}
const agent = PROXY ? new TunnelAgent({ keepAlive: true }) : undefined;

const PORT = Number(process.env.PORT || 8080);
const ORIGIN = 'pay.meurestart.com';
const CHECKOUT = process.env.CHECKOUT || '/pl/black-297';
const TAG_FILE = path.join(__dirname, 'checkout-guru.html');

let tagVersion = Date.now();
fs.watchFile(TAG_FILE, { interval: 300 }, () => {
  tagVersion = Date.now();
  console.log('[preview] tag alterada, recarregando a página');
});

const RELOADER = `<script>(function(){var v=null;setInterval(function(){fetch('/__tag-version',{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){if(v&&t!==v)location.reload();v=t}).catch(function(){})},800)})();</script>`;

function inject(html) {
  const tag = fs.readFileSync(TAG_FILE, 'utf8');
  // Roda depois que o app React montou, como um acionador "DOM pronto"/"Window Loaded".
  const scriptBody = (tag.match(/<script>([\s\S]*)<\/script>/) || [])[1] || '';
  const delayed = `<script>window.addEventListener('load',function(){setTimeout(function(){${scriptBody}\n},300)});</script>`;
  return html.replace('</body>', RELOADER + delayed + '</body>');
}

http.createServer((req, res) => {
  if (req.url === '/__tag-version') {
    res.writeHead(200, { 'content-type': 'text/plain', 'cache-control': 'no-store' });
    return res.end(String(tagVersion));
  }
  if (req.url === '/' || req.url === '') {
    res.writeHead(302, { location: CHECKOUT });
    return res.end();
  }

  const headers = { ...req.headers, host: ORIGIN };
  delete headers['accept-encoding'];
  if (headers.origin) headers.origin = `https://${ORIGIN}`;
  if (headers.referer) headers.referer = headers.referer.replace(/^https?:\/\/[^/]+/, `https://${ORIGIN}`);

  const up = https.request({ host: ORIGIN, port: 443, path: req.url, method: req.method, headers, agent }, (ur) => {
    const h = { ...ur.headers };
    delete h['content-security-policy'];
    delete h['x-frame-options'];
    delete h['strict-transport-security'];
    if (h.location) h.location = h.location.replace(`https://${ORIGIN}`, '');
    if (h['set-cookie']) {
      h['set-cookie'] = [].concat(h['set-cookie']).map((c) =>
        c.replace(/;\s*Domain=[^;]+/i, '').replace(/;\s*Secure/i, '').replace(/;\s*SameSite=None/i, '; SameSite=Lax'));
    }

    const isHtml = /text\/html/.test(h['content-type'] || '');
    if (!isHtml) {
      res.writeHead(ur.statusCode, h);
      return ur.pipe(res);
    }

    const chunks = [];
    ur.on('data', (c) => chunks.push(c));
    ur.on('end', () => {
      let buf = Buffer.concat(chunks);
      const enc = h['content-encoding'];
      try {
        if (enc === 'gzip') buf = zlib.gunzipSync(buf);
        else if (enc === 'br') buf = zlib.brotliDecompressSync(buf);
        else if (enc === 'deflate') buf = zlib.inflateSync(buf);
      } catch (e) { /* keep as is */ }
      delete h['content-encoding'];
      const out = Buffer.from(inject(buf.toString('utf8')));
      h['content-length'] = out.length;
      h['cache-control'] = 'no-store';
      res.writeHead(ur.statusCode, h);
      res.end(out);
    });
  });
  up.on('error', (e) => { res.writeHead(502); res.end('Proxy error: ' + e.message); });
  req.pipe(up);
}).listen(PORT, () => console.log(`[preview] http://localhost:${PORT}${CHECKOUT}`));
