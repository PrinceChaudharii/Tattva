---
name: Pull Request
about: Submit changes to the Tattva project
title: "[scope]: brief description"
---

## Summary

<!-- A concise description of what this PR does and why. Link relevant issues. -->

Closes #<!-- issue number -->

## Type of Change

<!-- Mark all that apply with an [x] -->

- [ ] 🐛 Bug fix — Fixes an issue
- [ ] ✨ New feature — Adds functionality
- [ ] 💥 Breaking change — Requires migration or config changes
- [ ] 📚 Content — Adds or updates educational content
- [ ] 🎨 UI/UX — Visual or interaction changes
- [ ] ♻️ Refactor — Code cleanup, no functional change
- [ ] ⚡ Performance — Improves speed or efficiency
- [ ] 🔒 Security — Fixes a vulnerability
- [ ] 🧪 Tests — Adds or improves test coverage
- [ ] 🛠️ Tooling — CI, build, or developer experience
- [ ] 📝 Documentation — README, docs, or comments

## Changes

<!-- List the key changes made in this PR -->

-
-
-

## Testing

<!-- How did you verify your changes? -->

- [ ] Unit tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Content validation passes (`pnpm content:validate`) — if content changed
- [ ] Manually tested in development (`pnpm dev`)
- [ ] Tested on mobile viewport

### Test Details

<!-- Describe any manual testing steps, edge cases checked, or screenshots -->

## Screenshots / Recordings

<!-- If this PR includes UI changes, add before/after screenshots or recordings -->

| Before | After |
| ------ | ----- |
|        |       |

## Content Accuracy (if applicable)

<!-- For content-related PRs, verify accuracy -->

- [ ] Content is aligned with the latest NCERT syllabus
- [ ] NCERT textbook reference is included in frontmatter
- [ ] Subject matter has been verified by an educator

## Database Changes (if applicable)

- [ ] No database changes
- [ ] Migration file included (`pnpm db:generate`)
- [ ] Migration has been tested (up and down)
- [ ] Seed data updated if needed

## Checklist

<!-- Complete all items before requesting review -->

- [ ] My code follows the project's style guidelines (`pnpm lint`, `pnpm format:check`)
- [ ] I have performed a self-review of my code
- [ ] I have commented my code in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new TypeScript errors
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published
- [ ] I have checked my code for security vulnerabilities
- [ ] I have updated the CHANGELOG (if applicable)

## Additional Notes

<!-- Anything else reviewers should know? Potential risks? Follow-up work needed? -->
