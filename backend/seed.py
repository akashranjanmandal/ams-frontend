"""Seed AMS database with initial data."""
import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole, Department, Program
from app.models.academic import AcademicCalendar, Semester
from app.models.course import Course
from app.db.base import Base
from datetime import date

DATABASE_URL = settings.DATABASE_URL

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


async def seed():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as db:
        # Departments
        dept_map = {}
        for name, code in DEPARTMENTS:
            existing = await db.execute(select(Department).where(Department.code == code))
            department = existing.scalar_one_or_none()
            if department is None:
                department = Department(name=name, code=code)
                db.add(department)
                await db.flush()
            else:
                department.name = name
                department.is_active = True
            dept_map[code] = department.id

        # Programs
        prog_map = {}
        for name, code, level, dept_code, dur in PROGRAMS:
            existing = await db.execute(select(Program).where(Program.code == code))
            program = existing.scalar_one_or_none()
            if program is None:
                program = Program(
                    name=name, code=code, level=level,
                    department_id=dept_map.get(dept_code), duration_years=dur,
                )
                db.add(program)
                await db.flush()
            else:
                program.name = name
                program.level = level
                program.department_id = dept_map.get(dept_code)
                program.duration_years = dur
                program.is_active = True
            prog_map[code] = program.id

        # Users
        for email, pw, first, last, role, desig, emp_id, roll in USERS:
            existing = await db.execute(select(User).where(User.email == email))
            user = existing.scalar_one_or_none()
            if user is None:
                user = User(email=email)
                db.add(user)
            user.hashed_password = hash_password(pw)
            user.first_name = first
            user.last_name = last
            user.role = UserRole(role)
            user.designation = desig
            user.employee_id = emp_id
            user.student_roll = roll
            user.department_id = dept_map.get("AGRO")
            user.is_active = True
            user.is_verified = True

        await db.flush()

        # Academic Calendar 2024-25
        existing_cal = await db.execute(select(AcademicCalendar).where(AcademicCalendar.academic_year == "2024-25"))
        cal = existing_cal.scalar_one_or_none()
        if cal is None:
            cal = AcademicCalendar(
                name="2024-25", academic_year="2024-25",
                start_date=date(2024, 7, 1), end_date=date(2025, 5, 31),
                status="active",
            )
            db.add(cal)
            await db.flush()
        else:
            cal.name = "2024-25"
            cal.status = "active"
            cal.start_date = date(2024, 7, 1)
            cal.end_date = date(2025, 5, 31)

        sem1 = await db.execute(
            select(Semester).where(Semester.calendar_id == cal.id, Semester.name == "Semester I (Odd)")
        )
        sem1_obj = sem1.scalar_one_or_none()
        if sem1_obj is None:
            sem1_obj = Semester(
                calendar_id=cal.id, name="Semester I (Odd)", sem_type="odd",
                start_date=date(2024, 7, 1), end_date=date(2024, 11, 30),
                registration_start=date(2024, 6, 15), registration_end=date(2024, 7, 15),
                exam_start=date(2024, 11, 10), exam_end=date(2024, 11, 30),
                result_declaration=date(2024, 12, 20),
                status="active",
            )
            db.add(sem1_obj)
        else:
            sem1_obj.sem_type = "odd"
            sem1_obj.start_date = date(2024, 7, 1)
            sem1_obj.end_date = date(2024, 11, 30)
            sem1_obj.registration_start = date(2024, 6, 15)
            sem1_obj.registration_end = date(2024, 7, 15)
            sem1_obj.exam_start = date(2024, 11, 10)
            sem1_obj.exam_end = date(2024, 11, 30)
            sem1_obj.result_declaration = date(2024, 12, 20)
            sem1_obj.status = "active"

        sem2 = await db.execute(
            select(Semester).where(Semester.calendar_id == cal.id, Semester.name == "Semester II (Even)")
        )
        sem2_obj = sem2.scalar_one_or_none()
        if sem2_obj is None:
            sem2_obj = Semester(
                calendar_id=cal.id, name="Semester II (Even)", sem_type="even",
                start_date=date(2025, 1, 1), end_date=date(2025, 5, 31),
                registration_start=date(2024, 12, 15), registration_end=date(2025, 1, 10),
                exam_start=date(2025, 5, 5), exam_end=date(2025, 5, 25),
                result_declaration=date(2025, 6, 15),
                status="upcoming",
            )
            db.add(sem2_obj)
        else:
            sem2_obj.sem_type = "even"
            sem2_obj.start_date = date(2025, 1, 1)
            sem2_obj.end_date = date(2025, 5, 31)
            sem2_obj.registration_start = date(2024, 12, 15)
            sem2_obj.registration_end = date(2025, 1, 10)
            sem2_obj.exam_start = date(2025, 5, 5)
            sem2_obj.exam_end = date(2025, 5, 25)
            sem2_obj.result_declaration = date(2025, 6, 15)
            sem2_obj.status = "upcoming"

        # Courses
        for num, title, dept_code, th, pr, level in COURSES:
            existing = await db.execute(select(Course).where(Course.course_number == num))
            course = existing.scalar_one_or_none()
            course_type = "both" if th > 0 and pr > 0 else ("practical" if pr > 0 else "theory")
            if course is None:
                course = Course(
                    course_number=num, title=title,
                    department_id=dept_map.get(dept_code),
                    credit_theory=th, credit_practical=pr,
                    course_type=course_type, program_level=level,
                    status="active",
                )
                db.add(course)
            else:
                course.title = title
                course.department_id = dept_map.get(dept_code)
                course.credit_theory = th
                course.credit_practical = pr
                course.course_type = course_type
                course.program_level = level
                course.status = "active"

        await db.commit()
        print("AMS seed completed successfully.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
