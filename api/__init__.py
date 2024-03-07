from flask import Flask
from flask_cors import CORS
import os

from api.config import config
from api.views import main

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')

    CORS(app) #Allow CORS for all domains on all routes

    # Get the FLASK_ENV value - if not set default to development
    env = os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config[env])

    # Register blueprints
    app.register_blueprint(main)

    return app