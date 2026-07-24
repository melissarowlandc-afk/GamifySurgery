# ADR 0003: Browser-First Responsive Delivery

Status: Superseded and completed by ADR 0004 and ADR 0022

Date: 2026-07-22

Decision owner: Melissa

Severity: RED

## Context

The game must provide full play on desktop and phone, cross-device saves, simple private distribution, and no initial app-store requirement.

## Historical proposed decision

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

## Resolution

The responsive browser client was accepted through
[ADR 0004](0004-react-phaser-typescript-client.md), whose accepted context is
one browser client with full desktop and phone gameplay. The staged
local-to-private-browser delivery path was later accepted through
[ADR 0022](0022-staged-local-to-private-pilot-delivery.md) under the delegated
technical authority in ADR 0021.

This record remains as the historical proposal. It is no longer an open
approval gate, and neither later ADR authorizes public deployment, app-store
distribution, paid infrastructure, or outside tester invitations.
