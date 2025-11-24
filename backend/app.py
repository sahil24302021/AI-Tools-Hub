import os
import logging
from logging.handlers import RotatingFileHandler

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

# Load environment variables first
load_dotenv()

# Import all blueprints
from routes import (
    chat_bp,
    vision_bp,
    resume_bp,
    quiz_bp,
    math_bp,
    pdf_tools_bp,
    research_bp,
    notes_bp,
    code_generator_bp,
    image_generator_bp,
    summarizer_bp,
    translator_bp,
    voice_to_text_bp,
    text_to_voice_bp,
    email_writer_bp,
    social_media_writer_bp,
    blog_writer_bp,
    seo_optimizer_bp,
    usage_bp,
    billing_bp,
)


def create_app() -> Flask:
    app = Flask(__name__)

    # Config values
    app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL", "http://localhost:5173")
    app.config["LOG_LEVEL"] = os.getenv("LOG_LEVEL", "INFO").upper()
    app.config["PORT"] = int(os.getenv("PORT", "5000"))
    app.config["FLASK_DEBUG"] = int(os.getenv("FLASK_DEBUG", "1"))

    # ========== LOGGING ==========
    log_level = getattr(logging, app.config["LOG_LEVEL"], logging.INFO)
    app.logger.setLevel(log_level)

    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s"
    )

    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    app.logger.addHandler(console_handler)

    log_file = os.getenv("LOG_FILE", "backend.log")
    file_handler = RotatingFileHandler(log_file, maxBytes=5_000_000, backupCount=3)
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)

    # ========== CORS ==========
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://lambent-bavarois-95216a.netlify.app"
    ]
    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    # ========== JSON Response Helpers ==========
    def success(result: dict, status: int = 200):
        # Enforce exact success envelope
        return jsonify({"ok": True, "result": result, "error": None}), status

    def fail(code: str, message: str, status: int = 500):
        # Standardized failure envelope
        return jsonify({"ok": False, "result": None, "error": {"code": code, "message": message}}), status

    app.success = success  # type: ignore
    app.fail = fail        # type: ignore

    # ========== Health Check ==========
    @app.route("/health", methods=["GET"])
    def health():
        return success({"status": "ok"})

    # ========== Blueprint Registration ==========
    app.register_blueprint(chat_bp,                url_prefix="/api/chat")
    app.register_blueprint(vision_bp,              url_prefix="/api/vision")
    app.register_blueprint(resume_bp,              url_prefix="/api/resume")
    app.register_blueprint(quiz_bp,                url_prefix="/api/quiz")
    app.register_blueprint(math_bp,                url_prefix="/api/math")
    app.register_blueprint(pdf_tools_bp,           url_prefix="/api/pdf-tools")
    app.register_blueprint(research_bp,            url_prefix="/api/research")
    app.register_blueprint(notes_bp,               url_prefix="/api/notes")
    app.register_blueprint(code_generator_bp,      url_prefix="/api/code-generator")
    app.register_blueprint(image_generator_bp,     url_prefix="/api/image-generator")
    app.register_blueprint(summarizer_bp,          url_prefix="/api/summarizer")
    app.register_blueprint(translator_bp,          url_prefix="/api/translator")
    app.register_blueprint(voice_to_text_bp,       url_prefix="/api/voice-to-text")
    app.register_blueprint(text_to_voice_bp,       url_prefix="/api/text-to-voice")
    app.register_blueprint(email_writer_bp,        url_prefix="/api/email-writer")
    app.register_blueprint(social_media_writer_bp, url_prefix="/api/social-media-writer")
    app.register_blueprint(blog_writer_bp,         url_prefix="/api/blog-writer")
    app.register_blueprint(seo_optimizer_bp,       url_prefix="/api/seo-optimizer")
    app.register_blueprint(usage_bp,               url_prefix="/api/usage")
    app.register_blueprint(billing_bp,             url_prefix="/api/billing")

    app.logger.info("Backend started successfully")
    return app


app = create_app()

if __name__ == "__main__":
    port = app.config.get("PORT", 5000)
    debug = bool(app.config.get("FLASK_DEBUG", 1))
    app.run(host="0.0.0.0", port=port, debug=debug)
