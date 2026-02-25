#!/usr/bin/env python3
"""
Benefits data for foster youth aging out.
Data sources (for manual updates and future scraping):
- BC: https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/teens-in-foster-care/aging-out-of-care
- BC SAJE: https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions
- ON ABI: https://www.ontario.ca/document/mccss-service-objectives-child-welfare-and-protection/services-delivered-aftercare
- ON Ready Set Go: https://www.ontario.ca/document/child-protection-service-directives-forms-and-guidelines
"""
import json
from pathlib import Path

# Curated benefits - simplified for 8th grade reading level
# Phone numbers and deadlines in bold for quick scanning
BENEFITS = {
    "bc": {
        "province": "British Columbia",
        "programs": [
            {
                "name": "SAJE (Strengthening Abilities and Journeys of Empowerment)",
                "age": "19–27",
                "what": "Income support up to $1,250/mo, rent help, mental health, dental ($1,000/yr), optical ($600/2yr)",
                "phone": "1-800-663-7867",
                "link": "https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions",
            },
            {
                "name": "SAJE Rent Supplement",
                "age": "19–27",
                "what": "Up to $600/month for 24 months if you qualify",
                "phone": "1-800-663-7867",
                "link": "https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions",
            },
            {
                "name": "Youth Educational Assistance Fund",
                "age": "19–24",
                "what": "Up to $5,500 per year for school (max $11,000 total)",
                "phone": "1-800-561-1818",
                "link": "https://studentaidbc.ca/explore/grants-scholarships/youth-educational-assistance-fund-former-youth-care",
            },
            {
                "name": "SAJE Life-Skills Funding",
                "age": "19–27",
                "what": "Up to $5,500/year (max $11,000) for education, training, life skills",
                "phone": "1-800-663-7867",
                "link": "https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions",
            },
            {
                "name": "SAJE Housing Agreements",
                "age": "19–21",
                "what": "Stay in your current home until 21 with support",
                "phone": "1-800-663-7867",
                "link": "https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions",
            },
            {
                "name": "BC211",
                "age": "All",
                "what": "Free help finding services: housing, food, counselling, more",
                "phone": "211",
                "link": "https://bc211.ca/",
            },
            {
                "name": "AgedOut.com",
                "age": "All",
                "what": "Info on education, housing, jobs, life skills",
                "phone": "",
                "link": "https://agedout.com/",
            },
        ],
    },
    "on": {
        "province": "Ontario",
        "programs": [
            {
                "name": "Ready, Set, Go Program",
                "age": "18–22",
                "what": "$1,800/mo at 18, $1,500 at 19, $1,000 at 20–22. Extra $500/mo if in school. Work 40 hrs/wk without losing benefits.",
                "phone": "Contact your child welfare worker",
                "link": "https://www.ontario.ca/page/support-youth-child-welfare-system",
            },
            {
                "name": "Aftercare Benefits Initiative (ABI)",
                "age": "21–25",
                "what": "Free health and dental benefits for 4 years. Life skills counselling until 29.",
                "phone": "1-800-263-2841",
                "link": "https://www.ontario.ca/document/mccss-service-objectives-child-welfare-and-protection/services-delivered-aftercare",
            },
            {
                "name": "Living and Learning Grant (OSAP)",
                "age": "19–26",
                "what": "Money for post-secondary. No repayment for former youth in care.",
                "phone": "1-800-387-5514",
                "link": "https://www.ontario.ca/page/ontario-student-assistance-program-osap",
            },
            {
                "name": "Extended Care Support",
                "age": "Up to 25",
                "what": "Some children's aid societies offer support until 25. Ask your worker.",
                "phone": "Contact your children's aid society",
                "link": "https://www.ontario.ca/page/support-youth-child-welfare-system",
            },
            {
                "name": "211 Ontario",
                "age": "All",
                "what": "Free help finding services: housing, food, counselling, more",
                "phone": "211",
                "link": "https://211ontario.ca/",
            },
            {
                "name": "AgedOut.com",
                "age": "All",
                "what": "Info on education, housing, jobs, life skills",
                "phone": "",
                "link": "https://agedout.com/",
            },
        ],
    },
}


def main():
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "benefits.json").write_text(json.dumps(BENEFITS, indent=2))
    print("Wrote benefits.json")


if __name__ == "__main__":
    main()
