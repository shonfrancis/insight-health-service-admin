import { Patient } from "./app/dashboard/patients/data";

const mockPatientsData: Patient[] = [
    {
        "id": "REF-7000",
        "name": "Chrisjen Mao",
        "dob": "1975-01-26",
        "gender": "Male",
        "email": "chrisjen@example.com",
        "phone": "+1 (555) 716-2756",
        "address": "1706 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P0-8",
                    "date": "2025-12-03",
                    "time": "17:00",
                    "services": [
                        "Growth Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-1",
                    "date": "2025-11-10",
                    "time": "17:00",
                    "services": [
                        "Fertility Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-3",
                    "date": "2025-10-11",
                    "time": "14:00",
                    "services": [
                        "Fertility Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-11",
                    "date": "2025-09-11",
                    "time": "08:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-0",
                    "date": "2025-08-29",
                    "time": "17:00",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-9",
                    "date": "2025-08-19",
                    "time": "14:00",
                    "services": [
                        "Dating Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-4",
                    "date": "2025-08-08",
                    "time": "08:00",
                    "services": [
                        "Dating Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-6",
                    "date": "2025-05-28",
                    "time": "12:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-10",
                    "date": "2025-04-08",
                    "time": "08:00",
                    "services": [
                        "Well Woman Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-7",
                    "date": "2025-03-29",
                    "time": "16:00",
                    "services": [
                        "Reassurance Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-5",
                    "date": "2025-03-22",
                    "time": "12:00",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-2",
                    "date": "2025-02-19",
                    "time": "17:00",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F0-3",
                    "date": "2026-08-01",
                    "time": "12:30",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-1",
                    "date": "2026-08-28",
                    "time": "13:30",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-4",
                    "date": "2026-10-05",
                    "time": "15:30",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-0",
                    "date": "2026-10-12",
                    "time": "12:30",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-2",
                    "date": "2026-10-13",
                    "time": "13:30",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 2,
            "notes": 2
        }
    },
    {
        "id": "REF-6138",
        "name": "Clarissa Draper",
        "dob": "1979-02-14",
        "gender": "Female",
        "email": "clarissa@example.com",
        "phone": "+1 (555) 686-9149",
        "address": "5841 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P1-1",
                    "date": "2025-12-26",
                    "time": "15:00",
                    "services": [
                        "Fertility Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-2",
                    "date": "2025-11-11",
                    "time": "17:00",
                    "services": [
                        "4D/5D Baby Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-3",
                    "date": "2025-10-06",
                    "time": "09:00",
                    "services": [
                        "Fertility Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-6",
                    "date": "2025-08-22",
                    "time": "12:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-0",
                    "date": "2025-08-14",
                    "time": "08:00",
                    "services": [
                        "Well Woman Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-4",
                    "date": "2025-08-05",
                    "time": "14:00",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-8",
                    "date": "2025-07-17",
                    "time": "16:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-9",
                    "date": "2025-04-14",
                    "time": "15:00",
                    "services": [
                        "Well Woman Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-7",
                    "date": "2025-04-13",
                    "time": "16:00",
                    "services": [
                        "NIPT Blood Test",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-5",
                    "date": "2025-03-30",
                    "time": "09:00",
                    "services": [
                        "Fertility Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-10",
                    "date": "2025-02-28",
                    "time": "10:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-11",
                    "date": "2025-01-16",
                    "time": "16:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F1-4",
                    "date": "2026-07-14",
                    "time": "09:30",
                    "services": [
                        "General Blood Tests",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-3",
                    "date": "2026-08-16",
                    "time": "14:30",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-2",
                    "date": "2026-08-28",
                    "time": "10:30",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-1",
                    "date": "2026-09-16",
                    "time": "09:30",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-0",
                    "date": "2026-09-18",
                    "time": "15:30",
                    "services": [
                        "Reassurance Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 2,
            "notes": 3
        }
    },
    {
        "id": "REF-8008",
        "name": "Alex Holden",
        "dob": "1984-10-28",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+1 (555) 506-3673",
        "address": "2787 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P2-8",
                    "date": "2025-12-18",
                    "time": "16:00",
                    "services": [
                        "Reassurance Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-2",
                    "date": "2025-12-08",
                    "time": "11:00",
                    "services": [
                        "Thalassaemia Screening",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-3",
                    "date": "2025-11-25",
                    "time": "17:00",
                    "services": [
                        "Well Woman Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-10",
                    "date": "2025-11-25",
                    "time": "17:00",
                    "services": [
                        "Thalassaemia Screening",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-4",
                    "date": "2025-09-29",
                    "time": "09:00",
                    "services": [
                        "Dating Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-9",
                    "date": "2025-09-23",
                    "time": "17:00",
                    "services": [
                        "Reassurance Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-1",
                    "date": "2025-08-24",
                    "time": "15:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-6",
                    "date": "2025-06-13",
                    "time": "16:00",
                    "services": [
                        "Follow-up Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-11",
                    "date": "2025-05-19",
                    "time": "13:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-7",
                    "date": "2025-04-25",
                    "time": "16:00",
                    "services": [
                        "NIPT Blood Test",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-5",
                    "date": "2025-02-20",
                    "time": "17:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-0",
                    "date": "2025-02-08",
                    "time": "08:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F2-3",
                    "date": "2026-08-08",
                    "time": "13:30",
                    "services": [
                        "Genotype Blood Test",
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-4",
                    "date": "2026-09-15",
                    "time": "10:30",
                    "services": [
                        "Follow-up Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-0",
                    "date": "2026-09-18",
                    "time": "15:30",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-1",
                    "date": "2026-10-08",
                    "time": "13:30",
                    "services": [
                        "Dating Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-2",
                    "date": "2026-10-16",
                    "time": "14:30",
                    "services": [
                        "Genotype Blood Test",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 1,
            "notes": 5
        }
    },
    {
        "id": "REF-9341",
        "name": "Alex Nagata",
        "dob": "1993-01-17",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+1 (555) 844-4297",
        "address": "9182 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P3-11",
                    "date": "2025-12-10",
                    "time": "11:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-7",
                    "date": "2025-12-05",
                    "time": "13:00",
                    "services": [
                        "Reassurance Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-5",
                    "date": "2025-10-22",
                    "time": "15:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-3",
                    "date": "2025-10-01",
                    "time": "15:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-4",
                    "date": "2025-09-25",
                    "time": "17:00",
                    "services": [
                        "Fertility Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-2",
                    "date": "2025-07-20",
                    "time": "10:00",
                    "services": [
                        "General Blood Tests",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-0",
                    "date": "2025-07-13",
                    "time": "11:00",
                    "services": [
                        "Genotype Blood Test",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-9",
                    "date": "2025-06-28",
                    "time": "11:00",
                    "services": [
                        "Well Woman Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-6",
                    "date": "2025-04-17",
                    "time": "17:00",
                    "services": [
                        "Genotype Blood Test",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-1",
                    "date": "2025-03-16",
                    "time": "09:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-10",
                    "date": "2025-03-10",
                    "time": "10:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-8",
                    "date": "2025-02-26",
                    "time": "10:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F3-3",
                    "date": "2026-07-27",
                    "time": "08:30",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-0",
                    "date": "2026-07-30",
                    "time": "09:30",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-4",
                    "date": "2026-09-08",
                    "time": "15:30",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-1",
                    "date": "2026-09-09",
                    "time": "11:30",
                    "services": [
                        "Genotype Blood Test",
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-2",
                    "date": "2026-10-15",
                    "time": "09:30",
                    "services": [
                        "4D/5D Baby Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 1,
            "notes": 0
        }
    },
    {
        "id": "REF-7548",
        "name": "Anderson Dawes",
        "dob": "1973-04-15",
        "gender": "Female",
        "email": "anderson@example.com",
        "phone": "+1 (555) 695-7338",
        "address": "565 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P4-1",
                    "date": "2025-12-27",
                    "time": "12:00",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-8",
                    "date": "2025-12-03",
                    "time": "13:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-3",
                    "date": "2025-11-14",
                    "time": "17:00",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-7",
                    "date": "2025-11-08",
                    "time": "09:00",
                    "services": [
                        "Thalassaemia Screening",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-6",
                    "date": "2025-09-21",
                    "time": "10:00",
                    "services": [
                        "Thalassaemia Screening",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-5",
                    "date": "2025-08-06",
                    "time": "09:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-0",
                    "date": "2025-04-15",
                    "time": "10:00",
                    "services": [
                        "Well Woman Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-9",
                    "date": "2025-04-12",
                    "time": "08:00",
                    "services": [
                        "NIPT Blood Test",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-2",
                    "date": "2025-04-10",
                    "time": "12:00",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-4",
                    "date": "2025-02-25",
                    "time": "12:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-10",
                    "date": "2025-02-22",
                    "time": "08:00",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-11",
                    "date": "2025-02-12",
                    "time": "10:00",
                    "services": [
                        "General Blood Tests",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F4-2",
                    "date": "2026-07-27",
                    "time": "16:30",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-4",
                    "date": "2026-07-31",
                    "time": "11:30",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-3",
                    "date": "2026-08-06",
                    "time": "10:30",
                    "services": [
                        "Well Woman Scan",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-1",
                    "date": "2026-08-24",
                    "time": "16:30",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-0",
                    "date": "2026-09-13",
                    "time": "14:30",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 2
        }
    },
    {
        "id": "REF-6869",
        "name": "Naomi Holden",
        "dob": "1976-12-02",
        "gender": "Male",
        "email": "naomi@example.com",
        "phone": "+1 (555) 159-6120",
        "address": "362 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P5-0",
                    "date": "2025-12-15",
                    "time": "13:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-5",
                    "date": "2025-12-08",
                    "time": "17:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-10",
                    "date": "2025-10-15",
                    "time": "09:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-6",
                    "date": "2025-09-18",
                    "time": "11:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-9",
                    "date": "2025-09-13",
                    "time": "17:00",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-11",
                    "date": "2025-08-02",
                    "time": "12:00",
                    "services": [
                        "Dating Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-8",
                    "date": "2025-07-18",
                    "time": "14:00",
                    "services": [
                        "4D/5D Baby Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-1",
                    "date": "2025-07-02",
                    "time": "16:00",
                    "services": [
                        "Reassurance Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-2",
                    "date": "2025-05-30",
                    "time": "15:00",
                    "services": [
                        "NIPT Blood Test",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-7",
                    "date": "2025-05-19",
                    "time": "10:00",
                    "services": [
                        "Early Pregnancy Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-3",
                    "date": "2025-04-30",
                    "time": "08:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-4",
                    "date": "2025-04-16",
                    "time": "12:00",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F5-1",
                    "date": "2026-07-12",
                    "time": "12:30",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-0",
                    "date": "2026-07-13",
                    "time": "14:30",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-2",
                    "date": "2026-07-27",
                    "time": "11:30",
                    "services": [
                        "Reassurance Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-3",
                    "date": "2026-08-09",
                    "time": "13:30",
                    "services": [
                        "4D/5D Baby Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-4",
                    "date": "2026-10-14",
                    "time": "12:30",
                    "services": [
                        "Growth Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 0,
            "notes": 2
        }
    },
    {
        "id": "REF-9480",
        "name": "Roberta Dawes",
        "dob": "1995-11-03",
        "gender": "Female",
        "email": "roberta@example.com",
        "phone": "+1 (555) 979-3761",
        "address": "5417 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P6-4",
                    "date": "2025-10-21",
                    "time": "13:00",
                    "services": [
                        "Follow-up Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-1",
                    "date": "2025-10-19",
                    "time": "08:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-11",
                    "date": "2025-10-03",
                    "time": "17:00",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-5",
                    "date": "2025-08-10",
                    "time": "15:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-6",
                    "date": "2025-08-08",
                    "time": "10:00",
                    "services": [
                        "Early Pregnancy Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-9",
                    "date": "2025-08-06",
                    "time": "09:00",
                    "services": [
                        "Genotype Blood Test",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-3",
                    "date": "2025-07-31",
                    "time": "17:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-0",
                    "date": "2025-05-31",
                    "time": "14:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-8",
                    "date": "2025-05-01",
                    "time": "15:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-10",
                    "date": "2025-04-23",
                    "time": "11:00",
                    "services": [
                        "Well Woman Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-2",
                    "date": "2025-03-17",
                    "time": "14:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-7",
                    "date": "2025-01-02",
                    "time": "16:00",
                    "services": [
                        "NIPT Blood Test",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F6-3",
                    "date": "2026-07-15",
                    "time": "14:30",
                    "services": [
                        "4D/5D Baby Scan",
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-4",
                    "date": "2026-07-20",
                    "time": "09:30",
                    "services": [
                        "Dating Scan",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-1",
                    "date": "2026-08-19",
                    "time": "17:30",
                    "services": [
                        "Thalassaemia Screening",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-2",
                    "date": "2026-08-29",
                    "time": "11:30",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-0",
                    "date": "2026-10-16",
                    "time": "15:30",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 0,
            "notes": 1
        }
    },
    {
        "id": "REF-8175",
        "name": "Naomi Holden",
        "dob": "1983-05-14",
        "gender": "Male",
        "email": "naomi@example.com",
        "phone": "+1 (555) 813-1948",
        "address": "957 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P7-7",
                    "date": "2025-12-21",
                    "time": "10:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-11",
                    "date": "2025-10-25",
                    "time": "11:00",
                    "services": [
                        "Follow-up Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-4",
                    "date": "2025-08-30",
                    "time": "08:00",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-0",
                    "date": "2025-08-22",
                    "time": "08:00",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-5",
                    "date": "2025-08-19",
                    "time": "10:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-1",
                    "date": "2025-08-05",
                    "time": "15:00",
                    "services": [
                        "General Blood Tests",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-9",
                    "date": "2025-07-08",
                    "time": "14:00",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-10",
                    "date": "2025-05-25",
                    "time": "09:00",
                    "services": [
                        "Growth Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-8",
                    "date": "2025-04-19",
                    "time": "17:00",
                    "services": [
                        "General Blood Tests",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-6",
                    "date": "2025-04-12",
                    "time": "12:00",
                    "services": [
                        "4D/5D Baby Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-3",
                    "date": "2025-04-04",
                    "time": "08:00",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-2",
                    "date": "2025-02-25",
                    "time": "09:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F7-1",
                    "date": "2026-07-21",
                    "time": "09:30",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-2",
                    "date": "2026-07-28",
                    "time": "13:30",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-4",
                    "date": "2026-08-08",
                    "time": "14:30",
                    "services": [
                        "Early Pregnancy Scan",
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-3",
                    "date": "2026-08-31",
                    "time": "17:30",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-0",
                    "date": "2026-09-04",
                    "time": "08:30",
                    "services": [
                        "4D/5D Baby Scan",
                        "Growth Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 1,
            "notes": 2
        }
    },
    {
        "id": "REF-7429",
        "name": "Alex Mao",
        "dob": "1994-03-25",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+1 (555) 729-7566",
        "address": "1305 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P8-2",
                    "date": "2025-12-30",
                    "time": "09:00",
                    "services": [
                        "NIPT Blood Test",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-11",
                    "date": "2025-11-30",
                    "time": "16:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-4",
                    "date": "2025-09-24",
                    "time": "17:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-1",
                    "date": "2025-09-22",
                    "time": "15:00",
                    "services": [
                        "Follow-up Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-0",
                    "date": "2025-08-02",
                    "time": "08:00",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-6",
                    "date": "2025-07-15",
                    "time": "13:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-9",
                    "date": "2025-06-12",
                    "time": "13:00",
                    "services": [
                        "General Blood Tests",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-3",
                    "date": "2025-05-10",
                    "time": "17:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-10",
                    "date": "2025-04-28",
                    "time": "08:00",
                    "services": [
                        "Reassurance Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-7",
                    "date": "2025-03-05",
                    "time": "10:00",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-8",
                    "date": "2025-03-04",
                    "time": "10:00",
                    "services": [
                        "4D/5D Baby Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-5",
                    "date": "2025-02-11",
                    "time": "13:00",
                    "services": [
                        "Dating Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F8-4",
                    "date": "2026-07-13",
                    "time": "14:30",
                    "services": [
                        "Genotype Blood Test",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-2",
                    "date": "2026-07-19",
                    "time": "16:30",
                    "services": [
                        "4D/5D Baby Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-0",
                    "date": "2026-08-04",
                    "time": "08:30",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-1",
                    "date": "2026-09-08",
                    "time": "11:30",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-3",
                    "date": "2026-10-10",
                    "time": "12:30",
                    "services": [
                        "Reassurance Scan",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 3,
            "notes": 4
        }
    },
    {
        "id": "REF-1362",
        "name": "Eleanor Nagata",
        "dob": "2000-05-13",
        "gender": "Male",
        "email": "eleanor@example.com",
        "phone": "+1 (555) 803-5352",
        "address": "9492 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P9-5",
                    "date": "2025-11-29",
                    "time": "12:00",
                    "services": [
                        "Follow-up Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-7",
                    "date": "2025-11-26",
                    "time": "11:00",
                    "services": [
                        "Genotype Blood Test",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-9",
                    "date": "2025-11-09",
                    "time": "14:00",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-2",
                    "date": "2025-11-03",
                    "time": "09:00",
                    "services": [
                        "NIPT Blood Test",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-3",
                    "date": "2025-10-02",
                    "time": "10:00",
                    "services": [
                        "Genotype Blood Test",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-1",
                    "date": "2025-09-20",
                    "time": "13:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-4",
                    "date": "2025-07-25",
                    "time": "08:00",
                    "services": [
                        "Follow-up Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-0",
                    "date": "2025-06-25",
                    "time": "14:00",
                    "services": [
                        "Dating Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-8",
                    "date": "2025-06-22",
                    "time": "08:00",
                    "services": [
                        "Reassurance Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-10",
                    "date": "2025-06-06",
                    "time": "14:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-6",
                    "date": "2025-05-06",
                    "time": "16:00",
                    "services": [
                        "Follow-up Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-11",
                    "date": "2025-02-22",
                    "time": "12:00",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F9-0",
                    "date": "2026-07-19",
                    "time": "11:30",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-1",
                    "date": "2026-08-14",
                    "time": "08:30",
                    "services": [
                        "General Blood Tests",
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-2",
                    "date": "2026-09-22",
                    "time": "11:30",
                    "services": [
                        "Follow-up Scan",
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-4",
                    "date": "2026-10-08",
                    "time": "13:30",
                    "services": [
                        "Growth Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-3",
                    "date": "2026-10-09",
                    "time": "13:30",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 3,
            "notes": 3
        }
    },
    {
        "id": "REF-4076",
        "name": "Roberta Avasarala",
        "dob": "1981-03-28",
        "gender": "Female",
        "email": "roberta@example.com",
        "phone": "+1 (555) 625-2286",
        "address": "2678 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P10-6",
                    "date": "2025-11-25",
                    "time": "14:00",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-8",
                    "date": "2025-11-19",
                    "time": "17:00",
                    "services": [
                        "4D/5D Baby Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-4",
                    "date": "2025-11-17",
                    "time": "12:00",
                    "services": [
                        "Well Woman Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-3",
                    "date": "2025-10-17",
                    "time": "13:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-0",
                    "date": "2025-10-03",
                    "time": "09:00",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-10",
                    "date": "2025-08-04",
                    "time": "16:00",
                    "services": [
                        "NIPT Blood Test",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-2",
                    "date": "2025-07-26",
                    "time": "11:00",
                    "services": [
                        "Well Woman Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-7",
                    "date": "2025-07-09",
                    "time": "09:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-9",
                    "date": "2025-07-04",
                    "time": "10:00",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-1",
                    "date": "2025-06-17",
                    "time": "11:00",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-11",
                    "date": "2025-03-19",
                    "time": "15:00",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-5",
                    "date": "2025-02-18",
                    "time": "14:00",
                    "services": [
                        "Genotype Blood Test",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F10-3",
                    "date": "2026-07-18",
                    "time": "16:30",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-4",
                    "date": "2026-08-02",
                    "time": "12:30",
                    "services": [
                        "Genotype Blood Test",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-1",
                    "date": "2026-08-05",
                    "time": "13:30",
                    "services": [
                        "Fertility Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-0",
                    "date": "2026-08-22",
                    "time": "12:30",
                    "services": [
                        "Genotype Blood Test",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-2",
                    "date": "2026-09-07",
                    "time": "15:30",
                    "services": [
                        "Growth Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 1
        }
    },
    {
        "id": "REF-3544",
        "name": "Josephus Mao",
        "dob": "1988-10-13",
        "gender": "Male",
        "email": "josephus@example.com",
        "phone": "+1 (555) 911-1724",
        "address": "7107 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P11-8",
                    "date": "2025-12-07",
                    "time": "08:00",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-5",
                    "date": "2025-11-28",
                    "time": "11:00",
                    "services": [
                        "Fertility Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-6",
                    "date": "2025-10-20",
                    "time": "11:00",
                    "services": [
                        "Well Woman Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-4",
                    "date": "2025-09-22",
                    "time": "11:00",
                    "services": [
                        "Well Woman Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-9",
                    "date": "2025-09-05",
                    "time": "16:00",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-7",
                    "date": "2025-08-28",
                    "time": "15:00",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-2",
                    "date": "2025-08-16",
                    "time": "09:00",
                    "services": [
                        "Dating Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-11",
                    "date": "2025-05-11",
                    "time": "12:00",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-3",
                    "date": "2025-05-09",
                    "time": "15:00",
                    "services": [
                        "Reassurance Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-1",
                    "date": "2025-05-04",
                    "time": "08:00",
                    "services": [
                        "Growth Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-0",
                    "date": "2025-04-30",
                    "time": "11:00",
                    "services": [
                        "Reassurance Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-10",
                    "date": "2025-01-09",
                    "time": "16:00",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F11-4",
                    "date": "2026-07-15",
                    "time": "11:30",
                    "services": [
                        "Growth Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-2",
                    "date": "2026-07-27",
                    "time": "11:30",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-0",
                    "date": "2026-09-17",
                    "time": "12:30",
                    "services": [
                        "NIPT Blood Test",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-3",
                    "date": "2026-10-04",
                    "time": "12:30",
                    "services": [
                        "NIPT Blood Test",
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-1",
                    "date": "2026-10-16",
                    "time": "14:30",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 2
        }
    }
];

