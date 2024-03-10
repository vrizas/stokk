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

## Project Setup

1. Clone the repository

```bash
git clone https://github.com/vrizas/stokk.git
```

2. Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

3. Generate the application key

```bash
php artisan key:generate
```

4. Install the dependencies

```bash
composer install

npm install
```

5. Create a postgres database and update the `.env` file with the database credentials
6. Migrate and seed the database

```bash
php artisan migrate --seed
```

7. Run the application (open 2 terminals)

```bash
npm run dev

php artisan serve
```
