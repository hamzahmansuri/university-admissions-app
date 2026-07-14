from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import School

router = APIRouter(prefix="/schools", tags=["schools"])


@router.get("")
def list_schools(
    state: Optional[str] = None,
    min_rank: Optional[int] = None,
    max_rank: Optional[int] = None,
    min_acceptance_rate: Optional[float] = None,
    max_acceptance_rate: Optional[float] = None,
    db: Session = Depends(get_db),
):
    query = db.query(School)

    if state:
        query = query.filter(School.state == state.upper())
    if min_rank is not None:
        query = query.filter(School.rank >= min_rank)
    if max_rank is not None:
        query = query.filter(School.rank <= max_rank)
    if min_acceptance_rate is not None:
        query = query.filter(School.acceptance_rate >= min_acceptance_rate)
    if max_acceptance_rate is not None:
        query = query.filter(School.acceptance_rate <= max_acceptance_rate)

    schools = query.order_by(School.rank.asc().nulls_last()).all()

    return [
        {
            "id": s.id,
            "ipeds_id": s.ipeds_id,
            "name": s.name,
            "state": s.state,
            "rank": s.rank,
            "rank_year": s.rank_year,
            "applicants_total": s.applicants_total,
            "admissions_total": s.admissions_total,
            "enrolled_total": s.enrolled_total,
            "acceptance_rate": float(s.acceptance_rate) if s.acceptance_rate is not None else None,
        }
        for s in schools
    ]
