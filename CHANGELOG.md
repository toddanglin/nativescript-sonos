# Changelog

## 0.5.0 (11 Feb 2019)
- Updated all dependencies to MUCH more recent versions
- Fixed bug in `getZonesWithDescriptions` caused by deprecated Sonos API (/status/topology)
- Refactored project structure
- Fixed a few small bugs in demo project (like introduced by newer versions of {N})
- NOTE: `getTopology` no longer attempts to return media servers (needs to be revisited in future update)

## 0.4.0 (20 Mar 2017)
- Added two methods: `getZoneGroupState`, `getZonesWithDescriptions`
- Added optional parameters to `deviceDescription` (`host?: string, port?: number`)
- Enhanced demo to show more topology detail
- Removed default IP address from demo (now show "No device" on first run)

## 0.3.0 (04 Mar 2017)
- Additional TypeScript definitions for Sonos response types
- More demo app enhancements
- README docs for supported methods

## 0.2.0 (03 Mar 2017)
- Full support for all methods in original NodeJS library
- Enhanced demo app

## 0.1.0 (28 Feb 2017)
- Initial commit
- Basic support for core methods from original NodeJS library
