# blm-homepage

## 開発環境の起動（Dockerなし）

Postgresは開発機・本番サーバーいずれもDocker化せず、ネイティブインストールしたものを使う。
backend(FastAPI)・frontend(Next.js)はDockerなしで直接起動して開発できる。

### 1. バックエンド (FastAPI)
```bash
cd backend
python3 -m venv .venv               # 初回のみ
source .venv/bin/activate
pip install -r requirements.txt     # 初回のみ
cp .env.example .env                # 初回のみ。DATABASE_URL等を編集する
uvicorn app.main:app --reload --port 8000
```

### 2. フロントエンド (Next.js)
```bash
cd frontend
npm install                         # 初回のみ
cp .env.example .env.local          # 初回のみ
# .env.localのBACKEND_INTERNAL_URLをhttp://localhost:8000にしておく
npm run dev
```
http://localhost:3000 で確認できる。nginxを経由しなくても、`next.config.ts`の`rewrites()`が
ブラウザ側の相対パス`/api/...`をbackendへ転送してくれる。

`docker compose up` が必要になるのは、本番同様nginx経由の構成をまるごと確認したい時か、
実際にデプロイする時だけ。

## DB設定（本番・開発共通、Postgresはネイティブ管理）

Postgresはdocker-composeの中では動かさず、サーバー（または開発機）に直接インストールした
ものを使う。docker-compose上のbackendコンテナからもこのPostgresへネットワーク経由で接続する。

### 1. ロール/データベース作成
```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE blm WITH LOGIN PASSWORD '実際のパスワードに置き換える';
CREATE DATABASE blm OWNER blm;
SQL
```

### 2. 接続許可 (pg_hba.conf)
`/etc/postgresql/16/main/pg_hba.conf` に追記する（Dockerコンテナのブリッジ網・LANからの
接続を許可する場合の例）:
```
host    blm    blm    172.16.0.0/12    scram-sha-256
host    blm    blm    192.168.11.0/24  scram-sha-256
```
`postgresql.conf`の`listen_addresses = '*'`も必要（Ubuntu/Debianのパッケージ版はデフォルトで有効なことが多い）。

### 3. 反映
```bash
sudo systemctl restart postgresql
```
ufwが有効な場合は5432ポートも許可する:
```bash
sudo ufw allow from 172.16.0.0/12 to any port 5432
sudo ufw allow from 192.168.11.0/24 to any port 5432
```

### 4. スキーマ作成・管理者アカウント
```bash
cd backend
source .venv/bin/activate
alembic upgrade head
python scripts/create_admin.py <email> <password>
python scripts/seed.py   # 動作確認用のダミー商品を入れる場合のみ
```

`backend/.env`の`DATABASE_URL`は `postgresql+asyncpg://blm:<パスワード>@<Postgresのホスト>:5432/blm`
の形式。Postgresをコンテナ化していないので、docker-compose経由でbackendを起動する場合も
このURLはPostgresが実際に動いているホストのIP（開発機のLAN IPや本番サーバー自身のIP）を指す。

---

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
# Container start
docker compose -p blm down
docker compose -p blm up -d 

# VENV
source venv/bin/activate

python manage.py runserver

docker compose down

docker compose up -d --build

docker container prune

docker volume rm

docker image rmi

docker volume prune 
docker network prune 
docker system prune 
docker builder prune 
docker system df

### Postgres down
sudo lsof -i :5432
sudo systemctl stop postgresql


## git operation
### Daily workflow
git fetch --prune git checkout main git pull --ff-only

### When starting new work
git checkout -b feature/foo

### When switching PCs
Just push before leaving:
git push origin feature/foo

### Then on the other PC:
git fetch git checkout feature/foo

Delete merged branches locally git branch --merged main | grep -v main | xargs git branch -d

Auto-remove deleted remote branches git fetch --prune

### Or permanently:
git config --global fetch.prune true

### Option 3: “Reset to remote” when things get messy
If your local repo is messy but you don’t want to reclone:
git fetch origin git reset --hard origin/main git clean -fd

- This gives you a fresh state equivalent to re-clone, but faster.
⚠️ This deletes uncommitted work.

### Option 4: Worktrees (advanced but very clean)
If you often switch branches:
git worktree add ../repo-feature feature/foo
