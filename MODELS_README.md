# AI Models - Real Estate Price Prediction System

This directory contains the AI/ML models for the Real-World Asset Tokenization platform. These models provide property price prediction, forecasting, and investment recommendation capabilities.

## 📁 Directory Structure

```
Models_AI/
├── README.md                    # This file - comprehensive documentation
├── MODELS_README.md            # Quick reference guide
├── requirements.txt            # Python dependencies
├── setup.py                    # Installation script
├── .gitignore                  # Git ignore rules
├── USA_Real_Estate_NoteBook.ipynb  # Main Jupyter notebook with all code
├── models/                     # Trained model files (use Git LFS)
│   ├── model_best.pkl         # Main price prediction model
│   ├── model_predict_10_years.pkl  # 10-year forecasting model
│   ├── real_estate_advisor.pkl # Investment recommendation system
│   └── best_street_cluster_model.pkl  # Geographic clustering model
├── data/                       # Data files (use Git LFS for large files)
│   ├── cleaned_data.csv        # Processed dataset
│   ├── data_with_street_coords.csv  # Data with coordinates
│   └── clustered_by_street.csv  # Clustered data
└── scripts/                    # Utility scripts (if any)
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip or conda package manager
- Jupyter Notebook (for running the notebook)

### Installation

1. **Clone the repository and checkout the Models_AI branch:**
```bash
git clone https://github.com/aymendhieb02/Real-World-Asset-Tokenization-AI.git
cd Real-World-Asset-Tokenization-AI
git checkout Models_AI
```

2. **Navigate to the models directory:**
```bash
cd Models_AI
```

3. **Create a virtual environment (recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Install the package (optional):**
```bash
pip install -e .
```

## 📊 Models Overview

### 1. Price Prediction Model (`model_best.pkl`)
- **Purpose:** Predict current property prices
- **Algorithm:** XGBoost Regressor
- **Performance:** R² = 0.8392, MAE = $101,759
- **Features:** 20 engineered features including property characteristics, location, and temporal data

### 2. 10-Year Forecasting Model (`model_predict_10_years.pkl`)
- **Purpose:** Predict property prices for 1, 5, and 10 years ahead
- **Algorithm:** Hybrid XGBoost + Growth Rate Analysis
- **Features:** Temporal features, ZIP-specific growth rates, inflation adjustment

### 3. Investment Recommendation System (`real_estate_advisor.pkl`)
- **Purpose:** Identify top investment opportunities based on ROI and risk
- **Features:** Budget filtering, multi-horizon ROI calculation, risk assessment
- **Output:** Top N recommendations with ROI metrics and risk scores

### 4. Geographic Clustering Model (`best_street_cluster_model.pkl`)
- **Purpose:** Cluster properties by geographic location
- **Algorithm:** DBSCAN (street-level) and MiniBatchKMeans (regional)
- **Features:** Street-level and regional clustering for location-based analysis

## 🔧 Usage Examples

### Price Prediction

```python
import pickle
import pandas as pd
import numpy as np

# Load model
with open("models/model_best.pkl", "rb") as f:
    saved = pickle.load(f)
    model = saved["model"]
    features = saved["features"]

# Prepare property data
property_data = {
    "house_size": 2200,
    "bed": 3,
    "bath": 2,
    "acre_lot": 0.5,
    # ... other features
}

# Predict
df_input = pd.DataFrame([property_data])[features]
pred_log = model.predict(df_input)
price = np.expm1(pred_log[0])
print(f"Predicted price: ${price:,.0f}")
```

### Investment Recommendations

```python
from RealEstateInvestmentAdvisor import RealEstateInvestmentAdvisor

advisor = RealEstateInvestmentAdvisor("models/model_best.pkl", "data/cleaned_data.csv")

results = advisor.recommend_investments(
    budget=500000,
    state="California",
    min_beds=3,
    top_n=10
)

if results['success']:
    for prop in results['data']:
        print(f"{prop['city']}: ${prop['current_price']:,.0f} - ROI: {prop['roi_10_year']:.2f}%")
```

## 📈 Model Performance

| Model | Metric | Value |
|-------|--------|-------|
| Price Prediction | R² Score | 0.8392 |
| Price Prediction | MAE | $101,759 |
| Price Prediction | MAPE | 25.46% |
| Clustering | Silhouette Score | 0.4768 |
| Clustering | Training Time | 0.30s |

## 🔗 Integration with Backend

These models can be integrated with the NestJS backend in `rwa-backend/`:

1. **API Endpoints:** Create endpoints in `rwa-backend/src/ai/` to serve model predictions
2. **Model Loading:** Load models at startup and cache in memory
3. **Async Processing:** Use background jobs for batch predictions
4. **Caching:** Cache predictions for frequently queried properties

Example integration:
```typescript
// rwa-backend/src/ai/ai.service.ts
import { spawn } from 'child_process';

async predictPrice(propertyData: PropertyDto): Promise<number> {
  // Call Python script or use Python bridge
  const result = await this.pythonService.predict(propertyData);
  return result.price;
}
```

## 🧪 Testing

Run the Jupyter notebook to test the models:
```bash
jupyter notebook USA_Real_Estate_NoteBook.ipynb
```

## 📝 Notes

- **Large Files:** Model files (.pkl) and data files (.csv) are large. Consider using Git LFS:
  ```bash
  git lfs install
  git lfs track "*.pkl"
  git lfs track "*.csv"
  ```

- **Data Privacy:** Ensure sensitive property data is handled according to privacy regulations

- **Model Updates:** Models should be retrained periodically with new data to maintain accuracy

## 📚 Documentation

For detailed documentation, see [README.md](README.md) in this directory.

## 🤝 Contributing

When contributing to the models:
1. Test changes in the Jupyter notebook first
2. Update model version numbers
3. Document any changes to features or hyperparameters
4. Update performance metrics if retraining

## 📄 License

This project is licensed under the MIT License.

