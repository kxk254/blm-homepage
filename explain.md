### Install Tailscale

curl -fsSL https://tailscale.com/install.sh | sh



ホスト名	TYPE	TTL	VALUE
www        CNAME   3600  kenji-konno-inspiron-3180.tailf2fd85.ts.net

設定していただいたDNSレコードを有効にする場合、
該当ドメインのネームサーバーを以下に設定する必要がございます。

　　　プライマリネームサーバー.............: 01.dnsv.jp
　　　セカンダリネームサーバー.............: 02.dnsv.jp

■ネームサーバー変更の手順は以下をご確認ください。
https://www.onamae.com/guide/details.php?g=17



===== TAILSCALE START

sudo tailscale funnel -bg 8080

sudo tailscale up --funnel
sudo tailscale funnel enable

https://backup-server.tailf2fd85.ts.net/
|-- proxy http://127.0.0.1:8080

Funnel started and running in the background.
To disable the proxy, run: tailscale funnel --https=443 off

===== DOCKER STAR COMMAND
cd /home/kenji-konno/blm-homepage
docker build -t blm-nginx .
docker rm -f blm-nginx

docker run -d -p 8080:80 --name blm-nginx blm-nginx


===== Cloudflare Tunnel

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

