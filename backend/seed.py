"""Seed the AVFU HRMS database with demo users and data."""
from datetime import date, datetime, timedelta, timezone

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
import json
import random

from app.models.models import (
    AccountStatus,
    Announcement,
    Asset,
    Attendance,
    DACPRequest,
    EditRequest,
    EmergencyContact,
    Employee,
    Experience,
    FamilyMember,
    LeaveRequest,
    Liability,
    NOCRequest,
    OutOfStationRequest,
    Qualification,
    RequestStatus,
    ResignationRequest,
    Role,
    SalarySlip,
    User,
    VacationRequest,
)

UNIVERSITY = "Assam Veterinary & Fisheries University"
DEPARTMENTS = [
    "Veterinary Anatomy",
    "Animal Nutrition",
    "Fisheries Science",
    "Veterinary Surgery",
    "Aquaculture",
    "Administration",
]


def reset():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def make_user(
    db, code, email, password, role, account_status=AccountStatus.active, **emp_kwargs
) -> Employee:
    user = User(
        employee_code=code,
        email=email.lower(),
        hashed_password=hash_password(password),
        role=role,
        account_status=account_status,
    )
    db.add(user)
    db.flush()
    emp = Employee(user_id=user.id, **emp_kwargs)
    db.add(emp)
    db.flush()
    return emp


def seed():
    reset()
    db = SessionLocal()

    # --- HR head (also acts as approver) ---
    hr = make_user(
        db, "AVFU-HR-01", "hr@avfu.ac.in", "hr1234", Role.hr,
        full_name="Dr. Pranab Jyoti Saikia",
        designation="HR Manager",
        grade="Grade I",
        department="Administration",
        office=UNIVERSITY,
        gender="Male",
        date_of_birth=date(1975, 4, 12),
        blood_group="B+",
        phone="9435012345",
        date_of_joining=date(2005, 6, 1),
        marital_status="Married",
    )

    admin = make_user(
        db, "AVFU-ADM-01", "admin@avfu.ac.in", "admin1234", Role.admin,
        full_name="Dr. Rituparna Goswami",
        designation="Registrar (Admin)",
        grade="Grade I",
        department="Administration",
        office=UNIVERSITY,
        gender="Female",
        date_of_birth=date(1970, 11, 5),
        blood_group="O+",
        phone="9435067890",
        date_of_joining=date(2002, 1, 15),
        marital_status="Married",
    )

    # --- Primary employee (the logged-in demo) ---
    nevica = make_user(
        db, "111019", "nevica@avfu.ac.in", "employee1234", Role.employee,
        full_name="Nevica Baruah",
        designation="Lecturer",
        grade="Grade III",
        department="Fisheries Science",
        office=UNIVERSITY,
        gender="Female",
        date_of_birth=date(1990, 6, 11),  # birthday today (2026-06-11)!
        blood_group="A+",
        nationality="IND-INDIAN",
        religion="Hindu",
        marital_status="Married",
        phone="8135866886",
        alt_phone="9435193236",
        address="13 Jyoti Path, Ganesh Mandir Path, Jawahar Nagar, Khanapara",
        city="Guwahati",
        state="Assam",
        pincode="781022",
        pan="BFFPB2513A",
        aadhaar="XXXXXXXX7500",
        bank_account="10104882672",
        bank_ifsc="SBIN0005606",
        bank_name="SBI - STATE BANK OF INDIA",
        date_of_joining=date(2020, 12, 4),
        casual_leave=10, earned_leave=28, medical_leave=10,
        reports_to_id=hr.id,
    )

    # extra staff
    extras = [
        ("111020", "arnab@avfu.ac.in", "Arnab Deka", "Assistant Professor", "Veterinary Surgery", date(1985, 3, 22)),
        ("111021", "moushumi@avfu.ac.in", "Moushumi Das", "Lecturer", "Animal Nutrition", date(1992, 9, 14)),
        ("111022", "bikram@avfu.ac.in", "Bikram Hazarika", "Professor", "Aquaculture", date(1978, 1, 30)),
        ("111023", "jahnabi@avfu.ac.in", "Jahnabi Kalita", "Lab Technician", "Veterinary Anatomy", date(1995, 7, 8)),
    ]
    for code, email, name, desig, dept, dob in extras:
        make_user(
            db, code, email, "employee1234", Role.employee,
            full_name=name, designation=desig, grade="Grade III",
            department=dept, office=UNIVERSITY, gender="Male" if "a" not in name[-2:] else "Female",
            date_of_birth=dob, date_of_joining=date(2021, 8, 1),
            phone="94350" + code[-5:], reports_to_id=hr.id,
            casual_leave=12, earned_leave=30, medical_leave=10,
        )

    # --- Nevica's profile detail ---
    db.add_all([
        FamilyMember(employee_id=nevica.id, member_name="Reepjyoti Deka", date_of_birth=date(1990, 2, 9), occupation="Self Employed", relation="Husband", dependent=False),
        FamilyMember(employee_id=nevica.id, member_name="Udvansh Deka", date_of_birth=date(2024, 5, 10), occupation="Other", relation="Son", dependent=True),
        EmergencyContact(employee_id=nevica.id, person_name="Reepjyoti Deka", contact_no="8135866886", relation="Husband", email="reepjyoti@gmail.com", address="13 Jyoti Path, Khanapara, Guwahati"),
        EmergencyContact(employee_id=nevica.id, person_name="Ranendra Nath Baruah", contact_no="9435193236", relation="Father", email="", address="17 5th By Lane, KKB Road, Chenikuthi, Guwahati"),
        Qualification(employee_id=nevica.id, degree="B.F.Sc", institution="College of Fisheries, AAU", year="2012", grade="First"),
        Qualification(employee_id=nevica.id, degree="M.F.Sc", institution="CIFE Mumbai", year="2015", grade="First"),
        Experience(employee_id=nevica.id, organization="Regional Research Station", designation="Research Associate", from_date=date(2016, 1, 1), to_date=date(2020, 11, 30)),
    ])

    # --- Leave history ---
    db.add_all([
        LeaveRequest(employee_id=nevica.id, leave_type="Casual Leave", from_date=date(2026, 5, 4), to_date=date(2026, 5, 5), total_days=2, reason="Personal work", status=RequestStatus.approved, approver_id=hr.id, applied_at=datetime(2026, 5, 1, tzinfo=timezone.utc)),
        LeaveRequest(employee_id=nevica.id, leave_type="Medical Leave", from_date=date(2026, 6, 1), to_date=date(2026, 6, 3), total_days=3, reason="Fever", status=RequestStatus.pending, approver_id=hr.id, applied_at=datetime(2026, 6, 9, tzinfo=timezone.utc)),
    ])

    # pending leaves from other staff (so HR has something to approve)
    others = db.query(Employee).filter(Employee.id != nevica.id, Employee.department != "Administration").all()
    for i, e in enumerate(others):
        db.add(LeaveRequest(
            employee_id=e.id, leave_type="Casual Leave",
            from_date=date(2026, 6, 15 + i), to_date=date(2026, 6, 16 + i),
            total_days=2, reason="Family function", status=RequestStatus.pending,
            approver_id=hr.id, applied_at=datetime(2026, 6, 10, tzinfo=timezone.utc),
        ))

    # --- Announcements ---
    db.add_all([
        Announcement(category="news", title="Annual Sports Meet 2026", body="The university annual sports meet will be held on 28th June 2026 at the main campus ground."),
        Announcement(category="circular", title="Revised Leave Policy", body="Earned leave accrual revised w.e.f. April 2026. Refer to circular AVFU/ADM/2026/14."),
        Announcement(category="circular", title="Biometric Attendance Mandatory", body="All staff must mark biometric attendance from 1st July 2026."),
        Announcement(category="training", title="Workshop on Aquaculture Biosecurity", body="Two-day workshop on 12-13 June 2026. Register through the Training Documents section."),
        Announcement(category="news", title="Convocation Dates Announced", body="The 3rd convocation will be held in September 2026."),
    ])

    # ======================================================================
    # COMPREHENSIVE DUMMY DATA — fill every table for every employee
    # ======================================================================
    all_emps = db.query(Employee).all()
    emp_emp = [e for e in all_emps if e.id not in (hr.id, admin.id)]  # non-admin staff
    today = date.today()

    DEGREES = [("B.V.Sc & A.H.", "College of Veterinary Science, AAU", "2010", "First"),
               ("M.V.Sc", "IVRI Izatnagar", "2013", "First"),
               ("Ph.D", "Assam Agricultural University", "2018", "Distinction"),
               ("B.F.Sc", "College of Fisheries, AAU", "2011", "First")]
    ORGS = ["Regional Research Station", "District Veterinary Hospital",
            "State Fisheries Dept", "Krishi Vigyan Kendra", "ICAR Research Complex"]
    OCCUP = ["Service", "Self Employed", "Homemaker", "Student", "Retired"]
    RELATIONS = [("Spouse", False), ("Son", True), ("Daughter", True),
                 ("Father", False), ("Mother", True)]
    ASSET_TYPES = ["Residential House", "Agricultural Land", "Motor Vehicle",
                   "Fixed Deposit", "Gold & Jewellery", "Mutual Funds"]
    LIAB_TYPES = ["Home Loan", "Vehicle Loan", "Personal Loan", "Education Loan"]
    BANKS = ["SBI", "PNB", "HDFC Bank", "Assam Gramin Vikash Bank", "Bank of Baroda"]

    for idx, e in enumerate(all_emps):
        # backfill profile fields that may be blank
        if not e.gender:
            e.gender = random.choice(["Male", "Female"])
        if not e.blood_group:
            e.blood_group = random.choice(["A+", "B+", "O+", "AB+", "O-"])
        if not e.date_of_birth:
            e.date_of_birth = date(random.randint(1972, 1996), random.randint(1, 12), random.randint(1, 28))
        if not e.marital_status:
            e.marital_status = random.choice(["Married", "Single"])
        if not e.pan:
            e.pan = f"AB{random.choice('CFP')}P{random.randint(1000,9999)}{random.choice('ABCDEFGH')}"
        if not e.aadhaar:
            e.aadhaar = f"XXXXXXXX{random.randint(1000,9999)}"
        if not e.address:
            e.address = f"{random.randint(1,99)} {random.choice(['MG Road','GS Road','RG Baruah Road','Zoo Road'])}, Khanapara"
            e.city = "Guwahati"; e.pincode = f"7810{random.randint(10,40)}"
        if not e.bank_account:
            e.bank_account = str(random.randint(10000000000, 99999999999))
            e.bank_ifsc = f"SBIN000{random.randint(1000,9999)}"
            e.bank_name = random.choice(BANKS)
        if not e.date_of_joining:
            e.date_of_joining = date(random.randint(2008, 2022), random.randint(1, 12), random.randint(1, 28))

        # Family (2-3 members) — skip nevica (already has)
        if e.id != nevica.id:
            for r, dep in random.sample(RELATIONS, k=random.randint(2, 3)):
                db.add(FamilyMember(
                    employee_id=e.id,
                    member_name=f"{random.choice(['Nabin','Rina','Hiren','Anita','Dipak','Mina'])} {e.full_name.split()[-1]}",
                    date_of_birth=date(random.randint(1960, 2020), random.randint(1, 12), random.randint(1, 28)),
                    occupation=random.choice(OCCUP), relation=r, dependent=dep,
                ))
            # Emergency contacts (2)
            for _ in range(2):
                db.add(EmergencyContact(
                    employee_id=e.id,
                    person_name=f"{random.choice(['Nabin','Rina','Hiren','Anita'])} {e.full_name.split()[-1]}",
                    contact_no=str(random.randint(9000000000, 9999999999)),
                    relation=random.choice(["Spouse", "Father", "Brother", "Friend"]),
                    email=f"contact{e.id}@example.com",
                    address="Khanapara, Guwahati, Assam",
                ))
            # Qualifications (2)
            for deg in random.sample(DEGREES, k=2):
                db.add(Qualification(employee_id=e.id, degree=deg[0], institution=deg[1], year=deg[2], grade=deg[3]))
            # Experience (1-2)
            for _ in range(random.randint(1, 2)):
                fy = random.randint(2010, 2018)
                db.add(Experience(
                    employee_id=e.id, organization=random.choice(ORGS),
                    designation=random.choice(["Research Associate", "Junior Officer", "Veterinary Officer"]),
                    from_date=date(fy, 1, 1), to_date=date(fy + 3, 12, 31),
                ))

        # Assets (1-3)
        for at in random.sample(ASSET_TYPES, k=random.randint(1, 3)):
            db.add(Asset(employee_id=e.id, asset_type=at,
                         description=f"Declared {at.lower()}",
                         value=random.choice([250000, 500000, 1200000, 3500000, 80000]),
                         acquired_on=date(random.randint(2010, 2023), random.randint(1, 12), 1)))
        # Liabilities (0-2)
        for lt in random.sample(LIAB_TYPES, k=random.randint(0, 2)):
            db.add(Liability(employee_id=e.id, liability_type=lt,
                             description=f"{lt} outstanding",
                             amount=random.choice([150000, 400000, 900000]),
                             creditor=random.choice(BANKS)))

        # Salary slips (Jan–Jun 2026) for everyone
        base = random.choice([44900, 56100, 67700, 78800])
        for m in range(1, 7):
            db.add(SalarySlip(employee_id=e.id, month=m, year=2026,
                              basic=base, da=round(base * 0.2), hra=round(base * 0.15),
                              other_allowance=4000, pf=round(base * 0.12), tax=2500, other_deduction=500))

        # Attendance (last 25 days)
        for d in range(25):
            day = today - timedelta(days=d)
            if day.weekday() >= 6:
                continue
            ci = datetime.combine(day, datetime.min.time()).replace(hour=9, minute=random.randint(20, 55), tzinfo=timezone.utc)
            co = ci.replace(hour=17, minute=random.randint(0, 30))
            status = "Present" if random.random() > 0.08 else "Leave"
            db.add(Attendance(employee_id=e.id, work_date=day,
                              check_in=ci if status == "Present" else None,
                              check_out=co if status == "Present" else None, status=status))

    # --- Request modules: NOC / Vacation / OOS / Resignation / DACP ---
    countries = ["United Kingdom", "USA", "Australia", "Nepal", "Thailand"]
    for i, e in enumerate(emp_emp):
        st = [RequestStatus.pending, RequestStatus.approved, RequestStatus.rejected][i % 3]
        db.add(NOCRequest(employee_id=e.id, purpose=random.choice(["Passport", "Foreign Travel", "Higher Studies"]),
                          country=random.choice(countries), from_date=date(2026, 7, 1), to_date=date(2026, 7, 20),
                          details="Conference participation", status=st))
        db.add(VacationRequest(employee_id=e.id, from_date=date(2026, 8, 1), to_date=date(2026, 8, 10),
                               total_days=10, reason="Summer vacation", status=st))
        db.add(OutOfStationRequest(employee_id=e.id, destination=random.choice(["New Delhi", "Mumbai", "Kolkata", "Shillong"]),
                                   purpose=random.choice(["Official Meeting", "Training", "Seminar"]),
                                   from_date=date(2026, 6, 20), to_date=date(2026, 6, 22), status=st))
        db.add(DACPRequest(employee_id=e.id, current_grade="Grade III", proposed_grade="Grade II",
                           due_date=date(2026, 12, 1), remarks="Eligible for DACP advancement", status=st))

    # one resignation request (pending) so the module isn't empty
    if emp_emp:
        db.add(ResignationRequest(employee_id=emp_emp[-1].id, resignation_type="Voluntary Retirement",
                                  last_working_date=date(2026, 9, 30), reason="Personal reasons",
                                  status=RequestStatus.pending))

    # --- A couple of pending profile edit requests for HR/Admin to approve ---
    db.add(EditRequest(
        employee_id=emp_emp[0].id,
        changes_json=json.dumps({"designation": {"old": emp_emp[0].designation, "new": "Associate Professor"}}),
        status=RequestStatus.pending,
    ))
    db.add(EditRequest(
        employee_id=emp_emp[1].id,
        changes_json=json.dumps({"department": {"old": emp_emp[1].department, "new": "Aquaculture"}}),
        status=RequestStatus.pending,
    ))

    # --- Pending signups awaiting admin approval ---
    make_user(
        db, "AVFU-2001", "newjoinee@avfu.ac.in", "employee1234", Role.employee,
        account_status=AccountStatus.pending,
        full_name="Pranjal Sharma", designation="Assistant Lecturer",
        department="Veterinary Anatomy", office=UNIVERSITY, phone="9435000111",
        status="Pending",
    )
    make_user(
        db, "AVFU-2002", "rashmi@avfu.ac.in", "employee1234", Role.employee,
        account_status=AccountStatus.pending,
        full_name="Rashmi Borah", designation="Lab Assistant",
        department="Fisheries Science", office=UNIVERSITY, phone="9435000222",
        status="Pending",
    )

    db.commit()
    db.close()
    print("Seed complete.")
    print("  Admin    : admin@avfu.ac.in / admin1234")
    print("  HR       : hr@avfu.ac.in / hr1234")
    print("  Employee : nevica@avfu.ac.in / employee1234")


if __name__ == "__main__":
    seed()
