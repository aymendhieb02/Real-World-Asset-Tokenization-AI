# Deployment Guide - AI Models

This guide explains how to deploy and integrate the AI models with the Real-World Asset Tokenization platform.

## 🚀 Quick Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git
cd Real-World-Asset-Tokenization-AI

# Create and checkout Models_AI branch
git checkout -b Models_AI

# Navigate to models directory (if separate)
cd Models_AI  # or wherever your models are located
```

### 2. Environment Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Model Files

Ensure you have the trained model files:
- `model_best.pkl` - Main price prediction model
- `model_predict_10_years.pkl` - Forecasting model
- `real_estate_advisor.pkl` - Investment recommendation system
- `best_street_cluster_model.pkl` - Clustering model

## 🔗 Integration with Backend

### Option 1: Python API Service

Create a Flask/FastAPI service to serve model predictions:

```python
# api_service.py
from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load models at startup
with open('model_best.pkl', 'rb') as f:
    price_model = pickle.load(f)

@app.route('/api/predict-price', methods=['POST'])
def predict_price():
    data = request.json
    # Process and predict
    return jsonify({'price': predicted_price})

if __name__ == '__main__':
    app.run(port=8000)
```

### Option 2: NestJS Integration

Use Python bridge in NestJS backend:

```typescript
// rwa-backend/src/ai/ai.service.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async predictPrice(propertyData: PropertyDto): Promise<number> {
  const script = `python scripts/predict.py ${JSON.stringify(propertyData)}`;
  const { stdout } = await execAsync(script);
  return JSON.parse(stdout).price;
}
```

## 📦 Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "api_service.py"]
```

## ☁️ Cloud Deployment

### AWS Lambda
- Package models with Lambda layer
- Use serverless framework
- Set memory to 3GB+ for large models

### Google Cloud Functions
- Deploy as Cloud Function
- Use Cloud Storage for model files
- Enable Cloud ML for scaling

### Azure Functions
- Deploy as Azure Function
- Use Azure Blob Storage for models
- Configure appropriate memory limits

## 🔒 Security Considerations

1. **Model Files:** Store in secure storage (S3, GCS, Azure Blob)
2. **API Keys:** Use environment variables
3. **Rate Limiting:** Implement to prevent abuse
4. **Input Validation:** Validate all inputs before prediction
5. **Error Handling:** Don't expose model internals in errors

## 📊 Monitoring

- Log prediction requests and responses
- Track model performance metrics
- Monitor prediction latency
- Set up alerts for errors

## 🔄 Model Updates

1. Retrain models with new data
2. Validate performance on test set
3. Deploy new model version
4. A/B test if needed
5. Monitor performance in production

