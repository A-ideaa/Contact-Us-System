from pyngrok import ngrok
import os
from dotenv import load_dotenv

load_dotenv()

def start_ngrok():
    # Get the auth token from environment variable or use default
    auth_token = os.getenv('NGROK_AUTH_TOKEN')
    
    # Configure ngrok
    if auth_token:
        ngrok.set_auth_token(auth_token)

    # Create HTTP tunnel
    public_url = ngrok.connect(8000)
    print(f"\n* ngrok tunnel is active *")
    print(f"Public URL: {public_url}")
    print("\nPress Ctrl+C to quit")

if __name__ == '__main__':
    try:
        start_ngrok()
        # Keep the script running
        while True:
            pass
    except KeyboardInterrupt:
        print("\nShutting down ngrok tunnel...")
        ngrok.kill() 