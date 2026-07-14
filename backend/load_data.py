"""
Merge College_Ranking_Data_V2.csv (name/state/rank by year) with
Data_5-6-2025.csv (raw IPEDS applicants/admissions counts) on IPEDS ID,
compute acceptance rate, and load the result into the `schools` table.
"""

import csv
from pathlib import Path

from database import Base, SessionLocal, engine
from models import School

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RANKING_CSV = DATA_DIR / "College_Ranking_Data_V2.csv"
IPEDS_CSV = DATA_DIR / "Data_5-6-2025.csv"

# Rank columns in the ranking CSV, newest first.
RANK_YEARS = [str(y) for y in range(2025, 1983, -1)]


def latest_rank(row: dict) -> tuple[int | None, int | None]:
    for year in RANK_YEARS:
        value = row.get(year, "").strip()
        if value:
            return int(value), int(year)
    return None, None


def to_int(value: str) -> int | None:
    value = (value or "").strip()
    return int(value) if value else None


def load_ipeds_by_id() -> dict[int, dict]:
    with open(IPEDS_CSV, newline="", encoding="utf-8") as f:
        rows = csv.DictReader(f)
        return {int(row["UnitID"]): row for row in rows if row.get("UnitID", "").strip()}


def build_schools() -> list[dict]:
    ipeds_by_id = load_ipeds_by_id()
    schools = []

    with open(RANKING_CSV, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            ipeds_id = to_int(row.get("IPEDS", ""))
            if ipeds_id is None:
                continue

            rank, rank_year = latest_rank(row)
            ipeds_row = ipeds_by_id.get(ipeds_id, {})

            applicants = to_int(ipeds_row.get("Applicants total (ADM2023)", ""))
            admissions = to_int(ipeds_row.get("Admissions total (ADM2023)", ""))
            enrolled = to_int(ipeds_row.get("Enrolled total (ADM2023)", ""))

            acceptance_rate = None
            if applicants and admissions is not None:
                acceptance_rate = round(100 * admissions / applicants, 2)

            schools.append(
                {
                    "ipeds_id": ipeds_id,
                    "name": row["University Name"].strip(),
                    "state": row["State"].strip(),
                    "rank": rank,
                    "rank_year": rank_year,
                    "applicants_total": applicants,
                    "admissions_total": admissions,
                    "enrolled_total": enrolled,
                    "acceptance_rate": acceptance_rate,
                }
            )

    return schools


def main():
    Base.metadata.create_all(bind=engine)
    schools = build_schools()

    db = SessionLocal()
    try:
        db.query(School).delete()
        db.bulk_insert_mappings(School, schools)
        db.commit()
    finally:
        db.close()

    with_rank = sum(1 for s in schools if s["rank"] is not None)
    with_rate = sum(1 for s in schools if s["acceptance_rate"] is not None)
    print(f"Loaded {len(schools)} schools ({with_rank} with a rank, {with_rate} with an acceptance rate).")


if __name__ == "__main__":
    main()
