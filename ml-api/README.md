# ML Models API - Unified Backend

This FastAPI backend integrates all ML models directly, so you only need to run one service instead of multiple Flask services.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml-api
pip install -r requirements.txt
```

### 2. Ensure Model Files Exist

Make sure these files are in the `models/` directory (parent directory):

- `Predict_price.pkl` - Price prediction model
- `model_predict_10_years.pkl` - 10-year forecast model
- `best_street_cluster_model.pkl` - Cluster model
- `clustered_streets.csv` - Cluster data
- `cluster_centroids.csv` - Cluster centroids
- `real_estate_advisor.pkl` - Investment advisor model

### 3. Run the Backend

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5001
```

The API will be available at `http://localhost:5001`

## 📋 API Endpoints

### Health Check
- `GET /health` - Check if models are loaded

### Price Prediction
- `POST /api/predict-price` - Predict current property price

### Price Forecasting
- `POST /api/forecast` - Forecast prices for 1, 5, 10 years

### Street Clusters
- `GET /api/clusters/summary` - Get cluster summary statistics
- `GET /api/clusters/centroids` - Get cluster centroids for map
- `GET /api/clusters/all?page=1&size=1000` - Get all cluster properties (paged)
- `POST /api/clusters/predict` - Predict cluster for a location

### Investment Advisor
- `GET /api/advisor/recommend?budget=500000&state=CA&city=Los Angeles&min_beds=2&top_n=10` - Get investment recommendations
- `GET /api/advisor/states` - Get list of available states
- `GET /api/advisor/cities/{state}` - Get cities in a specific state

## 🔍 Model Loading

All models are loaded automatically at startup. Check the console output to see which models loaded successfully:

```
🚀 Starting ML Models API - Loading all models...
Loading price prediction model...
✅ Price prediction model loaded with 20 features
Loading 10-year forecast model...
✅ Forecast model loaded! R² = 0.8523
Loading cluster model...
✅ Cluster model loaded! 50000 properties, 10 clusters
Loading investment advisor model...
✅ Advisor loaded! 100,000 properties available
🎉 All models loaded successfully!
```

## ⚠️ Troubleshooting

### Models Not Loading

If you see warnings like `⚠️ Price model not found`, check:
1. Model files are in the `models/` directory (parent of `ml-api/`)
2. File names match exactly (case-sensitive)
3. You have read permissions

### Missing Dependencies

If you get import errors, install missing packages:
```bash
pip install pandas numpy scikit-learn
```

### Port Already in Use

If port 5001 is already in use, change it:
```python
uvicorn.run(app, host="0.0.0.0", port=5002)  # Change port number
```

## 🎯 Frontend Integration

The frontend is already configured to use this unified API. Just make sure:

1. Backend is running on `http://localhost:5001`
2. Frontend `.env.local` has:
   ```env
   NEXT_PUBLIC_ML_API_URL=http://localhost:5001
   ```

That's it! No need to run separate Flask services anymore.
