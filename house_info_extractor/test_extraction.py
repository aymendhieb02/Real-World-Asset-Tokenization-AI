#!/usr/bin/env python3
"""
Test script for the PDF house info extractor
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.append('.')

from house_info_extractor.app import PDFHouseInfoExtractor
from models import HouseInfo
import json

def test_basic_extraction(pdf_path: str):
    """Test basic extraction without OpenAI"""
    print("="*60)
    print("TESTING BASIC EXTRACTION (regex + NLP)")
    print("="*60)
    
    try:
        # Create extractor
        extractor = PDFHouseInfoExtractor(use_openai=False)
        
        # Extract information
        print(f"Processing: {pdf_path}")
        house_info = extractor.extract(pdf_path)
        
        # Display results
        house_info.display_summary()
        
        # Save to file
        with open("test_results_basic.json", "w", encoding="utf-8") as f:
            json.dump(house_info.to_dict(), f, indent=2, ensure_ascii=False)
        print("\n✅ Results saved to: test_results_basic.json")
        
        return house_info
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_openai_extraction(pdf_path: str):
    """Test extraction with OpenAI"""
    print("\n" + "="*60)
    print("TESTING OPENAI EXTRACTION")
    print("="*60)
    
    try:
        # Create extractor with OpenAI
        extractor = PDFHouseInfoExtractor(use_openai=True)
        
        # Extract information
        print(f"Processing: {pdf_path}")
        house_info = extractor.extract(pdf_path, use_openai=True)
        
        # Display results
        house_info.display_summary()
        
        # Save to file
        with open("test_results_openai.json", "w", encoding="utf-8") as f:
            json.dump(house_info.to_dict(), f, indent=2, ensure_ascii=False)
        print("\n✅ Results saved to: test_results_openai.json")
        
        return house_info
        
    except Exception as e:
        print(f"❌ OpenAI extraction failed: {e}")
        print("⚠️  Make sure you have OPENAI_API_KEY in your .env file")
        return None

def test_multiple_methods(pdf_path: str):
    """Compare different extraction methods"""
    print("\n" + "="*60)
    print("COMPARING EXTRACTION METHODS")
    print("="*60)
    
    extractor = PDFHouseInfoExtractor()
    
    # Extract raw text first
    print("📄 Extracting text from PDF...")
    raw_text = extractor.extract_text_from_pdf(pdf_path)
    print(f"📊 Text length: {len(raw_text)} characters")
    print(f"📝 First 500 chars:\n{raw_text[:500]}...\n")
    
    # Test regex extraction
    print("🔄 Testing regex extraction...")
    regex_results = extractor.extract_with_regex(raw_text)
    print(f"🔍 Regex found: {len([v for v in regex_results.values() if v])} items")
    print(f"📈 Confidence: {regex_results.get('extractor_confidence', 0):.1%}")
    
    # Test NLP extraction
    print("\n🧠 Testing NLP extraction...")
    nlp_results = extractor.extract_with_nlp(raw_text)
    print(f"🔍 NLP found: {len([v for v in nlp_results.values() if v])} items")
    
    # Display comparison
    print("\n" + "="*60)
    print("EXTRACTION COMPARISON")
    print("="*60)
    
    all_keys = set(regex_results.keys()) | set(nlp_results.keys())
    for key in sorted(all_keys):
        if key != 'extractor_confidence':
            regex_val = regex_results.get(key, 'Not found')
            nlp_val = nlp_results.get(key, 'Not found')
            print(f"{key:15} | Regex: {regex_val:15} | NLP: {nlp_val}")

def test_on_multiple_pdfs():
    """Test on multiple PDF files if available"""
    print("\n" + "="*60)
    print("BATCH PROCESSING TEST")
    print("="*60)
    
    pdf_dir = Path(".")
    pdf_files = list(pdf_dir.glob("*.pdf")) + list(pdf_dir.glob("*.PDF"))
    
    if not pdf_files:
        print("No PDF files found in current directory.")
        return
    
    extractor = PDFHouseInfoExtractor()
    
    results = []
    for pdf_file in pdf_files:
        print(f"\n📋 Processing: {pdf_file.name}")
        try:
            house_info = extractor.extract(str(pdf_file))
            results.append({
                "file": pdf_file.name,
                "info": house_info.to_dict()
            })
            print(f"✅ Successfully extracted")
        except Exception as e:
            print(f"❌ Failed: {e}")
            results.append({
                "file": pdf_file.name,
                "error": str(e)
            })
    
    # Save batch results
    if results:
        with open("batch_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Batch results saved to: batch_results.json")

def main():
    """Main test function"""
    print("🏠 HOUSE INFO EXTRACTOR - TEST SUITE")
    print("="*60)
    
    # Check if PDF path is provided as argument
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        # Try to find PDF in current directory
        pdf_files = list(Path(".").glob("*.pdf")) + list(Path(".").glob("*.PDF"))
        if pdf_files:
            pdf_path = str(pdf_files[0])
            print(f"📄 Using PDF: {pdf_path}")
        else:
            print("❌ No PDF file found. Please provide a path or place PDF in current directory.")
            print("Usage: python test_extraction.py [path_to_pdf]")
            return
    
    # Check if file exists
    if not Path(pdf_path).exists():
        print(f"❌ File not found: {pdf_path}")
        return
    
    # Run tests
    print(f"\n📊 File size: {Path(pdf_path).stat().st_size / 1024:.1f} KB")
    
    # Test 1: Basic extraction
    house_info_basic = test_basic_extraction(pdf_path)
    
    # Test 2: OpenAI extraction (if available)
    house_info_openai = test_openai_extraction(pdf_path)
    
    # Test 3: Compare methods
    test_multiple_methods(pdf_path)
    
    # Test 4: Batch processing (if multiple PDFs)
    test_on_multiple_pdfs()
    
    # Final summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    if house_info_basic:
        print(f"✅ Basic extraction successful")
        print(f"   Confidence: {house_info_basic.extractor_confidence:.1%}")
    
    if house_info_openai:
        print(f"✅ OpenAI extraction successful")

if __name__ == "__main__":
    main()