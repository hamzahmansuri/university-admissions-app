# University Admissions Explorer

A web app for exploring college admissions data (IPEDS + US News), with
filterable results and a scatter plot of acceptance rate vs. rank.

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Deployment: Railway

## Project Structure
```
university-admissions-app/
├── frontend/          # React app
├── backend/           # FastAPI app
├── data/              # Source CSVs (not committed)
└── README.md
```

## Local Development

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your local DB credentials
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```bash
sudo service postgresql start
psql -U postgres -c "CREATE DATABASE admissions_db;"
python3 backend/load_data.py
```
