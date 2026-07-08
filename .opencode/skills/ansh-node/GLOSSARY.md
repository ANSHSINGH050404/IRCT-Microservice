# Glossary

## A

### AppError
Custom error class hierarchy used across all services. Base class carries `message`, `statusCode`, and `code`. Subclasses: `BadRequestError` (400), `UnauthorizedError` (401), `NotFoundError` (404), `ForbiddenError` (403).

## B

### Branch
A distinct path through a skill's logic — different runs taking different routes. Branching is the cleanest disclosure test: inline what every branch needs, push behind a pointer what only some branches reach.

## C

### Co-location
Keeping a concept's definition, rules, and caveats under one heading rather than scattered, so reading one part brings its neighbours with it.

### Cognitive load
The burden on the user to remember which user-invoked skills exist and when to fire them. Cured by a router skill.

### Collapse
Refactoring multiple restatements of one idea into a single leading word.

### Completion criterion
The condition that tells the agent a step is genuinely done. Must be _checkable_ (can the agent tell done from not-done?) and, where it matters, _exhaustive_.

### Context load
The fixed per-turn token cost of a model-invoked skill's description sitting in the agent's system prompt.

### Context pointer
The wording in a skill that links to external reference. Its _wording_, not its target, decides when and how reliably the agent reaches the material.

## D

### Duplication
The same meaning in more than one place. Costs maintenance and tokens, and inflates a meaning's prominence past its real rank.

## E

### External reference
Reference that lives outside the skill system entirely, that any skill can point at.

## G

### Granularity
How finely you divide skills. Each cut spends one of the two loads (context or cognitive), so split only when the cut earns it.

## I

### Information hierarchy
A ladder ranked by how immediately the agent needs material: in-skill step > in-skill reference > external reference.

### In-skill reference
A definition, rule, or fact in `SKILL.md`, consulted on demand rather than executed in order.

### In-skill step
An ordered action in `SKILL.md`. The primary tier — what the agent does, in order.

## L

### Leading word
A compact concept already in the model's pretraining that the agent thinks with while running the skill (e.g. _lesson_, _fog of war_, _tracer bullets_). Anchors execution and invocation with fewer tokens.

### Legwork
The digging the agent does within the work, whether the skill has steps or not.

## M

### Model-invoked skill
A skill the agent can fire autonomously because its description sits in the system prompt. Pays context load.

## N

### No-op
A line that doesn't change behaviour versus the default. The test: does the agent already obey this by default?

## P

### Post-completion steps
Steps still ahead of the current step. When visible, they tempt the agent to rush what's in front of it (premature completion).

### Predictability
The agent taking the same _process_ every run, not producing the same output.

### Premature completion
Ending a step before it's genuinely done, attention slipping to _being done_.

### Progressive disclosure
The move down the information hierarchy — out of `SKILL.md` into a linked file — so the top stays legible.

## R

### Relevance
Does a line still bear on what the skill does? The first pruning gate.

### Router skill
One user-invoked skill that names the others and when to reach for each. Cures piled-up cognitive load.

## S

### Sediment
Stale layers that settle because adding feels safe and removing feels risky. The default fate of any skill without a pruning discipline.

### Single source of truth
One authoritative place for each meaning, so changing the behaviour is a one-place edit.

### Sprawl
A skill too long even when every line is live and unique. Cured by the ladder: disclose reference behind pointers, split by branch or sequence.

## U

### User-invoked skill
A skill with `disable-model-invocation: true`. Strips the description from the agent's reach — zero context load, but you must remember it exists.
