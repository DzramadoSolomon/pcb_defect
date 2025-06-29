# PCB Defect Detection Web App

A React-based web application that uses a trained Keras model to detect 6 types of PCB (Printed Circuit Board) defects from uploaded images.

## Features

- **Real-time PCB Defect Detection**: Upload single or multiple PCB images for analysis
- **6 Defect Types Supported**:
  - Missing_hole
  - Mouse_bite
  - Open_circuit
  - Short
  - Spur
  - Spurious_copper
- **Modern UI**: Clean, responsive design with drag-and-drop functionality
- **Real-time Results**: See predictions with confidence scores
- **Batch Processing**: Analyze multiple images simultaneously

## Model Integration

### Setting Up Your Keras Model

1. **Convert your Keras model to TensorFlow.js format**:
   ```bash
   # Install tensorflowjs converter
   pip install tensorflowjs
   
   # Convert your saved_model.keras to TensorFlow.js format
   tensorflowjs_converter --input_format=keras \
                         --output_format=tfjs_layers_model \
                         path/to/your/saved_model.keras \
                         public/model/
   ```

2. **Place model files in the correct directory**:
   ```
   public/
   └── model/
       ├── model.json          # Model architecture
       ├── group1-shard1of24.bin
       ├── group1-shard2of24.bin
       ├── ... (all weight files)
       └── group1-shard24of24.bin
   ```

### Current Model Files

Based on your GitHub repo, you already have:
- `model.json` - Model architecture and metadata
- Multiple `.bin` files (group1-shard1of24.bin to group1-shard24of24.bin) - Model weights

These files are correctly placed in `public/model/` and the app is configured to load them automatically.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd pcb-defect-detection
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Ensure model files are in place**:
   - Your model files should be in `public/model/`
   - The app will automatically detect and load them

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:5173`
   - Click "Run a Test" to start analyzing PCB images

## Usage

1. **Home Page**: Click the animated "Run a Test" button
2. **Upload Images**: 
   - Drag and drop PCB images onto the upload area
   - Or click "Choose Files" to browse and select images
   - Supports JPG, PNG, GIF formats
3. **View Results**: 
   - Each image will be processed sequentially
   - Results show the detected defect type and confidence score
   - Multiple images can be processed in batch

## Technical Details

### Model Requirements
- **Input**: 224x224 RGB images
- **Output**: 6-class classification (softmax)
- **Format**: TensorFlow.js Layers Model

### Image Preprocessing
- Automatic resizing to 224x224 pixels
- Normalization to [0, 1] range
- RGB channel extraction

### Supported Browsers
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Model Loading Issues
1. **Check browser console** for detailed error messages
2. **Verify model files** are in `public/model/` directory
3. **Ensure model.json exists** and is valid JSON
4. **Check network tab** for failed file requests

### Common Errors
- "Model files not found": Ensure all .bin files are present
- "Failed to load model": Check model.json format and file paths
- "Prediction failed": Verify image format and model compatibility

### Performance Tips
- Use Chrome for best TensorFlow.js performance
- Smaller images load faster (will be resized to 224x224 anyway)
- Process images in smaller batches for better responsiveness

## Development

### Project Structure
```
src/
├── components/
│   ├── HomePage.tsx        # Landing page with navigation
│   ├── TestPage.tsx        # Main analysis interface
│   └── ui/                 # Reusable UI components
├── utils/
│   └── modelUtils.ts       # TensorFlow.js model handling
└── lib/
    └── utils.ts            # Utility functions
```

### Key Files
- `src/utils/modelUtils.ts`: Model loading and prediction logic
- `src/components/TestPage.tsx`: Main upload and analysis interface
- `public/model/`: Directory containing your trained model files

## Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **TensorFlow.js** - Machine learning in the browser
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Shadcn/ui** - UI components

## Footer

Designed by SKD

---

**Note**: This app uses your actual trained Keras model for predictions. No simulated results - all classifications come from your uploaded model files.
