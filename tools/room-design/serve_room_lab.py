"""Private room-mockup server for phone review over Tailscale.

Serves only the room-design mockups and the game's public art from the
repository, on loopback. START_ROOM_LAB.cmd exposes it to the owner's tailnet
(never the public internet) with `tailscale serve --https=8443`.
"""

import functools
import http.server
import posixpath
import sys
import urllib.parse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PORT = 4192
ALLOWED_PREFIXES = ("/tools/room-design/", "/apps/player/public/")
BLOCKED_PARTS = {"history", "originals", "receipts", "prompts", "node_modules"}


class RoomLabHandler(http.server.SimpleHTTPRequestHandler):
    def _allowed(self) -> bool:
        path = posixpath.normpath(urllib.parse.unquote(urllib.parse.urlsplit(self.path).path))
        if path in ("/", "/tools/room-design"):
            return True
        if ".." in path.split("/") or not path.startswith(ALLOWED_PREFIXES):
            return False
        # Mockup history and raw generation inputs stay on the PC.
        return not any(part in BLOCKED_PARTS for part in path.split("/"))

    def do_GET(self):
        if urllib.parse.urlsplit(self.path).path == "/":
            self.send_response(302)
            self.send_header("Location", "/tools/room-design/")
            self.end_headers()
            return
        if not self._allowed():
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        if not self._allowed():
            self.send_error(404)
            return
        super().do_HEAD()

    def end_headers(self):
        # Mockups change between owner reviews; never serve a stale copy.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main() -> None:
    handler = functools.partial(RoomLabHandler, directory=str(REPO_ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    print(f"Room lab on http://127.0.0.1:{PORT}/tools/room-design/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == "__main__":
    main()
