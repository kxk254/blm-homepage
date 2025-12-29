# blm-homepage

### tailscale funnel

#### reset old state
sudo tailscale serve reset
sudo tailscale funnel off


### New Page
sudo tailscale serve https / http://localhost:8080
sudo tailscale funnel 443 on



                   Internet
                     |
           +---------+---------+
           |       Cloudflare  |
           | DNS + optional FW |
           +---------+---------+
                     |
          Public IP (Mailcow server)
                     |
          -------------------------
          |                       |
    Mailcow (SMTP/IMAP/POP3)   Docker Web Services
    blmf.jp mail                blmf.jp website

Internet
   |
   v
[Server with public IP]  ← 203.0.113.42
   ├─ Mailcow Docker → handles SMTP/IMAP/POP3
   └─ Website Docker/nginx → serves HTTP/HTTPS



# ===== Cloudflare Tunnel

1.  cloudflared tunnel login
cmd:  cloudflared tunnel login
If you wish to copy your credentials to a server, they have been saved to:
/home/konno/.cloudflared/cert.pem

2. create tunnel
cmd:  cloudflared tunnel create backup-server

Tunnel credentials written to /home/konno/.cloudflared/18b4d133-31d2-4196-8eb4-60801ed7d3a5.json. cloudflared chose this file based on where your origin certificate was found. Keep this file secret. To revoke these credentials, delete the tunnel.

Created tunnel backup-server with id 18b4d133-31d2-4196-8eb4-60801ed7d3a5

3. create config file
mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
sudo chown root:root /etc/cloudflared/config.yml
sudo chmod 644 /etc/cloudflared/config.yml

/////
tunnel: 18b4d133-31d2-4196-8eb4-60801ed7d3a5
credentials-file: /home/konno/.cloudflared/18b4d133-31d2-4196-8eb4-60801ed7d3a5.json

ingress:
  # Route your root domain to local service
  - hostname: blmf.jp
    service: http://127.0.0.1:8080

  # Optional: catch-all 404 for any other requests
  - service: http_status:404
  //////

blmf.jp → 18b4d133-31d2-4196-8eb4-60801ed7d3a5.cfargotunnel.com

4. create DNS

cmd:  cloudflared tunnel route dns backup-server blmf.jp


==> 2025-12-29T13:55:48Z INF Added CNAME blmf.jp which will route to this tunnel tunnelID=18b4d133-31d2-4196-8eb4-60801ed7d3a5

## check the CNAME
cmd:  dig blmf.jp CNAME
blmf.jp.                1800    IN      SOA     mia.ns.cloudflare.com. dns.cloudflare.com. 2392502268 10000 2400 604800 1800

cmd:  dig blmf.jp A
blmf.jp.                300     IN      A       104.21.1.55
blmf.jp.                300     IN      A       172.67.128.159

5. run the tunnel

cloudflared tunnel run backup-server

6. use Systemd for production
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared


::::::::