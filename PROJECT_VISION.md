# Pre-Entrance Theme Platform — Project Vision

## Project Vision

This is not a redesign of the previous app.

It is the beginning of a new application that inherits the successful ideas from the previous prototype while abandoning the architectural decisions that proved unnecessarily complicated.

The goal is not to make another English-learning app.

The goal is to build an engaging pre-entrance education platform that prepares incoming Hokusei students academically, linguistically, and personally before they enter university.

**English is the medium—not the destination.**

---

## Why We Are Restarting

The previous prototype successfully proved that the core technology works.

It demonstrated:

- Task rendering
- Portfolio saving
- Vocabulary shooter
- Reusable activity components
- localStorage architecture
- Reusable UI

However, the curriculum architecture became increasingly complicated.

The previous model was:

Register
↓
Diagnosis
↓
System assigns level
↓
Weekly assignments
↓
Activities

Over time this produced unnecessary complexity:

- Diagnosis system
- Weekly assignment generation
- Week-based routing
- Complicated progress tracking
- Difficult content expansion

We have decided to abandon this model.

---

## Educational Philosophy

The curriculum is organized around **themes** rather than **weeks**.

Every student studies the same themes.

Students choose the language difficulty for each theme independently.

Example:

Knowing Myself → Foundation

Living Together → Standard

Building My Future → Challenge

History → Foundation

There is no permanent student level.

There is no placement test.

Students are free to challenge themselves differently depending on the topic.

---

## Core Curriculum Structure

Theme
↓
Choose Level
↓
Vocabulary
Grammar
Reading
Writing
Speaking
Translation
Portfolio

Every level explores the same idea.

Only the English becomes more sophisticated.

---

## Initial Themes

- Knowing Myself
- Living Together
- Building My Future
- Caring for Our Planet
- Learning from History

Future themes may include:

- Society
- Technology
- Global Perspectives
- University Life
- Learning and Growth
- Communication

The architecture must allow new themes without redesign.

---

## Vocabulary Philosophy

Vocabulary is **theme-based**, not week-based.

Words are introduced gradually through a spiral curriculum.

Example:

Foundation:
- challenge

Standard:
- challenge
- motivation

Challenge:
- challenge
- motivation
- resilience

Students repeatedly encounter important vocabulary in richer contexts.

---

## Theme Philosophy

Themes are human topics, not grammar topics.

Good themes:

- Identity
- Relationships
- Future
- Environment
- Society
- History

Poor themes:

- Sentence structure
- Grammar categories
- Language functions
- Academic terminology

The platform should feel like a liberal arts introduction conducted through English.

---

## Level Philosophy

Three levels:

- Foundation
- Standard
- Challenge

These are **difficulty choices**, not **ability labels**.

Students may choose different levels for different themes.

---

## Architecture Philosophy

Prefer:

- Simple
- Modular
- Expandable
- Theme-based

Avoid:

- Special cases
- Diagnosis logic
- Week-dependent code
- Hard-coded learning paths

---

## Existing System

Treat the previous prototype as a component library.

Reuse when appropriate:

- AppShell
- Portfolio
- Vocabulary Shooter
- Vocabulary Dictionary
- Grammar activity renderer
- Reading activity renderer
- Writing activity renderer
- Speaking activity renderer
- Translation activity renderer
- Reusable UI components
- localStorage helper patterns

Do not reuse:

- Diagnosis
- Weekly Assignment
- Dashboard
- Week-based routing
- Placement logic

---

## Development Strategy

Develop in small, stable phases.

Every phase must end with:

npm run build

passing successfully.

Never rewrite the entire application at once.

Always leave the application in a working state.

---

## Phase 1 Goal

Build only the architecture:

- Theme registry
- Theme data types
- Theme browser
- Theme detail page
- Level picker
- Activity list
- Activity placeholders
- Portfolio placeholder
- Navigation

Do **not** implement:

- AI
- Database
- Diagnosis
- Weekly assignments

---

## Long-Term Vision

Students explore meaningful themes while choosing the level of English challenge that best fits each topic.

The software should disappear into the background.

The curriculum and the student's learning journey should become the focus.