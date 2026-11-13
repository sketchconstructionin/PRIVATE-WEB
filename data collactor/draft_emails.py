import os
import csv
import re
import sys
import base64
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from email.message import EmailMessage

# Reconfigure stdout to use UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CLIENT_SECRET_FILE = r"c:\Users\VIKKY SHARMA\Downloads\client_secret_141332446226-566nk3tbd48fmdslh65t4adcmaqvn0kf.apps.googleusercontent.com.json"
CSV_FILE = "architects_contact_directory.csv"

# Global variable to capture authorization code from redirect
auth_code = None

class OAuthCallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        if 'code' in query_params:
            auth_code = query_params['code'][0]
            html_response = """
            <html>
            <head><title>Authentication Successful</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #4CAF50;">Authentication Successful!</h1>
                <p>Gmail API access has been authorized. You can close this tab and return to the terminal.</p>
            </body>
            </html>
            """
            self.wfile.write(html_response.encode('utf-8'))
        else:
            self.wfile.write("Authorization code not found in redirect URL.".encode('utf-8'))

def start_local_server():
    server = HTTPServer(('localhost', 5000), OAuthCallbackHandler)
    print("\n[OAuth] Waiting for authorization callback on http://localhost:5000/oauth2callback ...")
    server.handle_request()  # Processes exactly one request and then exits

def make_email_body(cleaned_name):
    # Normalize salutation based on name structure
    salutation = f"Dear {cleaned_name} Team,"
    if cleaned_name.lower().startswith("architect "):
        salutation = f"Dear Ar. {cleaned_name[10:]},"
    elif cleaned_name.lower().startswith("ar. "):
        salutation = f"Dear {cleaned_name},"
    elif cleaned_name.lower().startswith("er. "):
        salutation = f"Dear {cleaned_name},"
        
    body = f"""{salutation}

I hope you are doing well.

I am reaching out from SKETCH Construction, an engineer-led civil contracting company based in Khamtrai, Raipur. I have been following your architectural and design works and would love to connect.

We specialize in turnkey civil construction and structural execution for premium residential (villas, G+1/G+2 duplexes) and commercial projects in Raipur. Our primary focus is ensuring your architectural drawings are executed on-site with 100% precision, strict IS/BIS rebar standards, and zero design deviation.

If you are open to collaborating on upcoming projects where you need a reliable, engineer-supervised execution partner, I would love to drop by your studio for a brief 10-minute introduction.

You can view our profile and active sites at https://sketchconstruction.in, or reach me directly at +91 8349886687.

Best regards,

SKETCH Construction Team
Shivanand Nagar, Khamtrai, Raipur
Phone: +91 8349886687 / +91 6263898315
Website: https://sketchconstruction.in"""
    return body

def main():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: Client secret file not found at '{CLIENT_SECRET_FILE}'")
        return
        
    if not os.path.exists(CSV_FILE):
        print(f"Error: CSV data file not found at '{CSV_FILE}'")
        return
        
    # Read firms that have valid emails
    firms_to_draft = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email_field = row.get("Email Address", "")
            if email_field and email_field != "Not Found":
                # Split comma-separated emails
                emails = [e.strip() for e in email_field.split(",")]
                # Filter out standard non-business emails like info@linkedin.com
                valid_emails = [e for e in emails if "linkedin.com" not in e.lower() and "@" in e]
                if valid_emails:
                    firms_to_draft.append({
                        "name": row.get("Cleaned Name", row.get("Original Name")),
                        "emails": valid_emails
                    })
                    
    if not firms_to_draft:
        print("No firms with valid email addresses found in the CSV file.")
        return
        
    print(f"Found {len(firms_to_draft)} firms with email addresses to draft proposals for.")
    
    # Initialize Google OAuth Flow
    try:
        from google_auth_oauthlib.flow import Flow
        from googleapiclient.discovery import build
    except ImportError:
        print("Required libraries are still installing. Please wait a moment and try again.")
        return
        
    try:
        from google_auth_oauthlib.flow import Flow
        from googleapiclient.discovery import build
        from google.oauth2.credentials import Credentials
    except ImportError:
        print("Required libraries are still installing. Please wait a moment and try again.")
        return
        
    credentials = None
    token_file_path = 'token.json'
    
    # Try loading saved tokens
    if os.path.exists(token_file_path):
        try:
            credentials = Credentials.from_authorized_user_file(token_file_path, ['https://www.googleapis.com/auth/gmail.compose'])
            print("[OAuth] Loaded cached authorization tokens from token.json")
        except Exception as token_ex:
            print(f"[OAuth] Could not load cached token: {token_ex}")
            credentials = None
            
    if not credentials or not credentials.valid:
        flow = Flow.from_client_secrets_file(
            CLIENT_SECRET_FILE,
            scopes=['https://www.googleapis.com/auth/gmail.compose'],
            redirect_uri='http://localhost:5000/oauth2callback'
        )
        
        authorization_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
        
        print("\n" + "="*80)
        print("GOOGLE GMAIL AUTHORIZATION REQUIRED")
        print("="*80)
        print("1. Please copy and open the following URL in your web browser:")
        print(f"\n{authorization_url}\n")
        print("2. Approve the permissions in your browser.")
        print("="*80)
        
        # Start the local server to catch the code redirect
        start_local_server()
        
        if not auth_code:
            print("Failed to capture authorization code. Exiting.")
            return
            
        print(f"[OAuth] Exchanging authorization code for API tokens...")
        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        
        # Save tokens for future runs
        try:
            with open(token_file_path, 'w') as token_file:
                token_file.write(credentials.to_json())
            print("[OAuth] Saved authorization tokens to token.json for future use.")
        except Exception as save_token_ex:
            print(f"[OAuth] Failed to save token: {save_token_ex}")
            
    # Build Gmail service
    service = build('gmail', 'v1', credentials=credentials)
    
    # Clean up old drafts with the long subject line to keep drafts folder clean
    print("\nCleaning up previous long drafts to keep your inbox tidy...")
    try:
        old_subject = "Architectural Collaboration & Construction Execution - SKETCH Construction (Raipur)"
        q = f'subject:"{old_subject}"'
        response = service.users().drafts().list(userId='me', q=q).execute()
        drafts_list = response.get('drafts', [])
        if drafts_list:
            print(f"Found {len(drafts_list)} old drafts. Deleting them...")
            for draft in drafts_list:
                service.users().drafts().delete(userId='me', id=draft['id']).execute()
            print("Cleanup completed.")
        else:
            print("No old drafts found to clean up.")
    except Exception as clean_ex:
        print(f"Note: Could not clean up old drafts: {clean_ex}")
        
    print("\nStarting draft creation in your Gmail account...")
    success_count = 0
    
    for idx, firm in enumerate(firms_to_draft):
        name = firm["name"]
        subject = f"Collaboration Inquiry - SKETCH Construction (Raipur)"
        body_text = make_email_body(name)
        
        # Send drafts to all unique emails listed for the firm
        for email in firm["emails"]:
            print(f"[{idx+1}/{len(firms_to_draft)}] Creating draft for {name} ({email})...")
            try:
                # Prepare MIME message
                message = EmailMessage()
                message.set_content(body_text)
                message['To'] = email
                message['Subject'] = subject
                
                # Base64url encode the message
                raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
                draft_body = {
                    'message': {
                        'raw': raw_message
                    }
                }
                
                # Create draft in Gmail
                service.users().drafts().create(userId='me', body=draft_body).execute()
                success_count += 1
            except Exception as ex:
                print(f"  └─ Error creating draft: {ex}")
                
    print(f"\nCompleted! Successfully created {success_count} business proposal drafts in your Gmail account.")
    print("You can log in to your Gmail and check the 'Drafts' folder to review and send them!")

if __name__ == "__main__":
    main()
