import sys
import os
import uvicorn

if __name__ == "__main__":
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, backend_dir)
    print(f"Starting uvicorn on 127.0.0.1:8000 from {backend_dir}...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, log_level="info")

