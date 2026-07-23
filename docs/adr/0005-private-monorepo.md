# ADR 0005: Private Monorepo

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The project will contain a player application, a private administrator
application, deterministic game rules, clinical and balance data contracts,
publishing validators, database migrations, automated tests, simulations, and
documentation. These parts must change together safely without turning into one
undivided or jointly deployed application.

## Decision

- Keep project source and documentation in one owner-controlled private GitHub
  repository.
- Organize the repository as a monorepo with separately built applications and
  strongly bounded shared packages or workspaces.
- Keep the player and administrator applications as separate builds and
  deployments with separate access controls.
- Permit applications to depend on approved shared rules, contracts, and
  validators through explicit package boundaries.
- Prevent the player build from importing administrator-only code, mutable
  drafts, publishing privileges, or secrets.
- Keep database migrations, tests, simulations, and architecture records in the
  same version history as the compatible application changes.
- Select the exact workspace and build-orchestration tools only when
  implementation is authorized.

## Benefits

- One change can update compatible applications, contracts, tests, and
  migrations together.
- Melissa and her husband have one source history and backup location to
  understand.
- Shared definitions do not need to be published and coordinated through
  several repositories.
- Applications can still be tested, secured, and deployed independently.

## Risks and limitations

- Dependency rules and automated checks are needed to preserve boundaries.
- A growing repository needs focused tests and builds to avoid unnecessary
  work.
- A collaborator with repository read access can see the complete source
  collection, so this structure does not provide folder-level source
  confidentiality.
- Repository convenience must not be mistaken for permission to combine player
  and administrator deployments.

## Alternatives considered

1. Independent repositories for player, administrator, backend, and shared
   definitions.
2. One undivided application without internal package boundaries.

## Cost and maintenance

The repository structure has no direct recurring cost. Maintenance is low to
moderate and includes workspace configuration, dependency-boundary tests,
focused build automation, and repository access management.

## Cost of changing later

Expensive. Splitting or merging repositories later would preserve much source
code but require changes to import paths, shared-package versioning, build and
test automation, deployment workflows, permissions, and source history.
