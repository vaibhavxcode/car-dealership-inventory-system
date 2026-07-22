const https = require('https');

/**
 * Resolves a mongodb+srv URI by querying Google DNS-over-HTTPS API.
 * Returns a standard mongodb:// URI with direct shard hosts.
 */
const resolveSrvUri = async (uri) => {
  if (!uri || !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  // Parse the URI
  // Format: mongodb+srv://username:password@hostname/database?options
  const regex = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?#]+)(.*)$/;
  const match = uri.match(regex);

  if (!match) {
    return uri; // Fail-safe: return original if format doesn't match
  }

  const [, username, password, hostname, rest] = match;

  // Perform DNS over HTTPS request to Google DNS API
  const srvDomain = `_mongodb._tcp.${hostname}`;
  const dnsUrl = `https://dns.google/resolve?name=${srvDomain}&type=SRV`;

  return new Promise((resolve) => {
    https.get(dnsUrl, { timeout: 5000 }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.Answer && json.Answer.length > 0) {
            const hosts = json.Answer.map((answer) => {
              // data field format: "priority weight port target"
              const parts = answer.data.split(' ');
              const port = parts[2];
              let target = parts[3];
              if (target.endsWith('.')) {
                target = target.slice(0, -1);
              }
              return `${target}:${port}`;
            });

            const resolvedHosts = hosts.join(',');
            
            // Append standard SSL options for Node driver with Atlas shards
            let extraOptions = '';
            if (!rest.includes('ssl=') && !rest.includes('tls=')) {
              extraOptions += '&ssl=true';
            }
            if (!rest.includes('authSource=')) {
              extraOptions += '&authSource=admin';
            }

            let restClean = rest;
            if (restClean.includes('?')) {
              restClean += extraOptions;
            } else {
              restClean += '?' + extraOptions.slice(1);
            }

            const resolvedUri = `mongodb://${username}:${password}@${resolvedHosts}${restClean}`;
            console.log('🔄 DNS-over-HTTPS resolved Atlas SRV hosts successfully to standard connection string.');
            resolve(resolvedUri);
          } else {
            console.warn('⚠️ Google DoH returned no SRV records. Using original connection string.');
            resolve(uri);
          }
        } catch (e) {
          console.warn('⚠️ Failed to parse Google DoH response. Using original connection string.');
          resolve(uri);
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️ Google DoH request failed (${err.message}). Using original connection string.`);
      resolve(uri);
    });
  });
};

module.exports = resolveSrvUri;
