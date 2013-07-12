Chrome-Salesforce-inspector
===========================
Chrome extension to add a metadata layout on top of the standard Salesforce UI to improve the productivity and joy of Salesforce configuration, development, and integration.

Currently experimental and very raw and limited feature set. Created as an excuse to get to play with chrome extensions and Salesforce REST API.


Usage
-----
...


Installation
------------
...


Task list
---------
*Known issues*
- [x] Fields with help text are not supported. To fix, label must be properly extracted in getLabelFromLabelElement()

*Improvements*
- [ ] Activate by keyboard shortcut (http://developer.chrome.com/extensions/commands.html)

Notes
-----
- It's not possible to generate field or object level metadata edit links as edit urls require the Salesforce id of field or object. These ids are not exposed via the API. (https://success.salesforce.com/ideaView?id=08730000000gM7mAAE and https://success.salesforce.com/ideaView?id=087300000007quP). Though tooling API is almost there.

About
-----
By Søren Krabbe (sk@sokr.dk)
Currently experimental and very raw and limited feature set. Created as an excuse to get to play with chrome extensions and Salesforce REST API.