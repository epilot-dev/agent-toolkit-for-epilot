---
description: Bidirectional data exchange with an external ERP must route to integration guidance rather than an App.
tags: [routing, smoke]
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill]
---

Our ERP needs to receive every new order created in epilot and later push the invoice status back onto that order. We don't want to build an epilot App. How should we wire this?
