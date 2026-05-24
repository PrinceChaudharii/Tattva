# GitHub Actions Workflow Templates

> **Note:** These workflow files need to be manually added to `.github/workflows/` 
> because the current PAT doesn't have the `workflow` scope.
> 
> To add them, create a PR from the GitHub UI or use a token with `workflow` scope.

## Available Workflows

### CI Pipeline (`ci.yml`)
Copy to `.github/workflows/ci.yml` — Runs lint, typecheck, test, build, and content validation.

### Deploy Pipeline (`deploy.yml`)  
Copy to `.github/workflows/deploy.yml` — Deploys to Vercel on main branch push.
