import os
import sys
import re
import csv
import time
import urllib.request
import urllib.parse
import json
import unicodedata

# Reconfigure stdout to use UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Input raw list of names provided by the user
RAW_NAMES = [
    "RHA PRAXIS INITIATIVE® architecture + interior + construction",
    "Roshani Architects",
    "G S PLUS Architecture - Best Architects in Raipur",
    "A.L.M Designs",
    "Vinay Goyal and Associates | Architecture |Construction |Interior",
    "R.S.Construction & Academy",
    "VSR Structural & Interior Designer",
    "Arthat Architects",
    "Urban Reflection Interior",
    "Shubham Ghatge Architects ( Sg_Architects_Design_Studio )",
    "V Dimension",
    "Studio Adiva",
    "B A S I C S Studio",
    "Deval's creations 3D Exterior design",
    "FWD Architects Raipur",
    "Navin Sharma And Associates Architect",
    "Avayanna",
    "Sk Architects and Associates|best architect|best urban planning in Raipur",
    "Elite Concepts",
    "Swapnil Jaggi Architects",
    "Trigno Architects (Ar Mohnish Sinha)",
    "FWD Architects Raipur",  # Duplicate
    "Elite Concepts",         # Duplicate
    "SUKHI CONSTRUCTIONS & DESIGN CONSULTANCY",
    "Monarch Studio",
    "AARAMBH DESIGN STUDIO",
    "SKYLINE Architects",
    "WAVE ARCH ATELIER",
    "S Square Studio",
    "𝐌𝐚𝐤𝐞 𝐒𝐩𝐚𝐜𝐞 𝐈𝐧𝐭𝐞𝐫𝐢𝐨𝐫",
    "AAYAM ARCHITECT AND CONSULTANT",
    "Homelink Interior Design | Home Design | Interior Designer | Best Interior Designers | Interior Design | Architect | Raipur",
    "Creative Architects",
    "Raipur Builder | #1 construction company | architect | civil contractors | in Raipur | in Chhattisgarh",
    "Navin Design and Construction - Best Building Planner | Best Civil Contractor | Best Architectural Services in Raipur",
    "AAYAM LAND SURVEYING AND MAPPING (Er. Nitin Sinha)",
    "Taksh Design Studio",
    "Architect Shadil - Land/Building Regularisation and Approval Consultant",
    "World Interior Creation",
    "CoreConcept Interior Designers - Best interior designers in raipur | Best architects in raipur",
    "JB DESIGNS",
    "kite creations",
    "Kriti construction",
    "UNIT SQUARE ENGINEERS AND ARCHITECTS",
    "Bhakre Associates (Ar. Piyush Bhakre & Vikas Bhakre)",
    "Bharti & Associates",
    "New Folder Architects",
    "SHILPKRAFT",
    "Studio Skywell",
    "STAMBH ARCHITECTS & CONSULTANTS",
    "Kapadia & Associates",
    "Nishchal Garg Architects",
    "Studio Baariki - Architecture & Interiors",
    "CREATIVE DESIGN",
    "Avam Consultants",
    "Architect Siddhant Sharma Associates",
    "BUILD SPACE",
    "White Tree Architects",
    "Shree Balaji Builders | best construction company | interior designer | civil contractors | in Raipur | architect | in C.G.",
    "VIVISHA CONSTRUCTIONS- Residential, Commercial, Showroom Architects",
    "Raj Creation",
    "Amit Agrawal and Associates",
    "Buildkrafft Engineering and Architecure",
    "Designer Vision",
    "G.T.Design Studio",
    "Satat - Design Studio",
    "Architect Satish Jain",
    "VASTU ANGLE ARCHITECTS & ASSOCIATES",
    "AGRATAS ARCHITECTS",
    "Prithvi Developers | Construction company | Turnkey Projects | Architect | Civil contractors In Raipur, Chhattisgarh",
    "KRDS",
    "Elementalz Inc. India",
    "Bagrecha Interiors || Best Interior Designer in Raipur",
    "kothari and associates",
    "ARCHITECT ANAND KHADIA",
    "Squared Design Studio",
    "Studio Green Ink",
    "atel'ye apurv",
    "Bhawnani & Associates",
    "Architect Apoorva Singh",
    "Lagan Marwah Architects",
    "NakshaPlus(Architects & Engineers)",
    "Pushp Architects & Interiors",
    "aakaar architects and interior designers",
    "Yug Constructions and Developers",
    "DrishtiCone Architects & Consultants",
    "Creative Layout | Best Construction Company in Raipur",
    "White Tree Architects",  # Duplicate
    "Diwakirti Associates Pvt Ltd",
    "ARCHITECT ROHIT MARATHE",
    "De cube Studios",
    "PRABODH MATHUR architect-planner-valuer",
    "Shiva Bhagwani Architects and Associates",
    "Design Culture",
    "VINTAGE OAK - Architecture & Interiors",
    "Bagrecha and Associates (Subodh Bagrecha & Aishwarya Bagrecha)",
    "STUDIO TATHYA",
    "Ishanya Group",
    "Constructable",
    "CAD Academy, Tatyapara"
]

def clean_name(name):
    # Normalize fancy unicode bold/italic mathematical alphanumeric characters
    name = unicodedata.normalize('NFKD', name)
    # Strip trademarks, decorative characters
    c = name.replace("®", "").replace("™", "")
    # Remove vertical bar suffixes (often marketing tags)
    c = c.split("|")[0]
    # Remove hyphen suffixes
    c = c.split("-")[0]
    # Remove double slashes
    c = c.split("||")[0]
    # Remove brackets
    c = re.sub(r'\(.*?\)', '', c)
    # Remove extra spaces and strip
    c = " ".join(c.split())
    # Strip specific trailing descriptors
    descriptors = [
        "best architect", "best urban planning in Raipur", "best interior designers", 
        "architecture + interior + construction", "Architecture", "Construction", "Interior",
        "Residential", "Commercial", "Showroom Architects"
    ]
    for desc in descriptors:
        if c.lower().endswith(" " + desc.lower()):
            c = c[:-len(desc) - 1]
    return c.strip()

# Deduplicate raw names while maintaining order
UNIQUE_FIRMS = []
seen = set()
for r in RAW_NAMES:
    cleaned = clean_name(r)
    if cleaned.lower() not in seen and cleaned != "":
        seen.add(cleaned.lower())
        UNIQUE_FIRMS.append((r, cleaned))

print(f"Total Raw Items: {len(RAW_NAMES)}")
print(f"Unique Cleaned Items: {len(UNIQUE_FIRMS)}")

# Regex patterns
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')

# Indian Mobile and Raipur Landline patterns
# Matches patterns like +91 99992 65607, 98765-43210, 0771-4001234, etc.
PHONE_REGEX = re.compile(r'(?:\+91[\s\-\.]?)?\b[6-9]\d{4}[\s\-\.]?\d{5}\b|(?:\+91[\s\-\.]?)?\b[6-9]\d{9}\b|\b0771[\s\-\.]?\d{6,7}\b|\b\d{5}[\s\-\.]?\d{5}\b')

# Pin code filter to prevent matching Raipur zip codes as phone numbers
PINCODES = {"492001", "492002", "492003", "492004", "492005", "492006", "492007", "492008", "492009", "492010", "492013", "492015", "492099", "492012"}

def search_yahoo(query):
    url = 'https://search.yahoo.com/search?q=' + urllib.parse.quote(query)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching Yahoo search results for '{query}': {e}")
        return ""

def extract_contacts_from_html(html):
    # Strip out the <b> and </b> tags in the raw html because Yahoo highlights matching words.
    # If we strip them first, it prevents formatting spaces in emails/phones.
    html_cleaned = html.replace("<b>", "").replace("</b>", "").replace("<strong>", "").replace("</strong>", "")
    
    # Extract compText snippets
    snippets = re.findall(r'<div class="compText[^"]*">(.*?)</div>', html_cleaned, re.DOTALL)
    
    # Extract links and titles
    links_data = re.findall(r'<a[^>]*href=["\'](https://r\.search\.yahoo\.com/[^"\']+)["\'][^>]*>(.*?)</a>', html_cleaned, re.DOTALL)
    
    links = []
    titles = []
    for h, title_html in links_data:
        m = re.search(r'/RU=([^/]+)', h)
        if m:
            dest_url = urllib.parse.unquote(m.group(1))
            title_text = re.sub(r'<[^>]+>', '', title_html).strip()
            links.append(dest_url)
            titles.append(title_text)
            
    # Combine text for contact parsing
    clean_snippets = [re.sub(r'<[^>]+>', '', s) for s in snippets]
    clean_titles = titles
    
    combined_text = " ".join(clean_titles) + " " + " ".join(clean_snippets)
    # Clean HTML entities
    combined_text = (combined_text.replace("&amp;", "&")
                                  .replace("&quot;", '"')
                                  .replace("&#39;", "'")
                                  .replace("&lt;", "<")
                                  .replace("&gt;", ">")
                                  .replace("&mdash;", "-")
                                  .replace("&ndash;", "-"))
    
    # Extract emails
    emails = list(set(EMAIL_REGEX.findall(combined_text)))
    # Exclude common system/invalid/short emails
    exclude_emails = {'sentry', 'wix', 'wordpress', 'example', 'domain', 'email', 'yourname', 'png', 'jpg', 'google', 'yahoo', 'microsoft'}
    emails = [e for e in emails if not any(x in e.lower() for x in exclude_emails) and '.' in e.split('@')[-1]]
    
    # Extract phone numbers
    raw_phones = PHONE_REGEX.findall(combined_text)
    phones = []
    for p in raw_phones:
        # Strip formatting
        clean_p = re.sub(r'[\s\-\.\(\)\+]', '', p)
        # Handle country code prefix
        if clean_p.startswith('91') and len(clean_p) > 10:
            clean_p = clean_p[2:]
        if clean_p.startswith('0') and len(clean_p) > 10:
            clean_p = clean_p[1:]
            
        # Validate length and check against Raipur PIN codes
        if len(clean_p) >= 10 and clean_p[:6] not in PINCODES and clean_p not in PINCODES:
            # Format as +91 XXXXX XXXXX for mobile
            if len(clean_p) == 10 and clean_p.startswith(('6', '7', '8', '9')):
                formatted = f"+91 {clean_p[:5]} {clean_p[5:]}"
                if formatted not in phones:
                    phones.append(formatted)
            # Raipur landline
            elif clean_p.startswith('0771') or clean_p.startswith('771'):
                if not clean_p.startswith('0'):
                    clean_p = '0' + clean_p
                formatted = f"{clean_p[:4]}-{clean_p[4:]}"
                if formatted not in phones:
                    phones.append(formatted)
            else:
                if clean_p not in phones:
                    phones.append(clean_p)
                    
    # Look for top business website URL
    website = ""
    for link in links:
        link_lower = link.lower()
        if "yahoo" in link_lower or "yimg" in link_lower:
            continue
        # Skip standard large directories for custom websites, but keep them as fallback
        skip_dirs = ['facebook.com', 'instagram.com', 'linkedin.com', 'justdial.com', 'sulekha.com', 'indiamart.com', 'yellowpages', 'joonsquare', 'cybo.com', 'tradevyapar', 'youtube.com', 'twitter.com', 'pinterest.com']
        if not any(d in link_lower for d in skip_dirs):
            website = link
            break
            
    if not website and links:
        # Fallback to the first non-Yahoo link
        for link in links:
            if "yahoo" not in link.lower() and "yimg" not in link.lower():
                website = link
                break
                
    return {
        "emails": ", ".join(emails) if emails else "Not Found",
        "phones": ", ".join(phones) if phones else "Not Found",
        "website": website if website else "Not Found"
    }

def run_collector():
    results = []
    print("\nStarting search and data compilation...\n")
    
    total = len(UNIQUE_FIRMS)
    for idx, (raw_name, clean_name_str) in enumerate(UNIQUE_FIRMS):
        query = f"{clean_name_str} Raipur contact number email"
        print(f"[{idx+1}/{total}] Searching: {clean_name_str}...")
        
        # Search Yahoo
        html = search_yahoo(query)
        
        # Try fallback query if first search yields nothing
        contacts = extract_contacts_from_html(html)
        if contacts["phones"] == "Not Found" and contacts["emails"] == "Not Found":
            # Try searching with just "phone" word
            fallback_query = f"{clean_name_str} Raipur phone"
            print(f"    Fallback search: {clean_name_str}...")
            fallback_html = search_yahoo(fallback_query)
            contacts = extract_contacts_from_html(fallback_html)
            
        print(f"    Phones: {contacts['phones']}")
        print(f"    Emails: {contacts['emails']}")
        print(f"    URL: {contacts['website']}\n")
        
        results.append({
            "Original Name": raw_name,
            "Cleaned Name": clean_name_str,
            "Phone Number": contacts["phones"],
            "Email Address": contacts["emails"],
            "Website/Source URL": contacts["website"]
        })
        
        # Rate limit spacing (approx. 1.5 seconds) to prevent blockages
        time.sleep(1.5)
        
    # Write to CSV
    csv_file = "architects_contact_directory.csv"
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["Original Name", "Cleaned Name", "Phone Number", "Email Address", "Website/Source URL"])
        writer.writeheader()
        writer.writerows(results)
    print(f"Successfully saved results to {csv_file}!")
    
    # Try converting to XLSX using openpyxl
    try:
        import openpyxl
        from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
        from openpyxl.utils import get_column_letter
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Raipur Architects Directory"
        
        # Design Theme: Deep Charcoal & Safety Gold (Matches SKETCH Brand)
        header_fill = PatternFill(start_color="1A1A1A", end_color="1A1A1A", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFB800")
        data_font = Font(name="Segoe UI", size=10, color="333333")
        not_found_font = Font(name="Segoe UI", size=10, color="999999", italic=True)
        
        thin_border = Border(
            left=Side(style='thin', color='E0E0E0'),
            right=Side(style='thin', color='E0E0E0'),
            top=Side(style='thin', color='E0E0E0'),
            bottom=Side(style='thin', color='E0E0E0')
        )
        
        headers = ["Original Name", "Cleaned Name", "Phone Number", "Email Address", "Website/Source URL"]
        ws.append(headers)
        
        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col_num)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.border = thin_border
            
        ws.row_dimensions[1].height = 26
        
        for row_num, res in enumerate(results, 2):
            row_data = [
                res["Original Name"],
                res["Cleaned Name"],
                res["Phone Number"],
                res["Email Address"],
                res["Website/Source URL"]
            ]
            ws.append(row_data)
            ws.row_dimensions[row_num].height = 20
            
            for col_num in range(1, 6):
                cell = ws.cell(row=row_num, column=col_num)
                cell.border = thin_border
                cell.alignment = Alignment(vertical="center")
                
                # Apply lighter color for "Not Found" items
                if cell.value == "Not Found":
                    cell.font = not_found_font
                else:
                    cell.font = data_font
                    
        # Autofit column widths
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 45)
            
        xlsx_file = "architects_contact_directory.xlsx"
        wb.save(xlsx_file)
        print(f"Successfully saved styled Excel file to {xlsx_file}!")
    except Exception as e:
        print(f"Failed to generate openpyxl Excel: {e}. CSV is ready and can be imported into Excel.")

if __name__ == "__main__":
    run_collector()
