export interface AppointmentRecord {
    id: string;
    date: string;
    time?: string;
    services: string[];
    status: "Completed" | "Pending" | "Cancelled" | "No Show";
}

export interface Patient {
    id: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    history: {
        past: AppointmentRecord[];
        future: AppointmentRecord[];
    };
    vault: {
        questionnaires: number;
        consents: number;
        notes: number;
    };
}

export const mockPatientsData: Patient[] = [
    {
        "id": "REF-8000",
        "name": "Eleanor Vance",
        "dob": "1974-02-15",
        "gender": "Female",
        "email": "eleanor.vance@email.com",
        "phone": "+1 (555) 498-5680",
        "address": "0 Vance Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-008",
                    "date": "2026-06-06",
                    "time": "04:30 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Follow-up Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-010",
                    "date": "2026-05-22",
                    "time": "12:30 PM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-006",
                    "date": "2026-04-22",
                    "time": "01:00 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-005",
                    "date": "2026-04-07",
                    "time": "12:30 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-001",
                    "date": "2025-12-29",
                    "time": "09:30 AM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-009",
                    "date": "2025-12-07",
                    "time": "09:00 AM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-002",
                    "date": "2025-07-07",
                    "time": "12:30 PM",
                    "services": [
                        "Well Woman Scan",
                        "Reassurance Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-007",
                    "date": "2025-06-21",
                    "time": "01:00 PM",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-003",
                    "date": "2025-05-05",
                    "time": "12:00 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-004",
                    "date": "2025-04-21",
                    "time": "04:00 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-012",
                    "date": "2026-08-23",
                    "time": "02:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-014",
                    "date": "2026-09-24",
                    "time": "09:30 AM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-013",
                    "date": "2026-10-07",
                    "time": "02:00 PM",
                    "services": [
                        "Well Woman Scan",
                        "4D/5D Baby Scan",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-011",
                    "date": "2026-11-14",
                    "time": "03:00 PM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 0,
            "notes": 6
        }
    },
    {
        "id": "REF-8001",
        "name": "James Holden",
        "dob": "1991-01-15",
        "gender": "Male",
        "email": "james.holden@email.com",
        "phone": "+1 (555) 522-6671",
        "address": "185 Holden Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-018",
                    "date": "2026-06-15",
                    "time": "02:00 PM",
                    "services": [
                        "Reassurance Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-021",
                    "date": "2026-06-03",
                    "time": "12:30 PM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-016",
                    "date": "2026-03-09",
                    "time": "11:00 AM",
                    "services": [
                        "4D/5D Baby Scan",
                        "NIPT Blood Test",
                        "Genotype Blood Test"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-024",
                    "date": "2025-10-22",
                    "time": "09:30 AM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-017",
                    "date": "2025-08-31",
                    "time": "10:30 AM",
                    "services": [
                        "Early Pregnancy Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-020",
                    "date": "2025-08-17",
                    "time": "03:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-023",
                    "date": "2025-05-27",
                    "time": "11:00 AM",
                    "services": [
                        "Dating Scan",
                        "Growth Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-019",
                    "date": "2025-04-29",
                    "time": "11:30 AM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-022",
                    "date": "2025-03-06",
                    "time": "10:30 AM",
                    "services": [
                        "Fertility Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-015",
                    "date": "2025-03-04",
                    "time": "10:00 AM",
                    "services": [
                        "NIPT Blood Test",
                        "Genotype Blood Test",
                        "Well Woman Scan"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-025",
                    "date": "2026-07-04",
                    "time": "12:00 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-029",
                    "date": "2026-09-18",
                    "time": "04:00 PM",
                    "services": [
                        "Gender Scan",
                        "Dating Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-026",
                    "date": "2026-10-06",
                    "time": "10:00 AM",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-027",
                    "date": "2026-11-02",
                    "time": "11:00 AM",
                    "services": [
                        "Fertility Scan",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-028",
                    "date": "2026-11-20",
                    "time": "09:00 AM",
                    "services": [
                        "Fertility Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 3,
            "notes": 8
        }
    },
    {
        "id": "REF-8002",
        "name": "Naomi Nagata",
        "dob": "1978-06-15",
        "gender": "Female",
        "email": "naomi.nagata@email.com",
        "phone": "+1 (555) 155-2785",
        "address": "735 Nagata Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-039",
                    "date": "2026-04-08",
                    "time": "12:00 PM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-033",
                    "date": "2026-03-19",
                    "time": "02:00 PM",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-035",
                    "date": "2026-02-16",
                    "time": "12:00 PM",
                    "services": [
                        "General Blood Tests",
                        "Growth Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-037",
                    "date": "2026-02-15",
                    "time": "01:30 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-034",
                    "date": "2025-10-19",
                    "time": "01:30 PM",
                    "services": [
                        "Gender Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-038",
                    "date": "2025-06-27",
                    "time": "12:00 PM",
                    "services": [
                        "General Blood Tests",
                        "Follow-up Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-036",
                    "date": "2025-03-20",
                    "time": "11:00 AM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-031",
                    "date": "2025-03-05",
                    "time": "09:30 AM",
                    "services": [
                        "Early Pregnancy Scan",
                        "Follow-up Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-030",
                    "date": "2025-02-16",
                    "time": "02:30 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-032",
                    "date": "2025-01-20",
                    "time": "02:00 PM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "No Show"
                }
            ],
            "future": [
                {
                    "id": "APT-040",
                    "date": "2026-08-16",
                    "time": "02:00 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-043",
                    "date": "2026-08-30",
                    "time": "02:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-042",
                    "date": "2026-10-14",
                    "time": "09:30 AM",
                    "services": [
                        "Thalassaemia Screening",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-041",
                    "date": "2026-10-21",
                    "time": "03:30 PM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 7
        }
    },
    {
        "id": "REF-8003",
        "name": "Amos Burton",
        "dob": "1981-09-15",
        "gender": "Male",
        "email": "amos.burton@email.com",
        "phone": "+1 (555) 629-3381",
        "address": "270 Burton Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-048",
                    "date": "2026-06-15",
                    "time": "01:00 PM",
                    "services": [
                        "Early Pregnancy Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-053",
                    "date": "2026-05-01",
                    "time": "12:00 PM",
                    "services": [
                        "NIPT Blood Test",
                        "Fertility Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-044",
                    "date": "2026-03-21",
                    "time": "03:00 PM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-046",
                    "date": "2026-01-15",
                    "time": "09:00 AM",
                    "services": [
                        "Fertility Scan",
                        "Genotype Blood Test",
                        "Dating Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-050",
                    "date": "2025-12-14",
                    "time": "04:00 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-051",
                    "date": "2025-10-08",
                    "time": "10:00 AM",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-047",
                    "date": "2025-09-26",
                    "time": "01:30 PM",
                    "services": [
                        "Gender Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-052",
                    "date": "2025-08-04",
                    "time": "03:30 PM",
                    "services": [
                        "NIPT Blood Test",
                        "Reassurance Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-045",
                    "date": "2025-06-11",
                    "time": "11:30 AM",
                    "services": [
                        "Fertility Scan",
                        "Follow-up Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-049",
                    "date": "2025-02-15",
                    "time": "02:30 PM",
                    "services": [
                        "Genotype Blood Test",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-055",
                    "date": "2026-10-01",
                    "time": "09:30 AM",
                    "services": [
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-057",
                    "date": "2026-10-31",
                    "time": "02:00 PM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-054",
                    "date": "2026-11-16",
                    "time": "12:00 PM",
                    "services": [
                        "Fertility Scan",
                        "Well Woman Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-056",
                    "date": "2026-11-23",
                    "time": "10:30 AM",
                    "services": [
                        "Genotype Blood Test",
                        "Follow-up Scan",
                        "Growth Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 0,
            "notes": 5
        }
    },
    {
        "id": "REF-8004",
        "name": "Alex Kamal",
        "dob": "1987-06-15",
        "gender": "Female",
        "email": "alex.kamal@email.com",
        "phone": "+1 (555) 944-4368",
        "address": "184 Kamal Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-067",
                    "date": "2026-06-25",
                    "time": "10:00 AM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-058",
                    "date": "2026-04-27",
                    "time": "09:00 AM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-065",
                    "date": "2026-03-21",
                    "time": "01:30 PM",
                    "services": [
                        "Gender Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-059",
                    "date": "2026-02-14",
                    "time": "01:30 PM",
                    "services": [
                        "Growth Scan",
                        "Gender Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-063",
                    "date": "2026-01-14",
                    "time": "09:30 AM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-064",
                    "date": "2025-11-12",
                    "time": "12:30 PM",
                    "services": [
                        "General Blood Tests",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-069",
                    "date": "2025-07-09",
                    "time": "12:00 PM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-060",
                    "date": "2025-06-29",
                    "time": "12:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-066",
                    "date": "2025-06-26",
                    "time": "12:00 PM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-062",
                    "date": "2025-05-23",
                    "time": "11:30 AM",
                    "services": [
                        "NIPT Blood Test",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-061",
                    "date": "2025-05-07",
                    "time": "11:00 AM",
                    "services": [
                        "Dating Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-068",
                    "date": "2025-03-20",
                    "time": "11:00 AM",
                    "services": [
                        "Well Woman Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-072",
                    "date": "2026-07-23",
                    "time": "10:00 AM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-073",
                    "date": "2026-09-17",
                    "time": "11:30 AM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Early Pregnancy Scan",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-070",
                    "date": "2026-10-27",
                    "time": "11:30 AM",
                    "services": [
                        "Well Woman Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-071",
                    "date": "2026-11-30",
                    "time": "12:30 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-074",
                    "date": "2026-12-05",
                    "time": "03:00 PM",
                    "services": [
                        "Reassurance Scan",
                        "Early Pregnancy Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 4,
            "notes": 9
        }
    },
    {
        "id": "REF-8005",
        "name": "Chrisjen Avasarala",
        "dob": "1992-04-15",
        "gender": "Male",
        "email": "chrisjen.avasarala@email.com",
        "phone": "+1 (555) 343-7014",
        "address": "178 Avasarala Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-075",
                    "date": "2026-03-28",
                    "time": "01:30 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-082",
                    "date": "2026-03-06",
                    "time": "04:30 PM",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-078",
                    "date": "2026-02-19",
                    "time": "02:00 PM",
                    "services": [
                        "Follow-up Scan",
                        "Dating Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-079",
                    "date": "2026-02-02",
                    "time": "09:00 AM",
                    "services": [
                        "Thalassaemia Screening",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-084",
                    "date": "2025-11-05",
                    "time": "11:00 AM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-085",
                    "date": "2025-09-22",
                    "time": "04:30 PM",
                    "services": [
                        "Gender Scan",
                        "Genotype Blood Test",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-077",
                    "date": "2025-04-15",
                    "time": "02:30 PM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-083",
                    "date": "2025-03-16",
                    "time": "03:30 PM",
                    "services": [
                        "NIPT Blood Test",
                        "Thalassaemia Screening",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-080",
                    "date": "2025-01-13",
                    "time": "03:30 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-081",
                    "date": "2025-01-10",
                    "time": "04:00 PM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-076",
                    "date": "2025-01-08",
                    "time": "10:00 AM",
                    "services": [
                        "Fertility Scan",
                        "General Blood Tests",
                        "Genotype Blood Test"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-090",
                    "date": "2026-08-02",
                    "time": "04:00 PM",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-087",
                    "date": "2026-08-15",
                    "time": "01:00 PM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-086",
                    "date": "2026-09-09",
                    "time": "04:00 PM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-091",
                    "date": "2026-10-29",
                    "time": "12:00 PM",
                    "services": [
                        "Early Pregnancy Scan",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-088",
                    "date": "2026-11-05",
                    "time": "10:30 AM",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-089",
                    "date": "2026-11-29",
                    "time": "04:30 PM",
                    "services": [
                        "Reassurance Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 4,
            "notes": 2
        }
    },
    {
        "id": "REF-8006",
        "name": "Bobbie Draper",
        "dob": "1971-06-15",
        "gender": "Female",
        "email": "bobbie.draper@email.com",
        "phone": "+1 (555) 222-4881",
        "address": "180 Draper Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-093",
                    "date": "2026-03-29",
                    "time": "09:00 AM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-102",
                    "date": "2026-03-20",
                    "time": "02:30 PM",
                    "services": [
                        "Well Woman Scan",
                        "Early Pregnancy Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-097",
                    "date": "2026-02-14",
                    "time": "03:30 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-096",
                    "date": "2026-02-08",
                    "time": "04:00 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-095",
                    "date": "2026-01-24",
                    "time": "04:30 PM",
                    "services": [
                        "Fertility Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-098",
                    "date": "2025-12-04",
                    "time": "09:00 AM",
                    "services": [
                        "Well Woman Scan",
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-092",
                    "date": "2025-11-12",
                    "time": "12:00 PM",
                    "services": [
                        "Fertility Scan",
                        "Gender Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-099",
                    "date": "2025-10-07",
                    "time": "11:30 AM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-100",
                    "date": "2025-04-17",
                    "time": "09:00 AM",
                    "services": [
                        "Dating Scan",
                        "Early Pregnancy Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-094",
                    "date": "2025-01-15",
                    "time": "04:00 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-101",
                    "date": "2025-01-08",
                    "time": "02:00 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-104",
                    "date": "2026-07-08",
                    "time": "10:00 AM",
                    "services": [
                        "Thalassaemia Screening",
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-105",
                    "date": "2026-07-16",
                    "time": "09:00 AM",
                    "services": [
                        "Dating Scan",
                        "General Blood Tests",
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-107",
                    "date": "2026-09-15",
                    "time": "10:00 AM",
                    "services": [
                        "Genotype Blood Test",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-103",
                    "date": "2026-10-12",
                    "time": "02:00 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-108",
                    "date": "2026-11-01",
                    "time": "09:30 AM",
                    "services": [
                        "Fertility Scan",
                        "Growth Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-106",
                    "date": "2026-11-08",
                    "time": "02:00 PM",
                    "services": [
                        "Fertility Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 8
        }
    },
    {
        "id": "REF-8007",
        "name": "Fred Johnson",
        "dob": "1978-06-15",
        "gender": "Male",
        "email": "fred.johnson@email.com",
        "phone": "+1 (555) 550-1790",
        "address": "931 Johnson Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-119",
                    "date": "2026-04-26",
                    "time": "01:30 PM",
                    "services": [
                        "Dating Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-111",
                    "date": "2026-04-13",
                    "time": "03:00 PM",
                    "services": [
                        "Gender Scan",
                        "Thalassaemia Screening",
                        "NIPT Blood Test"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-120",
                    "date": "2026-03-03",
                    "time": "04:30 PM",
                    "services": [
                        "Reassurance Scan",
                        "Gender Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-114",
                    "date": "2026-02-16",
                    "time": "12:00 PM",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-113",
                    "date": "2025-11-18",
                    "time": "04:30 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Reassurance Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-118",
                    "date": "2025-09-22",
                    "time": "12:30 PM",
                    "services": [
                        "Follow-up Scan",
                        "NIPT Blood Test",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-116",
                    "date": "2025-08-08",
                    "time": "04:30 PM",
                    "services": [
                        "Early Pregnancy Scan",
                        "Genotype Blood Test",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-110",
                    "date": "2025-07-26",
                    "time": "09:30 AM",
                    "services": [
                        "Reassurance Scan",
                        "Gender Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-112",
                    "date": "2025-04-18",
                    "time": "01:00 PM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-115",
                    "date": "2025-02-17",
                    "time": "11:30 AM",
                    "services": [
                        "Genotype Blood Test",
                        "Dating Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-117",
                    "date": "2025-02-02",
                    "time": "03:30 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-109",
                    "date": "2025-01-01",
                    "time": "10:30 AM",
                    "services": [
                        "General Blood Tests",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-123",
                    "date": "2026-09-08",
                    "time": "04:30 PM",
                    "services": [
                        "Reassurance Scan",
                        "General Blood Tests",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-122",
                    "date": "2026-09-30",
                    "time": "04:00 PM",
                    "services": [
                        "Fertility Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-125",
                    "date": "2026-10-10",
                    "time": "12:30 PM",
                    "services": [
                        "Gender Scan",
                        "Thalassaemia Screening",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-124",
                    "date": "2026-11-27",
                    "time": "04:30 PM",
                    "services": [
                        "Gender Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-126",
                    "date": "2026-12-09",
                    "time": "10:00 AM",
                    "services": [
                        "General Blood Tests",
                        "Growth Scan",
                        "Well Woman Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-121",
                    "date": "2026-12-14",
                    "time": "12:00 PM",
                    "services": [
                        "Reassurance Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 3
        }
    },
    {
        "id": "REF-8008",
        "name": "Josephus Miller",
        "dob": "1975-04-15",
        "gender": "Female",
        "email": "josephus.miller@email.com",
        "phone": "+1 (555) 131-2176",
        "address": "285 Miller Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-133",
                    "date": "2026-06-29",
                    "time": "10:00 AM",
                    "services": [
                        "General Blood Tests",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-138",
                    "date": "2026-05-08",
                    "time": "01:30 PM",
                    "services": [
                        "Genotype Blood Test",
                        "4D/5D Baby Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-129",
                    "date": "2026-04-28",
                    "time": "02:00 PM",
                    "services": [
                        "Well Woman Scan",
                        "Reassurance Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-135",
                    "date": "2026-04-26",
                    "time": "02:30 PM",
                    "services": [
                        "NIPT Blood Test",
                        "Genotype Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-131",
                    "date": "2026-04-13",
                    "time": "10:00 AM",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-136",
                    "date": "2026-01-28",
                    "time": "11:00 AM",
                    "services": [
                        "Growth Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-137",
                    "date": "2026-01-19",
                    "time": "09:30 AM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-128",
                    "date": "2025-09-23",
                    "time": "03:00 PM",
                    "services": [
                        "Gender Scan",
                        "Follow-up Scan",
                        "Fertility Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-132",
                    "date": "2025-07-12",
                    "time": "11:00 AM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-130",
                    "date": "2025-05-21",
                    "time": "04:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-134",
                    "date": "2025-05-14",
                    "time": "01:30 PM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-127",
                    "date": "2025-02-04",
                    "time": "12:30 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-142",
                    "date": "2026-07-10",
                    "time": "03:30 PM",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-141",
                    "date": "2026-09-27",
                    "time": "12:30 PM",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-139",
                    "date": "2026-09-30",
                    "time": "12:00 PM",
                    "services": [
                        "Gender Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-140",
                    "date": "2026-12-20",
                    "time": "09:30 AM",
                    "services": [
                        "General Blood Tests",
                        "Well Woman Scan",
                        "Dating Scan"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 4,
            "consents": 1,
            "notes": 9
        }
    },
    {
        "id": "REF-8009",
        "name": "Clarissa Mao",
        "dob": "1983-06-15",
        "gender": "Male",
        "email": "clarissa.mao@email.com",
        "phone": "+1 (555) 716-8684",
        "address": "781 Mao Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-152",
                    "date": "2026-05-28",
                    "time": "11:30 AM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-146",
                    "date": "2026-05-20",
                    "time": "12:00 PM",
                    "services": [
                        "Follow-up Scan",
                        "Well Woman Scan",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-151",
                    "date": "2026-01-13",
                    "time": "04:30 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-145",
                    "date": "2025-12-31",
                    "time": "10:00 AM",
                    "services": [
                        "Genotype Blood Test",
                        "NIPT Blood Test",
                        "General Blood Tests"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-153",
                    "date": "2025-12-06",
                    "time": "10:30 AM",
                    "services": [
                        "4D/5D Baby Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-148",
                    "date": "2025-07-23",
                    "time": "10:00 AM",
                    "services": [
                        "Genotype Blood Test",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-150",
                    "date": "2025-07-19",
                    "time": "09:00 AM",
                    "services": [
                        "General Blood Tests",
                        "Fertility Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-143",
                    "date": "2025-06-12",
                    "time": "04:00 PM",
                    "services": [
                        "Early Pregnancy Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-144",
                    "date": "2025-06-01",
                    "time": "01:30 PM",
                    "services": [
                        "Well Woman Scan",
                        "Follow-up Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-149",
                    "date": "2025-02-18",
                    "time": "12:30 PM",
                    "services": [
                        "General Blood Tests",
                        "Dating Scan",
                        "Fertility Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-147",
                    "date": "2025-01-11",
                    "time": "10:00 AM",
                    "services": [
                        "Reassurance Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-156",
                    "date": "2026-07-18",
                    "time": "04:30 PM",
                    "services": [
                        "Fertility Scan",
                        "Well Woman Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-155",
                    "date": "2026-09-14",
                    "time": "03:30 PM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-154",
                    "date": "2026-10-06",
                    "time": "09:30 AM",
                    "services": [
                        "Reassurance Scan",
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-157",
                    "date": "2026-12-01",
                    "time": "10:00 AM",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 4,
            "notes": 9
        }
    },
    {
        "id": "REF-8010",
        "name": "Julie Dawes",
        "dob": "1972-07-15",
        "gender": "Female",
        "email": "julie.dawes@email.com",
        "phone": "+1 (555) 232-9573",
        "address": "282 Dawes Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-165",
                    "date": "2026-05-16",
                    "time": "04:00 PM",
                    "services": [
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-169",
                    "date": "2026-05-03",
                    "time": "04:00 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Fertility Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-162",
                    "date": "2026-04-15",
                    "time": "01:00 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-163",
                    "date": "2026-01-06",
                    "time": "10:30 AM",
                    "services": [
                        "Growth Scan",
                        "Gender Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-167",
                    "date": "2025-10-31",
                    "time": "04:00 PM",
                    "services": [
                        "Thalassaemia Screening"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-161",
                    "date": "2025-10-19",
                    "time": "10:30 AM",
                    "services": [
                        "Follow-up Scan",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-168",
                    "date": "2025-08-27",
                    "time": "01:30 PM",
                    "services": [
                        "Growth Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-158",
                    "date": "2025-08-01",
                    "time": "04:00 PM",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-160",
                    "date": "2025-06-20",
                    "time": "04:30 PM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Dating Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-164",
                    "date": "2025-03-28",
                    "time": "12:00 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-159",
                    "date": "2025-03-08",
                    "time": "10:30 AM",
                    "services": [
                        "Early Pregnancy Scan",
                        "4D/5D Baby Scan"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-166",
                    "date": "2025-01-08",
                    "time": "10:30 AM",
                    "services": [
                        "Dating Scan",
                        "Well Woman Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-171",
                    "date": "2026-07-11",
                    "time": "09:00 AM",
                    "services": [
                        "Reassurance Scan",
                        "4D/5D Baby Scan",
                        "Thalassaemia Screening"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-175",
                    "date": "2026-08-06",
                    "time": "03:30 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-174",
                    "date": "2026-09-14",
                    "time": "11:00 AM",
                    "services": [
                        "Follow-up Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-170",
                    "date": "2026-09-27",
                    "time": "03:00 PM",
                    "services": [
                        "Reassurance Scan",
                        "Gender Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-173",
                    "date": "2026-10-09",
                    "time": "10:30 AM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-172",
                    "date": "2026-10-24",
                    "time": "12:00 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Thalassaemia Screening",
                        "General Blood Tests"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 3,
            "notes": 5
        }
    },
    {
        "id": "REF-8011",
        "name": "Anderson Vance",
        "dob": "1972-05-15",
        "gender": "Male",
        "email": "anderson.vance@email.com",
        "phone": "+1 (555) 162-9225",
        "address": "771 Vance Street, NY 10001",
        "history": {
            "past": [
                {
                    "id": "APT-177",
                    "date": "2026-06-25",
                    "time": "03:00 PM",
                    "services": [
                        "Gender Scan",
                        "NIPT Blood Test"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-186",
                    "date": "2026-05-15",
                    "time": "01:30 PM",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-183",
                    "date": "2025-12-26",
                    "time": "01:00 PM",
                    "services": [
                        "Early Pregnancy Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-185",
                    "date": "2025-12-16",
                    "time": "09:00 AM",
                    "services": [
                        "NIPT Blood Test"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-181",
                    "date": "2025-06-22",
                    "time": "02:30 PM",
                    "services": [
                        "NIPT Blood Test",
                        "Well Woman Scan",
                        "General Blood Tests"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-180",
                    "date": "2025-05-22",
                    "time": "01:30 PM",
                    "services": [
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-182",
                    "date": "2025-05-20",
                    "time": "12:00 PM",
                    "services": [
                        "Well Woman Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-178",
                    "date": "2025-05-13",
                    "time": "12:30 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Fertility Scan"
                    ],
                    "status": "No Show"
                },
                {
                    "id": "APT-176",
                    "date": "2025-04-20",
                    "time": "02:30 PM",
                    "services": [
                        "4D/5D Baby Scan",
                        "General Blood Tests"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-184",
                    "date": "2025-04-04",
                    "time": "02:00 PM",
                    "services": [
                        "General Blood Tests",
                        "Dating Scan"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-179",
                    "date": "2025-01-28",
                    "time": "01:00 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Reassurance Scan"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-190",
                    "date": "2026-07-09",
                    "time": "02:00 PM",
                    "services": [
                        "Genotype Blood Test",
                        "Thalassaemia Screening",
                        "Reassurance Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-187",
                    "date": "2026-10-20",
                    "time": "04:30 PM",
                    "services": [
                        "Thalassaemia Screening",
                        "Gender Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-188",
                    "date": "2026-12-18",
                    "time": "12:30 PM",
                    "services": [
                        "4D/5D Baby Scan",
                        "Early Pregnancy Scan"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-189",
                    "date": "2026-12-21",
                    "time": "11:30 AM",
                    "services": [
                        "Genotype Blood Test"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 5
        }
    }
];

export const getAptFinancials = (apt: AppointmentRecord) => {
    let paid = 0;
    let pending = 0;
    const basePrice = apt.services.length * 80;
    if (apt.status === "Completed") {
        paid = basePrice;
        pending = 0;
    } else if (apt.status === "Pending") {
        paid = Math.floor(basePrice * 0.3);
        pending = basePrice - paid;
    } else if (apt.status === "Cancelled") {
        paid = 0;
        pending = 0;
    } else if (apt.status === "No Show") {
        paid = Math.floor(basePrice * 0.4);
        pending = basePrice - paid;
    }
    return { paid, pending };
};

export const getClinicalNotes = (p: Patient) => {
    return p.history.past.map((apt, idx) => ({
        id: `N-${apt.id.split('-')[1] || idx}`,
        date: apt.date,
        author: "Dr. Sarah Jenkins",
        note: `Notes for ${apt.services.join(" & ")}: Patient checked in. Procedure performed successfully. No immediate abnormalities detected. Standard follow-up advised.`
    }));
};
