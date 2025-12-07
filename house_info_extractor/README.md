# House Information Extractor

Extract structured information from house description PDFs (rooms, bathrooms, postal code, etc.).

## Features
- Extract text from PDFs using pdfplumber or PyPDF2
- Multiple extraction methods:
  - Regex patterns
  - NLP with spaCy
  - OpenAI GPT (optional)
- Output in JSON or text format
- French and English support

## Installation

1. Clone this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download fr_core_news_sm