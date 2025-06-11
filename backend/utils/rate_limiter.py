from slowapi import Limiter
from slowapi.util import get_remote_address
import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

if os.getenv("LIMITER") == "False":
    limiter = Limiter(key_func=get_remote_address, enabled=False)
else:
    limiter = Limiter(key_func=get_remote_address, enabled=True)