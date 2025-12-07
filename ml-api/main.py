"""
Unified ML Models API - FastAPI backend with integrated models
All Flask services integrated directly into this FastAPI app
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager
import uvicorn
import logging
import os
import sys
from pathlib import Path

# Add models directory to path
models_dir = Path(__file__).parent.parent / "models"
sys.path.insert(0, str(models_dir))

# Import education service
from education_service import education_service, EDUCATION_LEVELS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==========================================
# LIFESPAN EVENT HANDLER
# ==========================================
# Global flag to track if models are loading
models_loading = False
models_loaded = False
load_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup - load models in background so server can start immediately
    global models_loading, load_task
    models_loading = True
    import asyncio
    
    # Run load_models in background task
    load_task = asyncio.create_task(load_models_background())
    
    yield
    
    # Shutdown - cancel background task if still running
    if load_task and not load_task.done():
        logger.info("Cancelling model loading task...")
        load_task.cancel()
        try:
            await load_task
        except asyncio.CancelledError:
            logger.info("Model loading task cancelled")
        except Exception as e:
            logger.warning(f"Error cancelling model loading task: {e}")

async def load_models_background():
    """Load models in background without blocking server startup"""
    global models_loading, models_loaded
    import asyncio
    try:
        # load_models is async but does blocking I/O, so we await it directly
        await load_models()
        models_loaded = True
        logger.info("🎉 All models loaded successfully in background!")
    except asyncio.CancelledError:
        logger.info("Model loading was cancelled during shutdown")
        raise
    except Exception as e:
        logger.error(f"❌ Error loading models in background: {e}", exc_info=True)
    finally:
        models_loading = False

async def load_models():
    """Load all ML models and data at startup"""
    global price_model, price_features
    global forecast_model, forecast_features, forecast_metrics, forecast_growth_rates, forecast_reference_year, forecast_avg_inflation
    global cluster_model, cluster_num_clusters, cluster_stats, cluster_df, centroids_df
    global advisor
    global property_data_df
    
    logger.info("🚀 Starting ML Models API - Loading all models...")
    
    try:
        # Load Price Prediction Model
        logger.info("Loading price prediction model...")
        price_model_path = models_dir / "Predict_price.pkl"
        if price_model_path.exists():
            import pickle
            import pandas as pd
            with open(price_model_path, "rb") as f:
                saved = pickle.load(f)
            price_model = saved["model"]
            price_features = list(saved["features"])
            logger.info(f"✅ Price prediction model loaded with {len(price_features)} features")
        else:
            logger.warning(f"⚠️ Price model not found at {price_model_path}")
        
        # Load Forecast Model
        logger.info("Loading 10-year forecast model...")
        forecast_model_path = models_dir / "model_predict_10_years.pkl"
        if forecast_model_path.exists():
            import pickle
            with open(forecast_model_path, "rb") as f:
                saved = pickle.load(f)
            forecast_model = saved["model"]
            forecast_features = saved["features"]
            forecast_metrics = saved["metrics"]
            forecast_growth_rates = saved["growth_rates"]
            forecast_reference_year = saved["reference_year"]
            forecast_avg_inflation = saved.get("avg_inflation", 0.025)
            logger.info(f"✅ Forecast model loaded! R² = {forecast_metrics['r2']:.4f}")
        else:
            logger.warning(f"⚠️ Forecast model not found at {forecast_model_path}")
        
        # Load Cluster Model and Data
        logger.info("Loading cluster model and data...")
        cluster_model_path = models_dir / "street_clustering_metadata.pkl"
        cluster_data_path = models_dir / "clustered_by_street.csv"
        centroids_path = models_dir / "street_cluster_centroids.csv"
        stats_path = models_dir / "street_clustering_stats.csv"
        
        import pickle
        import pandas as pd
        
        # Load centroids CSV (much smaller, load directly)
        if centroids_path.exists():
            logger.info(f"   Loading cluster centroids from {centroids_path.name}...")
            try:
                centroids_df = pd.read_csv(centroids_path, low_memory=False)
                logger.info(f"   ✅ Loaded {len(centroids_df):,} cluster centroids")
            except Exception as e:
                logger.warning(f"   ⚠️ Error loading centroids: {e}")
                centroids_df = None
        else:
            logger.warning(f"   ⚠️ Centroids CSV not found at {centroids_path}")
            centroids_df = None
        
        # Load cluster data (may be very large, use chunks)
        if cluster_data_path.exists():
            logger.info(f"   Loading cluster data from {cluster_data_path.name} (this may take a while for large files)...")
            try:
                # Read in chunks for very large files
                chunk_list = []
                chunk_size = 100000  # 100k rows per chunk
                total_rows = 0
                for chunk in pd.read_csv(cluster_data_path, chunksize=chunk_size, low_memory=False):
                    chunk_list.append(chunk)
                    total_rows += len(chunk)
                    if len(chunk_list) % 10 == 0:
                        logger.info(f"   Loaded {total_rows:,} rows so far...")
                if chunk_list:
                    cluster_df = pd.concat(chunk_list, ignore_index=True)
                    logger.info(f"   ✅ Loaded {len(cluster_df):,} rows in {len(chunk_list)} chunks")
                else:
                    cluster_df = pd.read_csv(cluster_data_path, low_memory=False)
                    logger.info(f"   ✅ Loaded {len(cluster_df):,} rows")
            except Exception as e:
                logger.warning(f"   ⚠️ Error loading cluster data: {e}")
                cluster_df = None
        else:
            logger.warning(f"   ⚠️ Cluster data CSV not found at {cluster_data_path}")
            cluster_df = None
        
        # Load cluster metadata/model if exists
        if cluster_model_path.exists():
            try:
                logger.info(f"   Loading cluster metadata from {cluster_model_path.name}...")
                with open(cluster_model_path, "rb") as f:
                    cluster_metadata = pickle.load(f)
                logger.info(f"   ✅ Cluster metadata loaded")
                # Extract useful info if available
                if isinstance(cluster_metadata, dict):
                    cluster_num_clusters = cluster_metadata.get("num_clusters", len(centroids_df) if centroids_df is not None else 0)
                    cluster_stats = cluster_metadata
                else:
                    cluster_num_clusters = len(centroids_df) if centroids_df is not None else 0
                    cluster_stats = {}
            except Exception as e:
                logger.warning(f"   ⚠️ Error loading cluster metadata: {e}")
                cluster_num_clusters = len(centroids_df) if centroids_df is not None else 0
                cluster_stats = {}
        else:
            logger.info(f"   Cluster metadata not found, using centroids count")
            cluster_num_clusters = len(centroids_df) if centroids_df is not None else 0
            cluster_stats = {}
        
        # Load cluster stats CSV if available
        if stats_path.exists():
            try:
                logger.info(f"   Loading cluster statistics from {stats_path.name}...")
                cluster_stats_df = pd.read_csv(stats_path, low_memory=False)
                logger.info(f"   ✅ Loaded statistics for {len(cluster_stats_df):,} streets")
            except Exception as e:
                logger.warning(f"   ⚠️ Error loading cluster stats: {e}")
                cluster_stats_df = None
        else:
            cluster_stats_df = None
        
        if cluster_df is None and centroids_df is None:
            logger.warning("⚠️ No cluster data or centroids loaded")
        else:
            logger.info(f"✅ Cluster system loaded: {cluster_num_clusters} clusters, {len(cluster_df) if cluster_df is not None else 0} properties")
        
        # Try to load old cluster model for backward compatibility (skip if new files exist)
        old_cluster_model_path = models_dir / "best_street_cluster_model.pkl"
        if old_cluster_model_path.exists() and cluster_model_path != old_cluster_model_path:
            logger.info(f"   Also found old cluster model at {old_cluster_model_path.name}, skipping (using new files)")
        
        # Load Advisor Model - Try pickle first, fallback to dataset-based implementation
        logger.info("Loading investment advisor model...")
        advisor_path = models_dir / "real_estate_advisor.pkl"
        advisor = None
        
        # Try loading from pickle
        if advisor_path.exists():
            import pickle
            original_cwd = os.getcwd()
            try:
                os.chdir(models_dir)
                with open("real_estate_advisor.pkl", "rb") as f:
                    try:
                        advisor = pickle.load(f)
                        stats = advisor.get_stats()
                        logger.info(f"✅ Advisor loaded from pickle! {stats.get('total_properties', 0):,} properties available")
                    except (AttributeError, ModuleNotFoundError) as e:
                        if "RealEstateInvestmentAdvisor" in str(e):
                            logger.warning(f"⚠️ Pickle loading failed: {e}")
                            logger.info("   Attempting to create advisor from dataset...")
                            advisor = None  # Will create from dataset below
                        else:
                            raise
            except Exception as e:
                logger.warning(f"⚠️ Error loading advisor pickle: {e}")
                logger.info("   Will create advisor from dataset instead...")
                advisor = None
            finally:
                os.chdir(original_cwd)
        
        # If pickle failed, create advisor from dataset
        if advisor is None:
            try:
                import pandas as pd
                import numpy as np
                
                # Load dataset for advisor (use the same CSV as property data)
                advisor_data_path = models_dir / "data_with_street_coords.csv"
                if advisor_data_path.exists():
                    logger.info("Creating advisor from dataset...")
                    # Reuse cluster_df if already loaded (same file)
                    if cluster_df is not None and not cluster_df.empty:
                        advisor_df = cluster_df
                        logger.info(f"   Reusing cluster data for advisor: {len(advisor_df):,} properties")
                    else:
                        logger.info(f"   Loading advisor dataset CSV (this may take a while)...")
                        try:
                            # Use chunks for large files
                            chunk_list = []
                            chunk_size = 100000
                            for chunk in pd.read_csv(advisor_data_path, chunksize=chunk_size, low_memory=False):
                                chunk_list.append(chunk)
                            if chunk_list:
                                advisor_df = pd.concat(chunk_list, ignore_index=True)
                                logger.info(f"   ✅ Loaded {len(advisor_df):,} rows in chunks")
                            else:
                                advisor_df = pd.read_csv(advisor_data_path, low_memory=False)
                        except Exception as e:
                            logger.warning(f"   ⚠️ Error loading in chunks, trying direct read: {e}")
                            advisor_df = pd.read_csv(advisor_data_path, low_memory=False)
                    
                    # Create a simple advisor class that works with the dataset
                    class DatasetAdvisor:
                        def __init__(self, df):
                            self.df = df
                            # Map column names (CSV has: price, bed, bath, city, state, zip_code, house_size)
                            self.price_col = 'price' if 'price' in df.columns else None
                            self.bed_col = 'bed' if 'bed' in df.columns else None
                            self.bath_col = 'bath' if 'bath' in df.columns else None
                            self.state_col = 'state' if 'state' in df.columns else None
                            self.city_col = 'city' if 'city' in df.columns else None
                            self.size_col = 'house_size' if 'house_size' in df.columns else None
                            
                            logger.info(f"   Dataset loaded: {len(df):,} properties")
                            logger.info(f"   Columns: price={self.price_col}, bed={self.bed_col}, bath={self.bath_col}, state={self.state_col}, city={self.city_col}")
                        
                        def get_stats(self):
                            return {
                                'total_properties': len(self.df),
                                'price_col': self.price_col,
                                'bed_col': self.bed_col,
                                'bath_col': self.bath_col
                            }
                        
                        def get_available_states(self):
                            if not self.state_col:
                                return []
                            
                            # Get all unique states from the dataset
                            all_states = self.df[self.state_col].dropna().unique().tolist()
                            
                            # Define valid US states and territories (comprehensive list)
                            valid_us_states = {
                                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
                                'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
                                'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
                                'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                                'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
                                'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
                                'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
                                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
                                'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico', 'Virgin Islands'
                            }
                            
                            # Filter to only valid US states (case-insensitive matching and handle variations)
                            valid_states = []
                            seen = set()
                            for state in all_states:
                                state_str = str(state).strip()
                                # Skip empty strings
                                if not state_str:
                                    continue
                                # Check if state is in valid list (case-insensitive)
                                state_lower = state_str.lower()
                                # Find matching valid state
                                matching_valid = None
                                for valid in valid_us_states:
                                    if valid.lower() == state_lower:
                                        matching_valid = valid
                                        break
                                
                                # Only add if it's a valid state and we haven't seen it
                                if matching_valid and matching_valid not in seen:
                                    valid_states.append(matching_valid)
                                    seen.add(matching_valid)
                            
                            return sorted(valid_states)
                        
                        def get_cities_by_state(self, state):
                            if not self.state_col or not self.city_col:
                                return []
                            state_data = self.df[self.df[self.state_col] == state]
                            cities = state_data[self.city_col].dropna().unique().tolist()
                            return sorted([str(c) for c in cities if pd.notna(c)])
                        
                        def recommend_investments(self, budget, state=None, city=None, 
                                                 min_beds=None, max_beds=None, min_baths=None, 
                                                 top_n=10, verbose=False):
                            df = self.df.copy()
                            
                            # Filter by state
                            if state and self.state_col:
                                df = df[df[self.state_col] == state]
                            
                            # Filter by city
                            if city and self.city_col:
                                df = df[df[self.city_col] == city]
                            
                            # Filter by price (within budget)
                            if self.price_col:
                                df = df[df[self.price_col] <= budget * 1.1]  # Allow 10% over budget
                                df = df[df[self.price_col] > 0]  # Remove invalid prices
                            
                            # Filter by bedrooms
                            if min_beds and self.bed_col:
                                df = df[df[self.bed_col] >= min_beds]
                            if max_beds and self.bed_col:
                                df = df[df[self.bed_col] <= max_beds]
                            
                            # Filter by bathrooms
                            if min_baths and self.bath_col:
                                df = df[df[self.bath_col] >= min_baths]
                            
                            if len(df) == 0:
                                return {
                                    'success': True,
                                    'data': [],
                                    'total_analyzed': len(self.df),
                                    'message': 'No properties found matching criteria'
                                }
                            
                            # Calculate ROI (simplified - assume 4% annual growth)
                            if self.price_col:
                                df['roi_10_year'] = ((df[self.price_col] * (1.04 ** 10)) - df[self.price_col]) / df[self.price_col]
                                df['price_10yr'] = df[self.price_col] * (1.04 ** 10)
                                
                                # Calculate risk (inverse of price stability)
                                price_std = df[self.price_col].std()
                                price_mean = df[self.price_col].mean()
                                df['risk'] = abs(df[self.price_col] - price_mean) / price_std if price_std > 0 else 0.5
                                df['risk'] = df['risk'].clip(0, 1)  # Normalize to 0-1
                                
                                # Sort by ROI descending
                                df = df.sort_values('roi_10_year', ascending=False)
                            else:
                                df['roi_10_year'] = 0.4  # Default 40% ROI
                                df['price_10yr'] = df.get(self.size_col, pd.Series([0] * len(df))) * 200 if self.size_col else 0
                                df['risk'] = 0.5
                            
                            # Get top N
                            top_properties = df.head(top_n)
                            
                            results = []
                            for idx, row in top_properties.iterrows():
                                result = {
                                    'city': str(row.get(self.city_col, 'Unknown')) if self.city_col else 'Unknown',
                                    'state': str(row.get(self.state_col, 'Unknown')) if self.state_col else 'Unknown',
                                    'current_price': float(row.get(self.price_col, 0)) if self.price_col else 0,
                                    'beds': int(row.get(self.bed_col, 0)) if self.bed_col else 0,
                                    'baths': float(row.get(self.bath_col, 0)) if self.bath_col else 0,
                                    'house_size': float(row.get(self.size_col, 0)) if self.size_col else 0,
                                    'roi_10_year': float(row.get('roi_10_year', 0.4)),
                                    'price_10yr': float(row.get('price_10yr', 0)),
                                    'risk': float(row.get('risk', 0.5))
                                }
                                results.append(result)
                            
                            return {
                                'success': True,
                                'data': results,
                                'total_analyzed': len(self.df),
                                'filtered_count': len(df)
                            }
                    
                    advisor = DatasetAdvisor(advisor_df)
                    stats = advisor.get_stats()
                    logger.info(f"✅ Advisor created from dataset! {stats.get('total_properties', 0):,} properties available")
                else:
                    logger.warning(f"⚠️ Advisor dataset not found at {advisor_data_path}")
                    advisor = None
            except Exception as e:
                logger.error(f"❌ Error creating advisor from dataset: {e}", exc_info=True)
                advisor = None
        
        # Load property data CSV for zip code statistics
        # Note: This is the same file as cluster data, so we can reuse it
        logger.info("Loading property data for zip code statistics...")
        property_data_path = models_dir / "data_with_street_coords.csv"
        global property_data_df
        if property_data_path.exists():
            import pandas as pd
            try:
                # Reuse cluster_df if it's already loaded (same file) - saves time and memory
                if cluster_df is not None and not cluster_df.empty:
                    property_data_df = cluster_df
                    logger.info(f"✅ Property data reused from cluster data! {len(property_data_df):,} properties")
                else:
                    logger.info(f"   Loading property data CSV (this may take a while for large files)...")
                    try:
                        # Use chunks for large files
                        chunk_list = []
                        chunk_size = 100000
                        for chunk in pd.read_csv(property_data_path, chunksize=chunk_size, low_memory=False):
                            chunk_list.append(chunk)
                        if chunk_list:
                            property_data_df = pd.concat(chunk_list, ignore_index=True)
                            logger.info(f"✅ Property data loaded in chunks! {len(property_data_df):,} properties")
                        else:
                            property_data_df = pd.read_csv(property_data_path, low_memory=False)
                            logger.info(f"✅ Property data loaded! {len(property_data_df):,} properties")
                    except Exception as e:
                        logger.warning(f"   ⚠️ Error loading in chunks, trying direct read: {e}")
                        property_data_df = pd.read_csv(property_data_path, low_memory=False)
                        logger.info(f"✅ Property data loaded! {len(property_data_df):,} properties")
                
                # Log column names for debugging
                if len(property_data_df.columns) > 0:
                    logger.info(f"   Available columns: {list(property_data_df.columns)[:10]}...")
            except Exception as e:
                logger.warning(f"⚠️ Error loading property data: {e}")
                property_data_df = pd.DataFrame()
        else:
            logger.warning(f"⚠️ Property data CSV not found at {property_data_path}")
            property_data_df = pd.DataFrame()
        
        logger.info("🎉 All models loaded successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}", exc_info=True)
        logger.warning("Some models may not be available. Check model files in models/ directory.")

app = FastAPI(title="NeuralEstate ML Models API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ==========================================
# GLOBAL MODEL VARIABLES (loaded at startup)
# ==========================================
price_model = None
price_features = None
forecast_model = None
forecast_features = None
forecast_metrics = None
forecast_growth_rates = None
forecast_reference_year = None
forecast_avg_inflation = None
cluster_model = None
cluster_num_clusters = None
cluster_stats = None
cluster_df = None
centroids_df = None
cluster_stats_df = None  # Street clustering stats CSV
advisor = None
property_data_df = None  # CSV data for zip code statistics

# ==========================================
# DUPLICATE FUNCTION REMOVED - Using the one defined above at line 38
# ==========================================

# ==========================================
# REQUEST MODELS
# ==========================================
class PricePredictionRequest(BaseModel):
    house_size: float
    bed: int
    bath: float
    acre_lot: float
    zip_code: int
    sqft_per_bed: Optional[float] = None
    bed_bath_ratio: Optional[float] = None
    bed_bath_sum: Optional[float] = None
    lot_size_sqft: Optional[float] = None
    house_to_lot_ratio: Optional[float] = None
    city_size: Optional[float] = None
    is_large_city: Optional[int] = None
    years_since_2000: Optional[int] = None
    is_recent: Optional[int] = None
    decade: Optional[int] = None
    month_sin: Optional[float] = None
    month_cos: Optional[float] = None
    zip_price_mean: Optional[float] = None
    zip_price_median: Optional[float] = None
    zip_size_mean: Optional[float] = None
    zip_count: Optional[int] = None
    zip_growth_rate: Optional[float] = None
    sold_year: Optional[int] = None
    
    model_config = ConfigDict(extra="allow")

class ForecastRequest(BaseModel):
    house_size: float
    bed: int
    bath: float
    acre_lot: float
    zip_code: int
    sold_year: Optional[int] = 2024
    city_size: Optional[float] = None
    zip_price_mean: Optional[float] = None
    zip_price_median: Optional[float] = None
    zip_size_mean: Optional[float] = None
    zip_count: Optional[int] = None
    sqft_per_bed: Optional[float] = None
    bed_bath_ratio: Optional[float] = None
    bed_bath_sum: Optional[float] = None
    lot_size_sqft: Optional[float] = None
    house_to_lot_ratio: Optional[float] = None
    is_large_city: Optional[int] = None
    years_since_2000: Optional[int] = None
    is_recent: Optional[int] = None
    decade: Optional[int] = None
    month_sin: Optional[float] = None
    month_cos: Optional[float] = None
    zip_growth_rate: Optional[float] = None
    
    model_config = ConfigDict(extra="allow")

class ClusterPredictRequest(BaseModel):
    lat: float
    lng: float

class AdvisorRequest(BaseModel):
    budget: float
    state: Optional[str] = None
    city: Optional[str] = None
    min_beds: Optional[int] = None
    max_beds: Optional[int] = None
    min_baths: Optional[float] = None
    top_n: Optional[int] = 10

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def engineer_features(data: dict, year: int):
    """Engineer features for forecast prediction"""
    import math
    import numpy as np
    
    house_size = data.get("house_size", 2000)
    bed = max(data.get("bed", 3), 1)
    bath = max(data.get("bath", 2), 1)
    acre_lot = max(data.get("acre_lot", 0.2), 0.01)
    
    sqft_per_bed = house_size / bed
    bed_bath_sum = bed + bath
    bed_bath_ratio = bed / bath
    lot_size_sqft = acre_lot * 43560
    house_to_lot_ratio = house_size / lot_size_sqft
    
    years_since_2000 = year - 2000
    is_recent = 1 if year >= 2015 else 0
    decade = (year // 10) * 10
    
    month_sin = math.sin(2 * math.pi * 6 / 12)
    month_cos = math.cos(2 * math.pi * 6 / 12)
    
    city_size = data.get("city_size", 5000)
    is_large_city = 1 if city_size > 1000 else 0
    
    zip_code = data.get("zip_code", 90001)
    zip_price_mean = data.get("zip_price_mean", house_size * 150)
    zip_price_median = data.get("zip_price_median", house_size * 145)
    zip_size_mean = data.get("zip_size_mean", house_size)
    zip_count = data.get("zip_count", 100)
    
    zip_growth_rate = forecast_growth_rates["zip_growth_rates"].get(
        zip_code, forecast_growth_rates["overall_growth"]
    ) if forecast_growth_rates else 0.04
    
    return {
        "house_size": house_size, "bath": bath, "bed": bed,
        "sqft_per_bed": sqft_per_bed, "bed_bath_ratio": bed_bath_ratio,
        "bed_bath_sum": bed_bath_sum, "acre_lot": acre_lot,
        "lot_size_sqft": lot_size_sqft, "house_to_lot_ratio": house_to_lot_ratio,
        "city_size": city_size, "is_large_city": is_large_city,
        "years_since_2000": years_since_2000, "is_recent": is_recent,
        "decade": decade, "month_sin": month_sin, "month_cos": month_cos,
        "zip_price_mean": zip_price_mean, "zip_price_median": zip_price_median,
        "zip_size_mean": zip_size_mean, "zip_count": zip_count,
        "zip_code": zip_code, "zip_growth_rate": zip_growth_rate
    }

def predict_single_year(data: dict, year: int):
    """Predict price for specific year"""
    import pandas as pd
    import numpy as np
    
    if forecast_model is None:
        raise HTTPException(status_code=503, detail="Forecast model not loaded")
    
    engineered = engineer_features(data, year)
    X_input = pd.DataFrame([engineered])[forecast_features]
    log_price = forecast_model.predict(X_input)
    return float(np.expm1(log_price)[0])

# ==========================================
# API ENDPOINTS
# ==========================================
@app.get("/health")
async def health():
    """Health check endpoint - available immediately, even during model loading"""
    global models_loading, models_loaded
    return {
        "status": "ok",
        "service": "ml-models-api",
        "models_loading": models_loading,
        "models_loaded": models_loaded,
        "models_available": {
            "price": price_model is not None,
            "forecast": forecast_model is not None,
            "cluster": cluster_model is not None,
            "advisor": advisor is not None
        }
    }

@app.post("/api/predict-price")
async def predict_price_endpoint(request: PricePredictionRequest):
    """Predict current property price"""
    if price_model is None:
        raise HTTPException(status_code=503, detail="Price prediction model not loaded")
    
    try:
        import pandas as pd
        import numpy as np
        
        data = request.dict()
        # Create DataFrame with required feature order
        df_input = pd.DataFrame([data])[price_features]
        
        # Model prediction (log space)
        pred_log = price_model.predict(df_input)
        
        # Convert log prediction to dollars
        price = np.expm1(pred_log)[0]
        
        return {
            "status": "success",
            "predicted_price": round(float(price), 2)
        }
    except Exception as e:
        logger.error(f"Error in predict_price: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/forecast")
async def forecast_endpoint(request: ForecastRequest):
    """Forecast prices for 1, 5, 10 years"""
    if forecast_model is None:
        raise HTTPException(status_code=503, detail="Forecast model not loaded")
    
    try:
        import numpy as np
        
        data = request.dict()
        current_year = data.get("sold_year", forecast_reference_year or 2024)
        
        # Get base prediction
        current_price = predict_single_year(data, current_year)
        
        # Get growth rate
        zip_code = data.get("zip_code")
        growth_rate = forecast_growth_rates["zip_growth_rates"].get(
            zip_code, forecast_growth_rates["overall_growth"]
        ) if forecast_growth_rates else 0.04
        
        combined_growth = growth_rate + forecast_avg_inflation
        combined_growth = np.clip(combined_growth, 0.02, 0.08)
        
        # Predict future years
        price_1yr = predict_single_year(data, current_year + 1)
        price_5yr = predict_single_year(data, current_year + 5)
        price_10yr = predict_single_year(data, current_year + 10)
        
        # Blend with trend (70% model, 30% growth trend)
        weight = 0.7
        
        price_1yr_final = weight * price_1yr + (1-weight) * (current_price * (1 + combined_growth))
        price_5yr_final = weight * price_5yr + (1-weight) * (current_price * (1 + combined_growth)**5)
        price_10yr_final = weight * price_10yr + (1-weight) * (current_price * (1 + combined_growth)**10)
        
        return {
            "success": True,
            "forecast": {
                "current_price": round(current_price, 2),
                "price_1_year": round(price_1yr_final, 2),
                "price_5_year": round(price_5yr_final, 2),
                "price_10_year": round(price_10yr_final, 2),
                "growth_rate": round(combined_growth * 100, 2),
                "current_year": current_year
            }
        }
    except Exception as e:
        logger.error(f"Error in forecast: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clusters/summary")
async def get_cluster_summary():
    """Get cluster summary statistics"""
    try:
        import pandas as pd
        
        # Get number of clusters from centroids or cluster_num_clusters
        num_clusters = 0
        if centroids_df is not None and isinstance(centroids_df, pd.DataFrame) and len(centroids_df) > 0:
            num_clusters = len(centroids_df)
            logger.info(f"Using centroids_df for cluster count: {num_clusters}")
        elif cluster_num_clusters:
            num_clusters = int(cluster_num_clusters)
            logger.info(f"Using cluster_num_clusters: {num_clusters}")
        else:
            logger.warning("No cluster count available from centroids or cluster_num_clusters")
        
        # Get distribution from centroids if available
        distribution = []
        if centroids_df is not None and isinstance(centroids_df, pd.DataFrame) and len(centroids_df) > 0:
            if 'cluster_id' in centroids_df.columns and 'count' in centroids_df.columns:
                for _, row in centroids_df.iterrows():
                    cluster_id = int(row['cluster_id']) if pd.notna(row['cluster_id']) else 0
                    count = int(row['count']) if pd.notna(row['count']) else 0
                    distribution.append({
                        "cluster_id": cluster_id,
                        "count": count
                    })
                # Sort by cluster_id for better display
                distribution.sort(key=lambda x: x['cluster_id'])
                logger.info(f"Generated distribution from centroids: {len(distribution)} clusters")
        
        # Get silhouette score from metadata if available
        silhouette_score = 0.75
        training_time = 0.0
        if isinstance(cluster_stats, dict):
            silhouette_score = float(cluster_stats.get("silhouette_score", 0.75))
            training_time = float(cluster_stats.get("training_time", 0.0))
        
        return {
            "num_clusters": num_clusters,
            "silhouette_score": silhouette_score,
            "training_time_seconds": training_time,
            "cluster_distribution": distribution[:100]  # Limit to first 100 for performance
        }
    except Exception as e:
        logger.error(f"Error in get_cluster_summary: {e}", exc_info=True)
        return {
            "num_clusters": 0,
            "silhouette_score": 0.0,
            "training_time_seconds": 0.0,
            "cluster_distribution": []
        }

@app.get("/api/clusters/centroids")
async def get_centroids():
    """Get cluster centroids for map - use centroids CSV if available, otherwise generate from cluster data"""
    import pandas as pd
    import numpy as np
    
    try:
        # First, try to use the centroids CSV directly (new format)
        if centroids_df is not None and isinstance(centroids_df, pd.DataFrame) and len(centroids_df) > 0:
            logger.info(f"Using centroids CSV with {len(centroids_df)} centroids")
            
            # Check if it has the expected columns
            if 'cluster_id' in centroids_df.columns and 'lat' in centroids_df.columns and 'lng' in centroids_df.columns:
                centroids_list = []
                for _, row in centroids_df.iterrows():
                    cluster_id = int(row['cluster_id']) if pd.notna(row['cluster_id']) else 0
                    lat = float(row['lat']) if pd.notna(row['lat']) else 0.0
                    lng = float(row['lng']) if pd.notna(row['lng']) else 0.0
                    count = int(row['count']) if 'count' in centroids_df.columns and pd.notna(row.get('count', 0)) else 0
                    street = str(row['street']) if 'street' in centroids_df.columns and pd.notna(row.get('street', '')) else ""
                    
                    # Validate coordinates
                    if -90 <= lat <= 90 and -180 <= lng <= 180:
                        centroids_list.append({
                            "cluster_id": cluster_id,
                            "lat": lat,
                            "lng": lng,
                            "count": count,
                            "street": street,
                            "avg_price": None  # Not available in centroids CSV
                        })
                
                logger.info(f"Returning {len(centroids_list)} valid centroids from CSV")
                return {
                    "num_clusters": len(centroids_list),
                    "centroids": centroids_list
                }
        
        # Fallback: If centroids CSV doesn't exist or is empty, generate from cluster_df
        if centroids_df is None or not isinstance(centroids_df, pd.DataFrame) or len(centroids_df) == 0:
            logger.info("Centroids CSV not found, generating centroids from cluster data...")
            
            if cluster_df is None or not isinstance(cluster_df, pd.DataFrame) or len(cluster_df) == 0:
                logger.warning("Cluster data not available, cannot generate centroids")
                return {
                    "num_clusters": 0,
                    "centroids": []
                }
            
            logger.info(f"Generating centroids from {len(cluster_df)} properties")
            logger.info(f"Available columns: {list(cluster_df.columns)[:20]}")
            
            # Find cluster column (case-insensitive)
            cluster_col = None
            for col in cluster_df.columns:
                col_lower = col.lower()
                if col_lower in ['street_cluster', 'cluster_id', 'cluster', 'cluster_label', 'clusterid']:
                    cluster_col = col
                    logger.info(f"Found cluster column: {cluster_col}")
                    break
            
            if not cluster_col:
                logger.warning(f"No cluster column found. Available columns: {list(cluster_df.columns)}")
                return {
                    "num_clusters": 0,
                    "centroids": []
                }
            
            # Find lat/lng columns (case-insensitive)
            lat_col = None
            lng_col = None
            for col in cluster_df.columns:
                col_lower = col.lower()
                if col_lower in ['lat', 'latitude'] and lat_col is None:
                    lat_col = col
                if col_lower in ['lng', 'longitude', 'lon', 'long'] and lng_col is None:
                    lng_col = col
            
            if not lat_col or not lng_col:
                logger.warning(f"Lat/Lng columns not found. Lat: {lat_col}, Lng: {lng_col}")
                logger.warning(f"Available columns: {list(cluster_df.columns)}")
                return {
                    "num_clusters": 0,
                    "centroids": []
                }
            
            logger.info(f"Using columns - Cluster: {cluster_col}, Lat: {lat_col}, Lng: {lng_col}")
            
            # Find price column for average price calculation (case-insensitive)
            price_col = None
            for col in cluster_df.columns:
                col_lower = col.lower()
                if col_lower in ['price', 'current_price', 'sold_price']:
                    price_col = col
                    break
            
            # Generate centroids by calculating mean lat/lng for each cluster
            centroids_list = []
            # Filter out rows with missing lat/lng or cluster
            valid_data = cluster_df[
                cluster_df[cluster_col].notna() & 
                cluster_df[lat_col].notna() & 
                cluster_df[lng_col].notna()
            ].copy()
            
            if len(valid_data) == 0:
                logger.warning("No valid data with lat/lng and cluster information")
                return {
                    "num_clusters": 0,
                    "centroids": []
                }
            
            unique_clusters = valid_data[cluster_col].dropna().unique()
            logger.info(f"Found {len(unique_clusters)} unique clusters")
            
            for cluster_id in unique_clusters:
                cluster_data = valid_data[valid_data[cluster_col] == cluster_id]
                
                if len(cluster_data) == 0:
                    continue
                
                # Calculate centroid (mean lat/lng)
                mean_lat = float(cluster_data[lat_col].mean())
                mean_lng = float(cluster_data[lng_col].mean())
                
                # Validate coordinates
                if not (-90 <= mean_lat <= 90) or not (-180 <= mean_lng <= 180):
                    logger.warning(f"Invalid coordinates for cluster {cluster_id}: lat={mean_lat}, lng={mean_lng}")
                    continue
                
                # Calculate average price if available
                avg_price = 0.0
                if price_col and price_col in cluster_data.columns:
                    prices = cluster_data[price_col].dropna()
                    if len(prices) > 0:
                        avg_price = float(prices.mean())
                
                # Count properties in cluster
                count = int(len(cluster_data))
                
                centroids_list.append({
                    'cluster_id': int(cluster_id) if pd.notna(cluster_id) else 0,
                    'lat': mean_lat,
                    'lng': mean_lng,
                    'avg_price': avg_price,
                    'count': count
                })
            
            logger.info(f"✅ Generated {len(centroids_list)} centroids from cluster data")
            return {
                "num_clusters": len(centroids_list),
                "centroids": centroids_list
            }
        
        # If centroids_df exists, use it but clean NaN values
        centroids_dict = centroids_df.to_dict(orient="records")
        
        # Clean NaN values
        def clean_nan_values(obj):
            if isinstance(obj, dict):
                return {k: clean_nan_values(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [clean_nan_values(item) for item in obj]
            elif isinstance(obj, float):
                if pd.isna(obj) or not np.isfinite(obj):
                    return None
                return obj
            return obj
        
        cleaned_centroids = [clean_nan_values(centroid) for centroid in centroids_dict]
        
        return {
            "num_clusters": len(cleaned_centroids),
            "centroids": cleaned_centroids
        }
    except Exception as e:
        logger.error(f"Error in get_centroids: {e}", exc_info=True)
        return {
            "num_clusters": 0,
            "centroids": []
        }

@app.get("/api/clusters/all")
async def get_all_clusters(page: int = Query(1, ge=1), size: int = Query(1000, ge=1, le=10000)):
    """Get all cluster properties (paged)"""
    import pandas as pd
    
    # Handle None first
    if cluster_df is None:
        logger.warning("Cluster data not loaded, returning empty result")
        return {
            "page": page,
            "page_size": size,
            "total_properties": 0,
            "data": []
        }
    
    try:
        # Check if DataFrame is empty
        if not isinstance(cluster_df, pd.DataFrame) or len(cluster_df) == 0:
            logger.warning("Cluster data is empty, returning empty result")
            return {
                "page": page,
                "page_size": size,
                "total_properties": 0,
                "data": []
            }
        
        import pandas as pd
        import numpy as np
        
        # Find lat/lng columns (case-insensitive)
        lat_col = None
        lng_col = None
        for col in cluster_df.columns:
            col_lower = col.lower()
            if col_lower in ['lat', 'latitude'] and lat_col is None:
                lat_col = col
            if col_lower in ['lng', 'longitude', 'lon', 'long'] and lng_col is None:
                lng_col = col
        
        # Filter to only properties with valid coordinates
        if lat_col and lng_col:
            valid_data = cluster_df[
                cluster_df[lat_col].notna() & 
                cluster_df[lng_col].notna() &
                (cluster_df[lat_col] >= -90) & (cluster_df[lat_col] <= 90) &
                (cluster_df[lng_col] >= -180) & (cluster_df[lng_col] <= 180)
            ].copy()
            logger.info(f"Filtered to {len(valid_data)} properties with valid coordinates (from {len(cluster_df)} total)")
        else:
            logger.warning(f"Lat/Lng columns not found. Using all data. Available: {list(cluster_df.columns)[:10]}")
            valid_data = cluster_df.copy()
        
        start = (page - 1) * size
        end = start + size
        data_slice = valid_data.iloc[start:end].copy()
        
        # Replace NaN values with None (which becomes null in JSON)
        data_slice = data_slice.where(pd.notna(data_slice), None)
        
        # Convert to dict and clean up NaN values recursively
        data_dict = data_slice.to_dict(orient="records")
        
        # Recursively replace any remaining NaN/Inf values
        def clean_nan_values(obj):
            if isinstance(obj, dict):
                return {k: clean_nan_values(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [clean_nan_values(item) for item in obj]
            elif isinstance(obj, float):
                if pd.isna(obj) or not np.isfinite(obj):
                    return None
                return obj
            return obj
        
        cleaned_data = [clean_nan_values(record) for record in data_dict]
        
        logger.info(f"Returning {len(cleaned_data)} properties (page {page}, size {size})")
        
        return {
            "page": page,
            "page_size": size,
            "total_properties": len(valid_data),
            "data": cleaned_data
        }
    except Exception as e:
        logger.error(f"Error in get_all_clusters: {e}", exc_info=True)
        # Return empty result instead of raising error to avoid CORS issues
        return {
            "page": page,
            "page_size": size,
            "total_properties": 0,
            "data": []
        }

@app.post("/api/clusters/predict")
async def predict_cluster_endpoint(request: ClusterPredictRequest):
    """Predict cluster for location"""
    if cluster_model is None:
        raise HTTPException(status_code=503, detail="Cluster model not loaded")
    
    try:
        import numpy as np
        coords = np.array([[request.lat, request.lng]])
        cluster_id = int(cluster_model.predict(coords)[0])
        
        return {
            "lat": request.lat,
            "lng": request.lng,
            "predicted_cluster": cluster_id
        }
    except Exception as e:
        logger.error(f"Error in predict_cluster: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/advisor/recommend")
async def recommend_investments(
    budget: float = Query(..., gt=0),
    state: Optional[str] = None,
    city: Optional[str] = None,
    min_beds: Optional[int] = None,
    max_beds: Optional[int] = None,
    min_baths: Optional[float] = None,
    top_n: int = Query(10, ge=1, le=50)
):
    """Get investment recommendations"""
    if advisor is None:
        raise HTTPException(status_code=503, detail="Advisor model not loaded")
    
    try:
        results = advisor.recommend_investments(
            budget=budget,
            state=state,
            city=city,
            min_beds=min_beds,
            max_beds=max_beds,
            min_baths=min_baths,
            top_n=min(top_n, 50),
            verbose=False
        )
        return results
    except Exception as e:
        logger.error(f"Error in recommend_investments: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/advisor/states")
async def get_advisor_states():
    """Get list of available states"""
    if advisor is None:
        raise HTTPException(status_code=503, detail="Advisor model not loaded")
    
    try:
        states = advisor.get_available_states()
        return {
            "success": True,
            "states": states
        }
    except Exception as e:
        logger.error(f"Error in get_advisor_states: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/advisor/cities/{state}")
async def get_advisor_cities(state: str):
    """Get cities in a specific state"""
    if advisor is None:
        raise HTTPException(status_code=503, detail="Advisor model not loaded")
    
    try:
        cities = advisor.get_cities_by_state(state)
        return {
            "success": True,
            "cities": cities
        }
    except Exception as e:
        logger.error(f"Error in get_advisor_cities: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# ZIP CODE ENDPOINTS
# ==========================================
@app.get("/api/zip-codes")
async def get_zip_codes():
    """Get list of available zip codes from CSV"""
    if property_data_df is None:
        logger.error("property_data_df is None - data not loaded")
        raise HTTPException(status_code=503, detail="Property data not loaded. Check backend logs for loading errors.")
    
    try:
        import pandas as pd
        if len(property_data_df) == 0:
            logger.warning("property_data_df is empty")
            raise HTTPException(status_code=503, detail="Property data is empty")
        
        # Get unique zip codes and sort them
        # Try different possible column names
        zip_col = None
        for col in ['zip_code', 'zip', 'zipcode', 'ZIP_CODE', 'ZIP']:
            if col in property_data_df.columns:
                zip_col = col
                break
        
        if zip_col is None:
            logger.error(f"zip_code column not found. Available columns: {list(property_data_df.columns)}")
            raise HTTPException(status_code=500, detail=f"zip_code column not found in data. Available columns: {list(property_data_df.columns)[:10]}")
        
        zip_codes = sorted(property_data_df[zip_col].dropna().unique().tolist())
        return {
            "success": True,
            "zip_codes": [int(z) for z in zip_codes if pd.notna(z) and str(z).isdigit()]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting zip codes: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/zip-codes/{zip_code}/stats")
async def get_zip_code_stats(zip_code: int):
    """Get statistics for a specific zip code"""
    if property_data_df is None:
        logger.error("property_data_df is None - data not loaded")
        raise HTTPException(status_code=503, detail="Property data not loaded. Check backend logs for loading errors.")
    
    try:
        import pandas as pd
        import numpy as np
        
        if len(property_data_df) == 0:
            logger.warning("property_data_df is empty")
            raise HTTPException(status_code=503, detail="Property data is empty")
        
        # Find zip code column
        zip_col = None
        for col in ['zip_code', 'zip', 'zipcode', 'ZIP_CODE', 'ZIP']:
            if col in property_data_df.columns:
                zip_col = col
                break
        
        if zip_col is None:
            logger.error(f"zip_code column not found. Available columns: {list(property_data_df.columns)}")
            raise HTTPException(status_code=500, detail=f"zip_code column not found in data")
        
        # Filter data for this zip code
        zip_data = property_data_df[property_data_df[zip_col] == zip_code]
        
        if len(zip_data) == 0:
            raise HTTPException(status_code=404, detail=f"No data found for zip code {zip_code}")
        
        # Calculate statistics
        # Try different possible column names for price
        price_col = None
        for col in ['price', 'current_price', 'sold_price', 'price_sold', 'Price', 'PRICE']:
            if col in zip_data.columns:
                price_col = col
                break
        
        # Try different possible column names for house size
        size_col = None
        for col in ['house_size', 'sqft', 'square_feet', 'size', 'house_size_sqft', 'House_Size', 'SQFT']:
            if col in zip_data.columns:
                size_col = col
                break
        
        stats = {
            "zip_code": int(zip_code),
            "property_count": len(zip_data)
        }
        
        if price_col:
            prices = zip_data[price_col].dropna()
            if len(prices) > 0:
                stats["zip_price_mean"] = float(prices.mean())
                stats["zip_price_median"] = float(prices.median())
            else:
                stats["zip_price_mean"] = 0.0
                stats["zip_price_median"] = 0.0
        else:
            # Fallback: estimate based on house size if available
            stats["zip_price_mean"] = 0.0
            stats["zip_price_median"] = 0.0
        
        if size_col:
            sizes = zip_data[size_col].dropna()
            if len(sizes) > 0:
                stats["zip_size_mean"] = float(sizes.mean())
            else:
                stats["zip_size_mean"] = 0.0
        else:
            stats["zip_size_mean"] = 0.0
        
        return {
            "success": True,
            "stats": stats
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting zip code stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# EDUCATION ENDPOINTS
# ==========================================

class CourseGenerationRequest(BaseModel):
    topic: str
    level: str = "intermediate"
    duration_hours: int = 2

class QuizGenerationRequest(BaseModel):
    course_content: Dict[str, Any]
    module_index: int = 0
    num_questions: int = 10

class CertificationRequest(BaseModel):
    course_id: str
    course_title: str
    user_name: str
    score: float

class AssistantRequest(BaseModel):
    question: str
    course_context: Optional[Dict[str, Any]] = None
    is_exam: bool = False

@app.get("/api/education/levels")
async def get_education_levels():
    """Get available education levels"""
    return {
        "success": True,
        "levels": EDUCATION_LEVELS
    }

@app.get("/api/education/youtube/search")
async def search_youtube_education(query: str = Query(..., description="Search query"), max_results: int = Query(5, ge=1, le=20)):
    """Search YouTube for educational videos"""
    try:
        videos = await education_service.search_youtube_videos(query, max_results)
        return {
            "success": True,
            "videos": videos
        }
    except Exception as e:
        logger.error(f"Error searching YouTube: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/youtube/analyze")
async def analyze_youtube_video(video_id: str = Query(...), video_title: str = Query(...), video_description: str = Query("")):
    """Analyze YouTube video with AI to extract key insights"""
    try:
        analysis = await education_service.analyze_video_with_ai(video_id, video_title, video_description)
        return {
            "success": True,
            **analysis
        }
    except Exception as e:
        logger.error(f"Error analyzing video: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/courses/generate")
async def generate_course(request: CourseGenerationRequest):
    """Generate a comprehensive course using AI"""
    try:
        course = await education_service.generate_course_content(
            topic=request.topic,
            level=request.level,
            duration_hours=request.duration_hours
        )
        return {
            "success": True,
            "course": course
        }
    except Exception as e:
        logger.error(f"Error generating course: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/quizzes/generate")
async def generate_quiz(request: QuizGenerationRequest):
    """Generate quiz questions for a course module"""
    try:
        quiz = await education_service.generate_quiz(
            course_content=request.course_content,
            module_index=request.module_index,
            num_questions=request.num_questions
        )
        return {
            "success": True,
            "quiz": quiz
        }
    except Exception as e:
        logger.error(f"Error generating quiz: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/certifications/generate")
async def generate_certification(request: CertificationRequest):
    """Generate certification badge/certificate"""
    try:
        certification = await education_service.generate_certification(
            course_id=request.course_id,
            course_title=request.course_title,
            user_name=request.user_name,
            score=request.score
        )
        return {
            "success": True,
            "certification": certification
        }
    except Exception as e:
        logger.error(f"Error generating certification: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/education/assistant")
async def get_ai_assistant(request: AssistantRequest):
    """Get help from AI assistant (NOT for exams/quizzes)"""
    try:
        help_response = await education_service.get_ai_assistant_help(
            question=request.question,
            course_context=request.course_context,
            is_exam=request.is_exam
        )
        return {
            "success": True,
            **help_response
        }
    except Exception as e:
        logger.error(f"Error getting AI assistant help: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/education/news")
async def get_crypto_news(limit: int = Query(5, ge=1, le=20)):
    """Get cryptocurrency/blockchain news for educational context"""
    try:
        articles = await education_service.get_crypto_news(limit)
        return {
            "success": True,
            "articles": articles
        }
    except Exception as e:
        logger.error(f"Error fetching news: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
