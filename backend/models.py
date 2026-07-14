from sqlalchemy import Column, Integer, Numeric, String

from database import Base


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True)
    ipeds_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    state = Column(String(2), index=True)
    rank = Column(Integer, index=True)
    rank_year = Column(Integer)
    applicants_total = Column(Integer)
    admissions_total = Column(Integer)
    enrolled_total = Column(Integer)
    acceptance_rate = Column(Numeric(5, 2), index=True)
