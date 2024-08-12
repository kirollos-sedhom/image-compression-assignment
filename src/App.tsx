import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [compressionRate, setCompressionRate] = useState<number>(70);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);

    }
  };

  const handleCompressionRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompressionRate(Number(event.target.value));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: compressionRate === 100 ? 0.01 : (100 - compressionRate) / 100, // this means i need to invert the compression rate
    };

    try {
        const compressedBlob = await imageCompression(selectedFile, options);
        setCompressedFile(compressedBlob);
        console.log("compressed file: ", compressedBlob)
    } catch (error) {
        console.error('Image compression error:', error);
    } finally {
        setLoading(false);
    }
};



  const downloadCompressedImage = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${selectedFile?.name}`;
    link.click();
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1>Image Compressor</h1>
      </div>

      <div className="card p-4">
        <div className="mb-3">
          <label htmlFor="fileInput" className="form-label">Upload Image</label>
          <input 
            type="file" 
            className="form-control" 
            id="fileInput" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>

        {selectedFile && (
          <>
            <div className="mb-3">
              <label htmlFor="compressionRate" className="form-label">
                Compression Rate: {compressionRate}%
              </label>
              <input 
                type="range" 
                className="form-range" 
                id="compressionRate" 
                min="10" 
                max="100" 
                value={compressionRate} 
                onChange={handleCompressionRateChange} 
              />
            </div>

            <button 
              className="btn btn-primary w-100 mb-3"
              onClick={handleImageUpload}
              disabled={loading}
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
          </>
        )}
      </div>

      {compressedFile && (
        <div className="card mt-4 p-4 text-center">
          <h5 className="card-title">Compressed Image</h5>
          <img 
            src={URL.createObjectURL(compressedFile)} 
            alt="Compressed" 
            className="img-fluid mt-3" 
          />
          <button 
            className="btn btn-success mt-3" 
            onClick={downloadCompressedImage}
          >
            Download Compressed Image
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
