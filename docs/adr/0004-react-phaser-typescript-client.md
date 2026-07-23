# ADR 0004: React, Phaser, and TypeScript Client

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The project needs one browser client with full desktop and phone gameplay. It
combines a text-heavy educational interface, accessible clinical questions,
responsive management panels, and a top-down 2D facility. The future
administrator application and deterministic simulation will also need to share
validated data definitions and rules with the player application.

## Decision

- TypeScript is the primary language for the player client and shared game
  rules.
- React owns text, forms, clinical decisions, navigation, accessibility, and
  responsive interface panels.
- Phaser owns the top-down facility canvas, camera, sprites, and direct map
  interaction.
- Pure TypeScript domain modules own authoritative game state and rules
  independently of React and Phaser.
- React and Phaser present domain state; neither animation completion nor
  component state determines clinical, economic, queue, progression, or save
  truth.
- Exact dependency versions will be pinned and tested when implementation is
  authorized.

This decision does not approve repository organization, backend services,
database architecture, authentication implementation, hosting, or deployment.

ADR 0017 later assigns private-pilot facility execution to the active browser
through this pure TypeScript domain boundary. That decision does not give React
or Phaser authority over game truth.

## Benefits

- The text-heavy interface can use normal browser controls and accessibility
  features.
- Phaser supplies purpose-built 2D browser rendering and interaction
  conveniences.
- One language can be shared by the client, deterministic rules, validation,
  simulations, and the future administrator application.
- Renderer-independent rules can be tested without opening a browser and can
  survive a later presentation-layer change.

## Risks and limitations

- The boundary between React, Phaser, and the domain layer requires discipline.
- Dependency and browser updates require ongoing testing.
- Phaser is focused on 2D games and would be limiting for a future
  sophisticated 3D redesign.
- Canvas content is not inherently accessible, so important text and controls
  must remain in React rather than existing only inside Phaser.

## Alternatives considered

1. Godot for the player game plus a separate web administration stack.
2. React and TypeScript with a custom browser canvas and no game framework.

## Cost and maintenance

The selected tools are free and open source. They create no direct recurring
subscription cost. Ongoing maintenance includes dependency updates, browser and
phone testing, and enforcement of the presentation/domain boundary.

## Cost of changing later

Expensive. Changing the client stack after substantial implementation would
rebuild most rendering, input, responsive layout, integration, and build
pipeline work. Properly isolated TypeScript rules and data contracts could be
preserved.
