import uvicorn
import logging
from pathlib import Path
from app.main import app
from app.db.init_db import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        # Ensure the app directory exists
        app_dir = Path(__file__).parent / 'app'
        if not app_dir.exists():
            raise Exception(f"App directory not found at {app_dir}")

        # Initialize the database
        logger.info("Initializing database...")
        init_db()
        
        # Run the application
        logger.info("Starting the FastAPI application...")
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            workers=1,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Error starting the application: {str(e)}")
        raise

if __name__ == "__main__":
    main() 