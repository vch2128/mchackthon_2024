# Dennis Branch

## Quick Start
- install package in frontend
```bash
cd frontend
npm install
```
- only check frontend page
```bash
cd frontend
npm run dev
```
- build docker
```
docker-compose up --build
```
if ducker build successfully, you should be directed to a login page. You can use the following user/password pair to login.
-- login pair
```text
"name": "frankeeeee"
"password": "qweffe"
```
or create a new user running the following script
```sh
curl -X POST "http://localhost:8001/api/employee" \
     -H "Content-Type: application/json" \
     -d '{
            "name": "frankeeeee",
            "account": "frank6999",
            "password": "qweffe",
            "department": "cs engineering"
         }'
```
## Page Logic
All the we pages are stored in /frontend/src/pages; a .tsx can be a page or component. 

## Build dodcker

```bash
docker-compose up --build
```

## MongoDB stsrt

## Frontend start

- setup frontend using vite and typescript

```bash
npm create vite@latest . -- --template react-ts
npm install
```

```bash
npm install
npm start
```

## Backend start
