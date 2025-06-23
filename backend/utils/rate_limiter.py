from slowapi import Limiter
from slowapi.util import get_remote_address
import os

if os.getenv("LIMITER") == "False":
    limiter = Limiter(key_func=get_remote_address, enabled=False)
else:
    limiter = Limiter(key_func=get_remote_address, enabled=True)