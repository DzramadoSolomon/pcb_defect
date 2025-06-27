import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Upload, CheckCircle } from 'lucide-react';

interface HomePageProps {
  onRunTest: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onRunTest }) => {
  const defectTypes = [
    'Missing Hole', 'Mouse Bite', 'Open Circuit', 
    'Short', 'Spur', 'Spurious Copper'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                PCB Defect Detector
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Welcome to the PCB Defect Detection Portal - Advanced AI-powered analysis for circuit board quality control
              </p>
            </div>
            
            {/* Sample Image */}
            <div className="mb-12 relative">
              <div className="relative mx-auto max-w-md">
                <img 
                  src="https://d64gsuwffb70l.cloudfront.net/685484d8e84ab85304f84b04_1750984265398_5820f729.png" 
                  alt="PCB Sample" 
                  className="w-full rounded-xl shadow-2xl border-4 border-white"
                />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    AI Ready
                  </Badge>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <Upload className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-800 mb-2">Easy Upload</h3>
                <p className="text-sm text-gray-600">Drag & drop or browse multiple PCB images</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <Brain className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">Trained Keras model with 224x224 input processing</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Zap className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-800 mb-2">Fast Results</h3>
                <p className="text-sm text-gray-600">Real-time defect classification with confidence scores</p>
              </div>
            </div>

            {/* Defect Types */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Detectable Defect Types:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {defectTypes.map((defect, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200"
                  >
                    {defect}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button 
                onClick={onRunTest}
                className="px-12 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl animate-pulse hover:animate-none"
                size="lg"
              >
                <Zap className="w-6 h-6 mr-3" />
                🚀 Run a Test
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Upload your PCB images and get instant AI-powered defect analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          Designed by SKD
        </Badge>
      </div>
    </div>
  );
};

export default HomePage;