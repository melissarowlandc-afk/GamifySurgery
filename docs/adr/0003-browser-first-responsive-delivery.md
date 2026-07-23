# ADR 0003: Browser-First Responsive Delivery

Status: Proposed; direction approved for inclusion in the architecture proposal only

Date: 2026-07-22

Decision owner: Melissa

Severity: RED

## Context

The game must provide full play on desktop and phone, cross-device saves, simple private distribution, and no initial app-store requirement.

## Proposed decision

- Deliver one responsive browser application.
- Provide full gameplay on desktop and phone rather than a reduced mobile companion.
- Require internet access during the initial pilot.
- Use the same account and campaign saves across devices.
- Do not create separate native applications or app-store releases initially.
- Keep all functionality usable with sound disabled.

## Benefits

- One deployment and update path
- Testers use a link rather than an installer or app store
- Shared code and data model across desktop and phone
- A later installable PWA remains possible

## Risks and limitations

- Browser background tabs cannot reliably run facility simulation.
- Phone layouts require dedicated design and testing.
- Full offline synchronization is not included.
- Browser storage and platform behavior vary.

## Alternatives

1. Godot with web and native exports.
2. Desktop-native first, with a separate mobile application later.

## Cost of changing later

Expensive. Rendering, input, layout, distribution, update mechanisms, and possibly the programming language would change.

## Approval required

This ADR remains Proposed until Melissa explicitly approves the complete architecture package.

