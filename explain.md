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

===== DOCKER STAR COMMAND
cd /home/kenji-konno/blm-homepage
docker build -t blm-nginx .
docker rm -f blm-nginx

docker run -d -p 8080:80 --name blm-nginx blm-nginx


===== Cloudflare Tunnel

tunnel: 691a17a6-918c-422a-afaf-e4097c71472b  # Use your actual Tunnel ID or name
credentials-file: /home/YOUR_USERNAME/.cloudflared/691a17a6-918c-422a-afaf-e4097c71472b.json

ingress:
  - hostname: blmf.jp
    service: http://localhost:8080
  - hostname: www.blmf.jp
    service: http://localhost:8080
  - service: http_status:404

cloudflared tunnel login
cloudflared tunnel create blmf-tunnel
cloudflared tunnel route dns blmf.jp blmf-tunnel
cloudflared tunnel run --url http://localhost:8080 blmf-tunnel

sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared

cloudflared tunnel info my-tunnel   → Active connection が表示される

=== change ping rage
sudo sysctl -w net.ipv4.ping_group_range="0 2147483647"