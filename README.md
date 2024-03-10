# Stokk

Stokk is a simple stock management application built with React and TypeScript. It allows users to manage their stock items, view their stock levels, and add new stock items.

## Frameworks & Libraries

| Name       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| React      | A JavaScript library for building user interfaces                |
| TypeScript | A typed superset of JavaScript that compiles to plain JavaScript |
| Shadcn UI  | A simple and lightweight UI library for React                    |
| Laravel    | Fullstack PHP framework for web development                      |
| Postgres   | Open source object-relational database system                    |

## Seeder Accounts

| Email           | Password |
| --------------- | -------- |
| admin@gmail.com | admin123 |

## Project Setup

1. Clone the repository

```bash
git clone https://github.com/vrizas/stokk.git
```

2. Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

3. Install the dependencies

```bash
# for the backend
composer install

# for the frontend
npm install
```

4. Generate the application key

```bash
php artisan key:generate
```

5. Create a postgres database and update the `.env` file with the database credentials

```bash
# example
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

6. Migrate and seed the database

```bash
php artisan migrate --seed
```

7. Run the application (open 2 terminals)

```bash
# for the frontend
npm run dev

# for the backend
php artisan serve
```
