#!/bin/bash

# Update repositories script
# Usage: ./update-repos.sh [repo1 repo2 ...] or ./update-repos.sh (updates all)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Available repos
ALL_REPOS=("wordpress-develop" "gutenberg" "calypso")

# If no args, update all repos
if [ $# -eq 0 ]; then
    REPOS=("${ALL_REPOS[@]}")
else
    REPOS=("$@")
fi

echo "Updating repositories..."
echo ""

for repo in "${REPOS[@]}"; do
    repo_path="$SCRIPT_DIR/$repo"

    if [ ! -d "$repo_path" ]; then
        echo "[$repo] Not found at $repo_path - skipping"
        echo ""
        continue
    fi

    if [ ! -d "$repo_path/.git" ]; then
        echo "[$repo] Not a git repository - skipping"
        echo ""
        continue
    fi

    echo "[$repo] Updating..."
    cd "$repo_path"

    # Show current branch
    branch=$(git branch --show-current)
    echo "  Branch: $branch"

    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "  Warning: Uncommitted changes detected"
    fi

    # Pull latest
    output=$(git pull 2>&1)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        if echo "$output" | grep -q "Already up to date"; then
            echo "  Already up to date"
        else
            echo "  Updated successfully"
            echo "$output" | sed 's/^/  /'
        fi
    else
        echo "  Failed to update:"
        echo "$output" | sed 's/^/  /'
        echo ""
        echo "  To undo a conflicted pull: git merge --abort"
    fi

    echo ""
done

echo "Done."
