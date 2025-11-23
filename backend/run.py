import os
import sys
from app import app

print(">>> RUNNING Flask WITHOUT RELOADER, WITHOUT DEBUG, WITH FULL TRACEBACK")
print(">>> If any error happens, it WILL print below.\n")

app.run(
    host="0.0.0.0",
    port=int(os.getenv("PORT", 5000)),
    debug=False,
    use_reloader=False,   # IMPORTANT
)
