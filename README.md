# PCB Defect Detector

A web application that uses a trained Keras model to detect 6 types of PCB (Printed Circuit Board) defects from uploaded images.

## Features

- Upload single or multiple PCB images
- Real-time defect detection using TensorFlow.js
- Detects 6 defect types:
  - Missing_hole
  - Mouse_bite
  - Open_circuit
  - Short
  - Spur
  - Spurious_copper
- Modern, responsive UI with drag-and-drop support
- Confidence scores for predictions

## Model Integration

### How to Add Your Keras Model

1. **Convert your Keras model to TensorFlow.js format:**
   ```bash
   tensorflowjs_converter --input_format=keras /path/to/saved_model.keras /path/to/output/directory
   ```

2. **Create the model folder structure:**
   ```
   public/
   └── model/
       ├── model.json
       └── model_weights.bin (or multiple .bin files)
   ```

3. **Place your converted model files:**
   - Copy `model.json` to `public/model/model.json`
   - Copy all `.bin` weight files to `public/model/`

### Model Requirements

- **Input Shape:** 224x224x3 (RGB images)
- **Output:** 6 classes (softmax probabilities)
- **Classes Order:** Missing_hole, Mouse_bite, Open_circuit, Short, Spur, Spurious_copper

### From Your Image

Based on your model structure, you need to upload:
- The `saved_model.keras` file (convert it first)
- Or the individual files from the SavedModel format if available

## Installation

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add your model files** to `public/model/` (see Model Integration above)
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser
2. Click "Run a Test" on the home page
3. Upload PCB images via drag-and-drop or file browser
4. View real-time analysis results with confidence scores

## Technical Details

- **Frontend:** React + TypeScript + Tailwind CSS
- **ML Framework:** TensorFlow.js
- **Model Format:** TensorFlow.js (converted from Keras)
- **Image Processing:** Canvas API for preprocessing
- **Build Tool:** Vite

## No More Simulated Results

The application now uses your actual trained model for predictions instead of simulated results. Make sure to:
1. Convert your `saved_model.keras` to TensorFlow.js format
2. Place the converted files in `public/model/`
3. The model will be automatically loaded when making predictions

---

**Designed by SKD**