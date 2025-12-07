#!/usr/bin/env python3
"""
PDF House Information Extractor Core Module
"""

import re
import json
import pdfplumber
from pathlib import Path
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from typing import Dict, Any, Optional, List, Tuple

class PDFHouseExtractor:
    """PDF house information extractor class"""
    
    def __init__(self, upload_folder: str = "uploads"):
        self.upload_folder = upload_folder
        self.allowed_extensions = {'pdf'}
        
        # Create upload folder if it doesn't exist
        os.makedirs(upload_folder, exist_ok=True)
        
        # Define extraction patterns - EXACTLY 12 fields
        self.patterns: List[Tuple[str, str]] = [
            # =====================
            # BASIC LISTING FIELDS
            # =====================

            # Price: "€450,000" or "$450,000" - FIXED to extract numbers only
            (r'[$€€]\s?([\d\s,.]+)', 'price'),

            # Status: "Status: For Sale", "Status: Sold", "Available"
            (r'(?:Status|Disponibilité)[:\s]+([A-Za-z ]+)', 'status'),

            # Brokered By / Agency
            (r'(?:Brokered by|Listed by|Agence|Agency|Broker)[:\s]+([^\n,]+)', 'brokered_by'),

            # =====================
            # PROPERTY FEATURES
            # =====================

            # Bedrooms: "Bed: 4", "Bedrooms: 3", "3 bedrooms", "3 bed", "Chambres: 3"
            # Prioritize "Bed:" format first, then "Bedrooms:", then number-first format
            (r'\b(?:Bed|Bedroom|Bedrooms|Chambre|Chambres)[:\s]+(\d+)', 'bed'),
            (r'(\d+)\s+(?:bedroom|bedrooms|bed|chambre|chambres)\b', 'bed'),

            # Bathrooms: "Bath: 3", "Bathrooms: 2", "2 bathrooms", "2 bath", "Salles de bain: 2"
            (r'(?:Bath|Bathrooms?|Salles? de bain)[:\s]+(\d+)|(\d+)\s+(?:bathroom|bathrooms|bath|salle de bain)\b', 'bath'),

            # Lot size in acres: "Acre Lot: 0.32", "0.32 acre", "0.32 acres"
            # Prioritize "Acre Lot:" format first
            (r'\b(?:Acre Lot|Lot Size|Lot)[:\s]+([\d.]+)', 'acre_lot'),
            (r'([\d.]+)\s+(?:acre|acres|acre lot)\b', 'acre_lot'),

            # House size: "House Size: 2,480 sqft", "125 m²", "2200 sqft", "Square Feet: 2200"
            (r'(?:House Size|Square Feet|Square Footage|Size|Area)[:\s]+([\d,.]+)\s*(?:m²|m2|sqft|square feet|sq ft)?|([\d,.]+)\s+(?:m²|m2|sqft|square feet|sq ft)', 'house_size'),

            # =====================
            # ADDRESS FIELDS
            # =====================

            # Street: "Street: 42 Avenue des Tilleuls" or "42 Avenue des Tilleuls"
            (r'(?:Address|Street|Adresse)[:\s]+(.+?)(?:\n|$)', 'street'),

            # City
            (r'(?:City|Ville)[:\s]+([A-Za-z -]+)', 'city'),

            # State: "State: CA" or "State: France"
            (r'(?:State|État|Country|Pays)[:\s]+([A-Za-z ]{2,20})', 'state'),

            # Zip code (5 digits)
            (r'(?:ZIP Code|Code postal|Postal Code)[:\s]+(\d{5})', 'zip_code'),

            # =====================
            # DATE FIELDS
            # =====================

            # Previous sold date
            (r'(?:Sold on|Previous sale date|Previous Sold Date|Date)[:\s]+([^\n]+)', 'prev_sold_date'),
        ]
    
    def allowed_file(self, filename: str) -> bool:
        """Check if file has allowed extension"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_uploaded_file(self, file) -> Optional[str]:
        """Save uploaded file and return path"""
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.upload_folder, filename)
            file.save(filepath)
            return filepath
        return None
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF using pdfplumber"""
        text = ""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text: {str(e)}")
    
    def clean_numeric_value(self, value: str, field_type: str) -> Any:
        """Clean and convert numeric values"""
        try:
            # Remove any non-digit characters except dots, commas
            clean_value = re.sub(r'[^\d,.]', '', value.strip())
            
            if field_type in ['price', 'house_size']:
                # Handle thousands separators (commas) and decimal points
                # US format: "2,480.50" or "2,480" (thousands separator)
                # European format: "2480,50" (comma as decimal)
                
                # Check if comma is likely a thousands separator (has 3 digits after it)
                if ',' in clean_value and '.' in clean_value:
                    # Both comma and dot: "2,480.50" - comma is thousands, dot is decimal
                    clean_value = clean_value.replace(',', '')
                    return float(clean_value)
                elif ',' in clean_value:
                    # Only comma: check if it's thousands separator (3 digits after comma)
                    parts = clean_value.split(',')
                    if len(parts) == 2 and len(parts[1]) == 3:
                        # "2,480" format - thousands separator
                        clean_value = clean_value.replace(',', '')
                        return float(clean_value)
                    else:
                        # "2480,50" format - comma is decimal separator
                        clean_value = clean_value.replace(',', '.')
                        return float(clean_value)
                else:
                    # No comma, just dots
                    return float(clean_value)
                    
            elif field_type == 'acre_lot':
                # Acre lot is typically a decimal like "0.32"
                # Replace comma with dot for decimal
                clean_value = clean_value.replace(',', '.')
                return float(clean_value)
                
            elif field_type in ['bed', 'bath']:
                # For counts (bedrooms, bathrooms) - just extract digits
                clean_value = re.sub(r'[^\d]', '', clean_value)
                return int(clean_value) if clean_value else 0
            else:
                return clean_value.strip()
        except Exception:
            return value.strip()
    
    def extract_house_info(self, text: str) -> Dict[str, Any]:
        """Extract house information using regex patterns"""
        
        results = {}
        
        # Apply all patterns
        for pattern, field in self.patterns:
            try:
                match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
                if match:
                    # Get first non-None group
                    value = None
                    for group in match.groups():
                        if group:
                            value = group.strip()
                            break
                    
                    if value:
                        # Clean and convert based on field type
                        if field in ['price', 'acre_lot', 'house_size']:
                            cleaned_value = self.clean_numeric_value(value, field)
                            # Only set if not already set, or if current value is suspiciously small
                            if field not in results or (field == 'house_size' and results[field] < 100):
                                results[field] = cleaned_value
                        elif field in ['bed', 'bath']:
                            cleaned_value = self.clean_numeric_value(value, field)
                            # Only set if not already set, or if current value is 0 (likely wrong)
                            if field not in results or results[field] == 0:
                                results[field] = cleaned_value
                        elif field == 'prev_sold_date':
                            if field not in results:
                                results[field] = self.normalize_date(value)
                        else:
                            if field not in results:
                                results[field] = value
            except Exception as e:
                # Skip pattern if it fails
                continue
        
        # Fallback: Try to find price in different format
        if 'price' not in results:
            price_patterns = [
                r'(?:Price|Prix|Listing Price)[:\s]+[€$]?\s?([\d,. ]+)',
                r'[€$]\s?([\d,. ]{5,})',
            ]
            for pattern in price_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    results['price'] = self.clean_numeric_value(match.group(1), 'price')
                    break
        
        # Fallback for bedrooms if not found or if value is 0 (likely wrong extraction)
        if 'bed' not in results or results.get('bed', 0) == 0:
            bed_patterns = [
                r'(?:Bed|Bedroom|Chambre)[:\s]+(\d+)',
                r'(\d+)\s+(?:bedroom|bedrooms|bed|chambre|chambres)',
            ]
            for pattern in bed_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    bed_value = int(match.group(1))
                    if bed_value > 0:  # Only use if it's a valid positive number
                        results['bed'] = bed_value
                        break
        
        # Fallback for house size if not found or if value is suspiciously small (< 100)
        if 'house_size' not in results or (results.get('house_size', 0) < 100 and results.get('house_size', 0) > 0):
            house_size_patterns = [
                r'(?:House Size|Square Feet|Square Footage|Size|Area)[:\s]+([\d,.]+)\s*(?:m²|m2|sqft|square feet|sq ft)?',
                r'([\d,.]+)\s+(?:m²|m2|sqft|square feet|sq ft)',
            ]
            for pattern in house_size_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    # Extract number and handle comma-separated thousands
                    value_str = match.group(1)
                    # Remove commas (thousands separator) and convert
                    value_str = value_str.replace(',', '')
                    try:
                        house_size_value = float(value_str)
                        if house_size_value >= 100:  # Only use if it's a reasonable size
                            results['house_size'] = house_size_value
                            break
                    except ValueError:
                        pass
        
        # Calculate confidence score based on how many fields were found
        total_fields = 12
        filled_fields = len(results)
        results['confidence'] = round(filled_fields / total_fields * 100, 1)
        
        return results
    
    def normalize_date(self, date_str: str) -> str:
        """Normalize date string to ISO format"""
        try:
            date_str = date_str.strip()
            
            date_formats = [
                '%Y-%m-%d',
                '%m/%d/%Y',
                '%d/%m/%Y',
                '%Y/%m/%d',
                '%b %d, %Y',
                '%B %d, %Y',
                '%d %B %Y',
                '%B %d, %Y',
            ]
            
            for fmt in date_formats:
                try:
                    date_obj = datetime.strptime(date_str, fmt)
                    return date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            
            return date_str
        except Exception:
            return date_str
    
    def process_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Process PDF and extract house information"""
        try:
            # Extract text
            text = self.extract_text_from_pdf(pdf_path)
            
            if len(text) < 10:
                return {
                    "success": False,
                    "error": "Could not extract text from PDF",
                    "text_length": len(text)
                }
            
            # Extract house information
            house_info = self.extract_house_info(text)
            
            # Prepare response
            response = {
                "success": True,
                "data": {
                    **house_info,
                    "extraction_date": datetime.now().isoformat(),
                    "text_preview": text[:500] + "..." if len(text) > 500 else text
                },
                "metadata": {
                    "text_length": len(text),
                    "file_name": os.path.basename(pdf_path),
                    "confidence": house_info.get('confidence', 0)
                }
            }
            
            return response
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "traceback": str(e.__traceback__) if hasattr(e, '__traceback__') else None
            }
    
    def process_uploaded_file(self, file) -> Dict[str, Any]:
        """Process uploaded file"""
        try:
            filepath = self.save_uploaded_file(file)
            if not filepath:
                return {
                    "success": False,
                    "error": "Invalid file type. Only PDF files are allowed."
                }
            
            result = self.process_pdf(filepath)
            
            if result["success"]:
                result["metadata"]["original_filename"] = file.filename
                result["metadata"]["saved_path"] = filepath
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Processing error: {str(e)}"
            }