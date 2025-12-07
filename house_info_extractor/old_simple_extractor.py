#!/usr/bin/env python3
"""
Flask API for PDF House Information Extractor
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from simple_extractor import PDFHouseExtractor
from datetime import datetime
import os
import json
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULTS_FOLDER'] = 'results'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULTS_FOLDER'], exist_ok=True)

# Initialize extractor
extractor = PDFHouseExtractor(upload_folder=app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    """API home page"""
    return jsonify({
        "name": "PDF House Information Extractor API",
        "version": "1.0.0",
        "endpoints": {
            "/api/health": "GET - Check API health",
            "/api/extract": "POST - Extract house info from PDF",
            "/api/extract/url": "POST - Extract from PDF URL",
            "/api/results/<id>": "GET - Get extraction result by ID",
            "/api/results": "GET - List all extraction results"
        },
        "documentation": "See /api/docs for detailed API documentation"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "pdf-house-extractor"
    })

@app.route('/api/extract', methods=['POST'])
def extract_from_pdf():
    """
    Extract house information from uploaded PDF file
    
    Expected request:
    - Method: POST
    - Content-Type: multipart/form-data
    - Body: PDF file in 'file' field
    
    Returns:
    - JSON with extracted information or error message
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided",
                "message": "Please upload a PDF file"
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected",
                "message": "Please select a PDF file"
            }), 400
        
        # Process the file
        result = extractor.process_uploaded_file(file)
        
        # Generate result ID
        result_id = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save result to file
        if result["success"]:
            result["id"] = result_id
            result["timestamp"] = datetime.now().isoformat()
            
            # Save to results folder
            result_file = os.path.join(
                app.config['RESULTS_FOLDER'], 
                f"result_{result_id}.json"
            )
            with open(result_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
        
        # Return response
        response_status = 200 if result["success"] else 400
        return jsonify(result), response_status
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Internal server error"
        }), 500

@app.route('/api/extract/url', methods=['POST'])
def extract_from_url():
    """
    Extract house information from PDF URL
    
    Expected request:
    - Method: POST
    - Content-Type: application/json
    - Body: {"url": "https://example.com/document.pdf"}
    
    Returns:
    - JSON with extracted information
    """
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                "success": False,
                "error": "No URL provided",
                "message": "Please provide a PDF URL in the request body"
            }), 400
        
        # For now, return not implemented
        # In production, you would download the PDF from URL first
        return jsonify({
            "success": False,
            "error": "Not implemented",
            "message": "URL extraction is not implemented yet. Please upload a file directly."
        }), 501
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Internal server error"
        }), 500

@app.route('/api/results/<result_id>', methods=['GET'])
def get_result(result_id):
    """Get extraction result by ID"""
    try:
        result_file = os.path.join(
            app.config['RESULTS_FOLDER'], 
            f"result_{result_id}.json"
        )
        
        if not os.path.exists(result_file):
            return jsonify({
                "success": False,
                "error": "Result not found",
                "message": f"No result found with ID: {result_id}"
            }), 404
        
        with open(result_file, 'r', encoding='utf-8') as f:
            result_data = json.load(f)
        
        return jsonify(result_data), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error retrieving result"
        }), 500

@app.route('/api/results', methods=['GET'])
def list_results():
    """List all extraction results"""
    try:
        results = []
        results_dir = app.config['RESULTS_FOLDER']
        
        for filename in os.listdir(results_dir):
            if filename.startswith('result_') and filename.endswith('.json'):
                filepath = os.path.join(results_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    result_data = json.load(f)
                
                # Extract summary
                summary = {
                    "id": result_data.get("id", filename.replace('result_', '').replace('.json', '')),
                    "timestamp": result_data.get("timestamp"),
                    "success": result_data.get("success", False),
                    "confidence": result_data.get("data", {}).get("confidence", 0),
                    "filename": result_data.get("metadata", {}).get("original_filename", "unknown")
                }
                results.append(summary)
        
        # Sort by timestamp (newest first)
        results.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return jsonify({
            "success": True,
            "count": len(results),
            "results": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error listing results"
        }), 500

@app.route('/api/docs', methods=['GET'])
def api_documentation():
    """API documentation endpoint"""
    docs = {
        "api_name": "PDF House Information Extractor API",
        "version": "1.0.0",
        "description": "API for extracting house information from PDF documents",
        "endpoints": [
            {
                "endpoint": "/api/health",
                "method": "GET",
                "description": "Check API health status",
                "response": {
                    "status": "string",
                    "timestamp": "datetime",
                    "service": "string"
                }
            },
            {
                "endpoint": "/api/extract",
                "method": "POST",
                "description": "Extract house information from uploaded PDF",
                "request": {
                    "type": "multipart/form-data",
                    "parameters": {
                        "file": "PDF file to process"
                    }
                },
                "response": {
                    "success": "boolean",
                    "data": "object with extracted house information",
                    "metadata": "object with processing metadata"
                }
            },
            {
                "endpoint": "/api/results",
                "method": "GET",
                "description": "List all extraction results",
                "response": {
                    "success": "boolean",
                    "count": "integer",
                    "results": "array of result summaries"
                }
            },
            {
                "endpoint": "/api/results/<id>",
                "method": "GET",
                "description": "Get specific extraction result by ID",
                "parameters": {
                    "id": "Result ID from extraction response"
                }
            }
        ],
        "extracted_fields": [
            "rooms", "bedrooms", "bathrooms", "toilets", "kitchens",
            "area", "price", "postal_code", "city", "address"
        ],
        "example_request": """curl -X POST -F "file=@house.pdf" http://localhost:5000/api/extract""",
        "example_response": """{
            "success": true,
            "id": "20241206_143022",
            "timestamp": "2024-12-06T14:30:22.123456",
            "data": {
                "rooms": 5,
                "bedrooms": 3,
                "bathrooms": 2,
                "toilets": 2,
                "kitchens": 1,
                "area": 125.0,
                "price": 450000.0,
                "postal_code": "75016",
                "city": "Paris",
                "address": "42 Avenue des Tilleuls",
                "confidence": 90.0,
                "extraction_date": "2024-12-06T14:30:22.123456",
                "text_preview": "..."
            },
            "metadata": {
                "text_length": 3254,
                "file_name": "house.pdf",
                "original_filename": "house.pdf",
                "saved_path": "uploads/house.pdf",
                "confidence": 90.0
            }
        }"""
    }
    
    return jsonify(docs), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "Not Found",
        "message": "The requested endpoint does not exist"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "error": "Method Not Allowed",
        "message": "The HTTP method is not supported for this endpoint"
    }), 405

@app.errorhandler(413)
def request_too_large(error):
    return jsonify({
        "success": False,
        "error": "Request Too Large",
        "message": "The uploaded file exceeds the maximum size limit (16MB)"
    }), 413

if __name__ == '__main__':
    # Run Flask app
    print("Starting PDF House Extractor API...")
    print(f"Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"Results folder: {app.config['RESULTS_FOLDER']}")
    print("API Documentation: http://localhost:5000/api/docs")
    print("Ready to accept requests!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)