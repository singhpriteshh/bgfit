import socket
import time
import sys
import os


def wait_for_db():
    host = "db"
    port = 5432
    max_retries = 30

    print(f"Waiting for database at {host}:{port}...")

    try:
        with open("/etc/resolv.conf", "r") as f:
            print(f"DNS configuration (/etc/resolv.conf):\n{f.read()}")
    except Exception as e:
        print(f"Could not read /etc/resolv.conf: {e}")

    for i in range(max_retries):
        try:
            # Try to resolve first
            ip = socket.gethostbyname(host)
            print(f"Attempt {i+1}: Resolved {host} to {ip}")

            # Try to connect
            with socket.create_connection((host, port), timeout=3) as s:
                print("Connection successful!")
                return True

        except socket.gaierror as e:
            print(f"Attempt {i+1}: DNS resolution failed for {host}: {e}")
        except ConnectionRefusedError:
            print(f"Attempt {i+1}: Connection refused (DB might be starting up)")
        except Exception as e:
            print(f"Attempt {i+1}: Unexpected error: {e}")

        time.sleep(2)

    print("Could not connect to database after many retries.")
    return False


if __name__ == "__main__":
    if not wait_for_db():
        sys.exit(1)
