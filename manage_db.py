#!/usr/bin/env python
import os
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

def backup_database():
    """Create a backup of the database file."""
    db_file = Path('db.sqlite3')
    if not db_file.exists():
        print("No database file found to backup!")
        return
    
    backup_dir = Path('database_backups')
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = backup_dir / f'db_backup_{timestamp}.sqlite3'
    
    shutil.copy2(db_file, backup_file)
    print(f"Database backed up to: {backup_file}")

def restore_database(backup_file):
    """Restore database from a backup file."""
    if not Path(backup_file).exists():
        print(f"Backup file {backup_file} not found!")
        return
    
    db_file = Path('db.sqlite3')
    if db_file.exists():
        backup_database()  # Create backup before overwriting
        db_file.unlink()
    
    shutil.copy2(backup_file, db_file)
    print(f"Database restored from: {backup_file}")

def migrate_database():
    """Run database migrations."""
    try:
        subprocess.run(['python', 'manage.py', 'migrate'], check=True)
        print("Database migrations completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")

def show_instructions():
    """Display instructions for database management."""
    print("\nDatabase Management Instructions:")
    print("1. To backup the database:")
    print("   python manage_db.py backup")
    print("\n2. To restore from a backup:")
    print("   python manage_db.py restore <backup_file>")
    print("\n3. To run migrations:")
    print("   python manage_db.py migrate")
    print("\n4. To show these instructions:")
    print("   python manage_db.py help")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        show_instructions()
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'backup':
        backup_database()
    elif command == 'restore':
        if len(sys.argv) < 3:
            print("Please provide the backup file path")
            sys.exit(1)
        restore_database(sys.argv[2])
    elif command == 'migrate':
        migrate_database()
    elif command == 'help':
        show_instructions()
    else:
        print(f"Unknown command: {command}")
        show_instructions()
        sys.exit(1) 