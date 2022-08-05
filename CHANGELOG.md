#### 1.0.4 (2022-08-05)

##### Bug Fixes

*  add types field to package.json (42ccce56)

#### 1.0.3 (2022-07-25)

##### Chores

*  add production environment for publish task (94309b78)

##### Documentation Changes

*  replace fingerptintjs.com domain in links to fingerprint.com (bd14519d)
*  update logo (0f06f85e)

##### Bug Fixes

*  readme (71b47abe)

#### 1.0.2 (2022-05-13)

##### Documentation Changes

*  second attempt to fix logo for npmjs.com (4daf6fb3)

#### 1.0.1 (2022-05-13)

##### Documentation Changes

*  fix fingerprint logo for npmjs.com (c59e820a)

## 1.0.0 (2022-05-12)

##### Breaking changes
* Added react hooks approach, read [the documentation](README.md#hooks-approach) for more details
* Due to creating hooks approach, API of client has changed, read more in [the documentation](README.md#api-client-approach)

##### Chores

*  add changelog generation and release commands (77967653)
*  add publish action (e8332a73)
*  fix npm package files section (63fb5641)
*  change iOS codeowner (77f8f3d5)
*  add iOS and Android folder to sync script (8f2ab4c1)
*  update build environment (d73ad61b)
*  add linter, run prettier (bcf9bbcf)
*  change author in podspec to FingerprintJS Inc (ec63bfcd)
*  add github action for tests and typecheck (051ebb40)
*  add CODEOWNERS (25a610ab)
*  fix typecheck (abd940a6)
*  use rollup build (0c1d7476)
*  fixed iOS build (2f2a7694)
*  make agent compatible with mocks (285a7351)
* **deps:**
  *  bump vulnerable simple-plist from 1.3.0 to 1.3.1 (f35317a8)
  *  bump ansi-regex from 4.1.0 to 4.1.1 (584b8a60)
  *  bump minimist from 1.2.5 to 1.2.6 (bd02e14f)
  *  bump plist from 3.0.4 to 3.0.5 (b35d3b90)
  *  bump plist from 3.0.4 to 3.0.5 in /TestProject (a9e6b776)
  *  bump async from 2.6.3 to 2.6.4 (7caf632b)
  *  bump minimist from 1.2.5 to 1.2.6 in /TestProject (2abc2347)
  *  bump async from 2.6.3 to 2.6.4 in /TestProject (97212225)
  *  bump ansi-regex from 4.1.0 to 4.1.1 in /TestProject (a465ae5a)

##### Documentation Changes

*  add jsdoc to code, fix readme example (4a9e9490)
*  add iOS contributing instruction (03c7da7b)
*  add contributing.md (1afb9460)
*  add new badges, fix existing (2e89589b)
*  improve usage snippet (1f3b411e)

##### New Features

*  support ap region (dcf7fd23)
*  add dotenv support to TestApp, use public API key from env. (470701b7)
*  add hooks approach #10, fix dev build (1a8976d1)
*  add tags property to getVisitorData function (a78772f0)

##### Bug Fixes

*  fix endpoint param in iOS #14 (82dc9629)

##### Tests

*  add tests for provider and useVisitorData hook (fee4d8af)

