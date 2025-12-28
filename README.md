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