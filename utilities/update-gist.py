"""
Script to update the latest version gist used for automatic updates.
This could probably be done with GitHub Actions, but python is easier.
"""

import os
import json
from datetime import datetime
from urllib.request import urlopen
from github import Github


def download(url: str) -> str:
    with urlopen(url) as response:
        return response.read().decode()


g = Github(os.getenv("access_token"))

release = g.get_repo("miscar/Sand").get_latest_release()
assets = release.get_assets()

version = release.title.split(" ")[-1]
version_without_v = version[1:]

result = {
    "version": version,
    "notes": release.body,
    "pub_date": datetime.now().isoformat().split(".")[0] + "Z",
    "platforms": {
        "darwin-x86_64": {
            "url": f"https://github.com/MisCar/Sand/releases/download/sand-{version}/Sand.app.tar.gz",
        },
        "linux-x86_64": {
            "url": f"https://github.com/MisCar/Sand/releases/download/sand-{version}/sand_{version_without_v}_amd64.AppImage.tar.gz",
        },
        "windows-x86_64": {
            "url": f"https://github.com/MisCar/Sand/releases/download/sand-{version}/Sand_{version_without_v}_x64_en-US.msi.zip",
        },
    },
}

for asset in assets:
    if asset.name == "Sand.app.tar.gz.sig":
        result["platforms"]["darwin-x86_64"]["signature"] = download(
            asset.browser_download_url
        )
    elif asset.name.endswith("_amd64.AppImage.tar.gz.sig"):
        result["platforms"]["linux-x86_64"]["signature"] = download(
            asset.browser_download_url
        )
    elif asset.name.endswith("_x64_en-US.msi.zip.sig"):
        result["platforms"]["windows-x86_64"]["signature"] = download(
            asset.browser_download_url
        )

print(json.dumps(result, indent=2))
