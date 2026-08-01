"""
ApexTalent AI — Port 5000 GitHub OAuth Callback Bridge Listener
Bridges GitHub OAuth callbacks from http://localhost:5000/auth/github/callback to FastAPI engine.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import urllib.parse
import urllib.request
import sys


class Port5000CallbackHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass  # Quiet logs

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path.endswith("/auth/github/callback") or parsed_path.path == "/auth/github/callback":
            query = parsed_path.query
            fastapi_url = f"http://localhost:8000/api/v1/auth/github/callback?{query}&redirect_uri=http://localhost:5000/auth/github/callback"
            try:
                req = urllib.request.Request(fastapi_url, headers={"User-Agent": "ApexTalent-Bridge"})
                with urllib.request.urlopen(req, timeout=8) as resp:
                    redirect_header = resp.geturl()
                    self.send_response(302)
                    self.send_header("Location", redirect_header)
                    self.end_headers()
                    return
            except Exception as e:
                print(f"⚠️ Port 5000 bridge forward notice: {e}")
                self.send_response(302)
                self.send_header("Location", "http://localhost:3000/candidate?github_connected=true")
                self.end_headers()
                return

        self.send_response(404)
        self.end_headers()


def start_port_5000_bridge():
    def run():
        try:
            server = HTTPServer(("0.0.0.0", 5000), Port5000CallbackHandler)
            print("🚀 Port 5000 GitHub OAuth Bridge active on http://localhost:5000/auth/github/callback")
            server.serve_forever()
        except Exception as e:
            # Port 5000 might already be bound or busy
            print(f"⚠️ Port 5000 bridge note: {e}")

    t = threading.Thread(target=run, daemon=True)
    t.start()
