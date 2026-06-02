"""Seed AMS database with initial data."""
import asyncio
from datetime import date, datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole, Department, Program
from app.models.academic import AcademicCalendar, Semester
from app.models.course import Course, CourseOffering, OfferingFaculty
from app.models.enrollment import StudentEnrollment
from app.models import audit, enrollment, grading, research  # noqa: F401
from app.db.base import Base

DEPARTMENTS = [
    ("Agriculture & Veterinary Sciences", "AVS"),
    ("Agronomy", "AGRO"),
    ("Animal Sciences", "ANSC"),
    ("Veterinary Medicine", "VETM"),
    ("Library & Information", "LIBR"),
    ("Finance & Accounts", "FINC"),
    ("Examination Cell", "EXAM"),
    ("Administration", "ADMN"),
]

PROGRAMS = [
    ("B.Sc. Agriculture", "BSCAG", "UG", "AGRO", 4),
    ("M.Sc. Agriculture", "MSCAG", "PG", "AGRO", 2),
    ("Ph.D. Agriculture", "PHDAG", "PhD", "AGRO", 5),
    ("B.V.Sc & A.H.", "BVSC", "UG", "VETM", 5),
    ("M.V.Sc.", "MVSC", "PG", "VETM", 2),
]

USERS = [
    # (email, password, first, last, role, designation, emp_id/roll)
    ("superadmin@avfu.ac.in",  "Admin@123", "Super",    "Admin",   "super_admin",    "System Administrator",     "EMP001", None),
    ("academic@avfu.ac.in",    "Admin@123", "Academic", "Officer", "academic_admin", "Academic Cell Officer",    "EMP002", None),
    ("registrar@avfu.ac.in",   "Admin@123", "Dr. R.K.", "Sharma",  "registrar",      "University Registrar",     "EMP003", None),
    ("examiner@avfu.ac.in",    "Admin@123", "Dr. S.",   "Patel",   "examiner",       "Controller of Exams",      "EMP004", None),
    ("hod.agro@avfu.ac.in",    "Admin@123", "Dr. A.",   "Kumar",   "hod",            "Head of Dept - Agronomy",  "EMP005", None),
    ("hod.vet@avfu.ac.in",     "Admin@123", "Dr. P.",   "Nair",    "hod",            "Head of Dept - Veterinary","EMP006", None),
    ("faculty1@avfu.ac.in",    "Admin@123", "Dr. M.",   "Rao",     "faculty",        "Assistant Professor",      "EMP007", None),
    ("faculty2@avfu.ac.in",    "Admin@123", "Dr. L.",   "Singh",   "faculty",        "Associate Professor",      "EMP008", None),
    ("faculty3@avfu.ac.in",    "Admin@123", "Prof. K.", "Verma",   "faculty",        "Professor",                "EMP009", None),
    ("student1@avfu.ac.in",    "Test@123",  "Rahul",    "Gupta",   "student",        "B.Sc. Agriculture Yr-2",   None, "AVFU/2023/BSCAG/001"),
    ("student2@avfu.ac.in",    "Test@123",  "Priya",    "Sharma",  "student",        "B.Sc. Agriculture Yr-2",   None, "AVFU/2023/BSCAG/002"),
    ("student3@avfu.ac.in",    "Test@123",  "Amit",     "Joshi",   "student",        "M.Sc. Agriculture Yr-1",   None, "AVFU/2024/MSCAG/001"),
    ("student4@avfu.ac.in",    "Test@123",  "Sunita",   "Devi",    "student",        "B.V.Sc & A.H. Yr-3",       None, "AVFU/2022/BVSC/001"),
    ("researcher1@avfu.ac.in", "Test@123",  "Dr. V.",   "Mishra",  "research_supervisor", "Senior Research Fellow", "EMP010", None),
]

COURSES = [
    ("AGR101", "Principles of Agronomy",          "AGRO", 3, 0, "UG"),
    ("AGR102", "Agricultural Meteorology",         "AGRO", 2, 1, "UG"),
    ("AGR201", "Crop Production Technology",       "AGRO", 2, 1, "UG"),
    ("AGR301", "Soil Science and Management",      "AGRO", 3, 0, "UG"),
    ("VET101", "Animal Anatomy",                   "VETM", 2, 1, "UG"),
    ("VET201", "Veterinary Physiology",            "VETM", 2, 1, "UG"),
    ("AGR501", "Advanced Plant Breeding",          "AGRO", 3, 0, "PG"),
    ("AGR502", "Research Methodology",             "AGRO", 2, 0, "PG"),
    ("VET501", "Veterinary Pathology",             "VETM", 3, 0, "PG"),
    ("STAT101","Agricultural Statistics",          "AGRO", 2, 1, "UG"),
    ("HRT101", "Horticulture Basics",              "AGRO", 2, 1, "UG"),
    ("EXT101", "Agricultural Extension",           "AGRO", 2, 0, "UG"),
]

OFFERINGS = [
    # (course_number, section, faculty_email, status, max_enrollment)
    ("AGR101", "A", "faculty1@avfu.ac.in", "published", 60),
    ("AGR102", "A", "faculty1@avfu.ac.in", "published", 55),
    ("AGR201", "A", "faculty2@avfu.ac.in", "published", 50),
    ("AGR301", "A", "hod.agro@avfu.ac.in", "published", 45),
    ("STAT101", "A", "faculty3@avfu.ac.in", "published", 60),
    ("VET101", "A", "faculty2@avfu.ac.in", "published", 40),
    ("VET201", "A", "hod.vet@avfu.ac.in", "published", 40),
    ("AGR501", "PG", "researcher1@avfu.ac.in", "published", 25),
]

ENROLLMENTS = [
    # (student_email, course_number, status, remarks)
    ("student1@avfu.ac.in", "AGR101", "pending", None),
    ("student2@avfu.ac.in", "AGR101", "pending", None),
    ("student3@avfu.ac.in", "AGR501", "pending", None),
    ("student1@avfu.ac.in", "AGR102", "approved", "Approved from seed data."),
    ("student2@avfu.ac.in", "AGR201", "approved", "Approved from seed data."),
    ("student4@avfu.ac.in", "VET101", "pending", None),
]


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as db:
        # Departments
        dept_map = {}
        for name, code in DEPARTMENTS:
            d = Department(name=name, code=code)
            db.add(d); await db.flush()
            dept_map[code] = d.id

        # Programs
        prog_map = {}
        for name, code, level, dept_code, dur in PROGRAMS:
            p = Program(name=name, code=code, level=level, department_id=dept_map.get(dept_code), duration_years=dur)
            db.add(p); await db.flush()
            prog_map[code] = p.id

        # Users
        for email, pw, first, last, role, desig, emp_id, roll in USERS:
            u = User(
                email=email,
                hashed_password=hash_password(pw),
                first_name=first, last_name=last,
                role=UserRole(role),
                designation=desig,
                employee_id=emp_id,
                student_roll=roll,
                department_id=dept_map.get("AGRO"),
                is_active=True, is_verified=True,
            )
            db.add(u)

        await db.flush()

        # Academic Calendar 2024-25
        cal = AcademicCalendar(
            name="2024-25", academic_year="2024-25",
            start_date=date(2024, 7, 1), end_date=date(2025, 5, 31),
            status="active",
        )
        db.add(cal); await db.flush()

        sem1 = Semester(
            calendar_id=cal.id, name="Semester I (Odd)", sem_type="odd",
            start_date=date(2024, 7, 1), end_date=date(2024, 11, 30),
            registration_start=date(2024, 6, 15), registration_end=date(2024, 7, 15),
            exam_start=date(2024, 11, 10), exam_end=date(2024, 11, 30),
            result_declaration=date(2024, 12, 20),
            status="active",
        )
        sem2 = Semester(
            calendar_id=cal.id, name="Semester II (Even)", sem_type="even",
            start_date=date(2025, 1, 1), end_date=date(2025, 5, 31),
            registration_start=date(2024, 12, 15), registration_end=date(2025, 1, 10),
            exam_start=date(2025, 5, 5), exam_end=date(2025, 5, 25),
            result_declaration=date(2025, 6, 15),
            status="upcoming",
        )
        db.add(sem1); db.add(sem2)

        # Courses
        course_map = {}
        for num, title, dept_code, th, pr, level in COURSES:
            course_type = "both" if th > 0 and pr > 0 else ("practical" if pr > 0 else "theory")
            c = Course(
                course_number=num, title=title,
                department_id=dept_map.get(dept_code),
                credit_theory=th, credit_practical=pr,
                course_type=course_type, program_level=level,
                status="active",
            )
            db.add(c)
            await db.flush()
            course_map[num] = c.id

        user_result = await db.execute(select(User))
        user_map = {u.email: u for u in user_result.scalars().all()}

        # Published course offerings for the active semester.
        offering_map = {}
        for course_number, section, faculty_email, status, max_enrollment in OFFERINGS:
            offering = CourseOffering(
                calendar_id=cal.id,
                semester_id=sem1.id,
                course_id=course_map[course_number],
                max_enrollment=max_enrollment,
                section=section,
                status=status,
                created_by=user_map["academic@avfu.ac.in"].id,
            )
            db.add(offering)
            await db.flush()
            offering_map[course_number] = offering.id

            faculty = user_map.get(faculty_email)
            if faculty:
                db.add(OfferingFaculty(offering_id=offering.id, faculty_id=faculty.id, role="primary"))

        # Sample enrollment requests and approvals for management screens.
        processor = user_map["academic@avfu.ac.in"]
        for student_email, course_number, status, remarks in ENROLLMENTS:
            processed_at = datetime.now(timezone.utc) if status in ("approved", "rejected") else None
            enrollment = StudentEnrollment(
                student_id=user_map[student_email].id,
                offering_id=offering_map[course_number],
                status=status,
                processed_by=processor.id if processed_at else None,
                processed_at=processed_at,
                remarks=remarks,
            )
            db.add(enrollment)

        await db.commit()
        print("AMS seed completed successfully.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
