#!/usr/bin/env python3
"""
Test the PDF extractor API
"""

import requests
import json

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get("http://localhost:5000/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_extract():
    """Test PDF extraction"""
    print("Testing PDF extraction...")
    
    # Upload a PDF file
    with open('doc_pro_test_1.pdf', 'rb') as f:
        files = {'file': f}
        response = requests.post("http://localhost:5000/api/extract", files=files)
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        print("✅ Extraction successful!")
        data = result.get('data', {})
        
        print("\nExtracted Information:")
        print("-" * 30)
        fields = [
            ('Rooms', data.get('rooms')),
            ('Bedrooms', data.get('bedrooms')),
            ('Bathrooms', data.get('bathrooms')),
            ('Toilets', data.get('toilets')),
            ('Kitchens', data.get('kitchens')),
            ('Area', data.get('area')),
            ('Price', data.get('price')),
            ('Postal Code', data.get('postal_code')),
            ('City', data.get('city')),
            ('Address', data.get('address')),
        ]
        
        for label, value in fields:
            if value:
                print(f"{label:15}: {value}")
        
        print(f"\nConfidence: {data.get('confidence', 0)}%")
        print(f"Result ID: {result.get('id')}")
        
        # Save the result
        with open('api_test_result.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print("\n💾 Full result saved to: api_test_result.json")
        
        return result.get('id')
    else:
        print(f"❌ Extraction failed: {result.get('error', 'Unknown error')}")
        return None

def test_results():
    """Test results listing"""
    print("\nTesting results listing...")
    response = requests.get("http://localhost:5000/api/results")
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        print(f"Found {result.get('count', 0)} results")
        for res in result.get('results', [])[:5]:  # Show first 5
            print(f"  - {res.get('id')}: {res.get('filename')} (Confidence: {res.get('confidence')}%)")
    else:
        print(f"❌ Failed to get results: {result.get('error')}")

def main():
    """Main test function"""
    print("="*50)
    print("PDF HOUSE EXTRACTOR API TEST")
    print("="*50)
    
    # Check if API is running
    try:
        test_health()
    except requests.exceptions.ConnectionError:
        print("❌ API is not running. Please start it with: python app.py")
        return
    
    # Test extraction
    result_id = test_extract()
    
    # Test results listing
    test_results()
    
    # Test getting specific result
    if result_id:
        print(f"\nTesting get result by ID ({result_id})...")
        response = requests.get(f"http://localhost:5000/api/results/{result_id}")
        if response.status_code == 200:
            print("✅ Successfully retrieved result by ID")
        else:
            print(f"❌ Failed to get result: {response.status_code}")
    
    print("\n" + "="*50)
    print("TEST COMPLETE")
    print("="*50)

if __name__ == "__main__":
    main()