import os
import csv
import sys
import base64
import time
from email.message import EmailMessage

# Reconfigure stdout to use UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CSV_FILE = "architects_contact_directory.csv"
TOKEN_FILE = "token.json"
CLIENT_SECRET_FILE = r"c:\Users\VIKKY SHARMA\Downloads\client_secret_141332446226-566nk3tbd48fmdslh65t4adcmaqvn0kf.apps.googleusercontent.com.json"

def get_gmail_service():
    from googleapiclient.discovery import build
    from google.oauth2.credentials import Credentials
    
    if not os.path.exists(TOKEN_FILE):
        print(f"Error: Token file '{TOKEN_FILE}' not found. Please run draft_emails.py first to authorize.")
        return None
        
    try:
        credentials = Credentials.from_authorized_user_file(TOKEN_FILE, ['https://www.googleapis.com/auth/gmail.compose', 'https://www.googleapis.com/auth/gmail.modify'])
        service = build('gmail', 'v1', credentials=credentials)
        return service
    except Exception as e:
        print(f"Error initializing Gmail service: {e}")
        return None

def send_initial_drafts():
    service = get_gmail_service()
    if not service:
        return
        
    print("\nRetrieving drafts from Gmail...")
    try:
        # List all drafts
        response = service.users().drafts().list(userId='me').execute()
        drafts = response.get('drafts', [])
        
        target_subject = "Collaboration Inquiry - SKETCH Construction (Raipur)"
        matching_drafts = []
        
        print(f"Total drafts found in inbox: {len(drafts)}")
        for draft in drafts:
            draft_detail = service.users().drafts().get(userId='me', id=draft['id']).execute()
            message = draft_detail.get('message', {})
            headers = message.get('payload', {}).get('headers', [])
            
            subject = ""
            to_email = ""
            for h in headers:
                if h['name'].lower() == 'subject':
                    subject = h['value']
                elif h['name'].lower() == 'to':
                    to_email = h['value']
                    
            if subject == target_subject:
                matching_drafts.append({
                    "id": draft['id'],
                    "to": to_email
                })
                
        if not matching_drafts:
            print("No matching proposal drafts found to send.")
            return
            
        print(f"Found {len(matching_drafts)} matching drafts to send.")
        success_count = 0
        for idx, md in enumerate(matching_drafts):
            print(f"[{idx+1}/{len(matching_drafts)}] Sending draft to {md['to']}...")
            try:
                # Send the draft
                service.users().drafts().send(userId='me', body={'id': md['id']}).execute()
                success_count += 1
                # Small rate-limit delay
                time.sleep(1)
            except Exception as e:
                print(f"  └─ Error sending draft: {e}")
                
        print(f"\nSuccessfully sent {success_count} initial emails!")
    except Exception as e:
        print(f"Error during draft sending: {e}")

def send_followup_emails():
    service = get_gmail_service()
    if not service:
        return
        
    if not os.path.exists(CSV_FILE):
        print(f"Error: CSV data file not found at '{CSV_FILE}'")
        return
        
    # Read firms that have valid emails
    firms_to_email = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email_field = row.get("Email Address", "")
            if email_field and email_field != "Not Found":
                emails = [e.strip() for e in email_field.split(",")]
                valid_emails = [e for e in emails if "linkedin.com" not in e.lower() and "@" in e]
                if valid_emails:
                    firms_to_email.append({
                        "name": row.get("Cleaned Name", row.get("Original Name")),
                        "emails": valid_emails
                    })
                    
    if not firms_to_email:
        print("No valid email addresses found in the CSV file.")
        return
        
    print(f"\nSending follow-up emails to {len(firms_to_email)} firms...")
    success_count = 0
    
    for idx, firm in enumerate(firms_to_email):
        name = firm["name"]
        subject = f"Re: Collaboration Inquiry - SKETCH Construction (Raipur)"
        
        # Format salutation
        salutation = f"Dear {name} Team,"
        if name.lower().startswith("architect "):
            salutation = f"Dear Ar. {name[10:]},"
        elif name.lower().startswith("ar. "):
            salutation = f"Dear {name},"
        elif name.lower().startswith("er. "):
            salutation = f"Dear {name},"
            
        body_text = f"""{salutation}

I hope you are having a productive week.

I'm following up on the email I sent last Friday regarding a potential collaboration between SKETCH Construction and your studio. 

I would love to drop by your office for a brief 10-minute introduction to share our engineer-led contracting services and see if we can support any of your active or upcoming projects in Raipur.

Please let me know if you have a brief window of availability this week.

Best regards,

SKETCH Construction Team
Shivanand Nagar, Khamtrai, Raipur
Phone: +91 8349886687 / +91 6263898315
Website: https://sketchconstruction.in"""

        for email in firm["emails"]:
            print(f"[{idx+1}/{len(firms_to_email)}] Sending follow-up to {name} ({email})...")
            try:
                # Prepare MIME message
                message = EmailMessage()
                message.set_content(body_text)
                message['To'] = email
                message['Subject'] = subject
                
                # Base64url encode the message
                raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
                msg_body = {
                    'raw': raw_message
                }
                
                # Send email
                service.users().messages().send(userId='me', body=msg_body).execute()
                success_count += 1
                # Small rate-limit delay
                time.sleep(1)
            except Exception as ex:
                print(f"  └─ Error sending follow-up: {ex}")
                
    print(f"\nSuccessfully sent {success_count} follow-up emails!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python manage_scheduling.py [send_initial | send_followup]")
        sys.exit(1)
        
    action = sys.argv[1].lower()
    if action == "send_initial":
        send_initial_drafts()
    elif action == "send_followup":
        send_followup_emails()
    else:
        print(f"Unknown action '{action}'. Use 'send_initial' or 'send_followup'.")
