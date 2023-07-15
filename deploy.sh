#!/bin/bash
set -e

# This script depends on other scripts that only exist in my private repos.
# If you want to deploy this repo, you'll have to create your own deployment script.

APP_NAME=$(basename "${PWD}")

source "${HOME}/Websites/infrastructure/deploy/config.sh"
source "${HOME}/Websites/infrastructure/deploy/git.sh"
source "${HOME}/Websites/infrastructure/deploy/static.sh"

check_git_branch
check_git_changes
cd example
build_static
deploy_git
deploy_static "/example"
printf "\e[0;32mDone.\n\e[0m"
