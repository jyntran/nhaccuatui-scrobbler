# Privacy Policy

## What information is collected?

The *NhacCuaTui Scrobbler* extension uses the [Last.fm API](https://www.last.fm/api/) to obtain an authenticated session, the result being a unique token. Through this session, the account's username is also obtained.

The extension runs content scripts only on pages from [nhaccuatui.com](https://www.nhaccuatui.com/), and searches for the currently playing track name and artist name.

## How is the information used?

The token allows the extension access to scrobble tracks to the user's Last.fm account. The username is used in the extension's popup window to display the currently authenticated account. The track information collected from NhacCuaTui is used to create a scrobble and sent to Last.fm.

## What information is shared?

None of the user's information is shared nor tracked. The token and username are stored in the Chrome browser's local storage, and only retrieved when the extension communicates with the Last.fm API.