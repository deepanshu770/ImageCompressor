import React, { useState, useCallback, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  // State management
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [maxSizeMB, setMaxSizeMB] = useState(2);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    currentFile: '',
    percentage: 0
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const fileInputRef = useRef(null);

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/png'
    );
    
    if (imageFiles.length === 0) {
      showNotification('Please select valid JPG or PNG files', 'error');
      return;
    }

    if (imageFiles.length !== selectedFiles.length) {
      showNotification(`Filtered to ${imageFiles.length} valid image files`, 'warning');
    }

    setFiles(imageFiles);
    showNotification(`${imageFiles.length} file(s) selected`, 'success');
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  // File input handler
  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // Compress images and create ZIP
  const handleCompress = async () => {
    if (files.length === 0) {
      showNotification('Please select files first', 'error');
      return;
    }

    setIsProcessing(true);
    const zip = new JSZip();
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Update progress - showing current file being processed
          setProgress({
            current: i,
            total: files.length,
            currentFile: file.name,
            percentage: Math.round((i / files.length) * 100)
          });

          // Compression options - preserve file type for PNGs to maintain transparency
          const options = {
            maxSizeMB: maxSizeMB,
            maxWidthOrHeight: 4096,
            useWebWorker: true,
            initialQuality: compressionQuality,
            fileType: file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          };

          // Compress the image
          const compressedFile = await imageCompression(file, options);
          
          // Add to ZIP with original filename
          zip.file(file.name, compressedFile);
          successCount++;
          
          // Update progress after successful compression
          setProgress({
            current: i + 1,
            total: files.length,
            currentFile: file.name,
            percentage: Math.round(((i + 1) / files.length) * 100)
          });

        } catch (error) {
          console.error(`Error compressing ${file.name}:`, error);
          errors.push({ name: file.name, error: error.message });
          errorCount++;
          
          // Continue with next file even if one fails
          continue;
        }
      }

      // Generate ZIP file
      showNotification('Generating ZIP file...', 'info');
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      }, (metadata) => {
        // Update progress for ZIP generation
        setProgress(prev => ({
          ...prev,
          currentFile: 'Generating ZIP file...',
          percentage: Math.round(metadata.percent)
        }));
      });

      // Download the ZIP file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const zipFileName = `compressed-images-${timestamp}.zip`;
      saveAs(zipBlob, zipFileName);

      // Show success message
      const zipSize = formatFileSize(zipBlob.size);
      let message = `✓ Success! ${successCount} files compressed and downloaded as ${zipFileName} (${zipSize})`;
      
      if (errorCount > 0) {
        message += `\n⚠ ${errorCount} file(s) failed to compress`;
        console.error('Failed files:', errors);
      }
      
      showNotification(message, 'success');

    } catch (error) {
      console.error('Error during compression:', error);
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, currentFile: '', percentage: 0 });
    }
  };

  // Clear selected files
  const handleClear = () => {
    setFiles([]);
    setProgress({ current: 0, total: 0, currentFile: '', percentage: 0 });
    setNotification({ message: '', type: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate total size
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">📦 Image Compressor</h1>
        <p className="subtitle">Compress multiple JPG/PNG files and download as ZIP</p>

        {/* Compression Settings */}
        <div className="settings-panel">
          <h3>⚙️ Compression Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label htmlFor="quality">
                Quality: <strong>{Math.round(compressionQuality * 100)}%</strong>
              </label>
              <input
                id="quality"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                disabled={isProcessing}
              />
            </div>
            <div className="setting-item">
              <label htmlFor="maxSize">
                Max File Size: <strong>{maxSizeMB} MB</strong>
              </label>
              <input
                id="maxSize"
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={maxSizeMB}
                onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p className="drop-text">
              {files.length > 0 
                ? `${files.length} file(s) selected (${formatFileSize(totalSize)})`
                : 'Drag & drop images here'
              }
            </p>
            <p className="drop-subtext">or</p>
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileInputChange}
              disabled={isProcessing}
              style={{ display: 'none' }}
            />
            <label htmlFor="fileInput" className="file-button">
              Choose Files
            </label>
            <p className="file-types">JPG, PNG supported</p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list-container">
            <h3>Selected Files ({files.length})</h3>
            <div className="file-list">
              {files.slice(0, 10).map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
              ))}
              {files.length > 10 && (
                <div className="file-item more-files">
                  <span>...and {files.length - 10} more files</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        {isProcessing && (
          <div className="progress-container">
            <div className="progress-info">
              <p className="progress-text">
                Processing: {progress.current} / {progress.total} files
              </p>
              <p className="progress-percentage">{progress.percentage}%</p>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            {progress.currentFile && (
              <p className="current-file">Current: {progress.currentFile}</p>
            )}
          </div>
        )}

        {/* Notification */}
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={handleCompress}
            disabled={isProcessing || files.length === 0}
          >
            {isProcessing ? '⏳ Processing...' : '🗜️ Compress & Download ZIP'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={isProcessing || files.length === 0}
          >
            🗑️ Clear
          </button>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3>💡 Tips for Large Batches</h3>
          <ul>
            <li>Process up to 800+ files efficiently on localhost</li>
            <li>Lower quality = smaller file size & faster processing</li>
            <li>Max file size controls the target size for each compressed image</li>
            <li>Processing happens in your browser - no server needed</li>
            <li>Large batches may take several minutes to complete</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
