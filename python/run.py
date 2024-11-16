import subprocess
import sys

# Function to run both scripts concurrently
def run_scripts():
    try:
        # Run app.py in a separate process
        subprocess.Popen([sys.executable, 'app.py'])
        
        # Run webcam.py in a separate process
        subprocess.Popen([sys.executable, 'webcam.py'])
        
        print("Both scripts are now running.")
    except Exception as e:
        print(f"Error running scripts: {e}")

if __name__ == "__main__":
    run_scripts()
