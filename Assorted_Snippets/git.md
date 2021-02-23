# Git Snippets

Useful Git snippets

- [Git Snippets](#git-snippets)
    - [Sync Upstream Main Branch](#sync-upstream-main-branch)
    - [Sync Fork with Upstream](#sync-fork-with-upstream)
    - [Rename Master Branch to Main](#rename-master-branch-to-main)

## Sync Upstream Main Branch

How to sync a branch (with `main`)

```sh
git fetch --all
git merge main --ff
```

Conversely for merging into the main branch locally, do:

```sh
git checkout main
git merge <branch_name>
git push origin main
```

## Sync Fork with Upstream

[Github Guide](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)

```sh
git fetch upstream
git checkout main
git merge upstream/main
```

## Rename Master Branch to Main

Set default branch name to `main` globally

```sh
git config --global init.defaultBranch main
```

[easily-rename-your-git-default-branch-from-master-to-main](https://www.hanselman.com/blog/easily-rename-your-git-default-branch-from-master-to-main) and [how-to-rename-your-master-branch-to-main-in-git](https://www.kapwing.com/blog/how-to-rename-your-master-branch-to-main-in-git/)

```sh
git checkout master
git branch -m master main
git push -u origin main

git status
# git branch -D master
```
