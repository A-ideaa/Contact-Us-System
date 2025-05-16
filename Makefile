.PHONY: run-backend run-frontend build-frontend collect-static help

help:
	@echo "Available commands:"
	@echo "  make run-backend     - Run Django backend server"
	@echo "  make run-frontend    - Run React frontend development server"
	@echo "  make build-frontend  - Build React frontend for production"
	@echo "  make collect-static  - Collect static files from frontend build to Django"
	@echo "  make help            - Show this help message"

run-backend:
	python manage.py runserver

run-frontend:
	cd frontend && npm start

build-frontend:
	cd frontend && npm run build

collect-static: build-frontend
	python manage.py collectstatic --noinput 