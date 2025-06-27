import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { predictDefect } from '@/utils/modelUtils';

interface TestPageProps {
  onBack: () => void;
}

interface PredictionResult {
  id: string;
  file: File;
  imageUrl: string;
  prediction: string;
  confidence: number;
  processing: boolean;
}

const TestPage: React.FC<TestPageProps> = ({ onBack }) => {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList) => {
    const newResults: PredictionResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        continue;
      }

      const imageUrl = URL.createObjectURL(file);
      const result: PredictionResult = {
        id: `${Date.now()}-${i}`,
        file,
        imageUrl,
        prediction: '',
        confidence: 0,
        processing: true
      };
      
      newResults.push(result);
    }
    
    setResults(prev => [...prev, ...newResults]);
    
    // Process each image sequentially
    for (const result of newResults) {
      try {
        const prediction = await predictDefect(result.file);
        
        setResults(prev => prev.map(r => 
          r.id === result.id 
            ? { ...r, ...prediction, processing: false }
            : r
        ));
        
        toast({
          title: "Analysis Complete",
          description: `${result.file.name}: ${prediction.prediction.replace('_', ' ')}`,
        });
      } catch (error) {
        setResults(prev => prev.map(r => 
          r.id === result.id 
            ? { ...r, prediction: 'Error', confidence: 0, processing: false }
            : r
        ));
        
        toast({
          title: "Analysis Failed",
          description: `Failed to analyze ${result.file.name}. Make sure the model is uploaded.`,
          variant: "destructive"
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearResults = () => {
    results.forEach(result => URL.revokeObjectURL(result.imageUrl));
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="mb-4 hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                PCB Defect Analysis
              </h1>
              <p className="text-gray-600">
                Upload PCB images to detect defects using the trained Keras model
              </p>
            </div>
            
            {results.length > 0 && (
              <Button 
                onClick={clearResults}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear Results
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-purple-500 bg-purple-50 scale-105' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-4 text-gray-700">
                Drag & drop PCB images here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports: JPG, PNG, GIF • Multiple files allowed
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Analysis Results ({results.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Card key={result.id} className="overflow-hidden shadow-lg border-0 transform hover:scale-105 transition-all duration-200">
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={result.imageUrl} 
                      alt={result.file.name}
                      className="w-full h-full object-cover"
                    />
                    {result.processing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Analyzing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-3 truncate text-gray-700">
                      {result.file.name}
                    </h3>
                    {!result.processing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Detected:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            result.prediction === 'Error' 
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {result.prediction.replace('_', ' ')}
                          </span>
                        </div>
                        {result.confidence > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <span className="text-xs font-semibold text-green-600">
                              {(result.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;