#!/bin/bash

# Путь к вашему проекту
PROJECT_PATH="/root/email-worker"

# Перейти в директорию проекта
cd $PROJECT_PATH

# Обновить код из репозитория (например, Git)
git pull origin main

# Развернуть воркер
wrangler deploy
