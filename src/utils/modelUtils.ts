import * as tf from '@tensorflow/tfjs';

// PCB Defect Classes
export const PCB_DEFECT_CLASSES = [
  'Missing_hole',
  'Mouse_bite', 
  'Open_circuit',
  'Short',
  'Spur',
  'Spurious_copper'
];

// Global model variable
let model: tf.LayersModel | null = null;
let modelLoading = false;

// Check if model files exist
const checkModelFiles = async (): Promise<boolean> => {
  try {
    const response = await fetch('/model/model.json');
    return response.ok;
  } catch (error) {
    console.error('Model files not found:', error);
    return false;
  }
};

// Load the Keras model from public folder
export const loadModel = async (): Promise<tf.LayersModel> => {
  if (model) return model;
  
  if (modelLoading) {
    // Wait for existing load to complete
    while (modelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (model) return model;
  }
  
  modelLoading = true;
  
  try {
    // First check if model files exist
    const filesExist = await checkModelFiles();
    if (!filesExist) {
      throw new Error('Model files not found. Please ensure model.json and weight files are in public/model/ folder.');
    }
    
    console.log('Loading model from /model/model.json...');
    
    // Set TensorFlow.js backend
    await tf.ready();
    
    // Load model with explicit path
    model = await tf.loadLayersModel('/model/model.json');
    
    console.log('Model loaded successfully');
    console.log('Model input shape:', model.inputs[0].shape);
    console.log('Model output shape:', model.outputs[0].shape);
    
    modelLoading = false;
    return model;
  } catch (error) {
    modelLoading = false;
    console.error('Failed to load model:', error);
    throw new Error(`Failed to load the PCB defect detection model: ${error.message}`);
  }
};

// Image preprocessing function
export const preprocessImage = async (file: File): Promise<tf.Tensor4D> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Resize to 224x224 as required by the model
        canvas.width = 224;
        canvas.height = 224;
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw and resize image
        ctx.drawImage(img, 0, 0, 224, 224);
        
        // Get image data and convert to tensor
        const imageData = ctx.getImageData(0, 0, 224, 224);
        
        // Convert to tensor and normalize
        const tensor = tf.browser.fromPixels(imageData, 3)
          .toFloat()
          .div(255.0)
          .expandDims(0) as tf.Tensor4D;
        
        console.log('Preprocessed image tensor shape:', tensor.shape);
        resolve(tensor);
      } catch (error) {
        reject(new Error(`Image preprocessing failed: ${error.message}`));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Real model prediction function
export const predictDefect = async (file: File): Promise<{ prediction: string; confidence: number }> => {
  try {
    console.log('Starting prediction for:', file.name);
    
    // Load model if not already loaded
    const loadedModel = await loadModel();
    
    // Preprocess image
    const imageTensor = await preprocessImage(file);
    
    console.log('Making prediction...');
    
    // Make prediction
    const prediction = loadedModel.predict(imageTensor) as tf.Tensor;
    const probabilities = await prediction.data();
    
    console.log('Raw probabilities:', Array.from(probabilities));
    
    // Find class with highest probability
    const maxIndex = Array.from(probabilities).indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIndex];
    
    console.log('Predicted class index:', maxIndex);
    console.log('Predicted class:', PCB_DEFECT_CLASSES[maxIndex]);
    console.log('Confidence:', confidence);
    
    // Clean up tensors
    imageTensor.dispose();
    prediction.dispose();
    
    return {
      prediction: PCB_DEFECT_CLASSES[maxIndex],
      confidence: confidence
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error(`Failed to analyze the image: ${error.message}`);
  }
};
