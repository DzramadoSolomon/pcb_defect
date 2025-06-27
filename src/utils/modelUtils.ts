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

// Load the Keras model from public folder
export const loadModel = async (): Promise<tf.LayersModel> => {
  if (model) return model;
  
  try {
    // Load model from public/model/ folder
    model = await tf.loadLayersModel('/model/model.json');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load the PCB defect detection model');
  }
};

// Image preprocessing function
export const preprocessImage = async (file: File): Promise<tf.Tensor4D> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
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
      const tensor = tf.browser.fromPixels(imageData)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims(0) as tf.Tensor4D;
      
      resolve(tensor);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Real model prediction function
export const predictDefect = async (file: File): Promise<{ prediction: string; confidence: number }> => {
  try {
    // Load model if not already loaded
    const loadedModel = await loadModel();
    
    // Preprocess image
    const imageTensor = await preprocessImage(file);
    
    // Make prediction
    const prediction = loadedModel.predict(imageTensor) as tf.Tensor;
    const probabilities = await prediction.data();
    
    // Find class with highest probability
    const maxIndex = Array.from(probabilities).indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIndex];
    
    // Clean up tensors
    imageTensor.dispose();
    prediction.dispose();
    
    return {
      prediction: PCB_DEFECT_CLASSES[maxIndex],
      confidence: confidence
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to analyze the image');
  }
};