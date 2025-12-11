# 🚀 Деплой Aman AI на сервер

## Данные сервера
- **IP:** 89.218.178.215
- **User:** administrator
- **Password:** Idet2020

---

## Шаг 1: Подключись к серверу

```bash
ssh administrator@89.218.178.215
# Введи пароль: Idet2020
```

---

## Шаг 2: Установи Docker (выполни на сервере)

```bash
# Обнови систему
sudo apt update && sudo apt upgrade -y

# Установи Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установи Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перелогинься чтобы применились права Docker
exit
```

Подключись снова:
```bash
ssh administrator@89.218.178.215
```

---

## Шаг 3: Создай папку проекта

```bash
sudo mkdir -p /opt/aman-ai
sudo chown -R $USER:$USER /opt/aman-ai
cd /opt/aman-ai
```

---

## Шаг 4: Загрузи проект

**Вариант A — через Git (если есть репозиторий):**
```bash
git clone https://github.com/YOUR_REPO/aman-ai.git .
```

**Вариант B — через SCP (с твоего компьютера):**
Открой новый терминал на своём компьютере:
```powershell
cd C:\Users\alnur\Documents\aman
scp -r * administrator@89.218.178.215:/opt/aman-ai/
```

---

## Шаг 5: Создай .env файл

```bash
cd /opt/aman-ai
nano .env
```

Вставь это содержимое:
```env
DATABASE_URL="postgresql://aman:amanai2024secure@db:5432/amanai"
DB_PASSWORD="amanai2024secure"
AUTH_SECRET="aman-ai-production-secret-2024"
AUTH_URL="http://89.218.178.215"
SECRET_KEY="backend-api-secret-key-2024"
NODE_ENV="production"
```

Сохрани: `Ctrl+X`, `Y`, `Enter`

---

## Шаг 6: Запусти Docker

```bash
cd /opt/aman-ai

# Собери и запусти контейнеры
docker-compose -f docker-compose.prod.yml up -d --build

# Подожди 30 секунд пока база поднимется
sleep 30

# Примени миграции
docker-compose -f docker-compose.prod.yml exec frontend npx prisma db push

# Создай тестовых пользователей
docker-compose -f docker-compose.prod.yml exec frontend npm run db:seed
```

---

## Шаг 7: Проверь

Открой в браузере:
- **Frontend:** http://89.218.178.215
- **Backend API:** http://89.218.178.215:8000/docs

### Тестовые аккаунты:
| Email | Пароль | Роль |
|-------|--------|------|
| patient@test.com | test123 | Пациент |
| doctor@test.com | test123 | Врач |
| admin@test.com | test123 | Админ |

---

## Полезные команды

```bash
# Посмотреть логи
docker-compose -f docker-compose.prod.yml logs -f

# Перезапустить
docker-compose -f docker-compose.prod.yml restart

# Остановить
docker-compose -f docker-compose.prod.yml down

# Пересобрать
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

**Если порт 80 занят:**
```bash
sudo lsof -i :80
sudo systemctl stop apache2  # или nginx
```

**Если Docker не запускается:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```


